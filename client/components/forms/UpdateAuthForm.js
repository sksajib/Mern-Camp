import { useState, useContext } from "react";
import { UserContext } from "../../context";
import UserRoute from "../routes/UserRoute";
import { SyncOutlined, CameraFilled, LoadingOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
const UpdateAuthForm = ({
  name,
  setName,
  email,
  setEmail,
  oldPassword,
  setOldPassword,
  password,
  setPassword,
  image,
  setImage,
  confirmPassword,
  setConfirmPassword,
  question,
  setQuestion,
  secret,
  setSecret,
  buttonValue,
  userName,
  setUserName,
  changePassword,
  setChangePassword,
  changeSecret,
  setChangeSecret,
  id,
}) => {
  const [state, setState] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [value, setValue] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth2 = JSON.parse(window.localStorage.getItem("auth"));
    if (auth2 && auth2.token !== state.token) {
      window.location.reload();
    }
    if (!auth2) {
      router.push("/login");
    }
    if (auth2 && auth2.token === state.token) {
      try {
        setLoading(true);
        const data2 = await axios.post(`/update-user`, {
          name,
          email,
          oldPassword,
          password,
          confirmPassword,
          question,
          secret,
          id,
          image,
          userName,
          changePassword,
          changeSecret,
        });
        //for clearing the input after successfull registration
        console.log(data2);
        window.localStorage.setItem("auth", JSON.stringify(data2.data));
        setLoading(false);
        toast.success("User Information Updated");
        window.location.reload();
      } catch (err) {
        toast.error(err);
        setLoading(false);
      }
    }
  };
  const handleImage = async (e) => {
    e.preventDefault();
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post("/uploadImage", formData);
      setImage(data.url);
      setValue("");
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="text-form form-group py-1 text-center"></div>
      <div className="form-group py-2">
        <label className=" justify-content-start m-2 py-2">
          {uploading ? (
            <LoadingOutlined className="size py-2" />
          ) : (
            <CameraFilled className="size py-2" />
          )}
          <input
            type="File"
            className=" m-2 py-2"
            accept="image/*"
            value={value}
            onChange={handleImage}
            hidden
          />
        </label>
        <span>
          {!image ? (
            <Avatar size={60} className="mt-1 ms-5 dp">
              {name.charAt(0)}
            </Avatar>
          ) : (
            <Avatar src={image} size={60} className="mt-1 ms-3 dp" />
          )}
        </span>
      </div>
      <div className="form-group py-2">
        <small>
          <label className=" py-2">User Name</label>
        </small>
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          type="text"
          className="form-control"
          placeholder="Enter User Name"
        />
      </div>
      <div className="form-group py-2">
        <small>
          <label className=" py-2">Your Name</label>
        </small>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="form-control"
          placeholder="Enter name"
        />
      </div>

      <div className="form-group py-2">
        <small>
          <label className=" py-2">Your Email</label>
        </small>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="form-control"
          placeholder="Enter Email"
        />
      </div>
      <div className="form-group py-2">
        <small>
          <label className=" py-2">Your Password</label>
        </small>
        <input
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          type="password"
          autoComplete="password"
          className="form-control"
          placeholder="Enter password"
        />
      </div>
      <div className="form-group py-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            onChange={(e) => setChangePassword(e.target.checked)}
            defaultValue
            id="flexCheckDefault"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Check this box if you want to change your password
          </label>
        </div>
      </div>
      <div className="form-group py-2">
        <small>
          <label className=" py-2">Your New Password</label>
        </small>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="new-password"
          className="form-control"
          placeholder="Enter password"
          disabled={!changePassword}
        />
      </div>

      <div>
        <div className="form-group py-2">
          <small>
            <label className=" py-2">Confirm Your New Password</label>
          </small>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
            className="form-control"
            placeholder="Confirm password"
            disabled={!changePassword}
          />
        </div>
        <div className="form-group py-4">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              onChange={(e) => setChangeSecret(e.target.checked)}
              defaultValue
              id="flexCheckDefault2"
            />
            <label className="form-check-label" htmlFor="flexCheckDefault2">
              Check this box if you want to change your Secret and Question
            </label>
          </div>
        </div>
        <div className="form-group py-2">
          <small>
            <label className=" py-2">Pick a question</label>

            {/* <label className=" py-2">
              Select Your Secret Question to reset the password
            </label> */}
          </small>
          <select
            className="form-control py-2"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
            disabled={!changeSecret}
          >
            <option value={""}>Select a question</option>
            <option value={"1"}>What is Your favourite Color?</option>
            <option value={"2"}>What is Your best friend's name?</option>
            <option value={"3"}>What city you are born?</option>
          </select>
          <small className=" py-2">
            <div>You can use this to reset this password</div>
          </small>
        </div>
        <div className="form-group py-3">
          <input
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Write Your Answer Here"
            disabled={!changeSecret}
          />
        </div>
      </div>

      <div className="d-grid gap-5 md-3 py-3">
        <button
          disabled={!name || !email || !oldPassword}
          type="submit"
          className="btn btn-success "
        >
          {loading ? <SyncOutlined spin className="py-1" /> : buttonValue}
        </button>
      </div>
    </form>
  );
};
export default UpdateAuthForm;
