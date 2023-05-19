import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import EditPostForm from "../../../components/forms/EditPostForm";
import { toast } from "react-toastify";
import parse from "html-react-parser";
const editPost = () => {
  const [post, setPost] = useState({});
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const router = useRouter();
  const _id = router.query._id;
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  let url = "";
  useEffect(() => {
    if (_id) fetchPost();
  }, [_id]);
  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/user-post/${_id}`);
      setPost(data);
      data.image && setImage(data.image);
      data.content && setContent(data.content);
    } catch (err) {
      console.log(err);
    }
  };
  const handleImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("image", file);
    // console.log([...formData2]);
    setUploading(true);
    try {
      const { data } = await axios.post("/uploadImage", formData, { url });
      url = data.url;
      setImage(url);
      setValue("");

      console.log("uploaded image=>", image);
      console.log("uploaded image=>", data);
      setUploading(false);
      if (data.error) {
        toast.error(data.error);
      }
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };
  const postUpload = (e) => {
    e.preventDefault();
    setContent("");
    setContent("");
    setImage("");
    setLoading(false);
    setUploading(false);
  };
  const clearPhoto = async (e) => {
    setUploading(true);
    e.preventDefault();
    console.log(image);
    try {
      const data = await axios.post(`/clear-photo/${post._id}`, { image });
      setUploading(false);
      setImage("");
    } catch (err) {
      console.log(err);
    }
  };
  const postSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(content);
    console.log(image);
    try {
      const data = await axios.post(`/post-update/${post._id}`, {
        content,
        image,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Post Succesfully Updated");
      }

      router.push("/user/dashboard");
      // console.log("Create Post Response =>", content);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  return (
    <div className="container">
      <EditPostForm
        postUpload={postUpload}
        postSubmit={postSubmit}
        content={content}
        setContent={setContent}
        loading={loading}
        handleImage2={handleImage}
        uploading={uploading}
        image={image}
        clearPhoto={clearPhoto}
        value={value}
      />
      <div className="card">
        <div className="card-header text-success text-center">
          <h2>Preview </h2>
        </div>
        <div className="card-body">
          {content !== "<p><br></p>" && (
            <div className="mt-2 card">{content && parse(content)}</div>
          )}

          {/* <div>{post.image && post.image.url}</div> */}
          <div className="mt-2">
            {image && <img src={image} width={"100%"} height={"100%"} />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default editPost;
