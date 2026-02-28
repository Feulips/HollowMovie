const API_KEY = "a3fda9b9d1d0aaee95df37313c16684e";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const campoPesquisa = document.getElementById("campoPesquisa");
const botaoPesquisa = document.getElementById("botaoPesquisa");
const filmesGrid = document.getElementById("filmesGrid");
const inicio = document.getElementById("inicio");
const series = document.getElementById("series");
const filmes = document.getElementById("filmes");



async function requisicaoURL(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erro na requisição");
    }

    const data = await response.json();
    renderizarMidia(data.results);

  } catch (error) { 
    console.error("Erro:", error);
    filmesGrid.innerHTML = "<p>Ocorreu um erro ao carregar os filmes.</p>";
  }
}

function pesquisaGeral () {
    const informacao = campoPesquisa.value.trim();
    if (informacao == "") {
        carregarTendenciasGeral();
        return;
    }
    console.log("Pesquisando por", informacao);
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(informacao)}&linguagem=pt-br`;
    requisicaoURL(url);
    campoPesquisa.value = "";
}
function renderizarMidia(filmes) {
    filmesGrid.innerHTML = "";
    if (!filmes || filmes.length === 0) {
        filmesGrid.innerHTML = "<p>Nenhum filme encontrado.</p>";
        return;
    }
    filmes.forEach(filme => {
        const card = document.createElement("div");
        card.classList.add("card");
        const imagem = filme.poster_path ? IMAGE_URL + filme.poster_path : "";
        if (filme.title){card.innerHTML = `
            <img src="${imagem}" alt="${filme.title}">
            <h3>${filme.title}</h3>
            <p>${filme.vote_average} ${filme.overview} ${filme.genre_ids} ${filme.release_date}</p>
        `;}
        else {
            card.innerHTML = `
            <img src="${imagem}" alt="${filme.name}">
            <h3>${filme.name}</h3>
            <p>${filme.vote_average} ${filme.overview} ${filme.genre_ids} ${filme.release_date}</p>
        `;
        }
        card.addEventListener("click", () => { 
            window.location.href = `pages/details.html?id=${filme.id}&type=${filme.media_type}`;
     });
        filmesGrid.appendChild(card);
    });
}

function carregarTendenciasGeral() { 
    const url = `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=pt-BR`; 
    requisicaoURL(url); 
}

function buscaFilme() { 
    const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=pt-BR`;     
    requisicaoURL(url); 
}

function buscaSerie() { 
    const url = `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=pt-BR`; 
    requisicaoURL(url); 
}


botaoPesquisa.addEventListener("click", pesquisaGeral);
campoPesquisa.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        pesquisaGeral();
    }
});

document.addEventListener("DOMContentLoaded", carregarTendenciasGeral);
inicio.addEventListener("click", carregarTendenciasGeral);
filmes.addEventListener("click", buscaFilme);
series.addEventListener("click", buscaSerie);






//salva o thema :p
  function toggleLight() {
  const body = document.body;
  body.classList.toggle("light");

  const icon = document.getElementById("themeIcon");
  icon.classList.toggle("bi-brightness-high");
  icon.classList.toggle("bi-moon");

  const logo = document.getElementById("logoImg");

  if (body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
    logo.src = "../assets/icons/icon2.png";
  } else {
    localStorage.setItem("theme", "dark"); 
    logo.src = "../assets/icons/icon.png";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const logo = document.getElementById("logoImg");
  const icon = document.getElementById("themeIcon");

  if (savedTheme === "light") {
    document.body.classList.add("light");
    logo.src = "../assets/icons/icon2.png";
    icon.classList.remove("bi-moon");
    icon.classList.add("bi-brightness-high");
  }
});