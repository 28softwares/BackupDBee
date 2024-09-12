import Log from "../constants/log";

export function validateDiscordNotification(webhook_url: string): boolean {
  if (!webhook_url) {
    Log.error("Discord webhook URL not set in the config file.");
    return false;
  }
  return true;
}

export function validateSlackNotification(webhook_url: string): boolean {
  if (!webhook_url) {
    Log.error("Slack webhook URL not set in the config file.");
    return false;
  }
  return true;
}

export function validateWebhookNotification(url: string): boolean {
  if (!url) {
    Log.error("Webhook URL not set in the config file.");
    return false;
  }
  return true;
}

export function validateTelegramNotification(webHook: string, webHookSecret: string): boolean {
  if (!webHook) {
    Log.error("Telegram webhook URL not set in the config file.");
    return false;
  }
  if (!webHookSecret) {
    Log.error("Telegram webhook secret not set in the config file.");
    return false;
  }
  return true;
}