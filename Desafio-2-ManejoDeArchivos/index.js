const Contenedor = require("./Contenedor");

const contenedor = new Contenedor("productos.json");

const main = async () => {
  const id1 = await contenedor.save({ title: "Remera", price: 59 });
  const id2 = await contenedor.save({ title: "Pantalon", price: 57.75 });
  const id3 = await contenedor.save({ title: "Campera", price: 25 });

  console.log(id1, id2, id3); // 1, 2, 3

  const object2 = await contenedor.getById(2);
  console.log(object2); 

  await contenedor.deleteById(2);

  const allCurrentObjects = await contenedor.getAll();
  console.log(allCurrentObjects);
  /**
     * [
        { title: 'Remera', price: 59, id: 1 },
        { title: 'Campera', price: 25, id: 3 }
        ]
    */

  await contenedor.deleteAll();
};

main();