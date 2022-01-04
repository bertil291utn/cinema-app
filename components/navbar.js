import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className='bg-black py-3 lg:sticky lg:top-0 lg:z-10'>
      <div className='h-12 w-36 relative mx-auto'>
        <a
          href='https://www.cineplex.com.ec/home/'
          target='_blank'
          rel='noReferrer'
        >
          <Image
            src='https://www.cineplex.com.ec/customers/logos/logo-cineplex-blanco.svg'
            alt='logo'
            layout='fill'
            objectFit='cover'
          />
        </a>
      </div>
    </div>
  );
};

export default Navbar;
