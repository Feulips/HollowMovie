const campoPesquisa = document.getElementById("campoPesquisa");
const botaoPesquisa = document.getElementById("botaoPesquisa");
const filmesGrid = document.getElementById("filmesGrid");
const inicio = document.getElementById("inicio");
const series = document.getElementById("series");
const filmes = document.getElementById("filmes");
const params = new URLSearchParams(window.location.search);
const tipo = params.get("tipo");

// nomes dos gêneros por id, usados pra mostrar nos cards (preenchido em carregarMapaGeneros)
let generosMovie = {};
let generosTV = {};

let paginaAtual = 1;
// guarda a última URL "base" (sem page) pra paginação respeitar busca/filtro atual
let ultimaURLBase = `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=pt-BR`;

async function requisicaoURL(url, resetPagina = true) {
  try {
    if (resetPagina) {
      paginaAtual = 1;
      ultimaURLBase = url;
    }

    filmesGrid.classList.add("fade-out");

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erro na requisição");
    }
    const data = await response.json();

    setTimeout(() => {
      renderizarMidia(data.results);

      filmesGrid.classList.remove("fade-out");
      filmesGrid.classList.add("fade-in");

      setTimeout(() => {
        filmesGrid.classList.remove("fade-in");
      }, 500);
    }, 500);

  } catch (error) {
    console.error("Erro:", error);
    filmesGrid.innerHTML = "<p>Ocorreu um erro ao carregar os filmes.</p>";
  }
}

function pesquisaGeral() {
    const informacao = campoPesquisa.value.trim();
    if (informacao == "") {
        carregarTendenciasGeral();
        return;
    }
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(informacao)}&language=pt-BR`;
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
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");

        const media_type = filme.title ? "movie" : "tv";
        const titulo = filme.title || filme.name;
        const imagem = filme.poster_path ? IMAGE_URL + filme.poster_path : "";
        const nota = filme.vote_average ? filme.vote_average.toFixed(1) : "N/A";
        const ano = (filme.release_date || filme.first_air_date || "").slice(0, 4);
        const mapaGeneros = media_type === "movie" ? generosMovie : generosTV;
        const nomesGeneros = (filme.genre_ids || [])
            .map(id => mapaGeneros[id])
            .filter(Boolean)
            .slice(0, 2)
            .join(", ");
        const meta = [nomesGeneros, ano].filter(Boolean).join(" • ");

        card.setAttribute("aria-label", titulo);
        card.innerHTML = `
            <img src="${imagem}" alt="${titulo}" loading="lazy">
            <span class="badge-nota">★ ${nota}</span>
            <div class="card-scrim">
                <h3>${titulo}</h3>
                ${meta ? `<p class="card-meta">${meta}</p>` : ""}
            </div>
        `;

        const irParaDetalhes = () => {
            window.location.href = `pages/details.html?id=${filme.id}&type=${media_type}`;
        };
        card.addEventListener("click", irParaDetalhes);
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                irParaDetalhes();
            }
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

document.addEventListener("DOMContentLoaded", () => {
    carregarMapaGeneros();
    if (tipo === "filmes") {
        buscaFilme();
    } else if (tipo === "series") {
        buscaSerie();
    } else {
        carregarTendenciasGeral();
    }
});

document.getElementById("filtroPais").addEventListener("change", filtrarPorPais);
document.getElementById("filtroNota").addEventListener("change", filtrarPorNota);
carregarGeneros();
document.getElementById("filtroGenero").addEventListener("change", filtrarPorGenero);
carregarAnos();
document.getElementById("filtroAno").addEventListener("change", filtrarPorAno);
inicio.addEventListener("click", carregarTendenciasGeral);
filmes.addEventListener("click", buscaFilme);
series.addEventListener("click", buscaSerie);

const botaoVoltar = document.getElementById("botaoVoltar");
const botaoProximo = document.getElementById("botaoProximo");

function construirURLComPagina(baseUrl, pagina) {
    const url = new URL(baseUrl);
    url.searchParams.set("page", pagina);
    return url.toString();
}

function pularPagina() {
    paginaAtual++;
    requisicaoURL(construirURLComPagina(ultimaURLBase, paginaAtual), false);
}

function voltarPagina() {
    if (paginaAtual > 1) {
        paginaAtual--;
    }
    requisicaoURL(construirURLComPagina(ultimaURLBase, paginaAtual), false);
}

// preenche o mapa {id: nome} usado pra exibir os gêneros nos cards (filmes e séries)
async function carregarMapaGeneros() {
    try {
        const [resMovie, resTV] = await Promise.all([
            fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`),
            fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=pt-BR`)
        ]);
        const dataMovie = await resMovie.json();
        const dataTV = await resTV.json();
        dataMovie.genres.forEach(g => generosMovie[g.id] = g.name);
        dataTV.genres.forEach(g => generosTV[g.id] = g.name);
    } catch (error) {
        console.error("Erro ao carregar gêneros:", error);
    }
}

// popula o <select> de filtro de gênero (padrão: filmes)
async function carregarGeneros(tipoMidia = "movie") {
    const response = await fetch(
        `${BASE_URL}/genre/${tipoMidia}/list?api_key=${API_KEY}&language=pt-BR`
    );
    const data = await response.json();
    const select = document.getElementById("filtroGenero");
    select.innerHTML = `<option value="">Todos os Gêneros</option>`;
    data.genres.forEach(genero => {
        const option = document.createElement("option");
        option.value = genero.id;
        option.textContent = genero.name;
        select.appendChild(option);
    });
}

function filtrarPorGenero() {
    const generoId = document.getElementById("filtroGenero").value;
    if (!generoId) {
        carregarTendenciasGeral();
        return;
    }
    let endpoint = "movie";
    if (tipo === "series") {
        endpoint = "tv";
    }
    const url = `${BASE_URL}/discover/${endpoint}?api_key=${API_KEY}&with_genres=${generoId}&language=pt-BR`;
    requisicaoURL(url);
}

function carregarAnos() {
    const selectAno = document.getElementById("filtroAno");
    const anoAtual = new Date().getFullYear();
    for (let ano = anoAtual; ano >= 1950; ano--) {
        const option = document.createElement("option");
        option.value = ano;
        option.textContent = ano;
        selectAno.appendChild(option);
    }
}

function filtrarPorAno() {
    const ano = document.getElementById("filtroAno").value;
    if (!ano) {
        carregarTendenciasGeral();
        return;
    }
    let endpoint = "movie";
    if (tipo === "series") {
        endpoint = "tv";
    }
    const url = `${BASE_URL}/discover/${endpoint}?api_key=${API_KEY}&language=pt-BR&primary_release_year=${ano}`;
    requisicaoURL(url);
}

function filtrarPorNota() {
    const nota = document.getElementById("filtroNota").value;
    if (!nota) {
        carregarTendenciasGeral();
        return;
    }
    let endpoint = "movie";
    if (tipo === "series") {
        endpoint = "tv";
    }
    const url = `${BASE_URL}/discover/${endpoint}?api_key=${API_KEY}&language=pt-BR&vote_average.gte=${nota}`;
    requisicaoURL(url);
}

function filtrarPorPais() {
    const pais = document.getElementById("filtroPais").value;
    if (!pais) {
        carregarTendenciasGeral();
        return;
    }
    let endpoint = "movie";
    if (tipo === "series") {
        endpoint = "tv";
    }
    const url = `${BASE_URL}/discover/${endpoint}?api_key=${API_KEY}&language=pt-BR&with_origin_country=${pais}`;
    requisicaoURL(url);
}

//se chegou até aqui, parabéns, você é um herói por ler todo o código :)
