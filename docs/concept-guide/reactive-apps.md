---
sidebar_position: 1
---

# Reactive Apps

*Reactive architectures and live databases streamline interactive and collaborative application development and operation. Topics: state-driven UI updates, React as an example, the Fireproof `useLiveQuery` hook, and how live databases can be used for data integration, as well as collaborative and multi-cloud applications.*

## Easy Development

Reactive code streamlines the development process by automatically updating the user interface in real-time as the underlying state changes. This eliminates the need for manual refresh calls, freeing developers from the worry of keeping the UI in sync with the data. 

```js
// Reactive pseudo-code
state.on('change', function() {
  ui.update();
});
```

If you've writtin React code, you've done reactive development. When the state of a React component changes, the component re-renders, updating the user interface to reflect the new state. It's encapulated in the `setState` method and other hooks.

```js
setState({ greeting: 'Hello World' }); // updates UI
```

React optimizes the re-rendering process using a concept known as the virtual DOM. This allows React to minimize direct manipulations of the actual DOM, which can be a costly operation, so you don't have to worry about the details of batching updates, diffing operations, and other optimizations. You can just write features.

## Live Databases

Similarly, using a live database as a local state manager in your app, React or otherwise, can simplify your development process. Fireproof is inspired by more than a decade of reactive database and app authoring experience. The goal is to give you a simple handle on your data so you can interact with it anywhere.

In Fireproof, the core of reactivity is the `database.subscribe` method. This method allows you to subscribe to changes in the database, and trigger updates to the UI. In a raw JS context, you'd use it like this:

```js
const unsub = db.subscribe((changes) => {
  // update UI
}, true)
```

Most of the time you can discard the changes and just redraw your whole UI, but you can filter to watch for particular documents, and for use cases like maintaining secondary indexes, you'll want to process the changes themselves.

The core functionality is wrapped in React hooks like `useLiveQuery` and `useDocument`. These hooks are designed to be used in React components, and they automatically subscribe to changes in the database, and trigger updates to the UI. 

```js
 // in your component
const data = useLiveQuery('greeting');
```

Once you have wired your app this way, the changes that you make to the database will automatically trigger updates to the UI. This is true whether the changes are made by the local device user, or by another collaborator. 

## Beyond Local

It's crucial that state is local to the UI, or else user clicks will be delayed by network latency. But it's also important that the state is shared with other users, so that they can collaborate. 

In real world use-cases data operations originate in all sorts of place, from the user's device, to the cloud, to the edge. One benefit of using a live database as your state manager, is that that same interactivity is available in all of these contexts.

For instance, a collaborative inventory management app might have a local database on each device, and additionally cloud replicas designated to track partner API feeds. This way the same data can be accessed by users and backend processes, with sync abstracting the network details.

Replicated live databases can simplify many applications, such as on-site experience apps for ticketing and scheduling, team data entry for inventory management and supply chain, shopping cart point-of-sale systems, and multiuser LLM workflows with provenance tracking.

Read more about patterns for data sharing in the [Scaling Fireproof](/docs/concept-guide/scaling-fireproof) section.



<!-- Figures:
Reactive App Workflow: A flowchart showing the process of developing a reactive app, highlighting the ease of development.
Local vs Remote Database: A comparison diagram showing the benefits of having a reactive database local versus remote.
Integration Database: A diagram showing how a reactive app with hard storage and replication can be used as an integration database. -->

