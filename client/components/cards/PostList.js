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

const PostList = ({ posts }) => {
  const [state, setState] = useContext(UserContext);
  const [isClicked, setClicked] = useState(false);
  const [ok, setOk] = useState(false);
  const [postid, setId] = useState("");

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
      window.location.reload();
    } catch (err) {
      setOk(false);
      console.log(err);
    }
  };
  const onCancel = () => {
    setOk(false);
  };

  return (
    <div>
      <pre>
        {posts &&
          posts.map((post) => (
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
                  <div className="card-footer d-inline justify-content-between">
                    <div className="margin d-inline">
                      <HeartOutlined className="size2 text-danger " />
                    </div>
                    <div className=" margin d-inline ">
                      <CommentOutlined className="size2 " />
                    </div>
                    <div className=" d-inline ">
                      <ShareAltOutlined className="size2 margin" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        {/* {posts && JSON.stringify(posts, null, 4)} */}
      </pre>
      <pre>{!posts && "Your Posts will appear here"}</pre>
      {/* <div className="row">
            <div className="col">
              <Modal
                title="Delete Post"
                open={ok}
                onCancel={() => setOk(false)}
                footer={null}
              >
                <p>Are you Sure to delete this post?</p>
                <Link href="/login" className="btn btn-primary btn-sm">
                  Login
                </Link>
              </Modal>
            </div>
          </div> */}
    </div>
  );
};
export default PostList;
