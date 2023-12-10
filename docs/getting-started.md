---
sidebar_position: 2
---

# Quick Start

Whether you're using React or another JavaScript framework, this guide will help you get started with Fireproof quickly and efficiently. If you're using React, you might find our [React tutorial](/docs/react-tutorial) more relevant.

## Step 1: Install Fireproof

The first step is to add Fireproof to your project. You can do this by running the following command in your project directory:

```bash
npm install @fireproof/core
```

Or, if you're using Yarn:

```bash
yarn add @fireproof/core
```

## Step 2: Import Fireproof

Next, you'll need to import Fireproof into your project. Add the following line to the top of your file:

```js
import { fireproof } from '@fireproof/core'
```

## Step 3: Create a Database

Now, let's create your first database. You can do this with the following line of code:

```js
const db = fireproof("my-database")
```

## Step 4: Create and Read Documents

With your database set up, you can now create your first document. Here's how:

```js
const ok = await db.put({ hello: "world" })
```

To read your first document, use the following code:

```js
const doc = await db.get(ok.id)
```

## Step 5: Update Documents

Updating your document is just as easy. Here's how you can do it:

```js
doc.hello = "universe"
const ok2 = await db.put(doc)
```

## Step 6: Query Documents

Finally, you can query all documents or query documents by a specific field. Here's how:

```js
const docs = await db.allDocs()
const docs = await db.query('hello') // This will return documents with 'world' and 'universe'.
```

And that's it! You've successfully set up Fireproof in your project. Happy coding!
