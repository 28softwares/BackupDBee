import { resolve } from 'path';
import { readFile } from 'fs';
import backupHelper from './utils/backup.utils';
import { sendMail } from './utils/mailer.utils';
import Database from './utils/DatabaseLits';
import Print from './constants/Print';

const BASE_DIR = resolve(__dirname, '..', 'src');

//provide three arguments
//1 for email user
//2 for email password
//3 for receiver mail

if (process.argv.length != 5) {
  Print.error('Please enter three argumnets');
} else {
  main();
}

function main() {
  readFile(
    resolve(BASE_DIR, 'constants', 'data.json'),
    'utf-8',
    async (err, data) => {
      if (err) {
        Print.error('error in backup database');
        return;
      }
      let databaseLists = Database.plainToInstances(JSON.parse(data));

      for (let i = 0; i < databaseLists.length; i++) {
        try {
          let data = await backupHelper(databaseLists[i], BASE_DIR);
          sendMail(data);
        } catch (error) {
          Print.error('error in backup database');
        }
      }
      Print.info(`Database Backup Successfully ${new Date().toDateString()}`);
    }
  );
}
