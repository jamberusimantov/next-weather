import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'

type NextPageWithLayout = NextPage & {
  getLayout: (page: ReactElement) => ReactNode
}
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  console.log("\x1b[32mWelcome to" + " " + "\x1b[43mWeather!\x1b[0m")
  console.log("\x1b[34mKeep your face to the sun and")
  console.log("\x1b[34myou will never see the shadows.")
  console.log("\x1b[31mHave \x1b[43ma great\x1b[0m \x1b[32mday")
  console.log("\x1b[32mMade with" + " " + "\x1b[31m❤ " + " " + "\x1b[32min" + " " + "\x1b[34mIsrael");
  console.log("\x1b[32m© 2022" + " " + "\x1b[43mSiman tov Jamberu.\x1b[0m");
  console.log("\x1b[31mAll rights reserved.");
  console.log("https://github.com/jamberusimantov")
  console.log("https://www.linkedin.com/in/siman-tov-jamberu/");

  const getLayout = Component.getLayout ?? ((page) => page)
  return getLayout(<Component {...pageProps} />)
}
export default MyApp
