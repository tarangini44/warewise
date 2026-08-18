import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ModuleHeader({ eyebrow, title, description }) {
  const navigate = useNavigate();

  return (
    <div className="module-page-header">
      <button
        className="module-back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={16} />
        Dashboard
      </button>

      <div className="module-heading">
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default ModuleHeader;