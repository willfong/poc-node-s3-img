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

app.get("/generate-presigned-url-upload/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;

    const command = new PutObjectCommand({
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
