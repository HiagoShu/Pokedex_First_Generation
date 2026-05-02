


const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail,speciesDetail){
    const pokemon = new Pokemon()
    //Pegando o nome e o numero do pokemon na pokedex.
    pokemon.name = pokeDetail.name
    pokemon.number = pokeDetail.id

    //Pegando os tipos do pokemon, o primeiro tipo é o tipo principal.
    const types = pokeDetail.types.map((typeSlot)=> typeSlot.type.name)
    const [type] = types
    pokemon.types = types
    pokemon.type = type

    //Pegando a foto do pokemon
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    //Pegaando as habilidades do Pokemon
    pokemon.abilities = pokeDetail.abilities.map((abilitySlot)=>abilitySlot.ability.name)

    //Pegando os base stats do pokemon
    pokemon.stats = pokeDetail.stats.map((statSlot)=>({
        name: statSlot.stat.name,
        value: statSlot.base_stat
    }))

    //Pegando os egggroups do pokemon
    //Os eggGroups vem da rota "species" da API, então precisamos fazer uma requisição a mais para pegar essa informação.
    pokemon.eggGroups = speciesDetail.egg_groups.map((group)=> group.name)

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    //Primeira requisição
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then((pokeDetail)=>{
            //Segunda requisição para pegar os dados da species, necessário para obter os egg groups
            return fetch(pokeDetail.species.url)
                .then((response)=> response.json())
                .then((speciesDetail)=>{
                    //junta os dados das duas requisições e retorna o pokemon completo
                    return convertPokeApiDetailToPokemon(pokeDetail,speciesDetail)
                })
        })
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

