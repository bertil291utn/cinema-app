import Image from 'next/image';
import { useState } from 'react';
import { getPlaiceholder } from 'plaiceholder';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { db } from '../initFirebase';
import Layout from '../components/Layout';
import ChipButton from '../components/ChipButton';

export default function Home({ films, cities }) {
  const [_movies, setMovies] = useState(
    sortMovies(
      films.filter((f) => f.active && f.cities.includes(cities[0].id)),
      'new'
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
        'new'
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
              href={`/film/${encodeURIComponent(movie.id)}`}
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
    id: m.id,
    ...m.data(),
  }));

  //replace poster with url and blur base64
  films = await Promise.all(
    films.map(async (film) => {
      const { base64, img } = await getPlaiceholder(film.poster);
      return {
        ...film,
        poster: { URL: img.src, blurDataURL: base64 },
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
  movies.sort((x, y) => (x[field] === y[field] ? 0 : x[field] ? -1 : 1));
