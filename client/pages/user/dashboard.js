import { useState, useContext } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";

const dashboard = () => {
  const [state, setState] = useContext(UserContext);
  return (
    <UserRoute>
      <div className="container-fluid container text-center text-dark">
        <div className="row">
          <div className="col">
            <h1 className="display-1">
              Welcome {state && state.user && state.user.name}!
            </h1>
          </div>
        </div>
      </div>
    </UserRoute>
  );
};
export default dashboard;
