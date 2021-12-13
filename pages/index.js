import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import ChipButton from '../components/ChipButton';
import axios from 'axios';
const cheerio = require('cheerio');

export default function Home({ cityMovies, cities }) {
  const [cityMovie, setCityMovie] = useState(cityMovies[0]);
  const [cityId, setCityId] = useState(1);
  const _cities = cities.map((c, i) => ({
    ...c,
    active: i == 0,
  }));

  const selectByCity = (cityId) => {
    setCityId(cityId)
    setCityMovie(cityMovies.find((c) => c.id === cityId));
  };

  return (
    <Layout>
      <div className='pt-5 pb-3 px-3 text-center sticky top-0 bg-white z-10 lg:top-16'>
        <ChipButton onClick={selectByCity} items={_cities} />
      </div>
      <main className='container px-3'>
        <div className='my-5 text-center grid grid-cols-2 gap-3'>
          {cityMovie.movies.map((movie, i) => (
            <Link
              href={`/film/${encodeURIComponent(movie.imdbId)}/${encodeURIComponent(cityId)}`}
              key={`poster-${i}`}
            >
              <a>
                <div className='h-96 w-full relative'>
                  <Image
                    src={movie.poster_path}
                    alt={`poster-${i}`}
                    layout='fill'
                    objectFit='cover'
                    placeholder='blur'
                    blurDataURL={rgbDataURL(0, 0, 0)}
                    className='rounded-2xl'
                  />
                  {movie._new && (
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
  const cities = await getCities();
  const cityMovies = await Promise.all(
    cities.map(async (c) => ({ ...c, movies: await getMovies(c.url) }))
  );

  return {
    props: {
      cityMovies,
      cities,
    },
  };
}

export const sortMovies = (movies, field) =>
  movies.sort((x, y) => (x[field] === y[field] ? 0 : x[field] ? 1 : -1));

async function getMovies(cityURL) {
  const response = await axios.get(cityURL);
  const $ = cheerio.load(response.data);
  const titles = $('div .col-md-4.col-sm-4.col-lg-4.col-xs-12');
  return await Promise.all(
    titles.map(async (index, section) => {
      let rawName = $(section).find('h3').text().trim();
      const movieName = rawName.split('-')[0].trim();
      const img = $(section).find('img').attr('src');

      let searchedMovie = await axios.get(
        `${process.env.NEXT_PUBLIC_TMBD_URL}/search/movie?api_key=${process.env.NEXT_PUBLIC_TMBD_API_KEY}&language=es-ES&query=${movieName}&page=1&include_adult=false&year=2021`
      );
      searchedMovie = searchedMovie.data;
      let imdbId = movieName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s/g, '-');
      if (searchedMovie.results.length > 0) {
        imdbId = searchedMovie.results.find(
          (m) =>
            new Date(m.release_date).getFullYear() === new Date().getFullYear()
        ).id;
      }

      return {
        id: index + 1,
        imdbId,
        name: movieName,
        _new: rawName.includes('ESTRENO'),
        poster_path: img,
      };
    })
  );
}

async function getCities() {
  const response = await axios.get(process.env.NEXT_PUBLIC_BASE_URL);
  const $ = cheerio.load(response.data);

  const citiesHTML = $('.cta-wr .col-md-3');
  return citiesHTML
    .map((index, section) => {
      const rawName = $(section).find('span').text().trim();
      const rawURL = $(section).find('a').attr('href');

      return {
        id: index + 1,
        name: rawName.replace('Cineplex ', ''),
        url: rawURL,
      };
    })
    .get();
}

const keyStr =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const triplet = (e1, e2, e3) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

const rgbDataURL = (r, g, b) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;
