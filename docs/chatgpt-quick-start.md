---
sidebar_position: 10
---

# ChatGPT Builders

Fireproof is explicitly designed to be useful without requiring any setup or configuration. This makes it especially easy for ChatGPT to use, because Fireproof apps don't need to have a lot of hidden logic outside of the React code. Keep reading for pointers on how to leverage ChatGPT when writing code that uses Fireproof.

## AI writing Fireproof code

If you are coding with Fireproof, try pasting this snippet into your AI enabled code editor. It should be able to stick to the API better when it sees this:

```js
Fireproof/API/Usage: import { fireproof } from '@fireproof/core'; const db = fireproof('app-db-name'); const ok = await db.put({ anyField: 'json' }); const doc = await db.get(ok.id); await db.del(doc._id); const all = await db.allDocs(); const result = db.query('anyField', {range : ['a', 'z']}); result.rows.map(({ key }) => key);
```

For React you can also paste:

```jsx
Fireproof/React/Usage: import { useLiveQuery, useDocument } from 'use-fireproof'; function App() { const result = useLiveQuery(doc => doc.word, { limit: 10 }); const [{ count }, setDoc, saveDoc] = useDocument({_id: 'count', count: 0}); return (<><p>{count} changes</p><input type='text' onChange={() => saveDoc({count: count + 1})} onSubmit={e => useLiveQuery.database.put({word: e.target.value})} /><ul>{result.map(row => (<li key={row.id}>{row.key}</li>))}</ul></>)}
```

We've also created a "GPT" below, but we find writing code makes more sense in an AI enabled editor.

## ⚛️ React Expert Builders

The ChatGPT shared conversations feature allows users to link to in-flight conversations. For programmers, this is great because you can train a conversation to be an expert in a particular library, and then re-use that expertise over and over. For example, you could train a conversation to be an expert in web performance, and then use that conversation to help assess web performance in any app. Similarly, we've created a handful of Fireproof "expert builders" that you can use to kick start your development. Start by choosing a CSS framework, and then click the link to start a conversation with that expert builder.

[![ChatGPT Data Builder screenshot](./img/chatgpt.png)](https://chat.openai.com/g/g-Np4vF1Yz7-data-builder)


[Tailwind](https://tailwindcss.com) is a great choice for apps that want clean results and easy editing. [Tailwind builder for Fireproof React apps](https://chat.openai.com/g/g-Np4vF1Yz7-data-builder).

## 🏗 Start building

The experts builders are preloaded with [code sandbox links](https://codesandbox.io/s/fireproof-react-antd-f6zbi7?file=/src/App.tsx) and API expertise, so you should be able to get a working prototype without leaving your browser.

Once you've chosen a builder, click the button to continue the conversation. You can then use the conversation to generate code for your app.

## 🤖 Train your own builders

We encourage you to review the conversation history and learn how to create your own expert builders. If you create a new expert builder, please share it with us so we can add it to the list!