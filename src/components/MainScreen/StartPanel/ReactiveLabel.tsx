import styles from '../mainscreen.module.css'
export enum ReactiveLabelEnum {
    error = "ERROR",
    success = "SUCCESS",
    default = "DEFAULT"
}
export interface ReactiveLabelHint {
    hint: ReactiveLabelEnum;
    message: string;

}

export const ReactiveLabel = ({ hint = "", message = "" }: { hint: ReactiveLabelEnum | string, message: string }) => {
    const processHint = (hint: string) => {
        switch (hint) {
            case "ERROR":
                return styles.bottomHint__invalid
            case "SUCCESS":
                return styles.bottomHint__valid
            default:
                return styles.bottomHint
        }
    }
    if(message){
    return (<label className={ processHint(hint) } > { message } </label>)
    }
}

