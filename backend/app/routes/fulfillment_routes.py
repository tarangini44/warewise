from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.order import Order
from app.models.order_item import OrderItem


router = APIRouter(
    prefix="/api/fulfillment",
    tags=["Fulfillment"]
)


@router.get("/")
def get_fulfillment_pipeline(
    db: Session = Depends(get_db)
):
    orders = db.query(Order).all()

    pipeline = {
        "CREATED": 0,
        "ALLOCATED": 0,
        "PICKING": 0,
        "PACKING": 0,
        "READY_TO_DISPATCH": 0,
        "DISPATCHED": 0,
    }

    order_details = []

    for order in orders:

        items = (
            db.query(OrderItem)
            .filter(OrderItem.order_id == order.id)
            .all()
        )

        total = sum(
            item.quantity for item in items
        )

        allocated = sum(
            item.allocated_quantity or 0
            for item in items
        )

        picked = sum(
            item.picked_quantity or 0
            for item in items
        )

        packed = sum(
            item.packed_quantity or 0
            for item in items
        )

        if total == 0:
            status = "CREATED"

        elif packed == total:
            status = "READY_TO_DISPATCH"

        elif picked > 0:
            status = "PICKING"

        elif allocated == total:
            status = "ALLOCATED"

        elif allocated > 0:
            status = "ALLOCATED"

        else:
            status = "CREATED"

        pipeline[status] += 1

        order_details.append({
            "order_number": order.order_number,
            "customer": order.customer_name,
            "status": status,
            "total_items": total,
            "allocated": allocated,
            "picked": picked,
            "packed": packed,
            "deadline": order.deadline,
        })

    return {
        "pipeline": pipeline,
        "orders": order_details,
    }