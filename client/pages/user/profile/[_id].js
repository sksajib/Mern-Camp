import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import parse from "html-react-parser";
import UserRoute from "../../../components/routes/UserRoute";
import { UserContext } from "../../../context";
const viewProfile = () => {
  const router = useRouter();
  const id = router.query._id;
  const [state, setState] = useContext(UserContext);

  return (
    <div className="container container-fluid">
      <h5>{id}</h5>
    </div>
  );
};
export default viewProfile;
