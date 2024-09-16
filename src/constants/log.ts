import { Logger } from "./logger";

class Log {
  static error(message: string) {
    Logger.error(message);
  }

  static info(message: string) {
    Logger.info(message);
  }

  static warn(message: string) {
    Logger.warn(message);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static debug(message: any) {
    Logger.debug(message);
  }
}

export default Log;
