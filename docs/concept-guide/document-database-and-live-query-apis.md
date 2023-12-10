---
sidebar_position: 2
---

# Document Database and Live Query APIs

<!-- Figures: Document Database Structure: A diagram showing the structure of a document database.
Live Query Process: A flowchart showing how live queries work in the context of a front end application.
Async backend API Interaction: A diagram showing how APIs interact with the document database and live queries.
LLM streaming response API -->

## Why a document database?

Document databases model application data in the form you see it at runtime in many conten based applications. Rather than breaking it into columns and rows, you store the data as a single document. This makes it easy to store, retrieve, and interpret data, and also to sync it across devices. A document database API is easy to get started with, and puts you on the path to scalable collaborative applications. Documents can map cleanly to your application’s storage needs, with a minimum of complexity or translation. This lowers the cost of creating new apps and features, but designing document-based systems that are maintainable even after years of real world development can be an art form. Luckily the most important sense you need to hone to do it well is that of simplicity. This concept guide hopes to hone your intuition for document database design, and help you avoid common pitfalls.

## Store user actions and API responses

If you can think of your application in terms of user actions and API responses, you already have important clues to inform your document database design. Other patterns, like data pipeline flows and visualization queries also get easier to model when you understand the database in the interactive app context.

The fundamental question of document database design is when to split your data and when to colocate it in a single document. For instance if you have a catalog item in a shopping app, do you want to keep the price information for each item separately from the description and image links? Probably it’s best to keep that stuff together because you’ll almost always want to load it or change it together. For a social posting app, it also makes sense to keep a user’s post together, eg by storing any media links or other metadata in the same document as the post content. But a list of user posts would rarely be stored on a single document, because then you end up loading the whole list just to read a single post, and also writing the whole list each time you write a post.

One easy rule of thumb: if you find yourself writing logic to update a document by appending complex items to an unbounded array, each of those items should probably be it’s own document.

This aligns with the advice at the top of this section: if you look at your wireframe’s user actions and API responses, you can find a map of document schema. Each user action should create or update one document, for the most part, so if you find yourself splitting a single user form submission into multiple documents, consider just saving the data as-is, and processing it on read. This is often simpler. We’ll discuss grouping documents below, which is useful for instance, to correlate an API request with its corresponding response, or to list all social media posts from a user over time.

## Document granularity

The previous section describes how the simple choice is often the right choice, when using a document database. Now let’s get more technical. In CRDT databases like Fireproof, concurrency is automatically resolved for updates in different documents. Eg if multiple users add items to a shared list, and each item is it’s own document, the merge is trivial. But should the developer make the mistake of modeling the list as an array in a single document, then concurrent additions would require complex merge logic.

If you follow the advice to model along the lines of user action, you’ll rarely run into concurrent mutations. In Fireproof when there are multiple changes to the same document, the “winner” will be deterministic across all peers. If you don’t like it you can use the time-travel features to pull out the other changes and merge them in your application. We plan to add support for identifying documents with unresolved merges, we are eager for your input.

Another reason to watch your document granularity is write amplification. Fireproof stores a cryptographic log of all the state changes the database encountered. If you have a large document, and just update a tiny portion of it repeatedly, you’ll end up with many copies of the large data in your database. Fireproof’s file attachment feature is designed for the extreme of this case, where you have a large file you rarely want to update, with frequently changing metadata. In this case the file will not be rewritten, and the metadata can even be synced and edited offline, without syncing the file.

## Group documents with secondary keys

Foreign keys can be utilized in various ways to establish relationships between documents. For instance, a document can be tagged with a `groupId` field that corresponds to the `_id` of a parent document, creating a 'belongs to' relationship. This can be useful in scenarios such as categorizing blog posts under a specific topic, associating comments with a particular post, or linking order items to a specific order. This method allows for efficient querying and organization of related documents within the database.

## Crawl graphs in memory

In-memory graph access allows you to query a graph by loading each document by its ID from its child's parent-ID list or its parent's children-ID list, recursively. This is done without caching in your application because Fireproof handles caching for you. This approach is not only straightforward but also efficient, enabling fast access to your data.

## Note about sharing

Live query means your app UI automatically updates when relevant data changes. Once you’ve written your app this way, changes coming from remote collaborators are just as easy to interact with as your user’s local changes.

Luckily many popular libraries and frameworks, including React, already work this way. When you use the Fireproof React hooks you don’t have to worry about when to refresh, you just write JSX that includes your data.

If you have raw JavaScript and want to experience the benefits of reactive coding, try just refreshing your whole UI (run your app’s redraw function) on each database change. (Inline example with link to context. Use test/www) Yes this is inefficient and can get glitchy, but when it starts to matter there are plenty of ways to optimize.

All of these patterns are driven by Fireproof’s subscribe function, which provides live updates from the database. That’s what drives the `useLiveQuery` and `useDocument` React hooks, as well as many raw JS and backend examples.

## State machine pattern for reliable backend interactions, use db for availability

There’s a fundamental pattern for reliable software that Fireproof is designed to support. State machines are an awesome model to bring to a document database. In Fireproof you can track the transition of say, a driver's license application entry from draft status, through testing, approval, printing and mailing. Each update is cryptographically verifiable so it’s clear everyone is seeing the same thing.

You can use a variation of this pattern to use database sync as an RPC channel. For instance the front end can make a service request by writing a document with state `please-run` and the service can load the document, run the action, and add the result to the document while changing the state to `ran-ok`. Each program only interacts with the database, there’s no direct connection between the mobile device and the API calling function. Instead, writes to the shared database by the backend are synchronized and read from local replica in the browser.

This prevents re-running api calls with the same query, and makes response data automatically available across all of the user’s synced devices.

On the backend, you can use a Fireproof database to coordinate worker processes, for instance you could have a database full of raw PDF uploads and write a service that subscribes to the database and adds an image thumbnail for any PDFs that don’t have it, both historical and live.

If API responses are large, you can use file attachments for selective replication. Fireproof files are replicated on-demand so for instance if you are archiving StreamLit runs, you might store the parameters in the document and the result as a binary HAR attachment, including media etc. This would allow replay without needing access to the original StreamLit server.

You can also use this model for human-driven processes, for instance if a moderator needs to approve the first post from new users, you can create a moderation queue, and when the user is approved they can post normally.

## When to go multi-database

When you’re designing an application with Fireproof, it’s important to identify the synchronization unit of your app. For example, in a ride-hailing app each ride would be an individual database, recording all the interactions and clicks from search to drop-off. You would use additional per-user databases to store links to all the rides for a given user or driver.

The above scenario describes a common pattern: per-session or [unit-of-work](https://martinfowler.com/eaaCatalog/unitOfWork.html) databases, which are tracked by per-user databases. A few other scenarios are worth describing.

In a chat application, you can use a shared database for each group chat, and each user sends messages by writing documents. (You can write a document with a “composing” state and a timestamp, and then update it with the user content when the message is sent, for a more real time feel.) Each user would have their own list of group chats synced among their devices with a per-user database.

Authoring systems like collaborative word processing or data entry would use a database per sharable workspace, and then give each user their own view into the set of workspaces.

In addition to the unit-of-work and per-user databases, you might have an application-global database for content distribution, that is read-only for all users, but updated by your application on launch. You can use this for assets, style packs, policies, feature-flags, and configuration delivery.

Gaming can benefit from per-level asset delivery and sync, as well as on-demand file sync. This allows you to sync a catalog of games and download only the played ones. Or sync levels on demand, and within the levels, lazy load shaders for different runtime environments. You can also use Fireproof to organize game rooms, sync player settings across devices, and manage leaderboards from edge functions.

Read more about when to use multiple databases in the scaling section.
