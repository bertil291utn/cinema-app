import CinemaProvider from '../context';
import Head from 'next/head';

import '../styles/globals.css';
import '../styles/home.css';

function MyApp({ Component, pageProps }) {
  return (
    <CinemaProvider>
      <Head>
        <title>Cineplex</title>
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <meta name='theme-color' content='#db1047' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='canonical' href='https://cinema-app-theta.vercel.app' />
        <meta name='author' content='Garage Group' />
        <meta
          name='description'
          content='Una experiencia inolvidable, con nuestro nuevo catalogo para telefonos de Cineplex'
        />
        <meta
          name='keywords'
          content='cine, cinema, cineplex cayambe, cineplex tumbaco, cineplex, cineplex tumbaco, cineplex los chillos, cineplex el coca'
        />

        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@cineplex' />
        <meta name='twitter:creator' content='@cineplex' />
        <meta name='twitter:title' content='Cineplex' />
        <meta
          name='twitter:description'
          content='Una experiencia inolvidable, con nuestro nuevo catalogo para telefonos de Cineplex'
        />
        <meta
          name='twitter:image'
          content='https://res.cloudinary.com/btandayamo/image/upload/v1641352715/volkfire-app/cineplex-og-image_jhpb98.png'
        />

        <meta property='og:title' content='Cineplex' />
        <meta property='og:site_name' content='Cineplex cinemas' />
        <meta property='og:url' content='https://cinema-app-theta.vercel.app' />
        <meta
          property='og:description'
          content='Una experiencia inolvidable, con nuestro nuevo catalogo para telefonos de Cineplex'
        />
        <meta property='og:type' content='website' />
        <meta
          property='og:image'
          content='https://res.cloudinary.com/btandayamo/image/upload/v1641352715/volkfire-app/cineplex-og-image_jhpb98.png'
        />
      </Head>
      <Component {...pageProps} />
    </CinemaProvider>
  );
}

export default MyApp;
