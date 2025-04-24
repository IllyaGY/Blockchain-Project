from fastapi import FastAPI
from app.routes.campaigns import router as campaigns_router

app = FastAPI(
    title="Decentralized Kickstart API",
    description="Create, donate to, promote and track campaigns via crypto wallets",
    version="1.0.0"
)

app.include_router(campaigns_router)
