import { useState, useContext } from "react";
import { UserContext } from "../../context";
const dashboard = () => {
  const [state, setState] = useContext(UserContext);
  return (
    <div className="container-fluid container text-center text-dark">
      <div className="row">
        <div className="col">
          <h1 className="display-1">
            Welcome {state && state.user && state.user.name}!
          </h1>
        </div>
      </div>
    </div>
  );
};
export default dashboard;
