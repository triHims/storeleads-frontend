import styles from "./mainscreen.module.css";
import JobsSideBar from "./JobsSideBar/JobsSideBar";
import { Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthProvider";

export const MainScreenContext = React.createContext(null);
const MainScreenContainer = () => {
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
export const MainScreen = () => {
  const [refresh, setrefresh] = useState(0);

  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user]);

  return (
    <MainScreenContext.Provider
      value={{ refresh, setrefresh: () => setrefresh((r) => r + 1) }}
    >
      <MainScreenContainer />
    </MainScreenContext.Provider>
  );
};
