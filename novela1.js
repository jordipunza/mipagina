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
    this.muted = false; // estado persistente
  }

  cambiarMusica(ruta) {
    if (this.audio) this.audio.pause();
    this.audio = new Audio(ruta);
    this.audio.loop = true;
    this.audio.muted = this.muted; // aplica el estado mute actual
    this.audio.play().catch(() => {});
  }

  setMute(valor) {
    this.muted = valor;
    if (this.audio) {
      this.audio.muted = valor;
    }
  }
}

class Sonido {
  constructor() {
    this.efecto = null; // referencia al último sonido
  }

  reproducir(ruta) {
    // Si ya hay un sonido en reproducción, lo detenemos
    if (this.efecto) {
      this.efecto.pause();
      this.efecto.currentTime = 0;
    }

    // Creamos el nuevo sonido
    this.efecto = new Audio(ruta);
    this.efecto.play().catch(() => {});
  }
}

class Bocadillo {
  constructor(contenedorId, posicion = "izquierda", getSkipMode = () => false) {
    this.contenedor = document.getElementById(contenedorId);
    this.posicion = posicion;
    this.getSkipMode = getSkipMode;
    this.finished = false;
  }

  mostrarDialogo(texto, imagen, nombre = "", fuente = "inherit", onFinishedWriting) {
    this.contenedor.innerHTML = `
      <div class="dialogo-contenedor ${this.posicion}">
        <img src="${imagen}" class="personaje" alt="">
        <div class="bocadillo">
          ${nombre ? `<div class="nombre">${nombre}</div>` : ""}
          <div class="bocadillo-texto" style="font-family:${fuente};"></div>
        </div>
      </div>
    `;
    this.contenedor.style.display = "block";

    const textoElem = this.contenedor.querySelector(".bocadillo-texto");

    let index = 0;
    const baseSpeed = 50;   // velocidad normal
    const fastSpeed = 20;   // velocidad rápida (no tan instantánea)

    const escribir = () => {
      if (index < texto.length) {
        textoElem.textContent += texto.charAt(index);
        index++;
        const delay = this.getSkipMode() ? fastSpeed : baseSpeed;
        setTimeout(escribir, delay);
      } else {
        this.finished = true;
        if (onFinishedWriting) onFinishedWriting();
      }
    };

    escribir();
  }

  ocultar() {
    this.contenedor.style.display = "none";
  }
}

class Escena {
  constructor(fondo, musica, sonido) {
    this.fondo = fondo;
    this.musica = musica;
    this.sonido = sonido;
    this.dialogos = [];
    this.indice = 0;
    this.skipMode = false;
    this.currentBocadillo = null;
  }

  agregarDialogo(texto, imagen, posicion = "izquierda", fondo = null, musica = null, sonido = null, nombre = "", fuente = "inherit") {
    this.dialogos.push({ texto, imagen, posicion, fondo, musica, sonido, nombre, fuente });
  }

  iniciar() {
    this.indice = 0; // reinicia siempre al inicio
    this.mostrarDialogoActual();
  }

  avanzar() {
    // Solo avanza si no está en el último diálogo
    if (this.indice < this.dialogos.length - 1) {
      this.indice++;
      this.mostrarDialogoActual();
    }
    this.actualizarPrevBtn();
  }

  retroceder() {
    if (this.indice > 0) {
      this.indice--;
      this.mostrarDialogoActual();
    }
    this.actualizarPrevBtn();
  }

  mostrarDialogoActual() {
    const d = this.dialogos[this.indice];
    if (d.fondo) this.fondo.cambiarFondo(d.fondo);
    if (d.musica) this.musica.cambiarMusica(d.musica);
    if (d.sonido) this.sonido.reproducir(d.sonido);

    this.currentBocadillo = new Bocadillo("dialogo", d.posicion, () => this.skipMode);
    this.currentBocadillo.mostrarDialogo(d.texto, d.imagen, d.nombre, d.fuente, () => {
      // si skip está activo, espera un poco antes de avanzar automáticamente
      if (this.skipMode) {
        setTimeout(() => {
          this.avanzar();
        }, 1200); // 1.2 segundos de margen para leer
      }
    });
  }

  actualizarPrevBtn() {
    const prevBtn = document.getElementById("prevBtn");
    if (!prevBtn) return;
    // deshabilitado si skip activo o si está en el primer diálogo
    prevBtn.disabled = this.skipMode || this.indice === 0;
  }
}

window.addEventListener("load", () => {
  const fondo = new Fondo("fondo");
  const musica = new Musica();
  const sonido = new Sonido();
  const escena = new Escena(fondo, musica, sonido);

  // Botón Skip fijo
  const skipBtn = document.getElementById("skipBtn");
  skipBtn.addEventListener("click", () => {
    escena.skipMode = !escena.skipMode;
    skipBtn.classList.toggle("active", escena.skipMode);
    skipBtn.textContent = escena.skipMode ? "Skip ON" : "Skip OFF";

    // Si activas Skip y el texto actual ya terminó, avanza inmediatamente
    const b = escena.currentBocadillo;
    if (escena.skipMode && b && b.finished) {
      escena.avanzar();
    }
    escena.actualizarPrevBtn();
  });

  // Botón Anterior fijo
  const prevBtn = document.getElementById("prevBtn");
  prevBtn.addEventListener("click", () => {
    if (!escena.skipMode) {
      escena.retroceder();
    }
  });

  // Botón Menú arriba izquierda
  const menuBtn = document.getElementById("menuBtn");
  menuBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // Botón Mute arriba izquierda
  const muteBtn = document.getElementById("muteBtn");
  muteBtn.addEventListener("click", () => {
    if (escena.musica.muted) {
      escena.musica.setMute(false);
      muteBtn.textContent = "🔊 Música";
    } else {
      escena.musica.setMute(true);
      muteBtn.textContent = "🔇 Música";
    }
  });

  // Pantalla de inicio independiente
  const startScreen = document.getElementById("startScreen");
  startScreen.addEventListener("click", () => {
    startScreen.style.display = "none";
    escena.iniciar();
    escena.actualizarPrevBtn();
  }, { once: true });

  // Avance manual independiente del skip
  document.addEventListener("click", (ev) => {
    if (ev.target && (ev.target.id === "skipBtn" || ev.target.id === "prevBtn" || ev.target.id === "menuBtn" || ev.target.id === "muteBtn")) return;
    if (ev.target && ev.target.id === "startScreen") return;

    const b = escena.currentBocadillo;
    if (b && b.finished && !escena.skipMode) {
      escena.avanzar();
    }
  });

  // Ejemplos de diálogos
  escena.agregarDialogo(
    "Hola, soy el protagonista.",   // texto
    "img/ninjach.png",              // sprite del personaje
    "izquierda",                    // posición del bocadillo
    "img/ninjafondo.jpg",           // fondo (cambia aquí)
    "img/musicauno/fondo.mp3",      // música (cambia aquí)
    null,                           // sonido puntual (ninguno en este caso)
    "Ninjamejor",                   // nombre del personaje
    "Georgia"                       // fuente del texto
  );

  escena.agregarDialogo(
    "Ninja feo",                    // texto
    "img/momo.png",                 // sprite del personaje
    "derecha",                      // posición del bocadillo
    null,                           // fondo (no cambia)
    null,                           // música (no cambia)
    null,                           // sonido puntual (ninguno)
    "Momo",                         // nombre del personaje
    "Courier New"                   // fuente del texto
  );

escena.agregarDialogo(
  ":(", // texto
  "img/ninjach.png",              // sprite del personaje
  "izquierda",                    // posición del bocadillo
  "img/momo.png",                           // fondo (no cambia)
  "img/musicauno/accion.mp3",                           // música (no cambia)
  "img/sonidos/meretiro.mp3",                           // sonido puntual (ninguno)
  "Ninjamejor",                   // nombre largo
  "Comic Sans MS"                 // fuente del texto
);

});
