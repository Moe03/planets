import dynamic from 'next/dynamic'
import '../styles/globals.css'
import Earth from '../planets/Earth'


const allPlanets = {
  earth: <Earth />
}
function MyApp({ Component, pageProps }) {
  return <Component planets={allPlanets} {...pageProps} />
}

export default MyApp
