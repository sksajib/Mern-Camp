import parse from "html-react-parser";
import { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../../context";
import Router from "next/router";
import { useRouter } from "next/router";
import {
  LikeOutlined,
  HeartOutlined,
  HeartFilled,
  LikeFilled,
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
  const router = useRouter();
  const handleMenu = () => {
    setClicked(!isClicked);
  };

  // const fold = useRef(null);
  // const unfold = useRef(null);
  const toggleDivs = () => {
    const fold1 = document.querySelector("fold");
    const unfold1 = document.querySelector("unfold");

    if (fold1.style.display === "none") {
      fold1.style.display = "block";
      unfold1.style.display = "none";
    } else {
      fold1.style.display = "none";
      unfold1.style.display = "block";
    }
  };

  // const editPost = (e) => {
  //   router.push({
  //     pathname: "/user/editPost/[pid]",
  //     query: { pid: e.target.value },
  //   });
  // };
  const deletePost = (e) => {
    console.log(e.target.value);
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
              <div className="card-header">
                <div className="row">
                  <div className="col-md-1">
                    <div>
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
                    </div>
                  </div>
                  <div className="col-md-2 pt-3">{post.postedBy.name}</div>
                  <div className="col-md-9 d-flex flex-row-reverse">
                    {state.user._id === post.postedBy._id && !isClicked && (
                      <label>
                        <MenuFoldOutlined
                          className={`size2 px-4 `}
                          style={{ marginLeft: "20px", marginRight: "1px" }}
                        />
                        <button onClick={handleMenu} hidden>
                          Menu
                        </button>
                      </label>
                    )}
                    {state.user._id === post.postedBy._id && isClicked && (
                      <div>
                        <label>
                          <EditOutlined
                            className="size2 px-3"
                            style={{ marginLeft: "20px", marginRight: "20px" }}
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
                            style={{ marginLeft: "20px", marginRight: "20px" }}
                          />
                          <button onClick={deletePost} value={post._id} hidden>
                            Delete
                          </button>
                        </label>
                        <label>
                          <MenuUnfoldOutlined
                            className={`size2 px-4 `}
                            style={{ marginLeft: "20px", marginRight: "1px" }}
                          />
                          <button onClick={handleMenu} hidden>
                            Menu
                          </button>
                        </label>
                      </div>
                    )}
                  </div>
                  {/* <div className="col-md-2 pt-3">
                    
                  </div> */}
                </div>
              </div>
              <div className="card-body">
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
                    <img src={post.image.url} width={"100%"} height={"100%"} />
                  )}
                </div>
              </div>
              <div className="card-footer d-inline justify-content-between">
                <div className="margin d-inline">
                  <HeartOutlined className="size2 text-danger " />
                </div>
                <div className=" margin d-inline ">
                  <CommentOutlined className="size2 " />
                </div>
                <div className=" d-inline margin">
                  <ShareAltOutlined className="size2 " />
                </div>
              </div>
            </div>
          ))}
        {/* {posts && JSON.stringify(posts, null, 4)} */}
      </pre>
      <pre>{!posts && "Your Posts will appear here"}</pre>
    </div>
  );
};
export default PostList;
