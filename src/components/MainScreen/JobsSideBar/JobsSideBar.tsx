import React, { useState, useEffect, useContext } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { jobsApi,webhookWorkflowsApi, processError } from "../../servicecalls/serviceApi";
import styles from "./jobsSideBar.module.css";
import { FaHistory } from "react-icons/fa";
import { RiEditBoxLine } from "react-icons/ri";
import { MdCreateNewFolder } from "react-icons/md";
import { TbWebhook } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { MainScreenContext } from "../MainScreen";
import { AiFillHome } from "react-icons/ai";
import { Tab, Tabs } from "react-bootstrap";
import { ROUTER_WORKFLOW_CREATE, ROUTER_JOBS_CREATE, ROUTER_WORKFLOW_EDIT, ROUTER_WORKFLOW_HISTORY} from "../../utils/Constants";
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
			 			navigateHandle(ROUTER_WORKFLOW_HISTORY+"/"+ r._id);
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
						navigateHandle(ROUTER_WORKFLOW_EDIT+"/"+ r._id);
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

const SideBarDataBuilder = ({dataType}) => {
	const [jobsList, setJobList] = useState([]);
	let navigate = useNavigate();

	const { refresh } = useContext(MainScreenContext);
	useEffect(() => {
	  if(dataType==="WEBHOOKS")
	    populateWebhookJobs(setJobList,navigate)
	  else
	    populateJobs(setJobList, navigate);
	}, [refresh]);

	return <>{jobsList}</>;
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
				<SideBarDataBuilder dataType="WEBHOOKS"/>
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
							<Tab eventKey="job" title="Jobs">
							    <JobsViewSide/>
							</Tab>
							<Tab eventKey="webhook" title="Webhook">
							    <WebhooksViewSide/>
							</Tab>
						</Tabs>
					</div>
				</div>
			</div>

			<div className={`container mb-5`}>
				<CreateJobButton />
				<CreateWorkflowButton />
				<HomeButton />
			</div>
		</div>
	);
};

export default JobsSideBar;
