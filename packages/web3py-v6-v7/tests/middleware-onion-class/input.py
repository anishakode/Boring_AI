"""v6 function middleware on onion -> v7 class instances."""

from web3 import Web3
from web3.middleware import (
    name_to_address_middleware,
    pythonic_middleware,
)

w3 = Web3()

w3.middleware_onion.add(pythonic_middleware)
w3.middleware_onion.add(name_to_address_middleware)
