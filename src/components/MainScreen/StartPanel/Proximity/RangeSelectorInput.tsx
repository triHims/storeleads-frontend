import {
  getOrDefault,
  numberStripComma,
  debounceFn,
} from "../../../utils/HelperFunctions";
import { NumberInput } from "../../../sharedComponents/NumberInput";

export interface Range {
  min: number | undefined;
  max: number | undefined;
}

export enum RangeCompType {
  FLOAT,
  INT,
}

type RangeSelectInputType = {
  compType: RangeCompType;
  inputName: string;
  defaultValue: number;
  defaultRange: Range;
  range: Range;
  setRangeFunction: (newMin: number, newMax: number) => void;
};

function round(num, decimalPlaces = 0) {
    num = Math.round(num + "e" + decimalPlaces);
    return Number(num + "e" + -decimalPlaces);
}
function shiftToDecimalPlace(num: number, place: number) {
  if (place > 0 || place < 0) return num * Math.pow(10, place);
  else return num;
}

function shiftToDecimalPlacePercision2(num: number, place: number) {
  return round(shiftToDecimalPlace(num,place),2)
}
/**
* RangeSelectorInput
* 
*  compType, - Controls weather ranges are either Float or Integer, (Not both Currently)
*  inputName,- Name to be used in the input
*  defaultValue, - Value to be shown in the default value column
*  defaultRange, - Values to be set as default in min and max range input boxes if range is null or not defined
*  range, - Current value of ranges(Most likely a state somewhere)
*  setRangeFunction,  - Used to set the state ; State is a composite of min and max
*/
export function RangeSelectorInput({
  compType,
  inputName,
  defaultValue,
  defaultRange,
  range,
  setRangeFunction,
}: RangeSelectInputType) {

  const valState = {
    min: shiftToDecimalPlacePercision2(
      getOrDefault(range?.min, defaultRange.min),
      compType === RangeCompType.FLOAT ? -2 : 0
    ),
    max: shiftToDecimalPlacePercision2(
      getOrDefault(range?.max, defaultRange.max),
      compType === RangeCompType.FLOAT ? -2 : 0
    ),
  };

  let formattedDefaultValue = shiftToDecimalPlacePercision2(
    getOrDefault(defaultValue, 0),
    compType === RangeCompType.FLOAT ? -2 : 0
  );

  let minValue = valState["min"];
  let maxValue = valState["max"];

  const setMinValue = (val) => {
    val = getOrDefault(val, 0);
    val = shiftToDecimalPlacePercision2(val, compType === RangeCompType.FLOAT ? 2 : 0);
    setRangeFunction(val, range?.max);
  };
  const setMaxValue = (val) => {
    val = getOrDefault(val, 0);
    val = shiftToDecimalPlacePercision2(val, compType === RangeCompType.FLOAT ? 2 : 0);
    setRangeFunction(range?.min, val);
  };

  return (
    <div>
      <p>
        <span className="fw-light">Default Value:</span> {formattedDefaultValue}
      </p>

      <div className="d-flex justify-content-start">
        <span>
          <div>
            <label className="fs-6 fst-italic">Selected Min Value</label>
            <NumberInput inputName={"minInput-"+inputName} defaultValue={minValue} onChange={(value)=>{setMinValue(value)}}/>
          </div>
        </span>
        <span className="ms-2">
          <label className="fs-6 fst-italic">Selected Max Value</label>
            <NumberInput inputName={"maxInput-"+inputName} defaultValue={maxValue} onChange={(value) => {
              setMaxValue(value);
            }}/>
        </span>
      </div>
    </div>
  );
}
