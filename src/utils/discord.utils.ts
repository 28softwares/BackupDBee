import EnvConfig from "../constants/env.config";
import Print from "../constants/Print";

export const sendDiscordNotification = async (dbName: string) => {
  const message = {
    content: `Database '${dbName}' successfully backuped.`,
    username: "Captain Hook",
  };

  try {
    const webhookUrl = EnvConfig.DISCORD_WEBHOOK_URL;

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (response.ok) {
      Print.info("Discord notification sent successfully!");
    } else {
      console.error(
        "Failed to send Discord notification:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error(
      "An error occurred while sending Discord notification:",
      error
    );
  }
};
