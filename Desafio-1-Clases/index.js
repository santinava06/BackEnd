/* Desafio 1 -- Clases*/

class Usuario {
  constructor(nombre, apellido, libros, mascotas) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.libros = libros;
    this.mascotas = mascotas;
  }
  getFullName() {
    return `${this.nombre} ${this.apellido}`;
  }
  addMascota(mascota) {
    return this.mascotas.push(mascota);
  }
  countMascotas() {
    return this.mascotas.length;
  }
  addBook(nombreLibro, nombreAutor) {
    return this.libros.push({ nombre: nombreLibro, autor: nombreAutor });
  }
  getBookNames() {
    let nombresLibros = [];
    for (let libro of this.libros) {
      nombresLibros.push(libro.nombre);
    }
    return nombresLibros;
  }
}

const santi = new Usuario("Santiago","Navarro",[{ nombre: "Harry Potter", autor: "J.K. Rowling" }],["Luna", "Flopi", "Momi"]);
console.log(santi.getFullName());
santi.addBook("Cementerio de animales", "Stephen King");
console.log(santi.getBookNames());
console.log(santi.countMascotas());
santi.addMascota("Ciro");
console.log(santi.countMascotas());