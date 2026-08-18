from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.database.database import get_db
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem
from app.services.inventory_service import analyze_stock


router = APIRouter(
    prefix="/api/exceptions",
    tags=["Exceptions"]
)


@router.get("/")
def get_exceptions(
    db: Session = Depends(get_db)
):
    exceptions = []

    # -----------------------------
    # INVENTORY EXCEPTIONS
    # -----------------------------

    products = db.query(Product).all()

    for product in products:
        analysis = analyze_stock(product)

        if analysis["severity"] == "NORMAL":
            continue

        exceptions.append({
            "type": "INVENTORY",
            "severity": analysis["severity"],
            "sku": product.sku,
            "reference": product.name,
            "message": analysis["recommendation"],
        })

    # -----------------------------
    # ORDER EXCEPTIONS
    # -----------------------------

    orders = db.query(Order).all()

    for order in orders:

        items = (
            db.query(OrderItem)
            .filter(OrderItem.order_id == order.id)
            .all()
        )

        total_required = sum(
            item.quantity for item in items
        )

        total_allocated = sum(
            item.allocated_quantity or 0
            for item in items
        )

        # Allocation shortage
        if total_allocated < total_required:

            shortage = total_required - total_allocated

            exceptions.append({
                "type": "ORDER_ALLOCATION",
                "severity": "CRITICAL"
                if order.priority == "URGENT"
                else "WARNING",
                "order_number": order.order_number,
                "reference": order.customer_name,
                "message": (
                    f"Order has {shortage} "
                    f"unallocated item(s)."
                ),
            })

        # Deadline exception
        if order.deadline:

            deadline = order.deadline

            if deadline < datetime.utcnow():

                exceptions.append({
                    "type": "DEADLINE",
                    "severity": "CRITICAL",
                    "order_number": order.order_number,
                    "reference": order.customer_name,
                    "message": (
                        "Order deadline has passed."
                    ),
                })

    # Critical exceptions first
    exceptions.sort(
        key=lambda x: (
            0 if x["severity"] == "CRITICAL" else 1
        )
    )

    return {
        "total_exceptions": len(exceptions),
        "exceptions": exceptions,
    }