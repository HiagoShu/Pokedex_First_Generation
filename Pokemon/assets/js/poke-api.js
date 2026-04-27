


const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.name = pokeDetail.name
    pokemon.number = pokeDetail.id

    const types = pokeDetail.types.map((typeSlot)=> typeSlot.type.name)
    const [type] = types
    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}
pokeApi.getPokemons = (offset = 0, limit = 12) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url) //Busca a lista de pokemons na url
        .then((response) => response.json()) //Converte a lista para Json
        .then((jsonBody) => jsonBody.results) //Pega a lista de pokemons
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) //Pega o url de cada pokemon e faz uma requisição para pegar os detalhes
        .then((detailRequests) => Promise.all(detailRequests)) //Espera todas as requisições de detalhes terminarem
        .then((pokemonDetails) => pokemonDetails) //Retorna os detalhes dos pokemons
}

