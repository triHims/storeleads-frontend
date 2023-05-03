import {
  ApolloUtlApi,
  StoreleadsUtlApi,
  JobsApi,
  EmailApi,
  AuthApi,
  WebhookWorkflowsApi,
} from "./api";

import axios from "axios";
import {BASE_PATH} from "./base"

axios.interceptors.request.use(
  (config) => {
    let data = window.localStorage.getItem("user");
    if (data) {
      let token = JSON.parse(data)?.token;

      token && (config.headers["Authorization"] = "Bearer " + token);
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export let storeleadsUtl = new StoreleadsUtlApi(null, BASE_PATH, axios);
export let apolloApiUtl = new ApolloUtlApi(null, BASE_PATH, axios);

export let jobsApi = new JobsApi(null, BASE_PATH, axios);
export let emailApi = new EmailApi(null, BASE_PATH, axios);
export let authApi = new AuthApi();
export let authApiWithToken = new AuthApi(null, BASE_PATH, axios);
export let webhookWorkflowsApi = new WebhookWorkflowsApi(null, BASE_PATH, axios);

export interface ErrorOb {
  type: string;
  status?: number;
  statusMessage: string;
  data?: string;
}

export let processError = (error: any) => {
  if (error.response) {
    return {
      type: "error",
      status: error.response.status,
      statusMessage: error.response.statusText,
      data: JSON.stringify(error.response.data),
    } as ErrorOb;
  } else {
    return {
      type: "error",
      statusMessage: error.message,
    } as ErrorOb;
  }
};
