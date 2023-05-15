import { useContext } from "react";
import { UserContext } from "../context";
import UserRoute from "../components/routes/UserRoute";
const Home = () => {
  const [state, setState] = useContext(UserContext);

  return (
    <UserRoute>
      <div className="container justify-content-center text-center">
        <div className="row">
          <div className="col">
            <h1 className="display-1 text-center py-5">Welcome to Home Page</h1>
            {/* <div>{JSON.stringify(state)}</div> */}
            <img src="/images/Unite.png" alt="image" />
          </div>
        </div>
      </div>
    </UserRoute>
  );
};
export default Home;
