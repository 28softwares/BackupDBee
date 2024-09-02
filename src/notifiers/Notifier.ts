export abstract class Notifier {
  abstract validate(): void;
  abstract notify(message?: string): void;
}

export interface NotifierOption {
  databaseName: string;
  databaseDumpFile?: string;
  databaseDumpPath?: string;
}
