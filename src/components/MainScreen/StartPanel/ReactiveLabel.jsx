import styles from '../mainscreen.module.css'
export const ReactiveLabel = ({ hint = "", message = "" }) => {
    const processHint = (hint) => {
        switch (hint) {
            case "ERROR":
                return styles.bottomHint__invalid
            case "SUCCESS":
                return styles.bottomHint__valid
            default:
                return styles.bottomHint
        }
    }
    if (message) {
        return (
            <>
                <label className={processHint(hint)}>{message}</label>
            </>
        )
    } else {
        return <></>
    }
}

