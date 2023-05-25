import { useState, useContext, useEffect } from "react";
import UserRoute from "../../../components/routes/UserRoute";
import { UserContext } from "../../../context";
import { toast } from "react-toastify";
import { Avatar } from "antd";
import axios from "axios";
import People from "../../../components/cards/SentRequestPeople";
import { useRouter } from "next/router";

const sentFriendRequest = () => {
  const [state, setState] = useContext(UserContext);
  const [people, setPeople] = useState("");
  const [total, setTotal] = useState(0);
  const router = useRouter();
  useEffect(() => {
    state && state.token && findPeople();
  }, [state && state.token]);
  const findPeople = async () => {
    try {
      const { data } = await axios.get("/find-Sent-Request");
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
              <People people={people} total={total} />
            </div>
          </div>
        </div>
      </UserRoute>
    );
  }
};
export default sentFriendRequest;
