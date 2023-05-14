import parse from "html-react-parser";
const PostList = ({ posts }) => {
  return (
    <div>
      <pre>
        {posts &&
          posts.map((post) => (
            <div key={post._id} className="card mt-2 mb-3">
              <div className="card-header"></div>
              <div className="card-body">
                <div>{post.content && parse(post.content)}</div>

                {/* <div>{post.image && post.image.url}</div> */}
                <div>
                  {post.image && (
                    <img src={post.image.url} width={"50%"} height={"500px"} />
                  )}
                </div>
              </div>
              <div card-footer></div>
            </div>
          ))}
        {/* {posts && JSON.stringify(posts, null, 4)} */}
      </pre>
      <pre>{!posts && "Your Posts will appear here"}</pre>
    </div>
  );
};
export default PostList;
