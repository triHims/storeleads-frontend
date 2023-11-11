const re_mail =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export function ValidateEmail(email) {
  if (email.match(re_mail)) {
    return true;
  }
  return false;
}

const re_valid_Chars = /^[a-zA-Z0-9_\s&]+$/;

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
  return str.split(delim).map((r) => r.trim());
}

export async function verifyEmailIds(emails) {
  let individualMailArr = breakStringByDelim(emails);
  let allVerified = [];

  for (let mail of individualMailArr) {
    if (!ValidateEmail(mail)) {
      allVerified.push(mail);
    }
  }
  return allVerified;
}

export function transformStoreleadsFilters(inputDict) {
  let outputObj = {};

  if (inputDict.categories) {
    outputObj["f:cat"] = inputDict.categories.join(",");
  }
  if (inputDict.estimated_sales) {
    let { min, max } = inputDict.estimated_sales;
    outputObj["f:ermin"] = Math.floor(min);
    outputObj["f:ermax"] = Math.ceil(max);
  }
  if (inputDict.employee_count) {
    let { min, max } = inputDict.employee_count;
    outputObj["f:empcmin"] = Math.floor(min);
    outputObj["f:empcmax"] = Math.ceil(max);
  }
  if (inputDict.platform) {
    outputObj["f:p"] = inputDict.platform;
  }

  if (inputDict.country_code) {
    outputObj["f:cc"] = inputDict.country_code;
  }
  if (inputDict.technologies) {
    outputObj["f:tech"] = inputDict.technologies;
  }
  if (inputDict.apps) {
    outputObj["f:an"] = inputDict.apps;
  }

  if (inputDict.keyword) {
    outputObj["q"] = inputDict.keyword;
  }

  return outputObj;
}

export function getOrDefault(obj,defaultValue){
  if(obj===null || obj===undefined || isNaN(obj)){
    return defaultValue
  }
  return obj
}

export function getOrDefaultArray(obj,defaultValue){
  if(obj===null || obj===undefined || !Array.isArray(obj)){
    return defaultValue
  }
  return obj

}


export function getOrDefaultString(obj:any,defaultValue:string):string{
  if(obj===null || obj===undefined || (typeof obj !== 'string' && !( obj instanceof String ))){
    return defaultValue
  }
  return obj

}


export function reverseTransformStoreleadsFilters(outputDict) {
  const inputDict: Record<string, any> = {};

  if (outputDict["f:cat"]) {
    inputDict.categories = outputDict["f:cat"].split(",");
  }

  if (outputDict.hasOwnProperty( "f:ermin" ) && outputDict.hasOwnProperty( "f:ermax" )) {
    let ermin = parseInt(outputDict["f:ermin"]);
    let ermax = parseInt(outputDict["f:ermax"]);
    inputDict.estimated_sales = { min: getOrDefault(ermin,0), max: getOrDefault(ermax,0) };
  }

  if (outputDict.hasOwnProperty( "f:empcmin" ) && outputDict.hasOwnProperty( "f:empcmax" )) {
    let empcmin = parseInt(outputDict["f:empcmin"]);
    let empcmax = parseInt(outputDict["f:empcmax"]);
    inputDict.employee_count = { min: getOrDefault( empcmin, 0), max: getOrDefault( empcmax, 0) };
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
  if (outputDict["f:tech"]) {
    inputDict.technologies = outputDict["f:tech"];
  }
  if (outputDict["f:an"]) {
    inputDict.apps = outputDict["f:an"];
  }

  return inputDict;
}

export function isTrue(obj: any) {
  if (!obj) {
    return false;
  } else if (Array.isArray(obj)) {
    return !!obj.length;
  } else {
    return !!obj;
  }
}


export function numberStripComma(val:string|null){
  if( typeof val === 'string'){
    return parseInt(val.replaceAll(",",""));
  }
  return null;
}

export function debounceFn(func, wait) {
  let timeout
  return function(...args) {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(context, args), wait)
  }
}
