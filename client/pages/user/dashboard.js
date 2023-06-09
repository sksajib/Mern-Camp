import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import { useRouter } from "next/router";
import CreatePostForm from "../../components/forms/CreatePostForm";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/cards/PostList";
import { Avatar } from "antd";
import Friends from "./PeopleList/friends2";
import { Pagination } from "antd";
import io from "socket.io-client";

const dashboard = () => {
  const [state, setState] = useContext(UserContext);
  const [image, setImage] = useState("");
  const [dp, setDp] = useState({});
  const [value, setValue] = useState("");
  const [totalPostsDashboard, setTotalPostsDashboard] = useState(0);
  const socket = io(
    process.env.NEXT_PUBLIC_SOCKETIO,
    { path: "/socket.io" },
    {
      reconnection: true,
    }
  );
  let url = "";
  if (!dp.url && state !== null) {
    dp.url = state.user.photo;
  }
  let dpChange;
  // console.log(image);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState("");
  const [page, setPage] = useState(1);
  // const [people, setPeople] = useState("");
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
      // findPeople();
    }
  }, [state && state.token, page]);
  useEffect(() => {
    try {
      state &&
        state.token &&
        axios
          .get("/total-posts-dashboard")
          .then(({ data }) => setTotalPostsDashboard(data));
    } catch (err) {
      console.log(err);
    }
  }, [state && state.token]);
  const [content, setContent] = useState("");

  const fetchUserPosts = async () => {
    try {
      const { data } = await axios.get(`/user-posts-loggedin/${page}`);
      if (data.length > 0) {
        setPosts(data);
      }
    } catch (err) {}
  };
  // const findPeople = async () => {
  //   try {
  //     const { data } = await axios.get("/find-people");
  //     if (data.length > 0) {
  //       setPeople(data);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     toast.error(err);
  //   }
  // };
  const postSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const { data } = await axios.post("/createPost", { content, image });
      if (data.error) {
        toast.error(data.error);
      }
      console.log("Create Post Response =>", data);

      // console.log("Create Post Response =>", content);
      toast.success("Post Created");
      setImage({});
      setContent("");
      setLoading(false);
      fetchUserPosts();
      setPage(1);
      socket.emit("userId", state.user._id);
      socket.emit("newPost", data);
    } catch (err) {
      setLoading(false);
      console.log(err);
      fetchUserPosts();
    }
  };
  const postUpload = async (e) => {
    e.preventDefault();
    setContent("");
    setContent("");
    const data = await axios.post("/clear-photo", url);
    setImage("");
    setUploading(false);
  };

  const handleImage2 = async (e) => {
    e.preventDefault();
    console.log("1");
    const file = e.target.files[0];
    console.log(e.target.files);
    const formData2 = new FormData();

    formData2.append("image", file);
    // console.log([...formData2]);
    setUploading(true);
    try {
      const { data } = await axios.post("/uploadImage", formData2, url);
      //console.log("uploaded image=>", data);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });
      setValue("");
      url = data.url;
      console.log(url);
      //console.log("image=>", image);
      setUploading(false);
      if (data.error) {
        toast.error(data.error);
      }
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };
  const handleImage3 = async (e) => {
    const file = e.target.files[0];
    const formData2 = new FormData();

    formData2.append("image", file);
    // console.log([...formData2]);

    try {
      const { data } = await axios.post("/uploadImage", formData2);
      console.log("uploaded image=>", data);
      setDp({
        url: data.url,
        public_id: data.public_id,
      });

      const email = state.user.email;
      console.log("dp=>", data.url);
      try {
        const data2 = await axios.post("/addPicture", { email, data });
        console.log(JSON.stringify(data2.data));
        // const auth = {
        //   token: data2.data.token,
        //   user: data2.data.user,
        // };
        window.localStorage.setItem("auth", JSON.stringify(data2.data));
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
      if (data.error) {
        toast.error(data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };
  if (state && state.token) {
    return (
      <UserRoute>
        <Friends />
        <div className="container-fluid container text-dark overflow-hidden">
          <div className="row py-3 bg-default-img text-dark">
            <div className="d-inline col-md-11">
              <h2>Timeline</h2>
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
                <input
                  type="File"
                  className=" m-2 py-2"
                  accept="image/*"
                  onChange={handleImage3}
                  hidden
                />
              </label>
            </div>
          </div>
          <div className="row " style={{ height: "100%", width: "100%" }}>
            <div className="col-md-12">
              <CreatePostForm
                postUpload={postUpload}
                postSubmit={postSubmit}
                content={content}
                setContent={setContent}
                loading={loading}
                handleImage2={handleImage2}
                uploading={uploading}
                image={image}
                value={value}
              />

              <PostList posts={posts} fetchUserPosts={fetchUserPosts} />

              <Pagination
                showQuickJumper
                defaultCurrent={page}
                total={(totalPostsDashboard / 2) * 10}
                onChange={(value) => setPage(value)}
              />
            </div>

            {/* <div className="col-md-2">
              <pre>{JSON.stringify(people, null, 2)}</pre>
            </div> */}
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
