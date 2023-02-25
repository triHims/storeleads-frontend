import React, { useRef, useState, useMemo } from 'react'
import { Modal } from 'bootstrap/dist/js/bootstrap.esm.min'
import { fetchDataFromStoreLeadsUrl } from '../../servicecalls/storeleadsapi'


const tableFontColor = {
    color: "black"
}


const TablePrev = ({ tableModel }) => {

    console.log(tableModel)
    const tableVals = useMemo(() => {
        return tableModel?.tableData?.map(element => {
            return (

                <tr key={element?.title}>
                    <td scope="col">{element?.title}</td>
                    <td scope="col">{element?.name}</td>
                    <td scope="col">{element?.description}</td>
                    <td scope="col">{element?.country}</td>
                </tr>
            )
        });
    }, [tableModel])
    return (
        <div className="container">
            <table class="table" style={tableFontColor}>
                <thead>
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Country</th>
                    </tr>
                </thead>
                <tbody>
                    {tableVals}
                    <tr>
                        <th scope="col" colSpan={4}>Total Number of rows in query {tableModel.totalRows ? tableModel?.totalRows : 0}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

async function fetchDataFromStoreLeadsUrlAsync(storeleadsUrl) {
    let response = await fetchDataFromStoreLeadsUrl(storeleadsUrl, 10)
    let data = {}
    data = response?.data

    console.log(data)
    let tableDataArr = data?.data;
    let totalTableRows = data?.totalSize

    let finalTableData = tableDataArr.map(obj => ({
        "name": obj.name,
        "title": obj.title,
        "country": obj.country_code,
        "description": obj.description

    }))
    return { totalTableRows, finalTableData }
}


export const ExcelPreviewModal = ({ storeleadsUrl, isEnabled }) => {
    const modalRef = useRef()

    const [tableModel, setTableModel] = useState({
        tableData: [],
        totalRows: 0
    })

    const [isloading, setIsLoading] = useState(false)

    const showModal = () => {
        if (!storeleadsUrl) {
            console.log("Storeleads is empty")
            return
        }
        const modalEle = modalRef.current;
        const previewModalHandle = new Modal(modalEle, {
            backdrop: 'static',
        });

        setIsLoading(true)
        fetchDataFromStoreLeadsUrlAsync(storeleadsUrl, 10)
            .then(data => {
                setTableModel({
                    tableData: data.finalTableData,
                    totalRows: data.totalTableRows
                })
                setIsLoading(false)

            })
        previewModalHandle.show();


    }
    const hideModal = () => {
        setTableModel({
            tableData: [],
            totalRows: 0
        })

        const modalEle = modalRef.current;
        const bsModal = Modal.getInstance(modalEle);
        bsModal.hide();
    }

    return (

        <div>
            <button type="button" className="btn btn-primary" onClick={showModal} disabled={!isEnabled}>
                Preview
            </button>

            <div className="modal fade" tabIndex="-1" ref={modalRef}>
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">
                        <div className="modal-header py-2">
                            <h5 className="modal-title" id="exampleModalLabel" style={tableFontColor}>Storeleads Data</h5>
                            <button type="button" className="btn-close" onClick={hideModal}></button>
                        </div>
                        <div className="modal-body">
                            {!isloading ? (<TablePrev tableModel={tableModel} />) : (
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
    )
}

