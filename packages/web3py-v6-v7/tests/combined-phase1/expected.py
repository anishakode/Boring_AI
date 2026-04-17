"""Both Phase-1 rules in one module."""

from web3 import Web3
from web3.providers import HTTPProvider, WebSocketProvider

w3 = Web3(HTTPProvider("http://127.0.0.1:8545", middleware=[]))
ws = WebSocketProvider("wss://example.invalid")
