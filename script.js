let musica = new Audio("musicauno/fondo.mp3");
musica.loop = true;

function iniciarMusica() {
  musica.play();
}

function toggleMusica() {
  if (musica.paused) {
    musica.play();
  } else {
    musica.pause();
  }
}

function toggleCapitulos() {
  const submenu = document.getElementById("capitulos");
  submenu.classList.toggle("show");
}

function mostrarCreditos() {
  const creditos = document.getElementById("creditos");
  creditos.style.display = creditos.style.display === "block" ? "none" : "block";
}
