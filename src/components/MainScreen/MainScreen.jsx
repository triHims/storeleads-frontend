import styles from "./mainscreen.module.css";
import JobsSideBar from "./JobsSideBar/JobsSideBar";
import { Outlet } from "react-router-dom";

export const MainScreen = () => {
  return (
    <div className="container-fluid">
      <div className="row h-100">
        <div className="col-2">
          <JobsSideBar />
        </div>
        <div className={`${styles.gptBG} col`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
