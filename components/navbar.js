import Image from 'next/image';

const Navbar = () => {
  return (
    <div className='bg-black py-3 lg:sticky lg:top-0 lg:z-10'>
      <div className='h-12 w-36 relative mx-auto'>
        <Image
          src='https://www.cineplex.com.ec/customers/logos/logo-cineplex-blanco.svg'
          alt='logo'
          layout='fill'
          objectFit='cover'
        />
      </div>
    </div>
  );
};

export default Navbar;
