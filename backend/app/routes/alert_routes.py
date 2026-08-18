from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.product import Product
from app.services.inventory_service import analyze_stock


router = APIRouter(
    prefix="/api/alerts",
    tags=["Alerts"]
)


@router.get("/")
def get_alerts(
    db: Session = Depends(get_db)
):
    products = db.query(Product).all()

    alerts = []

    for product in products:
        analysis = analyze_stock(product)

        if analysis["severity"] == "NORMAL":
            continue

        alerts.append({
            "sku": product.sku,
            "product": product.name,
            "status": analysis["status"],
            "severity": analysis["severity"],
            "available_stock": analysis["available_stock"],
            "reorder_point": analysis["reorder_point"],
            "recommendation": analysis["recommendation"],
        })

    alerts.sort(
        key=lambda x: (
            0 if x["severity"] == "CRITICAL" else 1
        )
    )

    return {
        "total_alerts": len(alerts),
        "alerts": alerts,
    }