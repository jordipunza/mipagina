let musica = new Audio("musicauno/musica.mp3");
musica.loop = true;
musica.play();

function toggleCapitulos() {
  const submenu = document.getElementById("capitulos");
  submenu.style.display = submenu.style.display === "flex" ? "none" : "flex";
}

function toggleMusica() {
  if (musica.paused) {
    musica.play();
  } else {
    musica.pause();
  }
}

function mostrarCreditos() {
  const creditos = document.getElementById("creditos");
  creditos.style.display = creditos.style.display === "block" ? "none" : "block";
}
