/* eslint-disable no-undef */
import "dotenv/config";

class EnvConfig {
  public static MAIL_USER = process.env.MAIL_USER as string;
  public static MAIL_PASSWORD = process.env.MAIL_PASSWORD as string;
}

export default EnvConfig;
