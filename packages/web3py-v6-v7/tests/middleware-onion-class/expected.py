"""v6 function middleware on onion -> v7 class instances."""

from web3 import Web3
from web3.middleware import (
    ENSNameToAddressMiddleware,
    PythonicMiddleware,
)

w3 = Web3()

w3.middleware_onion.add(PythonicMiddleware())
w3.middleware_onion.add(ENSNameToAddressMiddleware())
