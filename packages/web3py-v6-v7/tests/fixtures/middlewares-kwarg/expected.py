"""Fixture: middlewares= kwarg should become middleware=."""

from web3 import Web3
from web3.providers import HTTPProvider

# JSON-RPC style dict must keep camelCase keys (v7 guide); untouched by kwarg rule
FILTER = {
    "fromBlock": "0x1",
    "toBlock": "0x2",
}

w3 = Web3(HTTPProvider("http://127.0.0.1:8545", middleware=[]))
