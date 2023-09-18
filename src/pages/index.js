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
          <Link
            className="button button--secondary button--lg"
            to="https://fireproof.storage/try-free/"
          >
            Try Demo
          </Link>
          <Link
            className="button button--primary button--lg margin-left--md"
            to="/docs/react-tutorial"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Home() {
  // const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`Live database for the web`}
      description="Simplify your application state with Fireproof."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <div className="container">
          <h2>📦 Lightweight install</h2>
          <p>
            Live queries, database branches and snapshots, and file attachments make Fireproof ideal
            for browser-based apps big or small.
          </p>

          <CodeBlock language="jsx">npm install use-fireproof</CodeBlock>
          <p>
            The{' '}
            <Link to="https://www.npmjs.com/package/use-fireproof">use-fireproof</Link> module runs
            anywhere, with bundles built for Node.js and the browser, and optional <Link to="/docs/react-hooks/use-live-query">React hooks</Link>.
          </p>
          <h2>🚀 Simple app state, anywhere</h2>
          <p>
            Fireproof makes it easy to for JavaScript developers to{' '}
            <a href="/docs/database-api/basics/">light up any app with live data</a>. For React
            developers, check out the <Link to="/docs/react-tutorial">useLiveQuery tutorial</Link>{' '}
            for the recommended auto-refresh APIs.
            {/* </p>
          <ThemedImage
            className="margin-bottom--md margin-left--lg"
            alt="useLiveQuery screenshot"
            sources={{
              light: '/img/code.png',
              dark: '/img/code.png'
            }}
          />
          <p> */}{' '}
            Get started by writing features, and <Link to="/docs/database-api/replication">connect to the cloud</Link> after your app is awesome.
          </p>

          <h2>🔐 Verifiable CRDTs</h2>
          <p>
            Every operation in Fireproof is{' '}
            <Link to="/docs/database-api/encryption">end-to-end encrypted</Link> and{' '}
            <Link to="https://fireproof.storage/posts/from-mlops-to-point-of-sale:-merkle-proofs-and-data-locality/">
              accelerated by cryptographic proofs
            </Link>
            , making it 🎮 suitable 🏦 for all your data needs. Offline and multi-leader operations are fully supported.
          </p>
          <h2>📝 Open-source</h2>
          <p>
            Fireproof is dual-licensed under the Apache 2.0 and MIT license and is free to use.{' '}
            <Link to="/docs/contributing">Read about contributing</Link>.
          </p>
        </div>
      </main>
    </Layout>
  )
}
import ThemedImage from '@theme/ThemedImage'
