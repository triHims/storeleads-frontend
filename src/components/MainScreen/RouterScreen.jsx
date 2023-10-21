import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "../Auth/AuthPage";
import { AuthGuard } from "./AuthGuard";
import { Greetings } from "./Greetings";
import JobHistory, { getHistoryData } from "./JobHistory/JobHistory";
import ProximityJobHistory from "./JobHistory/ProximityJobHistory";
import WebhookJobHistory, { getWebhookDataById, getWebhookDetailsAndHistory } from "./JobHistory/WebhookJobHistory";
import { MainScreen } from "./MainScreen";
import CreateNewFlow from "./StartPanel/CreateNewFlow";
import CreateNewWorkflow from "./StartPanel/CreateNewWebhook";
import CreateProximity from "./StartPanel/Proximity/CreateProximity";
 import { getProximityDataById, getProximityRunHistory } from "./StartPanel/Proximity/ProximityHelper"

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
					path: "workflow",
					element: <MainScreen />,
					children: [
						{
							path: "create",
							element: <CreateNewWorkflow editingMode={false} />,
							index: true
						},
						{
							path: "edit/:id",
							element: <CreateNewWorkflow editingMode={true} />,
							loader: getWebhookDataById
						},
						{
							path: "job-history/:id",
							element: <WebhookJobHistory />,
							loader: getWebhookDetailsAndHistory
						}
					]

				},
				{
					path: "proximity",
					element: <MainScreen />,
					children: [
						{
							path: "create",
							element: <CreateProximity editingMode={false} />,
							index: true
						},
						{
							path: "edit/:id",
							element: <CreateProximity editingMode={true} />,
							loader: getProximityDataById
						},
						{
							path: "job-history/:id",
							element: <ProximityJobHistory/>,
							loader: getProximityRunHistory
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
		basename: process.env.PUBLIC_URL
	}
);

export const RouterScreen = () => {
	return <RouterProvider router={router} />;
};

