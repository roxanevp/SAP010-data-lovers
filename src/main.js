import {
  //filterPokemonsByType,
  filterPokemonByStr,
  pokemonsOrderByNum,
  pokemonsOrderAZ,
  pokemonsOrderZA,
  pokemonsOrderByAttack,
  pokemonsOrderByDefense,
  calcTypePer,
} from "./data.js";

import data from "./data/pokemon/pokemon.js";

let activePokemon = "001";

const textPokeNum = document.getElementById("text-poke-num");
const textPokeGenerationName = document.getElementById(
  "text-poke-generation-name"
);
const textPokeName = document.getElementById("text-poke-name");
const textPokeRarity = document.getElementById("text-poke-rarity");
const imagePoke = document.getElementById("image-poke");
const textPokeHeight = document.getElementById("text-poke-height");
const textPokeWeight = document.getElementById("text-poke-weight");
const textPokeEgg = document.getElementById("text-poke-egg");
const textPokeAbout = document.getElementById("text-poke-about");
const textPokeFacts = document.getElementById("text-poke-facts");

const inputPokeName = document.getElementById("input-poke-name");
const selectPokeFilter = document.getElementById("select-poke-filter");

inputPokeName.addEventListener("input", (event) => {
  const pokemonsFiltered = filterPokemonByStr(data, event.target.value);

  loadPokemonList(pokemonsFiltered);
});

selectPokeFilter.addEventListener("change", (event) => {
  const select = event.target;
  inputPokeName.value = ""

  if (select.value === "num") {
    loadPokemonList(pokemonsOrderByNum(data));
  } else if (select.value === "asc") {
    loadPokemonList(pokemonsOrderAZ(data));
  } else if (select.value === "desc") {
    loadPokemonList(pokemonsOrderZA(data));
  } else if (select.value === "attack") {
    loadPokemonList(pokemonsOrderByAttack(data));
  } else if (select.value === "defense") {
    loadPokemonList(pokemonsOrderByDefense(data));
  }
});

// Função criada para mudar os elementos da tela de informações.
function loadActivePokemonInfo(pokemon) {
  textPokeNum.innerHTML = "No. " + pokemon.num;
  textPokeGenerationName.innerHTML = firstToUpperCase(pokemon.generation.name);
  textPokeRarity.innerHTML = firstToUpperCase(pokemon["pokemon-rarity"]);
  imagePoke.src = pokemon.img;
  imagePoke.alt = pokemon.name;
  textPokeName.innerHTML = firstToUpperCase(pokemon.name);
  textPokeHeight.innerHTML = pokemon.size.height;
  textPokeWeight.innerHTML = pokemon.size.weight;
  textPokeEgg.innerHTML = firstToUpperCase(pokemon.egg);
  textPokeAbout.innerHTML = pokemon.about;
  if (pokemon.type.length === 1) {
    // Aqui usa a crase para criar a string para usar valor das variaveis na string
    textPokeFacts.innerHTML = `This Pokemon type is ${firstToUpperCase(
      pokemon.type[0]
    )}, which represents ${calcTypePer(
      data,
      pokemon.type[0]
    )} of Kanto and Johto Pokemons.`;
  } else {
    textPokeFacts.innerHTML =
      `This Pokemon types are ${firstToUpperCase(
        pokemon.type[0]
      )} and ${firstToUpperCase(pokemon.type[1])}. ` +
      `The type ${firstToUpperCase(pokemon.type[0])} represents ${calcTypePer(
        data,
        pokemon.type[0]
      )} of Kanto and Johto Pokemons, ` +
      `while the type ${firstToUpperCase(
        pokemon.type[1]
      )} corresponds to ${calcTypePer(
        data,
        pokemon.type[1]
      )} of these generations.`;
  }

  //adicionado estas funcoes para dentro do loadActivePokemonInfo para quando fazer a pesquisa também mudar a cor da pagina
  const type = pokemon.type[0];
  const container = document.querySelector("#container");
  // Limpa o atributo class do container
  container.className = "";
  // Adiciona o class correspondente ao tipo do pokemon que esta sendo mostrado
  container.classList.add("container");
  container.classList.add(type);

  // Salva o numero do pokemon que esta sendo mostrado na tela
  activePokemon = pokemon.num;
}

function firstToUpperCase(str) {
  if (str.length === 0) {
    return "";
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

// criou uma funcao chamada cardClick que é executada quando clica no card, ela recebe como parametro o elemnento do card
const cardClick = (element) => {
  // Recuperando um valor salvo na criação do HTML do item da lista via atributo
  // -> no HTML <elemento data-{nomedavariavel}="valor"\> -> no JS (elemento.dataset.{nomedavariavel} retorna "valor")
  const value = element.dataset.value; //nesta linha eu pego o numero do pokemon clicado do elemento
  const pokemon = filterPokemonByStr(data, value)[0]; // nesta linha eu busco nos dados o pokemon que tenha esse numero

  const activeElement = document.querySelector("#pokemon-" + activePokemon); //pega qual o elemento ativo anterior
  activeElement.className = "list-item"; //remove todas as classes do elemento menos o item list
  element.classList.add("active"); // adiciona a classe active no elemento clicado

  loadActivePokemonInfo(pokemon); //nesta linha eu troco as informacoes da tela

  // Mostrar as informações nas telas menores
  // a classe active no CSS define a visibilidade desses elementos
  const overlay = document.querySelector(".overlay");
  overlay.classList.add("active");

  const info = document.querySelector(".info");
  info.classList.add("active");
};

// Remover os active do .info e .overlay responsaveis por mostrar informações do pokemon nas telas menores
const closeButtom = document.querySelector(".close-buttom");
closeButtom.onclick = function () {
  const overlay = document.querySelector(".overlay");
  overlay.classList.remove("active");

  const info = document.querySelector(".info");
  info.classList.remove("active");
};

window.cardClick = cardClick;

// Função que recebe um pokemon e a posição dele no array e retorna um elemento HTML para cada pokemon
const renderItem = (props, index) => {
  // Cria uma variavel para cada atributo do pokemon que vai ser usado para criar o HTML
  const { num, name, img, type: types } = props;

  // Retorna um elemento HTML para cada pokemon do array que vai ser usado na lista de pokemons
  return `
  <div class="list-item ${index===0 ? 'active' : ''}" onclick="cardClick(this)" data-value="${num}" id="pokemon-${num}">
    <div class="item-picture">
      <img src="${img}" alt="${name}">
    </div>
    <div class="item-info">
      <div class="item-title">
        <p>No. ${num} - ${name}</p>
      </div>
      <div class="item-types">
        ${types.map((type) => (`<div class="item-type ${type}">
            <p>${type}</p>
          </div>`)).join('')}
      </div>
    </div>
  </div>
  `;
}

// Recebe um array de objetos pokemon e "redesenha" a lista e a tela de informações
const loadPokemonList = (pokemons) => {

  // Mapeia um array de pokemons e cria a lista e um item da lista para cada pokemon
  // map: é uma função do array que recebe uma função e aplica essa função em cada elemento do array e retorna um array com os resultados
  // a função que é pasada para o map tem que ter 1 ou 2 paramentros, onde o 1 vai ser o elemento e o 2 a posição
  // join: é uma função do array que junta todos os elementos do array em uma string e recebe uma string que vai ser usada para separar cada elemento
  const elements = pokemons.map(renderItem).join("\n");
  // Pega o elemento div que vai ter a lista de pokemons
  const list = document.querySelector("#list-items");
  // Adiciona todos os resultados da aplicação do renderItem em cada elemento e adiciona na list
  list.innerHTML = elements;
  // Agora carrega as informações do primeiro pokemon da lista na tela de informações
  loadActivePokemonInfo(pokemons[0]);
};

// Quando a tela é carregada, chama a função loadPokemonList
window.onload = loadPokemonList(data.pokemon);
