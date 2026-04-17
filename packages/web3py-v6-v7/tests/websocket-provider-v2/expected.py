"""WebsocketProviderV2 -> WebSocketProvider (v7 rename)."""

from web3.providers import WebSocketProvider

URL = "wss://example.invalid"


def make_provider():
    return WebSocketProvider(URL)
