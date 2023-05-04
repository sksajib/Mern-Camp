import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { useRouter } from "next/router";
const Login = () => {
  const [email, setEmail] = useState("sajibsaha@gmail.com");
  const [password, setPassword] = useState("11111111");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const buttonValue = "Login";
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/login`,
        {
          email,
          password,
        }
      );
      //for clearing the input after successfull registration
      router.push("/");
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data);
    }
  };
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
              <Link href="#" className="  btn  btn-primary btn-lg">
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
};
export default Login;
