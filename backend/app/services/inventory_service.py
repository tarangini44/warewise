from app.models.product import Product


def get_available_stock(product: Product) -> int:
    """
    Calculate stock that can actually be allocated.
    """
    return max(
        product.total_stock - product.reserved_stock,
        0
    )


def analyze_stock(product: Product) -> dict:
    """
    Analyze current inventory condition and generate
    an operational recommendation.
    """

    available = get_available_stock(product)

    if available == 0:
        status = "OUT_OF_STOCK"
        severity = "CRITICAL"
        recommendation = (
            "Stop new allocations and initiate replenishment."
        )

    elif available <= product.reorder_point:
        status = "LOW_STOCK"
        severity = "WARNING"
        recommendation = (
            "Create a replenishment recommendation."
        )

    else:
        status = "HEALTHY"
        severity = "NORMAL"
        recommendation = (
            "No immediate inventory action required."
        )

    return {
        "sku": product.sku,
        "product": product.name,
        "total_stock": product.total_stock,
        "reserved_stock": product.reserved_stock,
        "available_stock": available,
        "reorder_point": product.reorder_point,
        "status": status,
        "severity": severity,
        "recommendation": recommendation,
    }