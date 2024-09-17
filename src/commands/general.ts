import { text } from "@clack/prompts";

async function updateBackupLocation(current: string) {
  const value = await text({
    message: "Enter new backup location (current: " + current + ")",
  });
  return value as string;
}

async function updateLogLevel(current: string) {
  const value = await text({
    message: "Enter new log level (current: " + current + ")",
  });
  return value as string;
}

async function updateRetentionPolicyDays(current: number) {
  const value = await text({
    message: "Enter new retention policy days (current: " + current + ")",
  });
  return parseInt(value as string);
}

async function updateBackupSchedule(current: string) {
  const value = await text({
    message: "Enter new backup schedule (current: " + current + ")",
  });
  return value as string;
}

export const updateGeneralSetting = async (
  key: string,
  currentValue: string | number
) => {
  let newValue: string | number;
  switch (key) {
    case "backup_location":
      newValue = await updateBackupLocation(currentValue as string);
      break;
    case "log_level":
      newValue = await updateLogLevel(currentValue as string);
      break;
    case "retention_policy_days":
      newValue = await updateRetentionPolicyDays(currentValue as number);
      break;
    case "backup_schedule":
      newValue = await updateBackupSchedule(currentValue as string);
      break;
    default:
      throw new Error("Invalid setting key");
  }
  console.log(`${key} updated to: ${newValue}`);
};
