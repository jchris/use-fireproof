---
sidebar_position: 5
---

# Scaling Fireproof

Fireproof provides scalable, collaborative database solutions with the option of per session, per collab database apps, efficient compaction, and flexible file attachments.

## Managing Per Session, Per Collab Database Apps

Each database in Fireproof is a unit of synchronization, preserving a verifiable event log. It's recommended to scope each instance to a group or task, rather than running it like a universe with everyone's data intermingled, as you might do with a site-wide relational database. Use an individual database for each project, chat room, or collaboration task. This way, you are only syncing the relevant data, and users can choose which databases to sync based on their interest and usage. If a database seems like it could grow indefinitely, consider ways to segment it. For instance, giving each shopping cart session a fresh database can simplify app development as you don't have to worry as much about segmenting data in your queries and app; all the data is relevant.

Consider the following examples:

- For a scheduling app, you might have a database per month, syncing the upcoming few months but not those from a year ago.
- For a storyboarding app, each world of characters could be its own database, with documents for in-process storyline development, reflecting the collaborative group nature of the app.
- For chatbot apps, it makes sense to have one database per chat, so that each chat can be loaded and managed individually, instead of requiring clients to load all chats to interact with any of them.

Complex apps, like a public content management system, can use a multi-database backend. Here, users each have their own writable copy of the database, and can nominate contributions for merge into the public copy by moderators. Moderators can load and review the change, and push it to the public instance.

There’s no limit to the number of databases a Fireproof install can have, so naming them with UUIDs or other random identifiers makes sense. Databases can cheaply fork, so you can share the same initial storage across your user base, and write their forks as individual diffs, merge and publish a new canonical main branch, and repeat the process while minimizing duplication. See the storage architecture section for more detail on the encrypted block store.

## Compaction

Each database transaction is written to a new file or key as a lightweight encrypted diff, including links to the previous diff to allow reconstructing the complete dataset. After a certain number of transactions have accumulated, the set of diffs to load creates its own performance challenges. To address this, Fireproof periodically compacts the dataset to a single file, by default when the number of diffs is greater than 100.

There are numerous compaction optimizations that can be implemented. Before 1.0, we need to decide on semantics for data preservation. Most databases allow for a system purge to remove old versions of data, either on a key or historic basis. Currently, Fireproof compaction preserves all database history, but discards unreferenced internal index blocks, etc. Each compaction links to the dataset it replaces, so it’s possible to reconstruct history from immutable archives even from a compacted lean dataset.

## When to Use File Attachments

Fireproof file attachments are read and written through the database API and via the Fireproof storage and encryption system, but they are replicated independently from the database. This is useful for instance, in a museum app which can load gallery metadata up-front, lazy load thumbnails on browse events, and sync full media assets on demand.

If you add multiple files in the same document update, they will end up in the same encrypted file, so they will all sync together. This is useful in cases where you know you need them all. For instance, all the assets for a game level can be in one car file, so they are delivered atomically. If you replace a few of the assets, Fireproof will load both car files and serve the latest version. This makes it efficient for occasionally updated internal content repositories like field service apps.

<!-- Figures:
Session Management: A diagram showing how to manage per session, per collab database apps.
Compaction Process: A flowchart showing the process of compaction in the context of scaling Fireproof.
Binary Attachments Usage: A diagram showing when to use binary attachments in the context of scaling Fireproof. -->
