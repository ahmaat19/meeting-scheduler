import Navigation from './Navigation'
import Head from 'next/head'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>NMeeting Scheduler</title>
        <meta property='og:title' content='NMeeting Scheduler' key='title' />
      </Head>
      <Navigation />
      <main className='container py-2'>{children}</main>
      <Footer />
    </>
  )
}
