import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "../Auth/AuthPage";
import { AuthGuard } from "./AuthGuard";
import { Greetings } from "./Greetings";
import JobHistory, { getHistoryData } from "./JobHistory/JobHistory";
import { MainScreen } from "./MainScreen";
import CreateNewFlow from "./StartPanel/CreateNewFlow";
import CreateNewWorkflow from "./StartPanel/CreateNewWebhook";
const router = createBrowserRouter(
  [
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
              path: "jobs/create",
              element: <CreateNewFlow editingMode={false} />,
            },
            {
              path: "jobs/edit/:id",
              element: <CreateNewFlow editingMode={true} />,
              loader: getHistoryData,
            },
            {
              path: "jobs/job-history/:id",
              element: <JobHistory />,
              loader: getHistoryData,
            },
          ],
        },
	{
	    path:"workflow",
	    element: <MainScreen />,
	    children: [
		{
		    path: "create",
		    element: <CreateNewWorkflow editingMode={false}/>,
		    index: true
		}
	    ]

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
  ],
  {
    basename: process.env.REACT_APP_CONTEXT_PATH,
  }
);

export const RouterScreen = () => {
  return <RouterProvider router={router} />;
};
