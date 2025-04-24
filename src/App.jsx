import React, { useState } from 'react';
import axios from 'axios';
import fondo from './img/fondo.jpg'
import logopokemon from './img/logopokemon.svg'

function App() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]); // Agregar estado para las sugerencias
  const [loading, setLoading] = useState(false); // Agregar estado de carga para evitar llamadas excesivas

  // Función para manejar la búsqueda de Pokémon
  const fetchPokemonData = async (name) => {
    if (!name) return;

    setError('');
    setPokemonData(null);

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      setPokemonData(response.data);
    } catch (err) {
      setError('Pokémon no encontrado. Asegúrate de escribirlo correctamente.');
    }
  };

  // Función para manejar el cambio en el campo de búsqueda y mostrar sugerencias
  const handleInputChange = async (e) => {
    const name = e.target.value;
    setPokemonName(name);

    if (!name) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1000`); // Obtener los primeros 1000 Pokémon
      const allPokemons = response.data.results;

      const filteredSuggestions = allPokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(name.toLowerCase())
      );

      // Obtener las imágenes de los Pokémon
      const suggestionsWithImages = await Promise.all(filteredSuggestions.map(async (suggestion) => {
        const pokeResponse = await axios.get(suggestion.url); // Hacer una llamada para obtener detalles, incluida la imagen
        const image = pokeResponse.data.sprites.other['official-artwork'].front_default;
        return { ...suggestion, image };
      }));

      setSuggestions(suggestionsWithImages);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para seleccionar un Pokémon de las sugerencias
  const handleSuggestionClick = async (suggestion) => {
    setPokemonName(suggestion.name);
    setSuggestions([]);
    fetchPokemonData(suggestion.name);
  };

  return (

    // <div className='relative w-full h-screen' >
    //   <div className=''>
    //     {/* <img class="absolute top-0 left-0 w-full h-full" src={fondo} alt="" /> */}
    //     <h1 className=" relative top-1" >Buscador de Pokémon</h1>
    //     <div className='relative top-1'>
    //       <input
    //         type="text"
    //         placeholder="Escribe el nombre del Pokémon"
    //         value={pokemonName}
    //         onChange={handleInputChange} // Cambiar de onChange a handleInputChange
    //       />
    //       <button className='relative' onClick={() => fetchPokemonData(pokemonName)}>Buscar</button>
    //     </div>

    //     {/* Mostrar las sugerencias visualmente con su imagen */}
    //     {loading && <p>Cargando sugerencias...</p>}

    //     {suggestions.length > 0 && (
    //       <div className='relative top-1'>
    //         {suggestions.map((suggestion) => (
    //           <div
    //             key={suggestion.name}
    //             onClick={() => handleSuggestionClick(suggestion)}
    //             className="relative"
    //           >
    //             <img
    //               src={suggestion.image} // Usamos la imagen obtenida en el fetch de sugerencias
    //               alt={suggestion.name}
    //               className="relative top-1"
    //             />
    //             <p>{suggestion.name}</p>
    //           </div>
    //         ))}
    //       </div>
    //     )}

    //     {error && <p style={{ color: 'red' }}>{error}</p>}

    //     {pokemonData && (
    //       <div className="relative top-1">
    //         <h2>{pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
    //         <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
    //         <p><strong>Altura:</strong> {pokemonData.height / 10} m</p>
    //         <p><strong>Peso:</strong> {pokemonData.weight / 10} kg</p>
    //         <p><strong>Habilidades:</strong> {pokemonData.abilities.map((ability) => ability.ability.name).join(', ')}</p>
    //         <p><strong>Tipos:</strong> {pokemonData.types.map((type) => type.type.name).join(', ')}</p>
    //       </div>
    //     )}

    //   </div>



    // </div>
    <>
<div className='relative w-full h-screen bg-gray-100'>
  <div className='absolute top-0 left-0 w-full h-full'>
    <img 
      src={fondo} 
      alt="Fondo Pokémon" 
      className="w-full h-full object-cover opacity-60"
    />
  </div>
  
  <div className='max-w-4xl mx-auto px-6 py-10 relative z-10'>
    {/* Logo */}
    <div className='text-center mb-6'>
      <img 
        src={logopokemon} 
        alt="Logo Pokémon" 
        className="mx-auto mb-4"
      />
      {/* Título */}
      <h1 className="text-5xl font-extrabold text-center text-blue-500 mb-6 tracking-wide">Buscador de Pokémon</h1>
    </div>

    {/* Barra de búsqueda */}
    <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
      <input
        type="text"
        placeholder="Escribe el nombre del Pokémon"
        value={pokemonName}
        onChange={handleInputChange}
        className="px-6 py-3 w-full sm:w-80 border-4 border-blue-500 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
      />
      <button
        className="px-6 py-3  bg-blue-500 text-yellow-400 rounded-lg hover:bg-blue-600 transition-all cursor-pointer shadow-lg"
        onClick={() => fetchPokemonData(pokemonName)}
      >
        Buscar
      </button>
    </div>

    {/* Estado de carga */}
    {loading && <p className="text-center mt-4 text-white z-10 font-semibold">Cargando sugerencias...</p>}

    {/* Mostrar sugerencias */}
    {suggestions.length > 0 && (
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.name}
            onClick={() => handleSuggestionClick(suggestion)}
            className="cursor-pointer text-center bg-white hover:bg-yellow-50 p-6 rounded-lg shadow-xl transition-all transform hover:scale-105"
          >
            <img
              src={suggestion.image}
              alt={suggestion.name}
              className="mx-auto mb-4 w-32 h-32 object-contain"
            />
            <p className="text-xl font-bold text-blue-500">{suggestion.name}</p>
          </div>
        ))}
      </div>
    )}

    {/* Mostrar errores */}
    {error && <p className="text-red-500 text-center mt-4 font-semibold">{error}</p>}

    {/* Mostrar detalles del Pokémon */}
    {pokemonData && (
      <div className="mt-10 text-center text-black  mt-[-25px]">
        <h2 className="text-3xl font-bold mb-6 text-blue-500">
          {pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}
        </h2>
        <img
          src={pokemonData.sprites.front_default}
          alt={pokemonData.name}
          className="mx-auto mb-6 w-48 h-48 object-contain"
        />
        <div className="space-y-4 mt-[-25px]">
          <p><strong>Altura:</strong> {pokemonData.height / 10} m</p>
          <p><strong>Peso:</strong> {pokemonData.weight / 10} kg</p>
          <p><strong>Habilidades:</strong> {pokemonData.abilities.map((ability) => ability.ability.name).join(', ')}</p>
          <p><strong>Tipos:</strong> {pokemonData.types.map((type) => type.type.name).join(', ')}</p>
        </div>
      </div>
    )}
  </div>
</div>




    </>
  );
}

export default App;
