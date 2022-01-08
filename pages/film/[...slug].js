import Layout from '../../components/Layout';
import Link from 'next/link';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { IoChevronBackOutline, IoPlay } from 'react-icons/io5';
import Image from 'next/image';
import ReadMoreReact from 'read-more-react';
import timeConvert from '../../utils/helpers';
import _ from 'lodash';
import SpinnerLoader from '../../components/Spinner-loader';
const cheerio = require('cheerio');

const { NEXT_PUBLIC_TMBD_IMAGE_URL: imageURL } = process.env;

const FilmDetail = () => {
  const router = useRouter();
  const [film, setFilm] = useState(undefined);

  const _leftTabs = [
    { id: 1, name: 'Info', active: true, displayActive: true },
    {
      id: 2,
      name: 'Vermouth',
      active: false,
      displayActive: false,
    },
    { id: 3, name: 'Cast', active: false, displayActive: false },
  ];
  const [leftTabs, setLeftTabs] = useState(_leftTabs);

  useEffect(() => {
    const getFilm = async () => {
      if (!router.query?.slug) return;
      const {
        slug: [imdbId, cityId],
      } = router.query;
      const film = await getMovieById(imdbId, cityId);
      const cities = await getCities();
      film.cityName = cities.find((c) => c.id == cityId).name || '';
      setFilm(film);
      setLeftTabs((prev) =>
        prev.map((e) => {
          if (e.id === 2) e.displayActive = !!film?.showTime?.vermouth;
          if (e.id === 3) e.displayActive = !!film?.cast;
          return { ...e };
        })
      );
    };

    getFilm();
  }, [router.query]);

  const updateTabs = (tabId) => () => {
    setLeftTabs((pTabs) =>
      pTabs.map((t) => ({
        ...t,
        active: t.id == tabId,
      }))
    );
  };

  return (
    <Layout subDir>
      {film ? (
        <>
          <div className='flex flex-row pl-6'>
            <div className='mr-10 mt-10 h-10' onClick={() => router.push('/')}>
              <IoChevronBackOutline className='text-3xl' />
            </div>

            <div className='h-96 w-full relative'>
              <Image
                src={`${
                  film.poster_path.includes('http')
                    ? film.poster_path
                    : imageURL + film.poster_path
                }`}
                alt='film-poster'
                layout='fill'
                objectFit='cover'
                placeholder='blur'
                blurDataURL={rgbDataURL(0, 0, 0)}
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

          <div className='flex flex-row pl-6 pb-36'>
            <ul className='flex flex-col items-start text-lg'>
              {leftTabs.map(
                (t) =>
                  t.displayActive && (
                    <li
                      key={`tab-${t.id}`}
                      className={`text-rotate-90-rl mb-10 ${
                        t.active ? 'font-bold' : 'text-gray-400'
                      }`}
                      onClick={updateTabs(t.id)}
                    >
                      {t.name}
                    </li>
                  )
              )}
            </ul>
            <div className='mt-5 ml-12 mr-8 w-full'>
              {leftTabs.find((t) => t.active).id == 1 && <Info film={film} />}
              {leftTabs.find((t) => t.active).id == 2 && (
                <Horarios film={film} />
              )}
              {leftTabs.find((t) => t.active).id == 3 && <Cast film={film} />}
            </div>
          </div>
          <div className='pt-5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-tl-4xl fixed bottom-0 w-full'>
            <div className='ml-24 flex overflow-x-auto space-x-5 mb-5 mr-3'>
              {film.showTime.regular._showtime.map((st, i) => (
                <span
                  key={`type-${i}`}
                  className='p-1 font-bold mr-1 uppercase'
                >
                  {st}
                </span>
              ))}
            </div>
            <div className='flex justify-between items-center ml-10'>
              <p className='text-2xl font-bold'>
                {`$${film.showTime.regular.price}`}
              </p>
              <p>{film.cityName}</p>
              <button
                onClick={() => window.open(`tel:${film.showTime.telephone}`)}
                className='bg-blue-600 rounded-tl-4xl w-1/2 font-bold py-7 text-white text-center text-2xl'
                type='button'
              >
                Comprar
              </button>
            </div>
          </div>
        </>
      ) : (
        <SpinnerLoader />
      )}
    </Layout>
  );
};

export default FilmDetail;

export const Info = ({ film }) => {
  const sortedBackdrops = film.images?.backdrops.slice(0, 5);
  const genres = film.genres.slice(0, 2);
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
          <p className='font-bold'>
            {+film.runtime ? timeConvert(film.runtime) : film.runtime.trim()}
          </p>
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
        {sortedBackdrops && (
          <div className='my-5 flex overflow-x-auto space-x-5'>
            {sortedBackdrops.map((backdrop, index) => (
              <div
                className='flex-shrink-0 h-28 w-8/12 relative'
                key={`image-${index}`}
              >
                <Image
                  src={imageURL + backdrop.file_path}
                  alt={`poster-${1}`}
                  layout='fill'
                  objectFit='cover'
                  objectPosition='center'
                  placeholder='blur'
                  blurDataURL={rgbDataURL(0, 0, 0)}
                  className='rounded-3xl'
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const Horarios = ({ film }) => {
  return (
    <>
      <div className='d-flex overflow-x-auto space-x-5 my-4'>
        {film.showTime.vermouth._showtime.map((st, i) => (
          <span key={`type-${i}`} className='p-1 font-bold mr-1 uppercase'>
            {st}
          </span>
        ))}
      </div>
      <p className='text-gray-400'>{film.showTime.vermouth.days.join(' / ')}</p>
      <p className='text-2xl font-bold'>{`$${film.showTime.vermouth.price}`}</p>
      <p>{film.cityName}</p>
    </>
  );
};

export const Cast = ({ film }) => {
  return (
    <div className='grid grid-cols-2 gap-3'>
      {film.cast.map((f) => (
        <div key={f.id}>
          <div className='h-48 w-full relative'>
            <Image
              src={imageURL + f.profile_path}
              alt={`actor-${f.id}`}
              layout='fill'
              objectFit='cover'
              placeholder='blur'
              blurDataURL={rgbDataURL(0, 0, 0)}
              className='rounded-xl'
            />
          </div>
          <p className='text-gray-400 my-3'>{f.name}</p>
        </div>
      ))}
    </div>
  );
};

export const sortObject = (array, field) =>
  array.sort((a, b) => a[field] - b[field]);

async function getMovies(cityURL) {
  const response = await axios.get(cityURL);
  const $ = cheerio.load(response.data);
  const titles = $('div .col-md-4.col-sm-4.col-lg-4.col-xs-12');
  return await Promise.all(
    titles.map(async (index, section) => {
      let rawName = $(section).find('h3').text().trim();
      let movieNameOriginal = rawName
        .split(/2D|3D|IMAX|4D|4K|HD|ULTRAHD|ULTRAIMAX/gi)[0]
        .trim();
      movieNameOriginal = movieNameOriginal.replace(/\W/g, ' ').trim();
      let movieName = movieNameOriginal;
      movieName = movieName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      let searchedMovie = await axios.get(
        `${process.env.NEXT_PUBLIC_TMBD_URL}/search/movie?api_key=${process.env.NEXT_PUBLIC_TMBD_API_KEY}&language=es-ES&query=${movieName}&page=1&include_adult=false&year=2021`
      );
      searchedMovie = searchedMovie.data;
      let imdbId = movieName.replace(/\s/g, '-');
      if (searchedMovie.results.length > 0) {
        imdbId =
          searchedMovie.results.find(
            (m) => new Date(m.release_date).getFullYear() >= 2020
          ).id + '';
      }

      return {
        id: index + 1,
        imdbId,
        name: movieNameOriginal,
      };
    })
  );
}

async function getMovieById(imdbId, cityId) {
  const _imdbId = +imdbId;
  let returnResponse;
  if (_imdbId) {
    let movieByID = await axios.get(
      `${process.env.NEXT_PUBLIC_TMBD_URL}/movie/${_imdbId}?api_key=${process.env.NEXT_PUBLIC_TMBD_API_KEY}&language=es-ES&append_to_response=images,videos,release_dates`
    );
    movieByID = movieByID.data;

    let imagesByID = await axios.get(
      `${process.env.NEXT_PUBLIC_TMBD_URL}/movie/${_imdbId}/images?api_key=${process.env.NEXT_PUBLIC_TMBD_API_KEY}`
    );
    imagesByID = imagesByID.data;

    let videosByID = await axios.get(
      `${process.env.NEXT_PUBLIC_TMBD_URL}/movie/${_imdbId}/videos?api_key=${process.env.NEXT_PUBLIC_TMBD_API_KEY}`
    );
    videosByID = videosByID.data;

    let castByID = await axios.get(
      `${process.env.NEXT_PUBLIC_TMBD_URL}/movie/${_imdbId}/credits?api_key=${process.env.NEXT_PUBLIC_TMBD_API_KEY}`
    );
    castByID = castByID.data.cast;

    returnResponse = {
      ...movieByID,
      images: imagesByID,
      videos: videosByID,
      type: '2D',
      language: 'Espanol',
      cast: castByID,
    };
  } else {
    const _imdbId = imdbId.replace(/-/g, ' ');
    const response = await axios.get(process.env.NEXT_PUBLIC_BASE_URL);
    const $ = cheerio.load(response.data);
    const titles = $('div .col-md-4.col-sm-4.col-lg-4.col-xs-12');
    const _movies = titles
      .map((index, section) => {
        let rawName = $(section).find('h3').text().trim();
        let movieName = rawName
          .split(/2D|3D|IMAX|4D|4K|HD|ULTRAHD|ULTRAIMAX/gi)[0]
          .trim();
        movieName = movieName.replace(/\W/g, ' ').trim();
        const rawURL = $(section).find('a').attr('href');
        const url = `https://www.cineplex.com.ec/${rawURL}`;
        const h5Spans = $(section).find('h5 span');
        const img = $(section).find('img').attr('src');
        return { movieName, url, h5Spans, img, rawName };
      })
      .get();
    const movieFinded = _movies.find(
      (m) =>
        m.movieName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') == _imdbId.toLowerCase()
    );
    const response1 = await axios.get(movieFinded.url);
    const $1 = cheerio.load(response1.data);
    let description = $1('div.col.col-sm-9.p-15>h4>span');
    description = description.text();
    let trailer = $1('iframe');
    trailer = trailer.attr('src');
    const trailerKey = trailer.split('/');

    const info = {
      release_dates: {
        results: [
          {
            iso_3166_1: 'US',
            release_dates: [
              {
                certification: $(movieFinded.h5Spans.get(0)).text(),
              },
            ],
          },
        ],
      },

      poster_path: movieFinded.img,
      genres: $(movieFinded.h5Spans.get(2))
        .text()
        .trim()
        .split('/')
        .map((g, index) => ({ id: index + 1, name: g })),
      runtime: $(movieFinded.h5Spans.get(3)).text().split(':')[1],
      overview: description,
      videos: {
        results: [
          {
            key: trailerKey[trailerKey.length - 1],
            type: 'Trailer',
          },
        ],
      },
    };
    returnResponse = {
      _id: movieFinded.movieName,
      _new: movieFinded.rawName.includes('ESTRENO'),
      type: (
        movieFinded.rawName
          .split('-')[1]
          .split(' ')
          .filter(
            (e) =>
              [
                '2D',
                '3D',
                'IMAX',
                '4D',
                '4K',
                'HD',
                'ULTRAHD',
                'ULTRAIMAX',
              ].includes(e) && e
          )
          .join('') || '2D'
      )
        .match(/\w?[^estreno]/gi)
        .join('')
        .trim(),
      language: $(movieFinded.h5Spans.get(1)).text().trim() || 'Espanol',
      ...info,
      original_title: movieFinded.movieName,
      title: movieFinded.movieName,
    };
  }
  const cities = await getCities();
  const moviesFind = await getAllMovies(cities);

  returnResponse = {
    ...returnResponse,
    showTime: await getShowTime(
      cities.find((c) => c.id == cityId).url,
      moviesFind.find((m) => m.imdbId == imdbId).name
    ),
  };

  return returnResponse;
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

async function getShowTime(cityURL, movieName) {
  const response = await axios.get(cityURL);
  const $ = cheerio.load(response.data);
  const titles = $('div.col-md-4.col-sm-4.col-lg-4.col-xs-12');
  const showTime = titles
    .map((index, section) => {
      const h5 = $(section).find('h5');
      let showTime = $(section).find('span span[style="font-size: 20px;"]');
      const rawName = $(section).find('h3').text().trim();
      let _movieName = rawName
        .split(/2D|3D|IMAX|4D|4K|HD|ULTRAHD|ULTRAIMAX/gi)[0]
        .trim();
      _movieName = _movieName.replace(/\W/g, ' ').trim();

      const regularPrice = $(h5.get(1)).find('span').text().trim();
      const regularShowTime = $(showTime.get(0)).text().trim();
      const vermouthShowTime = $(showTime.get(1)).text().trim();
      const vermouthPriceDate = $(h5.get(2)).find('span').text().trim();

      let vermouth = vermouthPriceDate;
      let regular = regularShowTime;
      if (vermouth) {
        vermouth = {
          _showtime: [...vermouthShowTime.match(/[0-9]{2}:[0-9]{2}/gi)],
          price: vermouthPriceDate.match(/[0-9]\.[0-9]+/gi).join(''),
          days: vermouthPriceDate.match(/SAB|DOM|LUN|MAR|MIE|JUE|VIE/gi),
        };
      }

      if (regular) {
        regular = {
          _showtime: [...regularShowTime.match(/[0-9]{2}:[0-9]{2}/gi)],
          price: regularPrice.match(/[0-9]\.[0-9]+/gi).join(''),
        };
      }

      return {
        name: _movieName,
        regular,
        vermouth,
      };
    })
    .get();

  return (
    {
      ...showTime.find(
        (st) => st.name.toLowerCase() == movieName.toLowerCase()
      ),
      telephone: await getTelephone(cityURL),
    } || {}
  );
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

async function getAllMovies(cities) {
  const cityMovies = await Promise.all(
    cities.map(async (c) => ({ ...c, movies: await getMovies(c.url) }))
  );
  const cm = cityMovies.map((cm) => cm.movies);
  return _.uniqBy(cm.flat(), 'name');
}

async function getTelephone(cityURL) {
  const response = await axios.get(cityURL);
  const $ = cheerio.load(response.data);
  const footer = $('footer li');
  return $(footer.get(1))
    .text()
    .match(/[\+]?[(]?[0-9]{2}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/g)
    .join('');
}
