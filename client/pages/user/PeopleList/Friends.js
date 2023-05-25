import { useState, useContext, useEffect } from "react";
import UserRoute from "../../../components/routes/UserRoute";
import { UserContext } from "../../../context";
import { toast } from "react-toastify";
import { Avatar } from "antd";
import axios from "axios";
import People from "../../../components/cards/Friends";
import { useRouter } from "next/router";
const Friends = () => {
  const [state, setState] = useContext(UserContext);
  const router = useRouter();
  const id = state.user._id;
  const [people, setPeople] = useState("");
  useEffect(() => {
    state && state.token && findPeople();
  }, [state && state.token]);
  const findPeople = async () => {
    try {
      const { data } = await axios.get("/find-following");
      if (data.length > 0) {
        setPeople(data);
      }
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  if (state && state.token)
    return (
      <div>
        <People people={people} setPeople={setPeople} findPeople={findPeople} />
      </div>
    );
};
export default Friends;
