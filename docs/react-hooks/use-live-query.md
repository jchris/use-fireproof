---
sidebar_position: 1
---

# useLiveQuery

`useLiveQuery` is a React hook that provides access to live query results, enabling real-time updates in your app. For a step-by-step tutorial building an app with `useLiveQuery`, check out the [React tutorial](/docs/react-tutorial).

## Quick Start

Install the package:

```bash
npm install use-fireproof
```

Import the library:

```js
import { useLiveQuery } from 'use-fireproof'
```

Call the `useLiveQuery` hook from within a React component, in this case to sort by `date`:

```js
const todos = useLiveQuery('date')
```

Render based on the results:

```jsx
<ul>
  {todos.map(todo => (
    <li key={todo._id}>{todo.text}</li>
  ))}
</ul>
```

Save a new todo item via the `useLiveQuery.ledger` convenience accessor:

```js
useLiveQuery.ledger.put({ text: 'New Todo', date: Date.now(), completed: false })
```

That's it! Read on for details or customize the ledger you connect to with the [`useFireproof`](./use-fireproof) hook.

## Basic Example

In your app, you can use the top-level `useLiveQuery` hook to get access to the ledger and live query responses. Here's an example to-do list that initializes the ledger and sets up automatic refresh for query results. It also uses the `ledger.put` function to add new todos. With sync connected, the list of todos will redraw for all users in real-time. Here's the code:

```js
import { useLiveQuery } from 'use-fireproof'

export default TodoList = () => {
  const todos = useLiveQuery('date').docs
  const ledger = useLiveQuery.ledger
  const [newTodo, setNewTodo] = useState('')

  return (
    <div>
      <input type="text" onChange={e => setNewTodo(e.target.value)} />
      <button onClick={() => ledger.put({ text: newTodo, date: Date.now(), completed: false })}>
        Save
      </button>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => ledger.put({ ...todo, completed: !todo.completed })}
            />
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

This example shows calling `useLiveQuery` and `ledger.put`. It may be all you need to get started.

<!-- You can [try out a running version here.](https://codepen.io/jchrisa/pen/vYVVxez?editors=0010) -->

## Top-level Usage

You can use the `useLiveQuery` hook to subscribe to query results, and automatically redraw when necessary. When sync is enabled you'll have both parties updating the same UI in real time. Here's an example of a simple shared to-do list. For something like a form, you should call [`useDocument`](./use-document) instead. There are two ways to call `useLiveQuery` - as a top-level hook, or based on the return value of `useFireproof`, which allows you to specify the ledger name and replication options. Most apps will start with the top-level `useLiveQuery` hook, and then move to the lower-level API when they need more control.

```js
import { useLiveQuery } from 'use-fireproof';

export default TodoList = () => {
  const todos = useLiveQuery('date').docs
  ...
```

The top-level call (above) will use the default ledger name, and the default replication options.

## Configuring with useFireproof

You can also call `useLiveQuery` with a ledger name and replication options, by instantiating the [`useFireproof`](./use-fireproof) hook directly. Here's an example that uses the lower-level API:

```js
import { useFireproof } from 'use-fireproof';

export default TodoList = () => {
  const { ledger, useLiveQuery } = useFireproof("my-todo-app")
  const todos = useLiveQuery('date').docs
  ...
```

<!-- This [running CodePen example](https://codepen.io/jchrisa/pen/vYVVxez?editors=0010) uses the `useLiveQuery` to display a list of todos, and the `ledger.put` function to add new todos.  -->
