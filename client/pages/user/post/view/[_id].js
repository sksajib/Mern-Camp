import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import parse from "html-react-parser";
import { UserContext } from "../../../../context";
import { Avatar } from "antd";
import { toast } from "react-toastify";
import { Modal } from "antd";
import {
  LikeOutlined,
  HeartOutlined,
  HeartFilled,
  LikeFilled,
  ExclamationCircleFilled,
  CommentOutlined,
  ShareAltOutlined,
  GlobalOutlined,
  EditOutlined,
  DeleteOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

import moment from "moment";
import UserRoute from "../../../../components/routes/UserRoute";

const viewPost = () => {
  const [state, setState] = useContext(UserContext);
  const router = useRouter();
  const _id = router.query._id;
  const [post, setPost] = useState({});
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [value, setValue] = useState("");
  const [comments, setComments] = useState([{}]);
  const [likes, setLikes] = useState([]);
  const [like, setLike] = useState(false);
  const [ok, setOk] = useState(false);
  const [postid, setId] = useState("");
  const [visible, setVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [isClicked, setClicked] = useState(false);

  useEffect(() => {
    if (_id) fetchPost();
  }, [_id]);
  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/user-post/${_id}`);
      setPost(data);
      console.log(data);
      data.image && setImage(data.image);
      data.content && setContent(data.content);
      data.comments && setComments(data.comments);
      data.likes && setLikes(data.likes);
      data._id && setId(data._id);
      if (data.likes.length > 0) {
        for (let i = 0; i < data.likes.length; i++) {
          if (data.likes[i] == state.user._id) {
            setLike(true);
            break;
          } else {
            setLike(false);
          }
        }
      } else setLike(false);
    } catch (err) {
      console.log(err);
    }
  };
  const handleMenu = () => {
    setClicked(!isClicked);
  };
  const onConfirm = async (id) => {
    try {
      console.log("ok");
      console.log(id);
      const { data } = await axios.delete(`/delete-post/${id}`);
      setOk(false);
      toast.error("Post Deleted");
      router.push("/user/dashboard");
      //window.location.reload();
    } catch (err) {
      setOk(false);
      console.log(err);
    }
  };
  const onCancel = () => {
    setOk(false);
  };
  const handleLike = async (_id) => {
    try {
      const { data } = await axios.post(`/like-post/${_id}`);
      fetchPost();
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };
  const handleComment = (post, index) => {
    setId(post._id);
    setVisible(true);
  };
  const addComment = async (e, post) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/add-comment", {
        postId: post._id,
        comment,
      });
      console.log(data);
      setComment("");
      setVisible(false);
      toast.success("Comment Added");
      fetchPost();
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };
  const removeComment = async (e, comment) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/remove-comment", {
        postId: post._id,
        comment,
      });
      console.log(data);
      setVisible(false);
      toast.success("Comment Deleted");
      fetchPost();
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };
  if (state && state.token) {
    return (
      <UserRoute>
        <div className="container container-fluid">
          {post && (
            <div className="card " style={{ overflow: "hidden" }}>
              {post.postedBy && (
                <div>
                  <div className="card-header">
                    <div className="row">
                      <div className="col-md-6">
                        <Modal
                          open={postid === post._id && ok}
                          onCancel={onCancel}
                          value={post._id}
                          footer={null}
                        >
                          <h2>Are you sure to delete this post?</h2>
                          <button
                            className="btn btn-danger me-2 btn-lg"
                            value={post._id}
                            onClick={() => onConfirm(post._id)}
                          >
                            Yes
                          </button>
                          <button
                            className="btn btn-primary me-2 btn-lg"
                            onClick={onCancel}
                          >
                            No
                          </button>
                        </Modal>
                        <Modal
                          open={postid === post._id && visible}
                          onCancel={() => setVisible(false)}
                          title="Comment"
                          footer={null}
                        >
                          <form onSubmit={(e) => addComment(e, post)}>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Write Something.."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            />
                            <button className="btn btn-primary btn-sm btn-block mt-3">
                              Post
                            </button>
                          </form>
                        </Modal>
                        {!post.postedBy.photo ? (
                          <Avatar size={50} className="mt-1">
                            {post.postedBy.name.charAt(0)}
                          </Avatar>
                        ) : (
                          <Avatar
                            src={post.postedBy.photo}
                            size={50}
                            className="mt-1"
                          />
                        )}
                        {post.postedBy.name}
                      </div>

                      <div className="col-md-6 d-flex flex-row-reverse">
                        {post.postedBy &&
                          state.user._id === post.postedBy._id &&
                          !isClicked && (
                            <label>
                              <MenuFoldOutlined
                                className={`size2 px-4 `}
                                style={{
                                  marginLeft: "20px",
                                  marginRight: "1px",
                                }}
                              />
                              <button onClick={handleMenu} hidden>
                                Menu
                              </button>
                            </label>
                          )}
                        {post.postedBy &&
                          state.user._id === post.postedBy._id &&
                          isClicked && (
                            <div>
                              <label>
                                <EditOutlined
                                  className="size2 px-3"
                                  style={{
                                    marginLeft: "20px",
                                    marginRight: "20px",
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    router.push(`/user/post/${post._id}`);
                                  }}
                                  value={post._id}
                                  hidden
                                >
                                  Edit
                                </button>
                              </label>
                              <label>
                                <DeleteOutlined
                                  className="size2 px-3"
                                  style={{
                                    marginLeft: "20px",
                                    marginRight: "20px",
                                  }}
                                />
                                <button
                                  onClick={() => handleDelete(post._id)}
                                  value={post._id}
                                  hidden
                                >
                                  Delete
                                </button>
                              </label>
                              <label>
                                <MenuUnfoldOutlined
                                  className={`size2 px-4 `}
                                  style={{
                                    marginLeft: "20px",
                                    marginRight: "1px",
                                  }}
                                />
                                <button onClick={handleMenu} hidden>
                                  Menu
                                </button>
                              </label>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    {post.postedBy && (
                      <div>
                        <div>
                          <GlobalOutlined className="size3  " />

                          <span className="pt-1 ms-3">
                            {moment(post.createdAt).fromNow()}
                          </span>
                        </div>
                        {post.content !== "<p><br></p>" && (
                          <div className="mt-2 card">
                            {post.content && parse(post.content)}
                          </div>
                        )}

                        {/* <div>{post.image && post.image.url}</div> */}
                        <div className="mt-2">
                          {post.image && (
                            <img
                              src={post.image}
                              width={"100%"}
                              height={"100%"}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="card-footer d-flex justify-content-evenly">
                    <div>
                      <label>
                        <HeartOutlined
                          className="size2 text-danger "
                          hidden={like}
                        />
                        <HeartFilled
                          className="size2 text-danger "
                          hidden={!like}
                        />
                        <button onClick={() => handleLike(post._id)} hidden />
                      </label>
                      <label className="ms-3">
                        <h4>{post.likes.length} likes</h4>
                      </label>
                    </div>

                    <div>
                      <label>
                        <CommentOutlined className="size2 " />
                        <button onClick={() => handleComment(post)} hidden />
                      </label>
                      <label className="ms-3">
                        <h4>{post.comments.length} Comments</h4>
                      </label>
                    </div>
                    <div>
                      <ShareAltOutlined className="size2 " />
                    </div>
                  </div>
                  <div className="row ">
                    <div className="col-2 col-md-1 ">
                      {!state.user.photo ? (
                        <Avatar size={70} className="mt-1">
                          {state.user.name.charAt(0)}
                        </Avatar>
                      ) : (
                        <Avatar
                          src={state.user.photo}
                          size={70}
                          className="mt-1 ms-2"
                        />
                      )}
                    </div>
                    <div className="col-10 col-md-11">
                      <form onSubmit={(e) => addComment(e, post)}>
                        <div className="row">
                          <div className="col-9 mt-3">
                            <input
                              type="text"
                              className="form-control "
                              placeholder="Post a Comment..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            />
                          </div>
                          <div className="col-3">
                            <button className="btn form-control btn-primary btn-md btn-block mt-3 ">
                              Post
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>{" "}
                  </div>

                  {post.comments && post.comments.length > 0 && (
                    <ol className="list-group">
                      {post.comments.map((comment) => (
                        <div key={comment._id}>
                          <li className="list-group-item d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto">
                              {" "}
                              <div>
                                {!comment.postedBy.photo ? (
                                  <Avatar size={50} className="mt-1">
                                    {comment.postedBy.name.charAt(0)}
                                  </Avatar>
                                ) : (
                                  <Avatar
                                    src={comment.postedBy.photo}
                                    size={50}
                                    className="mt-1"
                                  />
                                )}
                                {comment.postedBy.name}
                              </div>
                              <div className="mt-2 ms-3">{comment.text}</div>
                            </div>
                            <span className="badge rounded-pill text-muted">
                              {moment(comment.created).fromNow()}
                              {state &&
                                state.user &&
                                (comment.postedBy._id == state.user._id ||
                                  post.postedBy._id == state.user._id) && (
                                  <div className="ml-auto mt-1">
                                    <DeleteOutlined
                                      className="ps-2 text-danger size2"
                                      onClick={(e) => removeComment(e, comment)}
                                    />
                                  </div>
                                )}
                            </span>
                          </li>
                        </div>
                      ))}
                    </ol>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </UserRoute>
    );
  }
};
export default viewPost;
