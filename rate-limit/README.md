# Rate limiting
Type: Algorithms / implementation / Promise-wrangling
Target time: 60 minutes

## Prompt
We import glucose from a remote API that is a bit slow. As such, we rate limit our syncing. There’s a few types of sync requests:

- `Automated`: On a timer, so that we bring in glucose every 8 hours or so
- `UserAppOpen`: When the customer opens the app and we want to automatically “silently” refresh
- `UserRequest`: When the customer directly requests a refresh by tapping a button

We rate limit per type of sync per user. Because users may open the app before scanning their glucose monitor, within windows of time, we use different rate limits. Rate limits affecting one user will not affect another. Product requirements for rate limiting are:

1. For `Automated` syncs, only run a sync if no sync (of any kind!) has run within 8 hours. Otherwise, rate limit.
2. For `UserAppOpen` syncs, we allow 2 syncs within 3 minutes or 5 within 30 minutes. For more than that, we rate limit. Only consider other `UserAppOpen` syncs.
3. For `UserRequest` syncs, we allow 1 syncs within 3 minutes, and 3 within 30 minutes. Only consider other `UserRequest` syncs.

For example,
- if an `Automated` sync request comes in and the last sync of any kind was 6 hours ago, rate limit
- if a `UserAppOpen` sync request comes in at 9:20am, and we previously ran a `UserAppOpen` sync at 9:00am, 9:08am, and 9:09am, we can sync again. But at 9:10am, we would have rate limited.
- if a `UserRequest` sync request comes in at 10:00am, and we previously ran a `UserRequest` sync at 9:59am and 9:58am, we rate limit. At 10:05am, a sync would succeed.

As such, you’ll likely want to store some sort of history of recent syncs (by user ID and sync type), but for this exercise, can do it entirely in memory. In practice, we’d actually store this in a database.

Sync jobs, triggered with `doSync()` usually succeed, but sometimes fail. When they fail, the attempt shouldn’t be counted against the rate limit. Additionally, importantly, if a sync is *already* running for a user (remember, they can take several seconds!), any concurrent requests that come in for that user should wait until the previous sync finishes.

If a sync request should be rejected, return `SyncResult.SyncFailed`. If a sync needs to be rate limited, return `SyncResult.RateLimited`. If a sync succeeds, return `SyncResult.SyncSuccessful`.

## Outcome
Write an implementation of `syncGlucoseData()` that works as defined above. You can change anything that's already written, and will likely want to come up with a way to more easily test / experiment with longer durations rather than waiting for many minutes.

## Setup
Install `nvm`. Run `nvm install && nvm use && npm i`.

Run `npm run start` to run `rate-limit.ts`.