import {
  Settings as SettingsIcon,
  Bell,
  Database,
  ShieldCheck,
  Save,
} from "lucide-react";
import ModuleHeader from "../components/ModuleHeader";

function Settings() {
  return (
    <div className="module-page">
      <ModuleHeader
        eyebrow="SYSTEM CONFIGURATION"
        title="Settings"
        description="Configure warehouse preferences and system behaviour."
      />

      <div className="settings-grid">
        <div className="module-panel">
          <div className="module-panel-header">
            <div>
              <h2>
                <SettingsIcon size={18} />
                Warehouse Settings
              </h2>
              <p>General warehouse configuration</p>
            </div>
          </div>

          <div className="settings-form">
            <label>
              Warehouse Name
              <input defaultValue="WareWise Main Warehouse" />
            </label>

            <label>
              Warehouse Location
              <input defaultValue="Kakinada, Andhra Pradesh" />
            </label>

            <label>
              Operating Hours
              <input defaultValue="08:00 AM - 08:00 PM" />
            </label>
          </div>
        </div>

        <div className="module-panel">
          <div className="module-panel-header">
            <div>
              <h2>
                <Bell size={18} />
                Notifications
              </h2>
              <p>Manage operational alerts</p>
            </div>
          </div>

          <div className="settings-options">
            <label>
              <input type="checkbox" defaultChecked />
              Critical stock alerts
            </label>

            <label>
              <input type="checkbox" defaultChecked />
              Order deadline alerts
            </label>

            <label>
              <input type="checkbox" defaultChecked />
              Exception notifications
            </label>
          </div>
        </div>

        <div className="module-panel">
          <div className="module-panel-header">
            <div>
              <h2>
                <Database size={18} />
                System
              </h2>
              <p>Backend and database status</p>
            </div>
          </div>

          <div className="system-status">
            <div>
              <span>API Server</span>
              <strong>Connected</strong>
            </div>

            <div>
              <span>Database</span>
              <strong>Connected</strong>
            </div>

            <div>
              <span>AI Decision Engine</span>
              <strong>Ready</strong>
            </div>
          </div>
        </div>

        <div className="module-panel">
          <div className="module-panel-header">
            <div>
              <h2>
                <ShieldCheck size={18} />
                Security
              </h2>
              <p>Administrator access</p>
            </div>
          </div>

          <div className="system-status">
            <div>
              <span>Admin Access</span>
              <strong>Enabled</strong>
            </div>

            <div>
              <span>Session</span>
              <strong>Active</strong>
            </div>
          </div>
        </div>
      </div>

      <button className="save-settings">
        <Save size={17} />
        Save Settings
      </button>
    </div>
  );
}

export default Settings;