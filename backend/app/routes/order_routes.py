from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.order import Order
from app.services.order_service import analyze_order


router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"]
)


@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).all()

    return [
        analyze_order(order)
        for order in orders
    ]


@router.get("/{order_number}")
def get_order(order_number: str, db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .filter(Order.order_number == order_number)
        .first()
    )

    if not order:
        return {
            "error": "Order not found"
        }

    return analyze_order(order)