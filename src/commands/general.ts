import { select, text } from "@clack/prompts";
import { promptWithCancel } from "./promptWithCancel";
import { parseConfigFile, saveConfig } from "../utils/cli.utils";

const general = async (options: {
  backupLocation?: string;
  logLocation?: string;
  logLevel?: string;
  retentionPolicy?: string;
  backupSchedule?: string;
}) => {
  const config = parseConfigFile();
  if (!Object.keys(options).length) {
    const backupLocation = await promptWithCancel(text, {
      message: "Enter backup location",
      initialValue: config.general.backup_location,
    });

    const logLocation = await text({
      message: "Enter log location",
      initialValue: config.general.log_location,
    });

    const logLevel = await select({
      message: "Select log level",
      options: [
        { value: "INFO", label: "INFO" },
        { value: "DEBUG", label: "DEBUG" },
        { value: "ERROR", label: "ERROR" },
      ],
      initialValue: config.general.log_level,
    });

    const retentionPolicy = (await text({
      message: "Enter retention policy (days)",
      initialValue: String(config.general.retention_policy_days),
    })) as unknown as number;

    const backupSchedule = await text({
      message: "Enter backup schedule (cron format)",
      initialValue: config.general.backup_schedule,
    });

    config.general.backup_location = backupLocation as string;
    config.general.log_location = logLocation as string;
    config.general.log_level = logLevel as string;
    config.general.retention_policy_days = Number(retentionPolicy);
    config.general.backup_schedule = backupSchedule as string;
  } else {
    // If flags are provided, use them to update the config directly
    if (options.backupLocation)
      config.general.backup_location = options.backupLocation;
    if (options.logLocation) config.general.log_location = options.logLocation;
    if (options.logLevel) config.general.log_level = options.logLevel;
    if (options.retentionPolicy)
      config.general.retention_policy_days = Number(options.retentionPolicy);
    if (options.backupSchedule)
      config.general.backup_schedule = options.backupSchedule;
  }

  // Save the updated config back to the YAML file
  saveConfig(config);

  console.log("General settings updated successfully!");
};

export default general;
