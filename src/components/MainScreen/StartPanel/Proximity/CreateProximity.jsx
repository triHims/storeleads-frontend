import { useState, useEffect, useContext,createContext } from "react";
import { useInput } from "../../../../hooks/useInput";
import styles from "../../mainscreen.module.css";
import { ReactiveLabel, ReactiveLabelEnum } from "../ReactiveLabel";

import { useLoaderData } from "react-router-dom";
import { MainScreenContext } from "../../MainScreen";
import { ApolloPreviewModal, fetchDataFromApolloWithDomainFilter } from "../ApolloPreviewModal";
import { fetchJobName, getDomainData, saveProximityJob, updateProximityJob } from "./ProximityHelper"
import { FieldSelecter } from "./FieldSelector";
import { PreviewDomain } from "./PreviewDomain"
import { reverseTransformStoreleadsFilters, verifyEmailIds } from "../../../utils/HelperFunctions";


export const CreateProximityContext = createContext({editingMode:null})
const CreateProximity = ({ editingMode }) => {
	const [domainName, bindDomainName, resetDomainName, setDomainName] = useInput("");
	const [keywordInput, bindKeywordInput, resetKeywordInput, setKeywordInput] = useInput("");
	const [domainData, setDomainData] = useState(null)
	const [selectedDomainAttributes, setSelectedDomainAttributes] = useState({})
	const [previewDomainModal, showPreviewDomainModal] = useState(false)
	const [isSavingFilter, setIsSavingFilter] = useState(false)


	const [jobName, bindJobName, resetJobName, setJobName] = useInput("");
	const [labelJobNameVerify, setLabelJobNameVerify] = useState({ hint:"", message: "" });
	const [personaList, bindPersonaList, resetPersonaList, setPersonaList] = useInput("")
	const [emailIds, bindEmailIds, resetEmailIds, setEmailIds] = useInput("");
    const [labelEmailIdVerify, setlabelEmailIdVerify] = useState({ hint:"", message: "" });
	const [isFetchButtonLoading, setIsFetchButtonLoading] = useState(false)


	const [labelSaveMessage, setLabelSaveMessage] = useState({ hint:"", message: "" });
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
		setIsSavingFilter(false)
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
			.then(_ => alert("Domain Data Fetched"))
			.catch(_ => alert("Unable to Fetch Data"))
			.finally(() => setIsFetchButtonLoading(false))
	}


	const isUpdatePossible = () => {
		return (
			labelEmailIdVerify?.hint == ReactiveLabelEnum.success
		   
		);
	};

	const saveData = () => {
		setLabelSaveMessage({ hint: "", message: "Creating Job..." });
		saveProximityJob(domainName, jobName, emailIds, personaList, { ...selectedDomainAttributes, "keyword": keywordInput }).then(() => {
			setLabelSaveMessage({
				hint: ReactiveLabelEnum.success,
				message: "Job successfully created",
			})
			resetComponent();
		}
		).catch(e => {
			console.log(e)
			setLabelSaveMessage({ hint: "ERROR", message: e.statusMessage });
		})
			.finally(() => {
				setrefresh();
				setTimeout(() => {
					setLabelSaveMessage({ hint: ReactiveLabelEnum.success, message: "" });
				}, 30000)
			}

			)


	}

	const updateData = () => {
		setLabelSaveMessage({ hint: "", message: "Update Job..." });
		updateProximityJob(jobData._id, emailIds, personaList, { ...selectedDomainAttributes, "keyword": keywordInput }).then(() => {
			setLabelSaveMessage({
				hint: ReactiveLabelEnum.success,
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
					setLabelSaveMessage({ hint: ReactiveLabelEnum.success, message: "" });
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
		setLabelJobNameVerify({ hint:"", message: "" });
		if (jobName.length >= 3) {
			let timeout = setTimeout(() => {
				setLabelJobNameVerify({ hint: "", message: "Verifying..." });
				fetchJobName(jobName).then((responseBody) => {
					setLabelJobNameVerify({
						hint: ReactiveLabelEnum.success,
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
			setLabelJobNameVerify({ hint:"", message: "" });
		}
	}, [jobName]);
	//Email Id verification
	useEffect(() => {
		setlabelEmailIdVerify({ hint:"", message: "" });
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
							hint: ReactiveLabelEnum.success,
							message: "",
						});
					}
				});
			}, 1000);
			return () => {
				clearTimeout(timeout);
			};
		} else {
			setlabelEmailIdVerify({ hint:"", message: "" });
		}
	}, [emailIds, editingMode]);





	return (
		<CreateProximityContext.Provider value={{ editingMode:editingMode }}>
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
										    <div className="spinner-border spinner-border-sm" role="status">
											    <span className="visually-hidden">Loading...</span>
										    </div>
									    ) : "Fetch Data"}
								    </button>
							    </div>
						    }
					    </div>
				    </div>

				    {!isSavingFilter && (
					    <>
						{!!domainData && <FieldSelecter domainData={domainData} selectedFieldValues={selectedDomainAttributes} setSelectedFieldValues={setSelectedDomainAttributes} />}


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
										    Multiple Keywords can be seperated by comma (,)
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
							    <label>Add Persona</label>
							    <div className="input-group">
								    <input {...bindPersonaList} type="text" class="form-control" />
							    </div>
							    <label className={`${styles.bottomHint}`}>
								    Multiple persona can be seperated by semicolon (;)
							    </label>
						    </div>
						    <div className="mb-3">
							    <label>Add Email</label>
							    <div className="input-group">
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
	    </CreateProximityContext.Provider>


	)

}

export default CreateProximity;
