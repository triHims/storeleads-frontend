import { debounceFn } from "../utils/HelperFunctions";
import { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
/**
 * This funciton takes a number and returns array of 3 parts
 * ["num","decimal"]
 */

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

  let change = (finVal) => {
    if (finVal != null && !isNaN(finVal)) {
      onChange(finVal);
    }
  };

  return (
    <NumericFormat
      placeholder="min"
      className="form-control"
      id="range-selector-min-input"
      aria-describedby={"range-selector-min-" + inputName}
      thousandsGroupStyle="thousand"
      thousandSeparator=","
      value={defaultValue.toLocaleString()}
      onValueChange={(values, sourceInfo) => {
	change(values.value)
      }}
    />
  );
}
