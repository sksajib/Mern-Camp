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
  useEffect(() => {
    setState(JSON.parse(window.localStorage.getItem("auth")));
  }, []);
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
