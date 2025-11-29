// Clase para manejar el fondo
class Fondo {
  constructor(contenedorId) {
    this.contenedor = document.getElementById(contenedorId);
  }

  cambiarFondo(imagen, duracion = 1000) {
    // transición con fade
    this.contenedor.style.transition = `opacity ${duracion}ms ease`;
    this.contenedor.style.opacity = 0;

    setTimeout(() => {
      this.contenedor.style.backgroundImage = `url(${imagen})`;
      this.contenedor.style.opacity = 1;
    }, duracion);
  }
}

// Clase para un bocadillo de diálogo
class Bocadillo {
  constructor(contenedorId, posicion = "izquierda") {
    this.contenedor = document.getElementById(contenedorId);
    this.posicion = posicion;
  }

  mostrarDialogo(texto, imagen) {
    this.contenedor.innerHTML = `
      <div class="bocadillo ${this.posicion}">
        <img src="${imagen}" class="avatar">
        <p>${texto}</p>
      </div>
    `;
    this.contenedor.style.display = "block";
  }

  ocultar() {
    this.contenedor.style.display = "none";
  }
}
