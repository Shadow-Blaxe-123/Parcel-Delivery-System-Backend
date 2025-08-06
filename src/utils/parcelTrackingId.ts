import crypto from "crypto";

export function generateTrackingId(senderEmail: string): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

  const hash = crypto
    .createHash("md5")
    .update(senderEmail.toLowerCase())
    .digest("hex");

  // Extract letters only from the hash
  const lettersOnly = hash.replace(/[^a-zA-Z]/g, "");

  // Take the first 5 letters, or pad if not enough
  const suffix = lettersOnly.slice(0, 5).toUpperCase().padEnd(5, "X");

  return `TRK-${datePart}-${suffix}`;
}
