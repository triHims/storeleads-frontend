import React, { useState, useEffect, useContext } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { jobsApi, processError } from "../../servicecalls/serviceApi";
import EditMailView from "./EditMailView";
import styles from "./jobsSideBar.module.css";
import { FaHistory } from "react-icons/fa";
import { RiEditBoxLine } from "react-icons/ri";
import { MdCreateNewFolder } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { MainScreenContext } from "../MainScreen";

async function getAllJobs() {
  let response = [];
  try {
    let axiosObj = await jobsApi.getAllJobsJobsAllGet();
    response = axiosObj.data;
  } catch (error) {
    console.error(processError(error));
    response = [];
  }

  response.sort((first, second) => second.creation_date - first.creation_date);

  return response;
}

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
            navigateHandle("/job-history/" + r.id);
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
            navigateHandle("/edit/" + r.id);
          }}
        >
          <RiEditBoxLine />
        </button>
      </div>
    </div>
  ));

  setList(locJobList);
};

const SideBarData = () => {
  const [jobsList, setJobList] = useState([]);
  let navigate = useNavigate();

  const { refresh } = useContext(MainScreenContext);
  useEffect(() => {
    populateJobs(setJobList, navigate);
  }, [refresh]);

  return <>{jobsList}</>;
};

const CreateJobButton = () => {
  const navigate = useNavigate();
  return (
    <div
      className={`${styles.clearListDecoration} ${styles.custom__listItem} container`}
      onClick={() => {
        navigate("/create");
      }}
    >
      <b>Create Job</b>
      <span className="float-end me-2">
        <MdCreateNewFolder />
      </span>
    </div>
  );
};

const JobsSideBar = () => {
  return (
    <div className="d-flex flex-column justify-content-between h-100">
      <div className="container">
        <div className="d-flex flex-column">
          <div className="my-2">
            <h5 className="fw-bold">Previous Jobs</h5>
            <div className="ps-2">
              <SideBarData />
            </div>
          </div>
        </div>
      </div>

      <div className={`container mb-5`}>
        <CreateJobButton />
        <EditMailView />
      </div>
    </div>
  );
};

export default JobsSideBar;
