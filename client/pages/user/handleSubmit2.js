import { UserContext } from "../../context";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
const handleSubmit2 = () => {
  const [state, setState] = useContext(UserContext);
  setState(JSON.parse(window.localStorage.getItem("auth")));
};
