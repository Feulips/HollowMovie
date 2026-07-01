    window.addEventListener("load", function () {
  const loader = document.getElementById("loading2");

  if (loader) {
    loader.style.transition = "opacity 0.2s ease";

    setTimeout(() => {
      loader.style.display = "none";
    }, 800);
  }
});
'   '

async function requisicaoURL(url) {
  try {
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
//se chegou até aqui, parabéns, você é um herói por ler todo o código :)
