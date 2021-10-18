import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getPlaiceholder } from 'plaiceholder';
import Layout from '../../components/Layout';
import { db } from '../../initFirebase';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { IoChevronBackOutline, IoPlay } from 'react-icons/io5';
import Image from 'next/image';

const FilmDetail = ({ film, lefTabs }) => {
  const [_leftTabs, setLeftTabs] = useState(lefTabs);

  const updateTabs = (tabId) => () => {
    setLeftTabs((pTabs) =>
      pTabs.map((t) => {
        t.active = false;
        if (t.id == tabId) t.active = true;
        return t;
      })
    );
  };

  return (
    <Layout subDir>
      {film ? (
        <>
          <div className='flex flex-row pl-6'>
            <div className='mr-6 mt-10 h-10'>
              <Link href='/'>
                <a>
                  <IoChevronBackOutline className='text-3xl' />
                </a>
              </Link>
            </div>

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
              <div className='absolute bottom-9 left-9'>
                <button className='rounded-full p-6 backdrop-filter bg-opacity-10 backdrop-blur-md'>
                  <IoPlay className='text-white text-3xl' />
                </button>
              </div>
            </div>
          </div>

          <div className='flex flex-row pl-6'>
            <ul className='flex flex-col justify-between items-start h-64 text-lg'>
              {_leftTabs.map((t) => (
                <li
                  key={`tab-${t.id}`}
                  className={`text-rotate-90-rl ${
                    t.active ? 'font-bold' : 'text-gray-400'
                  }`}
                  onClick={updateTabs(t.id)}
                >
                  {t.name}
                </li>
              ))}
            </ul>
            <div className='mt-5 ml-8'>
              {_leftTabs.find((t) => t.active).id == 1 && <Info />}
              {_leftTabs.find((t) => t.active).id == 2 && <Horarios />}
              {_leftTabs.find((t) => t.active).id == 3 && <Cast/>}
            </div>
          </div>
        </>
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

  const lefTabs = [
    { id: 1, name: 'Info', active: true },
    { id: 2, name: 'Horarios', active: false },
    { id: 3, name: 'Cast', active: false },
  ];

  return {
    props: {
      film,
      lefTabs,
    },
  };
}

export const Info = () => {
  return <div>this is info</div>;
};

export const Horarios = () => {
  return <div>this is horarios</div>;
};

export const Cast = () => {
  return <div>this is cast</div>;
};
