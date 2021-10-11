import dynamic from 'next/dynamic';
import '../styles/globals.css';
import './home.css';

const Footer = dynamic(() => import('../components/footer'));
const Navbar = dynamic(() => import('../components/navbar'));

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
