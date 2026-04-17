"""CamelCase RPC kwargs -> snake_case (v7), excluding dict() ctor."""

from web3 import Web3
from web3.providers import HTTPProvider, WebSocketProvider


def get_logs(**kwargs):
    return kwargs


w3 = Web3(HTTPProvider("http://127.0.0.1:8545", middleware=[]))
ws = WebSocketProvider("wss://x")

# Method-style kwargs (should rename)
get_logs(from_block=1, to_block=2, block_hash=b"abc")

# dict() must keep camelCase parameter names (they become RPC keys)
rpc_filter = dict(fromBlock="0x1", toBlock="0x2")
