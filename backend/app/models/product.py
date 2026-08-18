from sqlalchemy import Column, Integer, String, Float, Boolean
from app.database.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)

    total_stock = Column(Integer, default=0)
    reserved_stock = Column(Integer, default=0)
    reorder_point = Column(Integer, default=10)

    unit_price = Column(Float, default=0.0)
    location = Column(String, nullable=False)

    is_active = Column(Boolean, default=True)

    @property
    def available_stock(self):
        return self.total_stock - self.reserved_stock