import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getPlaiceholder } from 'plaiceholder';
import Layout from '../../components/Layout';
import { db } from '../../initFirebase';
import Link from 'next/link';

import { IoChevronBackOutline } from 'react-icons/io5';
import Image from 'next/image';

const FilmDetail = ({ film }) => {
  return (
    <Layout showNavBar={false}>
      {film ? (
        <div className='flex flex-row pl-6'>
          <Link href='/'>
            <a>
              <div className='mr-6 mt-10'>
                <IoChevronBackOutline className='text-3xl' />
              </div>
            </a>
          </Link>
          <div className='h-96 w-full relative'>
            <Image
              src={film.poster.URL}
              alt='film-poster'
              layout='fill'
              objectFit='cover'
              placeholder='blur'
              blurDataURL={film.poster.blurDataURL}
              className='rounded-bl-6xl'
            />
          </div>
        </div>
      ) : (
        <div>Theres no movie info</div>
      )}
    </Layout>
  );
};

export default FilmDetail;

export async function getStaticPaths() {
  const moviesResponse = await getDocs(collection(db, 'movies'));
  const filmIds = moviesResponse.docs.map((m) => m.id);
  const paths = filmIds.map((fid) => ({
    params: { fid },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const movieRef = doc(db, 'movies', params.fid);
  const movieSnap = await getDoc(movieRef);

  let film = null;
  if (movieSnap.exists()) {
    film = { ...movieSnap.data(), id: movieSnap.id };
    const { base64, img } = await getPlaiceholder(film.poster);
    film = { ...film, poster: { URL: img.src, blurDataURL: base64 } };
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!');
  }

  console.log('film', film);

  return {
    props: {
      film,
    },
  };
}
