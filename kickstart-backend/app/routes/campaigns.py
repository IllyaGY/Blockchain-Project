from fastapi import APIRouter, HTTPException
from app.services.blockchain import contract, w3, build_tx, sign_and_send
from app.models import (
    CampaignCreate, DonateRequest, PromoteRequest,
    TransactionResponse, CampaignOut
)

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

@router.get("/", response_model=list[CampaignOut])
def list_campaigns():
    total = contract.functions.getCampaignCount().call()
    out = []
    for cid in range(1, total + 1):
        data = contract.functions.getCampaign(cid).call()
        title, desc, goal, funds, owner, promos, donors = data
        status = "completed" if funds >= goal else "active"
        progress = (funds * 100) / goal if goal > 0 else 0
        out.append(CampaignOut(
            id=cid, title=title, description=desc,
            goal=goal, funds=funds, owner=owner,
            promotions=promos, donors=donors,
            status=status, progress=progress
        ))
    return out

@router.get("/{campaign_id}", response_model=CampaignOut)
def get_campaign(campaign_id: int):
    try:
        data = contract.functions.getCampaign(campaign_id).call()
    except:
        raise HTTPException(status_code=404, detail="Not found")
    title, desc, goal, funds, owner, promos, donors = data
    status = "completed" if funds >= goal else "active"
    progress = (funds * 100) / goal if goal > 0 else 0
    return CampaignOut(
        id=campaign_id, title=title, description=desc,
        goal=goal, funds=funds, owner=owner,
        promotions=promos, donors=donors,
        status=status, progress=progress
    )

@router.post("/", response_model=TransactionResponse)
def create_campaign(body: CampaignCreate):
    acct = w3.eth.account.from_key(body.private_key)
    tx = build_tx(
        contract.functions.createCampaign(
            body.title, body.description, body.goal
        ),
        acct.address
    )
    receipt = sign_and_send(tx, body.private_key)
    return TransactionResponse(
        tx_hash=receipt.transactionHash.hex(),
        status=receipt.status
    )

@router.post("/{campaign_id}/donate", response_model=TransactionResponse)
def donate(campaign_id: int, body: DonateRequest):
    acct = w3.eth.account.from_key(body.private_key)
    tx = build_tx(
        contract.functions.donate(campaign_id),
        acct.address,
        value=body.amount
    )
    receipt = sign_and_send(tx, body.private_key)
    return TransactionResponse(
        tx_hash=receipt.transactionHash.hex(),
        status=receipt.status
    )

@router.post("/{campaign_id}/promote", response_model=TransactionResponse)
def promote(campaign_id: int, body: PromoteRequest):
    acct = w3.eth.account.from_key(body.private_key)
    tx = build_tx(
        contract.functions.promote(campaign_id),
        acct.address
    )
    receipt = sign_and_send(tx, body.private_key)
    return TransactionResponse(
        tx_hash=receipt.transactionHash.hex(),
        status=receipt.status
    )
