import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import parse from "html-react-parser";
import UserRoute from "../../../components/routes/UserRoute";
import { UserContext } from "../../../context";
import PostList from "../../../components/cards/PostList";
import { Pagination } from "antd";
import { Avatar } from "antd";
const viewProfile = () => {
  const router = useRouter();
  const id = router.query._id;
  const [state, setState] = useContext(UserContext);
  const [people, setPeople] = useState("");
  const [posts, setPosts] = useState("");
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPostsFriend, setTotalPostsFriend] = useState(0);
  useEffect(() => {
    state &&
      state.token &&
      state.user._id == id &&
      router.push("/user/dashboard");
  }, [state, id]);
  useEffect(() => {
    state && state.token && id && fetchUser();
    state && state.token && id && fetchUserPosts();
    state && state.token && id && fetchTotalFriend();
  }, [state && state.token, id, page]);

  const fetchTotalFriend = async () => {
    try {
      const { data } = await axios.post("/total-posts-friend", { id });
      setTotalPostsFriend(data);
    } catch (err) {}
  };
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(
        `/fetch-private-profile/${router.query._id}`
      );
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchUserPosts = async () => {
    try {
      const { data } = await axios.post(`/fetch-friend-posts/${page}`, { id });
      console.log(data);

      if (data) {
        data && setPosts(data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  if (state === null) {
    router.push("/login");
  }
  if (state && state.token) {
    if (people == null) {
      router.push("/user/dashboard");
    }
    if (people != null) {
      return (
        <UserRoute>
          <div className="container container-fluid">
            {people && people.name && state && state.token && (
              <>
                <div className="card">
                  <div className="card-header ">
                    <div>
                      {!people.photo ? (
                        <Avatar size={150} className="mt-1 dp">
                          {people.name.charAt(0)}
                        </Avatar>
                      ) : (
                        <Avatar
                          src={people.photo}
                          size={150}
                          className="mt-1 dp"
                        />
                      )}
                    </div>
                    <div className="mt-2 text-primary h2 ms-2">
                      {people.name}
                    </div>
                  </div>
                </div>

                <PostList posts={posts} fetchUserPosts={fetchUserPosts} />

                <div>
                  <Pagination
                    showQuickJumper
                    current={page}
                    total={(totalPostsFriend / 5) * 10}
                    onChange={(value) => setPage(value)}
                  />
                </div>
              </>
            )}
          </div>
        </UserRoute>
      );
    }
  }
};
export default viewProfile;
