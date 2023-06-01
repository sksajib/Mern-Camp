import { useState, createContext, useEffect } from "react";
const UserContext = createContext();
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
const UserProvider = ({ children }) => {
  const router = useRouter();
  const [state, setState] = useState({
    user: {},
    token: "",
  });
  const [activeId, setActiveId] = useState({ user: {} });
  const [active, setActive] = useState(null);
  useEffect(() => {
    setState(JSON.parse(window.localStorage.getItem("auth")));
    setActiveId(JSON.parse(window.localStorage.getItem("active")));
  }, []);
  useEffect(() => {
    if (state != null) window.sessionStorage.setItem("auth", "active");
    if (state == null) window.sessionStorage.removeItem("auth");
  }, [state]);
  useEffect(() => {
    if (state != null) {
      setActive(window.sessionStorage.getItem("auth"));
    }

    if (state == null) {
      setActive(null);
    }

    console.log(active);
  }, [active, setActive, state]);
  // useEffect(() => {
  //   console.log(active);
  // }, [active]);
  let id;

  useEffect(() => {
    if (state && state.token) {
      const handleTabClose = (event) => {
        id = state.user._id;
        const data = axios.post("/add-inactive-time", { id });
      };
      const handleOffline = (event) => {
        id = state.user._id;
        window.location.reload();
        const data = axios.post("/add-inactive-time", { id });
      };
      const handleVisibility = (event) => {
        if (document.visibilityState === "hidden") {
          const data = axios.post("/add-inactive-time", { id });
        }
      };
      window.addEventListener("beforeunload", handleTabClose);
      window.addEventListener("offline", handleOffline);
      document.addEventListener("visibilitychange", handleVisibility);

      return () => {
        window.removeEventListener("beforeunload", handleTabClose);
        window.removeEventListener("offline", handleOffline);
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    }
  }, [activeId, state]);
  useEffect(() => {
    if (state && state.user) {
      id = state.user._id;
      const data = axios.post("/delete-inactive-time", { id });
    }
  }, [state]);

  const token = state && state.token ? state.token : "";
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  axios.interceptors.response.use(
    function (response) {
      // Do something before request is sent
      return response;
    },
    function (error) {
      // Do something with request error
      let res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        setState(null);
        window.localStorage.removeItem("auth");
        router.push("/login");
      }
      if (error.response.status === 400) {
        toast.error(error.response.data);
        // return error.response;
      }
      // return Promise.reject(error);
    }
  );
  return (
    <UserContext.Provider value={[state, setState]}>
      {children}
    </UserContext.Provider>
  );
};
export { UserContext, UserProvider };
