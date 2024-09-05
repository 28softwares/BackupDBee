import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import EnvConfig from "../constants/env.config";

const S3ClientSingleton = (function () {
  let instance: S3Client;

  function createInstance() {
    return new S3Client({
      region: EnvConfig.AWS_REGION,
      credentials: {
        accessKeyId: EnvConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: EnvConfig.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

// eslint-disable-next-line
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
    const s3Client = S3ClientSingleton.getInstance();
    // Upload the file
    const response = await s3Client.send(command);
    console.log("File uploaded successfully:", response);
  } catch (err) {
    console.error("Error uploading file:", err);
  }
};
