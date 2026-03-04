const API_KEY = "a3fda9b9d1d0aaee95df37313c16684e";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const detailsContainer = document.getElementById("detailsContainer");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");

async function carregarDetalhes() {
    if (!id || !type) { detailsContainer.innerHTML ="<p>Conteudo invalido.</p>"; return; 

    } try {
        const response = await fetch ( `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=pt-br`
         );
         if (!response.ok) {
            throw new Error("Erro na API");
        }
        const data = await response.json();
        renderizarDetalhes(data);
    } catch (error) {
        detailsContainer.innerHTML = "<p>Ocorreu um erro ao carregar os detalhes.</p>";
        console.error(error);
    }
}

async function renderizarDetalhes(item) {
    const trailerURL = await buscarTrailer();
    const imagem = item.poster_path ? IMAGE_URL + item.poster_path : "";

 const imagemHTML = trailerURL
    ? `<a href="${trailerURL}" target="_blank"><img src="${imagem}" alt="${item.title}"></a>`: `<img src="${imagem}" alt="${item.title}">`;

    const titulo = item.title || item.name;
    const dataLancamento = item.release_date || item.first_air_date; 
    document.title = titulo;
    const porcentagemNota = Math.round((item.vote_average / 10) * 100);
    detailsContainer.innerHTML = `<div class="detalhe-card"> <img src="${imagem}" alt="${titulo}">
            <div class="info"> <h2>${titulo}</h2> 
            <p>Data: ${dataLancamento || "Não disponível"}</p>
                <div class="avaliacao-frame">
                    <label>Nota:</label>
                    <div class="barra-avaliacao">
                        <div class="barra-preenchida" style="width: ${porcentagemNota}%;"></div>
                    </div>
                    <span>${porcentagemNota}%</span>
                </div>
            ${item.tagline}<br>
            ${item.overview}</p>
        </div>
    </div>`;
    buscarTrailer();
}


async function buscarTrailer() {
    try {
        const response = await fetch(
            `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=pt-BR`
        );
        const data = await response.json();
        const trailer = data.results.find(video =>
            video.type === "Trailer" && video.site === "YouTube"
        );
        const trailerContainer = document.getElementById("trailer-container");
        if (!trailer) {
            trailerContainer.innerHTML = "<p>Trailer não disponível.</p>";
            return;
        }
        trailerContainer.innerHTML = `
            <h3>Trailer</h3>
            <div class="iframe-tela">
                <iframe
                    src="https://www.youtube.com/embed/${trailer.key}"
                    allowfullscreen
                    frameborder="0">
                </iframe>
            </div>
        `;
    } catch (error) {
        console.error("Erro ao buscar trailer:", error);
    }
} 

document.addEventListener("DOMContentLoaded", carregarDetalhes);

//se chegou até aqui, parabéns, você é um herói por ler todo o código :)