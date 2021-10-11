import dynamic from 'next/dynamic';
import '../styles/globals.css';
import './home.css';

const Tab = dynamic(() => import('../components/tab'));
const Navbar = dynamic(() => import('../components/navbar'));

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Tab />
    </>
  );
}

export default MyApp;
