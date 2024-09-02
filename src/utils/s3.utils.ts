import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import EnvConfig from "../constants/env.config";

const s3Client = new S3Client({
  region: EnvConfig.AWS_REGION,
  credentials: {
    accessKeyId: EnvConfig.AWS_ACCESS_KEY_ID,
    secretAccessKey: EnvConfig.AWS_SECRET_ACCESS_KEY,
  },
});

export default async (fileName: string, fileContent: any) => {
  try {
    // Create the upload parameters
    const uploadParams = {
      Bucket: EnvConfig.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ContentType: "application/octet-stream",
    };

    // Create the command to send to S3
    const command = new PutObjectCommand(uploadParams);

    // Upload the file
    const response = await s3Client.send(command);
    console.log("File uploaded successfully:", response);
  } catch (err) {
    console.error("Error uploading file:", err);
  }
};
