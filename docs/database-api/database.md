---
sidebar_position: 1
---

# Database

Read about creating and configuring a database, and APIs for interacting with data. If you are writing a React application, you will probably want to use [the React Hooks](/docs/react-hooks/use-live-query) instead. These APIs are for advanced use cases or server-side code.

## Creating a Database

### `Fireproof.storage()`

Most of the time you will create a database using `Fireproof.storage("my-database")`. The database name is optional, and if you don't provide one, the database will operate in-memory only. This is useful for testing, or for creating a database that you don't want to persist.

The `storage` method will load the database config from the correct storage location, and will create the database if it doesn't exist. 

### `Fireproof.fromConfig()`

If you want to manage your own database config, you can call `Fireproof.fromConfig("my-database", configObject)` method instead, where `configObject` has the necessary fields. See [Database Headers](#database-headers) on this page for more information about managing your own config.

*Coming in 0.7.0*: In 0.6 and before, storage was automatically chosen by Fireproof based on the environment. 0.7.0 brings pluggable storage, including optional secondary storage for automatic replication. See [Storage](./storage) for more information.

## Document APIs

JSON documents can be saved, read, and deleted. Read more about the [document API](./documents).

## Query and Index APIs

Fireproof allows you to create flexible indexes on any document field. You can then query the index to find documents that match your query. Read more about the [query and index API](./index-query).

## Subscribing to Changes

You can register a callback to be notified when a document changes. This is useful for updating your UI in real-time. 

### `subscribe()`

Subscriptions are attached using the `database.subscribe((changes) => {...})` method, which returns a callback for unsubscribing, compatible with React's `useEffect` hook. 

Here is an example of how the `useDocument` hook uses subscriptions to update the UI:

```js
useEffect(
  <React.EffectCallback>(() =>
    database.subscribe((changes: { key: string; id: string }[]) => {
      if (changes.find((c) => c.key === id)) {
        refreshDoc();
      }
    })),
  [id, refreshDoc],
);
```

## Querying Changes

### `changeSince()`

You can also query the database for changes since the last time you asked. This is useful for updating external indexes and is used internally by Fireproof for syncing data between databases. To get the recent changes, call `database.changesSince()`. This will return an array of changes since the last time you called `changesSince()`. The changes are returned in the order they were made.

```js
const changes = await database.changesSince();
// changes.rows is an array of changes
// changes.clock is the high water mark
const didPut = await database.put({ foo: "bar" });

const newChange = await database.changesSince(changes.clock);
// newChange.rows will contain only the new change
```

You can see an example of how this is used in the [external indexer documentation](./index-query#external-indexers).

## Database Headers

The database header contains the clock, which is used to track the most recent commit. Parallel writes, and sync or merges between two databases can result in a clock with more than one head. Fireproof will resolve the clock to a single head on the next write.

The header also tracks the database encryption key and the encryption key for the indexes. These keys are 32 bytes long and are randomly generated when the database is created. The database key is used to encrypt the database, and the index key is used to encrypt the indexes. By storing the headers separately from the data CAR files, you can utilize untrusted storage for the data, while keeping the keys in a trusted location.

The header tracks CAR files (content-addressed-archive) which it uses to load the database. The listed CAR file name for each storage option points to an encrypted map which Fireproof uses to load the rest of the database.

```json
{
  "clock": [
    "bafyreibllbdlexr25r2fe42dh56rqbfif3vcu4iyzh5ltk4z33myo74mcu"
  ],
  "name": "my-database",
  "index": {
    "key": "15b539987a562e1d62315858149d3b337adbee45f6c4d3f5a5d306b8f6cd45a9"
  },
  "indexes": [],
  "key": "0502a306341364c63a12d0c7468e50659d909127bb6b784b79214d2961d7b14d",
  "car": "bafkreieznsnhlyjoffytquju4qydz4unyblno7fjvtzs7u75y6tgu3cnti"
}
```

Read more about [encryption](./encryption) in the API docs.
