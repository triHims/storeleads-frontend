import React, { useRef, useState, useMemo } from "react";
import { Modal } from "bootstrap/dist/js/bootstrap.esm.min";
import { storeleadsUtl, apolloApiUtl } from "../../servicecalls/serviceApi";

const tableFontColor = {
	color: "black",
};

const TablePrev = ({ tableModel }) => {
	console.log(tableModel);
	const tableVals = useMemo(() => {
		let retModel = tableModel.tableRows
			? tableModel.tableRows.map((element, i) => {
				return (
					<tr key={i}>
						<td>{element?.name}</td>
						<td>{element?.title}</td>
						<td>{element?.headline}</td>
						<td>{element?.organization}</td>
						<td>{element?.email}</td>
					</tr>
				);
			})
			: [];

		retModel.push(
			<tr>
				<th scope="col" colSpan={4}>
					This is just the apporixmation data ,
					Please check complete data yourself.
				</th>
			</tr>
		);
		return retModel;
	}, [tableModel]);
	return (
		<div className="container">
			<table class="table" style={tableFontColor}>
				<thead>
					<tr>
						<th scope="col">Name</th>
						<th scope="col">Title</th>
						<th scope="col">Headline</th>
						<th scope="col">Organization</th>
						<th scope="col">Email</th>
					</tr>
				</thead>
				<tbody>{tableVals}</tbody>
			</table>
		</div>
	);
};

export async function fetchDataFromApolloWithDomainFilter(domainFilter, personaList) {
	let response = await storeleadsUtl.getDomainWithFilterStoreleadsUtlPostDomainByFilterPost(domainFilter, 20);
	console.log(personaList);

	let tableDataArr = response?.data?.data ? response.data.data : [];

	let finalTableDataArr = tableDataArr.map((obj) => obj.name);
	let apolloResponse =
		await apolloApiUtl.getDataFromApolloApolloUtlGetDataFromApolloGet(
			finalTableDataArr,
			personaList,
			20
		);
	console.log(apolloResponse);
	let mappedApolloArr = apolloResponse?.data?.data.map((obj) => ({
		name: obj.name,
		title: obj.title,
		headline: obj.headline,
		organization: obj.organization?.name,
		email: obj.email,
	}));
	return {
		totalEntries: apolloResponse?.data.totalEntries,
		tableRows: mappedApolloArr,
	};
}
export async function fetchDataFromApollo(storeleadsUrl, personaList) {
	let response =
		await storeleadsUtl.getDataFromStoreleadsStoreleadsUtlGetDataFromStoreLeadsGet(
			storeleadsUrl,
			20,
		);
	console.log(personaList);

	let tableDataArr = response?.data?.data ? response.data.data : [];

	let finalTableDataArr = tableDataArr.map((obj) => obj.name);
	let apolloResponse =
		await apolloApiUtl.getDataFromApolloApolloUtlGetDataFromApolloGet(
			finalTableDataArr,
			personaList,
			20
		);
	console.log(apolloResponse);
	let mappedApolloArr = apolloResponse?.data?.data.map((obj) => ({
		name: obj.name,
		title: obj.title,
		headline: obj.headline,
		organization: obj.organization?.name,
		email: obj.email,
	}));
	return {
		totalEntries: apolloResponse?.data.totalEntries,
		tableRows: mappedApolloArr,
	};
}

function convertSemiColonList(params) {
	return params.split(";").map((obj) => obj.trim());
}

export const ApolloPreviewModal = ({
	dataFunction,
	personaList,
	isEnabled,
}) => {
	const modalRef = useRef();

	const [tableModel, setTableModel] = useState({});

	const [isloading, setIsLoading] = useState(false);

	const showModal = () => {
		const modalEle = modalRef.current;
		const previewModalHandle = new Modal(modalEle, {
			backdrop: "static",
		});

		setIsLoading(true);
	    console.log(dataFunction)
		dataFunction(convertSemiColonList(personaList)).then(
			(data) => {
				setTableModel(data);
				setIsLoading(false);
			}
		);
		previewModalHandle.show();
	};
	const hideModal = () => {
		setTableModel([]);

		const modalEle = modalRef.current;
		const bsModal = Modal.getInstance(modalEle);
		bsModal.hide();
	};

	return (
		<div>
			<button
				type="button"
				className="btn btn-outline-info"
				onClick={showModal}
				disabled={!isEnabled}
			>
				Fetch Data from Apollo
			</button>

			<div className="modal fade" tabIndex="-1" ref={modalRef}>
				<div className="modal-dialog modal-fullscreen">
					<div className="modal-content">
						<div className="modal-header py-2">
							<h5
								className="modal-title"
								id="exampleModalLabel"
								style={tableFontColor}
							>
								Apollo Preview Data
							</h5>
							<button
								type="button"
								className="btn-close"
								onClick={hideModal}
							></button>
						</div>
						<div className="modal-body">
							{!isloading ? (
								<TablePrev tableModel={tableModel} />
							) : (
								<>
									<h3 style={tableFontColor}>Data Loading</h3>
									<div class="spinner-border text-primary" role="status">
										<span class="visually-hidden">Loading...</span>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
