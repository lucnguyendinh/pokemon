import { useEffect, useState } from 'react';
import axios from 'axios';

import './App.css';
import PokemonColection from './components/PokemonColection';
import { Detail, Pokemon } from './interfaece';
interface Pokemons {
    name: string;
    url: string;
}

const App: React.FC = () => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [nextUrl, setNextUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [viewDetail, setViewDetail] = useState<Detail>({
        id: 0,
        isOpened: false,
    });

    useEffect(() => {
        const getPokemon = async () => {
            const res = await axios.get(
                'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20',
            );
            setNextUrl(res.data.next);
            res.data.results.forEach(async (pokemon: Pokemons) => {
                const poke = await axios.get(
                    `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`,
                );
                setPokemons((p) => [...p, poke.data]);
                setLoading(false);
            });
        };
        getPokemon();
    }, []);
    const nextMore = async () => {
        setLoading(true);
        let res = await axios.get(nextUrl);
        setNextUrl(res.data.next);
        res.data.results.forEach(async (pokemon: Pokemons) => {
            const poke = await axios.get(
                `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`,
            );
            setPokemons((p) => [...p, poke.data]);
            setLoading(false);
        });
    };

    return (
        <div className="App">
            <div className="container">
                <header className="pokemon-header">Pokemon</header>
                <PokemonColection
                    pokemons={pokemons}
                    viewDetail={viewDetail}
                    setViewDetail={setViewDetail}
                />
                {!viewDetail.isOpened && (
                    <div className="btn">
                        <button onClick={nextMore}>
                            {loading ? 'Loading' : 'load more'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
