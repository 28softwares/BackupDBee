import { Local } from "../@types/config";

export function validateLocalDestination(local: Local): boolean {
    if (local?.enabled) {
        if (!local?.path) {
        console.error("Local path not set in the config file.");
        return false;
        }
    }
    return true;
}