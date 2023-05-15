import parse from "html-react-parser";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context";
import {
  LikeOutlined,
  HeartOutlined,
  HeartFilled,
  LikeFilled,
  CommentOutlined,
  ShareAltOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
import moment from "moment";

const PostList = ({ posts }) => {
  const [state, setState] = useContext(UserContext);
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
                      {!state.user.photo ? (
                        <Avatar size={50} className="mt-1">
                          {state.user.name.charAt(0)}
                        </Avatar>
                      ) : (
                        <Avatar
                          src={state.user.photo}
                          size={50}
                          className="mt-1"
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-md-2 pt-3">{state.user.name}</div>
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
