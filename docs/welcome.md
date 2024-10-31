---
sidebar_position: 1
---

# Welcome

[Fireproof](https://fireproof.storage) is an embedded database designed to bring **live data anywhere**. Quickly add live data to any app or page with our embedded database, reducing risk, cost, and complexity with provable secure synchronization using any backend.

**Collaborative:** Multi-user sync for interactive apps

**Fast:** Local-first zero latency database queries

**Easy:** Zero-setup development with one line connection to any cloud

Developers want to build features, not maintain complex stacks. Fireproof eliminates the traditional database setup, maintenance, and operations overhead, allowing developers to focus on building rich, local-first, collaborative apps. Fireproof turns any storage into an end-to-end encrypted, tamperproof ledger, empowering developers to build trustworthy apps that run anywhere with minimal operational cost and risk.

## Getting Started

All it takes is `npm install @fireproof/core` and `import { fireproof } from '@fireproof/core'` in your project. Then you can open a ledger with `const ledger = await fireproof('my-ledger')` and write data with `ledger.put({ hello: 'world' })`. To query everything by date, `const { docs } = await ledger.query("created_at")`. Learn more about the [API](/docs/database-api/documents) or try the [React tutorial](/docs/react-tutorial).

### What is Fireproof?

Fireproof uses immutable data and distributed protocols to offer a new kind of database that:

- can be embedded in any page or app, with a flexible data ownership model
- can be hosted on any cloud
- uses cryptographically verifiable protocols (what plants crave)

#### [Learn principles with the React tutorial](/docs/react-tutorial) or [have fun with the ChatGPT Expert Builders](/docs/chatgpt-quick-start).

[Fireproof](https://fireproof.storage) is ideal for finance, trading, point-of-sale, shopping cart, ERP, inventory, supply-chain, set-top box, call-center automation, AI agents, social software, pilot scheduling, event data recorder, IoT edge, distributed configuration, and more—anywhere trust and availability are critical.

Fireproof is optimized to make [building React apps](https://github.com/fireproof-storage/fireproof/blob/main/packages/react/README.md) fast and fun, with reliable results and verifiable data. Suitable for mission-critical data workloads like [LLM orchestration](https://fireproof.storage/posts/why-proofs-matter-for-ai/), supply-chain provenance, and field management of auditable data, [Fireproof is also great](https://fireproof.storage/posts/great-opportunites-to-use-fireproof/) for social media, collaborative world-building, and rapidly implementing executive decision support tools that can stand up to blockchain levels of scrutiny.

<p align="right">
  <img src="https://img.shields.io/bundlephobia/minzip/%40fireproof%2Fcore" alt="Package size" />
  <a href="https://github.com/fireproof-storage/fireproof/actions/workflows/ci.yaml">
    <img src="https://github.com/fireproof-storage/fireproof/actions/workflows/ci.yaml/badge.svg" alt="Build status" />
  </a>
</p>

With Fireproof, you **build first** and [connect it to your cloud of choice](/docs/connect) when you are ready, so nothing is holding you back from adding it to your existing apps or [writing something new.](https://codesandbox.io/s/fireproof-react-antd-f6zbi7?file=/src/App.tsx)

<p align="center" >
  <a href="https://fireproof.storage/">
    <img src="https://fireproof.storage/static/img/logo-animated-black.svg" alt="Fireproof logo" width={300} />
  </a>
</p>

Learn more about the company behind Fireproof at [Fireproof Storage](https://fireproof.storage).
