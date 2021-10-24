import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getPlaiceholder } from 'plaiceholder';
import Layout from '../../components/Layout';
import { db } from '../../initFirebase';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { IoChevronBackOutline, IoPlay } from 'react-icons/io5';
import Image from 'next/image';
import ReadMoreReact from 'read-more-react';

const FilmDetail = ({ film}) => {
  const lefTabs = [
    { id: 1, name: 'Info', active: true,displayActive:true },
    { id: 2, name: 'Vermouth', active: false,displayActive:false },
    { id: 3, name: 'Cast', active: false,displayActive:true },
  ];
  const [_leftTabs, setLeftTabs] = useState(lefTabs.filter(t=>t.displayActive));

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
            <div className='mr-10 mt-10 h-10'>
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
                <button
                  className='rounded-full p-6 backdrop-filter bg-opacity-10 backdrop-blur-md'
                  onClick={() => window.open(film.trailer, '_blank')}
                >
                  <IoPlay className='text-white text-3xl' />
                </button>
              </div>
            </div>
          </div>

          <div className='flex flex-row pl-6'>
            <ul className='flex flex-col items-start text-lg'>
              {_leftTabs.map((t) => (
                <li
                  key={`tab-${t.id}`}
                  className={`text-rotate-90-rl mb-10 ${
                    t.active ? 'font-bold' : 'text-gray-400'
                  }`}
                  onClick={updateTabs(t.id)}
                >
                  {t.name}
                </li>
              ))}
            </ul>
            <div className='mt-5 ml-12 mr-8'>
              {_leftTabs.find((t) => t.active).id == 1 && <Info film={film} />}
              {_leftTabs.find((t) => t.active).id == 2 && (
                <Horarios film={film} />
              )}
              {_leftTabs.find((t) => t.active).id == 3 && <Cast film={film} />}
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

  

  return {
    props: {
      film,
    },
  };
}

export const Info = ({ film }) => {
  return (
    <div className=''>
      <p className='mb-5 text-3xl font-bold'>{film.name}</p>
      <div className='contenido text-gray-400'>
        <div className='flex flex-row'>
          <ul className='flex flex-row'>
            {film.genre.split(',').map((genre, i) => (
              <li key={`genre-${i}`} className='capitalize mr-3 last:mr-0'>
                {genre}
              </li>
            ))}
          </ul>
          <p className='mx-4'>&#183;</p>
          <p className='font-bold'>{film.duration}</p>
        </div>
        <div className='my-2'>
          {film.type.split(',').map((t, i) => (
            <span
              key={`type-${i}`}
              className='inline-block rounded-full px-5 py-1 text-xs font-bold mr-3 border uppercase'
            >
              {t}
            </span>
          ))}
        </div>

        <ul className='flex flex-row'>
          <li className='capitalize'>{film.language}</li>
          <li className='mx-4'>&#183;</li>
          <li className='font-bold'>
            {film.restriction == 0
              ? 'Todo p\xFAblico'
              : film.restriction + ' a\xF1os'}
          </li>
        </ul>
        <div className='my-5'>
          <ReadMoreReact
            text={film.plot}
            readMoreText={'Leer m\xE1s'}
            min={30}
            ideal={40}
            max={50}
          />
        </div>
      </div>
    </div>
  );
};

export const Horarios = () => {
  return <div>this is horarios</div>;
};

export const Cast = () => {
  return <div>this is cast</div>;
};
