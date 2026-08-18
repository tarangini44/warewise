from datetime import datetime, timedelta

from app.database.database import SessionLocal
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.inventory_movement import InventoryMovement


def seed_database():
    db = SessionLocal()

    try:
        # Prevent duplicate seed data
        if db.query(Product).first():
            print("Database already contains data.")
            return

        # ============================================================
        # PRODUCTS
        # ============================================================

        products = [
            Product(
                sku="WH-101",
                name="Wireless Keyboard",
                category="Electronics",
                total_stock=50,
                reserved_stock=12,
                reorder_point=15,
                unit_price=1499.00,
                location="A-01-01",
            ),
            Product(
                sku="WH-102",
                name="Wireless Mouse",
                category="Electronics",
                total_stock=120,
                reserved_stock=25,
                reorder_point=30,
                unit_price=799.00,
                location="A-01-02",
            ),
            Product(
                sku="WH-103",
                name="USB-C Hub",
                category="Accessories",
                total_stock=35,
                reserved_stock=20,
                reorder_point=20,
                unit_price=1299.00,
                location="A-02-01",
            ),
            Product(
                sku="WH-104",
                name="Bluetooth Headphones",
                category="Electronics",
                total_stock=7,
                reserved_stock=0,
                reorder_point=15,
                unit_price=2499.00,
                location="A-02-02",
            ),
            Product(
                sku="WH-105",
                name="Laptop Stand",
                category="Accessories",
                total_stock=60,
                reserved_stock=10,
                reorder_point=20,
                unit_price=999.00,
                location="B-01-01",
            ),
            Product(
                sku="WH-106",
                name="Mechanical Keyboard",
                category="Electronics",
                total_stock=0,
                reserved_stock=0,
                reorder_point=10,
                unit_price=3499.00,
                location="B-01-02",
            ),
            Product(
                sku="WH-107",
                name="Webcam",
                category="Electronics",
                total_stock=18,
                reserved_stock=5,
                reorder_point=12,
                unit_price=2199.00,
                location="B-02-01",
            ),
            Product(
                sku="WH-108",
                name="Portable SSD 1TB",
                category="Storage",
                total_stock=28,
                reserved_stock=8,
                reorder_point=10,
                unit_price=6499.00,
                location="B-02-02",
            ),
            Product(
                sku="WH-109",
                name="USB-C Cable",
                category="Accessories",
                total_stock=200,
                reserved_stock=40,
                reorder_point=50,
                unit_price=399.00,
                location="C-01-01",
            ),
            Product(
                sku="WH-110",
                name="Power Bank",
                category="Electronics",
                total_stock=45,
                reserved_stock=15,
                reorder_point=20,
                unit_price=1799.00,
                location="C-01-02",
            ),
        ]

        db.add_all(products)
        db.commit()

        # Refresh IDs
        for product in products:
            db.refresh(product)

        product_map = {product.sku: product for product in products}

        # ============================================================
        # ORDERS
        # ============================================================

        now = datetime.utcnow()

        orders = [
            Order(
                order_number="ORD-2048",
                customer_name="Acme Technologies",
                priority="URGENT",
                status="CREATED",
                deadline=now + timedelta(hours=2),
                total_items=10,
            ),
            Order(
                order_number="ORD-2049",
                customer_name="Nova Retail",
                priority="HIGH",
                status="ALLOCATED",
                deadline=now + timedelta(hours=5),
                total_items=8,
            ),
            Order(
                order_number="ORD-2050",
                customer_name="Bright Solutions",
                priority="NORMAL",
                status="PICKING",
                deadline=now + timedelta(hours=8),
                total_items=12,
            ),
            Order(
                order_number="ORD-2051",
                customer_name="Orbit Systems",
                priority="NORMAL",
                status="CREATED",
                deadline=now + timedelta(hours=12),
                total_items=5,
            ),
            Order(
                order_number="ORD-2052",
                customer_name="TechWorld",
                priority="HIGH",
                status="PACKING",
                deadline=now + timedelta(hours=4),
                total_items=6,
            ),
            Order(
                order_number="ORD-2053",
                customer_name="Vertex Labs",
                priority="LOW",
                status="CREATED",
                deadline=now + timedelta(days=1),
                total_items=4,
            ),
        ]

        db.add_all(orders)
        db.commit()

        for order in orders:
            db.refresh(order)

        # ============================================================
        # ORDER ITEMS
        # ============================================================

        order_items = [
            # URGENT ORDER
            OrderItem(
                order_id=orders[0].id,
                product_id=product_map["WH-104"].id,
                quantity=10,
                allocated_quantity=0,
                picked_quantity=0,
                packed_quantity=0,
            ),

            # HIGH PRIORITY
            OrderItem(
                order_id=orders[1].id,
                product_id=product_map["WH-101"].id,
                quantity=8,
                allocated_quantity=8,
                picked_quantity=0,
                packed_quantity=0,
            ),

            # NORMAL ORDER competing for same product
            OrderItem(
                order_id=orders[3].id,
                product_id=product_map["WH-104"].id,
                quantity=5,
                allocated_quantity=0,
                picked_quantity=0,
                packed_quantity=0,
            ),

            # PICKING ORDER
            OrderItem(
                order_id=orders[2].id,
                product_id=product_map["WH-102"].id,
                quantity=7,
                allocated_quantity=7,
                picked_quantity=4,
                packed_quantity=0,
            ),
            OrderItem(
                order_id=orders[2].id,
                product_id=product_map["WH-109"].id,
                quantity=5,
                allocated_quantity=5,
                picked_quantity=5,
                packed_quantity=3,
            ),

            # PACKING ORDER
            OrderItem(
                order_id=orders[4].id,
                product_id=product_map["WH-108"].id,
                quantity=6,
                allocated_quantity=6,
                picked_quantity=6,
                packed_quantity=4,
            ),

            # LOW PRIORITY
            OrderItem(
                order_id=orders[5].id,
                product_id=product_map["WH-105"].id,
                quantity=4,
                allocated_quantity=4,
                picked_quantity=0,
                packed_quantity=0,
            ),
        ]

        db.add_all(order_items)
        db.commit()

        # ============================================================
        # INVENTORY MOVEMENTS
        # ============================================================

        movements = [
            InventoryMovement(
                product_id=product_map["WH-101"].id,
                movement_type="RECEIVED",
                quantity=50,
                reference="PO-1001",
                reason="Supplier delivery",
            ),
            InventoryMovement(
                product_id=product_map["WH-101"].id,
                movement_type="RESERVED",
                quantity=12,
                reference="ORD-2049",
                reason="Stock allocated to high-priority order",
            ),
            InventoryMovement(
                product_id=product_map["WH-104"].id,
                movement_type="RECEIVED",
                quantity=10,
                reference="PO-1002",
                reason="Supplier delivery",
            ),
            InventoryMovement(
                product_id=product_map["WH-104"].id,
                movement_type="RESERVED",
                quantity=0,
                reference="ORD-2048",
                reason="Urgent order awaiting allocation",
            ),
            InventoryMovement(
                product_id=product_map["WH-104"].id,
                movement_type="DAMAGED",
                quantity=3,
                reference="INC-301",
                reason="Quality inspection damage",
            ),
            InventoryMovement(
                product_id=product_map["WH-102"].id,
                movement_type="PICKED",
                quantity=4,
                reference="ORD-2050",
                reason="Picking completed",
            ),
            InventoryMovement(
                product_id=product_map["WH-109"].id,
                movement_type="PICKED",
                quantity=5,
                reference="ORD-2050",
                reason="Picking completed",
            ),
            InventoryMovement(
                product_id=product_map["WH-108"].id,
                movement_type="PACKED",
                quantity=4,
                reference="ORD-2052",
                reason="Packing completed",
            ),
        ]

        db.add_all(movements)
        db.commit()

        print("========================================")
        print("WareWise database seeded successfully!")
        print("========================================")
        print(f"Products created: {len(products)}")
        print(f"Orders created: {len(orders)}")
        print(f"Order items created: {len(order_items)}")
        print(f"Inventory movements created: {len(movements)}")
        print("========================================")

    except Exception as error:
        db.rollback()
        print(f"Error while seeding database: {error}")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()