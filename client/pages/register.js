import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [question, setQuestion] = useState("");
  const [secret, setSecret] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3031/api/register", {
        name,
        email,
        password,
        question,
        secret,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  return (
    <div className="container-fluid container">
      <div className="row  bg-secondary  text-light text-center">
        <div className="col text-center ">
          <div className="display-6 text-center">Registration Page</div>
        </div>
      </div>
      <div className="row py-4">
        <div
          className=" col py-3  text-center text-light overflow-hidden"
          style={{ height: "500px" }}
        >
          <img src="/images/sajib.jpeg" alt="image" />
        </div>
        <div
          className="col  py-3 overflow-auto  text-light card"
          style={{ height: "500px" }}
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
                className="form-control"
                placeholder="Enter password"
              />
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
                <option value={"What is Your favourite Color?"}>
                  What is Your favourite Color?
                </option>
                <option value={"What is Your best friend's name?"}>
                  What is Your best friend's name?
                </option>
                <option value={"What city you are born?"}>
                  What city you are born?
                </option>
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
              <button type="submit" className="btn btn-success ">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
