import { PlusOutlined, CheckOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";

const People = ({ people, setPeople, total }) => {
  const [state, setState] = useContext(UserContext);
  const id = state.user._id;
  const [length, setLength] = useState(state.user.followers.length);

  useEffect(() => {
    if (state && state.user && state.user.followers) {
      setLength(state.user.followers.length);
    }
  }, [state, setLength]);

  const router = useRouter();
  const handleConfirm = async (single, index) => {
    console.log(index, "   ", single._id);

    try {
      const { data } = await axios.put("/accept-request-people", {
        _id: single._id,
        id,
      });

      const setAddValue = (index, value) => {
        setAdd2((prevAdd) => {
          const updatedAdd = [...prevAdd];
          updatedAdd[index] = value;
          return updatedAdd;
        });
      };
      if (add2[index] === false) {
        setAddValue(index, true);
      } else {
        setAddValue(index, false);
      }
      console.log(data);
      const auth = JSON.parse(window.localStorage.getItem("auth"));
      console.log(auth.user);
      auth.user = data;
      console.log(auth);
      window.localStorage.setItem("auth", JSON.stringify(auth));
      //setState({ ...state, user: data });
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };
  const handleDelete = async (single, index) => {
    console.log(index, "   ", single._id);

    try {
      const { data } = await axios.put("/delete-request-people", {
        _id: single._id,
        id,
      });

      console.log(data);
      const auth = JSON.parse(window.localStorage.getItem("auth"));
      console.log(auth.user);
      auth.user = data;
      console.log(auth);
      window.localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });
      let filtered = people.filter((p) => p._id !== single._id);
      setPeople(filtered);
      toast.warning("Friend Request Rejected");
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };
  const [add2, setAdd2] = useState(Array(1000).fill(false));
  if (state && state.user) {
    return (
      <pre>
        {people &&
          people.map((single, index) => (
            <div
              key={single._id}
              className="card mb-2"
              style={{ width: "100%" }}
            >
              <div className="card-header head align-item-center justify-content-between follow">
                <div className="row d-flex bg-dark">
                  <div className="col-2 text-light">
                    {single.photo ? (
                      <Avatar
                        src={single.photo}
                        size={40}
                        className="mt-1 ms-1 p-1"
                      />
                    ) : (
                      <Avatar size={40} className="mt-1 ms-1 ">
                        {single.name.charAt(0)}
                      </Avatar>
                    )}
                  </div>
                  <div
                    className="col-6 col-md-10 mt-1  text-light "
                    style={{ fontSize: "25px" }}
                  >
                    {single.name}
                  </div>
                </div>
              </div>
              <div className="carb-body overflow-hidden">
                <div className="row d-flex bg-dark" hidden={add2[index]}>
                  <div className="col-6 jusify-content-between text-light">
                    <button
                      className="btn btn-primary btn-lg text-light ms-4"
                      onClick={() => handleConfirm(single, index)}
                    >
                      Confirm
                    </button>
                  </div>
                  <div
                    className="col-6 text-light jusify-content-between"
                    style={{ fontSize: "25px" }}
                  >
                    <button
                      className="btn btn-danger btn-lg text-light"
                      onClick={() => handleDelete(single, index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div
                  className="row d-flex bg-primary text-light"
                  hidden={!add2[index]}
                >
                  <h3>Request Accepted</h3>
                </div>
              </div>
            </div>
          ))}
        {!people && (
          <div>
            <h3 className="text-primary">No Request Received</h3>
          </div>
        )}
      </pre>
    );
  }
};
export default People;
