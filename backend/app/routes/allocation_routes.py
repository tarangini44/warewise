from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem
from app.services.allocation_service import allocate_inventory


router = APIRouter(
    prefix="/api/allocation",
    tags=["Allocation"]
)


@router.get("/{sku}")
def run_allocation(
    sku: str,
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .filter(Product.sku == sku)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail=f"Product {sku} not found"
        )

    orders = db.query(Order).all()
    order_items = db.query(OrderItem).all()

    result = allocate_inventory(
        product,
        order_items,
        orders
    )

    return result