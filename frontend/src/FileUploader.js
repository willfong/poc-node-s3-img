import React, { useState } from "react";

const getPresignedUrl = async (filename) => {
  const response = await fetch(`/generate-presigned-url-upload/${filename}`);
  const data = await response.json();
  return data.url;
};

const FileUploader = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      const presignedUrl = await getPresignedUrl(file.name); // This should contact your server to get the presigned URL.

      const response = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (response.ok) {
        alert("Upload successful!");
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("There was an error uploading the file:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
};

export default FileUploader;
