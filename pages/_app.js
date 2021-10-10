import '../styles/globals.css';
import './home.css';
import dynamic from 'next/dynamic'

const Footer = dynamic(() => import('../components/footer'))


function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
