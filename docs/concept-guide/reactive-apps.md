---
sidebar_position: 1
---

# Reactive Apps

<!-- Figures:
Reactive App Workflow: A flowchart showing the process of developing a reactive app, highlighting the ease of development.
Local vs Remote Database: A comparison diagram showing the benefits of having a reactive database local versus remote.
Integration Database: A diagram showing how a reactive app with hard storage and replication can be used as an integration database. -->

## Easy Development

Reactive apps simplify development by automatically updating the UI with state changes, eliminating manual refresh calls. Their ease of use is reflected in the popularity of reactive state management libraries.

## Reactive Databases

A database in a reactive app is not just for state management—it also makes data available in new contexts. For example, a "save" function in a dashboard query engine can facilitate result sharing and commenting. 

## Why Local?

A local state manager is essential in a reactive app to avoid server queries for every user interaction. If a database is part of the app, it must communicate with the state manager, necessitating a local database. Local databases with hard storage and replication capabilities can also function as integration databases.

## More than Local

While a local database manages user-application interaction effectively, it needs sync to fully support the collaborative nature of many applications. Top-tier state managers and databases provide collaboration channels to address this.

## Replicated Live Data

Replicated live databases can simplify many applications, such as on-site experience apps for ticketing and scheduling, team data entry for inventory management and supply chain, shopping cart point-of-sale systems, and multiuser LLM workflows with provenance tracking.

