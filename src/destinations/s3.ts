import { Sender, SenderOption } from "./sender";
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import EnvConfig from "../constants/env.config";

export class S3Sender implements Sender {
  private static s3ClientInstance: S3Client | null = null;
  private static getS3ClientInstance(): S3Client {
    if (!S3Sender.s3ClientInstance) {
      S3Sender.s3ClientInstance = new S3Client({
        region: EnvConfig.AWS_REGION,
        credentials: {
          accessKeyId: EnvConfig.AWS_ACCESS_KEY_ID,
          secretAccessKey: EnvConfig.AWS_SECRET_ACCESS_KEY,
        },
      });
    }
    return S3Sender.s3ClientInstance;
  }

  private options: SenderOption;
  constructor(options: SenderOption) {
    this.options = options;
  }

  // Method to validate file information
  validate(fileName?: string): void {
    if (!fileName) {
      throw new Error("[-] File name is not set");
    }
  }

  // Method to upload file to S3
  async uploadToS3(fileName?: string, fileContent?: unknown) {
    try {
      const uploadParams = {
        Bucket: EnvConfig.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
        ContentType: "application/octet-stream",
      };

      const command = new PutObjectCommand(
        uploadParams as PutObjectCommandInput
      );
      const s3Client = S3Sender.getS3ClientInstance();

      const response = await s3Client.send(command);
      console.log("[+] File uploaded successfully:", response);
    } catch (err) {
      console.error("[-] Error uploading file:", err);
    }
  }

  // Method to send file to S3
  async send(options?: SenderOption): Promise<void> {
    try {
      if (options?.fileName) {
        this.options.fileName = options.fileName;
      }
      if (options?.fileContent) {
        this.options.fileContent = options.fileContent;
      }
      await this.uploadToS3(this.options.fileName, this.options.fileContent);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`[-] Error sending file to S3: ${error.message}`);
      } else {
        console.error(`[-] Unknown error occurred.`);
      }
    }
  }
}