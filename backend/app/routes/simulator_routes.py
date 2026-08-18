from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.product import Product


router = APIRouter(
    prefix="/api/simulator",
    tags=["Simulator"]
)


@router.get("/{sku}")
def simulate_demand(
    sku: str,
    demand_increase: int = Query(
        0,
        ge=0,
        description="Additional demand to simulate"
    ),
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .filter(Product.sku == sku)
        .first()
    )

    if not product:
        return {
            "error": f"Product {sku} not found"
        }

    current_stock = product.available_stock

    simulated_demand = demand_increase

    shortage = max(
        simulated_demand - current_stock,
        0
    )

    remaining_stock = max(
        current_stock - simulated_demand,
        0
    )

    if shortage > 0:
        result = "STOCK_SHORTAGE"
        recommendation = (
            "Increase replenishment before accepting "
            "additional demand."
        )

    elif remaining_stock <= product.reorder_point:
        result = "LOW_STOCK_RISK"
        recommendation = (
            "Demand can be fulfilled, but "
            "replenishment is recommended."
        )

    else:
        result = "HEALTHY"
        recommendation = (
            "Demand can be fulfilled without "
            "immediate replenishment."
        )

    return {
        "sku": product.sku,
        "product": product.name,
        "current_available_stock": current_stock,
        "additional_demand": simulated_demand,
        "remaining_stock": remaining_stock,
        "shortage": shortage,
        "result": result,
        "recommendation": recommendation,
    }