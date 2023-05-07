import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import { UserContext } from "../../context";
const UserRoute = ({ children }) => {
  const [ok, setOk] = useState(false);
  const [state] = useContext(UserContext);
  const router = useRouter();
  const [current, setCurrent] = useState(state);
  useEffect(() => {
    if (state && state.token) getCurrentUser();
  }, [state && state.token]);
  const getCurrentUser = async () => {
    try {
      const { data } = await axios.get(`/current-user`);
      if (data.ok) setOk(true);
    } catch (err) {
      router.push("/login");
    }
  };

  return !ok && current && current.token ? (
    <SyncOutlined
      spin
      className="d-flex justify-content-center display-1 text-primary p-5"
    />
  ) : (
    <>{children}</>
  );
};
export default UserRoute;
