from pydantic import BaseModel

class CampaignCreate(BaseModel):
    title: str
    description: str
    goal: int
    private_key: str

class DonateRequest(BaseModel):
    amount: int
    private_key: str

class PromoteRequest(BaseModel):
    private_key: str

class TransactionResponse(BaseModel):
    tx_hash: str
    status: int

class CampaignOut(BaseModel):
    id: int
    title: str
    description: str
    goal: int
    funds: int
    owner: str
    promotions: int
    donors: list[str]
    status: str
    progress: float
