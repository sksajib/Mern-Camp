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
  const viewProfile = async (e, single, index) => {
    e.preventDefault();
    router.push(`/user/profile/${single._id}`);
  };
  const handleFollow = async (e, single, index) => {
    e.preventDefault();
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
            <div className="card-header head align-item-center justify-content-between ">
              <label>
                <div className="row d-flex">
                  <div className="  col-6 col-md-6 text-light">
                    {/* <div className="col-2 text-primary">
                    <PlusOutlined hidden={add2[index]} />
                    <CheckOutlined hidden={!add2[index]} />
                  </div> */}
                    <button
                      className=" btn btn-primary btn-md "
                      style={{ fontSize: "15px" }}
                      hidden={add2[index]}
                      onClick={(e) => handleFollow(e, single, index)}
                    >
                      Add Friend
                    </button>
                    <button
                      className="btn btn-primary btn-md "
                      style={{ fontSize: "15px" }}
                      hidden={!add2[index]}
                      onClick={(e) => handleFollow(e, single, index)}
                    >
                      Request Sent
                    </button>
                  </div>
                  <div className="col-6 col-md-6 text-light">
                    <button
                      className="btn btn-warning btn-md ms-1"
                      style={{ fontSize: "15px" }}
                      onClick={(e) => viewProfile(e, single, index)}
                    >
                      View Profile
                    </button>
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
