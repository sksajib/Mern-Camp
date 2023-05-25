import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context";
import axios from "axios";
import { Avatar } from "antd";
import { useRouter } from "next/router";
const Search = () => {
  const [state, setState] = useContext(UserContext);
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState("");
  const router = useRouter();
  const [following, setFollowing] = useState("");
  const [followers, setFollowers] = useState("");
  const [pendingrequests, setPendingRequests] = useState("");
  useEffect(() => {
    if (state && state.token) {
      setFollowing(state.user.following);
      setFollowers(state.user.followers);
      setPendingRequests(state.user.pendingrequests);
    }
  }, [state && state.token, setFollowers, setFollowing, setPendingRequests]);

  const searchUser = async (e) => {
    e.preventDefault();
    try {
      setPeople("");
      const { data } = await axios.get(`/search-user/${query}`);

      if (data.length > 0) {
        setPeople(data);
      }
      setQuery("");
    } catch (err) {
      console.log(err);
    }
  };

  const viewProfile = (person) => {
    if (state && state.user && following) {
      for (let i = 0; i < following.length; i++) {
        if (following[i] == person._id) {
          router.push(`/user/profile/${person._id}`);
          break;
        }
      }
    }
  };
  return (
    <>
      <form className="d-flex mb-2" role="search" onSubmit={searchUser}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={query}
          onChange={(e) => {
            // console.log(e.target.value);
            setQuery(e.target.value);
          }}
        />
        <button
          className="btn btn-outline-success"
          type="submit"
          onSubmit={searchUser}
        >
          Search
        </button>
      </form>
      {people.length > 0 &&
        people.map((person) => (
          <div key={person._id}>
            <div className="card mt-2 mb-1">
              <div className="card-header">
                {!person.photo ? (
                  <Avatar size={30} className="mt-1 dp">
                    {person.name.charAt(0)}
                  </Avatar>
                ) : (
                  <Avatar src={person.photo} size={30} className="mt-1 dp" />
                )}
                {person.name}
              </div>
              <div className="card-body d-grid">
                <button
                  className="btn btn-primary btn-block"
                  type="button"
                  onClick={() => viewProfile(person)}
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};
export default Search;
