import { useNavigate } from "react-router-dom";
import flowIcon from "../../assets/icons8-process-64.png";
import { ROUTER_JOBS_CREATE, ROUTER_PROXIMITY_CREATE, ROUTER_WORKFLOW_CREATE } from "../utils/Constants";
export const Greetings = () => {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column  align-items-center justify-content-center h-100">
      {/* Logo */}
      <span className="d-flex mb-3">
        <img src={flowIcon} width="64" height="64" alt="flow-icon" />
        <span>
          <h3 className="mx-3 mt-4">Job Automator</h3>
        </span>
      </span>
      {/* button */}
	<div className="d-flex mb-3">
	    <button
		type="button"
		className="btn btn-success mx-2"
		onClick={() => navigate(ROUTER_JOBS_CREATE)}
	    >
		Create a Job
	    </button>
	    <button
		type="button"
		className="btn btn-success mx-2"
		onClick={() => navigate(ROUTER_WORKFLOW_CREATE)}
	    >
		Create a Workflow
	    </button>
	</div>
	<div className="d-flex mb-3">
	    <button
		type="button"
		className="btn btn-success mx-2"
		onClick={() => navigate(ROUTER_PROXIMITY_CREATE)}
	    >
		Customer Proximity
	    </button>
	</div>
    </div>
  );
};
