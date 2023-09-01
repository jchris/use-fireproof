---
sidebar_position: 5
---

# Replication

Replication is distinct from database-level peer-to-peer realtime [Sync](./sync), which is designed to power collaborative applications. Replication allows you to store data in multiple locations for backup or performance reasons. Replication is also how traditional client/server experiences can be built with Fireproof.

Fireproof's replication mechanism is built on top of IPFS and HTTP, which enables the efficient and reliable replication of data across multiple nodes on the network. Each node on the network maintains its own copy of the database and its clock. When a new update is made to the database, a new CID is generated and added to the local clock. The CID is then broadcast to other nodes on the network, which validates the update and applies it to their local copy of the database.

This replication mechanism allows for replication targets to be an S3 bucket, basic REST server, or IPFS-compatible block store, such as web3.storage, or any Fireproof instance running in another browser or a cloud environment. In addition, Fireproof enables serving database snapshots from static asset servers, allowing for fast loading of game levels, web pages, and other content. By leveraging IPFS, Fireproof can replicate and distribute data across a decentralized network, ensuring data availability and reliability, even in the face of network disruptions or failures.

## Configuring Replication

Import the `connect` module to configure replication, create a database, and connect it to a service:

```js
import { fireproof, connect } from 'use-fireproof'

const db = fireproof('my-database')
const connection = new connect.raw({ upload, download })
const connection = connect(db, connection)
```

Raw connection config a simple object with upload and download fields:

```js
const mockStore = new Map()
const mockConnect = {
  // eslint-disable-next-line @typescript-eslint/require-await
  upload: async function (bytes, { type, name, car, branch }) {
    const key = new URLSearchParams({ type, name, car, branch }).toString()
    mockStore.set(key, bytes)
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  download: async function ({ type, name, car, branch }) {
    const key = new URLSearchParams({ type, name, car, branch }).toString()
    return mockStore.get(key)
  }
}
```

This code is from the [connection tests](https://github.com/fireproof-storage/fireproof/blob/main/packages/fireproof/src/connect.ts), you can use it as inspiration, writing a rest client or other connector.

### S3 Connection

You can [see an application test case using the S3 connection here](https://fireproof.storage/s3up-test.html?list=replication). Share your list with a friend. [The bucket it is using is public, so any valid CAR file can be uploaded, and the metadata is inline and world readable.](https://github.com/fireproof-storage/fireproof/blob/main/packages/fireproof/test/www/todo.html#L19) Don't rely on it for anything other than testing, it will be cleared occasionally. In production, you'll want to use a custom connection to move the metadata to a permissioned store. If you want to [modify the behavior of the S3 store to add Cognito, Lambda and DynamoDB for this purpose, the source is available here](https://github.com/jchris/amazon-s3-presigned-urls-aws-sam/blob/cars/getSignedURL/app.ts#L46).

### Web3 Connection

[web3.storage](https://web3.storage) is an IPFS upload API that uses self-sovereign [UCAN](https://ucan.xyz) authorization. Currently it's the recommended option if you want your users to be able to store to the cloud, and link to them from the web. The Web3 connection does not currently store mutable metadata headers, just the data files themselves. But as long as you link to the latest CAR file, you can send snapshots. Here is [an example of configuring the web3.storage connection](https://github.com/fireproof-storage/fireproof/blob/cca8cdabe0e64672cbcd20f6d261bf832f5748ff/packages/fireproof/test/www/todo.html#L22)
