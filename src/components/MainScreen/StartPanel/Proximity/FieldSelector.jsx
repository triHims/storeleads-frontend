import { useState, useEffect, useContext, useCallback } from "react";
import { AiFillDelete } from "react-icons/ai";
import { storeleadsDomainDataHelper } from "./ProximityHelper";
import { HandleAppsTechnology } from "./HandleAppsAndTechnology";
import {
  deleteFromMutableState,
  setToMutableState,
} from "../../../sharedComponents/StateHelpers";
import { RangeSelectorInput, RangeCompType } from "./RangeSelectorInput";
import { useCreateProximityProvider } from "../../../sharedComponents/contexts/CreateProximityContext";
import styles from "../../mainscreen.module.css";

export const FieldSelecter = ({
  domainData,
  proximityFieldValues,
  setProximityFieldValues,
}) => {
  // Domain Data contains data of domain fetched by API
  // proximityFieldValues , if editing these values are the values which were saved with the job
  // setProximityFieldValues sets the currently selected Values

  // details contains details fetched from domain through helper
  const [transformedDetails, setTransformedDetails] = useState({});
  // selectedFields contains details that are selected through drop down
  const [selectedFields, setSelectedFields] = useState([]);
  // Priority Details contains the details that are to be displayed permanantly
  const priorityDetails = new Set(["categories", "platform", "country_code"]);

  //Some keys need to be handled with custom handler
  const customHandleDetails = new Set(["technologies", "apps"]);
  const { editingMode } = useCreateProximityProvider();

  useEffect(() => {
    if (!domainData || Object.keys(domainData).length === 0) {
      return;
    }

    // We have 3 sources which will allow us to pick keys from "transformedData"
    // We will filter the data into 3 parts
    // 1 . PriorityDetails are fixed and cannot be changed
    // 2. customHandleDetails are the details that require custom components
    // 3. selectedFields are the fields which can be either added or deleted
    // In case of editing mode the selected fields can be set once and then moved forward accordingly

    storeleadsDomainDataHelper(domainData).then((transformedData) => {
      setTransformedDetails(transformedData);
      if (transformedData && Object.keys(transformedData).length) {
        let selected = Object.keys(transformedData).filter(
          (key) =>
            !priorityDetails.has(key) &&
            !customHandleDetails.has(key) &&
            !!transformedData[key]
        );
        if (editingMode) {
          selected = selected.filter((r) =>
            proximityFieldValues.hasOwnProperty(r)
          );
        }

        // set handle apps and tech if case they are set
        let customHandleDetailEdit = {};
        customHandleDetails.forEach((r) => {
          if (proximityFieldValues[r]) {
            customHandleDetailEdit[r] = proximityFieldValues[r];
          }
        });

        setSelectedFields(selected);
      }
    });
  }, [domainData]);

  const updateProximityValues = (currentSelectedFields) => {
    //Fields in selectedFields but not in proximity

    const requiredFields = currentSelectedFields.filter(
      (field) => !proximityFieldValues.hasOwnProperty(field)
    );
    const toBeRemovedFields = Object.keys(proximityFieldValues).filter(
      (key) => !currentSelectedFields.includes(key) && !priorityDetails.has(key)
    );

    if (transformedDetails && Object.keys(transformedDetails).length) {
      let data = {};

      priorityDetails.forEach((val) => {
        if (transformedDetails.hasOwnProperty(val)) {
          data[val] = transformedDetails[val];
        }
      });

      requiredFields.forEach((val) => {
        if (transformedDetails.hasOwnProperty(val)) {
          data[val] = transformedDetails[val];
        }
      });

      toBeRemovedFields.forEach((field) => {
        delete data[field];
      });

      setProximityFieldValues({
        ...data,
      });
    }
  };

  const addToSelectedFieldsAndUpdate = (field) => {
    if (selectedFields.includes(field)) {
      return;
    }
    const currentSelectedFeild = [...selectedFields, field];
    updateProximityValues(currentSelectedFeild);
    setSelectedFields(currentSelectedFeild);
  };

  const deletedFromSelectedFields = (field) => {
    let temp = selectedFields.filter((r) => r !== field);
    console.log(temp);
    updateProximityValues(temp);
    setSelectedFields(temp);
  };

  return (
    <div>
      <div className="card" style={{ backgroundColor: "rgb(102,102,102)" }}>
        {/* Drop Down*/}
        <div className="card-body">
          <h5 className="card-title">Select Fields</h5>
          <div>
            <select
              className="form-select mb-3"
              aria-label="Select Fetched Fields"
              placeholder="Select Available Fields"
              onBlur={(obj) => {
                addToSelectedFieldsAndUpdate(obj.target.value);
              }}
              onChange={(obj) => addToSelectedFieldsAndUpdate(obj.target.value)}
            >
              <option disabled selected>
                Selected Fetched Fields
              </option>
              {Object.entries(transformedDetails)
                .filter(
                  ([key, value]) =>
                    !priorityDetails.has(key) && !customHandleDetails.has(key)
                )
                .filter(([key, value]) => !!key && !!value)
                .map(([key, value]) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      <ul className="list-group mt-3">
        {/* Display PriorityFields*/}
        {Object.keys(transformedDetails).length > 0 &&
          [...priorityDetails].map((targetKey) => {
            let finValue = transformedDetails[targetKey];
            if (!finValue) {
              return;
            }
            if (targetKey === "categories") {
              finValue = transformedDetails[targetKey].join(" & ");
            }

            return (
              <li
                key={targetKey}
                className="list-group-item d-flex justify-content-between align-items-start"
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{targetKey}</div>
                  {finValue}
                </div>
              </li>
            );
          })}
        {/* Display selected fields */}
        {selectedFields.map((r, index) => {
          const innerWidget =
            r === "employee_count" || r === "estimated_sales" ? (
              <RangeSelectorInput
                compType={
                  r === "estimated_sales"
                    ? RangeCompType.FLOAT
                    : RangeCompType.INT
                }
                inputName={r}
                defaultValue={transformedDetails[r]}
                defaultRange={{ min: 0, max: transformedDetails[r] }}
                range={{
                  min: proximityFieldValues[r]?.min,
                  max: proximityFieldValues[r]?.max,
                }}
                setRangeFunction={(min, max) =>
                  setToMutableState(
                    { [r]: { min, max } },
                    proximityFieldValues,
                    setProximityFieldValues
                  )
                }
              />
            ) : (
              <div>{transformedDetails[r]}</div>
            );

          let customHeading = r;
          if (r === "estimated_sales") {
            customHeading = (
              <>
                <span>{r}</span>{" "}
                <span
                  className={"ms-2 text-danger fw-lighter " + styles.mini_text}
                >
                  USD/mo
                </span>
              </>
            );
          }

          return (
            <li
              key={index + 409}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto overflow-auto">
                <div className="fw-bold">{customHeading}</div>
                {innerWidget}
              </div>
              <span
                className="btn p-0 mx-1 text-danger"
                onClick={() => deletedFromSelectedFields(r)}
              >
                <AiFillDelete />
              </span>
            </li>
          );
        })}
        {((!!transformedDetails["apps"] &&
          !!transformedDetails["apps"].length) ||
          (!!transformedDetails["technologies"] &&
            !!transformedDetails["technologies"].length)) && (
          <HandleAppsTechnology
            details={transformedDetails}
            fields={proximityFieldValues}
            setFields={setProximityFieldValues}
          />
        )}
      </ul>
    </div>
  );
};
