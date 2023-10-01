import React, { useState, useEffect, useContext } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { jobsApi, webhookWorkflowsApi, proximityJobApi, processError } from "../../servicecalls/serviceApi";
import styles from "./jobsSideBar.module.css";
import { FaHistory } from "react-icons/fa";
import { RiEditBoxLine } from "react-icons/ri";
import { TiCancelOutline } from "react-icons/ti";
import { AiFillDelete } from "react-icons/ai";
import { MdCreateNewFolder } from "react-icons/md";
import { TbWebhook } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { MainScreenContext } from "../MainScreen";
import { AiFillHome } from "react-icons/ai";
import { Tab, Tabs } from "react-bootstrap";
import { ROUTER_WORKFLOW_CREATE, ROUTER_JOBS_CREATE, ROUTER_WORKFLOW_EDIT, ROUTER_WORKFLOW_HISTORY, ROUTER_PROXIMITY_HISTORY, ROUTER_PROXIMITY_EDIT, ENABLE_JOBS_COMPONENT } from "../../utils/Constants";
import { UserCard } from "./UserCard/UserCard";
import AutoModalNormal from "../../sharedComponents/AutoModalNormal"


const localStyles = {
	height: "36em"
}

async function deleteProximity(jobId, setWaiting, successCallBack) {
	if (!jobId) {
		alert("JobId is not found");
		return;
	}
	setWaiting?.(true);
	let response = {};
	try {
		response = await proximityJobApi.deleteProximityJobByIdProximityIdDelete(jobId);
		console.log("response");
		alert("Job is deleted");
	  setWaiting?.(false)
		successCallBack();
	} catch (e) {
	  setWaiting?.(false)
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		alert(errorRes)
		response = errorRes;
	}
}


async function getAllProximity() {
	let response = [];
	try {
		let axiosObj = await proximityJobApi.getJobsForCurrentUserProximityAllForUserGet();
		response = axiosObj.data;
	} catch (error) {
		console.error(processError(error));
		response = [];
	}

	response.sort((first, second) => second.created_date - first.created_date);

	return response;
}

async function getAllWebhooks() {
	let response = [];
	try {
		let axiosObj = await webhookWorkflowsApi.getWorkflowsForCurrentUserWorkflowsAllForUserGet();
		response = axiosObj.data;
	} catch (error) {
		console.error(processError(error));
		response = [];
	}

	response.sort((first, second) => second.creation_date - first.creation_date);

	return response;
}

async function getAllJobs() {
	let response = [];
	try {
		let axiosObj = await jobsApi.getAllJobsRelatedToUserJobsAllForUserGet();
		response = axiosObj.data;
	} catch (error) {
		console.error(processError(error));
		response = [];
	}

	response.sort((first, second) => second.creation_date - first.creation_date);

	return response;
}
const populateProximityJobs = async (setList,setShowDelete,setDeletedDetails, navigateHandle) => {
	let jobs = await getAllProximity();

  let locJobList = jobs.map((r,index) => (
		<div
			key={r.jobName}
	  className={ `${styles.custom__accordion}  accordion-item` }
		>
	    <h2 className="accordion-header">
			<OverlayTrigger
				placement="right"
				delay={{ show: 250, hide: 400 }}
				overlay={<Tooltip id={`job-tooltip-${r.id} `}>{r.jobName}</Tooltip>}
			>
	    <button className={ `accordion-button ${styles.custom__accordion_button}` } type="button" data-bs-toggle="collapse" data-bs-target={ `#collapse${index}` } aria-expanded="false" aria-controls={ `collapse${index}` }>
				    <div className={styles.noOverFlowText}>{r.jobName}</div>
				</button>
			</OverlayTrigger>
	    </h2>
	    <div id={ `collapse${index}` } className="accordion-collapse collapse">
		<div className="accordion-body d-flex justify-content-evenly">

			<div className="mh-2 ">
				<button
					type="button"
					className="btn btn-dark p-1 lh-1"
					onClick={() => {
						// Webhook History
						navigateHandle(ROUTER_PROXIMITY_HISTORY + "/" + r._id);
					}}
				>
					<FaHistory />
				</button>
			</div>
			<div className="me-2 ms-1">
				<button
					type="button"
					className="btn btn-dark p-1 d-block lh-1"
					onClick={() => {
						navigateHandle(ROUTER_PROXIMITY_EDIT + "/" + r._id);
					}}
				>
					<RiEditBoxLine />
				</button>
			</div>
			<div className="me-2 ms-1">
				<button
					type="button"
					className="btn btn-dark p-1 d-block lh-1"
					onClick={() => {
					  setDeletedDetails(r)
					  setShowDelete(true)

					}}
				>
					<AiFillDelete />
				</button>
			</div>

		</div>
	    </div>
	    </div>


	));

	setList(locJobList);
};
const populateWebhookJobs = async (setList, navigateHandle) => {
	let jobs = await getAllWebhooks();
	let locJobList = jobs.map((r) => (
		<div
			key={r.jobName}
			className={`${styles.clearListDecoration} ${styles.noOverFlowText} ${styles.custom__listItem} py-2 d-flex`}
		>
			<OverlayTrigger
				placement="right"
				delay={{ show: 250, hide: 400 }}
				overlay={<Tooltip id={`job-tooltip-${r.id} `}>{r.jobName}</Tooltip>}
			>
				<div className={styles.noOverFlowText}>{r.jobName}</div>
			</OverlayTrigger>
			<div className="me-2 ms-auto">
				<button
					type="button"
					className="btn btn-dark p-1 lh-1"
					onClick={() => {
						// Webhook History
						navigateHandle(ROUTER_WORKFLOW_HISTORY + "/" + r._id);
					}}
				>
					<FaHistory />
				</button>
			</div>
			<div className="me-2 ms-1">
				<button
					type="button"
					className="btn btn-dark p-1 d-block lh-1"
					onClick={() => {
						navigateHandle(ROUTER_WORKFLOW_EDIT + "/" + r._id);
					}}
				>
					<RiEditBoxLine />
				</button>
			</div>
		</div>
	));

	setList(locJobList);
};

const populateJobs = async (setList, navigateHandle) => {
	let jobs = await getAllJobs();
	let locJobList = jobs.map((r) => (
		<div
			key={r.jobName}
			className={`${styles.clearListDecoration} ${styles.noOverFlowText} ${styles.custom__listItem} py-2 d-flex`}
		>
			<OverlayTrigger
				placement="right"
				delay={{ show: 250, hide: 400 }}
				overlay={<Tooltip id={`job-tooltip-${r.id} `}>{r.jobName}</Tooltip>}
			>
				<div className={styles.noOverFlowText}>{r.jobName}</div>
			</OverlayTrigger>
			<div className="me-2 ms-auto">
				<button
					type="button"
					className="btn btn-dark p-1 lh-1"
					onClick={() => {
						navigateHandle("/jobs/job-history/" + r.id);
					}}
				>
					<FaHistory />
				</button>
			</div>
			<div className="me-2">
				<button
					type="button"
					className="btn btn-dark p-1 d-block lh-1"
					onClick={() => {
						navigateHandle("/jobs/edit/" + r.id);
					}}
				>
					<RiEditBoxLine />
				</button>
			</div>
		</div>
	));

	setList(locJobList);
};

const getHeight = () => {
	if (window.innerHeight > 800) {
		return "70vh"
	} else if (window.innerHeight > 500) {
		return "50vh"
	} else {
		return "20vh"
	}
}
const SideBarDataBuilder = ({ dataType }) => {
	const [jobsList, setJobList] = useState([]);
	const [showDelete,setShowDelete] = useState(false)
	const [deletedDetails,setDeletedDetails] = useState<any>({})
	const [waiting,setWaiting] = useState(false)
	let navigate = useNavigate();

  const { refresh,setrefresh } = useContext(MainScreenContext);
	const closeAndRefresh = () => {
	  setWaiting(false)
		setTimeout(() => {
		  setShowDelete(false)
		}, 1000);
	  setrefresh();
	};
	useEffect(() => {
		if (dataType === "WEBHOOKS")
			populateWebhookJobs(setJobList, navigate)
		else if (dataType === "PROXIMITY")
		  populateProximityJobs(setJobList,setShowDelete,setDeletedDetails, navigate)
		else
			populateJobs(setJobList, navigate);
	}, [refresh]);

  return (<>
    <div className="scrollBar accordion accordion-flush"
	  style={{minHeight:"0px",maxHeight:getHeight(),overflowX:"hidden",overflowY:"auto"}}>
    {jobsList}
	  </div>
	  {
	    dataType=== "PROXIMITY" &&
	      (<AutoModalNormal modalState={showDelete} setModalState={setShowDelete} header= {<span className={styles.color_black}>Delete Job</span>} >
			<div className={styles.color_black}>
				Do you want to delete the job- <b>{deletedDetails.jobName}</b> ?
			</div>
			{!waiting ? (
				<div className="d-flex flex-row justify-content-end">
					<button
						type="button"
						onClick={() => deleteProximity(deletedDetails._id, setWaiting, closeAndRefresh)}
						className="btn btn-outline-danger py-1 px-2 mx-2"
					>
						<AiFillDelete />
					</button>
					<button
						type="button"
						className="btn btn-outline-secondary py-1 px-2"
						onClick={() => setShowDelete(false)}
					>
						<TiCancelOutline />
					</button>
				</div>
			) : (
				<div className="spinner-border text-danger" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			)}
		</AutoModalNormal>)
	  }
	  </>);
};

const CreateWorkflowButton = () => {
	const navigate = useNavigate();
	return (
		<div
			className={`${styles.clearListDecoration} ${styles.custom__listItem} container`}
			onClick={() => {
				navigate(ROUTER_WORKFLOW_CREATE);
			}}
		>
			<b>Create Workflow</b>
			<span className="float-end me-2">
				<TbWebhook />
			</span>
		</div>
	);
};
const HomeButton = () => {
	const navigate = useNavigate();
	return (
		<div
			className={`${styles.clearListDecoration} ${styles.custom__listItem} container`}
			onClick={() => {
				navigate("/");
			}}
		>
			<b>Home</b>
			<span className="float-end me-2">
				<AiFillHome />
			</span>
		</div>
	);
};


const CreateJobButton = () => {
	const navigate = useNavigate();
	return (
		<div
			className={`${styles.clearListDecoration} ${styles.custom__listItem} container`}
			onClick={() => {
				navigate(ROUTER_JOBS_CREATE);
			}}
		>
			<b>Create Job</b>
			<span className="float-end me-2">
				<MdCreateNewFolder />
			</span>
		</div>
	);
};

const WebhooksViewSide = () => {
	return (
		<>
			<h5 className="fw-bold">Previous Webhooks</h5>
			<div className="ps-2">
				<SideBarDataBuilder dataType="WEBHOOKS" />
			</div>
		</>
	)

}
const JobsViewSide = () => {
	return (
		<>
			<h5 className="fw-bold">Previous Jobs</h5>
			<div className="ps-2">
				<SideBarDataBuilder dataType="JOBS" />
			</div>
		</>
	)

}
const ProximityViewSide = () => {
	return (
		<>
			<h5 className="fw-bold">Previous Jobs</h5>
			<div className="ps-2">
				<SideBarDataBuilder dataType="PROXIMITY" />
			</div>
		</>
	)

}

const JobsSideBar = () => {
	return (
		<div className="d-flex flex-column justify-content-between h-100">
			<div className="container">
				<div className="d-flex flex-column">
					<div className="my-2">
						<Tabs
							defaultActiveKey="job"
							id="uncontrolled-tab-example"
							className="mb-3"
							fill
						>
						{ENABLE_JOBS_COMPONENT && (<Tab eventKey="job" title="Jobs">
								<JobsViewSide />
						</Tab>)}

							<Tab eventKey="webhook" title="Webhook">
								<WebhooksViewSide />
							</Tab>
							<Tab eventKey="proximity" title="Proximity">
								<ProximityViewSide />
							</Tab>
						</Tabs>
					</div>
				</div>
			</div>

			<div className={`container mb-2  scrollBar`} style={{ maxHeight: "20vh", overflowX: "hidden", overflowY: "auto" }}>
				{ENABLE_JOBS_COMPONENT && <CreateJobButton />}
				<CreateWorkflowButton />
				<HomeButton />
				<UserCard />
			</div>
		</div>
	);
};

export default JobsSideBar;
