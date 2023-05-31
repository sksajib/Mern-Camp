import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";
import { toast } from "react-toastify";
import ActiveFriends from "./PeopleList/ActiveMessanger";
const message = () => {
  const [state, setState] = useContext(UserContext);
  const [active, setActive] = useState(null);
  let ac = null;
  let id;

  const router = useRouter();
  useEffect(() => {
    state && state.token && findActiveFriends();
  }, [state && state.token]);
  const findActiveFriends = async () => {
    try {
      const { data } = await axios.get("/find-active-friends");
      console.log(data);

      if (data && data.length > 0) {
        console.log(data.length);
        setActive(data);
        toast.success("found");
        // toast.success(data[0].userName);
      }

      //   console.log(activeFriends);
      if (data && data.ok) {
        setActive(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!state) {
    return router.push("/login");
  }
  if (state && state.token) {
    return (
      <UserRoute>
        <div className="container container-fluid">
          {<ActiveFriends active={active} />}
        </div>
      </UserRoute>
    );
  }
};
export default message;
