import { spawnDumpProcess } from ".";
import { ConfigType, DumpType } from "../@types/types";

export const handleMysqlDump = (data: ConfigType, dumps: DumpType[]): DumpType[] => {
    const dbNames = data.db_name?.includes(",")
      ? data.db_name.split(",")
      : [data.db_name!];
    const args = ["-h", data.host!, "-u", data.user!, "--databases", ...dbNames];
    // eslint-disable-next-line no-undef
    const env = { ...process.env, MYSQL_PWD: data.password };
  
    const dumpProcess = spawnDumpProcess("mysqldump", args, env);
  
    dumps.push({
      databaseName: data.db_name!,
      dumpedContent: dumpProcess,
    });
    return dumps;
  };