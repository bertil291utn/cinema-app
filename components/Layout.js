import dynamic from 'next/dynamic';

const Tab = dynamic(() => import('../components/tab'));
const Navbar = dynamic(() => import('../components/navbar'));

const Layout = ({ showNavBar=true,children }) => {
  return (
    <>
      {showNavBar && <Navbar />}
      {children}
      <Tab />
    </>
  );
};

export default Layout;
