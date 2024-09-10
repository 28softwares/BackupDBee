export interface Notifier {
  validate(): void;
  notify(): Promise<void>;
}

export interface NotifierOption {
  databaseName: string;
  databaseDumpFile?: string;
  databaseDumpPath?: string;
}
