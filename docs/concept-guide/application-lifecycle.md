---
sidebar_position: 4
---

# Application Lifecycle

Create, deploy, and monitor your applications with Fireproof, simplifying state management and ensuring a reliable API across JavaScript environments.

## Make apps your way, install Fireproof, simplify state management

Whether you are creating a new HTML game, adding features to a Salesforce app, or rolling out proof of concept apps for design clients, you already know how you like to work. Fireproof fits into your world, so you get the same reliable API anywhere you can run JavaScript.

Get started with the React starter kit or by following common patterns like annotating existing data, creating collaborative forms, adding history and sharing to existing apps, or building AI workflows.

Build apps in any sandbox, or add a feature to your existing front-end. Once you are satisfied with the interaction, you can add live collaboration by choosing a cloud connector.

## Deploy apps your way, connect to the suitable Fireproof backend

Connecting to a backend could be a matter of choosing the easiest or cheapest option, or it could be more about integrating with your existing storage stack.

Read the Storage, Sync, and Sharing section above to understand the technical requirements and backend options.

We are always expanding the list of backend connectors, so check back or join the Discord or GitHub discussions to ask about a particular integration. Here are a few introductory connectors. Some are less than a screenful of code, so if yours is missing it’s not hard to write.

### Netlify

One edge function enables your app to use Fireproof. Fireproof runs inside of your Netlify site's domain, so you can use the same domain for your app and your data, simplifying security. [Contribute to the Netlify connector here.](https://github.com/fireproof-storage/fireproof/tree/main/packages/connect-netlify)

### PartyKit

Fireproof deploys as its own party alongside your app, so it's super easy to connect the database alongside your real-time message bus. [Install the PartyKit connector here.](https://www.npmjs.com/package/@fireproof/partykit)

### IPFS

User-owned storage makes it free to write code, no matter your app’s success. [Install the IPFS connector here.](https://www.npmjs.com/package/@fireproof/ipfs)

### S3

The S3 adapter uses signed URLs so data flows directly from your users to the bucket, with no intermediate copy, saving costs and easing integration. See S3 connector [here](https://github.com/fireproof-storage/fireproof/blob/main/packages/connect/src/connect-s3.ts).

## Monitor your apps – use your session store, observability tools

Log Fireproof clock metadata to your existing tools to make it trivial to reconstruct any database at any time.

<!-- Figures:
App Development Process: A flowchart showing the process of developing an app with Fireproof, from npm install to state management.
Deployment Process: A diagram showing how to deploy an app and connect to a suitable Fireproof backend.
App Monitoring: A diagram showing how to monitor apps using session store and observability tools. -->
