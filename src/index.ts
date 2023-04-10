import { resolve } from 'path';
import { databaseLists } from './constants/data';
import backupHelper from './utils/backup.utils';
import { sendMail } from './utils/mailer.utils';

const BASE_DIR = resolve(__dirname, '..', 'src');

async function main() {
  for (let i = 0; i < databaseLists.length; i++) {
    try {
      let data = await backupHelper(databaseLists[i], BASE_DIR);
      sendMail(data);
    } catch (error) {}
  }
}

main();
