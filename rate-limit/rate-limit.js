const SyncStore = require('./sync-model');

// Mock syncStore to behave like a db
const syncStore = new SyncStore();

const RequestType = {
  Automated: 'Automated',
  UserAppOpen: 'UserAppOpen',
  UserRequest: 'UserRequest',
};

const SyncResult = {
  SyncSuccessful: 'SyncSuccessful',
  SyncFailed: 'SyncFailed',
  RateLimited: 'RateLimited',
};

// Fake implementation of a sync job.
function doSync(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) {
        reject(new Error("Scrape failed"));
      } else {
        resolve(); // It worked!
      }
    }, Math.random() * 5000);
  });
}

/**
 * Runs data syncs for user sync requests. Rate limits per `RequestType` rules.
 *
 * See README.md for details on the rules.
 *
 * Reminder:
 *  - Rate limits are unique per userId. One user being rate limiting doesn't affect another.
 *  - If there's an ongoing request already of any time for a userId, wait until it's finished
 *    before continuing.
 *  - This function should never throw, and the Promise should always resolve. Rate limits return
 *    `SyncResult.RateLimited`. Successes return `SyncResult.SyncSuccessful`. Failures return
 *    `SyncResult.SyncFailed`
 *  - If a sync fails, it should not contribute to any rate limiting. For all rate limits, only
 *    consider successes.
 */
function syncGlucoseData(
  userId,
  syncType) {
    return new Promise((resolve, _) => {
    syncSession = syncStore.getSession(userId); 
    if (!syncSession) {
      syncStore.newSession(userId);
    }
    const syncStamp = { timestamp: Date.now(), userId, syncType };
    if (syncStore.validateRequestAttempt(syncStamp)) {
      return doSync(userId)
      .then(() => {
        syncStore.saveSync(syncStamp);
        return resolve(SyncResult.SyncSuccessful);
      })
      .catch(() => resolve(SyncResult.SyncFailed)); // *  weird right ? * /
    }
    // If it was not available it means it was rate limited (: so we delete it
    console.info(`Exceeded sync requests. Limiting user: ${userId}`);
    return resolve(SyncResult.RateLimited);
    });
};

function testSyncHelper(userId, syncType, delaySeconds) {
  // To actually test this with several minutes, you may want to think about a better way
  // to test that doesn't require waiting a long time.
  setTimeout(() => {
    const startTime = new Date();
    return syncGlucoseData(userId, syncType).then(result => {
      const endTime = new Date();
      const durationSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
      console.log(`→ ${syncType} for ${userId}: ${result} after ${durationSeconds}s`);
    });
  }, delaySeconds * 1000);
}
async function run() {
  // Throwing off several requests, spaced out. Because sync jobs can fail, the exact runtime
  // behavior of this sample will change slightly.
  testSyncHelper('a', RequestType.Automated, 0);
  testSyncHelper('a', RequestType.Automated, 3); // Should always gets rejected
  testSyncHelper('b', RequestType.UserAppOpen, 5);
  testSyncHelper('b', RequestType.Automated, 8); // Should always gets rejected
  testSyncHelper('b', RequestType.UserAppOpen, 10);
  testSyncHelper('b', RequestType.UserAppOpen, 11); // Should always gets rejected
  testSyncHelper('a', RequestType.UserRequest, 12);
  return;
}

run();
