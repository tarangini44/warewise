from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.product import Product
from app.models.order import Order


router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"]
)


@router.get("/")
def get_warehouse_analytics(
    db: Session = Depends(get_db)
):
    products = db.query(Product).all()
    orders = db.query(Order).all()

    # -----------------------------
    # INVENTORY ANALYTICS
    # -----------------------------

    total_stock = sum(
        product.total_stock
        for product in products
    )

    total_reserved = sum(
        product.reserved_stock
        for product in products
    )

    total_available = sum(
        product.available_stock
        for product in products
    )

    low_stock = 0
    out_of_stock = 0

    for product in products:

        available = product.available_stock

        if available <= 0:
            out_of_stock += 1

        elif available <= product.reorder_point:
            low_stock += 1

    # -----------------------------
    # ORDER ANALYTICS
    # -----------------------------

    orders_by_status = {}

    for order in orders:
        status = order.status

        orders_by_status[status] = (
            orders_by_status.get(status, 0) + 1
        )

    orders_by_priority = {}

    for order in orders:
        priority = order.priority

        orders_by_priority[priority] = (
            orders_by_priority.get(priority, 0) + 1
        )

    total_orders = len(orders)

    completed_orders = sum(
        1
        for order in orders
        if order.status in [
            "DISPATCHED",
            "COMPLETED"
        ]
    )

    fulfillment_rate = (
        round(
            (completed_orders / total_orders) * 100,
            2
        )
        if total_orders > 0
        else 0
    )

    # -----------------------------
    # RESPONSE
    # -----------------------------

    return {
        "inventory": {
            "total_products": len(products),
            "total_stock": total_stock,
            "reserved_stock": total_reserved,
            "available_stock": total_available,
            "low_stock_products": low_stock,
            "out_of_stock_products": out_of_stock,
        },
        "orders": {
            "total_orders": total_orders,
            "completed_orders": completed_orders,
            "fulfillment_rate": fulfillment_rate,
            "by_status": orders_by_status,
            "by_priority": orders_by_priority,
        }
    }