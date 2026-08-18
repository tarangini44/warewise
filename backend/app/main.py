from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine

from app.routes.product_routes import router as product_router
from app.routes.order_routes import router as order_router
from app.routes.allocation_routes import router as allocation_router
from app.routes.picking_packing_routes import (
    router as picking_packing_router
)
from app.routes.fulfillment_routes import (
    router as fulfillment_router
)
from app.routes.alert_routes import router as alert_router
from app.routes.exception_routes import (
    router as exception_router
)
from app.routes.analytics_routes import (
    router as analytics_router
)
from app.routes.simulator_routes import (
    router as simulator_router
)


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title="WareWise API",
    description="Smart Warehouse Operations & Decision Support System",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routes
app.include_router(product_router)
app.include_router(order_router)
app.include_router(allocation_router)
app.include_router(picking_packing_router)
app.include_router(fulfillment_router)
app.include_router(alert_router)
app.include_router(exception_router)
app.include_router(analytics_router)
app.include_router(simulator_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to WareWise",
        "status": "operational",
        "version": "1.0.0",
    }