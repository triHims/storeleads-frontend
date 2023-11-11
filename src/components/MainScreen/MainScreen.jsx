import styles from "./mainscreen.module.css";
import JobsSideBar from "./JobsSideBar/JobsSideBar";
import { Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthProvider";
import { MainScreenContextProvider } from "../sharedComponents/contexts/MainScreenContext";

const MainScreenContainer = () => {
  return (
    <div className="container-fluid">
      <div className="row h-100">
        <div className="col-2">
          <JobsSideBar />
        </div>
        <div className={`${styles.gptBG} col overflow-auto h-100`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export const MainScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  const { user, revalidateLogin } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    if (!user) {
      setIsLoading(false);
      navigate("/auth/login");
    } else {
      revalidateLogin()
        .then((_) => {
          setIsLoading(false);
        })
        .catch((_) => {
          setIsLoading(false);
          navigate("/auth/login");
        });
    }
  }, [user]);

  return (
    <MainScreenContextProvider>
      {isLoading ? (
        <div style={{ alignSelf: "center" }}>
          <div
            className="spinner-grow text-primary"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <MainScreenContainer />
      )}
    </MainScreenContextProvider>
  );
};
