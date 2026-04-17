"""Already inject(...) — only replace inner construct call."""

from web3 import Web3
from web3.middleware import construct_sign_and_send_raw_middleware

w3 = Web3()
w3.middleware_onion.inject(construct_sign_and_send_raw_middleware(42), layer=0)
