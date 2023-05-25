import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { useRouter } from "next/router";
import { UserContext } from "../context";
import UserRoute from "../components/routes/UserRoute";

function Login() {
  const [email, setEmail] = useState("sajibsaha@gmail.com");
  const [password, setPassword] = useState("11111111");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(UserContext);
  const buttonValue = "Login";
  const router = useRouter();
  const [redirectTo, setRedirectTo] = useState(null);
  const [current, setCurrent] = useContext(UserContext);

  // useEffect(() => {
  //   if (redirectTo) {
  //     router.push(redirectTo);
  //     // redirect after 5 seconds
  //   }
  // }, [redirectTo]);

  // // Check some condition and set redirectTo accordingly
  // if (state !== null) {
  //   setRedirectTo("/");
  // }
  //console.log(state);

  // useEffect(() => {
  //   if (state == null) {
  //     router.push("/login");
  //   }
  //   if (state != null) {
  //     router.push("/api");
  //   }
  // }, []);
  useEffect(() => {
    state && state.token && router.push("/user/dashboard");
  }, [state]);
  useEffect(() => {
    setState(JSON.parse(window.localStorage.getItem("auth")));
  }, []);
  useEffect(() => {
    const event = new Event("stateUpdate");
    window.dispatchEvent(event);
  }, []);

  useEffect(() => {
    const handleStateUpdate = () => {
      setState(JSON.parse(window.localStorage.getItem("auth")));
      window.location.reload();
    };
    window.addEventListener("stateUpdate", handleStateUpdate);
    return () => {
      window.removeEventListener("stateUpdate", handleStateUpdate);
    };
  }, [state]);
  const handleSubmit = async (e) => {
    //window.location.reload();
    e.preventDefault();
    //setState(JSON.parse(window.localStorage.getItem("auth")));
    try {
      setState(JSON.parse(window.localStorage.getItem("auth")));
      if (state && state.token) {
        router.push("/user/dashboard");
      }
      setLoading(true);
      const { data } = await axios.post(`/login`, {
        email,
        password,
      });
      //for clearing the input after successfull registration
      //router.push("/");
      const auth = JSON.parse(window.localStorage.getItem("auth"));

      if (auth && auth.token) {
        router.push("/user/dashboard");
      } else {
        setState({
          user: data.user,
          token: data.token,
        });
        window.localStorage.setItem("auth", JSON.stringify(data));
        toast.success(`welcome ${email}`);
      }
      setLoading(false);
      router.push("/user/dashboard");
    } catch (err) {
      setLoading(false);
      // console.log(data);
    }
  };
  // useEffect(() => {
  //   if (state != null) {
  //     router.push("/");
  //   }
  // }, [state]);
  if (state === null) {
    return (
      <div className="container-fluid container">
        <div className="row py-3 bg-default-img text-dark">
          <div className="col text-center">
            <h2>Login page</h2>
          </div>
        </div>
        <div className="bg-default-img2">
          <div className="row py-3  text-dark">
            <div className="col-md-7 offset-md-3 ">
              <AuthForm
                formName={"Login Form"}
                handleSubmit={handleSubmit}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loading={loading}
                buttonValue={buttonValue}
              />
            </div>
          </div>
          <div className="row py-3  text-light">
            <div className="col-md-7 offset-md-3 ">
              <div
                className="d-inline p-2"
                style={{ fontSize: "25px", color: "red" }}
              >
                Don't Have An Account?
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
                <Link href="/register" className=" btn btn-primary btn-lg">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
