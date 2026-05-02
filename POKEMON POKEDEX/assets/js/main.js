const pokemonList = document.getElementById('PokemonList')
const loadmoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 5
let offset = 0;




//Lista de pokemons
function loadPokemonItens(offset, limit) {

    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {

        const newHtml = pokemons.map((pokemon) => `

            <li class="pokemon ${pokemon.type}">

                <span class="number">
                    ${pokemon.number}
                </span>

                <span class="name">
                    ${pokemon.name}
                </span>

                <div class="detail">

                    <ol class="types">

                        ${pokemon.types.map((type) =>
                            `<li class="type ${type}">
                                ${type}
                            </li>`
                        ).join('')}

                    </ol>

                    <img
                        src="${pokemon.photo}"
                        alt="${pokemon.name}"
                    >

                </div>

                <!-- BOTÃO -->
                <button
                    class="details-button"
                    onclick="openPokemonModal(${pokemon.number})"
                >
                    Ver detalhes
                </button>

            </li>

        `).join('')

        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadmoreButton.addEventListener('click', () => {
    offset += limit

    const qtdRecordNexPage = offset + limit
    if(qtdRecordNexPage >= maxRecords){
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadmoreButton.parentElement.removeChild(loadmoreButton)
    }
    else{
        loadPokemonItens(offset, limit)
    }

    
})

//Função para abrir o modal de detalhes do pokemon
function openPokemonModal(pokemonNumber){
    pokeApi.getPokemons(0, maxRecords).then((pokemons)=>{

        //Encontra o pokemon clicado
        const pokemon = pokemons.find((poke)=> poke.number === pokemonNumber)

        //ELEMENTOS DO MODAL
        const modal = document.getElementById('pokemonModal')
        const modalPokemonName = document.getElementById('modalPokemonName')
        const modalBody = document.getElementById('modalBody')

        //Define o nome no título
        modalPokemonName.innerHTML = `${pokemon.number} - ${pokemon.name}`

        //Define o conteúdo do modal
        modalBody.innerHTML = `
            <img
                class="modal-image"
                src="${pokemon.photo}"
                alt="${pokemon.name}"
            >

            <h3>Habilidades</h3>
            <ul>
                ${pokemon.abilities.map((ability)=>
                    `<li>${ability}</li>`).join('')}
            </ul>
            <h3>Egg Groups</h3>
            <ul>
                ${pokemon.eggGroups.map((group)=>
                    `<li>${group}</li>`).join('')}
            </ul>
            <h3>Base Stats</h3>
            <ul>
                ${pokemon.stats.map((stat)=>
                    `<li>${stat.name}: ${stat.value}</li>`).join('')}
            </ul>
        `
        //Exibe o modal
        modal.style.display = 'flex'
    })
}


//Função para fechar o modal
function closePokemonModal(){
    const modal = document.getElementById('pokemonModal')
    modal.style.display = 'none'
}