# Workout Importing / Integration
Type: Systems / storage / API design
Target time: 60 minutes.

**Note**: This is not enough time to _fully_ solve this problem, so instead, try to think about the different layers we’ll need to go deeper on. It’s totally reasonable to mark certain areas as “unknown”, such as specifically how we’d query data from the mobile devices. Pretend you’re preparing to talk to our Product team about tradeoffs you found, and make recommendations for how engineering should approach the project. The outcome of this is a writeup of how you would approach this problem and considerations you’d make — no code necessary.

## Prompt
In our app, we let people log workouts. This is important because high intensity workouts affect glucose, and we don’t want to penalize people for having a strenuous workout. Many of our customers, however, already have wearables that track their activity, so we want to automatically import workouts on iOS and Android.

“A workout”, for our purposes, are logged activities (like a run). Take a brief look at the [HealthKit](https://developer.apple.com/documentation/healthkit/hkworkout) and [Google Fit](https://developers.google.com/android/reference/com/google/android/gms/fitness/Fitness) APIs. They differ a good bit, but work by letting us query and/or listen for data and getting back payloads.

Importantly, over time, there may be interesting things we can do with this data in addition to just marking workout times, so we should persist various other data that we may not use yet, such as (if available) the activity name (“running”, “swimming”, etc), rough intensity levels, etc. Take a look at the potential payloads available.

After briefly reviewing their APIs, think about and write up a document covering what this project entails for engineering. Imagine we’re trying to decide whether this is the right time to invest in this project, and you’re exploring what it would take to do it (as pre-work to a rough ballpark estimate).

Some of the complexity comes from how the data source (Google Fit and HealthKIt) are different. You can break this problem into 3 major parts:

1. **Data import**. How do we get the data? Any complexities that may occur?
2. **Transmit to our backend / storage**. What’s relevant to send? Should any processing occur? What’s the right way to store it? The *intensity* of the exercise matters for us, and whatever is stored should be easy to work with.
3. **Client-facing API**. What’s relevant to send back to the client when it needs to display workouts?

Consider things such as:
- How simple is querying for the data that we want? What would you ask a mobile developer to do so that we get the data we need? Would the mobile client need to keep local state to keep track of what it has / needs to query?
- What do you think the API look like? Should we send raw data from HealthKit / Google Fit, or format it in some standardized way on the mobile client first?
- How should we store this data? Assume we can store JSON in a database table that tracks workout activity.
- What would a reasonable API be for activity logs back to the client? Assume we’re sending a JSON payload, and don’t worry about defining the specific endpoints.

This is a very open ended problem, and there are no right answers. This sort of problem is very typical of things we’ve had to think through, and touches on a common tradeoff:

1. We have a short term need: Automatically log workouts in our app and make sure we know the intensity of the workout for data processing.
2. Potential longer term motivations exist: cool data science projects we can do with glucose + activity.

We’d love to see how you approach the solution. As previously mentioned, you would never be expected to fully solve this in an hour.

## Outcome
Please write a document (in Google Docs) to overview how you'd think about this problem. Include any design elements that may be worth discussing in the engineering team (any tradeoffs you think we have?), along with major components that would need to be implemented. Think especially about the data and APIs themselves: we're reading in from two data sources (HealthKit and Google Fit), but want future data processing to be simple and mobile requirements to be well-defined. 

Feel free to ask any questions you have. If you're unsure about something, you can also make reasonable assumptions. Make the Google Doc publicly-commentable, and share with Andrew. We'll review and comment.

The audience is both a Product team and Engineering.
