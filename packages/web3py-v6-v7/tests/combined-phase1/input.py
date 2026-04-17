"""Both Phase-1 rules in one module."""

from web3 import Web3
from web3.providers import HTTPProvider, WebsocketProviderV2

w3 = Web3(HTTPProvider("http://127.0.0.1:8545", middlewares=[]))
ws = WebsocketProviderV2("wss://example.invalid")
