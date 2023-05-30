---
sidebar_position: 2
---

# React Tutorial

This article will walk you through creating a simple todo list application from scratch. If you are new to React, it should be all you need to get started. If you are an expert, skim ahead and then check out the [API docs](/docs/react-hooks/use-live-query).

## Create a New App

We'll start with a fresh React app. You can use [create-react-app](https://create-react-app.dev/) to get started, but Fireproof works equally well with other React distributions such as [Remix](https://remix.run/) or [Next.js](https://nextjs.org/). 

```bash
npx create-react-app my-app
cd my-app
```

## Install Fireproof

Installing the React hooks package will also install the [core Fireproof](https://www.npmjs.com/package/@fireproof/core) library.

```bash
npm install use-fireproof
```

## Connect Your Component

In this example, our todo list application can create todo items, list them, and toggle their completed status. We'll start by modifying the component called `App` in `src/App.js`. This component is wired as the root of the application by `create-react-app` in `src/index.js` so it's best to work within it. By the end of the tutorial we will have replaced the whole file, but take it one step at a time, to learn how the pieces fit together. The final file is shared below. Also, you can clone [the resulting application here](https://github.com/jchris/my-fireproof-app), or [view the live demo](https://codesandbox.io/p/github/jchris/my-fireproof-app/main).

In this app, we use the top-level `useLiveQuery` hook to auto-refresh query responses (so your app dynamically refreshes with no extra work), and the `useDocument` hook to create new documents. These hooks can also be [configured by the optional `useFireproof` hook](/docs/react-hooks/use-fireproof), but most apps should start with the defaults.

### Import the Hooks

The first step is to import the hooks into your new app. In `src/App.js`, add the following line to the top of the file:

```js
import { useLiveQuery, useDocument } from 'use-fireproof'
```

These hooks are all you need to automatically initiate a browser-local copy of the database and begin development. The `useLiveQuery` hook will automatically refresh query results, and the `useDocument` hook loads and saves Fireproof documents and handles refreshing them when data changes.

Fireproof takes a build-first approach, so after your UI is running, you can connect to your cloud of choice.

### Query Todos

Now, inside of your component, you can call `useLiveQuery` to get a list of todos (it will start empty):

```js
function App() {
  const response = useLiveQuery('date')
  const todos = response.docs
```

The `useLiveQuery` hook will automatically refresh the `response` object when the database changes. The response object contains the `docs` array, which is the list of todos. The response also has `rows` which are the index rows, in this case they will have a `key` with the `date` field of the todo, and an `id` field with the document id of the todo. In more complex applications you can customize the `value` of these rows, for instance to provide full-name from first and last. [Read more about indexes and queries in the documentation.](/docs/database-api/index-query)


In our application, the todos are displayed by the following JSX, which renders their `text` field. The event handler for updating the todo is written inline. Notice how `database.put` is used to toggle the `completed` field when the checkbox is clicked:

```jsx
<ul>
  {todos.map(todo => (
    <li key={todo._id}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => useLiveQuery.database.put({ ...todo, completed: !todo.completed })}
      />
      {todo.text}
    </li>
  ))}
</ul>
```

For convenience, the `database` object is attached to the `useLiveQuery` and `useDocument` hooks. The `database.put` function is used to update the document, and it will automatically refresh the query results. Read more in the [document API documentation](/docs/database-api/documents). In this tutorial, we'll also use the `useDocument` hook to manage documents. The `database.put` function is better for toggling the completed field, but `useDocument` will be useful for creating new todos.

### Create a New Todo

Next, we'll add a form to create new todos. Notice how `useDocument` is called with an initial value for the document:

```js
const [todo, setTodo, saveTodo] = useDocument({ text: '', date: Date.now(), completed: false })
```

The return value is essentially the return value of [`useState`](https://react.dev/reference/react/useState) but with a save document function added, in this case called `saveTodo`. A very common pattern in React is to use a state variable and a setter function to manage the state of a form. This hook is a convenience for that pattern, but it also handles saving the document to the database. Follow the interactions in the code below to see how `useDocument` is compatible with the patterns you're already using with `useState`.

The `useDocument` hook is used to create a new document with an empty `text` field. The `saveTodo` function is called when the form is submitted, and it saves the document to the database. The `setTodo` function is used to update the `text` field as the user types. 

### Save the Todo

Here is the JSX that renders the form. The common React pattern described above is used here: the input field is bound to `todo.text`, `setTodo` is called with a new text field when the input changes, and `saveTodo` is called when the form is submitted, persisting the new todo to the database.

```jsx
<input 
  type="text" 
  value={todo.text} 
  onChange={e => setTodo({ text: e.target.value })} 
/>
<button
  onClick={() => {
    saveTodo()
    setTodo(false)
  }}
>
  Save
</button>
```
Another convenience detail: `setTodo` is called with `false` to clear the input field (and reset to the `useDocument` call's initial value) after the todo is saved. This is a common pattern in React, and it's handled automatically by the hook. In our current application, we want the document managed by `useDocument` to be a new one each time, so we do not specify an `_id` in the initial document value. If the initial document value had an `_id` field, the hook would update that document instead of creating a new one with each save. [Read more about the `useDocument` hook](/docs/react-hooks/use-document.md).

### Where's My Data?

By default, Fireproof stores data in the browser's local storage. This is great for development, but once your app is ready to share, you'll want to [connect it to cloud storage.](/docs/database-api/replication.md) For now, you can manage and delete the encrypted data from your browser developer tools. There are two components to the data, the header and the encrypted files. The header is kept in `localStorage` under the key `fp.useFireproof`. The files are stored in IndexedDB under the key `fp.<keyId>.useFireproof`. This arrangement means that files can be stored with an untrusted provider, and the header can be stored with a trusted provider. For instance, customers of [Fireproof Storage](https://fireproof.storage) can secure headers in their existing authentication and session management tools, while relying on Fireproof Storage for the encrypted files.

Once your data is replicated to the cloud, you can view and edit it with the Fireproof developer tools. [Try the dashboard demo here.](https://fireproof.storage/try-free/)

## The Completed App

Here's the example to-do list that initializes the database and sets up automatic refresh for query results. The list of todos will redraw for all users in real-time. Replace the code in `src/App.js` with the following:

```jsx
import React from 'react'
import { useLiveQuery, useDocument } from 'use-fireproof'

function App() {
  const response = useLiveQuery('date')
  const todos = response.docs
  const [todo, setTodo, saveTodo] = useDocument({ text: '', date: Date.now(), completed: false })

  return (
    <div>
      <input 
        type="text" 
        value={todo.text} 
        onChange={e => setTodo({ text: e.target.value })} 
      />
      <button
        onClick={() => {
          saveTodo()
          setTodo(false)
        }}
      >
        Save
      </button>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => useLiveQuery.database.put({ ...todo, completed: !todo.completed })}
            />
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
```

## Run the App

Now take a look at your app. It will allow you to add items to the list and check the box.

```bash
npm start
```

![React screenshot](./img/todos.png)

You can clone [the resulting application here](https://github.com/jchris/my-fireproof-app), or [view the live demo](https://codesandbox.io/p/github/jchris/my-fireproof-app/main).

## Learn More

Continue reading about [how to integrate Fireproof with your existing authentication system](/), or check out the [ChatGPT quickstart](./chatgpt-quick-start) to learn how to use ChatGPT to rapidly prototype new applications with Fireproof.
