import axios, { AxiosResponse } from "axios";
import { UserSignInForm, UserSignUpForm } from "../models/user";
import { SessionFormValues } from "../models/session";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

axios.interceptors.request.use(async (config) => {
  try {
    const token = JSON.parse(localStorage.getItem("user") || "{}").token;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
  } catch (error) {
    console.log(error);
    return await Promise.reject(error);
  }
});

axios.interceptors.response.use(async (response) => {
  try {
    await sleep(1000);
    return response;
  } catch (error) {
    console.log(error);
    return await Promise.reject(error);
  }
});

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody),
};

const Attendance = {
    // generateAttendanceLink: (generateLink: GenerateLinkForm) => requests.post('/attendance/generateAttendanceLink', generateLink),
    // getAttendanceLinks: () => requests.get('/attendance/getAttendanceLinks'),
    // deleteAttendanceLink: (id: string) => requests.del(`/attendance/deleteAttendanceLink/${id}`),
    createAttendant: (sessionId: string, accessToken: string, linkToken: string) => requests.post(`/attendance/createAttendant/${sessionId}?accessToken=${accessToken}&linkToken=${linkToken}`, {}),
    getAttendants: (sessionId: string) => requests.get(`/attendance/getAttendants/${sessionId}`),
};

const Account = {
  login: (user: UserSignInForm) => requests.post("/account/login", user),
  register: (user: UserSignUpForm) => requests.post("/account/register", user),
  current: () => requests.get("/account"),
};

const Session = {
    createSession: (createSession: SessionFormValues) => requests.post('/session/createSession', createSession),
    getSessions: () => requests.get('/session/getSessions'),
    deleteSession: (id: string) => requests.del(`/session/deleteSession/${id}`),
    getSession: (id: string) => requests.get(`/session/getSession/${id}`),
    updateSession: (id: string, updateSession: SessionFormValues) => requests.put(`/session/updateSession/${id}`, updateSession),
};


const agent = {
    Attendance,
    Account,
    Session,
}

export default agent;