import React, { useContext, useEffect, useState } from "react";
import { useInput } from "../../../hooks/useInput";
import styles from "../mainscreen.module.css";
import { ReactiveLabel } from "./ReactiveLabel";
import { webhookWorkflowsApi, jobsApi, processError } from "../../servicecalls/serviceApi";
import { copyTextToClipboad, ValidateEmail, validate_valid_chars } from "../../utils/HelperFunctions";
import { useLoaderData, useNavigate } from "react-router-dom";
import AutoModalNormal from "../../sharedComponents/AutoModalNormal";
import { AiFillDelete } from "react-icons/ai";
import { TiCancelOutline } from "react-icons/ti";
import { MainScreenContext } from "../MainScreen";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BACKEND_BASE_PATH, BACKEND_WEBHOOK_PREFIX } from "../../utils/Constants";

const tableFontColor = {
	color: "black",
};

const redColor = {
	color: "red",
};

function breakStringBySemiColonArr(emails) {

	return emails.split(";").map(r => r.trim())
}

async function deleteJob(jobId, setWaiting, successCallBack) {
	if (!jobId) {
		alert("JobId is not found");
		return;
	}
	setWaiting?.(true);
	let response = {};
	try {
		response = await webhookWorkflowsApi.deleteWorkflowByIdWorkflowsIdDelete(jobId)
		console.log("response");
		alert("Job is deleted");
		successCallBack();
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		alert(errorRes)
		response = errorRes;
	}
}
const DeleteFlow = ({ showDelete, setShowDelete, jobData }) => {
	const navigate = useNavigate();
	const [waiting, setWaiting] = useState(false);
	const header = <span style={tableFontColor}>Delete Job</span>;
	const { setrefresh } = useContext(MainScreenContext); // Refresh Main Screen
	const closeAndRefresh = () => {
		setrefresh();
		setTimeout(() => {
			navigate("/");
		}, 1000);
	};
	return (
		<AutoModalNormal
			modalState={showDelete}
			setModalState={setShowDelete}
			header={header}
		>
			<div style={tableFontColor}>
				Do you want to delete the job- <b>{jobData.jobName}</b> ?
			</div>
			{!waiting ? (
				<div className="d-flex flex-row justify-content-end">
					<button
						type="button"
						onClick={() => deleteJob(jobData._id, setWaiting, closeAndRefresh)}
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
		</AutoModalNormal>
	);
};

function WebhookLinkModal({ show, setShow, webhookLink }) {

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<>
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header closeButton>
					<Modal.Title style={tableFontColor}> Webhook Created </Modal.Title>
				</Modal.Header>
				<Modal.Body style={tableFontColor}>
					Please copy the link below and paste in storeleads<br />
					<div className={styles.code_bg}>
						<code>
							{webhookLink}
						</code>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={() => copyTextToClipboad(webhookLink)}>
						Copy
					</Button>
					<Button variant="danger" onClick={handleClose}>Close</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

/**
 * @param {string} jobName
 */
function fetchWorkflowJob(jobName) {
	return webhookWorkflowsApi.checkWorkflowNameWorkflowsCheckNameGet(jobName);
}

async function verifyEmailIds(emails) {
	let individualMailArr = breakStringBySemiColonArr(emails)
	let allVerified = []

	for (let mail of individualMailArr) {
		if (!ValidateEmail(mail)) {
			allVerified.push(mail)
		}
	}
	return allVerified

}

async function verifyPersona(personaList) {
	let individualMailArr = breakStringBySemiColonArr(personaList) // Using same logic as emails so same function can be used
	let allVerified = []

	for (let mail of individualMailArr) {
		if (!validate_valid_chars(mail)) {
			allVerified.push(mail)
		}
	}
	return allVerified
}

async function saveJobsData(jobName, persona, email_id_list,minimum_traffic_count) {
	let data = {
		jobName,
		email_id_list,
	    persona,
	    minimum_traffic_count
	};


	let response = {};
	try {
		response = await webhookWorkflowsApi.createWorkflowWorkflowsCreatePost(data);
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		return errorRes;
	}
	return response;
}

async function updateJobsData(jobId, persona, email_id_list,minimum_traffic_count) {
	let data = {
		persona,
	    email_id_list,
	    minimum_traffic_count
	};


	let response = {};
	try {
		response = await webhookWorkflowsApi.updateWorkflowByIdWorkflowsIdPut(jobId, data);
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		return errorRes;
	}
	return response;
}

const CreateNewWorkflow = ({ editingMode }) => {
	/* react router stuff */
	const jobData = useLoaderData();
	const { setrefresh } = useContext(MainScreenContext); // Refresh Main Screen

	useEffect(() => {
		if (editingMode) {
			if (jobData != null && jobData.jobName) {
				if (jobData.email_id_list && Array.isArray(jobData.email_id_list)) {
					setEmailIds(jobData.email_id_list.join(";"))
				}
				setJobName(jobData.jobName);
				if (jobData.persona && Array.isArray(jobData.persona)) {
					setPersonaList(jobData.persona.join(";"));
				}

			    // We need setup of traffic filter and logic in case filtered is unchecked
			    setTrafficFilter(jobData.minimum_traffic_count?jobData.minimum_traffic_count:0)

			} else {
				console.error(jobData);
				alert("Something went wrong");
			}
		} else {
			setPersonaList("");
			setJobName("");
			setEmailIds("")
		}
		setrefresh();
	}, [editingMode, jobData]);

	const [personaList, bindPersonaList, resetPersonaList, setPersonaList] =
		useInput("");
	const [jobName, bindJobName, resetJobName, setJobName] = useInput("");
	const [emailIds, bindEmailIds, resetEmailIds, setEmailIds] = useInput("");
	const [trafficFilter, setTrafficFilter] = useState(0);
	const [labelEmailIdVerify, setlabelEmailIdVerify] = useState("");
	const [labelJobNameVerify, setLabelJobNameVerify] = useState("");
	const [labelApolloPersonaVerify, setApolloPersonaVerify] = useState("");

	const [isSavingData, setIsSavingData] = useState(false);

	const [labelSaveMessage, setLabelSaveMessage] = useState();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [webhookLink, setWebhookLink] = useState("")
	const [isWebhookLinkModalVisible, setIsWebhookLinkModalVisible] = useState(false)

	const navigate = useNavigate();

	//JObs Validation
	useEffect(() => {
		setLabelJobNameVerify({});
		if (jobName.length >= 3) {
			let timeout = setTimeout(() => {
				setLabelJobNameVerify({ hint: "", message: "Verifying..." });
				fetchWorkflowJob(jobName).then((responseBody) => {
					setLabelJobNameVerify({
						hint: "SUCCESS",
						message: "Valid Workflow Name",
					});
				}).catch(err => {
					setLabelJobNameVerify({
						hint: "ERROR",
						message: "Job name is already taken",
					});

				});
			}, 2000);
			return () => {
				clearTimeout(timeout);
			};
		} else if (jobName) {
			setLabelJobNameVerify({
				hint: "ERROR",
				message: "Length should be greater than 2",
			});
		} else {
			setLabelJobNameVerify({});
		}
	}, [jobName]);
	//Email Id verification
	useEffect(() => {
		setlabelEmailIdVerify({});
		if (emailIds) {
			let timeout = setTimeout(() => {
				setlabelEmailIdVerify({ hint: "", message: "Verifying..." });
				verifyEmailIds(emailIds).then((errorIdList) => {
					if (errorIdList.length > 0) {
						setlabelEmailIdVerify({
							hint: "ERROR",
							message: "Email id invalid: - " + errorIdList.join(" "),
						});
					} else {
						setlabelEmailIdVerify({
							hint: "SUCCESS",
							message: "",
						});
					}
				});
			}, 1000);
			return () => {
				clearTimeout(timeout);
			};
		} else {
			setlabelEmailIdVerify({});
		}
	}, [emailIds]);


	//Apollo Persona verificaton
	useEffect(() => {
		setApolloPersonaVerify({});
		if (personaList) {
			let timeout = setTimeout(() => {
				setApolloPersonaVerify({ hint: "", message: "Verifying..." });
				verifyPersona(personaList).then((errorIdList) => {
					if (errorIdList.length > 0) {
						setApolloPersonaVerify({
							hint: "ERROR",
							message: "Persona invalid: - " + errorIdList.join(" "),
						});
					} else {
						setApolloPersonaVerify({
							hint: "SUCCESS",
							message: "",
						});
					}
				});
			}, 1000);
			return () => {
				clearTimeout(timeout);
			};
		} else {
			setApolloPersonaVerify({});
		}
	}, [personaList]);

	const isSavePossible = () => {
		return (
			labelJobNameVerify?.hint === "SUCCESS" &&
			labelApolloPersonaVerify?.hint === "SUCCESS" &&
			labelEmailIdVerify?.hint === "SUCCESS"
		);
	};
	const isUpdatePossible = () => {
		return labelApolloPersonaVerify?.hint === "SUCCESS" && labelEmailIdVerify?.hint === "SUCCESS";
	};

	const constructAndDisplayWebhookLink = (jobId) => {

		let finalLink = BACKEND_BASE_PATH + BACKEND_WEBHOOK_PREFIX + "/" + jobId

		setWebhookLink(finalLink);
		setIsWebhookLinkModalVisible(true);

	}
	const saveData = async () => {
		setLabelSaveMessage({ hint: "", message: "Creating Job..." });
		setIsSavingData(true);
		let individualMailArr = breakStringBySemiColonArr(emailIds)
		let personaListBroken = breakStringBySemiColonArr(personaList)

	    let data = await saveJobsData(jobName, personaListBroken, individualMailArr,trafficFilter);


		setIsSavingData(false);

		//CLear label after 10 seconds
		setTimeout(() => {
			setLabelSaveMessage({ hint: "SUCCESS", message: "" });
		}, 30000);

		if (data.type === "error") {
			setLabelSaveMessage({ hint: "ERROR", message: data.statusMessage });
			return;
		}

		setLabelSaveMessage({
			hint: "SUCCESS",
			message: "Job successfully created",
		});

		constructAndDisplayWebhookLink(data.data._id)

		resetJobName();
		resetPersonaList();
		resetEmailIds()
		setrefresh();
	};
	const updateData = async () => {
		setLabelSaveMessage({ hint: "", message: "Updating Job..." });
		setIsSavingData(true);
		let emailArr = breakStringBySemiColonArr(emailIds)
		let personaListArr = breakStringBySemiColonArr(personaList)


		let data = await updateJobsData(
			jobData._id,
			personaListArr,
		    emailArr,
		    trafficFilter

		);

		setIsSavingData(false);
		if (data.type === "error") {
			setLabelSaveMessage({ hint: "ERROR", message: data.statusMessage });
			return;
		}

		//CLear label after 10 seconds
		setTimeout(() => {
			setLabelSaveMessage({ hint: "SUCCESS", message: "" });
		}, 30000);


		setLabelSaveMessage({
			hint: "SUCCESS",
			message: "Job successfully created",
		});
	};

	const headerName = editingMode ? (
		<>
			Edit Workflow
			<div
				style={redColor}
				className="d-inline-block ms-2 "
				onClick={() => setShowDeleteModal(true)}
			>
				<AiFillDelete />
			</div>
		</>
	) : (
		"Create Workflow"
	);


    const trafficFilterSetNVerify = (event)=>{
	let key = event.key;
	let intKey = parseInt(key);
	
	if(intKey>=0){
	    setTrafficFilter(r=>r*10+intKey)
	}else if(key==="Backspace"){
	    setTrafficFilter(r=>Math.floor( r/10 ))
	}
    }

	return (
		<div className="d-flex flex-column  align-items-center h-100">
			<div className="mt-4 w-75">
				<h1 className="display-6 fw-bold mb-3">{headerName}</h1>
				<div className="mb-3">
					<label>Name *</label>
					<div className="input-group ">
						<input
							{...bindJobName}
							type="text"
							class="form-control"
							id="job-name"
							aria-describedby="basic-addon3"
							disabled={editingMode}
						/>
					</div>
					{!editingMode && <ReactiveLabel {...labelJobNameVerify} />}
				</div>

				<div className="mb-3">
					<label>Add Persona</label>
					<div className="input-group">
						<input {...bindPersonaList} type="text" class="form-control" />
					</div>
					<label className={`${styles.bottomHint}`}>
						Multiple persona can be seperated by semicolon (;)
					</label><br />
					{!editingMode && <ReactiveLabel {...labelApolloPersonaVerify} />}
				</div>
				<div className="mb-3">
					<label>Add Email</label>
					<div class="input-group">
						<input {...bindEmailIds} type="text" class="form-control" />
					</div>
					<label className={`${styles.bottomHint}`}>
						Multiple emails can be seperated by semicolon (;)
					</label><br />
					<ReactiveLabel {...labelEmailIdVerify} />
				</div>
				<div className="mb-3">
					<label class="form-check-label" for="exampleCheck1">Traffic Filter</label>
					    <>
						<div class="input-group mt-2">
						    <input value={trafficFilter} onKeyUp={trafficFilterSetNVerify} type="text" class="form-control" />
						</div>
						<label className={`${styles.bottomHint}`}>
						    Filter by minimum amount of traffic
						</label><br />
					    </>
					

				</div>
				<div className="mt-5 d-flex justify-content-center">
					{isSavingData ? (
						<div className="spinner-border text-light" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
					) : (
						<>
							{!editingMode ? (
								<button
									type="button"
									className="btn btn-success"
									disabled={!isSavePossible()}
									onClick={saveData}
								>
									Save Job
								</button>
							) : (
								<button
									type="button"
									className="btn btn-success"
									disabled={!isUpdatePossible()}
									onClick={updateData}
								>
									Update Job
								</button>
							)}
							{editingMode && (
								<button
									type="button"
									className="btn btn-info ms-3"
									onClick={() => { constructAndDisplayWebhookLink(jobData._id) }}
								>Webhook Link</button>
							)}
							<button
								type="button"
								className="btn btn-warning ms-3"
								onClick={() => navigate(-1)}
							>
								Go Back
							</button>
						</>
					)}
				</div>
				<div className="my-2 d-flex justify-content-center">
					<ReactiveLabel {...labelSaveMessage} />
				</div>
			</div>
			{/* hidden element */}
			{editingMode && (
				<DeleteFlow
					showDelete={showDeleteModal}
					setShowDelete={setShowDeleteModal}
					jobData={jobData}
				/>
			)}
			<WebhookLinkModal show={isWebhookLinkModalVisible} setShow={setIsWebhookLinkModalVisible} webhookLink={webhookLink} />
		</div>
	);
};






export default CreateNewWorkflow;
