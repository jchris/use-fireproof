import React from 'react'
import Link from '@docusaurus/Link'
import clsx from 'clsx'
import styles from './styles.module.css'

const FeatureList = [
  {
    title: 'Build',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    icon: '🏗',
    description: (
      <>
        Write shareable realtime apps without configuring anything. No setup makes Fireproof great
        for <Link to="/docs/chatgpt-quick-start">ChatGPT quick starts</Link> and{' '}
        <Link to="https://codesandbox.io/s/fireproof-react-antd-f6zbi7?file=/src/App.tsx">
          code sandbox demos
        </Link>
        .
      </>
    )
  },
  {
    title: 'Connect',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    icon: '🌩',
    description: (
      <>
        Use your existing authentication system or Fireproof's sensible defaults.{' '}
        <Link to="/docs/database-api/sync">Live sync user-to-user</Link> and{' '}
        <Link to="/docs/database-api/replication">replicate with any cloud.</Link>
      </>
    )
  },
  {
    title: 'Scale',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    icon: '🏔',
    description: (
      <>
        Fireproof's <Link to="/docs/database-api/encryption">encrypted serverless backend</Link>{' '}
        works anywhere, allowing you to tune security, price, and performance for your app.
      </>
    )
  }
]

function Feature({ icon, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <span role="img" style={{ fontSize: '8rem' }}>
          {icon}
        </span>
        {/* <Svg className={styles.featureSvg} role="img" /> */}
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
