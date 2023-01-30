const { sqlite } = require("./config/config");

sqlite("products").insert({title: "efaw", price: 151, thumbnail:"asdfea"})
    .catch(e=>console.log(e))
    .then(console.log("ready"))
    .then(sqlite.destroy())

    /**/
//sqlite("products").then(rows=>console.log(rows))