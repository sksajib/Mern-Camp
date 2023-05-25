import { PlusOutlined, CheckOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";

const People = ({ people, total }) => {
  const [state, setState] = useContext(UserContext);
  const id = state.user._id;
  let length;
  const [add2, setAdd2] = useState(Array(10).fill(false));

  const router = useRouter();
  const handleFollow = async (single, index) => {
    console.log(index, "   ", single._id);
    console.log(length);
    try {
      const { data } = await axios.put("/send-request", {
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
      setState({ ...state, user: data });
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };
  return (
    <pre>
      {people &&
        people.map((single, index) => (
          <div key={single._id} className="card mb-2" style={{ width: "100%" }}>
            <div className="card-header head align-item-center justify-content-between follow">
              <label>
                <div
                  className="row d-flex follow"
                  onClick={() => handleFollow(single, index)}
                >
                  <div className="col-2 text-primary">
                    <PlusOutlined hidden={add2[index]} />
                    <CheckOutlined hidden={!add2[index]} />
                  </div>
                  <div
                    className="col-10 col-md-10 text-primary "
                    style={{ fontSize: "20px" }}
                    hidden={add2[index]}
                  >
                    Add Friend
                  </div>
                  <div
                    className="col-10 col-md-10 text-primary "
                    style={{ fontSize: "20px" }}
                    hidden={!add2[index]}
                  >
                    Request Sent
                  </div>
                </div>
              </label>
            </div>
            <div className="carb-body overflow-hidden">
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
          </div>
        ))}
      {!people && (
        <div>
          <h5 className="text-primary">People will appear here</h5>
        </div>
      )}
    </pre>
  );
};
export default People;
