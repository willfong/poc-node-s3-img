import express from "express";
import morgan from "morgan";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const app = express();
const port = process.env.PORT || 3000;

const BUCKET_NAME = "poc-node-s3-img";
const REGION = "ap-southeast-1"; // Example: 'us-west-1'

const s3Client = new S3Client({ region: REGION });

app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("Hello you");
});

app.get("/generate-presigned-url/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // The URL will be valid for 1 hour
    });

    res.json({
      url: signedUrl,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate a presigned URL.",
      details: error.message,
    });
  }
});

const formatDate = (date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("");
};

const randomString = (length) => {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const getFormattedFilename = (originalFilename) => {
  // Extract file extension
  const fileExtension = originalFilename.split(".").pop();

  // Convert filename to a URL-friendly format
  let baseName = originalFilename.substring(
    0,
    originalFilename.lastIndexOf(".")
  );
  baseName = baseName
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-]/g, "")
    .toLowerCase();

  // Append date string and random string
  const dateString = formatDate(new Date());
  const randStr = randomString(4);
  const newFilename = `${baseName}-${dateString}-${randStr}.${fileExtension}`;

  return newFilename;
};

app.get("/generate-presigned-url-upload/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const newFilename = getFormattedFilename(filename);
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: newFilename,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // The URL will be valid for 1 hour
    });

    res.json({
      url: signedUrl,
      filename: newFilename,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate a presigned URL.",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
