import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import ModuleHeader from "../components/ModuleHeader";

const API_URL = "http://127.0.0.1:8000";

function Alerts() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/alerts/`
      );

      setData(response.data);
    } catch (err) {
      console.error("Alerts API error:", err);
      setError("Unable to load warehouse alerts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  if (loading) {
    return (
      <div className="module-page">
        <ModuleHeader
          eyebrow="WAREHOUSE ALERT CENTER"
          title="Alerts"
          description="Monitor critical events and operational exceptions."
        />

        <div className="module-panel">
          <h2>Loading alerts...</h2>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="module-page">
        <ModuleHeader
          eyebrow="WAREHOUSE ALERT CENTER"
          title="Alerts"
          description="Monitor critical events and operational exceptions."
        />

        <div className="module-panel">
          <h2>{error || "No alert data available."}</h2>

          <button
            className="module-action"
            onClick={loadAlerts}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const alerts = data.alerts || [];

  const criticalCount = alerts.filter(
    (alert) => alert.severity === "CRITICAL"
  ).length;

  const warningCount = alerts.filter(
    (alert) => alert.severity === "WARNING"
  ).length;

  const getIcon = (severity) => {
    if (severity === "CRITICAL") {
      return AlertTriangle;
    }

    return AlertCircle;
  };

  return (
    <div className="module-page">

      <ModuleHeader
        eyebrow="WAREHOUSE ALERT CENTER"
        title="Alerts"
        description="Monitor critical events and operational exceptions."
      />

      {/* Alert statistics */}

      <div className="module-stats">

        <div className="module-stat">
          <AlertTriangle size={20} />
          <span>Critical</span>
          <strong>{criticalCount}</strong>
        </div>

        <div className="module-stat">
          <AlertCircle size={20} />
          <span>Warnings</span>
          <strong>{warningCount}</strong>
        </div>

        <div className="module-stat">
          <Bell size={20} />
          <span>Active Alerts</span>
          <strong>{data.total_alerts}</strong>
        </div>

        <div className="module-stat">
          <CheckCircle2 size={20} />
          <span>System Status</span>
          <strong>
            {data.total_alerts > 0
              ? "Attention"
              : "Healthy"}
          </strong>
        </div>

      </div>

      {/* Alert list */}

      <div className="module-panel">

        <div className="module-panel-header">

          <div>
            <h2>Active Alerts</h2>

            <p>
              Latest warehouse notifications and warnings
            </p>
          </div>

          <button
            className="module-action"
            onClick={loadAlerts}
          >
            Refresh Alerts
          </button>

        </div>

        <div className="alert-list">

          {alerts.length === 0 ? (

            <div className="alert-item">

              <div className="alert-icon">
                <CheckCircle2 size={20} />
              </div>

              <div className="alert-content">

                <div className="alert-title">
                  <strong>
                    No active alerts
                  </strong>
                </div>

                <p>
                  Warehouse operations are currently healthy.
                </p>

              </div>

            </div>

          ) : (

            alerts.map((alert, index) => {

              const Icon = getIcon(
                alert.severity
              );

              const reference =
                alert.product ||
                alert.reference ||
                alert.sku ||
                "Warehouse";

              return (
                <div
                  className={`alert-item ${alert.severity.toLowerCase()}`}
                  key={`${alert.sku || "alert"}-${index}`}
                >

                  <div className="alert-icon">
                    <Icon size={20} />
                  </div>

                  <div className="alert-content">

                    <div className="alert-title">

                      <strong>
                        {alert.type ||
                          "Inventory Alert"}
                      </strong>

                      <span className="module-badge">
                        {alert.severity}
                      </span>

                    </div>

                    <p>
                      {alert.message}
                    </p>

                    <small>
                      {reference}
                      {alert.sku
                        ? ` • ${alert.sku}`
                        : ""}
                    </small>

                  </div>

                  <button
                    className="module-action"
                    onClick={() => {
                      console.log(
                        "Reviewing alert:",
                        alert
                      );
                    }}
                  >
                    Review
                  </button>

                </div>
              );
            })

          )}

        </div>

      </div>

    </div>
  );
}

export default Alerts;