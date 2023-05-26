import { useState, useContext, useEffect } from "react";

import { useRouter } from "next/router";

import axios from "axios";
import { toast } from "react-toastify";

import { Avatar } from "antd";
import { UserContext } from "../context";
import PostList from "../components/cards/PostList";
import CreatePostForm from "../components/forms/CreatePostForm";
import UserRoute from "../components/routes/UserRoute";
import { PlusOutlined } from "@ant-design/icons";
import People from "../components/cards/People";
import Search from "../components/Search";
import { Pagination } from "antd";
import io from "socket.io-client";
const socket = io(
  process.env.NEXT_PUBLIC_SOCKETIO,
  { path: "/socket.io" },
  { reconnection: true }
);
const Home = () => {
  const [state, setState] = useContext(UserContext);

  const [image, setImage] = useState("");
  const [dp, setDp] = useState({});
  const [totalPostsHome, setTotalPostsHome] = useState(0);
  const [page, setPage] = useState(1);
  const [newsFeed, setNewsFeed] = useState("");
  const [posts, setPosts] = useState("");
  const [total, setTotal] = useState(0);

  let url = "";
  if (!dp.url && state !== null) {
    dp.url = state.user.photo;
  }

  // state && socket.emit("userId", state.user._id);
  console.log("SOCKETIO ON JOIN=>", socket);
  useEffect(() => {
    if (state) {
      socket.emit("userId", state.user._id);
    }
  });
  useEffect(() => {
    socket.on("newPost", (newPost) => {
      console.log(newPost);
      setNewsFeed([newPost, ...posts]);
      //toast.success("New Post Received");
    });
  });

  let dpChange;
  // console.log("SOCKETIO ON JOIN=>", socket);
  // useEffect(() => {
  //   if (state)
  //     socket = io(process.env.NEXT_PUBLIC_SOCKETIO, { reconnection: true });
  //   state && socket.emit("userId", state.user._id);
  //   console.log("SOCKETIO ON JOIN=>", socket);
  // }, [state, socket]);

  const [people, setPeople] = useState("");

  // console.log(state.user.photo);
  let name = "";
  if (state && state.user) {
    name = String(state.user.name);
    const [first, ...last] = name.split(" ");
    name = first;
  }
  // console.log(`${state.user.name}  ${state.user.email}`);
  const router = useRouter();
  useEffect(() => {
    if (state && state.token) {
      fetchUserPosts();
      findPeople();
    }
  }, [state && state.token, page]);
  useEffect(() => {
    try {
      state &&
        state.token &&
        axios
          .get("/total-posts-home")
          .then(({ data }) => setTotalPostsHome(data));
    } catch (err) {
      console.log(err);
    }
  }, [state && state.token]);

  // useEffect(() => {
  //   socket.on("newPost", (newPost) => {
  //     console.log(newPost);
  //     setNewsFeed([newPost, ...posts]);
  //     toast.success("New Post Received");
  //   });
  // }, [socket, posts]);

  const fetchUserPosts = async () => {
    try {
      const { data } = await axios.get(`/user-posts/${page}`);
      if (data.length > 0) {
        setPosts(data);
      }
    } catch (err) {}
  };
  const findPeople = async () => {
    try {
      const { data } = await axios.get("/find-people");
      if (data.length > 0) {
        setPeople(data);
        setTotal(data.length);
      }
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };
  const collection = newsFeed.length > 0 ? newsFeed : posts;
  if (state && state.token) {
    return (
      <UserRoute>
        <div className="container-fluid container text-dark">
          <div className="row py-3 bg-default-img text-dark">
            <div className="d-inline col-md-11">
              <h2>News Feed</h2>
            </div>
            <div className=" d-inline col-md-1">
              <label>
                {!state.user.photo ? (
                  <Avatar size={60} className="mt-1 dp">
                    {state.user.name.charAt(0)}
                  </Avatar>
                ) : (
                  <Avatar
                    src={state.user.photo}
                    size={60}
                    className="mt-1 dp"
                  />
                )}
              </label>
            </div>
          </div>
          <div
            className="row py-2 ml-0"
            style={{ height: "100%", width: "100%" }}
          >
            <div className="col-12 col-md-9">
              <PostList posts={collection} fetchUserPosts={fetchUserPosts} />

              <Pagination
                showQuickJumper
                current={page}
                total={(totalPostsHome / 2) * 10}
                onChange={(value) => setPage(value)}
                className="pb-5"
              />
            </div>

            <div className="col-md-3  ">
              <Search />
              <People people={people} total={total} />
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

export default Home;
