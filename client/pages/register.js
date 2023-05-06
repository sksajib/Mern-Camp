import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { UserContext } from "../context";
import { useRouter } from "next/router";
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
  useEffect(() => {
    console.log(state);
    state !== null && state.token !== "" && router.push("/");
  }, [state]);
  // useEffect(() => {
  //   state === null && router.push("/");
  // }, []);
  // console.log(state);
  const saveImage = async (e) => {
    e.preventDefault();
    try {
      console.log(e.target.files[0]);
    } catch (err) {
      toast.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/register`,
        {
          name,
          email,
          password,
          confirmPassword,
          question,
          secret,
        }
      );
      //for clearing the input after successfull registration
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setQuestion("");
      setSecret("");
      setOk(data.ok);
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data);
    }
  };
  // if (loading)
  //   return (
  //     <div className="container-fluid container text-center">
  //       <h4>Loading...</h4>
  //     </div>
  //   );
  if (state === null) {
    return (
      <div className="container-fluid container">
        <div className="row py-3 bg-default-img text-dark">
          <div className="col text-center">
            <h2>Registration page</h2>
          </div>
        </div>
        <div className="row py-4 bg-default-img2 text-light">
          <div
            className=" col py-3  text-center text-light overflow-auto"
            style={{ height: "460px" }}
          >
            <img src="/images/sajib.jpeg" alt="image" width={"400"} />
            <form onSubmit={saveImage}>
              <div className="form-group py-2 text-center">
                <small>
                  <label className="text-muted py-2">Choose a Picture</label>
                </small>
                <input
                  type="File"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="form-control"
                  accept=".png,.jpg,.jpeg"
                />
              </div>
              <div className="d-grid gap-5 md-3 py-3">
                <button type="submit" className="btn btn-success ">
                  Upload Image
                </button>
              </div>
            </form>
          </div>
          <div
            className="col  py-3 overflow-auto bg-form-img card"
            style={{ height: "460px" }}
          >
            <AuthForm
              formName={formName}
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
            />
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
        <div className="row">
          <div className="col"></div>
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
                  <Link href="#" className="  btn  btn-primary btn-lg">
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
    );
  }
};
export default Register;
