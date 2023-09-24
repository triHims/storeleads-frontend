import { useState, useEffect, useMemo, useContext } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useInput } from "../../../hooks/useInput";
import { proximityJobApi, storeleadsUtl, processError } from "../../servicecalls/serviceApi";
import AutoModalNormal from "../../sharedComponents/AutoModalNormal";
import styles from "../mainscreen.module.css";
import { ReactiveLabel } from "./ReactiveLabel";
import { breakStringByDelim, verifyEmailIds, transformStoreleadsFilters, reverseTransformStoreleadsFilters } from "../../utils/HelperFunctions";

import { useLoaderData, useNavigate } from "react-router-dom";
import { MainScreenContext } from "../MainScreen";
import { ApolloPreviewModal, fetchDataFromApolloWithDomainFilter } from "./ApolloPreviewModal";

export async function getProximityDataById({ params }) {
	//This method is being used by the router to get ProximityData
	let response = {};
	try {
		response = await proximityJobApi.getProximityJobByIdProximityIdGet(params.id);
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		return errorRes;
	}

	return response?.data ? response.data : {};
}

async function saveProximityJob(sourceDomain, jobName, emails, personas, filter) {
	let email_id_list = breakStringByDelim(emails)
	let persona = breakStringByDelim(personas)
	let response = {}
	filter = transformStoreleadsFilters(filter)
	try {
		response = await proximityJobApi.createJobProximityCreatePost({
			sourceDomain,
			jobName,
			email_id_list,
			persona,
			filter
		})
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		throw errorRes;
	}

	console.log(response.data)
	return response;
}

async function updateProximityJob(jobId, emails, personas, filter) {
	let email_id_list = breakStringByDelim(emails)
	let persona = breakStringByDelim(personas)
	let response = {}
	filter = transformStoreleadsFilters(filter)
	try {
		response = await proximityJobApi.updateProximityJobByIdProximityIdPut(jobId, {
			email_id_list,
			persona,
			filter
		})
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		throw errorRes;
	}

	console.log(response.data)
	return response;
}

async function fetchJobName(jobName) {
	let response = {};
	try {
		response = await proximityJobApi.checkJobNameProximityCheckNameGet(jobName)
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		throw errorRes;
	}

	console.log(response.data)
	return response;

}

async function fetchDomainsFromFilter(filterObj) {
	let response = {};
	try {
		response = await storeleadsUtl.getDomainWithFilterStoreleadsUtlPostDomainByFilterPost(filterObj, 10);
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		throw new Error(errorRes);
	}

	console.log(response.data)
	return response;
}




async function getDomainData(domainStr) {
	let response = {};
	try {
		response = await storeleadsUtl.getDomainStoreleadsUtlGetDomainGet(domainStr);
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		throw errorRes;
	}

	return response;

}


async function storeleadsDomainDataHelper(domainObj) {
	let domain = domainObj.domain
	let outputObj = {
		categories: domain?.categories,
		estimated_sales: domain["estimated_sales"],
		employee_count: domain["employee_count"],
		platform: domain["platform"],
		technologies: domain?.technologies?.filter(r => !!r.name).map(r => r.name).join(","),
		apps: domain?.apps?.filter(r => !!r.name && !!r.platform).map(r => `${r.platform}.${r.name}`).join(","),
	}

	if (domain["country_code"]) {
		outputObj["country_code"] = domain["country_code"]
	}

	return outputObj


}

const FieldSelecter = ({ domainData, selectedFieldValues }) => {
	// details contains details fetched from domain through helper
	const [details, setDetails] = useState({})
	// selectedFields contains details that are selected through drop down
	const [selectedFields, setSelectedFields] = useState([])
	// Priority Details contains the details that are to be displayed permanantly
	const priorityDetails = new Set(["categories", "platform", "country_code"])

	useEffect(() => {
		if (!domainData || Object.keys(domainData).length === 0) {
			return
		}
		storeleadsDomainDataHelper(domainData)
			.then(transformedData => {
				setDetails(transformedData)
				if (transformedData && Object.keys(transformedData).length) {
					let selected = Object.keys(transformedData).filter(key => !priorityDetails.has(key) && !!transformedData[key]
					)
					console.log(selected)
					setSelectedFields(selected)
				}
			})

	}, [domainData])


	useEffect(() => {


		if (details && Object.keys(details).length) {
			let data = {}



			priorityDetails.forEach(val => {
				if (details.hasOwnProperty(val)) {
					data[val] = details[val]
				}
			})


			selectedFields.forEach(val => {
				if (details.hasOwnProperty(val)) {
					data[val] = details[val]
				}
			})



			selectedFieldValues(data)

		}

	}, [details, selectedFields])


	const insertDetail = (detailKey) => {
		if (!detailKey)
			return

		if (selectedFields.includes(detailKey)) {
			return
		}

		setSelectedFields(old => {
			return [...old,
				detailKey
			]
		})
	}

	const deleteDetail = (value) => {
		setSelectedFields(old => {
			let temp = old.filter(r => r !== value)
			console.log(temp)
			return [...temp]
		})
	}



	return (
		<div>
			<div className="card" style={{ backgroundColor: "rgb(102,102,102)" }}>
				<div className="card-body">
					<h5 className="card-title">Select Fields</h5>
					<div>
						<select className="form-select mb-3" aria-label="Select Fetched Fields" placeholder="Select Available Fields" onBlur={(obj) => { insertDetail(obj.target.value) }} onChange={(obj) => { insertDetail(obj.target.value) }}>
							<option disabled selected value>Selected Fetched Fields</option>
							{Object.entries(details)
								.filter(([key, value]) => !priorityDetails.has(key))
								.filter(([key, value]) => !!key && !!value)
								.map(([key, value]) => (<option key={key} value={key}>{key}</option>
								))}

						</select>
					</div>
				</div>

			</div>

			<ul className="list-group mt-3">
				{/* Display PriorityFields*/}
				{Object.keys(details).length > 0 && [...priorityDetails].map(targetKey => {
					let finValue = details[targetKey]
					if (!finValue) {
						return;
					}
					if (targetKey === 'categories') {
						finValue = details[targetKey].join(" & ")
					}



					return (
						<li key={targetKey} className="list-group-item d-flex justify-content-between align-items-start">
							<div className="ms-2 me-auto">
								<div className="fw-bold">{targetKey}</div>
								{finValue}
							</div>
						</li>
					)
				})}
				{/* Display selected fields */}
				{selectedFields.map((r, index) => (
					<li key={index + 409} className="list-group-item d-flex justify-content-between align-items-start">
						<div className="ms-2 me-auto overflow-auto">
							<div className="fw-bold">{r}</div>
							<div>{details[r]}</div>
							
						</div>
						<span className="btn p-0 mx-1 text-danger" onClick={() => { deleteDetail(r) }}>
							<AiFillDelete />

						</span>
					</li>

				))}
			</ul>
		</div>

	)

}

const PreviewDomain = ({ showPreviewModal, setShowPreviewModal, jobData }) => {
	const [waiting, setWaiting] = useState(false);
	const [fetchedData, setFetchedData] = useState({})

	useEffect(() => {
		// This useeffects populates the valid jobData
		if (!showPreviewModal) {
			return
		}
		setWaiting(true)
		setFetchedData({})
		console.log("job_data", jobData)

		let filter = transformStoreleadsFilters(jobData)
		fetchDomainsFromFilter(filter).then(res => {
			setFetchedData(res.data)
		}).finally(() => { setWaiting(false) })


	}, [showPreviewModal])

	const tableView = useMemo(() => {
		return (
			<div className="container">
				{waiting ? (
					<div className="d-flex justify-content-center ">
						<div class="spinner-border text-primary" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					</div>
				) : (
					<>
						<span className={`${styles.tableFontColor}`}><b>Number of domains matched: {fetchedData?.totalSize}</b></span>

						<table className={`table ${styles.tableFontColor}`}>
							<thead>
								<tr>
									<th scope="col">Name</th>
									<th scope="col">Title</th>
								</tr>
							</thead>
							<tbody>
								{fetchedData?.data?.map((r, i) =>

									<tr key={i}>
										<td>{r?.cluster_best_ranked}</td>
										<td>{r?.title}</td>
									</tr>

								)}

							</tbody>
						</table>

					</>
				)}
			</div>


		)

	}, [fetchedData, waiting])

	const header = <span className={styles.tableFontColor}>Preview Domain Filter</span>;
	return (
		<AutoModalNormal
			modalState={showPreviewModal}
			setModalState={setShowPreviewModal}
			header={header}
			modalClass="modal-lg"
		>
			{tableView}

		</AutoModalNormal>
	);
};
const CreateProximity = ({ editingMode }) => {
	const [domainName, bindDomainName, resetDomainName, setDomainName] = useInput("");
	const [keywordInput, bindKeywordInput, resetKeywordInput, setKeywordInput] = useInput("");
	const [domainData, setDomainData] = useState(null)
	const [selectedDomainAttributes, setSelectedDomainAttributes] = useState({})
	const [previewDomainModal, showPreviewDomainModal] = useState(false)
	const [isSavingFilter, setIsSavingFilter] = useState(false)


	const [jobName, bindJobName, resetJobName, setJobName] = useInput("");
	const [labelJobNameVerify, setLabelJobNameVerify] = useState();
	const [personaList, bindPersonaList, resetPersonaList, setPersonaList] = useInput("")
	const [emailIds, bindEmailIds, resetEmailIds, setEmailIds] = useInput("");
	const [labelEmailIdVerify, setlabelEmailIdVerify] = useState("");
	const navigate = useNavigate();
	const [isFetchButtonLoading, setIsFetchButtonLoading] = useState(false)


	const [labelSaveMessage, setLabelSaveMessage] = useState();
	const [isSavingData, setIsSavingData] = useState(false);

	// get jobData
	const jobData = useLoaderData()
	const { setrefresh } = useContext(MainScreenContext); // Refresh Main Screen


	const resetComponent = () => {
		resetDomainName();
		resetKeywordInput();
		setSelectedDomainAttributes({});
		resetJobName();
		resetPersonaList();
		resetEmailIds();
		setIsSavingData(false)
	}


	const loadDomainData = (customName) => {
		setIsFetchButtonLoading(true)
		let searchName = domainName;
		if (customName && customName.length) {
			searchName = customName;
		}
		// Requirement set all the fields as soon as the data is fetched
		getDomainData(searchName)
			.then(r => setDomainData(r.data))
			.then(r => alert("Domain Data Fetched"))
			.catch(e => alert("Unable to Fetch Data"))
			.finally(() => setIsFetchButtonLoading(false))
	}
	const isSavePossible = () => {
		return (
			labelJobNameVerify?.hint === "SUCCESS" &&
			labelEmailIdVerify?.hint == "SUCCESS"
		);
	};

	const isUpdatePossible = () => {
		return (
			labelEmailIdVerify?.hint == "SUCCESS"
		);
	};

	const saveData = () => {
		setLabelSaveMessage({ hint: "", message: "Creating Job..." });
		saveProximityJob(domainName, jobName, emailIds, personaList, { ...selectedDomainAttributes, "keyword": keywordInput }).then(r => {
			setLabelSaveMessage({
				hint: "SUCCESS",
				message: "Job successfully created",
			})
			resetComponent();
		}
		).catch(e => {
			console.log(e)
			setLabelSaveMessage({ hint: "ERROR", message: e.statusMessage });
		})
			.finally(f => {
				setrefresh();
				setTimeout(() => {
					setLabelSaveMessage({ hint: "SUCCESS", message: "" });
				}, 30000)
			}

			)


	}

	const updateData = () => {
		setLabelSaveMessage({ hint: "", message: "Update Job..." });
		updateProximityJob(jobData._id, emailIds, personaList, { ...selectedDomainAttributes, "keyword": keywordInput }).then(r => {
			setLabelSaveMessage({
				hint: "SUCCESS",
				message: "Job successfully updated",
			})
		}
		).catch(e => {
			console.log(e)
			setLabelSaveMessage({ hint: "ERROR", message: e.statusMessage });
		})
			.finally(f => {
				setrefresh();
				setTimeout(() => {
					setLabelSaveMessage({ hint: "SUCCESS", message: "" });
				}, 30000)
			}

			)


	}

	// Initial loader function to load states based on editingMode
	useEffect(() => {
		resetComponent()
		if (editingMode) {
			console.log(jobData)
			if (jobData != null && jobData.jobName) {
				console.log(jobData)
				setDomainName(jobData.sourceDomain)
				setJobName(jobData.jobName);
				if (jobData.email_id_list && Array.isArray(jobData.email_id_list)) {
					setEmailIds(jobData.email_id_list.join(";"))
				}
				if (jobData.persona && Array.isArray(jobData.persona)) {
					setPersonaList(jobData.persona.join(";"));
				}
				let filterData = reverseTransformStoreleadsFilters(jobData.filter)
				console.log(filterData)
				setKeywordInput(filterData?.keyword)
				delete filterData["keyword"]
				setSelectedDomainAttributes(filterData)
				loadDomainData(jobData.sourceDomain)

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

	//JObs Validation
	useEffect(() => {
		if (editingMode) {
			return;
		}
		setLabelJobNameVerify({});
		if (jobName.length >= 3) {
			let timeout = setTimeout(() => {
				setLabelJobNameVerify({ hint: "", message: "Verifying..." });
				fetchJobName(jobName).then((responseBody) => {
					setLabelJobNameVerify({
						hint: "SUCCESS",
						message: "Valid Job Name",
					});
				}).catch(r => {
					setLabelJobNameVerify({
						hint: "ERROR",
						message: "JobName already exists",
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
	}, [emailIds, editingMode]);





	return (
		<div className="d-flex flex-column  align-items-center h-100">
			<div className="mt-4 w-75">
				<h1 className="display-6 fw-bold mb-3">Customer Proximity</h1>
				<div className="mb-3">
					<label>Domain Name *</label>
					<div className="input-group ">
						<input
							{...bindDomainName}
							type="text"
							className="form-control"
							id="domain-name"
							aria-describedby="basic-addon3"
							onKeyDown={(event) => {
								if (event.key === 'Enter') {
									loadDomainData()
								}
							}}
							disabled={isSavingFilter || editingMode}
						/>
						{!isSavingFilter &&
							<div className="input-group-append">
								<button type="button" className="btn btn-primary" onClick={loadDomainData}>
									{isFetchButtonLoading ? (
										<div class="spinner-border spinner-border-sm" role="status">
											<span class="visually-hidden">Loading...</span>
										</div>
									) : "Fetch Data"}

								</button>
							</div>
						}
					</div>
				</div>

				{!isSavingFilter && (
					<>
						{!!domainData && <FieldSelecter domainData={domainData} selectedFieldValues={setSelectedDomainAttributes} />}


						{!!domainData &&
							<>
								<div className="mt-5">
									<label>Keyword</label>
									<div className="input-group ">
										<input
											{...bindKeywordInput}
											type="text"
											className="form-control"
											id="keyword-input"
											aria-describedby="basic-addon3"
										/>
									</div>
									<label className={`${styles.bottomHint}`}>
										Multiple persona can be seperated by comma (,)
									</label>
								</div>

								<div className="mt-3 d-flex justify-content-center">
									<button
										type="button"
										className="btn btn-outline-info"
										onClick={() => showPreviewDomainModal(true)}
									>
										Preview Data
									</button>
								</div>
							</>

						}


					</>
				)}

				{isSavingFilter &&

					<>
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
							<ReactiveLabel {...labelJobNameVerify} />
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
						<div className="my-3 d-flex justify-content-center">
							<ApolloPreviewModal
								dataFunction={(filter) => { return fetchDataFromApolloWithDomainFilter({ ...selectedDomainAttributes, "keyword": keywordInput }, filter) }}
								personaList={personaList}
								isEnabled={!!selectedDomainAttributes && Object.keys(selectedDomainAttributes).length > 0}
							/>
						</div>
						<div className="mt-5 d-flex justify-content-center">
							{isSavingData ? (
								<div className="spinner-border text-light" role="status">
									<span className="visually-hidden">Loading...</span>
								</div>
							) : (
								<>
									<button
										type="button"
										className="btn btn-success"
										disabled={!isUpdatePossible()}
										onClick={editingMode ? updateData : saveData}
									>
										{editingMode ? "Update Job" : "Create Job"}
									</button>
								</>
							)}
						</div>
						<div className="my-2 d-flex justify-content-center">
							<ReactiveLabel {...labelSaveMessage} />
						</div>
					</>

				}




				{
					!!selectedDomainAttributes && Object.keys(selectedDomainAttributes).length > 0 && (
						<div className="mt-3 mb-3 d-flex justify-content-center">
							<button
								type="button"
								className="btn btn-info"
								onClick={() => setIsSavingFilter(val => !val)}
							>
								{!isSavingFilter ? "Save Filters" : "Edit Filters"}
							</button>
						</div>)
				}


			</div>

			<PreviewDomain showPreviewModal={previewDomainModal} setShowPreviewModal={showPreviewDomainModal} jobData={{ ...selectedDomainAttributes, "keyword": keywordInput }} />
		</div >


	)

}

export default CreateProximity;
