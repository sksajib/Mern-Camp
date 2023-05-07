import AuthForm from "../components/forms/AuthForm";
import { useState, useContext } from "react";
import { UserContext } from "../context";
import { useRouter } from "next/router";
import UserRoute from "../components/routes/UserRoute";
import axios from "axios";
import { toast } from "react-toastify";

const forgot_password = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const buttonValue = "Submit";
  const formName = "Enter Your Email and New Password";
  const [state, setState] = useContext(UserContext);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = JSON.parse(window.localStorage.getItem("auth"));
    console.log(auth);
    if (auth && auth.token) {
      router.push("/user/dashboard");
    } else {
      try {
        setLoading(true);
        console.log(auth);
        const { data } = await axios.post(`/forgot-password`, {
          email,
          password,
          confirmPassword,
          question,
          secret,
        });
        setLoading(false);
        console.log(data);
        toast.success(`Password changed succesfully`);
        router.push("/login");
      } catch (err) {
        setLoading(false);
      }
    }
  };
  if (state && state.token) router.push("/user/dashboard");
  if (state === null) {
    return (
      <UserRoute>
        <div className="container-fluid container">
          <div className="bg-default-img2">
            <div className="row py-3  text-dark">
              <div className="col-md-7 offset-md-3 ">
                <AuthForm
                  formName={formName}
                  handleSubmit={handleSubmit}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  question={question}
                  setQuestion={setQuestion}
                  secret={secret}
                  setSecret={setSecret}
                  loading={loading}
                  buttonValue={buttonValue}
                />
              </div>
            </div>
          </div>
        </div>
      </UserRoute>
    );
  }
};
export default forgot_password;
