import axios from "axios";
import qs from 'qs'

import {BASE_PATH} from "../servicecalls/base"

export async function fetchDataFromStoreLeadsUrl(storeLeadsUrl, pageSize) {
    let response
    try {
        response = await axios.get(BASE_PATH + "/storeleadsUtl/getDataFromStoreLeads", { params: { storeleadsURL: storeLeadsUrl, pageSize: pageSize } })
    } catch (error) {
        console.error(error)
        response = {}
    }
    return response

}


export async function getDataFromApollo(storeLeadsDomain, personas, pageSize) {
    let response
    try {
        response = await axios.get(BASE_PATH + "/apolloUtl/getDataFromApollo", {
            params: { domains: storeLeadsDomain, personas: personas, pageSize: pageSize },
            paramsSerializer: {
                serialize: ( params ) => qs.stringify(params, { arrayFormat: 'repeat' })
            }

        })
    }
    catch (error) {
        console.error(error)
        response = {}
    }
    return response

}
