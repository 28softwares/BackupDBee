import { resolve } from "path";
import { readFile } from "fs";
import backupHelper from "./utils/backup.utils";
import { sendMail } from "./utils/mailer.utils";
import Database from "./utils/DatabaseLits";
import Print from "./constants/Print";

const BASE_DIR = resolve(process.cwd(), "src");

main();

function main() {
  readFile(resolve(BASE_DIR, "config.db.json"), "utf-8", async (err, data) => {
    if (err) {
      Print.error("Error while reading Database Config.");
      return;
    }
    let databaseLists = Database.plainToInstances(JSON.parse(data));

    for (let i = 0; i < databaseLists.length; i++) {
      try {
        let data = await backupHelper(databaseLists[i], BASE_DIR);

        sendMail(data, databaseLists[i].database);
      } catch (error) {
        Print.error("error in backup database");
      }
    }
    Print.info(`Database Backup Successfully ${new Date().toDateString()}`);
  });
}
