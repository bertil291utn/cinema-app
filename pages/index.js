import Image from 'next/image';
import { useState } from 'react';
import { getPlaiceholder } from 'plaiceholder';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { db } from '../initFirebase';
import Layout from '../components/Layout';
import ChipButton from '../components/ChipButton';
import axios from 'axios';

export default function Home({ films, cities }) {
  const [_movies, setMovies] = useState(
    sortMovies(
      films.filter((f) => f.active && f.cities.includes(cities[0].id)),
      'release_date'
    )
  );
  let _cities = cities.filter((c) => c.active);
  _cities = _cities.map((c) => ({
    ...c,
    active: c.currentCity,
  }));

  const selectByCity = (cityId) => {
    setMovies(
      sortMovies(
        films.filter((f) => f.active && f.cities.includes(cityId)),
        'release_date'
      )
    );
  };

  //sort by new estrenos
  return (
    <Layout>
      <div className='pt-5 pb-3 px-3 text-center sticky top-0 bg-white z-10 lg:top-16'>
        <ChipButton onClick={selectByCity} items={_cities} />
      </div>
      <main className='container px-3'>
        <div className='my-5 text-center grid grid-cols-2 gap-3'>
          {_movies.map((movie, i) => (
            <Link
              href={`/film/${encodeURIComponent(movie.id_original)}`}
              key={`poster-${i}`}
            >
              <a>
                <div className='h-96 w-full relative'>
                  <Image
                    src={movie.poster.URL}
                    alt={`poster-${i}`}
                    layout='fill'
                    objectFit='cover'
                    placeholder='blur'
                    blurDataURL={movie.poster.blurDataURL}
                    className='rounded-2xl'
                  />
                  {movie.new && (
                    <span className='absolute left-1 top-1 inline-block rounded-full text-white bg-red-700 px-2 py-1 text-xs font-bold mr-3'>
                      Estreno
                    </span>
                  )}
                </div>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const moviesResponse = await getDocs(collection(db, 'movies'));

  let films;
  films = moviesResponse.docs.map((m) => ({
    id_original: m.id,
    ...m.data(),
  }));

  //replace poster with url and blur base64
  films = await Promise.all(
    films.map(async (film) => {
      const { movie, poster } = await buildFilmObject(film.id_tmdb);
      return {
        ...film,
        ...movie,
        poster,
      };
    })
  );
  console.log(films);

  //cities
  const citiesResponse = await getDocs(collection(db, 'cities'));
  const cities = citiesResponse.docs.map((c, i) => ({
    id: +c.id,
    currentCity: i == 0,
    ...c.data(),
  }));
  console.log(cities);
  return {
    props: {
      films,
      cities,
    },
  };
}

export const sortMovies = (movies, field) =>
  movies.sort((x, y) => (x[field] === y[field] ? 0 : x[field] ? 1 : -1));

export const isEstreno = (release_date) => {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  return new Date(release_date) >= fourteenDaysAgo;
};

const buildFilmObject = async (id_tmdb) => {
  const movieURL=`${process.env.NEXT_PUBLIC_TMBD_URL}/movie/${id_tmdb}?api_key=${
    process.env.NEXT_PUBLIC_TMBD_API_KEY
  }&language=es-ES&append_to_response=videos,release_dates`
  let movie = await axios.get(movieURL);
  movie = movie.data;
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
