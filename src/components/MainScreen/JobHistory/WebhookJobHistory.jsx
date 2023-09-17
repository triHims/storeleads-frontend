import React, { useState } from "react";
import styles from "./jobHistory.module.css";
import { webhookWorkflowsApi, jobsApi, processError } from "../../servicecalls/serviceApi";
import { useLoaderData } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { FaHistory } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { copyTextToClipboad } from "../../utils/HelperFunctions";
import { AiFillFileText } from "react-icons/ai";

export async function getWebhookDataById({ params }) {
	//This method is being used by the router to get wenhookData
	let response = {};
	try {
		response = await webhookWorkflowsApi.getWorkflowByIdWorkflowsIdGet(params.id);
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		return errorRes;
	}

	return response?.data ? response.data : {};
}

export async function getHistoryDataWebhook({ params }) {
	//This method is being used by the router to get wenhookData
	let response = {};
	try {
		response = await webhookWorkflowsApi.getAllWorkflowWebhookDataWorkflowsWebhookAllGet(params.id);
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		return errorRes;
	}

	return response?.data ? response.data : {};
}

export async function getWebhookDetailsAndHistory({ params }) {
	let webhookDetails = await getWebhookDataById({ params });
	let historyData = await getHistoryDataWebhook({ params })

	return { webhookDetails, historyData }
}

const tableFontColor = {
	color: "black",
};

function WebhookRawDataModal({ show, setShow, rawData }) {

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
					<Modal.Title style={tableFontColor}> Raw Webhook Push Data </Modal.Title>
				</Modal.Header>
				<Modal.Body style={tableFontColor}>
					Raw Json Pushed<br />
					<div className={styles.code_bg}>
						<code>
							{rawData}
						</code>
					</div>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="primary" onClick={() => copyTextToClipboad(rawData)}>
						Copy
					</Button>
					<Button variant="danger" onClick={handleClose}>Close</Button>
				</Modal.Footer>
	}
			</Modal>
		</>
	);
}
const WebhookJobHistory = () => {
	const { webhookDetails, historyData } = useLoaderData();
	const [showRawHistory, setShowRawHistory] = useState(false)
	const [rawHistoryStr, setRawHistoryStr] = useState("")
	console.info({ webhookDetails, historyData })
	const setRawDataAndShowModal = (data) => {
		let localdata = JSON.stringify(data?.data, null, 4)
		setRawHistoryStr(localdata)
		setShowRawHistory(true)
	}
	let historyDataView = !!historyData && historyData.data ? (

		historyData.data
			.sort((a, b) => a.pushDate - b.pushDate)
			.map((data) => {
			    console.log(data.pushDate)
				return (
					<tr key={data.id}>
						<td>
						    {data?.pushDate.toString()}
						</td>
						<td>
							{data?.data?.installs?.length}
						</td>
						<td>
							{data?.data?.uninstalls?.length ? data.data.uninstalls.length : 0}
						</td>
						<td>
							{data?.data?.start_at}
						</td>
						<td>
							{data?.data?.end_at}
						</td>
						<td className={data?.installed_processed ? styles.font_green : styles.font_red}>
							{data?.installed_processed ? "Data Processed" : "Pending"}
						</td>
						<td className={data?.installed_processed ? styles.font_green : styles.font_red}>
							<button
								type="button"
								className="btn btn-dark p-1 lh-1"
								onClick={() => {
									// Webhook History
									setRawDataAndShowModal(data)

								}}
							>
								<AiFillFileText />
							</button>

						</td>
					</tr>
				);
			})
	) : (
		<div>No Push to this webhook yet</div>
	);

	return (
		<div>
			<div className="mt-4">
				<h1 className="display-6 fw-bold mb-3">Job History</h1>
				<h5>WorkFlow Name - {webhookDetails?.jobName}</h5>

				<div className="d-flex flex-column  align-items-center justify-content-center px-3">
					<div className={styles.table_view}>
						<table className="table">
							<thead>
								<tr>
									<th scope="col">Data Push Date</th>
									<th scope="col">No of Installs</th>
									<th scope="col">No of Uninstalls</th>
									<th scope="col">From Date</th>
									<th scope="col">To Date</th>
									<th scope="col">Process Status</th>
									<th scope="col">Raw Json</th>
								</tr>
							</thead>
							<tbody>{historyDataView}</tbody>
						</table>
					</div>
				</div>
			</div>
			<WebhookRawDataModal show={showRawHistory} setShow={setShowRawHistory} rawData={rawHistoryStr} />
		</div>
	);
};

export default WebhookJobHistory;
