import { select, text } from "@clack/prompts";
import { promptWithCancel } from "./promptWithCancel";
import { config, saveConfig } from "../utils/cli.utils";

const general = async (options: {
  backupLocation?: string;
  logLocation?: string;
  logLevel?: string;
  retentionPolicy?: number;
  backupSchedule?: string;
}) => {
  if (!Object.keys(options).length) {
    const backupLocation = await promptWithCancel(text, {
      message: "Enter backup location",
      initialValue: config.general.backup_location,
    });

    const logLocation = await promptWithCancel(text, {
      message: "Enter log location",
      initialValue: config.general.log_location,
    });

    const logLevel = await promptWithCancel(select, {
      message: "Select log level",
      options: [
        { value: "INFO", label: "INFO" },
        { value: "DEBUG", label: "DEBUG" },
        { value: "ERROR", label: "ERROR" },
      ],
      initialValue: config.general.log_level,
    });

    const retentionPolicy = Number(
      await promptWithCancel(text, {
        message: "Enter retention policy (days)",
        initialValue: String(config.general.retention_policy_days),
      })
    );

    const backupSchedule = await promptWithCancel(text, {
      message: "Enter backup schedule (cron format)",
      initialValue: config.general.backup_schedule,
    });

    config.general.backup_location = backupLocation as string;
    config.general.log_location = logLocation as string;
    config.general.log_level = logLevel as string;
    config.general.retention_policy_days = retentionPolicy;
    config.general.backup_schedule = backupSchedule as string;
  } else {
    // If flags are provided, use them to update the config directly
    if (options.backupLocation)
      config.general.backup_location = options.backupLocation;
    if (options.logLocation) config.general.log_location = options.logLocation;
    if (options.logLevel) config.general.log_level = options.logLevel;
    if (options.retentionPolicy)
      config.general.retention_policy_days = options.retentionPolicy;
    if (options.backupSchedule)
      config.general.backup_schedule = options.backupSchedule;
  }

  // Save the updated config back to the YAML file
  saveConfig(config);

  console.log("General settings updated successfully!");
};

export default general;
