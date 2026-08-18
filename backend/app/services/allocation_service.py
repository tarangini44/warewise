from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product

from app.services.order_service import calculate_priority_score
from app.services.inventory_service import get_available_stock


def allocate_inventory(product: Product, order_items: list[OrderItem], orders: list[Order]):
    """
    Determine how available inventory should be allocated
    among competing orders.
    """

    available_stock = get_available_stock(product)

    order_map = {order.id: order for order in orders}

    competing_orders = []

    for item in order_items:

        if item.product_id != product.id:
            continue

        order = order_map.get(item.order_id)

        if not order:
            continue

        remaining_quantity = (
            item.quantity - item.allocated_quantity
        )

        if remaining_quantity <= 0:
            continue

        competing_orders.append({
            "order": order,
            "item": item,
            "required": remaining_quantity,
            "priority_score": calculate_priority_score(order),
        })

    # Highest priority first.
    # If priority is equal, earlier deadline comes first.
    competing_orders.sort(
        key=lambda x: (
            -x["priority_score"],
            x["order"].deadline
        )
    )

    decisions = []

    remaining_stock = available_stock

    for entry in competing_orders:

        order = entry["order"]
        required = entry["required"]

        allocated = min(
            required,
            remaining_stock
        )

        shortage = required - allocated

        if allocated == required:
            decision = "FULL_ALLOCATION"

        elif allocated > 0:
            decision = "PARTIAL_ALLOCATION"

        else:
            decision = "NO_ALLOCATION"

        decisions.append({
            "order_number": order.order_number,
            "priority": order.priority,
            "required": required,
            "allocated": allocated,
            "shortage": shortage,
            "decision": decision,
        })

        remaining_stock -= allocated

    return {
        "sku": product.sku,
        "product": product.name,
        "available_stock": available_stock,
        "remaining_stock": remaining_stock,
        "decisions": decisions,
    }