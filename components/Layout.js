import dynamic from 'next/dynamic';

const Tab = dynamic(() => import('../components/tab'));
const Navbar = dynamic(() => import('../components/navbar'));

const Layout = ({ subDir,children }) => {
  return (
    <>
      {!subDir && <Navbar />}
      {children}
      {!subDir && <Tab />}
    </>
  );
};

export default Layout;
