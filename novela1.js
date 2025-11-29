class Fondo {
  constructor(contenedorId) {
    this.contenedor = document.getElementById(contenedorId);
  }

  cambiarFondo(imagen, duracion = 600) {
    this.contenedor.style.transition = `opacity ${duracion}ms ease`;
    this.contenedor.style.opacity = 0;
    this.contenedor.style.backgroundImage = `url(${imagen})`;
    requestAnimationFrame(() => {
      this.contenedor.style.opacity = 1;
    });
  }
}

class Musica {
  constructor() {
    this.audio = null;
  }

  cambiarMusica(ruta) {
    if (this.audio) this.audio.pause();
    this.audio = new Audio(ruta);
    this.audio.loop = true;
    this.audio.play().catch(() => {});
  }
}

class Bocadillo {
  constructor(contenedorId, posicion = "izquierda") {
    this.contenedor = document.getElementById(contenedorId);
    this.posicion = posicion;
  }

  mostrarDialogo(texto, imagen) {
    this.contenedor.innerHTML = `
      <div class="bocadillo ${this.posicion}">
        <div class="bocadillo-header">
          <img src="${imagen}" class="avatar" alt="">
        </div>
        <div class="bocadillo-texto">${texto}</div>
      </div>
    `;
    this.contenedor.style.display = "block";
  }

  ocultar() {
    this.contenedor.style.display = "none";
  }
}

class Escena {
  constructor(fondo, musica) {
    this.fondo = fondo;
    this.musica = musica;
    this.dialogos = [];
    this.indice = 0;
    this.puedeAvanzar = false;
  }

  agregarDialogo(texto, imagen, posicion = "izquierda", fondo = null, musica = null) {
    this.dialogos.push({ texto, imagen, posicion, fondo, musica });
  }

  iniciar() {
    this.mostrarDialogoActual();
    setTimeout(() => { this.puedeAvanzar = true; }, 2000);
  }

  avanzar() {
    if (!this.puedeAvanzar) return;
    this.indice++;
    if (this.indice < this.dialogos.length) {
      this.mostrarDialogoActual();
      this.puedeAvanzar = false;
      setTimeout(() => { this.puedeAvanzar = true; }, 2000);
    }
  }

  mostrarDialogoActual() {
    const d = this.dialogos[this.indice];
    if (d.fondo) this.fondo.cambiarFondo(d.fondo);
    if (d.musica) this.musica.cambiarMusica(d.musica);
    const bocadillo = new Bocadillo("dialogo", d.posicion);
    bocadillo.mostrarDialogo(d.texto, d.imagen);
  }
}

window.addEventListener("load", () => {
  const fondo = new Fondo("fondo");
  const musica = new Musica();
  const escena = new Escena(fondo, musica);

  escena.agregarDialogo("Hola, soy el protagonista.", "img/ninjach.png", "izquierda", "img/ninjafondo.jpg", "img/musicauno/fondo.mp3");
  escena.agregarDialogo("Ninja feo", "img/momo.png", "derecha");
  escena.agregarDialogo(":(", "img/ninjach.png", "izquierda", "img/momo.png", "img/musicauno/accion.mp3");

  const startScreen = document.getElementById("startScreen");
  startScreen.addEventListener("click", () => {
    startScreen.style.display = "none";
    escena.iniciar();
  }, { once: true });

  document.addEventListener("click", () => {
    escena.avanzar();
  });
});
