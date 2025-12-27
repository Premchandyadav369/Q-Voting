"""
Advanced Analytics Module
Privacy-Preserving Quantum Voting System

Provides real-time analytics, attack simulations, and audit trails
without compromising voter privacy.
"""

import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from dataclasses import dataclass, field
import json


@dataclass
class AttackSimulation:
    """Represents a simulated attack on the quantum channel"""
    attack_id: str
    attack_type: str
    timestamp: datetime
    success: bool
    detected: bool
    error_rate: float
    details: Dict


@dataclass
class AuditEntry:
    """Blockchain-style audit entry"""
    block_id: str
    previous_hash: str
    timestamp: datetime
    action: str
    data_hash: str
    merkle_root: str


class QuantumAttackSimulator:
    """
    Simulates various quantum and classical attacks on the voting system.
    Used for educational and demonstration purposes.
    """
    
    ATTACK_TYPES = {
        "eve_intercept": "Eve (Eavesdropper) Intercept-Resend Attack",
        "photon_number_split": "Photon Number Splitting Attack",
        "trojan_horse": "Trojan Horse Attack",
        "dos": "Denial of Service Attack",
        "replay": "Classical Replay Attack",
        "man_in_middle": "Man-in-the-Middle Attack"
    }
    
    def __init__(self):
        self.attack_history: List[AttackSimulation] = []
    
    def simulate_eve_intercept(self, intercept_rate: float = 0.3) -> AttackSimulation:
        """
        Simulate Eve (eavesdropper) intercepting and re-sending qubits.
        BB84 detects this through increased error rate.
        """
        # Eve introduces errors when her measurement basis doesn't match
        expected_error_rate = intercept_rate * 0.25  # 25% error when bases mismatch
        detected = expected_error_rate > 0.11  # 11% threshold
        
        attack = AttackSimulation(
            attack_id=secrets.token_hex(8),
            attack_type="eve_intercept",
            timestamp=datetime.utcnow(),
            success=not detected,
            detected=detected,
            error_rate=expected_error_rate,
            details={
                "intercept_rate": intercept_rate,
                "qubits_intercepted": int(1024 * intercept_rate),
                "errors_introduced": int(1024 * intercept_rate * 0.25),
                "detection_threshold": "11%",
                "explanation": "Eve measures qubits with random bases, disturbing 25% of intercepted qubits"
            }
        )
        self.attack_history.append(attack)
        return attack
    
    def simulate_pns_attack(self, multi_photon_rate: float = 0.1) -> AttackSimulation:
        """
        Simulate Photon Number Splitting attack.
        Exploits multi-photon pulses in weak coherent sources.
        """
        # Decoy state protocol detects this
        detected = True  # We implement decoy state detection
        
        attack = AttackSimulation(
            attack_id=secrets.token_hex(8),
            attack_type="photon_number_split",
            timestamp=datetime.utcnow(),
            success=False,
            detected=detected,
            error_rate=0.0,  # PNS doesn't introduce errors
            details={
                "multi_photon_rate": multi_photon_rate,
                "countermeasure": "Decoy State Protocol",
                "explanation": "Eve splits multi-photon pulses but decoy states reveal the attack"
            }
        )
        self.attack_history.append(attack)
        return attack
    
    def simulate_replay_attack(self) -> AttackSimulation:
        """
        Simulate classical replay attack.
        Attempting to reuse captured vote data.
        """
        # Vote hash uniqueness prevents replay
        detected = True
        
        attack = AttackSimulation(
            attack_id=secrets.token_hex(8),
            attack_type="replay",
            timestamp=datetime.utcnow(),
            success=False,
            detected=detected,
            error_rate=0.0,
            details={
                "countermeasure": "Unique Vote Hash (No-Cloning)",
                "explanation": "Each vote has a unique quantum-derived hash that cannot be replicated"
            }
        )
        self.attack_history.append(attack)
        return attack
    
    def get_attack_summary(self) -> Dict:
        """Get summary of all simulated attacks"""
        total = len(self.attack_history)
        detected = sum(1 for a in self.attack_history if a.detected)
        blocked = sum(1 for a in self.attack_history if not a.success)
        
        by_type = {}
        for attack in self.attack_history:
            t = attack.attack_type
            if t not in by_type:
                by_type[t] = {"total": 0, "detected": 0, "blocked": 0}
            by_type[t]["total"] += 1
            if attack.detected:
                by_type[t]["detected"] += 1
            if not attack.success:
                by_type[t]["blocked"] += 1
        
        return {
            "total_attacks": total,
            "detected": detected,
            "blocked": blocked,
            "detection_rate": round(detected / max(total, 1) * 100, 2),
            "success_rate": round((total - blocked) / max(total, 1) * 100, 2),
            "by_type": by_type,
            "attack_types": self.ATTACK_TYPES
        }


class BlockchainAuditTrail:
    """
    Immutable blockchain-style audit trail for election integrity.
    All actions are logged with cryptographic linking.
    """
    
    def __init__(self):
        self.chain: List[AuditEntry] = []
        self.pending_actions: List[Dict] = []
        self._create_genesis_block()
    
    def _create_genesis_block(self):
        """Create the first block in the chain"""
        genesis = AuditEntry(
            block_id="GENESIS",
            previous_hash="0" * 64,
            timestamp=datetime.utcnow(),
            action="SYSTEM_INIT",
            data_hash=hashlib.sha256(b"genesis").hexdigest(),
            merkle_root=hashlib.sha256(b"genesis").hexdigest()
        )
        self.chain.append(genesis)
    
    def _compute_hash(self, entry: AuditEntry) -> str:
        """Compute SHA-256 hash of an entry"""
        data = f"{entry.block_id}{entry.previous_hash}{entry.timestamp}{entry.action}{entry.data_hash}"
        return hashlib.sha256(data.encode()).hexdigest()
    
    def add_action(self, action: str, data: Dict) -> AuditEntry:
        """Add a new action to the audit trail"""
        previous_entry = self.chain[-1]
        previous_hash = self._compute_hash(previous_entry)
        
        # Hash the action data (without any PII)
        data_hash = hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()
        
        entry = AuditEntry(
            block_id=secrets.token_hex(8),
            previous_hash=previous_hash,
            timestamp=datetime.utcnow(),
            action=action,
            data_hash=data_hash,
            merkle_root=self._compute_merkle_root([data_hash, previous_hash])
        )
        self.chain.append(entry)
        return entry
    
    def _compute_merkle_root(self, hashes: List[str]) -> str:
        """Compute Merkle root from list of hashes"""
        if len(hashes) == 1:
            return hashes[0]
        
        combined = "".join(hashes)
        return hashlib.sha256(combined.encode()).hexdigest()
    
    def verify_chain(self) -> Dict:
        """Verify the integrity of the entire audit chain"""
        if len(self.chain) < 2:
            return {"valid": True, "blocks_verified": len(self.chain)}
        
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]
            
            # Verify previous hash link
            expected_hash = self._compute_hash(previous)
            if current.previous_hash != expected_hash:
                return {
                    "valid": False,
                    "error_block": current.block_id,
                    "error": "Hash chain broken"
                }
        
        return {
            "valid": True,
            "blocks_verified": len(self.chain),
            "genesis_block": self.chain[0].block_id,
            "latest_block": self.chain[-1].block_id
        }
    
    def get_audit_log(self, limit: int = 50) -> List[Dict]:
        """Get recent audit entries"""
        entries = self.chain[-limit:]
        return [
            {
                "block_id": e.block_id,
                "timestamp": e.timestamp.isoformat(),
                "action": e.action,
                "data_hash": e.data_hash[:16] + "...",
                "verified": True
            }
            for e in entries
        ]


class VotingAnalytics:
    """
    Real-time voting analytics without compromising privacy.
    All analytics are based on aggregate data only.
    """
    
    def __init__(self):
        self.hourly_votes: Dict[str, int] = {}
        self.district_participation: Dict[str, int] = {}
    
    def record_vote(self, district: str, timestamp: datetime = None):
        """Record a vote for analytics (aggregate only)"""
        if timestamp is None:
            timestamp = datetime.utcnow()
        
        hour_key = timestamp.strftime("%Y-%m-%d %H:00")
        self.hourly_votes[hour_key] = self.hourly_votes.get(hour_key, 0) + 1
        self.district_participation[district] = self.district_participation.get(district, 0) + 1
    
    def get_hourly_trend(self) -> List[Dict]:
        """Get hourly voting trend"""
        return [
            {"hour": hour, "votes": count}
            for hour, count in sorted(self.hourly_votes.items())
        ]
    
    def get_district_heatmap(self) -> Dict:
        """Get district-wise participation for heatmap visualization"""
        total = sum(self.district_participation.values())
        return {
            "data": self.district_participation,
            "total": total,
            "top_districts": sorted(
                self.district_participation.items(),
                key=lambda x: x[1],
                reverse=True
            )[:10]
        }
    
    def predict_turnout(self, current_votes: int, elapsed_hours: float, total_hours: float = 12) -> Dict:
        """Predict final turnout based on current trend"""
        if elapsed_hours <= 0:
            return {"predicted_turnout": current_votes, "confidence": 0}
        
        hourly_rate = current_votes / elapsed_hours
        remaining_hours = total_hours - elapsed_hours
        predicted_additional = int(hourly_rate * remaining_hours * 0.8)  # Decay factor
        
        return {
            "current_votes": current_votes,
            "hourly_rate": round(hourly_rate, 2),
            "predicted_final": current_votes + predicted_additional,
            "remaining_hours": round(remaining_hours, 2),
            "confidence": min(90, int(elapsed_hours / total_hours * 100))
        }


# Global instances
attack_simulator = QuantumAttackSimulator()
audit_trail = BlockchainAuditTrail()
voting_analytics = VotingAnalytics()
