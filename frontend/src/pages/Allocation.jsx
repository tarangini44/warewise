import { useEffect, useState } from "react";
import axios from "axios";
import {
  Boxes,
  CheckCircle2,
  AlertTriangle,
  Package,
} from "lucide-react";
import ModuleHeader from "../components/ModuleHeader";

import API_URL from "../config";

function Allocation() {
  const [products, setProducts] = useState([]);
  const [selectedSku, setSelectedSku] = useState("WH-104");
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");

  // Load products
  const loadProducts = async () => {
    try {
      setProductsLoading(true);

      const response = await axios.get(
        `${API_URL}/api/products/`
      );

      setProducts(response.data);
    } catch (err) {
      console.error("Products API error:", err);
      setError("Unable to load products.");
    } finally {
      setProductsLoading(false);
    }
  };

  // Run allocation for selected SKU
  const runAllocation = async () => {
    if (!selectedSku) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/allocation/${selectedSku}`
      );

      setAllocation(response.data);
    } catch (err) {
      console.error("Allocation API error:", err);
      setError("Unable to run allocation.");
      setAllocation(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      runAllocation();
    }
  }, [selectedSku, products.length]);

  // Calculate statistics from backend result
  const decisions = allocation?.decisions || [];

  const fullyAllocated = decisions.filter(
    (item) => item.decision === "FULL_ALLOCATION"
  ).length;

  const partialAllocated = decisions.filter(
    (item) => item.decision === "PARTIAL_ALLOCATION"
  ).length;

  const noAllocation = decisions.filter(
    (item) => item.decision === "NO_ALLOCATION"
  ).length;

  const totalShortage = decisions.reduce(
    (total, item) => total + item.shortage,
    0
  );

  return (
    <div className="module-page">

      <ModuleHeader
        eyebrow="STOCK ALLOCATION"
        title="Allocation"
        description="Optimize inventory allocation across active customer orders."
      />

      {/* Statistics */}

      <div className="module-stats">

        <div className="module-stat">
          <Boxes size={20} />
          <span>Orders in Queue</span>
          <strong>{decisions.length}</strong>
        </div>

        <div className="module-stat">
          <CheckCircle2 size={20} />
          <span>Fully Allocated</span>
          <strong>{fullyAllocated}</strong>
        </div>

        <div className="module-stat">
          <AlertTriangle size={20} />
          <span>Partial / No Allocation</span>
          <strong>
            {partialAllocated + noAllocation}
          </strong>
        </div>

        <div className="module-stat">
          <Package size={20} />
          <span>Units Short</span>
          <strong>{totalShortage}</strong>
        </div>

      </div>

      {/* Allocation controls */}

      <div className="module-panel">

        <div className="module-panel-header">

          <div>
            <h2>Allocation Queue</h2>

            <p>
              Run inventory allocation against competing orders.
            </p>
          </div>

          <button
            className="module-action"
            onClick={runAllocation}
            disabled={loading}
          >
            {loading
              ? "Running..."
              : "Run Allocation"}
          </button>

        </div>

        <div
          style={{
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >

          <label>
            <strong>Select Product</strong>
          </label>

          <select
            value={selectedSku}
            onChange={(e) =>
              setSelectedSku(e.target.value)
            }
            disabled={productsLoading}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(0,0,0,0.3)",
              color: "inherit",
              minWidth: "250px",
            }}
          >

            {products.map((product) => (
              <option
                key={product.sku}
                value={product.sku}
              >
                {product.sku} — {product.product}
              </option>
            ))}

          </select>

        </div>

        {error && (
          <div
            style={{
              padding: "15px 20px",
              color: "#fca5a5",
            }}
          >
            {error}
          </div>
        )}

        {allocation && (

          <div style={{ overflowX: "auto" }}>

            <table className="module-table">

              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>PRIORITY</th>
                  <th>REQUIRED</th>
                  <th>ALLOCATED</th>
                  <th>SHORTAGE</th>
                  <th>DECISION</th>
                </tr>
              </thead>

              <tbody>

                {decisions.map((item) => (

                  <tr key={item.order_number}>

                    <td>
                      <strong>
                        {item.order_number}
                      </strong>
                    </td>

                    <td>
                      {item.priority}
                    </td>

                    <td>
                      {item.required}
                    </td>

                    <td>
                      {item.allocated}
                    </td>

                    <td>
                      {item.shortage}
                    </td>

                    <td>
                      <span className="module-badge">
                        {item.decision}
                      </span>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* AI Recommendation */}

      {allocation && (
        <div className="module-panel">

          <div className="module-panel-header">

            <div>
              <h2>
                AI Allocation Recommendation
              </h2>

              <p>
                Recommended action based on current
                inventory availability and order priority.
              </p>
            </div>

          </div>

          <div className="recommendation-box">

            <AlertTriangle size={21} />

            <div>

              <strong>
                {allocation.product}
              </strong>

              <p>
                Available stock:{" "}
                <strong>
                  {allocation.available_stock}
                </strong>{" "}
                units.
                {" "}
                After allocation,{" "}
                <strong>
                  {allocation.remaining_stock}
                </strong>{" "}
                units remain.
              </p>

              {totalShortage > 0 ? (

                <p>
                  There is a shortage of{" "}
                  <strong>
                    {totalShortage}
                  </strong>{" "}
                  unit(s). Prioritize higher-priority
                  orders and trigger replenishment
                  for the remaining demand.
                </p>

              ) : (

                <p>
                  All competing orders can be fully
                  allocated with the currently
                  available inventory.
                </p>

              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Allocation;
