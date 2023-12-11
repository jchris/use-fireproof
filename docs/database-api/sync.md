---
sidebar_position: 4
---

To sync between devices, you need to connect to a cloud. Fireproof supports a variety of cloud connectors, including [PartyKit](https://www.npmjs.com/package/@fireproof/partykit) and [IPFS](https://www.npmjs.com/package/@fireproof/ipfs).

Sync works by uploading encrypted files to storage and maintaining a pointer in the metadata header. Once a device is connected, it will share data with all other connected devices.

## Storage

Fireproof uses encrypted files for secure and efficient use of any storage provider. These immutable files are named by their cryptographic hash content identifier, ensuring data integrity. Guessing Fireproof filenames and loading them without the encryption key is nearly impossible, making it safe to run on open access buckets.

Each database transaction creates a new small file with the changed data blocks. The file is saved locally and written to the cloud storage in the background. When another client connects, it starts from the most recent file in cloud storage, loading older files as needed. Each file can be cached indefinitely, allowing the client to load the database from any point in time.

## Sync

The Fireproof metadata endpoint manages the encryption keys and identifies the most recent file for syncing. It handles concurrent updates and ensures a well-defined casual ordering of the dataset. The encryption key, crucial for database security, is stored in the browser’s local storage and synchronized with the CRDT file pointers. More details can be found in the [Cloud Connectors section.](/docs/concept-guide/cloud-connectors)

Sync connections allow databases to share updates. These updates are automatically merged by clients when connected. In a multi-device or multi-user scenario, all connected parties have access to the same data.

For swift synchronization, most connectors use a real-time data channel. While key-value storage can be used, the most efficient connectors use a cloud processing endpoint.

## Configuring a Cloud Connector

To configure sync, you need to import a cloud connector and initalize it with your database. For example, to use the PartyKit connector:

```js
import { fireproof } from 'use-fireproof'
import { connect } from '@fireproof/partykit'

const db = fireproof('my-app-database-name')
const connection = connect.partykit(db, process.env.PUBLIC_PARTYKIT_HOST)
```

Connection will look similar for other connectors. For more information, see the [PartyKit connector docs](https://www.npmjs.com/package/@fireproof/partykit) and the [IPFS connector docs](https://www.npmjs.com/package/@fireproof/ipfs).
