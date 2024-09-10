import fs from "fs";
import path from "path";

const getProjectRoot = () => {
  // eslint-disable-next-line no-undef
  return path.resolve(__dirname, "../../"); // Adjust this as necessary if your project root is further up
};
// Utility function to update or append environment variables
export const updateEnv = (key: string, value: string) => {
  try {
    const projectRoot = getProjectRoot();
    const envPath = path.join(projectRoot, ".env");
    let envContent = "";

    // Check if .env file exists
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, { encoding: "utf8" });

      const envLines = envContent.split("\n");
      let found = false;

      // Loop through each line to find the key and update its value
      const updatedLines = envLines.map((line) => {
        const [currentKey] = line.split("=");

        // If the key is found, replace the value
        if (currentKey === key) {
          found = true;
          return `${key}=${value}`;
        }
        return line;
      });

      // If the key was not found, append the key-value pair to the end
      if (!found) {
        updatedLines.push(`${key}=${value}`);
      }

      envContent = updatedLines.join("\n");
    } else {
      // If the .env file does not exist, create it with the new key-value pair
      envContent = `${key}=${value}\n`;
    }

    // Write the updated content back to the .env file
    fs.writeFileSync(envPath, envContent.trim(), { encoding: "utf8" });
  } catch (error) {
    console.log(error);
  }
};

export const saveConfigToEnv = async (config: {
  [key: string]: string | symbol;
}) => {
  for (const [key, value] of Object.entries(config)) {
    if (typeof value === "string" && value !== "") {
      updateEnv(key, value);
    }
  }
};
