import { useNavigate } from "react-router-dom";
import flowIcon from "../../assets/icons8-process-64.png";
export const Greetings = () => {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column  align-items-center justify-content-center h-100">
      {/* Logo */}
      <span className="d-flex mb-3">
        <img src={flowIcon} width="64" height="64" alt="flow-icon" />
        <span>
          <h3 className="mx-3 mt-4">Flow Automator</h3>
        </span>
      </span>
      {/* button */}
      <button
        type="button"
        className="btn btn-success"
        onClick={() => navigate("create")}
      >
        Create a Flow
      </button>
    </div>
  );
};
