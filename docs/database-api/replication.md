---
sidebar_position: 5
---

# Replication

Replication is distinct from database-level peer-to-peer realtime [Sync](./sync), which is designed to power collaborative applications. Replication allows you to store data in multiple locations for backup or performance reasons. Replication is also how traditional client/server experiences can be built with Fireproof.

Fireproof's replication mechanism is built on top of IPFS and HTTP, which enables the efficient and reliable replication of data across multiple nodes on the network. Each node on the network maintains its own copy of the database and its clock. When a new update is made to the database, a new CID is generated and added to the local clock. The CID is then broadcast to other nodes on the network, which validates the update and applies it to their local copy of the database.

This replication mechanism allows for replication targets to be any IPFS-compatible block store, such as web3.storage, or any Fireproof instance running in another browser or a cloud environment. In addition, Fireproof enables the archiving of databases to static asset servers, allowing for fast loading of game levels, web pages, and other content. By leveraging IPFS, Fireproof can replicate and distribute data across a decentralized network, ensuring data availability and reliability, even in the face of network disruptions or failures.

## Configuring Replication

Starting in Fireproof 0.7.0, replication can be configured at the block level to store your data in the browser, the filesystem, or a web service. By default, Fireproof uses the most sensible storage for the environment. In the browser, IndexedDB is used. In Node, the filesystem is used. Both of these can also replicate with REST storage. More documentation on configuring replication is coming with the 0.7.0 release.



