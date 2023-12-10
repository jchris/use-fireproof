---
sidebar_position: 2
---

# Using a Live Database

Database design, document granularity, live queries, state machine sync, database sharding, and more.

## Why a document database?

Document databases can model application data in the form you see at runtime. Instead of breaking it into columns and rows, you store the data as a single document. This approach makes it easy to store, retrieve, interpret data, and sync it across devices. What you store is what you get, and you can easily add new fields to your documents as your application evolves.

Document APIs are straightforward to get started with and the structure sets you on the path to scalable collaborative applications. Documents can be mapped cleanly to your application’s storage needs, with minimal complexity or translation. This reduces the cost of creating new apps and features. However, designing document-based systems that remain maintainable even after years of real-world development can be an art form. Fortunately, the most crucial sense you need to develop to do it well is that of simplicity. This concept guide aims to sharpen your intuition for document database design and help you avoid common pitfalls.

Document databases play well with others, importing any data and providing simple ways to query and export it. Live databases have event susbcription APIs that make data integration even simpler. This guide is mostly about structuring your data for your application, but we’ll also touch on how to use Fireproof as an integration database, adding custom indexers and other data processing to your application.

## Store user actions and API responses

If you can conceptualize your application in terms of individual user actions (like publishing a post or joining a group) and API responses (like search results or LLM token stream), you already have important clues about your document design. In addition to direct user interactions, other patterns such as data pipeline flows and visualization queries also become more manageable when you ground your understanding of the database within the context of an interactive application.|

The fundamental question of document design is when to split your data and when to combine it in a single document. For instance, if you have a catalog item in a shopping app, do you want to keep the price for each item separate from the description and image links? It's probably best to keep that information together because you'll almost always want to load or change it together. In a social media application, it's logical to store all the elements of a user's post, such as media links or other metadata, in the same document as the post content. However, storing a list of user posts in a single document is not typically efficient. This is because you would need to load the entire list just to read a single post, and each time a post is written, the entire list would need to be rewritten.

One easy rule of thumb: if you find yourself writing logic to update a document by appending complex items to an unbounded array, each of those items should probably be its own document.

This aligns with the advice at the top of this section: if you look at your wireframe’s user actions and API responses, you can find a map of document schema. Each user action should create or update one document, for the most part, so if you find yourself splitting a single user form submission into multiple documents, consider just saving the data as-is, and processing it on read. This is often simpler. We’ll discuss grouping documents below, which is useful for instance, to correlate an API request with its corresponding response, or to list all social media posts from a user over time.

## Document granularity

The previous section describes how the simple choice is often the right choice when using a document database. Now let’s get more technical. In CRDT databases like Fireproof, concurrency is automatically resolved for updates in different documents. For example, if multiple users add items to a shared list, and each item is its own document, the merge is trivial. But if the developer makes the mistake of modeling the list as an array in a single document, then concurrent additions would require complex merge logic.

If you follow the advice to model along the lines of user action, you’ll rarely run into concurrent mutations. In Fireproof, when there are multiple changes to the same document, the “winner” will be deterministic across all peers. If you don’t like it, you can use the time-travel features to pull out the other changes and merge them in your application. We plan to add support for identifying documents with unresolved merges, and we are eager for your input.

Another reason to watch your document granularity is write amplification. Fireproof stores a cryptographic log of all the state changes the database encountered. If you have a large document, and just update a tiny portion of it repeatedly, you’ll end up with many copies of the large data in your database. Fireproof’s file attachment feature is designed for the extreme of this case, where you have a large file you rarely want to update, with frequently changing metadata. In this case, the file will not be rewritten, and the metadata can even be synced and edited offline, without syncing the file.

## Group documents with secondary keys

Foreign keys can be leveraged in a variety of ways to create relationships between documents. For example, a document could have a `groupId` field that matches the `_id` of a parent document, establishing a 'belongs to' relationship. This approach is useful in scenarios such as categorizing blog posts under a specific topic, associating comments with a particular post, or linking order items to a specific order. This method facilitates efficient querying and organization of related documents within the database.

Fireproof automatically creates incremental indexes for queries, so they stay fast even as the dataset grows. Read more about indexes and queries in the [Query API](/docs/database-api/index-query) documentation.

## Crawl graphs in memory

Accessing graphs in-memory allows you to traverse a graph by loading each node via its ID from the edge list of its parent node or its child nodes, recursively. For example, consider a graph where each node represents a user and the edges represent friendships. To find all friends of a user, you would start at the user node and traverse the edges to load each friend node. This process can be repeated recursively to find friends of friends, and so on.

This is done without caching in your application because Fireproof handles caching for you. This approach is not only straightforward but also efficient, enabling fast access to your data. By keeping the data structure simple and letting Fireproof manage the caching, you avoid the overhead of complex data management in your application. This results in faster data retrieval and improved application performance with simpler code.

## Live UI updates enable sharing

Reactive programming with live query means your app UI automatically updates when relevant data changes. Once you’ve written your app this way, changes coming from remote collaborators are just as easy to interact with as your user’s local changes. You can read more in the [Reactive Apps](/docs/concept-guide/reactive-apps) section.

Many popular libraries and frameworks, including React, already work this way. When you use the Fireproof React hooks, you don’t have to worry about when to refresh, you just write JSX that includes your data.

If you have raw JavaScript and want to experience the benefits of reactive coding, try just refreshing your whole UI (run your app’s redraw function) on each database change. Yes, this is inefficient and can get glitchy, but when it starts to matter, there are plenty of ways to optimize.

All of these patterns are driven by Fireproof’s subscribe function, which provides live updates from the database. That’s what drives the `useLiveQuery` and `useDocument` React hooks, as well as many raw JS and backend examples.

Once you are this far, you can use the [Cloud Connectors](/docs/concept-guide/cloud-connectors) to share your app’s data with other users and backend processes. Remote changes will render seamlessly in your UI, and the local user's changes will be shared with others.

## Durable state machine queues

There’s a fundamental pattern for reliable software that Fireproof is designed to support. State machines are an excellent model to bring to a document database. In Fireproof, you can track the transition of, say, a driver's license application entry from draft status, through testing, approval, printing, and mailing. Each update is cryptographically verifiable, so it’s clear everyone is seeing the same thing.

You can use this pattern as an RPC channel. For instance, the front-end can make a service request by writing a document with state `please-run`, and the service can load the document, run the action, and add the result to the document while changing the state to `ran-ok`.

The client makes a service request by writing a local document with state 'please-run':

```js
db.put({
  _id: 'doc1',
  state: 'please-run'
  // other data...
})
```

Syncing the document to the backend triggers a service to run the action.

On the backend, the service queries for documents with state 'please-run':

```js
const jobs = db.query('state', { key: 'please-run' })
```

The runner uses the key 'please-run' to find jobs:

```js
jobs.rows.forEach(job => {
  const doc = job.doc
  // save the result of running the action to the document
  doc.result = runAction(doc)
  // change the state to 'ran-ok'
  doc.state = 'ran-ok'
  // save the document so it can sync
  db.put(doc)
})
```

The runner can also subscribe to new jobs:

```js
db.subscribe(changes => {
  changes.forEach(doc => {
    if (doc.state === 'please-run') {
      doc.result = runAction(doc)
      doc.state = 'ran-ok'
      db.put(doc)
    }
  })
})
```

The client can use a live query to render the list of completed jobs:

```js
const ranJobs = useLiveQuery('state', { key: 'ran-ok' })
```

Each program only interacts with the database, so there’s no direct connection between the mobile device and the API calling function. Instead, writes to the shared database by the backend are synchronized and read from the local replica in the browser.

This prevents re-running API calls with the same query, and makes response data automatically available across all of the user’s synced devices.

On the backend you can use a Fireproof database to coordinate worker processes. For instance, you could have a database full of raw PDF uploads and write a service that subscribes to the database and adds an image thumbnail for any PDFs that don’t have it, both historical and live. Following the same pattern as above one process adds PDFs to the list, and another set of processes does the thumbnailing. By adding a state transition from `please-run` to `running`, you can prevent multiple workers from trying to thumbnail the same PDF.

When API responses are large use file attachments for selective replication. Files are replicated on-demand, so for instance, if you are archiving StreamLit runs you might store parameters in the document and results as a binary HAR file, including media, etc. This allows replay without access to the original StreamLit server.

You can also use this model for tracking a human-driven process like an employee raise approval. A raise request can transition from draft status, through various levels of managerial approval, to final approval and implementation. Document databases are a natural fit for this type of workflow because they allow you to track the state of each document and the transitions between states. This makes it easy to see where a document is in the process and what actions have been taken on it. Fireproof extends this pattern with live updates, so you can see the state of each document in real-time. It also has cryptographic verification, so updates are never in question, and time-travel, so you can see how the database got to its current state.

## When to go multi-database

When you’re designing an application with Fireproof, it’s important to identify the synchronization unit of your app. For example, in a ride-hailing app, each ride would be an individual database, recording all the interactions and clicks from search to drop-off. You would use additional per-user databases to store links to all the rides for a given user or driver.

The above scenario describes a common pattern of per-session or [unit-of-work](https://martinfowler.com/eaaCatalog/unitOfWork.html) databases, which are tracked by per-user databases. The architectural shift here is aligned with the increasing capabilities of the client, manifest as full state management as a session paradigm. A few other scenarios share this alignment:

In a chat application, you can use a shared database for each group chat, and each user sends messages by writing documents. (You can write a document with a “composing” state and a timestamp, and then update it with the user content when the message is sent, for a more real-time feel.) Each user would have their own list of group chats synced among their devices with a per-user database.

Authoring systems like collaborative word processing or data entry would use a database per sharable workspace, and then give each user their own view into the set of workspaces.

In addition to the unit-of-work and per-user databases, you might have an application-global database for content distribution, that is read-only for all users, but updated by your application on launch. You can use this for assets, style packs, policies, feature-flags, and configuration delivery.

Gaming can benefit from per-level asset delivery and sync, as well as on-demand file sync. This allows you to sync a catalog of games and download only the played ones. Or sync levels on demand, and within the levels, lazy load shaders for different runtime environments. You can also use Fireproof to organize game rooms, sync player settings across devices, and manage leaderboards from edge functions.

Read more about when to use multiple databases in [the scaling section.](/docs/concept-guide/scaling-fireproof)

<!-- Figures: Document Database Structure: A diagram showing the structure of a document database.
Live Query Process: A flowchart showing how live queries work in the context of a front end application.
Async backend API Interaction: A diagram showing how APIs interact with the document database and live queries.
LLM streaming response API -->
