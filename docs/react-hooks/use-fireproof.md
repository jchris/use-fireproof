---
sidebar_position: 3
---

# Optional Config

Most applications will only need the [`useLiveQuery`](./use-live-query) or [`useDocument`](./use-document) hooks, which use the default configuration. But if you need to do custom database setup, or configure a database name other than the React hook default (`"useFireproof"`) you can call the `useFireproof` hook directly. This is also useful if you want to distribute the Fireproof React hooks through your app with a React Context.


## Top-level useFireproof Example

```js
import { useFireproof } from 'use-fireproof';

const optionalDefineDatabaseFn = (database) => {
  // define indexes here if you need them before setup
}

const optionalSetupDatabaseFn = async (database) => {
  // create initial documents here if you need them
  await database.put({ _id: 'foo', bar: 'baz' }})
}

function MyComponent() {
  const { 
    ready, 
    database, 
    useLiveQuery, 
    useDocument 
  } = useFireproof(
    "database-name", 
    optionalDefineDatabaseFn, 
    optionalSetupDatabaseFn
  );

  return (<div>
    {/* ... your UI here ... */}
    </div>)
}
```

The `useFireproof` hook takes two optional setup function arguments, `defineDatabaseFn` and `setupDatabaseFn`. The return value looks like `{ useLiveQuery, useDocument, database, ready }` where the `database` is the Fireproof instance that you can interact with using `put` and `get`, or via your indexes. The `ready` flag turns true after your setup function completes, you can use this to activate your UI. The `useLiveQuery` and `useDocument` functions are configured versions of the top-level hooks and are the recommended API to update your React app in real-time.

### Use Live Query

You can configure `useLiveQuery` with a database name and replication options, by instantiating the `useFireproof` hook directly. Here's an example:

```js
import { useFireproof } from 'use-fireproof';

export default TodoList = () => {
  const { database, useLiveQuery } = useFireproof("my-todo-app")
  const todos = useLiveQuery('date').docs
  ...
```

### Use Document

You can configure `useDocument` with a database name and replication options, by instantiating the `useFireproof` hook directly. Here's an example:

```js
import { useFireproof } from 'use-fireproof';

export default TodoList = () => {
  const { useDocument } = useFireproof("my-todo-app")
  const [todo, setTodo, saveTodo] = useDocument({title: 'New Todo'})
  ...
```


### Database subscription

Changes made via remote sync peers, or other members of your cloud replica group will appear automatically if you use the `useLiveQuery` and `useDocument` APIs. This make writing collaborative workgroup software, and multiplayer games super easy. If you want to manage subscriptions to the database yourself, you can use the `database.subscribe` function. This is useful if you want to manage your own state, or if you want to use the database API directly instead of the hooks.

Here is an example that uses direct database APIs instead of document and query hooks. You might see this in more complex applications that want to manage low-level details.

```js
import { useFireproof } from 'use-fireproof';

function MyComponent() {
  const { ready, database } = useFireproof("database-name", defineDatabaseFn, setupDatabaseFn);

  // set a default empty document
  const [doc, setDoc] = useState({});

  // run the loader on first mount
  useEffect(() => {
    const getDataFn = async () => {
      setDoc(await database.get('my-doc-id'));
    };
    getDataFn();
    return database.subscribe(getDataFn);
  }, [database]);

  // a function to change the value of the document
  const updateFn = async () => {
    await database.put({ _id: 'my-doc-id', hello: 'world', updated_at: new Date() });
  };

  // render the document with a click handler to update it
  return <pre onclick={updateFn}>{JSON.stringify(doc)}</pre>;
}
```

This results in a tiny application that updates the document when you click it. In a real application you'd probably query an index to present eg. all of the photos in a gallery.

## Setup Functions

### `defineDatabaseFn`

Synchronous function that defines the database, run this before any async calls. You can use it to do stuff like set up Indexes. Here's an example:

```js
const defineIndexes = (database) => {
  new Index(database, 'allLists', function (doc, map) {
    if (doc.type === 'list') map(doc.type, doc);
  });
  new Index(database, 'todosByList', function (doc, map) {
    if (doc.type === 'todo' && doc.listId) {
      map([doc.listId, doc.createdAt], doc);
    }
  });
  window.fireproof = database; // 🤫 for dev
  return database;
};
```

### `setupDatabaseFn`

#### A note on using Context

If you are just calling `useLiveQuery` and `useDocument` and doing setup with the synchronous `defineDatabaseFn`, you may not need to manage context. If you are doing async setup work with `setupDatabaseFn` you will need to manage context. This allows you to run database setup code once for your entire app. Here is what you might see in App.js:

```js
import { FireproofCtx, useFireproof } from '@fireproof/core/hooks/use-fireproof';

function App() {
  // establish the Fireproof context value
  const fpCtxValue = useFireproof('dbname', defineIndexes, setupDatabase);

  // render the rest of the application wrapped in the Fireproof provider
  return (
    <FireproofCtx.Provider value={fpCtxValue}>
      <MyComponent />
    </FireproofCtx.Provider>
  );
}
```

An asynchronous function that uses the database when it's ready, run this to load fixture data, insert a dataset from somewhere else, etc. Here's a simple example:

```js
async function setupDatabase(database)) {
    const apiData = await (await fetch('https://dummyjson.com/products')).json()
    for (const product of apiData.products) {
        await database.put(product)
    }
}
```

### Hint: Deterministic Fixtures

If you are running the same setup across multiple users installations, you probably want to use deterministic randomness to generate the same data on each run, so people can sync together. Here is an example of generating deterministic fixtures, using `mulberry32` for deterministic randomness so re-runs give the same CID, avoiding unnecessary bloat at development time, taken from the TodoMVC demo app.

```js
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1); // determinstic fixtures

export default async function loadFixtures(database) {
  const nextId = (prefix = '') => prefix + rand().toString(32).slice(2);
  const listTitles = ['Building Apps', 'Having Fun', 'Getting Groceries'];
  const todoTitles = [
    [
      'In the browser',
      'On the phone',
      'With or without Redux',
      'Login components',
      'GraphQL queries',
      'Automatic replication and versioning',
    ],
    ['Rollerskating meetup', 'Motorcycle ride', 'Write a sci-fi story with ChatGPT'],
    [
      'Macadamia nut milk',
      'Avocado toast',
      'Coffee',
      'Bacon',
      'Sourdough bread',
      'Fruit salad',
    ],
  ];
  let ok;
  for (let j = 0; j < 3; j++) {
    ok = await database.put({
      title: listTitles[j],
      type: 'list',
      _id: nextId('' + j),
    });
    for (let i = 0; i < todoTitles[j].length; i++) {
      await database.put({
        _id: nextId(),
        title: todoTitles[j][i],
        listId: ok.id,
        completed: rand() > 0.75,
        type: 'todo',
      });
    }
  }
}
```

