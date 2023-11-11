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

function shiftToDecimalPlace(num: number, place: number) {
  if (place > 0 || place < 0) return num * Math.pow(10, place);
  else return num;
}

export function RangeSelectorInput({
  compType,
  inputName,
  defaultValue,
  defaultRange,
  range,
  setRangeFunction,
}: RangeSelectInputType) {
  const valState = {
    min: shiftToDecimalPlace(
      getOrDefault(range?.min, defaultRange.min),
      compType === RangeCompType.FLOAT ? -2 : 0
    ),
    max: shiftToDecimalPlace(
      getOrDefault(range?.max, defaultRange.max),
      compType === RangeCompType.FLOAT ? -2 : 0
    ),
  };

  let formattedDefaultValue = shiftToDecimalPlace(
    getOrDefault(defaultValue, 0),
    compType === RangeCompType.FLOAT ? -2 : 0
  );

  let minValue = valState["min"];
  let maxValue = valState["max"];

  const setMinValue = (val) => {
    val = getOrDefault(val, 0);
    val = shiftToDecimalPlace(val, compType === RangeCompType.FLOAT ? 2 : 0);
    setRangeFunction(val, range?.max);
  };
  const setMaxValue = (val) => {
    val = getOrDefault(val, 0);
    val = shiftToDecimalPlace(val, compType === RangeCompType.FLOAT ? 2 : 0);
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
