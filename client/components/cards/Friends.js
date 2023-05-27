import { Avatar } from "antd";
import { useContext, useState } from "react";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";
const Friends = ({ people, setPeople, findPeople }) => {
  const [state, setState] = useContext(UserContext);
  const id = state.user._id;
  const router = useRouter();
  const handleFriendList = () => {
    state && state.token && router.push("/user/friendList");
  };
  const viewProfileHandler = async (person) => {
    router.push(`/user/profile/${person._id}`);
  };
  const unfriendHandler = async (person) => {
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
      toast.warning(`You have Unfollowed ${person.name}`);
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };
  return (
    <pre>
      <div className="container container-fluid overflow-hidden">
        <div className="card">
          <div className="card-header text-center bg-light text-dark">
            <h3>Friend List</h3>
          </div>
          <div className="card-body bg-dark text-light">
            <div className="row row-cols-2 row-cols-md-3 g-4">
              {people &&
                people.map((person) => (
                  <div key={person._id}>
                    <div className="col">
                      <div className="card">
                        <div className="card-header text-dark text-center">
                          <div>
                            {!person.photo ? (
                              <Avatar size={50} className="mt-1 dp">
                                {person.name.charAt(0)}
                              </Avatar>
                            ) : (
                              <Avatar
                                src={person.photo}
                                size={50}
                                className="mt-1 dp"
                              />
                            )}
                          </div>
                          <h6>{person.name}</h6>
                        </div>

                        <div className="card-body">
                          <div className="d-grid gap-2">
                            <button
                              className="btn btn-primary btn-sm btn-md-lg"
                              type="button"
                              onClick={() => viewProfileHandler(person)}
                            >
                              View Profile
                            </button>
                            <button
                              className="btn btn-danger btn-sm btn-md-lg"
                              type="button"
                              onClick={() => unfriendHandler(person)}
                            >
                              Unfriend
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="card-footer text-center justfy-content-between d-grid gap-2 col-6 mx-auto">
            <button className="btn btn-primary  " onClick={handleFriendList}>
              <h3>See All </h3>
            </button>
          </div>
        </div>
      </div>
    </pre>
  );
};
export default Friends;
