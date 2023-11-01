import { useEffect } from "react";
import { useInput } from "../../../../hooks/useInput";

export interface Range {
  min: number | undefined;
  max: number | undefined;
}

export function RangeSelectorInput({
  inputName,
  defaultValue,
  range,
  setRangeFunction,
}: {
  inputName: string;
  defaultValue: number;
  range: Range;
  setRangeFunction: (newMin: number, newMax: number) => void;
}) {
  const [minValue, bindMinValue] = useInput(0);
  const [maxValue, bindMaxValue, resetMaxValue, setMaxValue] = useInput(0);

  useEffect(() => {
    if (range?.max) {
      setMaxValue(range.max);
    }
  }, []);

  useEffect(() => {
    setRangeFunction(minValue, maxValue);
  }, [minValue, maxValue]);

  return (
    <div>
      <p>
        <span className="fw-light">Default Value:</span> {defaultValue}
      </p>

      <div className="d-flex justify-content-start">
        <span>
          <div>
            <label className="fs-6 fst-italic">Selected Max Value</label>
            <input
              {...bindMinValue}
              type="text"
              placeholder="min"
              className="form-control"
              id="range-selector-min-input"
              aria-describedby={"range-selector-min-" + inputName}
            />
          </div>
        </span>
        <span className="ms-2">
          <label className="fs-6 fst-italic">Selected Min Value</label>
          <input
            {...bindMaxValue}
            type="text"
            placeholder="max"
            className="form-control"
            id="range-selector-max-input"
            aria-describedby={"range-selector-max-" + inputName}
          />
        </span>
      </div>
    </div>
  );
}
