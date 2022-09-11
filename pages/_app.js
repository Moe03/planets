import dynamic from 'next/dynamic'
import '../styles/globals.css'
import Earth from '../planets/Earth'
import Venus from '../planets/Venus'


const allPlanets = {
  earth: <Earth />,
  venus: <Venus />
}
function MyApp({ Component, pageProps }) {
  return <Component planets={allPlanets} {...pageProps} />
}

export default MyApp
