import * as fs from "fs";
import { ensureDirectory } from "../utils/file.utils";
import { Sender } from "./sender";
import path from "path";

export class LocalSender implements Sender {
  private backupDir: string = "";
  constructor(private filePath: string, private compressedFilePath: string) {
    this.filePath = filePath;
    this.compressedFilePath = compressedFilePath;
  }

  validate(): void {
    const backupDir = path.resolve(this.filePath);
    this.backupDir = backupDir;
    ensureDirectory(backupDir);
  }

  async send(): Promise<void> {
    fs.copyFileSync(
      this.compressedFilePath,
      path.resolve(
        this.backupDir,
        this.compressedFilePath.split("/").pop() as string
      )
    );
  }
}
