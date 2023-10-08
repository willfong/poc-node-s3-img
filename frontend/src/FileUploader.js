import React, { useState, useRef, useCallback } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";

const getPresignedUrl = async (filename) => {
  const response = await fetch(`/generate-presigned-url-upload/${filename}`);
  const data = await response.json();
  return data;
};

const FileUploader = () => {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();

    const files = event.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      const { url: presignedUrl, filename } = await getPresignedUrl(file.name);
      console.log("New File Name: ", filename);
      const response = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (response.ok) {
        alert("Upload successful!");
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("There was an error uploading the file:", error);
    }
  };

  return (
    <div
      className="col-span-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover", // Resize the background image to cover the entire div
        backgroundPosition: "center", // Center the background image
        backgroundRepeat: "no-repeat", // Ensure the image doesn't repeat
      }}
    >
      <label
        htmlFor="cover-photo"
        className="block text-sm font-medium leading-6 text-white"
      >
        Cover photo
      </label>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
        <div className="text-center">
          <PhotoIcon
            className="mx-auto h-12 w-12 text-gray-500"
            aria-hidden="true"
          />
          <div className="mt-4 flex text-sm leading-6 text-gray-400">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-gray-400">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>
    </div>
  );
};
/*
<div>
<input type="file" onChange={handleFileChange} ref={fileInputRef} />
<button onClick={uploadFile}>Upload</button>
</div>
*/
export default FileUploader;
