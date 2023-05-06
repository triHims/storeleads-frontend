import {useState} from "react"
import { Button, Modal } from "react-bootstrap";
import { AiFillHome } from "react-icons/ai";
import { useAuth } from "../../../Auth/AuthProvider";
import styles from "../jobsSideBar.module.css"
import {useNavigate} from "react-router-dom"
import "./UserCard.css"
const tableFontColor = {
	color: "black",
};

const redColor = {
	color: "red",
};

function UserDetailModalPreview({show,setShow,authGroup}:{show:boolean,setShow:(inp:boolean)=>void,authGroup:{user,logout}}) {
  const {user,logout} = authGroup;

  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {firstname,lastname,email} = user?.user

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
	<Modal.Header closeButton>
	    <Modal.Title style={tableFontColor}>User Details</Modal.Title>
	</Modal.Header>
          <Modal.Body style={tableFontColor}>
				  <div className="row">
					  <div className="col-3 text-right">
						  <strong>Name:</strong>
					  </div>
					  <div className="col-9">
						  {firstname + " " + lastname}
					  </div>
				  </div>
				  <div className="row">
					  <div className="col-3 text-right">
						  <strong>Email:</strong>
					  </div>
					  <div className="col-9">
						  {email}
					  </div>
				  </div>
        </Modal.Body>
        <Modal.Footer>
      <Button variant="danger" onClick={()=>{logout().then(_=>{navigate("/")})
					    }}>
            Sign Out
          </Button>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const ImageComp = (<div className="image-cropper">
		<img className="image"  src="/profile_dummy.png" />
	</div>)
export const UserCard = () => {
  const [isDetailsVisible,setIsDetailsVisible] = useState(false)
  const auth = useAuth();
  const {firstname,lastname} = auth.user?.user;

	return (
		<div
			className={`${styles.clearListDecoration} custom__listItem container`}
			onClick={() => {
			  setIsDetailsVisible(!isDetailsVisible)
			}}
		>
	    <span className="overflow-hidden">
			{firstname + " " + lastname}
	    </span>
			<span className="float-end me-1">
				{ImageComp}
			</span>
	    <UserDetailModalPreview show={isDetailsVisible} setShow={setIsDetailsVisible} authGroup={auth}/>
		</div>
	);
};

