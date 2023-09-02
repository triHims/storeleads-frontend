import { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useInput } from "../../../hooks/useInput";
import { storeleadsUtl, processError } from "../../servicecalls/serviceApi";




async function getDomainData(domainStr) {
	let response = {};
	try {
		response = await storeleadsUtl.getDomainStoreleadsUtlGetDomainGet(domainStr);
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		return errorRes;
	}

	console.log(response.data)
	return response;

}


async function storeleadsDomainDataHelper(domainObj) {

	console.log(domainObj)
	let domain = domainObj.domain
	let outputObj = {
		category: domain["categories"],
		estimated_sales: domain["estimated_sales"],
		employee_count: domain["employee_count"],
		platform: domain["platform"]
	}


	return outputObj


}

const redColor = {
	color: "red",
};

const FieldSelecter = ({ domainData }) => {
	const [details, setDetails] = useState({})
	const [selectedFields, setSelectedFields] = useState([])
	useEffect(() => {
		storeleadsDomainDataHelper(domainData)
			.then(r => setDetails(r))

	}, [domainData])

	const insertDetail = (detailKey) => {
		setSelectedFields(old => old.push({ key: detailKey, value: details[detailKey] }))
	}

	return (
		<div>
			<div className="card" style={{ backgroundColor: "rgb(102,102,102)" }}>
				<div class="card-body">
					<h5 class="card-title">Select Fields</h5>
					<div>
						<select class="form-select mb-3" aria-label="Select Fetched Fields">
							<option selected>Select Avilable Fields</option>
							{Object.entries(details)
								.map(([key, value]) => (<option value="{ key }">{key}</option>
								))}

						</select>
					</div>
				</div>

			</div>
			<ul class="list-group mt-3">
				{selectedFields.map(r => (
					<li class="list-group-item d-flex justify-content-between align-items-start">
						<div class="ms-2 me-auto">
						    <div class="fw-bold">{r.key}</div>
							r.value
						</div>
						<span class="badge bg-primary rounded-pill">

							<div
								className="d-inline-block ms-2 "
								onClick={() => { }}
							></div>
						</span>
					</li>

				))}
				<li class="list-group-item d-flex justify-content-between align-items-start">
					<div class="ms-2 me-auto">
						<div class="fw-bold">Category</div>
						Apparel
					</div>
					<span class="badge bg-primary rounded-pill">

						<div
							className="d-inline-block ms-2 "
							onClick={() => { }}
						></div>
					</span>
				</li>
				<li class="list-group-item d-flex justify-content-between align-items-start">
					<div class="ms-2 me-auto">
						<div class="fw-bold">Country</div>
						US
					</div>
					<span class="badge bg-primary rounded-pill">

						<div
							className="d-inline-block ms-2 "
							onClick={() => { }}
						></div>
					</span>
				</li>
				<li class="list-group-item d-flex justify-content-between align-items-start">
					<div class="ms-2 me-auto">
						<div class="fw-bold">Platform</div>
						Custom
					</div>
					<span class="btn p-0 mx-1 text-danger">
						<AiFillDelete />

					</span>
				</li>
			</ul>
		</div>

	)

}

const CreateProximity = () => {
	const [domainName, bindDomainName, resetDomainName, setDomainName] = useInput("");
	const [domainData, setDomainData] = useState(null)


	const loadDomainData = () => {
		getDomainData(domainName)
			.then(r => setDomainData(r.data))
			.then(r => alert("Domain Data Fetched"))
			.catch(e => alert("Unable to Fetch Data"))
	}




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
							class="form-control"
							id="domain-name"
							aria-describedby="basic-addon3"
						/>
						<div class="input-group-append">
							<button type="button" className="btn btn-primary" onClick={loadDomainData}>
								Fetch Data
							</button>
						</div>
					</div>
				</div>

				{domainData && <FieldSelecter domainData={domainData} />}

			</div>
		</div>


	)

}

export default CreateProximity;
