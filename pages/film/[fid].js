import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getPlaiceholder } from 'plaiceholder';
import Layout from '../../components/Layout';
import { db } from '../../initFirebase';
import Link from 'next/link';
import axios from 'axios';
import { useState, useEffect } from 'react';

import { IoChevronBackOutline, IoPlay } from 'react-icons/io5';
import Image from 'next/image';
import ReadMoreReact from 'read-more-react';
import timeConvert from '../../utils/helpers';

const FilmDetail = ({ film }) => {
  const lefTabs = [
    { id: 1, name: 'Info', active: true, displayActive: true },
    { id: 2, name: 'Vermouth', active: false, displayActive: false },
    { id: 3, name: 'Cast', active: false, displayActive: true },
  ];
  const [_leftTabs, setLeftTabs] = useState(
    lefTabs.filter((t) => t.displayActive)
  );

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
                  onClick={() =>
                    window.open(
                      `https://youtu.be/${film.videos.results[0].key}`,
                      '_blank'
                    )
                  }
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
    film = { ...movieSnap.data(), id_original: movieSnap.id };
    const { movie, poster } = await buildFilmObject(film.id_tmdb);
    film = {
      ...film,
      ...movie,
      poster,
    };
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
  const sortedBackdrops = film.images.backdrops.slice(0,5);
  const genres = film.genres.slice(0,2);
  let restriction = film.release_dates.results.find(
    (e) => e['iso_3166_1'] == 'GB'
  );
  if (!restriction) restriction = 0;
  else restriction = restriction['release_dates'][0].certification;
  return (
    <div className=''>
      <p className='mb-5 text-3xl font-bold'>{film.title}</p>
      <div className='contenido text-gray-400'>
        <div className='flex flex-row flex-wrap'>
          <ul className='flex flex-row'>
            {genres.map((genre, i) => (
              <li key={`genre-${i}`} className='capitalize mr-3 last:mr-0'>
                {genre.name}
              </li>
            ))}
          </ul>
          <p className='mx-4'>&#183;</p>
          <p className='font-bold'>{timeConvert(film.runtime)}</p>
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
            {restriction == 0 ? 'Todo p\xFAblico' : restriction + ' a\xF1os'}
          </li>
        </ul>
        <div className='my-5'>
          <ReadMoreReact
            text={film.overview}
            readMoreText={'Leer m\xE1s'}
            min={30}
            ideal={40}
            max={50}
          />
        </div>
        <div className='my-5 flex overflow-x-auto space-x-5'>
          {sortedBackdrops.map((backdrop, index) => (
            <div
              className='flex-shrink-0 h-28 w-8/12 relative'
              key={`image-${index}`}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_TMBD_IMAGE_URL}${backdrop.file_path}`}
                alt={`poster-${1}`}
                layout='fill'
                objectFit='cover'
                objectPosition='center'
                // placeholder='blur'
                // blurDataURL={film.poster.blurDataURL}
                className='rounded-3xl'
              />
            </div>
          ))}
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

export const sortObject = (array, field) =>
  array.sort((a, b) => a[field] - b[field]);

const buildFilmObject = async (id_tmdb) => {
  const movieURL = `${process.env.NEXT_PUBLIC_TMBD_URL}/movie/${id_tmdb}?api_key=${process.env.NEXT_PUBLIC_TMBD_API_KEY}&language=es-ES`;
  const movieAppendedURL = `${process.env.NEXT_PUBLIC_TMBD_URL}/movie/${id_tmdb}?api_key=${process.env.NEXT_PUBLIC_TMBD_API_KEY}&append_to_response=images,videos,release_dates`;
  let movie = await axios.get(movieURL);
  movie = movie.data;
  let movieAppended = await axios.get(movieAppendedURL);
  movieAppended = movieAppended.data;
  movie = {
    ...movie,
    images: movieAppended.images,
    videos: movieAppended.videos,
    release_dates: movieAppended.release_dates,
  };
  let poster = {
    URL: 'https://www.sinrumbofijo.com/wp-content/uploads/2016/05/default-placeholder.png',
    blurDataURL:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAFA4PEg8NFBIQEhcVFBgeMiEeHBwePSwuJDJJQExLR0BGRVBac2JQVW1WRUZkiGVtd3uBgoFOYI2XjH2Wc36BfP/bAEMBFRcXHhoeOyEhO3xTRlN8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fP/AABEIAIIAggMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAAAAQIDBv/EABYQAQEBAAAAAAAAAAAAAAAAAAABEf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A9gAqIioAgAKgCqgCiACKgIAAADoCAIJQEEBRDQaE0BoQABAAQAAHVBAKzVqUEQqAaus6aDWrrOqDQyoKIAAgKIA6oqAlZq1mglQqACANCKCqgCgAAAAA6JVQErNarNBmpVqAgACooKqKCiKAIAAA6oqAlZrVZoM1GqgMigCigAoAAIAAADqioCVKqAyKgIKAKKCCgIKgIAAADqioCI0gIioACgAoCKAiKgCKgAAOqAAgAgAAAKAAACIACAAAD//Z',
  };
  if (movie) {
    const posterUrl = `${process.env.NEXT_PUBLIC_TMBD_IMAGE_URL}${movie.poster_path}`;
    const { base64, img } = await getPlaiceholder(posterUrl);
    poster = { URL: img.src, blurDataURL: base64 };
  }
  return { movie, poster };
};
