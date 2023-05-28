import React from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'

const FeatureList = [
  {
    title: 'Build',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    icon : '🏗',
    description: (
      <>
        Write shareable realtime apps without configuring anything. No setup makes Fireproof great for ChatGPT quick
        starts and code sandbox demos.
      </>
    )
  },
  {
    title: 'Connect',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    icon : '🌩',
    description: (
      <>
        Use your existing authentication system or Fireproof's sensible defaults. Live sync user-to-user and replicate
        with any cloud.
      </>
    )
  },
  {
    title: 'Scale',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    icon : '🏔',
    description: (
      <>
        Fireproof's encrypted serverless backend works anywhere, allowing you to tune security, price, and
        performance for your app.
      </>
    )
  }
]

function Feature({ icon, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <span role="img" style={{fontSize:'8rem'}}>{icon}</span>
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
