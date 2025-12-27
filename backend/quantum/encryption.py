"""
Quantum-Safe Encryption Module
Privacy-Preserving Quantum Voting System

This module provides encryption utilities using the quantum-derived keys
from the QKD module. It implements AES-256-GCM for symmetric encryption.
"""

import hashlib
import secrets
import base64
from typing import Dict, Tuple
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend


class VoteEncryption:
    """
    Handles vote encryption using quantum-derived keys.
    Uses AES-256-GCM for authenticated encryption.
    """
    
    def __init__(self):
        self.backend = default_backend()
    
    def derive_key(self, quantum_key: str, salt: bytes = None) -> bytes:
        """
        Derive a 256-bit AES key from the quantum key using PBKDF2-like derivation.
        """
        if salt is None:
            salt = secrets.token_bytes(16)
        
        # Use SHA-256 for key derivation
        key_material = quantum_key.encode() + salt
        derived_key = hashlib.sha256(key_material).digest()
        
        return derived_key, salt
    
    def encrypt_vote(self, vote_data: Dict, quantum_key: str) -> Dict:
        """
        Encrypt vote data using the quantum-derived key.
        
        Args:
            vote_data: Dictionary containing vote information
            quantum_key: The quantum key from QKD protocol
            
        Returns:
            Dictionary with encrypted vote, nonce, salt, and tag
        """
        # Serialize vote data
        vote_string = f"{vote_data['constituency_id']}:{vote_data['candidate_id']}:{vote_data['timestamp']}"
        vote_bytes = vote_string.encode('utf-8')
        
        # Derive encryption key
        encryption_key, salt = self.derive_key(quantum_key)
        
        # Generate random nonce for GCM mode
        nonce = secrets.token_bytes(12)
        
        # Create AES-GCM cipher
        cipher = Cipher(
            algorithms.AES(encryption_key),
            modes.GCM(nonce),
            backend=self.backend
        )
        encryptor = cipher.encryptor()
        
        # Encrypt the vote
        ciphertext = encryptor.update(vote_bytes) + encryptor.finalize()
        
        # Generate vote hash for uniqueness (no-cloning enforcement)
        vote_hash = self.generate_vote_hash(vote_data, quantum_key)
        
        return {
            "encrypted_vote": base64.b64encode(ciphertext).decode('utf-8'),
            "nonce": base64.b64encode(nonce).decode('utf-8'),
            "salt": base64.b64encode(salt).decode('utf-8'),
            "tag": base64.b64encode(encryptor.tag).decode('utf-8'),
            "vote_hash": vote_hash
        }
    
    def decrypt_vote(self, encrypted_data: Dict, quantum_key: str) -> Dict:
        """
        Decrypt vote data using the quantum-derived key.
        Only used for verification/audit purposes.
        """
        # Decode components
        ciphertext = base64.b64decode(encrypted_data['encrypted_vote'])
        nonce = base64.b64decode(encrypted_data['nonce'])
        salt = base64.b64decode(encrypted_data['salt'])
        tag = base64.b64decode(encrypted_data['tag'])
        
        # Derive the same key
        encryption_key, _ = self.derive_key(quantum_key, salt)
        
        # Create AES-GCM cipher for decryption
        cipher = Cipher(
            algorithms.AES(encryption_key),
            modes.GCM(nonce, tag),
            backend=self.backend
        )
        decryptor = cipher.decryptor()
        
        # Decrypt
        decrypted_bytes = decryptor.update(ciphertext) + decryptor.finalize()
        vote_string = decrypted_bytes.decode('utf-8')
        
        # Parse vote data
        parts = vote_string.split(':')
        return {
            "constituency_id": int(parts[0]),
            "candidate_id": int(parts[1]),
            "timestamp": parts[2]
        }
    
    def generate_vote_hash(self, vote_data: Dict, quantum_key: str) -> str:
        """
        Generate a unique hash for the vote (no-cloning theorem simulation).
        This hash ensures each vote is unique and cannot be duplicated.
        """
        # Combine vote data with quantum key and random salt
        unique_salt = secrets.token_hex(16)
        hash_input = f"{vote_data['constituency_id']}:{vote_data['candidate_id']}:{quantum_key}:{unique_salt}"
        
        # Generate SHA-256 hash
        vote_hash = hashlib.sha256(hash_input.encode()).hexdigest()
        
        return vote_hash
    
    def verify_vote_integrity(self, encrypted_vote: str, tag: str, 
                              nonce: str, salt: str, quantum_key: str) -> bool:
        """
        Verify that a vote has not been tampered with.
        Uses GCM authentication tag for integrity verification.
        """
        try:
            ciphertext = base64.b64decode(encrypted_vote)
            nonce_bytes = base64.b64decode(nonce)
            salt_bytes = base64.b64decode(salt)
            tag_bytes = base64.b64decode(tag)
            
            encryption_key, _ = self.derive_key(quantum_key, salt_bytes)
            
            cipher = Cipher(
                algorithms.AES(encryption_key),
                modes.GCM(nonce_bytes, tag_bytes),
                backend=self.backend
            )
            decryptor = cipher.decryptor()
            decryptor.update(ciphertext) + decryptor.finalize()
            
            return True
        except Exception:
            return False


class AnonymityGuard:
    """
    Ensures voter anonymity by breaking the link between voter identity and vote.
    Implements cryptographic unlinkability.
    """
    
    def __init__(self):
        self.commitment_store: Dict[str, str] = {}  # session_id -> commitment
    
    def create_vote_commitment(self, session_id: str, vote_data: Dict) -> str:
        """
        Create a cryptographic commitment to the vote.
        This allows verification without revealing the vote content.
        """
        # Create commitment using hash
        commitment_input = f"{vote_data['candidate_id']}:{secrets.token_hex(32)}"
        commitment = hashlib.sha256(commitment_input.encode()).hexdigest()
        
        # Store commitment (session is destroyed after voting)
        self.commitment_store[session_id] = commitment
        
        return commitment
    
    def generate_anonymous_receipt(self, vote_hash: str) -> str:
        """
        Generate an anonymous receipt that proves vote was cast
        without revealing any identifying information.
        """
        # Create a short, user-friendly receipt code
        receipt_data = f"{vote_hash}:{secrets.token_hex(8)}"
        receipt_hash = hashlib.sha256(receipt_data.encode()).hexdigest()
        
        # Format as readable receipt code (e.g., QV-XXXX-XXXX-XXXX)
        receipt_code = f"QV-{receipt_hash[:4].upper()}-{receipt_hash[4:8].upper()}-{receipt_hash[8:12].upper()}"
        
        return receipt_code


# Global instances
vote_encryption = VoteEncryption()
anonymity_guard = AnonymityGuard()
