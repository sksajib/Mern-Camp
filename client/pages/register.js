import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { UserContext } from "../context";
import { useRouter } from "next/router";
import UserRoute from "../components/routes/UserRoute";
const Register = () => {
  const [name, setName] = useState("Sajib");
  const [email, setEmail] = useState("sajibsaha@gmail.com");
  const [password, setPassword] = useState("11111111");
  const [confirmPassword, setConfirmPassword] = useState("11111111");
  const [secret, setSecret] = useState("red");
  const [question, setQuestion] = useState("");
  const [ok, setOk] = useState(false);
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const buttonValue = "Sign Up";
  const formName = "Registration Form";
  const [state, setState] = useContext(UserContext);
  const router = useRouter();
  const [otpSend, setOtpSend] = useState(false);
  const [otp, setOtp] = useState("");

  // useEffect(() => {
  //   console.log(state);
  //   state !== null && state.token !== "" && router.push("/");
  // }, [state]);
  const sendOtp = async (e) => {
    e.preventDefault();
    const auth = JSON.parse(window.localStorage.getItem("auth"));

    if (auth && auth.token) {
      setLoading(false);
      router.push("/user/dashboard");
    } else {
      try {
        const { data } = await axios.post(`/send-otp`, {
          name,
          email,
          password,
          confirmPassword,
          question,
          secret,
        });
        console.log(data);
        setOtpSend(true);
        toast.success("OTP Send Successfully");
      } catch (err) {
        toast.error(err);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = JSON.parse(window.localStorage.getItem("auth"));

    if (auth && auth.token) {
      setLoading(false);
      router.push("/user/dashboard");
    } else {
      try {
        setLoading(true);
        const { data } = await axios.post(`/register`, {
          name,
          email,
          password,
          confirmPassword,
          question,
          secret,
          otp,
        });
        //for clearing the input after successfull registration
        setLoading(false);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setQuestion("");
        setSecret("");
        setOtp("");
        setOk(data.ok);
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
          <div className="row py-3 bg-default-img sticky-reg text-dark">
            <div className="col text-center">
              <h2>Registration page</h2>
            </div>
          </div>
          <div className="row  bg-default-img2 text-dark">
            <div className=" col-md-5 text-center text-light justify-content-center">
              <div className="mt-4">
                <img
                  src="/images/Unite.png"
                  alt="image"
                  width={"60%"}
                  className="py-7"
                />
              </div>
            </div>
            <div className="col-md-7 ">
              <div className="row">
                <nav
                  className="nav bg-dark text-light justify-content-center"
                  style={{ height: "45px", width: "580px" }}
                >
                  <div>
                    <h2>Registration Form</h2>
                  </div>
                </nav>
              </div>
              <div className="row">
                <div
                  style={{ height: "360px", width: "580px", padding: "15px" }}
                  className="py-2 overflow-auto bg-form-img card md-2"
                >
                  <AuthForm
                    formName={formName}
                    sendOtp={sendOtp}
                    handleSubmit={handleSubmit}
                    name={name}
                    setName={setName}
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
                    otpSend={otpSend}
                    otp={otp}
                    setOtp={setOtp}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col py-4">
                  <div className="row py-3  text-light">
                    <div className="col ">
                      <div
                        className="d-inline p-2"
                        style={{ fontSize: "25px", color: "red" }}
                      >
                        Already Registered?
                      </div>
                      <div className="d-inline p-2">
                        <Link
                          href="/forgot_password"
                          className="  btn  btn-primary btn-lg"
                        >
                          Forgot Password!
                        </Link>
                      </div>
                      <div className="d-inline p-2">
                        <Link href="/login" className=" btn btn-primary btn-lg">
                          Login
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Modal
                title="Congratulations!"
                open={ok}
                onCancel={() => setOk(false)}
                footer={null}
              >
                <p>You have Successfully Registered</p>
                <Link href="/login" className="btn btn-primary btn-sm">
                  Login
                </Link>
              </Modal>
            </div>
          </div>
        </div>
      </UserRoute>
    );
  }
};
export default Register;
