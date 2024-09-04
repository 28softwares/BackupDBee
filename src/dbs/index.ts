import { ChildProcessWithoutNullStreams, spawn, SpawnOptionsWithoutStdio } from "child_process";

export const spawnDumpProcess = (
    command: string,
    args: string[],
    env: Record<string, string | undefined>
  ): ChildProcessWithoutNullStreams => {
    return spawn(command, args, { env } as SpawnOptionsWithoutStdio);
  };