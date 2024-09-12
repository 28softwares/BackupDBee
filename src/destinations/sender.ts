export interface SenderOption {
    fileName: string;
    fileContent: unknown;
}

export interface Sender {
  validate(): void;
  send(): Promise<void>;
}
