import dynamic from 'next/dynamic';
import Footer from './Footer';

const Tab = dynamic(() => import('../components/tab'));
const Navbar = dynamic(() => import('../components/navbar'));

const Layout = ({ subDir = false, children }) => {
  return (
    <>
      {!subDir && <Navbar />}
      {children}
      {!subDir && <Tab />}
      {!subDir && <Footer />}
    </>
  );
};

export default Layout;
