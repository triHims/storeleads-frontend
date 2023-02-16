import axios from "axios";

const BASEURL = "http://localhost:8000/"
export async function verifyStoreLeadsUrl(storeLeadsUrl) {
    let response
    try {
        response = await axios.get(BASEURL + "storeleadsUtl/verifyStoreLeadsUrl", { params: { storeleadsURL: storeLeadsUrl } })
    } catch (error) {
        console.error(error)
        response = {}
    }
    return response

}

export async function fetchDataFromStoreLeadsUrl(storeLeadsUrl,pageSize) {
    let response
    try {
        response = await axios.get(BASEURL + "storeleadsUtl/getDataFromStoreLeads", { params: { storeleadsURL: storeLeadsUrl, pageSize: pageSize } })
    } catch (error) {
        console.error(error)
        response = {}
    }
    return response

}
