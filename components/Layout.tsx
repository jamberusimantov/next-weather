import Head from 'next/head'
import React, { ReactElement } from 'react'
import styles from '../styles/Layout.module.css'
import Footer from './Footer'

const Layout = (props: { children: ReactElement }) => {

    return (
        <div className={styles.container}>
            <Head>
                <title>Weather</title>
                <meta name="application-name" content="weather app " />
                <meta name="description" content="just another weather app " />
                <meta name="author" content="siman tov jamberu" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                {props.children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout