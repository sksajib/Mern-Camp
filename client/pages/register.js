import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [question, setQuestion] = useState("");
  const [ok, setOk] = useState(false);
  const [image, setImage] = useState();
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
      // if (data.ok) {
      //   setName("");
      //   setEmail("");
      //   setPassword("");
      //   setQuestion("");
      //   setSecret("");
      // }
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setQuestion("");
      setSecret("");
      setOk(data.ok);
    } catch (err) {
      toast.error(err.response.data);
    }
    // axios
    //   .post("http://localhost:3031/api/register", {
    //     name,
    //     email,
    //     password,
    //     question,
    //     secret,
    //   })
    //   .then((res) => console.log(res.data.ok))
    //   .catch((err) => toast.error(err.response.data));
  };
  return (
    <div className="container-fluid container">
      <div className="row py-3 bg-secondary text-light">
        <div className="col text-center">
          <h5 className="display-7 text-center">Registration page</h5>
        </div>
      </div>
      <div className="row py-4">
        <div
          className=" col py-3  text-center text-light overflow-auto"
          style={{ height: "460px" }}
        >
          <img src="/images/sajib.jpeg" alt="image" />
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
          className="col  py-3 overflow-auto  text-light card"
          style={{ height: "460px" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group py-1 text-center">
              <label
                className="text-muted font-weight-bold py-1 text-center"
                style={{ fontWeight: "bold", fontSize: "large" }}
              >
                Registration Form
              </label>
            </div>
            <div className="form-group py-2">
              <small>
                <label className="text-muted py-2">Your Name</label>
              </small>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                autoComplete="username"
                className="form-control"
                placeholder="Enter name"
              />
            </div>
            <div className="form-group py-2">
              <small>
                <label className="text-muted py-2">Your Email</label>
              </small>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                className="form-control"
                placeholder="Enter Email"
              />
            </div>
            <div className="form-group py-2">
              <small>
                <label className="text-muted py-2">Your Password</label>
              </small>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                className="form-control"
                placeholder="Enter password"
              />
            </div>
            <div className="form-group py-2">
              <small>
                <label className="text-muted py-2">Confirm Your Password</label>
              </small>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                className="form-control"
                placeholder="Confirm password"
              />
              <small>
                <label
                  className="text-muted py-2"
                  hidden={true}
                  style={{ color: "red" }}
                >
                  Password Doesn't Match
                </label>
              </small>
              <small>
                <label
                  className="text-muted py-2"
                  hidden={true}
                  style={{
                    color: "green",
                  }}
                >
                  Password Matched
                </label>
              </small>
            </div>
            <div className="form-group py-2">
              <small>
                <label className="text-muted py-2">Pick a question</label>
              </small>
              <select
                className="form-control py-2"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              >
                <option>Select a question</option>
                <option value={"1"}>What is Your favourite Color?</option>
                <option value={"2"}>What is Your best friend's name?</option>
                <option value={"3"}>What city you are born?</option>
              </select>
              <small className="form-text text-muted py-2">
                You can use this to reset this password
              </small>
            </div>
            <div className="form-group py-3">
              <input
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Write Your Answer Here"
              />
            </div>
            <div className="d-grid gap-5 md-3 py-3">
              <button
                disabled={
                  !name ||
                  !email ||
                  !password ||
                  !question ||
                  !secret ||
                  !confirmPassword
                }
                type="submit"
                className="btn btn-success "
              >
                Sign Up
              </button>
            </div>
          </form>
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
  );
};
export default Register;
