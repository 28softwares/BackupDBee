import { DumpInfo } from "../@types/types";
import Log from "../constants/log";
import { Destinations } from "../@types/config";
import { DESTINATION } from "../constants/notifications";
import { EmailSender } from "../destinations/email";

import { Sender } from "../destinations/sender";
import { S3Sender } from "../destinations/s3";
import * as fs from "fs";
import { LocalSender } from "../destinations/local";

export const sendToDestinations = async (
  dumpInfo: DumpInfo,
  destinations: Destinations
) => {
  const sentToDestinations = Object.keys(destinations)
    .filter((key) => destinations[key as keyof Destinations].enabled)
    .map((key) => key as keyof Destinations);

  const senders: Sender[] = [];

  for (const sendToDestination of sentToDestinations) {
    switch (sendToDestination.trim().toUpperCase()) {
      case DESTINATION.EMAIL:
        Log.info("Sending to email");
        senders.push(
          new EmailSender(
            destinations.email.from,
            destinations.email.to,
            dumpInfo.compressedFilePath
          )
        );

        break;
      case DESTINATION.S3_BUCKET:
        Log.info("Sending to S3");
        senders.push(
          new S3Sender({
            fileName: `${dumpInfo.dumpFilePath.split("/").pop()}.zip`,
            fileContent: fs.readFileSync(dumpInfo.compressedFilePath),
          })
        );
        break;

      case DESTINATION.LOCAL:
        Log.info("Sending to local");
        senders.push(
          new LocalSender(
            destinations.local.path,
            dumpInfo.compressedFilePath
          )
        )
        break;

      default:
        console.error(
          `[-] Unsupported notification medium: ${sendToDestination}`
        );
        Log.error(`Unsupported notification medium: ${sendToDestination}`);
    }
  }
  const run = notifyAllMedium(senders);
  run();
};

function notifyAllMedium(senders: Sender[]) {
  return async () => {
    for (const sender of senders) {
      try {
        sender.validate();
        await sender.send();
      } catch (error: unknown) {
        if (error instanceof Error) {
          Log.error(`Validation or notification Error: ${error.message}`);
          console.error(
            `[-] Validation or notification Error: ${error.message}`
          );
        } else {
          Log.error(`Unknown error occurred.`);
          console.error(`[-] Unknown error occurred.`);
        }
      }
    }
  };
}
