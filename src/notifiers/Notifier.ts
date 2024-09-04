export abstract class Notifier {
  abstract validate(): void;
  // eslint-disable-next-line
  abstract notify(message?: string): void;
}

export interface NotifierOption {
  databaseName: string;
  databaseDumpFile?: string;
  databaseDumpPath?: string;
}
