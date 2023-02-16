import React, { useEffect, useState } from 'react'
import { useInput } from '../../../hooks/useInput'
import styles from '../mainscreen.module.css'
import { fetchDataFromStoreLeadsUrl, verifyStoreLeadsUrl } from "../../servicecalls/storeleadsapi.js"
import { ReactiveLabel } from './ReactiveLabel'
import {ExcelPreviewModal} from './PreviewModal'

const CreateNewFlow = () => {

    const [storeleadsUrl, bindStoreLeads] = useInput('')
    const [labelStoreLeadsVerify, setLabelStoreLeadsVerify] = useState()
    useEffect(() => {
        if (storeleadsUrl) {
            let timeout = setTimeout(() => {
                setLabelStoreLeadsVerify({ hint: "", message: "Verifying URL..." })
                fetchDataFromStoreLeadsUrl(storeleadsUrl,2).then(responseBody => {
                    let data = {}
                    data = responseBody.data && responseBody.data
                    console.log(data)
                    if (data?.data?.length > 0) {
                        setLabelStoreLeadsVerify({ hint: "SUCCESS", message: "Storeleads URL is valid" })
                    } else if (data?.data?.length === 0) {
                        setLabelStoreLeadsVerify({ hint: "", message: "Storeleads URL did not fetch any data" })
                    } else {
                        setLabelStoreLeadsVerify({ hint: "ERROR", message: "Invalid Storeleads URL" })
                    }
                })
            }, 2000);
            return () => {
                clearTimeout(timeout)
            }
        } else {
            setLabelStoreLeadsVerify({})
        }
    }, [storeleadsUrl])
    return (
        <div className="d-flex flex-column  align-items-center h-100">
            <div className='mt-4 w-75'>
                <h1 className="display-6 fw-bold mb-3">Create Flow</h1>
                <div>
                    <label >Add storeleads Url *</label>
                    <div class="input-group ">
                        <input {...bindStoreLeads} type="text" class="form-control" id="storeleads-url" placeholder='https://storeleads.app/json/api/v1/all/domain?*' aria-describedby="basic-addon3" />
                        <div class="input-group-append">
                            <ExcelPreviewModal storeleadsUrl={storeleadsUrl}/>
                        </div>
                    </div>
                    <ReactiveLabel {...labelStoreLeadsVerify} />
                </div>
                <div>
                    <label >Add Apollo Persona</label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="apollo Persona" aria-describedby="basic-addon3" />
                    </div>
                    <label className={`${styles.bottomHint} mb-3`} >Multiple persona can be seperated by semicolon (;)</label>
                </div>


                <div className="my-3 d-flex justify-content-center">
                    <button type="button" class="btn btn-outline-info">Fetch Data from apollo</button>
                </div>

                <div className="my-5 d-flex justify-content-center">
                    <button type="button" class="btn btn-success">Save Flow</button>
                    <button type="button" class="btn btn-warning ms-3">Cancel Flow</button>
                </div>

            </div>


        </div>
    )
}

export default CreateNewFlow
