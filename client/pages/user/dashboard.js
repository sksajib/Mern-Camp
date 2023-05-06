import { useState, useContext } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import { useRouter } from "next/router";

const dashboard = () => {
  const [state, setState] = useContext(UserContext);
  const router = useRouter();
  if (state === null) {
    router.push("/login");
  }
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
