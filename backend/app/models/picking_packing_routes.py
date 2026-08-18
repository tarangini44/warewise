from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.order import Order
from app.models.order_item import OrderItem


router = APIRouter(
    prefix="/api/picking-packing",
    tags=["Picking & Packing"]
)


@router.get("/")
def get_picking_packing_queue(
    db: Session = Depends(get_db)
):
    orders = db.query(Order).all()

    result = []

    for order in orders:
        items = (
            db.query(OrderItem)
            .filter(OrderItem.order_id == order.id)
            .all()
        )

        total_items = sum(
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

        if packed == total_items and total_items > 0:
            workflow_status = "PACKED"

        elif picked == total_items and total_items > 0:
            workflow_status = "READY_FOR_PACKING"

        elif picked > 0:
            workflow_status = "PICKING"

        elif allocated > 0:
            workflow_status = "READY_FOR_PICKING"

        else:
            workflow_status = "WAITING_ALLOCATION"

        result.append({
            "order_number": order.order_number,
            "customer": order.customer_name,
            "total_items": total_items,
            "allocated": allocated,
            "picked": picked,
            "packed": packed,
            "status": workflow_status,
            "deadline": order.deadline,
        })

    return result