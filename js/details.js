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

function renderizarDetalhes(item) {
    const imagem = item.poster_path ? IMAGE_URL + item.poster_path : "";

    const titulo = item.title || item.name;
    const dataLancamento = item.release_date || item.first_air_date; 
    document.title = titulo;
    detailsContainer.innerHTML = `<div class="detalhe-card"> <img src="${imagem}" alt="${titulo}">
            <div class="info"> <h2>${titulo}</h2> <p>Data: ${dataLancamento} || "Não disponivel"}<br></p>
            <p>Nota: ${item.vote_average}<br>
            ${item.tagline}<br>
            ${item.overview}</p>
        </div>
    </div>`;
}

document.addEventListener("DOMContentLoaded", carregarDetalhes);




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
