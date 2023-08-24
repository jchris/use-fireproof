---
sidebar_position: 4
---

# Live Sync

Note: These are docs for [Fireproof alpha](https://github.com/fireproof-storage/fireproof-alpha), the beta will offer similar features but is focussed on the core right now.


Fireproof Sync can use any socket connection between peers to share changes in real-time. This is great for building collaborative applications, multi-player games, or for syncing data between a server and a client. You can [play a simple game using Fireproof LiveSync with WebRTC here.](https://game.fireproof.storage)

Fireproof Sync currently ships with [Simple Peer's WebRTC transport](https://github.com/feross/simple-peer) for peer-to-peer connections. Other stream API libraries, like [Socket Supply](https://socketsupply.co), [libp2p](https://libp2p.io), or [PartyKit](https://partykit.io) might be preferable for your application. If you are interested in more transports for Fireproof Sync, please [open an issue](https://github.com/fireproof-storage/fireproof/issues/new).


## Initializing

### `new Sync()`
To initialize a sync connection, you need to provide a `database`.

```js
const sync = new Sync(database)
```

The initialization is the same for both the proposer and the acceptor.

## Proposing

### `offer()`

Propose a sync session by calling `await sync.offer()`, it will return an offer, which is a base64 encoded string. Send this offer to the acceptor.

```js
const offer = await sync.offer()
```
## Accepting

### `accept()`

To accept a sync session, you need to provide the offer to the acceptor. The acceptor will return an answer, which is a base64 encoded string. Send this answer to the proposer.

```js
const answer = await sync.accept(offer)
```

## Connecting

### `connect()`

Now that the peers have exchanged offer and answer, connecting is a matter of calling `connect()` with the answer.

```js
sync.connect(answer)
```

The connection will establish asynchronously, and when the connection is established sync will begin.

## Sync Process

Sync proceeds automatically. It is inspired by the [Apache CouchDB](https://couchdb.apache.org) replication protocol, with some additional features to support database forks and merges. 

Take a [look at the implementation](https://github.com/fireproof-storage/fireproof/blob/main/packages/fireproof/src/sync.js), or read a description of the sync process:

### Initial Diff Exchange

The first message is a list of CIDs held by each peer, which is used to send the missing CIDs to the peers as needed.

Here are the steps that happen after `startSync()` is called when the `'connect'` event is triggered:

1. The `startSync()` function is invoked.
2. `this.isReady` is set to `true`, marking the peer as ready for communication.
3. The function `this.database.allStoredCIDs()` is called, retrieving all CIDs (Content Identifiers) stored in the database.
4. An object `reqCidDiff` is created, which includes the current clock state of the database (`this.database.clockToJSON()`) and an array of string representations of all CIDs (`allCIDs.map(cid => cid.toString())`).
5. The status of the sync is updated to 'sending cid diff'.
6. The `reqCidDiff` object is serialized into a JSON string and sent to the peer via the `this.peer.send()` function.

In summary, after the 'connect' event triggers `startSync()`, the function collects all CIDs from the database, forms a request object for CID differences, and sends it to the peer. This process indicates the beginning of the synchronization between two peers, starting with the exchange of information about what CIDs they have.

### Data Exchange

After the `reqCidDiff` object is received by the peer, the following steps are executed:

1. The received data is first checked to see if it can be parsed as a JSON object. If it can be parsed as JSON:
    1. The parsed JSON message is interpreted:
        1. If the parsed JSON message has the `clock` property (meaning it's a `reqCidDiff`), it is processed as follows:
            1. The function `Sync.makeCar()` is called with the list of CIDs in the `reqCidDiff` object. This function collects the blocks associated with the CIDs that aren't in the `reqCidDiff` from the database, and packages them into a `.car` file.
            2. If `makeCar()` returns null (indicating there are no new blocks to send), the status is updated to 'full synced', and a message `{ok: true}` is sent to the peer, signifying that synchronization is complete.
            3. If `makeCar()` returns a `.car` block, the status is updated to 'sending diff car', and the `.car` block is sent to the peer.
        2. If the parsed JSON message has the `ok` property, it means synchronization has completed. The status is updated to 'ok' and the `pushBacklog` promise is resolved with `{ok: true}`.

2. If the received data cannot be parsed as a JSON object, it checks if it can be parsed as a `.car` file. If it is a `.car` file:
    1. The status is updated to 'parking car'.
    2. It reads all the blocks of the `.car` file and adds them to a set `blz`.
    3. It gets the roots of the `.car` file.
    4. The blocks from the `.car` file are committed to the database.
    5. For each root, it tries to get its parent blocks.
    6. The database's clock is updated with these parent blocks and roots.
    7. The database is reset and notified.
    8. The `pushBacklogResolve` function is called, resolving the `pushBacklog` promise with `{ok: true}`.

So the handling of the `reqCidDiff` object is done first, then the handling of the `.car` file, and finally the handling of the 'ok' status message.