import React, { useState } from "react";
import styles from "./jobHistory.module.css";
import { useLoaderData } from "react-router-dom";

const tableFontColor = {
	color: "black",
};

const ProximityJobHistory = () => {
	const jobDetails = useLoaderData();
	const historyData = null;
	console.log(jobDetails)
	let historyDataView = !!jobDetails&& !!jobDetails.run_history ? (

		jobDetails.run_history
			.sort((a, b) => a.run_date - b.run_date)
			.map((data) => {
				console.log(data.pushDate)
				return (
					<tr key={data.id}>
						<td>
							{data?.run_date}
						</td>
						<td>
							{data?.datafetched}
						</td>
					</tr>
				);
			})
	) : (
		<div>Job is pending to be processed</div>
	);

	return (
		<div>
			<div className="mt-4">
				<h1 className="display-6 fw-bold mb-3">Job History</h1>
				<h5>Job Name - {jobDetails?.jobName}</h5>

				<div className="d-flex flex-column  align-items-center justify-content-center px-3">
					<div className={styles.table_view}>
						<table className="table">
							<thead>
								<tr>
									<th scope="col">Run Date</th>
									<th scope="col">Records Fetched</th>
								</tr>
							</thead>
							<tbody>{historyDataView}</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProximityJobHistory;
