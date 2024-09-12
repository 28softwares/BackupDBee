import { spawnDumpProcess } from ".";
import { ConfigType, DumpType } from "../@types/types";

export const handlePostgresDump = (
  data: ConfigType,
  dumps: DumpType[]
): DumpType[] => {
  const dbNames = data.db_name.includes(",")
    ? data.db_name.split(",")
    : [data.db_name];

  dbNames.forEach((dbName) => {
    const args = ["-h", data.host, "-U", data.user, "-d", dbName];
    // eslint-disable-next-line no-undef
    const env = { ...process.env, PGPASSWORD: data.password };

    const dumpedData = spawnDumpProcess("pg_dump", args, env);
    dumps.push({ databaseName: dbName, dumpedContent: dumpedData });
  });
  return dumps;
};
