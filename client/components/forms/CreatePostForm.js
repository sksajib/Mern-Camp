import { SyncOutlined, CameraFilled, LoadingOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
import { Avatar } from "antd";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.bubble.css";
import "quill-image-uploader/dist/quill.imageUploader.min.css";

import axios from "axios";
import dynamic from "next/dynamic";
//import * as Emoji from "quill-emoji";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

//const emoji = dynamic(() => import("quill-emoji"), { ssr: false });
//Quill.register("modules/emoji", Emoji);
const CreatePostForm = ({
  postUpload,
  postSubmit,
  content,
  setContent,
  loading,
  handleImage2,
  placeholder,
  uploading,
  image,
  value,
}) => {
  // const [quillObj, setQuillObj] = useState(ReactQuill);
  // console.log(quillObj);
  const quillRef = useRef();

  const [image2, setImage2] = useState({});
  const [theme, setTheme] = useState("snow");
  const handleThemeChange = (newTheme) => {
    if (newTheme === "bubble") {
      -setTheme("bubble");
    }
    if (newTheme === "snow") {
      setTheme("snow");
    }
  };
  let file = null;

  // const imageHandler = () => {
  //   const input = document.createElement("input");

  //   input.setAttribute("type", "file");
  //   input.setAttribute("accept", "image/*");
  //   input.click();
  //   console.log(input);
  //   console.log(new FormData());
  //   input.onChange = async (e) => {
  //     const file = e.target.files[0];
  //     //console.log(file);
  //     const formData = new FormData();
  //     console.log([...formData]);
  //     formData.append("image", file);
  //     console.log([...formData]);
  //     //var fileName = file.name;
  //     const quill = quillRef.current.getEditor();
  //     console.log(quill);
  //     const range = quill.getSelection(true);

  //     // Insert temporary loading placeholder image
  //     quill.insertEmbed(
  //       range.index,
  //       "image",
  //       `${window.location.origin}/images/loaders/placeholder.gif`
  //     );

  //     // Move cursor to right side of image (easier to continue typing)
  //     quill.setSelection(range.index + 1);
  //     try {
  //       const { data } = await axios.post("/uploadImage", formData);
  //       if (data.error) {
  //         toast.error(data.error);
  //       }
  //       console.log("uploaded image=>", data);
  //       setImage2({
  //         url: data.url,
  //         public_id: data.public_id,
  //       });
  //       quill.deleteText(range.index, 1);

  //       // Insert uploaded image
  //       // this.quill.insertEmbed(range.index, 'image', res.body.image);
  //       quill.insertEmbed(range.index, "image", data.url);
  //       console.log(quill);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //     // API post, returns image location as string e.g. 'http://www.example.com/images/foo.png'

  //     // Remove placeholder image
  //   };
  // };
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

        [
          "link",
          // "image", "video"
        ],
        ["clean"],
      ],
      //handlers: { emoji: function () {} },
      // handlers: {
      //   image: imageHandler,
      // },
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
          {/* <div className="themeSwitcher">
            <label className="m-3">Theme </label>
            <select onChange={(e) => setTheme(e.target.value)}>
              <option value="snow">snow</option>
              <option value="bubble">bubble</option>
            </select>
          </div> */}

          {/* <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
            placeholder="Write What You are thinking"
          ></textarea> */}
          <div className="card-footer d-flex  text-muted">
            <label className=" justify-content-start m-2 py-2">
              {image && image.url ? (
                <Avatar size={30} src={image.url} className="mt-1" />
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
            {/* <div>
              <button onClick={handleEmojiClick}>Emoji</button>
            </div> */}
            <div className="justify-content-end">
              <button
                onClick={postUpload}
                className="btn-lg btn btn-success py-2 m-2"
              >
                RESET
              </button>

              {/*  */}

              <button
                disabled={!content && !image.url}
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
export default CreatePostForm;
