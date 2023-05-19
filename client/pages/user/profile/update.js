import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import UpdateAuthForm from "../../../components/forms/UpdateAuthForm";
import { UserContext } from "../../../context";
import { useRouter } from "next/router";
import UserRoute from "../../../components/routes/UserRoute";
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

  const [changePassword, setChangePassword] = useState(false);
  const [changeSecret, setChangeSecret] = useState(false);
  useEffect(() => {
    if (state) {
      setName(state.user.name);
      setEmail(state.user.email);
      setImage(state.user.photo);
      setId(state.user._id);
      setUserName(state.user.userName);
    }
  }, [state]);

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
        const { data } = await axios.post(`/update-user`, {
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
        window.localStorage.setItem("auth", JSON.stringify(data));
        setLoading(false);
        toast.success("User Information Updated");
        setOk(data.ok);
      } catch (err) {
        toast.error(err);
        setLoading(false);
      }
    }
  };
  const handleImage = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post("/uploadImage", formData);
      setImage(data.url);
    } catch (err) {
      console.log(err);
    }
  };

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
              style={{ height: "360px", width: "100%", padding: "15px" }}
              className="py-2 overflow-auto card md-2"
            >
              <UpdateAuthForm
                handleSubmit={handleSubmit}
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                oldPassword={oldPassword}
                setOldPassword={setOldPassword}
                password={password}
                setPassword={setPassword}
                handleImage={handleImage}
                image={image}
                setImage={setImage}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                question={question}
                setQuestion={setQuestion}
                secret={secret}
                setSecret={setSecret}
                loading={loading}
                buttonValue={buttonValue}
                userName={userName}
                setUserName={setUserName}
                changePassword={changePassword}
                setChangePassword={setChangePassword}
                changeSecret={changeSecret}
                setChangeSecret={setChangeSecret}
              />
            </div>
          </div>
        </div>
      </UserRoute>
    );
  }
};
export default ProfileUpdate;
