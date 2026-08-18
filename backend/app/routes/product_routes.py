from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.product import Product
from app.services.inventory_service import analyze_stock


router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)


@router.get("/")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()

    return [
        analyze_stock(product)
        for product in products
    ]


@router.get("/{sku}")
def get_product(sku: str, db: Session = Depends(get_db)):
    product = (
        db.query(Product)
        .filter(Product.sku == sku)
        .first()
    )

    if not product:
        return {
            "error": "Product not found"
        }

    return analyze_stock(product)