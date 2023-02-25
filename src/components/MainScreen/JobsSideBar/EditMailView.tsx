import { MdMarkEmailRead } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import { Modal } from "bootstrap/dist/js/bootstrap.esm.min";
import { useInput } from "../../../hooks/useInput";
import {
  ReactiveLabel,
  ReactiveLabelEnum,
  ReactiveLabelHint,
} from "../StartPanel/ReactiveLabel";
import styles from "./emailview.module.css";
import { emailApi, processError, ErrorOb } from "../../servicecalls/serviceApi";
import { EmailDAO } from "../../servicecalls";
import { useEffect, useRef, useState } from "react";
import { ValidateEmail } from "../../utils/HelperFunctions";

const tableFontColor = {
  color: "black",
};

async function getAllEmails() {
  let response = [];
  try {
    let axiosObj = await emailApi.getAllEmailsEmailAllGet(0, 10000);
    response = axiosObj.data;
  } catch (e) {
    console.log(e);
    let errorRes = processError(e);
    console.error(errorRes);
    return errorRes;
  }
  return response;
}

async function deleteMailAdapter(emailIdNumber: number) {
  try {
    let axiosObj = await emailApi.removeEmailByIdEmailIdDelete(emailIdNumber);
    return axiosObj.data;
  } catch (e) {
    console.log(e);
    let errorRes = processError(e);
    console.error(errorRes);
    return errorRes;
  }
}

async function createEmailAdapter(emailId) {
  try {
    let axiosObj = await emailApi.addEmailEmailPost({ email: emailId });
    return axiosObj.data;
  } catch (e) {
    console.log(e);
    let errorRes = processError(e);
    console.error(errorRes);
    return errorRes;
  }
}

const EmailViewItems = ({ shouldRefresh, deleteMail }) => {
  const [emailData, setEmailData] = useState([]);
  useEffect(() => {
    getAllEmails().then((data) => {
      if (Array.isArray(data)) {
        let emailObj = data.map((obj) => (
          <div key={obj.id} className="list-group-item">
            {obj.email}
            <span
              className={`${styles.custom_button} float-end px-2`}
              onClick={() => {
                deleteMail(obj);
              }}
            >
              <RiDeleteBin2Line />
            </span>
          </div>
        ));
        setEmailData(emailObj);
      }
    });
  }, [shouldRefresh]);

  return <>{emailData}</>;
};

const EditMailView = () => {
  const modalRef = useRef();
  const [labelEmailVerify, setLabelEmailVerify] = useState<ReactiveLabelHint>({
    hint: ReactiveLabelEnum.default,
    message: "",
  });
  const [emailInput, bindEmailInput, resetEmailInput] = useInput("");
  const [modalActive, setModalActive] = useState(false);
  const [shouldRefreshEmailView, setShouldRefershEmailView] = useState(0);
  const showModal = () => {
    setModalActive(true);
    const modalEle = modalRef.current;
    const previewModalHandle = new Modal(modalEle, {
      backdrop: "static",
    });

    previewModalHandle.show();
  };
  const hideModal = () => {
    resetEmailInput("");
    const modalEle = modalRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
    setModalActive(false);
  };

  useEffect(() => {
    let timeOutHandle = setTimeout(() => {
      setLabelEmailVerify({ hint: ReactiveLabelEnum.default, message: "" });
      if (emailInput) {
        if (!ValidateEmail(emailInput)) {
          setLabelEmailVerify({ hint: ReactiveLabelEnum.error, message: "Email is invalid" });
        }
      }
    }, 500);
    return () => {
      clearTimeout(timeOutHandle);
    };
  }, [emailInput]);

  const createEmail = async () => {
    let res = await createEmailAdapter(emailInput);
    if ((res as EmailDAO)?.id) {
      alert("Email Created");
      resetEmailInput();
    } else {
      alert((res as ErrorOb).statusMessage);
    }
    setShouldRefershEmailView((old) => old + 1);
  };
  const deleteMail = async (emailDAO: EmailDAO) => {
    let res = await deleteMailAdapter(emailDAO.id);
    if (res as number) {
      if (res === 1) {
        alert("Email deleted");
      } else {
        alert("Unexpected Error");
      }
    } else {
      alert((res as ErrorOb).statusMessage);
    }
    setShouldRefershEmailView((old) => old + 1);
  };

  return (
    <>
      <div className="container" onClick={showModal}>
        <b>Edit Emails</b>
        <span className="float-end me-2">
          <MdMarkEmailRead />
        </span>
      </div>
      <div className="modal fade" tabIndex={-1} ref={modalRef}>
        <div className="modal-dialog">
          {modalActive && (
            <div className="modal-content">
              <div className="modal-header py-2">
                <h5
                  className="modal-title"
                  id="exampleModalLabel"
                  style={tableFontColor}
                >
                  Edit Emails
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={hideModal}
                ></button>
              </div>
              <div className="modal-body "></div>

              <div className="px-3">
                <div className="mb-3">
                  <div className="input-group ">
                    <input
                      {...bindEmailInput}
                      placeholder="email-id"
                      type="text"
                      class="form-control"
                      id="email-input"
                      aria-describedby="basic-addon3"
                    />
                    <button
                      className="btn btn-primary"
                      type="button"
                      id="button-addon2"
                      disabled={!emailInput || !ValidateEmail(emailInput)}
                      onClick={createEmail}
                    >
                      Add
                    </button>
                  </div>
                  <ReactiveLabel {...labelEmailVerify} />
                </div>
                <div className="list-group mt-4 mb-3">
                  <EmailViewItems
                    shouldRefresh={shouldRefreshEmailView}
                    deleteMail={deleteMail}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditMailView;
