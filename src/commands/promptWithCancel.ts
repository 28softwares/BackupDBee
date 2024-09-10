import { isCancel } from "@clack/prompts";
import process from "process";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const promptWithCancel = async (promptFn: Function, options: object) => {
  const result = await promptFn(options);
  if (isCancel(result)) {
    console.log("Operation cancelled");
    process.exit(0);
  }
  return result;
};
