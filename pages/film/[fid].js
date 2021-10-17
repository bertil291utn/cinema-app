import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getPlaiceholder } from 'plaiceholder';
import { db } from '../../initFirebase';

const FilmDetail = ({ film }) => {
  return (
    <div className='px-3 py-1'>
      <p>{film.name}</p>
    </div>
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

  let film;
  if (movieSnap.exists()) {
    console.log('Document data:', movieSnap.data());
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
      film: film || {},
    },
  };
}
