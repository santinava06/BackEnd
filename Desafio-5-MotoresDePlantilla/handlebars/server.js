const express = require('express');
const app = express();
const {engine} = require('express-handlebars')
const {urlencoded} = require('body-parser') 
const PORT = 8080;

const productos = [
    {
        title: "Calculator",
        price: 280,
        imagen: "https://cdn4.iconfinder.com/data/icons/business-1221/24/Calculator-256.png",
    },
    {
        title: "Phone",
        price: 190,
        imagen: "https://cdn4.iconfinder.com/data/icons/apple-products-2026/512/iPhone_X_home-screen-256.png",
    },
    {
        title: "Laptop",
        price: 370,
        imagen: "https://cdn0.iconfinder.com/data/icons/startup-17/32/startup-03-256.png",
    },
    {
        title: "Camera",
        price: 310,
        imagen: "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/camera-alt-256.png",
    }
];

app.use(urlencoded({ extended: true }))
app.use(express.static('public'));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.get('/', (req, res) => {});
app.get('/productos', (req, res) => {res.render("productAdd", {productos})})
app.post('/productos', (req, res) => {
    const addProducto = req.body
    productos.push(addProducto)
    console.log(addProducto);
    res.redirect('/');
})

const server = app.listen(PORT, () => {console.log(`El servidor se esta ejecutando en el puerto: ${server.address().port}`)});
server.on("ERROR", error => console.log(`Hay un error en el servidor..: ${error}`));