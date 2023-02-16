import styles from './mainscreen.module.css'
import flowIcon from '../../assets/icons8-process-64.png'
import { useState } from 'react'
import CreateNewFlow from './StartPanel/CreateNewFlow'
export const MainScreen = () => {
    const [shouldCreate,setShouldCreate] = useState(false)
    return (
            <div className="container-fluid">
                <div className="row h-100">
                    <div className="col-3"></div>
                    <div className={`${styles.gptBG} col-9`}>
                     {shouldCreate?(<CreateNewFlow/>):(<OptionsView setShouldCreate={setShouldCreate}/>)}
                    </div>
                </div>

            </div>
    )
}


export const OptionsView = ({setShouldCreate}) => {

    return (
        <div className="d-flex flex-column  align-items-center justify-content-center h-100">
            {/* Logo */}
            <span className="d-flex mb-3">
                <img src={flowIcon} width="64" height="64" alt="flow-icon" />
                <span>
                    <h3 className="mx-3 mt-4">Flow Automator</h3>
                </span>
            </span>
            {/* button */}
            <button type="button" className="btn btn-success" onClick={()=>setShouldCreate(true)}>Create a Flow</button>

        </div>
    )
}

