window.addEventListener("load", function() {
    const loading = this.document.getElementById("loading");
    
    setTimeout (() => { 
        loading.style.opacity = "0";

        setTimeout(() => {
            loading.style.display = "none";
            loading.style.opacity = "1";
            document.body.style.overflow = "auto";}, 1000);
        }
    , 2000);   
    });




    window.addEventListener("load", function() {
    const loading = document.getElementById("loading2");
    
    setTimeout (() => { 
        loading.style.opacity = "0";

        setTimeout(() => {
            loading.style.display = "none";
            loading.style.opacity = "1";
            document.body.style.overflow = "auto";}, 3000);
        }
    , 4000);   
    });

    async function requisicaoURL(url) {
        try{
            filmesGrid.classList.add("fade-out");
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Erro na requisição");
            }
    const data = await response.json();
    setTimeout(() => {
        renderizarMidia(data.results);
        filmesGrid.classList.remove("fade-out");
        filmesGrid.classList.add("fade-out");
        setTimeout(()=>{
            filmesGrid.classList.remove("fade-in");
            }, 300);
        }, 200);
    } catch (error) {
        console.error("Erro:", error);
        filmesGrid.innerHTML = "<p>Ocorreu um erro ao carregar os filmes.</p>";
    }

    }
