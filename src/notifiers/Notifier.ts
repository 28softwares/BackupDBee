export interface Notifier {
  sendNotification(): void;
  validate(): void;
  notify(): Promise<void>;
}

export interface NotifierOption {
  databaseName: string;
  databaseDumpFile?: string;
  databaseDumpPath?: string;
}
