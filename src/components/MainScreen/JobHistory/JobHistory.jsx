import React from "react";
import styles from "./jobHistory.module.css";
import { webhookWorkflowsApi,jobsApi, processError } from "../../servicecalls/serviceApi";
import { useLoaderData } from "react-router-dom";

export async function getHistoryData({ params }) {
  let response = {};
  try {
    response = await jobsApi.getJobByIdJobsIdGet(params.id);
  } catch (e) {
    console.log(e);
    let errorRes = processError(e);
    console.error(errorRes);
    return errorRes;
  }

  return response?.data ? response.data : {};
}

export function requestJobRun(jobId) {
  let response = {};
  jobsApi
    .requestJobRunJobsRequestJobRunGet(jobId, true)
        .then((resp) => {
            response = resp;
            alert("Job run requested")
        })
    .catch((err) => {
      response = processError(err);
      alert(response.statusMessage)
    });

}

const JobHistory = () => {
  const jobData = useLoaderData();
  let historyData = jobData?.runHistory ? (
    jobData.runHistory
      .sort((a, b) => a.lastRunTime - b.lastRunTime)
      .map((data) => {
        return (
          <tr key={data.id}>
            <td className={data.jobExitStatus === -1 && "table-warning"}>
              {data.lastRunTime}
            </td>
            <td className={data.jobExitStatus === -1 && "table-warning"}>
              {data.recordFetchCount}
            </td>
            <td className={data.jobExitStatus === -1 && "table-warning"}>
              {data.jobExitStatus}
            </td>
          </tr>
        );
      })
  ) : (
    <div>{jobData?.statusMessage}</div>
  );

  return (
    <div>
      <div className="mt-4">
        <h1 className="display-6 fw-bold mb-3">Job History</h1>
        <h5>Job - {jobData?.jobName}</h5>
        <button
          type="button"
          onClick={() => {requestJobRun(jobData?.id)}}
          className="btn btn-outline-danger py-1 px-2 mx-2"
        >
          Request Job Run
        </button>

        <div className="d-flex flex-column  align-items-center justify-content-center px-3">
          <div className={styles.table_view}>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Last Run</th>
                  <th scope="col">No of records Fetched</th>
                  <th scope="col">Exit Status</th>
                </tr>
              </thead>
              <tbody>{historyData}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobHistory;
