import { useState, useEffect, useMemo} from "react";
import AutoModalNormal from "../../../sharedComponents/AutoModalNormal";
import { transformStoreleadsFilters } from "../../../utils/HelperFunctions";
import { fetchDomainsFromFilter } from "./ProximityHelper";
import styles from "../../mainscreen.module.css";

export const PreviewDomain = ({ showPreviewModal, setShowPreviewModal, jobData }) => {
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
