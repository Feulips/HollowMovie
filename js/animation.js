window.addEventListener("load", function () {
  const loader = document.getElementById("loading2");

  if (loader) {
    loader.style.transition = "opacity 0.2s ease";

    setTimeout(() => {
      loader.style.display = "none";
    }, 800);
  }
});

//se chegou até aqui, parabéns, você é um herói por ler todo o código :)
