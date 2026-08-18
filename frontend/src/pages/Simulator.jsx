import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bot,
  TrendingUp,
  AlertTriangle,
  Package,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import ModuleHeader from "../components/ModuleHeader";

const API_URL = "http://127.0.0.1:8000";

function Simulator() {
  const [products, setProducts] = useState([]);
  const [sku, setSku] = useState("WH-104");
  const [demand, setDemand] = useState(20);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load products for the SKU selector
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/products/`
        );

        setProducts(response.data);

        if (response.data.length > 0) {
          const defaultProduct = response.data.find(
            (product) => product.sku === "WH-104"
          );

          setSku(
            defaultProduct
              ? defaultProduct.sku
              : response.data[0].sku
          );
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load warehouse products.");
      }
    };

    loadProducts();
  }, []);

  const runSimulation = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await axios.get(
        `${API_URL}/api/simulator/${sku}`,
        {
          params: {
            demand_increase: demand,
          },
        }
      );

      setResult(response.data);
    } catch (err) {
      console.error("Simulation API error:", err);
      setError("Unable to run warehouse simulation.");
    } finally {
      setLoading(false);
    }
  };

  const resetSimulation = () => {
    setDemand(20);
    setResult(null);
    setError("");
  };

  const selectedProduct = products.find(
    (product) => product.sku === sku
  );

  const getStatusText = (status) => {
    if (status === "STOCK_SHORTAGE") {
      return "Stock Shortage";
    }

    if (status === "LOW_STOCK_RISK") {
      return "Low Stock Risk";
    }

    if (status === "HEALTHY") {
      return "Healthy";
    }

    return status;
  };

  return (
    <div className="module-page">

      <ModuleHeader
        eyebrow="WHAT-IF SIMULATION"
        title="Warehouse Simulator"
        description="Simulate demand changes and understand their impact on warehouse stock."
      />

      <div className="module-stats">

        <div className="module-stat">
          <Package size={20} />
          <span>Current Stock</span>
          <strong>
            {selectedProduct
              ? selectedProduct.available_stock
              : "--"}
          </strong>
        </div>

        <div className="module-stat">
          <TrendingUp size={20} />
          <span>Demand Change</span>
          <strong>+{demand}</strong>
        </div>

        <div className="module-stat">
          <Bot size={20} />
          <span>Simulation Mode</span>
          <strong>AI</strong>
        </div>

        <div className="module-stat">
          {result?.result === "STOCK_SHORTAGE" ? (
            <AlertTriangle size={20} />
          ) : (
            <CheckCircle2 size={20} />
          )}

          <span>Status</span>

          <strong>
            {result
              ? getStatusText(result.result)
              : "Ready"}
          </strong>
        </div>

      </div>

      <div className="module-panel">

        <div className="module-panel-header">

          <div>
            <h2>Demand Simulation</h2>

            <p>
              Increase expected demand and see the projected stock impact.
            </p>
          </div>

          <div className="module-badge">
            AI Assisted
          </div>

        </div>

        {/* Product selector */}

        <div
          className="simulator-control"
          style={{ marginBottom: "24px" }}
        >
          <label>
            Select Product

            <strong>
              {selectedProduct
                ? selectedProduct.product
                : "Loading..."}
            </strong>
          </label>

          <select
            value={sku}
            onChange={(e) => {
              setSku(e.target.value);
              setResult(null);
            }}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "10px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(0,0,0,0.25)",
              color: "inherit",
              fontSize: "15px",
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

        {/* Demand slider */}

        <div className="simulator-control">

          <label>
            Expected Demand Increase

            <strong>
              +{demand} units
            </strong>
          </label>

          <input
            type="range"
            min="0"
            max="120"
            value={demand}
            onChange={(e) => {
              setDemand(Number(e.target.value));
              setResult(null);
            }}
          />

          <div className="range-values">
            <span>0</span>
            <span>60</span>
            <span>120 units</span>
          </div>

        </div>

        {error && (
          <div
            style={{
              marginTop: "20px",
              color: "#fca5a5",
            }}
          >
            {error}
          </div>
        )}

        <div className="simulator-actions">

          <button
            className="primary-simulator-button"
            onClick={runSimulation}
            disabled={loading || !sku}
          >
            <Bot size={18} />

            {loading
              ? "Running..."
              : "Run Simulation"}
          </button>

          <button
            className="reset-simulator-button"
            onClick={resetSimulation}
          >
            <RotateCcw size={17} />
            Reset
          </button>

        </div>

      </div>

      {result && !result.error && (

        <div className="module-panel simulation-result">

          <div className="module-panel-header">

            <div>
              <span className="simulation-label">
                SIMULATION RESULT
              </span>

              <h2>
                Projected Warehouse Impact
              </h2>
            </div>

            {result.result === "STOCK_SHORTAGE" ? (
              <AlertTriangle size={24} />
            ) : (
              <CheckCircle2 size={24} />
            )}

          </div>

          <div className="simulation-grid">

            <div>
              <span>Product</span>
              <strong>{result.product}</strong>
            </div>

            <div>
              <span>Current Stock</span>
              <strong>
                {result.current_available_stock}
              </strong>
            </div>

            <div>
              <span>Additional Demand</span>
              <strong>
                +{result.additional_demand}
              </strong>
            </div>

            <div>
              <span>Projected Remaining</span>
              <strong>
                {result.remaining_stock}
              </strong>
            </div>

            <div>
              <span>Shortage</span>
              <strong>
                {result.shortage}
              </strong>
            </div>

            <div>
              <span>Stock Status</span>
              <strong>
                {getStatusText(result.result)}
              </strong>
            </div>

          </div>

          <div className="simulation-recommendation">

            {result.result === "STOCK_SHORTAGE" ? (
              <AlertTriangle size={19} />
            ) : (
              <CheckCircle2 size={19} />
            )}

            <div>

              <strong>
                AI Recommendation
              </strong>

              <p>
                {result.recommendation}
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Simulator;