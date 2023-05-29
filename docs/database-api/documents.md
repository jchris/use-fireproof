---
sidebar_position: 2
---

# Documents

Fireproof uses JSON documents to store data. Documents are stored in a single collection, and each document has a unique ID. Documents can be read, written, and deleted. Validation functions can prevent unwanted changes from being written to the database.

## Document read and write

### `put()`

To write and read a new document in Fireproof, you just call the `put` function and the `get` function:

```js
const putResponse = await database.put({hello : "world"})
// { id, clock }
const theDocument = await database.get(putResponse.id)
// { _id, hello : "world"  }
```

### `get()`

When special fields like `id` or `clock` appear in the document, they are prefixed with an underscore, like `_id` above. If you don't specify an `_id` in your document body, Fireproof will generate one for you. That is what is returned as `putResponse.id` above.

Updates are as simple as modifying the document and putting it back.

```js
theDocument.hello = "everybody"
const putResponse2 = await database.put(theDocument)
// { id, clock }
const theDocumentV2 = await database.get(putResponse.id)
// { _id, hello : "everybody" }
```

By default MVCC is not enabled, so you can put to the same `id` over and over again without failure, like this:

```js
theDocument.hello = "again"
const putResponse3 = await database.put(theDocument)
theDocument.hello = "there"
const putResponse4 = await database.put(theDocument)
```

If multiple users are working this way, whoever writes last wins, overwriting the other changes (at least until conflict merge.)

## Multi-version concurrency control (MVCC)

If you want to prevent that scenario, you can enable multi-version concurrency control, which will require that writers prove they are updating from the latest version, or else the write fails. This can give them a chance to reload from the source and incorporate their changes before writing, instead of doing it later as a conflict merge.

The put response includes an `id` which is unique for the document in the database, and a `clock` which represents the current snapshot of the database. You can also request that Fireproof inline the clock with the document by passing the `{ mvcc: true }` option:

```js
const theDocumentV4 = await database.get(putResponse.id, { mvcc: true })
// theDocumentV4._clock === putResponse4.clock
```

If the clock is inline in the document it will protect against writing with stale data. Here's what happens if another update comes in before the document loaded with `{ mvcc: true }`:

```js
theDocument.hello = "friends"
const putResponse5 = await database.put(theDocument)
// now theDocumentV4, which has _clock, is out of date
const putResponse5 = await database.put(theDocumentV4)
// throws new Error('MVCC conflict, document is changed, please reload the document and try again.')
```

In this way you can protect against users being surprised by accidental data overwrites.

