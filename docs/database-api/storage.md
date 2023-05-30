---
sidebar_position: 6
---

# Storage

Fireproof uses the **Content Addressable aRchive** (CAR) format to handle updates to the database. CAR is a packaging format for content-addressed data that enables easy storage and transfer of large amounts of data. The data stored in CARs is defined by InterPlanetary Linked Data (IPLD), which is a specification and set of implementations for structured data types that can link to each other using a hash-based Content Identifier (CID). IPLD data forms a Directed Acyclic Graph (DAG), which enables powerful indexing and searching capabilities.

Clients can ship CAR transactions to other clients on the network. Each CAR transaction contains one or more IPFS blocks, each of which contains updates to the database. The CAR transaction also contains a unique content identifier (CID) that points to the root node of the updated database clock. Clients can validate the CAR transaction and apply the updates to their local copy of Fireproof.

Furthermore, Fireproof allows each database to be archived to a single CAR file, enabling high-performance page loads and other use cases where fast start is crucial. By leveraging IPLD-over-ObjectStores, Fireproof can function as an IPLD database with key-value stores, indexing, and a powerful query language that can handle privacy and access patterns. Object stores like S3, R2, or any cloud provider with compatible interfaces can be used to host Fireproof backends. By following some simple patterns, Fireproof enables the creation of a larger graph database that can travel like a graph itself, mutate into other states, filter out data, and combine data from different sources, with limitless options for storage and distribution, all enabled by efficient append-only hash-linked immutable data structures.

## Storage Format

Fireproof uses [IPLD (InterPlanetary Linked Data)](https://ipld.io/) to store data. This means that all data is stored as a Merkle DAG (Directed Acyclic Graph). This means all operations in Fireproof are immutable, and you can always access the history of your data.

IPLD blocks are stored in [CAR (Content Addressable aRchive)](https://ipld.io/specs/transport/car/) files, with each 

## Storage Backends

Fireproof supports multiple storage backends. The default in the browser is IndexedDB, but you can also use REST storage, or the filesystem.

More about storage backends coming in 0.7.0.

<!-- ## Working with Storage

To export a database to a CAR file, use the `export` method:

```js -->

## Database Headers

The database header contains the clock, which is used to track the most recent commit. Parallel writes, and sync or merges between two databases can result in a clock with more than one head. Fireproof will resolve the clock to a single head on the next write.

The header also tracks the database encryption key and the encryption key for the indexes. These keys are 32 bytes long and are randomly generated when the database is created. The database key is used to encrypt the database, and the index key is used to encrypt the indexes. By storing the headers separately from the data CAR files, you can utilize untrusted storage for the data, while keeping the keys in a trusted location.

The header tracks CAR files (content-addressed-archive) which it uses to load the database. The listed CAR file name for each storage option points to an encrypted map which Fireproof uses to load the rest of the database.

```json
{
  "clock": [
    "bafyreibllbdlexr25r2fe42dh56rqbfif3vcu4iyzh5ltk4z33myo74mcu"
  ],
  "name": "my-database",
  "index": {
    "key": "15b539987a562e1d62315858149d3b337adbee45f6c4d3f5a5d306b8f6cd45a9"
  },
  "indexes": [],
  "key": "0502a306341364c63a12d0c7468e50659d909127bb6b784b79214d2961d7b14d",
  "car": "bafkreieznsnhlyjoffytquju4qydz4unyblno7fjvtzs7u75y6tgu3cnti"
}
```