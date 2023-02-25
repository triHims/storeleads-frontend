import { Modal } from "bootstrap/dist/js/bootstrap.esm.min";
import { useCallback, useEffect, useState } from "react";

const AutoModalNormal = ({
  modalState,
  setModalState,
  header,
  children,
}: {
  modalState: any;
  setModalState: any;
  header: any;
  children: any;
}) => {
  const [bsModalRef, setBSModalRef] = useState();

  const setModalRef = useCallback((elem) => {
    setBSModalRef(elem);
  }, []);

  const helperShowModal = (modalEle) => {
    if (!modalEle) return;

    const previewModalHandle = new Modal(modalEle, {
      backdrop: "static",
    });

    previewModalHandle.show();
  };

  const helperHideModal = (modalEle) => {
    if (!modalEle) return;
    const bsModal = Modal.getInstance(modalEle);
    bsModal?.hide();
  };

  /* iF based con currentModalState , call showModal */

  useEffect(() => {
    if (!bsModalRef) return;
    modalState && helperShowModal(bsModalRef);

    return () => {
      helperHideModal(bsModalRef);
    };
  }, [bsModalRef, modalState]);

  return (
    <>
      <div className="modal fade" tabIndex={-1} ref={setModalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header py-2">
              {header}
              <button
                type="button"
                className="btn-close"
                onClick={() => setModalState(false)}
              ></button>
            </div>
            <div className="modal-body ">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AutoModalNormal;
