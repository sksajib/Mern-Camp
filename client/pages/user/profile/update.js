import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import UpdateAuthForm from "../../../components/forms/UpdateAuthForm";
import { UserContext } from "../../../context";
import { useRouter } from "next/router";
import UserRoute from "../../../components/routes/UserRoute";
import { UserProvider } from "../../../context";
const ProfileUpdate = () => {
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [question, setQuestion] = useState("");
  const [ok, setOk] = useState(false);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const buttonValue = "Update";
  const [id, setId] = useState("");
  const [userName, setUserName] = useState("");
  const [value, setValue] = useState("");
  const [uploading, setUploading] = useState(false);

  const [changePassword, setChangePassword] = useState(false);
  const [changeSecret, setChangeSecret] = useState(false);
  let effect = 0;

  useEffect(() => {
    if (state) {
      if (!name) {
        setName(state.user.name);
      }
      if (!email) {
        setEmail(state.user.email);
      }

      if (!id) {
        setId(state.user._id);
      }
      if (!userName) {
        setUserName(state.user.userName);
      }

      if (!image) {
        setImage(state.user.photo);
      }
    }
    console.log(changePassword);
    console.log(image);
  }, [state, image, name, email, id, userName, changePassword]);

  if (!state) {
    router.push("/login");
  }
  if (state && state.token) {
    return (
      <UserRoute>
        <div className="container-fluid container">
          <div className="row ">
            <nav
              className="nav bg-dark text-light text-center justify-content-center"
              style={{ height: "100px", width: "100%", padding: "25px" }}
            >
              <h2>Update Profile Form</h2>
            </nav>
          </div>
          <div className="row">
            <div
              style={{ height: "500px", width: "100%", padding: "15px" }}
              className="py-2 overflow-auto card md-2"
            >
              <UpdateAuthForm
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                oldPassword={oldPassword}
                setOldPassword={setOldPassword}
                password={password}
                setPassword={setPassword}
                image={image}
                setImage={setImage}
                value={value}
                setValue={setValue}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                question={question}
                setQuestion={setQuestion}
                secret={secret}
                setSecret={setSecret}
                loading={loading}
                setLoading={setLoading}
                buttonValue={buttonValue}
                userName={userName}
                setUserName={setUserName}
                changePassword={changePassword}
                setChangePassword={setChangePassword}
                changeSecret={changeSecret}
                setChangeSecret={setChangeSecret}
                uploading={uploading}
                setUploading={setUploading}
                id={id}
              />
            </div>
          </div>
        </div>
      </UserRoute>
    );
  }
};
export default ProfileUpdate;
