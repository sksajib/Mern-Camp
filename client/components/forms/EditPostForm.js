import { SyncOutlined, CameraFilled, LoadingOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
import { Avatar } from "antd";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.bubble.css";
import "quill-image-uploader/dist/quill.imageUploader.min.css";
import "quill-emoji/dist/quill-emoji.css";
import axios from "axios";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const EditPostForm = ({
  postUpload,
  postSubmit,
  content,
  setContent,
  loading,
  handleImage2,
  placeholder,
  uploading,
  image,
  clearPhoto,
  value,
}) => {
  let modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline"],
        [{ font: [] }],
        [{ size: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ color: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],

        ["link"],
        ["clean"],
      ],
    },
  };
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "script",
    "list",
    "bullet",
    "indent",
    "color",

    "align",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="card ">
      <div className="card-body">
        <form className="form-group" onSubmit={postSubmit}>
          <hr />
          <ReactQuill
            value={content}
            onChange={(e) => setContent(e)}
            className="form-control"
            theme={"snow"}
            placeholder="Write Something..."
            modules={modules}
            formats={formats}
            preserveWhitespace={true}
          />

          <div className="card-footer d-flex  text-muted">
            <label className=" justify-content-start m-2 py-2">
              {image !== "" ? (
                <Avatar size={30} src={image} className="mt-1" />
              ) : uploading ? (
                <LoadingOutlined className="size py-2" />
              ) : (
                <CameraFilled className="size py-2" />
              )}

              <input
                type="File"
                className=" m-2 py-2"
                accept="image/*"
                value={value}
                onChange={handleImage2}
                hidden
              />
            </label>

            <div className="justify-content-end">
              <button
                onClick={postUpload}
                className="btn-lg btn btn-success py-2 m-2"
              >
                CLEAR POST
              </button>

              {/*  */}
              <button
                disabled={!image}
                onClick={clearPhoto}
                className="btn-lg btn btn-success py-2 m-2"
              >
                {loading ? (
                  <SyncOutlined spin className="py-1" />
                ) : (
                  "CLEAR PHOTO"
                )}
              </button>
              <button
                disabled={!content && !image}
                className="btn-lg btn btn-success py-2 m-2"
                type="submit"
                onClick={postSubmit}
              >
                {loading ? <SyncOutlined spin className="py-1" /> : "POST"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditPostForm;
