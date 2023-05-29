---
sidebar_position: 4
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

Installing the React hooks package will also install the core Fireproof library.

```bash
npm install use-fireproof
```

## Connect Your Component

In your app, you can use the top-level `useLiveQuery` hook to get access to the database and live query responses, and the `useDocument` hook to create new documents. Let's put the pieces in place one at a time.

### Import the Hooks

The first step is to add the Fireproof hooks to your new app. In `src/App.js`, add the following line to the top of the file (or scroll down to see the completed file):

```js
import { useLiveQuery, useDocument } from 'use-fireproof'
```

### Query Todos

Now, inside of your component, you can call `useLiveQuery` to get a list of todos (it will start out empty):

```js
function App() {
  const todos = useLiveQuery('date').docs
```

These todos are displayed by the following JSX, which renders their `text` field. Notice how `database.put` is used to toggle the `completed` field when the checkbox is clicked:

```jsx
<ul>
  {todos.map(todo => (
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
```

### Create a New Todo

Next, we'll add a form to create new todos. The `useDocument` hook is used to create a new document with an empty `text` field. The `saveTodo` function is called when the form is submitted, and it saves the document to the database. The `setTodo` function is used to update the `text` field as the user types. Notice how `useDocument` is called with an initial value for the document:

```js
const [todo, setTodo, saveTodo] = useDocument({ text: '', date: Date.now(), completed: false })
```

### Save the Todo

Here is the JSX that renders the form. Notice how `saveTodo` is called when the form is submitted, and `setTodo` is called when the input field changes. `setTodo` is called with `false` to clear the input field (and reset to the `useDocument` call's initial value) after the todo is saved:

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

## The Completed App

Here's the example to-do list that initializes the database and sets up automatic refresh for query results. The list of todos will redraw for all users in real-time. Replace the code in `src/App.js` with the following:

```js
import React from 'react'
import { useLiveQuery, useDocument } from 'use-fireproof'

function App() {
  const todos = useLiveQuery('date').docs
  const database = useLiveQuery.database
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
              onChange={() => database.put({ ...todo, completed: !todo.completed })}
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
