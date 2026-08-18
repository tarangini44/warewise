from app.models.order import Order


PRIORITY_SCORE = {
    "URGENT": 4,
    "HIGH": 3,
    "NORMAL": 2,
    "LOW": 1,
}


def calculate_priority_score(order: Order) -> int:
    """
    Convert an order priority into a numeric score.
    Higher score = higher operational priority.
    """
    return PRIORITY_SCORE.get(order.priority, 1)


def analyze_order(order: Order) -> dict:
    """
    Analyze an order and determine its operational priority.
    """

    priority_score = calculate_priority_score(order)

    return {
        "order_number": order.order_number,
        "customer": order.customer_name,
        "priority": order.priority,
        "priority_score": priority_score,
        "status": order.status,
        "deadline": order.deadline,
        "total_items": order.total_items,
    }