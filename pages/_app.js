import dynamic from 'next/dynamic';
import CinemaProvider from '../context';
import '../styles/globals.css';
import './home.css';

const Tab = dynamic(() => import('../components/tab'));
const Navbar = dynamic(() => import('../components/navbar'));

function MyApp({ Component, pageProps }) {
  return (
    <CinemaProvider>
      <Navbar />
      <Component {...pageProps} />
      <Tab />
    </CinemaProvider>
  );
}

export default MyApp;
