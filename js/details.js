const detailsContainer = document.getElementById("detailsContainer");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");

function esconderLoader() {
    const loader = document.getElementById("loading2");
    if (loader) loader.style.display = "none";
}

async function carregarDetalhes() {
    if (!id || !type) {
        detailsContainer.innerHTML = "<p>Conteudo invalido.</p>";
        esconderLoader();
        return;
    }
    try {
        const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=pt-br`);
        if (!response.ok) {
            throw new Error("Erro na API");
        }
        const data = await response.json();
        await renderizarDetalhes(data);
    } catch (error) {
        detailsContainer.innerHTML = "<p>Ocorreu um erro ao carregar os detalhes.</p>";
        console.error(error);
    } finally {
        esconderLoader();
    }
}

async function renderizarDetalhes(item) {
    const trailerURL = await buscarTrailer();
    const imagem = item.poster_path ? IMAGE_URL + item.poster_path : "";
    const titulo = item.title || item.name;
    const dataLancamento = item.release_date || item.first_air_date;
    document.title = titulo;
    const notaFormatada = item.vote_average ? item.vote_average.toFixed(1) : "N/A";
    const porcentagemNota = Math.round((item.vote_average / 10) * 100);

    const imagemInterna = `<img src="${imagem}" alt="${titulo}">`;
    const posterHTML = trailerURL
        ? `<a href="${trailerURL}" target="_blank" rel="noopener">${imagemInterna}</a>`
        : imagemInterna;

    detailsContainer.innerHTML = `<div class="detalhe-card">
            <div class="detalhe-poster">
                ${posterHTML}
                <span class="badge-nota">★ ${notaFormatada}</span>
            </div>
            <div class="info">
                <h2>${titulo}</h2>
                ${item.tagline ? `<p class="tagline">"${item.tagline}"</p>` : ""}
                <p class="meta-linha">${dataLancamento || "Data não disponível"}</p>
                <div class="avaliacao-frame">
                    <label>Nota</label>
                    <div class="barra-avaliacao">
                        <div class="barra-preenchida" style="width: ${porcentagemNota}%;"></div>
                    </div>
                    <span>${porcentagemNota}%</span>
                </div>
                <p class="sinopse">${item.overview || "Sinopse não disponível."}</p>
            </div>
        </div>`;
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