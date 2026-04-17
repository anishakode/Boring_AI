"""construct_sign_and_send_raw_middleware -> SignAndSendRawMiddlewareBuilder."""

from web3 import Web3
from web3.middleware import construct_sign_and_send_raw_middleware

w3 = Web3()
pk = b"\x01" * 32

w3.middleware_onion.add(construct_sign_and_send_raw_middleware(pk))
