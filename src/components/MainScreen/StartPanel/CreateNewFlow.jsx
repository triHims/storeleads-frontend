import React, { useContext, useEffect, useState } from "react";
import { useInput } from "../../../hooks/useInput";
import styles from "../mainscreen.module.css";
import { fetchDataFromStoreLeadsUrl } from "../../servicecalls/storeleadsapi.js";
import { ReactiveLabel } from "./ReactiveLabel";
import { ExcelPreviewModal } from "./PreviewModal";
import { ApolloPreviewModal, fetchDataFromApollo } from "./ApolloPreviewModal";
import { jobsApi, processError } from "../../servicecalls/serviceApi";
import { breakStringByDelim, verifyEmailIds } from "../../utils/HelperFunctions";
import { useLoaderData, useNavigate } from "react-router-dom";
import AutoModalNormal from "../../sharedComponents/AutoModalNormal";
import { AiFillDelete } from "react-icons/ai";
import { TiCancelOutline } from "react-icons/ti";
import { MainScreenContext } from "../MainScreen";
import { fetchDomainsFromFilter } from "./CreateProximity";

const tableFontColor = {
	color: "black",
};

const redColor = {
	color: "red",
};


async function deleteJob(jobId, setWaiting, successCallBack) {
	if (!jobId) {
		alert("JobId is not found");
		return;
	}
	setWaiting?.(true);
	let response = {};
	try {
		response = await jobsApi.deleteJobByIdJobsDelete(jobId);
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
	console.log(jobData);
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
						onClick={() => deleteJob(jobData.id, setWaiting, closeAndRefresh)}
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

/**
 * @param {string} jobName
 */
async function fetchJobName(jobName) {
	let response = await jobsApi.getJobByNameJobsGet(jobName);
	return response.data ? response.data : {};
}

async function saveJobsData(jobName, storeLeadsUrl, persona, email_id_list, minimum_traffic_count) {
	let data = {
		jobName,
		storeLeadsUrl,
		persona,
		email_id_list,
		minimum_traffic_count
	};

	let response = {};
	try {
		response = await jobsApi.createJobJobsJobPost(data);
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		return errorRes;
	}
	return response;
}

async function updateJobsData(jobId, jobName, storeLeadsUrl, persona, email_id_list, minimum_traffic_count) {
	let data = {
		jobName,
		storeLeadsUrl,
		persona,
		email_id_list,
		minimum_traffic_count
	};

	console.log(persona)

	let response = {};
	try {
		response = await jobsApi.updateJobJobsPut(jobId, data);
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		return errorRes;
	}
	return response;
}

const CreateNewFlow = ({ editingMode }) => {
	/* react router stuff */
	const jobData = useLoaderData();
	const { setrefresh } = useContext(MainScreenContext); // Refresh Main Screen

	useEffect(() => {
		if (editingMode) {
			if (jobData != null && jobData.jobName) {
				setStoreleadsUrl(jobData.storeLeadsUrl);
				setPersonaList(jobData.persona);
				setJobName(jobData.jobName);
				if (jobData.email_id_list && Array.isArray(jobData.email_id_list)) {
					setEmailIds(jobData.email_id_list.join(";"))
				}
				setTrafficFilter(jobData.minimum_traffic_count ? jobData.minimum_traffic_count : 0)
			} else {
				console.error(jobData);
				alert("Something went wrong");
			}
		} else {
			setStoreleadsUrl("");
			setPersonaList("");
			setJobName("");
			setEmailIds("")
		}
		setrefresh();
	}, [editingMode, jobData]);

	/* component stuff */
	const [storeleadsUrl, bindStoreLeads, resetStoreLeads, setStoreleadsUrl] =
		useInput("");
	const [personaList, bindPersonaList, resetPersonaList, setPersonaList] =
		useInput("");
	const [jobName, bindJobName, resetJobName, setJobName] = useInput("");
	const [emailIds, bindEmailIds, resetEmailIds, setEmailIds] = useInput("");
	const [labelStoreLeadsVerify, setLabelStoreLeadsVerify] = useState();
	const [labelEmailIdVerify, setlabelEmailIdVerify] = useState("");
	const [labelJobNameVerify, setLabelJobNameVerify] = useState();

	const [isSavingData, setIsSavingData] = useState(false);

	const [labelSaveMessage, setLabelSaveMessage] = useState();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [trafficFilter, setTrafficFilter] = useState(0);

	const navigate = useNavigate();
	//Storeleads validation
	useEffect(() => {
		if (storeleadsUrl) {
			let timeout = setTimeout(() => {
				setLabelStoreLeadsVerify({ hint: "", message: "Verifying URL..." });
				fetchDataFromStoreLeadsUrl(storeleadsUrl, 2).then((responseBody) => {
					let data = {};
					data = responseBody.data && responseBody.data;
					console.log(data);
					if (data?.data?.length > 0) {
						setLabelStoreLeadsVerify({
							hint: "SUCCESS",
							message: "Storeleads URL is valid",
						});
					} else if (data?.data?.length === 0) {
						setLabelStoreLeadsVerify({
							hint: "",
							message: "Storeleads URL did not fetch any data",
						});
					} else {
						setLabelStoreLeadsVerify({
							hint: "ERROR",
							message: "Invalid Storeleads URL",
						});
					}
				});
			}, 2000);
			return () => {
				clearTimeout(timeout);
			};
		} else {
			setLabelStoreLeadsVerify({});
		}
	}, [storeleadsUrl]);

	//JObs Validation
	useEffect(() => {
		setLabelJobNameVerify({});
		if (jobName.length >= 3) {
			let timeout = setTimeout(() => {
				setLabelJobNameVerify({ hint: "", message: "Verifying..." });
				fetchJobName(jobName).then((responseBody) => {
					if (responseBody?.jobName) {
						setLabelJobNameVerify({
							hint: "ERROR",
							message: "JobName already exists",
						});
					} else {
						setLabelJobNameVerify({
							hint: "SUCCESS",
							message: "Valid Job Name",
						});
					}
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

	const isSavePossible = () => {
		return (
			labelStoreLeadsVerify?.hint === "SUCCESS" &&
			labelJobNameVerify?.hint === "SUCCESS" &&
			labelEmailIdVerify?.hint == "SUCCESS"
		);
	};
	const isUpdatePossible = () => {
		return labelStoreLeadsVerify?.hint === "SUCCESS" &&
			labelEmailIdVerify?.hint == "SUCCESS";
	};

	const saveData = async () => {
		setLabelSaveMessage({ hint: "", message: "Creating Job..." });
		setIsSavingData(true);
		let individualMailArr = breakStringByDelim(emailIds)
		let data = await saveJobsData(jobName, storeleadsUrl, personaList, individualMailArr, trafficFilter);

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

		resetJobName();
		resetStoreLeads();
		resetPersonaList();
		setrefresh();
	};
	const updateData = async () => {
		setLabelSaveMessage({ hint: "", message: "Updating Job..." });
		setIsSavingData(true);
		let emailArr = breakStringByDelim(emailIds)


		let data = await updateJobsData(
			jobData.id,
			jobName,
			storeleadsUrl,
			personaList,
			emailArr,
			trafficFilter
		);

		setIsSavingData(false);

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
			Edit Job
			<div
				style={redColor}
				className="d-inline-block ms-2 "
				onClick={() => setShowDeleteModal(true)}
			>
				<AiFillDelete />
			</div>
		</>
	) : (
		"Create Job"
	);

	const trafficFilterSetNVerify = (event) => {
		let key = event.key;
		let intKey = parseInt(key);

		if (intKey >= 0) {
			setTrafficFilter(r => r * 10 + intKey)
		} else if (key === "Backspace") {
			setTrafficFilter(r => Math.floor(r / 10))
		}
	}

	return (
		<div className="d-flex flex-column  align-items-center h-100">
			<div className="mt-4 w-75">
				<h1 className="display-6 fw-bold mb-3">{headerName}</h1>
				<div className="mb-3">
					<label>Job Name *</label>
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
					<label>Add storeleads Url *</label>
					<div class="input-group ">
						<input
							{...bindStoreLeads}
							type="text"
							class="form-control"
							id="storeleads-url"
							placeholder="https://storeleads.app/json/api/v1/all/domain?*"
							aria-describedby="basic-addon3"
						/>
						<div class="input-group-append">
							<ExcelPreviewModal
								storeleadsUrl={storeleadsUrl}
								isEnabled={labelStoreLeadsVerify?.hint === "SUCCESS"}
							/>
						</div>
					</div>
					<ReactiveLabel {...labelStoreLeadsVerify} />
				</div>
				<div className="mb-3">
					<label>Add Apollo Persona</label>
					<div class="input-group">
						<input {...bindPersonaList} type="text" class="form-control" />
					</div>
					<label className={`${styles.bottomHint}`}>
						Multiple persona can be seperated by semicolon (;)
					</label>
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
					<label class="form-check-label" for="trafficFilter">Traffic Filter</label>
					<>
						<div class="input-group mt-2">
							<input value={trafficFilter} onKeyUp={trafficFilterSetNVerify} type="text" class="form-control" />
						</div>
						<label className={`${styles.bottomHint}`}>
							Filter by minimum amount of traffic
						</label><br />
					</>


				</div>

				<div className="my-3 d-flex justify-content-center">
					<ApolloPreviewModal
					    dataFunction={(filter)=>{return fetchDataFromApollo(storeleadsUrl,filter)}}
						personaList={personaList}
						isEnabled={labelStoreLeadsVerify?.hint === "SUCCESS"}
					/>
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
		</div>
	);
};

export default CreateNewFlow;
