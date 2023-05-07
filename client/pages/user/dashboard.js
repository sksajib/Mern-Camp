import { useState, useContext } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import { useRouter } from "next/router";

const dashboard = () => {
  const [state, setState] = useContext(UserContext);
  let name = "";
  if (state && state.user) {
    name = String(state.user.name);
    const [first, ...last] = name.split(" ");
    name = first;
  }
  const router = useRouter();
  if (state && state.token) {
    return (
      <UserRoute>
        <div className="container-fluid container text-center text-dark">
          <div className="row">
            <div className="col">
              <h1 className="display-1">
                Welcome {state && state.user && name}!
              </h1>
            </div>
          </div>
        </div>
      </UserRoute>
    );
  }
  if (!state) {
    router.push("/login");
  }
};
export default dashboard;
