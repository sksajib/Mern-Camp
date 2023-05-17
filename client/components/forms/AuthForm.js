import { SyncOutlined } from "@ant-design/icons";
const AuthForm = ({
  formName,
  handleSubmit,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  question,
  setQuestion,
  secret,
  setSecret,
  loading,
  buttonValue,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      {formName !== "Registration Form" && (
        <div className="text-form form-group py-1 text-center">
          <label
            className=" font-weight-bold py-1 text-center"
            style={{
              fontWeight: "bold",
              fontSize: "16 !important",
            }}
          >
            <u> {formName}</u>
          </label>
        </div>
      )}

      {formName === "Registration Form" && (
        <div className="form-group py-2">
          <small>
            <label className=" py-2">Your Name</label>
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
      )}
      <div className="form-group py-2">
        <small>
          <label className=" py-2">Your Email</label>
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
          {formName === "Enter Your Email and New Password" && (
            <label className=" py-2">Your New password</label>
          )}
          {(formName === "Login Form" || formName === "Registration Form") && (
            <label className=" py-2">Your Password</label>
          )}
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
      {(formName === "Registration Form" ||
        formName === "Enter Your Email and New Password") && (
        <div>
          <div className="form-group py-2">
            <small>
              {formName === "Registration Form" && (
                <label className=" py-2">Confirm Your Password</label>
              )}
              {formName === "Enter Your Email and New Password" && (
                <label className=" py-2">Confirm Your New Password</label>
              )}
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
              <label className=" py-2" hidden={true} style={{ color: "red" }}>
                Password Doesn't Match
              </label>
            </small>
            <small>
              <label
                className=" py-2"
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
              {formName === "Registration Form" && (
                <label className=" py-2">Pick a question</label>
              )}
              {formName === "Enter Your Email and New Password" && (
                <label className=" py-2">
                  Select Your Secret Question to reset the password
                </label>
              )}
            </small>
            <select
              className="form-control py-2"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
            >
              <option value={""}>Select a question</option>
              <option value={"1"}>What is Your favourite Color?</option>
              <option value={"2"}>What is Your best friend's name?</option>
              <option value={"3"}>What city you are born?</option>
            </select>
            <small className=" py-2">
              {formName === "Registration Form" && (
                <div>You can use this to reset this password</div>
              )}
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
        </div>
      )}
      {formName === "Registration Form" && (
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
            {loading ? <SyncOutlined spin className="py-1" /> : buttonValue}
          </button>
        </div>
      )}
      {formName === "Login Form" && (
        <div className="d-grid gap-5 md-3 py-3">
          <button
            disabled={!email || !password}
            type="submit"
            className="btn btn-success "
          >
            {loading ? <SyncOutlined spin className="py-1" /> : buttonValue}
          </button>
        </div>
      )}
      {formName === "Enter Your Email and New Password" && (
        <div className="d-grid gap-5 md-3 py-3">
          <button
            disabled={
              !email || !password || !question || !secret || !confirmPassword
            }
            type="submit"
            className="btn btn-success "
          >
            {loading ? <SyncOutlined spin className="py-1" /> : buttonValue}
          </button>
        </div>
      )}
    </form>
  );
};
export default AuthForm;
