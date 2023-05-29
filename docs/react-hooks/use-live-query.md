---
sidebar_position: 1
---

# useLiveQuery


Using Fireproof in your React app is as easy as running:

```bash
npm install use-fireproof
```

Then in your app, you can use the top-level `useLiveQuery` hook to get access to the database and live query responses. Here's an example to-do list that initializes the database and sets up automatic refresh for query results. It also uses the `database.put` function to add new todos. With sync connected, the list of todos will redraw for all users in real-time. Here's the code:

```js
import { useLiveQuery } from 'use-fireproof';

export default TodoList = () => {
  const todos = useLiveQuery('date').docs;
  const database = useLiveQuery.database;
  const [newTodo, setNewTodo] = useState('');

  return (
    <div>
      <input type="text" onChange={(e) => setNewTodo(e.target.value)} />
      <button
        onClick={() =>
          database.put({ text: newTodo, date: Date.now(), completed: false })
        }
      >
        Save
      </button>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => database.put({ ...todo, completed: !todo.completed })}
            />
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

This example shows calling `useLiveQuery` and `database.put`. It may be all you need to get started. You can [try out a running version here.](https://codepen.io/jchrisa/pen/vYVVxez?editors=0010)

## Top-level Usage

You can use the `useLiveQuery` hook to subscribe to query results, and automatically redraw when necessary. When sync is enabled you'll have both parties updating the same database in real time. Here's an example of a simple shared to-do list. For something like a form, you should use Live Document instead. There are two ways to call `useLiveQuery` - as a top-level hook, or based on the return value of `useFireproof`, which allows you to specify the database name and replication options. Most apps will start with the top-level `useLiveQuery` hook, and then move to the lower-level API when they need more control.

```js
import { useLiveQuery } from 'use-fireproof';

export default TodoList = () => {
  const todos = useLiveQuery('date').docs
  ...
```

The top-level call (above) will use the default database name, and the default replication options. 

## Configuring with useFireproof


You can also call `useLiveQuery` with a database name and replication options, by instantiating the `useFireproof` hook directly. Here's an example that uses the lower-level API:

```js
import { useFireproof } from 'use-fireproof';

export default TodoList = () => {
  const { database, useLiveQuery } = useFireproof("my-todo-app")
  const todos = useLiveQuery('date').docs
  ...
```

This [running CodePen example](https://codepen.io/jchrisa/pen/vYVVxez?editors=0010) uses the `useLiveQuery` to display a list of todos, and the `database.put` function to add new todos. 
