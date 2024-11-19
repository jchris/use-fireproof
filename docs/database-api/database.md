---
sidebar_position: 2
---

# Ledger

Fireproof ledger operations include creating, reading, updating, and deleting documents, as well as querying and indexing.

Read about creating and configuring a ledger, and APIs for interacting with data. If you are writing a React application, you will probably want to use [the React Hooks](/docs/react-hooks/use-live-query) instead. These APIs are for advanced use cases or server-side code.

See the [basics page for a super quick start about the raw ledger API](/docs/database-api/basics)

## Creating a Ledger

```js
fireproof("ledger-name")
```

Opens a ledger with the given name, safe to call repeatedly.

```ts
import { fireproof } from 'use-fireproof'

const ledger = fireproof('my-ledger')
```

Most of the time you will create a ledger using `fireproof("my-ledger")`. The ledger name is optional, and if you don't provide one, the ledger will operate in-memory only. This is useful for testing, or for creating a ledger that you don't want to persist.

The `fireproof` method will load the ledger config from the correct storage location, and will create the ledger if it doesn't exist. You can also load with config:

### Ledger Config

```ts
fireproof("ledger-name", configObject)
```

You can call `fireproof` with a config object. Pass `{ public: true }` to bypass encryption. This is useful for creating a ledger that you want to share with other users.

```ts
const ledger = fireproof('my-ledger', { public: true })
```

If you want to manage your own ledger config, you can call `Fireproof.fromConfig("my-ledger", configObject)` method instead, where `configObject` has the necessary fields. See [Ledger Headers](/docs/database-api/storage#database-headers) for more information about managing your own config. Please contribute pull requests to move local storage configuration here instead of in the build.

## Document APIs

Read more about the [document API](./documents). Create, read, update, delete with 

## Query and Index APIs

Fireproof allows you to create flexible indexes on any document field. You can then query the index to find documents that match your query. Read more about the [query and index API](./index-query).

### All Docs

### `allDocs()`

You can query all documents in a ledger using the `ledger.allDocs()` method. This will return an array of all documents in the ledger.

```ts
const docs = await ledger.allDocs()
```

## Subscribing to Changes

You can register a callback to be notified when a document changes. This is useful for updating your UI in real-time.

### `subscribe()`

Subscriptions are attached using the `ledger.subscribe((changes) => {...})` method, which returns a callback for unsubscribing, compatible with React's `useEffect` hook.

Here is an example of how the `useDocument` hook uses subscriptions to update the UI:

```js
useEffect(
  <React.EffectCallback>(() =>
    ledger.subscribe((changes: { key: string; id: string }[]) => {
      if (changes.find((c) => c.key === id)) {
        refreshDoc();
      }
    })),
  [id, refreshDoc],
);
```

## Querying Changes

### `changes()`

You can also query the ledger for changes since the last time you asked. This is useful for updating external indexes and is used internally by Fireproof for syncing data between ledgers. To get the recent changes, call `ledger.changes()`. This will return an array of changes since the last time you called `changes()`. The changes are returned in the order they were made.

```js
const changes = await ledger.changes()
// changes.rows is an array of changes
// changes.clock is the high water mark
const didPut = await ledger.put({ foo: 'bar' })

const newChange = await ledger.changes(changes.clock)
// newChange.rows will contain only the new change
```

You can see an example of how this is used in the [external indexer documentation](./index-query#external-indexers).

Read more about [encryption](./encryption) in the API docs.
