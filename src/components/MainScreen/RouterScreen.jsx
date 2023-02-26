import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "../Auth/AuthPage";
import { AuthGuard } from "./AuthGuard";
import { Greetings } from "./Greetings";
import JobHistory, { getHistoryData } from "./JobHistory/JobHistory";
import { MainScreen } from "./MainScreen";
import CreateNewFlow from "./StartPanel/CreateNewFlow";
const router = createBrowserRouter([
  {
    path: "",
    element: <AuthGuard />,
    children: [
      {
        path: "",
        element: <MainScreen />,
        children: [
          {
            path: "",
            element: <Greetings />,
            index: true,
          },
          {
            path: "create",
            element: <CreateNewFlow editingMode={false} />,
            index: true,
          },
          {
            path: "edit/:id",
            element: <CreateNewFlow editingMode={true} />,
            index: true,
            loader: getHistoryData,
          },
          {
            path: "job-history/:id",
            element: <JobHistory />,
            index: true,
            loader: getHistoryData,
          },
        ],
      },
      {
        path: "auth/login",
        element: <AuthPage authState={"LOGIN"} />,
      },
      {
        path: "auth/signup",
        element: <AuthPage authState={"SIGNUP"} />,
      },
    ],
  },
]);

export const RouterScreen = () => {
  return <RouterProvider router={router} />;
};
