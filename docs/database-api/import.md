---
sidebar_position: 1
---
# Basics

Of course, you already ran `npm install @fireproof/core`

The default package import provides a concise way to access Fireproof, this quick sketch will give you a sense of how the API works:

```js
import { fireproof } from '@fireproof/core';

const db = fireproof('my-db')

// put a document
const ok = await db.put({ _id: 'my-doc', hello: 'world' })

// get a document
const doc = await db.get('my-doc')

// delete a document
const ok = await db.del('my-doc')

// query for documents
const { rows } = await db.query('hello', { range: ['a', 'z'] })

// query for recent changes since a clock
const { rows : chs } = await db.changes(ok.clock)

// subscribe to live updates
const unsub = db.subscribe((updates) => {
  // updates is an array of documents
})
```

You can read more about the [database API](./database) and the [document API](./documents) in the API docs.

For getting started with React, see the [React tutorial](/docs/react-tutorial).

Fireproof runs almost anywhere. Read about [framework and bundler support](/docs/bundling).
