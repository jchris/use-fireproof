---
sidebar_position: 3
---

# useFireproof

The `useFireproof` hook provides access to Fireproof's React hooks and ledger instance. You'll use it to get the [`useLiveQuery`](./use-live-query) and [`useDocument`](./use-document) hooks configured for your application.

The hook accepts either a ledger name as a string, or a ledger instance. This allows you to configure a custom ledger name (instead of the default "useFireproof"), or pass an existing ledger instance. You can also [see configuration examples in the Create React App bundler workaround.](https://github.com/fireproof-storage/fireproof/issues/2)

The hook is also useful for distributing Fireproof's React hooks throughout your app using React Context.

## Basic Example

```js
import { useFireproof } from 'use-fireproof';

function MyComponent() {
  const { 
    ledger, 
    useLiveQuery, 
    useDocument 
  } = useFireproof(
    "ledger-name" | ledgerInstance
  );

  return (<div>
    {/* ... your UI here ... */}
    </div>)
}
```

 The return value looks like `{ useLiveQuery, useDocument, ledger }` where the `ledger` is the Fireproof instance that you can interact with using `put` and `get`, or via your indexes. The `useLiveQuery` and `useDocument` functions are configured versions of the top-level hooks and are the recommended API to update your React app in real-time.

### Use Live Query

You can configure `useLiveQuery` with a ledger name by instantiating the `useFireproof` hook directly. Here's an example:

```js
import { useFireproof } from 'use-fireproof';

export default TodoList = () => {
  const { ledger, useLiveQuery } = useFireproof("my-todo-app")
  const todos = useLiveQuery('date').docs
  ...
```

### Use Document

You can configure `useDocument` with a ledger name instantiating the `useFireproof` hook directly. Here's an example:

```js
import { useFireproof } from 'use-fireproof';

export default TodoList = () => {
  const { useDocument } = useFireproof("my-todo-app")
  const [todo, setTodo, saveTodo] = useDocument({title: 'New Todo'})
  ...
```


### Ledger subscription

Changes made via remote sync peers, or other members of your cloud replica group will appear automatically if you use the `useLiveQuery` and `useDocument` APIs. This make writing collaborative workgroup software, and multiplayer games super easy. If you want to manage subscriptions to the ledger yourself, you can use the `ledger.subscribe` function. This is useful if you want to manage your own state, or if you want to use the ledger API directly instead of the hooks.

Here is an example that uses direct ledger APIs instead of document and query hooks. You might see this in more complex applications that want to manage low-level details.

```js
import { useFireproof } from 'use-fireproof';

function MyComponent() {
  const { ready, ledger } = useFireproof("ledger-name");

  // set a default empty document
  const [doc, setDoc] = useState({});

  // run the loader on first mount
  useEffect(() => {
    const getDataFn = async () => {
      setDoc(await ledger.get('my-doc-id'));
    };
    getDataFn();
    return ledger.subscribe(getDataFn);
  }, [ledger]);

  // a function to change the value of the document
  const updateFn = async () => {
    await ledger.put({ _id: 'my-doc-id', hello: 'world', updated_at: new Date() });
  };

  // render the document with a click handler to update it
  return <pre onclick={updateFn}>{JSON.stringify(doc)}</pre>;
}
```

This results in a tiny application that updates the document when you click it. In a real application you'd probably query an index to present eg. all of the photos in a gallery.


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

export default async function loadFixtures(ledger) {
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
    ok = await ledger.put({
      title: listTitles[j],
      type: 'list',
      _id: nextId('' + j),
    });
    for (let i = 0; i < todoTitles[j].length; i++) {
      await ledger.put({
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

