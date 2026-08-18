from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    order_number = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    customer_name = Column(String, nullable=False)

    priority = Column(
        String,
        default="NORMAL",
        nullable=False
    )

    status = Column(
        String,
        default="CREATED",
        nullable=False
    )

    deadline = Column(DateTime, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    total_items = Column(Integer, default=0)