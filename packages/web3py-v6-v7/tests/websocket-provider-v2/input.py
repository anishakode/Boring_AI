"""WebsocketProviderV2 -> WebSocketProvider (v7 rename)."""

from web3.providers import WebsocketProviderV2

URL = "wss://example.invalid"


def make_provider():
    return WebsocketProviderV2(URL)
