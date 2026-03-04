 function toggleLight() {
  const body = document.body;
  body.classList.toggle("light");

  const icon = document.getElementById("themeIcon");
  icon.classList.toggle("bi-brightness-high");
  icon.classList.toggle("bi-moon");

  const logo = document.getElementById("logoImg");
  const move = document.getElementById("move");

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



/*Olhar como colocar isso no codigo, para funcionar em todas as paginas*/
document.addEventListener("DOMContentLoaded", function(){
    const inicio = document.getElementById("inicio");
    const filmes = document.getElementById("filmes"); 
    const series = document.getElementById("series"); 

    inicio.addEventListener("click", function(){
        window.location.href = "../index.html"; 
    });

    filmes.addEventListener("click", function(){
        window.location.href = "../index.html?tipo=filmes"; 
    });

    series.addEventListener("click", function(){
        window.location.href = "../index.html?tipo=series"; 
    });
});

//se chegou até aqui, parabéns, você é um herói por ler todo o código :)
