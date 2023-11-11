import { debounceFn } from "../utils/HelperFunctions";
import { useState } from "react";
/**
 * This funciton takes a number and returns array of 3 parts
 * ["num","decimal"]
 */
function validNumber(e) {
  let notANumber = /[^0-9]*/g;
  let sp = e.split(".");
  let num = sp[0];
  let dec = sp[1];
  if (num.length === 0) {
    num = "0";
  } else {
    num = num.replace(notANumber, "");

    //trim extra leading zero
    let leadingzeroTrim = /(^0*)([0-9]+)$/;
    num = num.replace(leadingzeroTrim, "$2");
  }

  if (!dec || dec.length === 0) {
    return [num, ""];
  } else {
    dec = dec.replace(notANumber, "");
    let endingZeroTrim = /(0*)(0$)/;
    dec = dec.replace(endingZeroTrim, "$2");
    return [num, dec];
  }
}

function inputCommaInNumber(str: string) {
  if (!str || str.length === 0) {
    return str;
  }
  return parseInt(str).toLocaleString();
}

function handleComma(inpElement: React.ChangeEvent<HTMLInputElement>, fn) {
  let inp = inpElement.target.value;

  inp = inp.replaceAll(",", "");

  let [num, dec] = validNumber(inp);
  let final = null;
  let indexOfDot = inp?.indexOf(".");

  num = inputCommaInNumber(num);
  

  if (!!inp && inp.length >= 0 && indexOfDot > -1) {
    final = (num.length ? num : "0") + "." + (dec.length ? dec : "");
  } else {
    final = num.length ? num : "0";
  }
  fn(final);
  return final;
}

export type NumberInputType = {
  inputName: string;
  defaultValue: number;
  onChange: (number: number | typeof NaN) => void;
};

export function NumberInput({
  inputName,
  defaultValue,
  onChange,
}: NumberInputType) {

  let debOnchange = debounceFn((input) => {
    let finVal = parseFloat(input.replaceAll(",", ""));
    if (finVal != null && !isNaN(finVal)) {
      onChange(finVal);
    }
  }, 1000);

  const [state, setstate] = useState(defaultValue.toLocaleString());
  let finVal = null;

  return (
    <input
      value={state}
      onChange={(e) => {
        finVal = handleComma(e, setstate);
	debOnchange(finVal)
      }}
      type="text"
      placeholder="min"
      className="form-control"
      id="range-selector-min-input"
      aria-describedby={"range-selector-min-" + inputName}
    />
  );
}
