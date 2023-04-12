import { createWriteStream, existsSync, mkdirSync, rmSync } from 'fs';
import { spawn, spawnSync } from 'child_process';
import Print from '../constants/Print';
import { resolve } from 'path';
import DataBase from './DatabaseLits';

const backupHelper = (data: DataBase, BASE_DIR: string): Promise<string> => {
  !existsSync(resolve(BASE_DIR, 'backups')) &&
    mkdirSync(resolve(BASE_DIR, 'backups'));
  !existsSync(resolve(BASE_DIR, 'backups', data.database)) &&
    mkdirSync(resolve(BASE_DIR, 'backups', data.database));
  let backupFolder = resolve(
    BASE_DIR,
    `backups/${data.database}/${Math.round(Date.now() / 1000)}.backup.zip`
  );
  let dumpFileName = `${Math.round(Date.now() / 1000)}-${
    data.database
  }.dump.sql`;

  const write = createWriteStream(dumpFileName);

  const dump = spawn('mysqldump', [
    '-u',
    `${data.user}`,
    `-p${data.password}`,
    `${data.database}`,
  ]);

  return new Promise((success, reject) => {
    dump.stdout
      .pipe(write)
      .on('finish', function () {
        spawnSync('zip', ['-r', backupFolder, dumpFileName]);
        existsSync(dumpFileName) && rmSync(dumpFileName);
        success(backupFolder);
      })
      .on('error', function (err) {
        console.log(err);
        Print.error(`cannot backup ${data.database}`);
        existsSync(dumpFileName) && rmSync(dumpFileName);
        reject(`cannot backup ${data.database}`);
      });
  });
};

export default backupHelper;
