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
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />

        {/* <!-- Hotjar Tracking Code for https://cinema-app-theta.vercel.app --> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      </Head>
      <Component {...pageProps} />
    </CinemaProvider>
  );
}

export default MyApp;
