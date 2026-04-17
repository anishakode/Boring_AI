"""Factory-style geth_poa_middleware must not be renamed (v6 pattern)."""

from web3 import Web3
from web3.middleware import geth_poa_middleware

w3 = Web3()


def build_mw(make_request):
    return geth_poa_middleware(make_request, w3)
