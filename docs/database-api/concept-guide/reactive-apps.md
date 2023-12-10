---
sidebar_position: 1
---

<!-- Figures:
Reactive App Workflow: A flowchart showing the process of developing a reactive app, highlighting the ease of development.
Local vs Remote Database: A comparison diagram showing the benefits of having a reactive database local versus remote.
Integration Database: A diagram showing how a reactive app with hard storage and replication can be used as an integration database. -->

# Reactive Apps

## Why Reactive Apps are Easier to Develop

Reactive apps streamline the development process by automatically reflecting state changes in the UI.
This eliminates the need for manually calling refresh; developers can simply work with their data.
The popularity of reactive state management libraries attests to their effectiveness and ease of use.

## The Role of Databases in Reactive Apps

Incorporating a database into a reactive app isn't just about managing state—it's about liberating data for use in new contexts.
For instance, adding a "save" function to a dashboard query engine can enable result sharing and comments.
This innovative approach is made possible by the combination of reactive event-based programming and the integration database pattern.

## The Importance of a Local Reactive Database

A local state manager is crucial for a reactive app, as it prevents the need for server queries with every user interaction.
If a database is part of the app, the state manager must be able to communicate with it.
Therefore, for a database to effectively manage state, it must be local.
With hard storage and replication capabilities, local databases can also serve as integration databases.

## The Limitations of a Local Database

While a local database effectively manages the interaction between the user and the application, it doesn't fully address the collaborative nature of real-world applications.
The best state managers and databases offer collaboration channels to bridge this gap.

## Practical Examples of Replicated Live Data

Replicated live data can be used in a variety of applications, including on-site experience apps for ticketing and scheduling, team data entry for inventory management, point-of-sale systems for shopping carts, and multiuser LLM workflows with provenance.
