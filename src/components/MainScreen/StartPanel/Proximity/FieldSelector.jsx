import { useState, useEffect, useMemo, useContext } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { storeleadsDomainDataHelper } from "./ProximityHelper";
import { CreateProximityContext } from "./CreateProximity";
import { HandleAppsTechnology } from "./HandleAppsAndTechnology";
import { deleteFromMutableArrayState, setToMutableArrayState } from "../../../sharedComponents/StateHelpers";

export const FieldSelecter = ({ domainData, selectedFieldValues, setSelectedFieldValues }) => {
	// Domain Data contains data of domain fetched by API
	// SelectedFieldValues , if editing these values are the values which were saved with the job
	// setSelectedFieldValues sets the currently selected Values



	// details contains details fetched from domain through helper
	const [details, setDetails] = useState({})
	// selectedFields contains details that are selected through drop down
	const [selectedFields, setSelectedFields] = useState([])
	// Priority Details contains the details that are to be displayed permanantly
	const priorityDetails = new Set(["categories", "platform", "country_code"])

	//Some keys need to be handled with custom handler
	const customHandleDetails = new Set(["technologies", "apps"])
	const [customHandleAppsTechVals, setCustomHandleAppsTechVals] = useState({})
	const { editingMode } = useContext(CreateProximityContext)

	useEffect(() => {
		if (!domainData || Object.keys(domainData).length === 0) {
			return
		}

		// We have 3 sources which will allow us to pick keys from "transformedData" 
		// We will filter the data into 3 parts 
		// 1 . PriorityDetails are fixed and cannot be changed
		// 2. customHandleDetails are the details that require custom components 
		// 3. selectedFields are the fields which can be either added or deleted
		// In case of editing mode the selected fields can be set once and then moved forward accordingly

		storeleadsDomainDataHelper(domainData)
			.then(transformedData => {
				setDetails(transformedData)
				if (transformedData && Object.keys(transformedData).length) {
					let selected = Object.keys(transformedData).filter(key => !priorityDetails.has(key)
						&& !customHandleDetails.has(key)
						&& !!transformedData[key])
					if (editingMode) {
						selected = selected.filter(r => selectedFieldValues.hasOwnProperty(r))
					}

				        // set handle apps and tech if case they are set
				    let customHandleDetailEdit = {}
				    customHandleDetails.forEach(r=> {
					if(selectedFieldValues[r]){
					    customHandleDetailEdit[r] = selectedFieldValues[r]
					}
				    })
				        
				    setSelectedFields(selected)
				    setCustomHandleAppsTechVals(customHandleDetailEdit)
				}
			})

	}, [domainData])


	useEffect(() => {

		// 

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




			setSelectedFieldValues({
				...data,
				...customHandleAppsTechVals
			})

		}

	}, [details, selectedFields, customHandleAppsTechVals])

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
				{/* Drop Down*/}
				<div className="card-body">
					<h5 className="card-title">Select Fields</h5>
					<div>
						<select className="form-select mb-3" aria-label="Select Fetched Fields"
							placeholder="Select Available Fields"
							onBlur={(obj) => setToMutableArrayState(obj.target.value, selectedFields, setSelectedFields)}
							onChange={(obj) => setToMutableArrayState(obj.target.value, selectedFields, setSelectedFields)}>
							<option disabled selected>Selected Fetched Fields</option>
							{Object.entries(details)
								.filter(([key, value]) => !priorityDetails.has(key) && !customHandleDetails.has(key))
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
						<span className="btn p-0 mx-1 text-danger" onClick={(obj) => deleteFromMutableArrayState(r, selectedFields, setSelectedFields)}>
							<AiFillDelete />

						</span>
					</li>

				))}
				{
					((!!details["apps"] && !!details["apps"].length) || (!!details["technologies"] && !!details["technologies"].length)) && (
					    <HandleAppsTechnology details={details} fields={customHandleAppsTechVals} setFields={setCustomHandleAppsTechVals} />
					)
				}
			</ul>
		</div>

	)

}
