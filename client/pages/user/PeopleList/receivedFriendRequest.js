import { useState, useContext, useEffect } from "react";
import UserRoute from "../../../components/routes/UserRoute";
import { UserContext } from "../../../context";
import { toast } from "react-toastify";
import { Avatar } from "antd";
import axios from "axios";
import People from "../../../components/cards/ReceivedRequestPeople";
import { useRouter } from "next/router";

const receivedFriendRequest = () => {
  const [state, setState] = useContext(UserContext);
  const [people, setPeople] = useState("");
  const router = useRouter();
  const [total, setTotal] = useState(0);
  useEffect(() => {
    state && state.token && findPeople();
  }, [state && state.token]);
  const findPeople = async () => {
    try {
      const { data } = await axios.get("/find-Received-Request");
      if (data.length > 0) {
        setPeople(data);
        setTotal(data.length);
      }
      console.log(data);
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };
  if (!state) router.push("/login");
  if (state && state.token) {
    return (
      <UserRoute>
        <div className="container">
          <div className="row">
            <div className="col-md-3 mb-3">
              <People people={people} setPeople={setPeople} total={total} />
            </div>
          </div>
        </div>
      </UserRoute>
    );
  }
};
export default receivedFriendRequest;
