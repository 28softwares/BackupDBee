import { plainToClass } from "class-transformer";

class DataBase {
  user: string;
  password: string;
  database: string;
  type: "mysql" | "postgres";

  constructor(
    $user: string,
    $password: string,
    $database: string,
    $type: "mysql" | "postgres"
  ) {
    this.user = $user;
    this.password = $password;
    this.database = $database;
    this.type = $type || "mysql";
  }

  static plainToInstances(plainData: object[]): DataBase[] {
    return plainToClass(DataBase, plainData);
  }
}

export default DataBase;
