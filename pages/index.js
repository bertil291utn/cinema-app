import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [_movies, setMovies] = useState(sortMovies(movies, 'new'));
  const [_cities, setCities] = useState(cities);

  const selectByCity = (cityId) => () => {
    setMovies(
      sortMovies(
        movies.filter((m) => m.cityId.includes(cityId)),
        'new'
      )
    );

    _cities.forEach((c) => {
      c.active = false;
    });
    setCities(_cities);
    _cities[_cities.findIndex((c) => c.id == cityId)].active = true;
    setCities(_cities);
  };

  //sort by new estrenos
  return (
    <>
      <div>
        <Head>
          <title>Cinema app</title>
          <meta name='description' content='Generated by create next app' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <main className='container px-3 py-5'>
          <div className='text-center'>
            {_cities.map((city, i) => (
              <button
                key={`btn-city-${i}`}
                onClick={selectByCity(city.id)}
                className={`rounded-full border border-black px-3 py-1 mr-3 mb-3 ${
                  city.active ? 'bg-black text-white' : ''
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
          <div className='my-5 text-center grid grid-cols-2 gap-3'>
            {_movies.map((movie, i) => (
              <div key={`poster-${i}`} className='h-96 w-full relative '>
                <Image
                  src={movie.poster}
                  alt={`poster-${i}`}
                  layout='fill'
                  objectFit='cover'
                  className='rounded-lg'
                />
                {movie.new && (
                  <span className='absolute left-1 top-1 inline-block rounded-full text-white bg-red-700 px-2 py-1 text-xs font-bold mr-3'>
                    Estreno
                  </span>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export const cities = [
  { id: 1, name: 'Tumbaco', active: true },
  { id: 2, name: 'Los Chillos', active: false },
  { id: 3, name: 'Cayambe', active: false },
  { id: 4, name: 'El Coca', active: false },
];
export let movies = [
  {
    id: 1,
    name: 'Coda',
    poster: 'https://www.cineplex.com.ec/customers/fotos/poster_coda.jpg',
    new: true,
    cityId: [1, 2, 3, 4],
  },
  {
    id: 2,
    name: 'Huevitos',
    poster: 'https://www.cineplex.com.ec/customers/fotos/poster_huevitos.jpg',
    new: false,
    cityId: [1, 2, 3, 4],
  },
  {
    id: 3,
    name: 'Casa oscura',
    poster:
      'https://www.cineplex.com.ec/customers/fotos/poster_lacasaoscura2.jpg',
    new: false,
    cityId: [1, 3, 4],
  },
  {
    id: 4,
    name: 'James Bond 007',
    poster: 'https://www.cineplex.com.ec/customers/fotos/poster_007.jpg',
    new: true,
    cityId: [1, 2, 3, 4],
  },
  {
    id: 5,
    name: 'Venom',
    poster: 'https://www.cineplex.com.ec/customers/fotos/poster_venom3.jpg',
    new: true,
    cityId: [1, 2],
  },
  ,
];

export const sortMovies = (movies, field) =>
  movies.sort((x, y) => (x[field] === y[field] ? 0 : x[field] ? -1 : 1));
