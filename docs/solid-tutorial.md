---
sidebar_position: 3
---

# SolidJS Tutorial

This tutorial will show you the basics of using Fireproof in SolidJS. It contains a simple example as well as additional details on how it all works. 

## Installation

To get started, install `solid-js` and `@fireproof/solid-js`. (Note: `solid-js` is a peer depdendency)

```sh
npm install solid-js @fireproof/solid-js
pnpm install solid-js @fireproof/solid-js
```

### Example

Create an instance of Fireproof, the first document & a live query. For this example we're using a 'ToDo' list. 

```ts
import { createFireproof } from "@fireproof/solid-js";

type Todo = { text: string; date: number; completed: boolean };

// You can have a global database that any Solid component can import
const TodoListDB = createFireproof('TodoListDB');

/*
 Or you can destructure the hook
 const { database, createDocument, createLiveQuery } = createFireproof('TodoListDB');
*/

export default function TodoList() {
  const todos = TodoListDB.createLiveQuery<Todo>('date', { limit: 10, descending: true })
  const [todo, setTodo, saveTodo] = TodoListDB.createDocument<Todo>(() => ({
    text: '',
    date: Date.now(),
    completed: false,
  }));
```

## API Reference

More details about the SolidJS APIs that were used in the example above. 

### createFireproof

The primary export of the `@fireproof/solid-js` package is the `createFireproof` SolidJS hook.

```tsx
// API Signature
function createFireproof(dbName?: string, config?: ConfigOpts): CreateFireproof;
```

Using the hook without specifying a name for the database will default the name to `FireproofDB` under the hood. Aside from receiving an accessor to the database, you will also receive two supporting SolidJS hooks `createDocument` and `createLiveQuery` which act against said database.

```ts
// non-destructured vs destructured
const FireproofDB = createFireproof();
const { createDocument, createLiveQuery, database } = createFireproof();

const AwesomeDB = createFireproof("AwesomeDB");
const { createDocument, createLiveQuery, database } = createFireproof("AwesomeDB");
```

### createDocument

Create (or modify) a document in your Fireproof database.

```ts
// API Signature
function createDocument<T extends DocRecord<T>>(initialDocFn: Accessor<Doc<T>>): CreateDocumentResult<T>;
```

To modify an existing document, include the `_id` field. Omit that field to create a new one, as shown: 

```ts
type Todo = { text: string; count: number; completed: boolean };

// Creates a new document on save
const [todo, setTodo, saveTodo] = createDocument<Todo>(() => ({ text: "", count: 0, completed: false }));

// Modifies an existing document (by _id) on save
const [todo, setTodo, saveTodo] = createDocument<Todo>(() => ({ _id: "...", text: "", count: 0, completed: false }));
```

The `createDocument` API will return to you a tuple containing three things:

- the document getter
- the document setter
- save/write function to database

The hook supports TypeScript generics, so all functions in the tuple will be type-scoped to the custom type injected as part of the invocation.

The getter/setter operates much like a standard `createSignal` call, except the setter has a different signature.

```ts
type UpdateDocFnOptions = { readonly replace?: boolean };
type UpdateDocFn<T extends DocRecord<T>> = (newDoc?: Partial<Doc<T>>, options?: UpdateDocFnOptions) => void;
```

Examples of how to use the setter:

```ts
const [todo, setTodo] = createDocument<Todo>(() => ({ text: "", count: 0, completed: false }));
// Sticking with the Todo objects from above.
// You can pass partial structs updating target fields
// Or you can update everything at once
setTodo({ text: "newTodo" });
setTodo({ count: 3 });
setTodo({ completed: true });

// Output { text: "newTodo", count: 3, completed: true }
console.log(todo());

// Reset the document to default original state
setTodo();

// Output { text: "", count: 0, completed: false }
console.log(todo());

// Using the replace option will completely overwrite the document.
// Essentially, it is both a reset as shown earlier + an apply
setTodo({ text: "anotherTodo", count: 2, completed: false }, { replace: true });
```

The last function in the tuple is save/write to database. It has the following signature:

```ts
type StoreDocFn<T extends DocRecord<T>> = (existingDoc?: Doc<T>) => Promise<DbResponse>;
```

This function has two modes of use:

- Save/update the current document to the database
- Save/update an _existing_ document in the database

The first mode is executed by simply invoking the function like so:

```ts
await saveTodo(); // save/write the current document state to the database
```

The second mode can only be exercised by complementing `createDocument` with the results from `createLiveQuery`, like this: 

### createLiveQuery

Access to live query results, enabling real-time updates in your app.

```ts
type LiveQueryResult<T extends DocRecord<T>> = {
  readonly docs: Doc<T>[];
  readonly rows: IndexRow<T>[];
};

export type CreateLiveQuery = <T extends DocRecord<T>>(
  mapFn: string | MapFn,
  query?: QueryOpts,
  initialRows?: IndexRow<T>[]
) => Accessor<LiveQueryResult<T>>;
```

Here are some usage examples:

```ts
const result = createLiveQuery("_id"); // all documents
const result = createLiveQuery("date"); // find docs with a 'date' field
const result = createLiveQuery<Todo>("date", { limit: 10, descending: true }); // key + options + generics
```

The `createLiveQuery` hook is responsibile for subscribing for document updates against the database. If any changes have been made, the query results will be updated, triggering a re-render of contents on your web application.

You can specify your function as a string and Fireproof will interpret it as indexing that field on all documents. You can also pass a function for more control. The same mechanism that powers the built-in indexes can all be used to connect secondary [vector indexers](https://github.com/tantaraio/voy) or fulltext indexes to Fireproof. [Follow this tutorial to connect a secondary index](https://fireproof.storage/documentation/external-indexers/).

### database

The last thing you receive from `createFireproof` is the accessor to the underlying Fireproof database. This can also be used to access the database, like so: 

```ts
const { id } = await database().put({
    _id: 'three-thousand'
    name: 'André',
    age: 47
});

const doc = await database().get('three-thousand')
// {
//    _id  : 'three-thousand'
//    name : 'André',
//    age  : 47
// }

const result = await database().query("age", { range: [40, 52] })
```

To see what else you can do, head over to the [JavaScript API basics.](https://use-fireproof.com/docs/database-api/basics)

## What's Next

If you're building with Fireproof and SolidJS, we want to hear from you - join our Discord, or find us on Twitter and LinkedIn. The community is already doing amazing things, we're excited to support you!

