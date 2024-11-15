---
sidebar_position: 2
---

# useDocument

You can also subscribe directly to ledger updates, and automatically redraw when necessary. When sync is enabled you'll have both parties updating the same ledger in real-time. Here's an example of a simple shared text area (in real life you'd probably want to use an operational transform library like [Yjs](https://github.com/yjs/yjs) or [Automerge](https://automerge.org) for shared text areas, which both work great with Fireproof).

Just like `useLiveQuery`, you can call `useDocument` as a top-level hook, or based on the return value of `useFireproof`. Here's an example that uses the top-level hook:

```js
import { useDocument } from 'use-fireproof';

const CustomerProfile = ({ customerId }) => {
  const [doc, setDoc, saveDoc] = useDocument({
    _id: `${customerId}-profile`,
    name: "",
    company: "",
    startedAt: Date.now()
  });
  return (
    <div>
      <form>
        Name:
        <input
          type="text"
          value={doc.name}
          onChange={(e) => setDoc({ name: e.target.value })}
        />
        Company:
        <input
          type="text"
          value={doc.company}
          onChange={(e) => setDoc({ company: e.target.value })}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            saveDoc();
          }}
        >
          Save
        </button>
      </form>
          <p>Started at: {doc.startedAt}</p>
        <pre>{JSON.stringify(doc, null, 2)}</pre>
    </div>
  );
};
```

## Create new documents with `useDocument`

You can also use `useDocument` to create new documents. Just don't pass in an `_id` as part of your initial doc, and the ledger will assign a new one when you call `saveDoc`. Pass `false` to `saveDoc` to reset to the initial state.

The top-level call (above) will use the default ledger name and replication options. 

## Configuring with `useFireproof`

You can also call `useDocument` with a ledger name and replication options, by instantiating the `useFireproof` hook directly. Here's an example that uses the lower-level API:

```js
import { useFireproof } from 'use-fireproof';

const CustomerProfile = ({ customerId }) => {
  const { ledger, useDocument } = useFireproof("my-todo-app")
  const [doc, setDoc, saveDoc] = useDocument({
    _id: `${customerId}-profile`,
    name: "",
    company: "",
    createdAt: new Date()
  });
  ...
```

