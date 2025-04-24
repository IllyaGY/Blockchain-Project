import json
from web3 import Web3
from app.config import PROVIDER_URL, CONTRACT_ADDRESS, ABI_PATH

w3 = Web3(Web3.HTTPProvider(PROVIDER_URL))
if not w3.isConnected():
    raise ConnectionError("Unable to connect to Ethereum node")

with open(ABI_PATH) as f:
    abi = json.load(f)

contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

def build_tx(fn_call, account_address: str, value: int = 0) -> dict:
    nonce = w3.eth.getTransactionCount(account_address)
    return fn_call.buildTransaction({
        "from": account_address,
        "value": value,
        "nonce": nonce,
        "gas": 2000000,
        "gasPrice": w3.toWei("20", "gwei"),
    })

def sign_and_send(tx: dict, private_key: str):
    signed = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.sendRawTransaction(signed.rawTransaction)
    receipt = w3.eth.waitForTransactionReceipt(tx_hash)
    return receipt
