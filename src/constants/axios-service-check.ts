import { message } from "antd";
import { AxiosResponse } from "axios";

interface IProps {
    res: AxiosResponse<any, any>
    actionName?: string
    succesMessage?: string
    failMessage?: string | false
    followUpAction?: () => any
    failedAction?: () => any
}
export const axiosServiceCheck = ({
    res,
    actionName,
    followUpAction,
    failedAction,
    succesMessage,
    failMessage

}: IProps) => {

    if(res.status > 199 && res.status < 300){
        if(succesMessage){
            message.success(succesMessage)
        }
        if(actionName && succesMessage === undefined){
            message.success(`${actionName} thành công!`)
        }
        if(followUpAction){
            followUpAction()
        }
    } else {
        if(failMessage === undefined){
            if(actionName){
                message.error(`${actionName} thất bại: ${res.data?.message || res.statusText}`)
            } else {
                message.error(`Hành động thất bại: ${res.data?.message || res.statusText}`)
            }
        } else {
            if(failMessage){
                message.error(failMessage)
            }
        }
        
        if(failedAction){
            failedAction()
        }
    }
}