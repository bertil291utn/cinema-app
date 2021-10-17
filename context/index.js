import { useState,useContext, createContext } from 'react';

export const CinemaContext = createContext();

const CinemaProvider = (props) => {
  const [movies, setMovies] = useState([]);
  const [cities, setCities] = useState([]);


  const updateMovies = (movie) => {
    setMovies(movie);
  };

  const updateCities = (city) => {
    setCities(city);
  };

  return (
    <CinemaContext.Provider
      value={{
        movies,
        updateMovies,
        cities,
        updateCities,
      }}
    >
      {props.children}
    </CinemaContext.Provider>
  );
};

export default CinemaProvider;

export const useCinema = () => {
  return useContext(CinemaContext);
};
