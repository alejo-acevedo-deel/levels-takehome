class SyncSession {
  constructor(syncType) {
    this.mostRecent = null;
    this.Automated = [];
    this.UserAppOpen = [];
    this.UserRequest = [];
  }
};

class SyncStore {
  constructor () {
    this.sessions = {};
  }

  validateSyncsWithinTimeRange(syncHistory, currentSyncTimestamp, { syncsAllowed, minutesTimeRange }) {
    // Edge case whenever its the first try of the syncs
    const MS_PER_MINUTE = 60000;
    const timeLimit = minutesTimeRange * MS_PER_MINUTE;
    let validSyncAttempt = false;
    let syncsAccumulator = 0;
    syncHistory.forEach(eachSync => {
      if (eachSync.timestamp + timeLimit >= currentSyncTimestamp) syncsAccumulator += 1;
    });
    if (syncsAccumulator < syncsAllowed) validSyncAttempt = true;
    return validSyncAttempt;
  };

  validateRequestAttempt({ timestamp, userId, syncType}) {
    //@@todo: check better way of handling this
    const { mostRecent } = this.sessions[userId];
    const syncHistory = this.sessions[userId][syncType];

    if (syncHistory.length === 0) {
      // No syncs have been made yet, no need to validate then. Proceed to sync. 
      return true;
    }

    let isValid = false;
    switch(syncType) {
      case 'Automated': {
        const automatedRateLimit = 1000 * 60 * 60 * 8; /* ms */
        isValid = (Date.now() - automatedRateLimit) >= mostRecent; 
        break;
      }
      case 'UserAppOpen': {
        if (!this.validateSyncsWithinTimeRange(syncHistory, timestamp, { syncsAllowed: 2, minutesTimeRange: 3 })) break;
        if (!this.validateSyncsWithinTimeRange(syncHistory, timestamp, { syncsAllowed: 5, minutesTimeRange: 30 })) break;
        isValid = true;
        break;
      }
      case 'UserRequest': {
        if (!this.validateSyncsWithinTimeRange(syncHistory, timestamp, { syncsAllowed: 1, minutesTimeRange: 3 })) break;
        if (!this.validateSyncsWithinTimeRange(syncHistory, timestamp, { syncsAllowed: 3, minutesTimeRange: 30 })) break;
        isValid = true;
        break;
      }
      default:
      console.info(`Handle invalid cases?`);
    }
    return isValid;
  }
  
  newSession(userId) {
  this.sessions[userId] = new SyncSession();
  };

  getSession(userId) {
    return this.sessions[userId];
  }

  saveSync(syncStamp) {
    const userSession = this.sessions[syncStamp.userId];
    userSession.mostRecent = syncStamp;
    userSession[syncStamp.syncType].push(syncStamp);
  };

};


module.exports = SyncStore;