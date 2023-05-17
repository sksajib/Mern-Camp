import { useRouter } from "next/router";

const editPost = () => {
  const router = useRouter();
  const _id = router.query._id;
  return <div>{<div>Edit post of id {_id}</div>}</div>;
};
export default editPost;
