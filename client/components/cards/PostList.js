import parse from "html-react-parser";
import { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../../context";
import Router from "next/router";
import { useRouter } from "next/router";
import { Modal } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmationDialog from "./DeleteModal";
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
import { Avatar, Button } from "antd";
import moment from "moment";

const PostList = ({ posts, fetchUserPosts }) => {
  const [state, setState] = useContext(UserContext);
  const [isClicked, setClicked] = useState(false);
  const [ok, setOk] = useState(false);
  const [postid, setId] = useState("");
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});

  let length;
  useEffect(() => {
    if (posts.length > 0) length = posts.length;
    if (posts.length > 0) {
      let like = 0;
      for (let i = 0; i < length; i++) {
        let numberOfLikes = posts[i].likes.length;
        if (posts[i].likes) {
          let like = 0;
          for (let j = 0; j < numberOfLikes; j++) {
            if (posts[i].likes[j] == state.user._id) {
              setAddValue(i, true);
              like = 1;
              break;
            }
          }
          if (like == 0) {
            setAddValue(i, false);
          }
        }
      }
    }
  }, [posts, length]);
  const [add2, setAdd2] = useState(Array(length).fill(false));

  const setAddValue = (index, value) => {
    setAdd2((prevAdd) => {
      const updatedAdd = [...prevAdd];
      updatedAdd[index] = value;
      return updatedAdd;
    });
  };
  // const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { confirm } = Modal;
  const handleMenu = () => {
    setClicked(!isClicked);
  };
  const handleDelete = async (id) => {
    setId(id);
    console.log(id);

    setOk(true);
  };
  const onConfirm = async (id) => {
    try {
      console.log("ok");
      console.log(id);
      const { data } = await axios.delete(`/delete-post/${id}`);
      setOk(false);
      toast.error("Post Deleted");
      fetchUserPosts();
      //window.location.reload();
    } catch (err) {
      setOk(false);
      console.log(err);
    }
  };
  const onCancel = () => {
    setOk(false);
  };
  const handleLike = async (_id, index) => {
    try {
      const { data } = await axios.post(`/like-post/${_id}`);
      fetchUserPosts();
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };
  const handleComment = (post, index) => {
    setCurrentPost(post);
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
      fetchUserPosts();
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };
  const removeComment = async (e, post, comment) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/remove-comment", {
        postId: post._id,
        comment,
      });
      console.log(data);
      setVisible(false);
      toast.success("Comment Deleted");
      fetchUserPosts();
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };
  const viewPost = (post) => {
    router.push(`/user/post/view/${post._id}`);
  };
  return (
    <div>
      <pre>
        {posts &&
          posts.map((post, index) => (
            <div
              key={post._id}
              className="card mt-2 mb-3"
              style={{ overflow: "hidden" }}
            >
              {/* {(id = post._id)} */}
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
                          <div
                            className="mt-2 card overflow-hidden text-wrap"
                            style={{ width: "100%" }}
                          >
                            <span className="mt-2 ms-2 me-2 mb-2">
                              {post.content && parse(post.content)}
                            </span>
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
                          hidden={add2[index]}
                        />
                        <HeartFilled
                          className="size2 text-danger "
                          hidden={!add2[index]}
                        />
                        <button
                          onClick={() => handleLike(post._id, index)}
                          hidden
                        />
                      </label>
                      <label className="ms-2">
                        <h6>{post.likes.length} likes</h6>
                      </label>
                    </div>

                    <div>
                      <label>
                        <CommentOutlined className="size2 " />
                        <button
                          onClick={() => handleComment(post, index)}
                          hidden
                        />
                      </label>
                      <label className="ms-2">
                        <h6>{post.comments.length} Comments</h6>
                      </label>
                    </div>
                    <div>
                      <ShareAltOutlined className="size2 " />
                    </div>
                  </div>
                  <div className="row ">
                    <div className="col-2 col-md-1">
                      {!state.user.photo ? (
                        <Avatar size={40} className="mt-3">
                          {state.user.name.charAt(0)}
                        </Avatar>
                      ) : (
                        <Avatar
                          src={state.user.photo}
                          size={40}
                          className="mt-3 ms-2"
                        />
                      )}
                    </div>
                    <div className="col-10 col-md-11">
                      <form onSubmit={(e) => addComment(e, post)}>
                        <div className="row">
                          <div className="col-8 mt-3">
                            <input
                              type="text"
                              className="form-control "
                              placeholder="Post a Comment..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            />
                          </div>
                          <div className="col-4">
                            <button className="btn form-control btn-primary btn-md  mt-3  ">
                              Post
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>{" "}
                  </div>

                  {post.comments &&
                    post.comments.length > 0 &&
                    post.comments.map(
                      (comment, index) =>
                        index >= post.comments.length - 2 && (
                          <div key={comment._id}>
                            <div className="card">
                              <div className="card-header d-flex justify-content-between">
                                <div>
                                  <label>
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
                                  </label>
                                  <label className="ms-1">
                                    {comment.postedBy.name}
                                  </label>
                                </div>
                                <div>
                                  <label className="h8">
                                    {moment(comment.created).fromNow()}
                                  </label>
                                  <label className="ms-2">
                                    {state &&
                                      state.user &&
                                      (comment.postedBy._id == state.user._id ||
                                        post.postedBy._id ==
                                          state.user._id) && (
                                        <div className=" mt-1">
                                          <DeleteOutlined
                                            className="ps-2 text-danger size2"
                                            onClick={(e) =>
                                              removeComment(e, comment)
                                            }
                                          />
                                        </div>
                                      )}
                                  </label>
                                </div>
                              </div>
                              <div className="card-body text-wrap overflow-hidden">
                                <div className="ms-2 mt-2">{comment.text}</div>
                              </div>
                            </div>
                          </div>
                        )
                    )}
                  <div
                    onClick={() => viewPost(post)}
                    className="d-flex justify-content-center text-primary dp mt-2"
                  >
                    <h5> View All Comments</h5>
                  </div>
                </div>
              )}
            </div>
          ))}
      </pre>
      <pre>{!posts && "Your Posts will appear here"}</pre>
    </div>
  );
};
export default PostList;
