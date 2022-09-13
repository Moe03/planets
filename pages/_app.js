import '../styles/globals.css'
import Main from '../planets/Main'

function MyApp({ Component, pageProps }) {
  return <Component canvas={<Main />} {...pageProps} />
}

export default MyApp
