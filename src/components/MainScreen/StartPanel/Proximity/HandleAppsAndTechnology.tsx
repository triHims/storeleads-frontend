import { useState} from "react";
import { Modal } from "react-bootstrap";
import { AiFillEdit } from "react-icons/ai";
import {
  deleteFromMutableState,
  setToMutableState,
} from "../../../sharedComponents/StateHelpers";
import styles from "../../mainscreen.module.css";
import {
  getOrDefaultArray,
  getOrDefaultString,
} from "../../../utils/HelperFunctions";

enum WidgetType {
  APPS = "apps",
  TECHNOLOGIES = "technologies",
}
export const HandleAppsTechnology = ({ details, fields, setFields }) => {
  const [visible,setVisible] = useState(false)
  //DomainAppList DomainTechList - > comes from domain data passed as `details`
  const domainAppList = getOrDefaultArray(details[WidgetType.APPS], []);
  const domainTechnologyList = getOrDefaultArray(
    details[WidgetType.TECHNOLOGIES],
    []
  );
  
  const selectedApps = getOrDefaultString(fields[WidgetType.APPS], "").split(",").filter(r=> !!r);

  const selectedTechnologies = getOrDefaultString(fields[WidgetType.TECHNOLOGIES], "").split(",").filter(r=> !!r);
  
  const combinedTech = selectedApps.concat(selectedTechnologies).filter(r=> !!r)
  

  const removeFrom = (target: WidgetType, ele: string) => {
    let finalSelect = "";
    if (target === WidgetType.APPS) {
      finalSelect = selectedApps.filter((r) => !!r && r !== ele).join(",");
      setToMutableState({ [WidgetType.APPS]: finalSelect }, fields, setFields);
    } else {
      finalSelect = selectedTechnologies.filter((r) => !!r && r !== ele).join(",");
      setToMutableState(
        { [WidgetType.TECHNOLOGIES]: finalSelect },
        fields,
        setFields
      );
    }
  };

  const addTo = (target: WidgetType, ele: string) => {
    let finalSelect = "";
    if (target === WidgetType.APPS) {
      finalSelect = [...selectedApps, ele].join(",");
      setToMutableState({ [WidgetType.APPS]: finalSelect }, fields, setFields);
    } else {
      finalSelect = [...selectedTechnologies, ele].join(",");
      setToMutableState(
        { [WidgetType.TECHNOLOGIES]: finalSelect },
        fields,
        setFields
      );
    }
  };
  
  

  const ratioDisplay = `[${combinedTech.length}/${domainAppList.length+domainTechnologyList.length}]`
  
  return (
    <>
      <li className="list-group-item d-flex justify-content-between align-items-start">
        <div className="ms-2 me-auto overflow-auto">
          <div className="fw-bold">Apps - {ratioDisplay}</div>
          <div>{combinedTech.join(", ")}</div>
        </div>
        <span
          className="btn p-0 mx-1 text-danger"
          onClick={() => {
            setVisible(true);
          }}
        >
          <AiFillEdit />
        </span>
      </li>
      <Modal
        show={visible}
        onHide={() => {
          setVisible(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className={`table ${styles.tableFontColor}`}>
            Select Apps
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-check">
            {domainAppList.map((items, index) => {
              return (
                <div>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id={`flexCheckApp${index}`}
                    onChange={(event) => {
                      if (event.target.checked) {
                        addTo(WidgetType.APPS, items);
                      } else {
                        removeFrom(WidgetType.APPS, items);
                      }
                    }}
                    checked={selectedApps.includes(items)}
                  />
                  <label
                    className={`form-check-label ${styles.tableFontColor}`}
                    for={`flexCheckApp${index}`}
                  >
                    {items}
                  </label>
                </div>
              );
            })}
            {domainTechnologyList.map((items, index) => {
              return (
                <div>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id={`flexCheckTech${index}`}
                    onChange={(event) => {
                      if (event.target.checked) {
                        addTo(WidgetType.TECHNOLOGIES, items);
                      } else {
                        removeFrom(WidgetType.TECHNOLOGIES, items);
                      }
                    }}
                    checked={selectedTechnologies.includes(items)}
                  />
                  <label
                    className={`form-check-label ${styles.tableFontColor}`}
                    htmlFor={`flexCheckTech${index}`}
                  >
                    {items}
                  </label>
                </div>
              );
            })}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
