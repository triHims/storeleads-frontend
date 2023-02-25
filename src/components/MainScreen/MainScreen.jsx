import styles from "./mainscreen.module.css";
import JobsSideBar from "./JobsSideBar/JobsSideBar";
import { Outlet } from "react-router-dom";
import React,{ useState } from "react";

export const MainScreenContext = React.createContext(null);
export const MainScreen = () => {
    const [refresh,setrefresh] = useState(0)
  return (
    <MainScreenContext.Provider value ={{refresh,setrefresh:()=>setrefresh(r=>r+1)}}>
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
    </MainScreenContext.Provider>
  );
};
