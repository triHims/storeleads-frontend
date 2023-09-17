const re_mail =
	/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export function ValidateEmail(email) {
	if (email.match(re_mail)) {
		return true;
	}
	return false;
}


const re_valid_Chars = /^[a-zA-Z0-9_\s&]+$/

export function validate_valid_chars(text) {
	if (text.match(re_valid_Chars)) {
		return true;
	}
	return false;
}


export function copyTextToClipboad(text) {
	// Get the text field
	// Copy the text inside the text field
	navigator.clipboard.writeText(text);

	// Alert the copied text
	alert("Copied the text: " + text);
}

export function breakStringByDelim(str, delim = ";") {

	return str.split(delim).map(r => r.trim())
}

export async function verifyEmailIds(emails) {
	let individualMailArr = breakStringByDelim(emails)
	let allVerified = []

	for (let mail of individualMailArr) {
		if (!ValidateEmail(mail)) {
			allVerified.push(mail)
		}
	}
	return allVerified

}

export function transformStoreleadsFilters(inputDict) {


	let outputObj = {}

	if (inputDict.categories) {
		outputObj["f:cat"] = inputDict.categories.join(",")
	}
	if (inputDict.estimated_sales) {
		let sales = inputDict.estimated_sales
		let salesMin = sales * 0.9
		let salesMax = sales * 1.1
		outputObj["f:ermin"] = Math.floor(salesMin)
		outputObj["f:ermax"] = Math.ceil(salesMax)
	}
	if (inputDict.employee_count) {
		debugger;
		let empCnt = inputDict.employee_count
		let empCntMin = empCnt * 0.9
		let empCntMax = empCnt * 1.1
		outputObj["f:empcmin"] = Math.floor(empCntMin)
		outputObj["f:empcmax"] = Math.ceil(empCntMax)

	}
	if (inputDict.platform) {
		outputObj["f:p"] = inputDict.platform
	}

	if (inputDict.country_code) {
		outputObj["f:cc"] = inputDict.country_code
	}

	if (inputDict.keyword) {
		outputObj["q"] = inputDict.keyword
	}

	return outputObj

}
export function reverseTransformStoreleadsFilters(outputDict) {
	const inputDict: Record<string, any> = {};

	if (outputDict["f:cat"]) {
		inputDict.categories = outputDict["f:cat"].split(",");
	}

	if (outputDict["f:ermin"] && outputDict["f:ermax"]) {
		let ermin = parseInt(outputDict["f:ermin"]);
		let ermax = parseInt(outputDict["f:ermax"]);
		inputDict.estimated_sales = (ermin + ermax) / 2;
	}

	if (outputDict["f:empcmin"] && outputDict["f:empcmax"]) {
		let empcmin = parseInt(outputDict["f:empcmin"]);
		let empcmax = parseInt(outputDict["f:empcmax"]);
		inputDict.employee_count = (empcmin + empcmax) / 2;
	}

	if (outputDict["f:p"]) {
		inputDict.platform = outputDict["f:p"];
	}

	if (outputDict["f:cc"]) {
		inputDict.country_code = outputDict["f:cc"];
	}

	if (outputDict.q) {
		inputDict.keyword = outputDict.q;
	}

	return inputDict;
}
