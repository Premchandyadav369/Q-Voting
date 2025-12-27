"""
Routes module initialization
"""

from .auth import router as auth_router
from .voting import router as voting_router
from .results import router as results_router

__all__ = ["auth_router", "voting_router", "results_router"]
