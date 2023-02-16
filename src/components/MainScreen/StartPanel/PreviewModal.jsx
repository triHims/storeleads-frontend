import React, { useRef,useState } from 'react'
import { Modal } from 'bootstrap/dist/js/bootstrap.esm.min'
import { fetchDataFromStoreLeadsUrl } from '../../servicecalls/storeleadsapi'


const tableFontColor = {
    color: "black"
}


const TablePrev = () => {

    return (
        <div className="container">
            <table class="table" style={tableFontColor}>
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Handle</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td colspan="2">Larry the Bird</td>
                        <td>@twitter</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

async function fetchDataFromStoreLeadsUrlAsync(storeleadsUrl) {
    let data = await fetchDataFromStoreLeadsUrl(storeleadsUrl)
    console.log(data)
}


export const ExcelPreviewModal = ({ storeleadsUrl }) => {
    const modalRef = useRef()
    const apiData = null;

    const [tableModel, setTableModel] = useState({
        tableData: [],
        totalRows: 0
    })

    const showModal = () => {
        if (!storeleadsUrl) {
            console.log("Storeleads is empty")
            return
        }
        const modalEle = modalRef.current;
        const previewModalHandle = new Modal(modalEle, {
            backdrop: 'static',
        });

        fetchDataFromStoreLeadsUrlAsync(storeleadsUrl)
            .then(response => {
                let data = {}
                console.log(response)
                data = response?.data
                let tableDataArr = data?.data;
                let totalTableRows = data?.totalSize

                let finalTableRows = tableDataArr.map(obj=>({
                    "name": obj.name,
                    "title":obj.title,
                    "country": obj.country_code,
                    "description": obj.description

                }))

                console.log(finalTableRows)
                setTableModel({
                    tableData: finalTableRows,
                    totalRows: totalTableRows
                })

            })
        previewModalHandle.show();


    }
    const hideModal = () => {
        const modalEle = modalRef.current;
        const bsModal = Modal.getInstance(modalEle);
        bsModal.hide();
    }

    return (

        <div>
            <button type="button" className="btn btn-primary" onClick={showModal}>
                Preview
            </button>

            <div className="modal fade" tabIndex="-1" ref={modalRef}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header py-2">
                            <h5 className="modal-title" id="exampleModalLabel" style={tableFontColor}>Storeleads Data</h5>
                            <button type="button" className="btn-close" onClick={hideModal}></button>
                        </div>
                        <div className="modal-body">
                            <TablePrev  tableModel={tableModel}/>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

