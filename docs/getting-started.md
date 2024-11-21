---
sidebar_position: 2
---

# Quick Start

Whether you're using React or another JavaScript framework, this guide will help you get started with Fireproof quickly and efficiently. If you're using React, you might find our [React tutorial](/docs/react-tutorial) more relevant.

## Install the Package

The first step is to add Fireproof to your project. You can do this by running the following command in your project directory:

```bash
npm install @fireproof/core
```

Or, if you're using Yarn:

```bash
yarn add @fireproof/core
```

## Import Fireproof

Next, you'll need to import Fireproof into your project. Add the following line to the top of your file:

```js
import { fireproof } from '@fireproof/core'
```

You can import `use-fireproof` instead of `@fireproof/core` if you're using React, it also exports the `fireproof` function as above.

## Create a Ledger

Now, let's create your first ledger. You can do this with the following line of code:

```js
const ledger = fireproof("my-ledger")
```

The `fireproof` function takes a single argument, the name of your ledger. It is safe to call this function multiple times with the same name. If the ledger already exists, it will be opened. If it doesn't exist, it will be created. The ledger connection is cached, so subsequent calls to `fireproof` with the same name will return the same ledger object, making it safe to call `fireproof` with every render.

## Create and Read Documents

With your database set up, you can now create your first document. Here's how:

```js
const ok = await ledger.put({ hello: "world" })
```

To read your first document, use the following code:

```js
const doc = await ledger.get(ok.id)
```

## Update Documents

Updating your document is just as easy. Here's how you can do it:

```js
doc.hello = "universe"
const ok2 = await ledger.put(doc)
```

## Query Documents

Finally, you can query all documents or query documents by a specific field. Here's how:

```js
const docs = await ledger.allDocs()
const docs = await ledger.query('hello') // This will return documents with 'world' and 'universe'.
```

## Connect to Fireproof Cloud

Additionally, import the Fireproof cloud package:

```js
import { connect } from "@fireproof/cloud";
```

You can call the `connect` function with a ledger and it will provision a remote UUID for the ledger, and sync the ledger to the remote. It will also log a URL to the console that you can open in a browser to connect to the ledger, as well as try to open the URL in a new tab. Tell us what you think about this workflow!

```typescript
const ledger = await fireproof("my-ledger-name");
const connection = await connect(ledger);
```

And that's it! You've successfully set up Fireproof in your project. Happy coding!

See the [React tutorial](/docs/react-tutorial) for a more complete example, or the [ledger basics](/docs/database-api/basics) section for more details on how to use Fireproof. Check out the [GitHub Discussions](https://github.com/fireproof-storage/fireproof/discussions) for example apps and more help.

---

Fireproof is an embedded database that brings seamless live sync to any infrastructure, allowing developers to build rich, local-first, collaborative apps. Ideal for finance, trading, point-of-sale, shopping cart, ERP, inventory, supply-chain, set-top box, call-center automation, AI agents, social software, pilot scheduling, event data recorder, IoT edge, distributed configuration, and more—**anywhere trust and availability are critical**.
