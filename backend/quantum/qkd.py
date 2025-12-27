"""
Quantum Key Distribution (BB84) Simulation Module
Privacy-Preserving Quantum Voting System

This module simulates the BB84 quantum key distribution protocol
for secure key exchange between voter and server.

Note: This is an educational simulation, not actual quantum computing.
"""

import secrets
import hashlib
import random
from typing import Tuple, List, Dict
from dataclasses import dataclass
from enum import Enum


class Basis(Enum):
    """Measurement basis for quantum bits"""
    RECTILINEAR = "+"  # |0⟩, |1⟩
    DIAGONAL = "×"     # |+⟩, |-⟩


class QubitState(Enum):
    """Possible qubit states"""
    ZERO = "|0⟩"
    ONE = "|1⟩"
    PLUS = "|+⟩"
    MINUS = "|-⟩"


@dataclass
class QuantumBit:
    """Represents a quantum bit with state and basis"""
    value: int  # 0 or 1
    basis: Basis
    
    @property
    def state(self) -> QubitState:
        if self.basis == Basis.RECTILINEAR:
            return QubitState.ZERO if self.value == 0 else QubitState.ONE
        else:
            return QubitState.PLUS if self.value == 0 else QubitState.MINUS


class BB84Protocol:
    """
    BB84 Quantum Key Distribution Protocol Simulation
    
    This simulates the famous BB84 protocol developed by Bennett and Brassard in 1984.
    It allows two parties to create a shared secret key while detecting any eavesdropping.
    """
    
    def __init__(self, key_length: int = 256):
        self.key_length = key_length
        self.raw_key_length = key_length * 2  # Optimized: reduced from 4x for faster processing
        self.eavesdropping_threshold = 0.11  # 11% error rate indicates eavesdropping
        
    def generate_random_bits(self, length: int) -> List[int]:
        """Generate cryptographically secure random bits"""
        return [secrets.randbelow(2) for _ in range(length)]
    
    def generate_random_bases(self, length: int) -> List[Basis]:
        """Generate random measurement bases"""
        return [random.choice([Basis.RECTILINEAR, Basis.DIAGONAL]) for _ in range(length)]
    
    def prepare_qubits(self, bits: List[int], bases: List[Basis]) -> List[QuantumBit]:
        """Alice prepares qubits in random states using random bases"""
        return [QuantumBit(value=b, basis=basis) for b, basis in zip(bits, bases)]
    
    def measure_qubits(self, qubits: List[QuantumBit], measurement_bases: List[Basis]) -> List[int]:
        """
        Bob measures qubits using his randomly chosen bases.
        If bases match, measurement is deterministic.
        If bases don't match, measurement is random (50/50).
        """
        results = []
        for qubit, measure_basis in zip(qubits, measurement_bases):
            if qubit.basis == measure_basis:
                # Bases match - deterministic result
                results.append(qubit.value)
            else:
                # Bases don't match - random result (quantum uncertainty)
                results.append(secrets.randbelow(2))
        return results
    
    def sift_keys(self, alice_bits: List[int], bob_bits: List[int],
                  alice_bases: List[Basis], bob_bases: List[Basis]) -> Tuple[List[int], List[int]]:
        """
        Sift keys by keeping only bits where Alice and Bob used the same basis.
        This is done over a classical (but authenticated) channel.
        """
        alice_sifted = []
        bob_sifted = []
        
        for i in range(len(alice_bits)):
            if alice_bases[i] == bob_bases[i]:
                alice_sifted.append(alice_bits[i])
                bob_sifted.append(bob_bits[i])
        
        return alice_sifted, bob_sifted
    
    def estimate_error_rate(self, alice_key: List[int], bob_key: List[int], 
                            sample_size: int = 25) -> float:
        """
        Estimate error rate by comparing a sample of bits.
        High error rate (>11%) indicates potential eavesdropping.
        """
        if len(alice_key) < sample_size:
            sample_size = len(alice_key) // 2
        
        if sample_size == 0:
            return 0.0
            
        # Select random positions to compare
        positions = random.sample(range(len(alice_key)), sample_size)
        errors = sum(1 for pos in positions if alice_key[pos] != bob_key[pos])
        
        return errors / sample_size
    
    def simulate_eavesdropping(self, qubits: List[QuantumBit], 
                               intercept_rate: float = 0.0) -> Tuple[List[QuantumBit], bool]:
        """
        Simulate an eavesdropper (Eve) intercepting qubits.
        Eve measures and re-sends, introducing detectable errors.
        """
        was_intercepted = False
        modified_qubits = []
        
        for qubit in qubits:
            if random.random() < intercept_rate:
                was_intercepted = True
                # Eve measures with random basis
                eve_basis = random.choice([Basis.RECTILINEAR, Basis.DIAGONAL])
                if eve_basis != qubit.basis:
                    # Eve's measurement disturbs the qubit
                    new_value = secrets.randbelow(2)
                    modified_qubits.append(QuantumBit(value=new_value, basis=qubit.basis))
                else:
                    modified_qubits.append(qubit)
            else:
                modified_qubits.append(qubit)
        
        return modified_qubits, was_intercepted
    
    def generate_shared_key(self, simulate_eve: bool = False, 
                            eve_intercept_rate: float = 0.3) -> Dict:
        """
        Execute the full BB84 protocol to generate a shared key.
        
        Returns:
            Dict containing:
            - shared_key: The final shared secret key (hex string)
            - key_bits: Number of bits in the key
            - error_rate: Estimated error rate
            - eavesdropping_detected: Whether eavesdropping was detected
            - protocol_steps: List of protocol steps for visualization
        """
        protocol_steps = []
        
        # Step 1: Alice generates random bits and bases
        alice_bits = self.generate_random_bits(self.raw_key_length)
        alice_bases = self.generate_random_bases(self.raw_key_length)
        protocol_steps.append({
            "step": 1,
            "name": "Quantum Bit Preparation",
            "description": f"Generated {self.raw_key_length} quantum bits with random polarization",
            "status": "complete"
        })
        
        # Step 2: Alice prepares qubits
        qubits = self.prepare_qubits(alice_bits, alice_bases)
        protocol_steps.append({
            "step": 2,
            "name": "Quantum Channel Transmission",
            "description": "Transmitting qubits through quantum channel",
            "status": "complete"
        })
        
        # Step 3: Simulate eavesdropping if enabled
        eve_intercepted = False
        if simulate_eve:
            qubits, eve_intercepted = self.simulate_eavesdropping(qubits, eve_intercept_rate)
        
        # Step 4: Bob generates random measurement bases and measures
        bob_bases = self.generate_random_bases(self.raw_key_length)
        bob_bits = self.measure_qubits(qubits, bob_bases)
        protocol_steps.append({
            "step": 3,
            "name": "Quantum Measurement",
            "description": "Measuring qubits with random bases",
            "status": "complete"
        })
        
        # Step 5: Sift keys (keep only matching bases)
        alice_sifted, bob_sifted = self.sift_keys(alice_bits, bob_bits, alice_bases, bob_bases)
        protocol_steps.append({
            "step": 4,
            "name": "Basis Reconciliation",
            "description": f"Sifted to {len(alice_sifted)} bits with matching bases",
            "status": "complete"
        })
        
        # Step 6: Error estimation
        error_rate = self.estimate_error_rate(alice_sifted, bob_sifted)
        eavesdropping_detected = error_rate > self.eavesdropping_threshold
        
        protocol_steps.append({
            "step": 5,
            "name": "Security Verification",
            "description": f"Error rate: {error_rate:.2%}" + 
                          (" ⚠️ EAVESDROPPING DETECTED!" if eavesdropping_detected else " ✅ Channel secure"),
            "status": "warning" if eavesdropping_detected else "complete"
        })
        
        # Step 7: Generate final key (use first key_length bits)
        final_key_bits = alice_sifted[:self.key_length]
        
        # Convert bits to bytes then to hex string
        if len(final_key_bits) >= 8:
            key_bytes = bytes([
                int(''.join(map(str, final_key_bits[i:i+8])), 2)
                for i in range(0, len(final_key_bits) - len(final_key_bits) % 8, 8)
            ])
            shared_key = key_bytes.hex()
        else:
            shared_key = hashlib.sha256(str(final_key_bits).encode()).hexdigest()
        
        protocol_steps.append({
            "step": 6,
            "name": "Key Finalization",
            "description": f"Generated {len(shared_key) * 4}-bit secure key",
            "status": "complete"
        })
        
        return {
            "shared_key": shared_key,
            "key_bits": len(shared_key) * 4,
            "error_rate": error_rate,
            "eavesdropping_detected": eavesdropping_detected,
            "eve_was_present": eve_intercepted if simulate_eve else False,
            "protocol_steps": protocol_steps,
            "channel_secure": not eavesdropping_detected
        }


class QuantumKeyManager:
    """
    Manages quantum keys for voter sessions.
    Each voter session gets a unique quantum-generated key.
    """
    
    def __init__(self):
        self.active_keys: Dict[str, str] = {}
        self.protocol = BB84Protocol(key_length=256)
    
    def generate_session_key(self, session_id: str, simulate_attack: bool = False) -> Dict:
        """Generate a new quantum key for a voter session"""
        result = self.protocol.generate_shared_key(
            simulate_eve=simulate_attack,
            eve_intercept_rate=0.3 if simulate_attack else 0.0
        )
        
        if result["channel_secure"]:
            self.active_keys[session_id] = result["shared_key"]
        
        return result
    
    def get_session_key(self, session_id: str) -> str | None:
        """Retrieve the quantum key for a session"""
        return self.active_keys.get(session_id)
    
    def invalidate_session(self, session_id: str) -> bool:
        """Invalidate a session key after use"""
        if session_id in self.active_keys:
            del self.active_keys[session_id]
            return True
        return False
    
    def get_active_sessions_count(self) -> int:
        """Get count of active quantum sessions"""
        return len(self.active_keys)


# Global instance
quantum_key_manager = QuantumKeyManager()
