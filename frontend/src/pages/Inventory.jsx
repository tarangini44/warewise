import { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import ModuleHeader from "../components/ModuleHeader";

const API_URL = "http://127.0.0.1:8000";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/products/`
      );

      setProducts(response.data);
    } catch (err) {
      console.error("Inventory API error:", err);
      setError("Unable to connect to WareWise backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const totalProducts = products.length;

  const healthyStock = products.filter(
    (product) => product.status === "HEALTHY"
  ).length;

  const lowStock = products.filter(
    (product) => product.status === "LOW_STOCK"
  ).length;

  const reorderRequired = products.filter(
    (product) =>
      product.status === "LOW_STOCK" ||
      product.status === "OUT_OF_STOCK"
  ).length;

  const getStatusStyle = (status) => {
    if (status === "OUT_OF_STOCK") {
      return {
        background: "rgba(239,68,68,0.16)",
        color: "#fca5a5",
      };
    }

    if (status === "LOW_STOCK") {
      return {
        background: "rgba(245,158,11,0.16)",
        color: "#fcd34d",
      };
    }

    return {
      background: "rgba(34,197,94,0.14)",
      color: "#86efac",
    };
  };

  const getStatusText = (status) => {
    if (status === "OUT_OF_STOCK") {
      return "Out of Stock";
    }

    if (status === "LOW_STOCK") {
      return "Low Stock";
    }

    return "Healthy";
  };

  return (
    <div className="module-page">

      <ModuleHeader
        eyebrow="INVENTORY MANAGEMENT"
        title="Inventory"
        description="Monitor warehouse stock, availability and replenishment needs."
      />

      <div className="module-stats">

        <div className="module-stat">
          <Package size={20} />
          <span>Total Products</span>
          <strong>{totalProducts}</strong>
        </div>

        <div className="module-stat">
          <CheckCircle2 size={20} />
          <span>Healthy Stock</span>
          <strong>{healthyStock}</strong>
        </div>

        <div className="module-stat">
          <AlertTriangle size={20} />
          <span>Low Stock</span>
          <strong>{lowStock}</strong>
        </div>

        <div className="module-stat">
          <RefreshCw size={20} />
          <span>Reorder Required</span>
          <strong>{reorderRequired}</strong>
        </div>

      </div>

      <div className="module-panel">

        <div className="module-panel-header">

          <div>
            <h2>Current Inventory</h2>
            <p>
              Live warehouse stock overview
            </p>
          </div>

          <button
            className="module-action"
            onClick={fetchInventory}
            disabled={loading}
          >
            <RefreshCw size={16} />

            {loading
              ? "Refreshing..."
              : "Refresh Inventory"}
          </button>

        </div>

        {loading && (
          <div
            style={{
              padding: "30px",
              textAlign: "center",
            }}
          >
            Loading inventory...
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "30px",
              textAlign: "center",
              color: "#fca5a5",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <div style={{ overflowX: "auto" }}>

            <table className="module-table">

              <thead>
                <tr>
                  <th>SKU</th>
                  <th>PRODUCT</th>
                  <th>STOCK</th>
                  <th>RESERVED</th>
                  <th>AVAILABLE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>

                {products.map((product) => (

                  <tr key={product.sku}>

                    <td>
                      {product.sku}
                    </td>

                    <td>
                      {product.product}
                    </td>

                    <td>
                      {product.total_stock}
                    </td>

                    <td>
                      {product.reserved_stock}
                    </td>

                    <td>
                      {product.available_stock}
                    </td>

                    <td>

                      <span
                        className="module-badge"
                        style={getStatusStyle(
                          product.status
                        )}
                      >
                        {getStatusText(
                          product.status
                        )}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default Inventory;