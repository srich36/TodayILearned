# Overview

This page is a little special - it contains a collection of some ground truths I've come to hold and any associated learnings.
These may be tech or business related - or transcend into any other domain.

- Always use a human-readable, unique identifier for database items. See Stripe IDs for an example of this. If you ever
have to share your internal objects with others (via API calls, etc.) this is incredibly useful. These do not have to be
your primary keys if your data model requires something else (e.g. DynamoDB can only do conditional writes based on primary key)
but they should be present
- **Don't solve problems you don't yet have**
- Building for scale/clean code design is mostly wasted time that is better spent on product growth. If growth is 
successful, you can always refactor later with a larger team
- Never build your own infra. Always use a PAAS unless there are strong reasons not to. Infra is not your core competency 
- Always use a monorepo. If you have to do microservices, keep each service as a separate folder in the monorepo
- Default to a monolith. Adding a network barrier between calls and adding extra infra lift is rarely worth it until
you're at scale. If you're at scale, you can always refactor later. Structure your code as individual services however,
so function calls can just be replaced with network calls later if needed
- When designing a system, always take reporting/data warehousing in mind
    - E.g. if you are using Redis as your primary data store for some pieces of information, you need to consider how you 
    are going to get data within Redis to your warehouse
- When in a sales meeting or in any context where someone is trying to sell you, just be honest with them about what you want.
The main way you can fracture relationships is by not being upfront with people.
- Good design is biased. You shouldn't offer two options of things. Offering two options dilutes your point of view.
- It doesn't matter if 90% of your people hate the product, as long as 10% of people love it and the unit economics support that.
(e.g. Pink glitter card)
- If you have bad news to give don't delay - get it out right away
- If you are talking to someone and it looks like you lost them, pause and say something like "It looks like I lost you, do you have any questions?"

## Document Structuring

- People don't read walls of text -- they read bullet points
- Put the most important block/decision at the top and don't be wishy washy
    - Put the alternatives at the bottom
    - The top and bottom of the document are the two most important pieces