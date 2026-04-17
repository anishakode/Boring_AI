"""CamelCase RPC kwargs -> snake_case (v7), excluding dict() ctor."""

from web3 import Web3
from web3.providers import HTTPProvider, WebsocketProviderV2


def get_logs(**kwargs):
    return kwargs


w3 = Web3(HTTPProvider("http://127.0.0.1:8545", middlewares=[]))
ws = WebsocketProviderV2("wss://x")

# Method-style kwargs (should rename)
get_logs(fromBlock=1, toBlock=2, blockHash=b"abc")

# dict() must keep camelCase parameter names (they become RPC keys)
rpc_filter = dict(fromBlock="0x1", toBlock="0x2")
