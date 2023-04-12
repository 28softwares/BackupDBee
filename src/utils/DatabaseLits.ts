import { plainToClass } from 'class-transformer';

class DataBase {
  user: string;
  password: string;
  database: string;
  constructor($user: string, $password: string, $database: string) {
    this.user = $user;
    this.password = $password;
    this.database = $database;
  }

  static plainToInstances(plainData: object[]): DataBase[] {
    return plainToClass(DataBase, plainData);
  }
}

export default DataBase;
