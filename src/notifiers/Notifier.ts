export abstract class Notifier {
  abstract validate(): void;
}

export interface NotifierOption {
  databaseName: string;
  databaseDumpFile?: string;
  databaseDumpPath?: string;
}
