import { proximityJobApi, storeleadsUtl, processError } from "../../../servicecalls/serviceApi";
import { curatedAppsFilterList, curatedTechnologyFilterList } from "../../../utils/AppTechnologyFilter";
import { breakStringByDelim, verifyEmailIds, transformStoreleadsFilters, reverseTransformStoreleadsFilters } from "../../../utils/HelperFunctions";

export async function getProximityDataById({ params }) {
	//This method is being used by the router to get ProximityData
	let response = {};
	try {
		response = await proximityJobApi.getProximityJobByIdProximityIdGet(params.id);
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		return errorRes;
	}

	return response?.data ? response.data : {};
}
export async function getProximityRunHistory({ params }) {
	//This method is being used by the router to get ProximityData
	let response = {};
	try {
	    let data = await getProximityDataById({ params })
	    if(data._id){
		response = await proximityJobApi.getProximityJobRunDetailsByIdProximityRunHistoryGet(data._id)
	    }
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		return errorRes;
	}

	return response?.data ? response.data : {};
}

export async function saveProximityJob(sourceDomain, jobName, emails, personas, filter) {
	let email_id_list = breakStringByDelim(emails)
	let persona = breakStringByDelim(personas)
	let response = {}
	filter = transformStoreleadsFilters(filter)
	try {
		response = await proximityJobApi.createJobProximityCreatePost({
			sourceDomain,
			jobName,
			email_id_list,
			persona,
			filter
		})
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		throw errorRes;
	}

	console.log(response.data)
	return response;
}

export async function updateProximityJob(jobId, emails, personas, filter) {
	let email_id_list = breakStringByDelim(emails)
	let persona = breakStringByDelim(personas)
	let response = {}
	filter = transformStoreleadsFilters(filter)
	try {
		response = await proximityJobApi.updateProximityJobByIdProximityIdPut(jobId, {
			email_id_list,
			persona,
			filter
		})
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		throw errorRes;
	}

	console.log(response.data)
	return response;
}

export async function fetchJobName(jobName) {
	let response = {};
	try {
		response = await proximityJobApi.checkJobNameProximityCheckNameGet(jobName)
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		throw errorRes;
	}

	console.log(response.data)
	return response;

}

export async function fetchDomainsFromFilter(filterObj) {
	let response = {};
	try {
		response = await storeleadsUtl.getDomainWithFilterStoreleadsUtlPostDomainByFilterPost(filterObj, 10);
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		throw errorRes;
	}

	console.log(response.data)
	return response;
}




export async function getDomainData(domainStr) {
	let response = {};
	try {
		response = await storeleadsUtl.getDomainStoreleadsUtlGetDomainGet(domainStr);
	} catch (e) {
		console.log(e);
		let errorRes = processError(e);
		console.error(errorRes);
		throw errorRes;
	}

	return response;

}


export async function storeleadsDomainDataHelper(domainObj) {
	let domain = domainObj.domain
	let outputObj = {
		categories: domain?.categories,
		estimated_sales: domain["estimated_sales"],
		employee_count: domain["employee_count"],
		platform: domain["platform"],
		technologies: domain?.technologies?.filter(r => !!r.name && curatedTechnologyFilterList.has(r.name?.trim())).map(r => r.name),
		apps: domain?.apps?.filter(r => !!r.token && !!r.platform && curatedAppsFilterList.has(r?.token?.trim())).map(r => `${r.platform}.${r.token}`),
	}

	if (domain["country_code"]) {
		outputObj["country_code"] = domain["country_code"]
	}

	return outputObj


}

