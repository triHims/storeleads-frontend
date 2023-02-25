import React, { useContext, useEffect, useState } from "react";
import { useInput } from "../../../hooks/useInput";
import styles from "../mainscreen.module.css";
import { fetchDataFromStoreLeadsUrl } from "../../servicecalls/storeleadsapi.js";
import { ReactiveLabel } from "./ReactiveLabel";
import { ExcelPreviewModal } from "./PreviewModal";
import { ApolloPreviewModal } from "./ApolloPreviewModal";
import { jobsApi, processError } from "../../servicecalls/serviceApi";
import { useLoaderData, useNavigate } from "react-router-dom";
import AutoModalNormal from "../../sharedComponents/AutoModalNormal";
import { AiFillDelete } from "react-icons/ai";
import { TiCancelOutline } from "react-icons/ti";
import { MainScreenContext } from "../MainScreen";

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
        <div className="spinner-border text-light" role="status">
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

async function saveJobsData(jobName, storeLeadsUrl, persona) {
  let data = {
    jobName,
    storeLeadsUrl,
    persona,
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

async function updateJobsData(jobId, jobName, storeLeadsUrl, persona) {
  let data = {
    jobName,
    storeLeadsUrl,
    persona,
  };

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
      } else {
        console.error(jobData);
        alert("Something went wrong");
      }
    } else {
      setStoreleadsUrl("");
      setPersonaList("");
      setJobName("");
    }
    setrefresh();
  }, [editingMode]);

  /* component stuff */
  const [storeleadsUrl, bindStoreLeads, resetStoreLeads, setStoreleadsUrl] =
    useInput("");
  const [personaList, bindPersonaList, resetPersonaList, setPersonaList] =
    useInput("");
  const [jobName, bindJobName, resetJobName, setJobName] = useInput("");
  const [labelStoreLeadsVerify, setLabelStoreLeadsVerify] = useState();
  const [labelJobNameVerify, setLabelJobNameVerify] = useState();

  const [isSavingData, setIsSavingData] = useState(false);

  const [labelSaveMessage, setLabelSaveMessage] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const isSavePossible = () => {
    return (
      labelStoreLeadsVerify?.hint === "SUCCESS" &&
      labelJobNameVerify?.hint === "SUCCESS"
    );
  };
  const isUpdatePossible = () => {
    return labelStoreLeadsVerify?.hint === "SUCCESS";
  };

  const saveData = async () => {
    setLabelSaveMessage({ hint: "", message: "Creating Job..." });
    setIsSavingData(true);
    let data = await saveJobsData(jobName, storeleadsUrl, personaList);

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
    let data = await updateJobsData(
      jobData.id,
      jobName,
      storeleadsUrl,
      personaList
    );

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
  };

  const headerName = editingMode ? (
    <>
      Edit Flow
      <div
        style={redColor}
        className="d-inline-block ms-2 "
        onClick={() => setShowDeleteModal(true)}
      >
        <AiFillDelete />
      </div>
    </>
  ) : (
    "Create Flow"
  );

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
          <label className={`${styles.bottomHint} mb-3`}>
            Multiple persona can be seperated by semicolon (;)
          </label>
        </div>

        <div className="my-3 d-flex justify-content-center">
          <ApolloPreviewModal
            storeleadsUrl={storeleadsUrl}
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
                  Save Flow
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-success"
                  disabled={!isUpdatePossible()}
                  onClick={updateData}
                >
                  Update Flow
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
