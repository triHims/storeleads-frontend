import { useState, useEffect, useContext} from "react";
import { Modal } from "react-bootstrap";
import { AiFillEdit } from "react-icons/ai";
import { deleteFromMutableArrayState, setToMutableArrayState } from "../../../sharedComponents/StateHelpers";
import styles from "../../mainscreen.module.css";
import { CreateProximityContext } from "./CreateProximity";

export const HandleAppsTechnology = ({ details, fields,setFields }) => {


	const [appsList, setAppsList] = useState([])
	const [technologiesList, setTechnologiesList] = useState([])
	const [visible, setVisible] = useState(false)
	const {editingMode} = useContext(CreateProximityContext)



	useEffect(() => {
	    console.log(fields)
	    if(editingMode){
		if (fields["apps"]) {
		    setAppsList(fields["apps"].split(","))
		} else {
		    setAppsList([])
		}
		if (fields["technologies"]) {
		    setTechnologiesList(fields["technologies"].split(","))
		} else {
		    setTechnologiesList([])
		}
	    }
	    else{
		if (details["apps"]) {
		    setAppsList(details["apps"])
		} else {
		    setAppsList([])
		}
		if (details["technologies"]) {
		    setTechnologiesList(details["technologies"])
		} else {
		    setTechnologiesList([])
		}
	    }
	}, [details])


	useEffect(() => {
		let data = {}
		if (appsList && appsList.length > 0) {
			data["apps"] = appsList.join(",")
		}
		if (technologiesList && technologiesList.length > 0) {
			data["technologies"] = technologiesList.join(",")
		}
		setFields(data)
	}, [appsList, technologiesList])
	// Now display the checkbox for selection of various items


	return (<>
		<li className="list-group-item d-flex justify-content-between align-items-start">
			<div className="ms-2 me-auto overflow-auto">
				<div className="fw-bold">Apps</div>
				<div>{[...appsList, ...technologiesList].join(", ")}</div>

			</div>
			<span className="btn p-0 mx-1 text-danger" onClick={() => { setVisible(true) }}>
				<AiFillEdit />

			</span>
		</li>
		<Modal show={visible} onHide={() => { setVisible(false) }}>
			<Modal.Header closeButton>
				<Modal.Title className={`table ${styles.tableFontColor}`}>Select Apps</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				< div className="form-check">
					{
						[...details["apps"] ?? []].map((items, index) => {

							return (
								<div>
									<input className="form-check-input" type="checkbox" value="" id={`flexCheckApp${index}`}
										onChange={(event) => {
											if (event.target.checked) {
												setToMutableArrayState(items, appsList, setAppsList)
											} else {
												deleteFromMutableArrayState(items, appsList, setAppsList)
											}
										}}
										checked={appsList.includes(items)}
									/>
									<label className={`form-check-label ${styles.tableFontColor}`} for={`flexCheckApp${index}`}>
										{items}
									</label>
								</div>
							)

						})


					}
					{[...details["technologies"] ?? []].map((items, index) => {

						return (
							<div>
								<input className="form-check-input" type="checkbox" value="" id={`flexCheckTech${index}`}
									onChange={(event) => {
										console.log(event.target.checked)
										if (event.target.checked) {
											setToMutableArrayState(items, technologiesList, setTechnologiesList)
										} else {
											deleteFromMutableArrayState(items, technologiesList, setTechnologiesList)
										}
									}}
									checked={technologiesList.includes(items)}
								/>
								<label className={`form-check-label ${styles.tableFontColor}`} for={`flexCheckTech${index}`}>
									{items}
								</label>
							</div>
						)

					})


					}

				</div>

			</Modal.Body>
		</Modal>
	</>

	)

}
