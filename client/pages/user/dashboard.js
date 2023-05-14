import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import { useRouter } from "next/router";
import CreatePostForm from "../../components/forms/CreatePostForm";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/cards/PostList";
const dashboard = () => {
  const [state, setState] = useContext(UserContext);
  const [image, setImage] = useState({});
  console.log(image);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState("");
  let name = "";
  if (state && state.user) {
    name = String(state.user.name);
    const [first, ...last] = name.split(" ");
    name = first;
  }
  const router = useRouter();
  useEffect(() => {
    if (state && state.token) fetchUserPosts();
  }, [state && state.token]);
  const [content, setContent] = useState("");
  console.log(content);
  let quillObj;
  //const [quillObj, setQuillObj] = useState();

  const fetchUserPosts = async () => {
    try {
      const { data } = await axios.get("/user-posts");
      if (data.length > 0) {
        setPosts(data);
      }
      console.log("User Posts =>", data.length);
    } catch (err) {}
  };
  const postSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(content);
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
    } catch (err) {
      setLoading(false);
      console.log(err);
      fetchUserPosts();
    }
  };
  const postUpload = (e) => {
    e.preventDefault();
    setContent("");
    setContent("");
    setImage({});
    setUploading(false);
  };

  const handleImage2 = async (e) => {
    const file = e.target.files[0];
    const formData2 = new FormData();

    formData2.append("image", file);
    // console.log([...formData2]);
    setUploading(true);
    try {
      const { data } = await axios.post("/uploadImage", formData2);
      console.log("uploaded image=>", data);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });
      setUploading(false);
      if (data.error) {
        toast.error(data.error);
      }
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };
  if (state && state.token) {
    return (
      <UserRoute>
        <div className="container-fluid container text-dark">
          <div className="row py-3 bg-default-img text-dark">
            <div className="col text-center">
              <h2>News Feed</h2>
            </div>
          </div>
          <div
            className="row py-2 ml-0"
            style={{ height: "100%", width: "100%" }}
          >
            <div className="col-md-10">
              <CreatePostForm
                postUpload={postUpload}
                postSubmit={postSubmit}
                content={content}
                setContent={setContent}
                loading={loading}
                handleImage2={handleImage2}
                uploading={uploading}
                image={image}
              />
              <pre>
                <PostList posts={posts} />
              </pre>
            </div>

            <div className="col-md-2">Sidebar</div>
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
