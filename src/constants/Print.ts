import { Logger } from "./logger";

class Print {
  static error(message: string) {
    Logger.error(message);
  }

  static info(message: string) {
    Logger.info(message);
  }

  static warn(message: string) {
    Logger.warn(message);
  }

  static debug(message: any) {
    Logger.debug(message);
  }
}

export default Print;
