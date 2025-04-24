import os
from dotenv import load_dotenv
from web3 import Web3

load_dotenv()

PROVIDER_URL = os.getenv("PROVIDER_URL")
CONTRACT_ADDRESS = Web3.toChecksumAddress(os.getenv("CONTRACT_ADDRESS"))
ABI_PATH = os.getenv("CONTRACT_ABI_PATH", "contract/Kickstart.json")
