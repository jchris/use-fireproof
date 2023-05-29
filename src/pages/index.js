import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import CodeBlock from '@theme/CodeBlock'
import HomepageFeatures from '@site/src/components/HomepageFeatures'

import styles from './index.module.css'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx('hero hero--primary fireproof', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Live Demo
          </Link>
          <Link className="button button--primary button--lg margin-left--md" to="/docs/intro">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`Live data React hook - ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <CodeBlock language="jsx">npm install use-fireproof</CodeBlock>
        <HomepageFeatures />
        <CodeBlock language="jsx">{`import { useLiveQuery } from 'use-fireproof'
function App() {
  const todos = useLiveQuery('date').docs
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo._id}>{todo.text}</li>
      ))}
    </ul>
  )
}
`}</CodeBlock>
      </main>
    </Layout>
  )
}
