import { useState, useContext, useEffect } from "react";
import UserRoute from "../../components/routes/UserRoute";
import { UserContext } from "../../context";
import { toast } from "react-toastify";
import { Avatar } from "antd";
import axios from "axios";

import { useRouter } from "next/router";
const Friends = () => {
  const [state, setState] = useContext(UserContext);
  let id = state.user._id;
  const router = useRouter();
  const [people, setPeople] = useState("");
  useEffect(() => {
    state && state.token && findPeople();
  }, [state && state.token]);
  const findPeople = async () => {
    try {
      const { data } = await axios.get("/find-following-all", { id });
      if (data.length > 0) {
        setPeople(data);
      }
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  const viewProfileHandler = async (person) => {
    router.push(`/user/profile/${person._id}`);
  };
  const unfollowHandler = async (person) => {
    try {
      const { data } = await axios.put("/unfollow-people", {
        _id: person._id,
        id,
      });

      const auth = JSON.parse(window.localStorage.getItem("auth"));

      auth.user = data;

      window.localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });
      let filtered = people.filter((p) => p._id !== person._id);
      setPeople(filtered);
      findPeople();
      toast.warning(`You have unfriended ${person.name} `);
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  if (state && state.token)
    return (
      <UserRoute>
        <pre>
          <div className="container container-fluid overflow-hidden">
            <div className="row text-primary h4">
              {people.length}
              {" Friends"}{" "}
            </div>
            {people &&
              people.map((person) => (
                <div key={person._id}>
                  <div className="row">
                    <div className="col-7 col-md-5 d-flex justify-content-start">
                      {!person.photo ? (
                        <Avatar size={70} className="mt-1 ">
                          {person.name.charAt(0)}
                        </Avatar>
                      ) : (
                        <Avatar
                          src={person.photo}
                          size={70}
                          className="mt-1 "
                        />
                      )}
                      <span className="mt-3 h5">{person.name}</span>
                    </div>
                    <div className="col-5 col-md-7 d-flex justify-content-end">
                      <button
                        className="btn btn-primary mt-2 btn-sm btn-md-md"
                        onClick={() => viewProfileHandler(person)}
                      >
                        <h5>View Profile</h5>
                      </button>
                      <button
                        className="btn btn-danger ms-2 mt-2 btn-sm btn-md-md"
                        onClick={() => unfollowHandler(person)}
                      >
                        <h5>Unfriend</h5>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </pre>
      </UserRoute>
    );
};
export default Friends;
