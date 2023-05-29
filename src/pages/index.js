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
          <Link className="button button--secondary button--lg" to="https://fireproof.storage/try-free/">
            Live Demo
          </Link>
          <Link className="button button--primary button--lg margin-left--md" to="/docs/react-tutorial">
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
      description="Use Fireproof to build realtime apps with React."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <div className="container">
          <h2>Easy install</h2>
          <CodeBlock language="jsx">npm install use-fireproof</CodeBlock>
          <p>
            <Link to="https://www.npmjs.com/package/use-fireproof">use-fireproof</Link> is optimized for React,{' '}
            <Link to="https://www.npmjs.com/package/@fireproof/core">@fireproof/core</Link> runs anywhere.
          </p>
          <h2>Write apps without setup</h2>
          <p>
            Query realtime data with the <Link to="/docs/react-hooks/use-live-query">useLiveQuery</Link> and{' '}
            <Link to="/docs/react-hooks/use-document">useDocument</Link> React hooks. Connect to the cloud after your
            app is awesome.
          </p>
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
          <h2>Strong cryptographic verification</h2>
          <p>
            Every operation in Fireproof is <Link to="/docs/database-api/encryption">end-to-end encrypted</Link> and{' '}
            <Link to="https://fireproof.storage/posts/from-mlops-to-point-of-sale:-merkle-proofs-and-data-locality/">
              accelerated by cryptographic proofs
            </Link>
            , making it suitable for all your data needs.
          </p>
          <h2>Open-source</h2>
          <p>Fireproof is dual-licensed under the Apache 2.0 and MIT license and is free to use.</p>
        </div>
      </main>
    </Layout>
  )
}
