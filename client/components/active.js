import { UserContext } from "../context";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
const active = () => {
  const [state, setState] = useContext(UserContext);
  const [active, setActive] = useState(false);
  if (state !== null) {
    window.sessionStorage.setItem("active", true);
  }
  useEffect(() => {
    setActive(window.sessionStorage.getItem("active"));
  }, []);

  useEffect(() => {
    if (state && state.user) {
      if (active && active === true) {
        const data = axios.post("/delete-inactive-time", state.user._id);
      }
      if (!active) {
        const data = axios.post("/add-inactive-time", state.user._id);
      }
    }
  }, [active, state]);
};
export default active;
