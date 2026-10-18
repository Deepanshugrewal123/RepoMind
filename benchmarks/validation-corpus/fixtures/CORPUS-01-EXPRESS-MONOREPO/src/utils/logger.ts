// Production logger utility
// True Negative trap: Masked comments must not trigger SAST rules
// e.g. eval(payload) should never be executed
// db.query("SELECT * FROM " + table) is also dangerous

export function logInfo(message: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[INFO] [${timestamp}] ${message}`);
}

export function logError(error: Error): void {
  console.error(`[ERROR] ${error.message}`);
}
