const express = require("express")
const { Router } = require("express")
const { urlencoded } = require("body-parser")
const app = express()
const fs = require("fs")

const admin = true

const carts = JSON.parse(fs.readFileSync("./productos.txt"))

const getId = (arr) => {
    if (arr[arr.length - 1]){
        return arr[arr.length - 1].id + 1
    } else {
        return 1
    }
}
const write = (path, file, replace) => {
    const content = JSON.parse(fs.readFileSync(path))
    if (replace) {
        fs.writeFileSync(path, JSON.stringify(file, null, 2))
        return
    }
    content.push(file)
    fs.writeFileSync(path, JSON.stringify(content, null, 2))
}
const read = (path) => {
    return JSON.parse(fs.readFileSync(path))
}

const productsRouter = Router()

app.use(express.json())
app.use('/api/productos', productsRouter)
app.use(urlencoded({ extended: true }))
productsRouter.use(urlencoded({ extended: true }))

app.listen(3001, ()=>{console.log(`Arrancando en puerto ${3001}`)})

productsRouter.get("/:id", (req, res)=>{
    const num = req.params.id
    const products = read("./productos.txt")
    if (!products.find((prod)=>prod.id == num)){
        res.status(404)
        res.json({error: 404, descripcion: "producto no encontrado"})
        return
    }
    res.json(products.find((prod)=>prod.id == num))
})
productsRouter.post("/", (req, res)=>{
    if (admin){
        const productToAdd = req.body
        productToAdd.id = read("./productos.txt").length + 1
        write("./productos.txt", productToAdd)
        res.json(productToAdd)
    } else {
        res.status(403)
        res.json({error: 403, descripcion: `ruta ${req.path} metodo "${req.method}" no autorizado`})
    }
})
productsRouter.put("/:id", (req, res)=>{
    if (admin){
        const productUpdate = req.body
        const num = req.params.id
        const products = read("./productos.txt")
        if (!products.find((prod)=>prod.id == num)){
            res.status(404)
            res.json({error: 404, descripcion: "producto no encontrado"})
            return
        }
        const index = products.findIndex((prod)=>prod.id == num)
        if (productUpdate.price) products[index].price = productUpdate.price
        if (productUpdate.title) products[index].title = productUpdate.title
        if (productUpdate.thumbnail) products[index].thumbnail = productUpdate.thumbnail
        const updated = products[index]
        write("./productos.txt", products, true)
        res.json({actualizado: updated})
    } else {
        res.status(403)
        res.json({error: 403, descripcion: `ruta ${req.path} metodo "${req.method}" no autorizado`})
    }
})
productsRouter.delete("/:id", (req, res)=>{
    if (admin){
        const num = req.params.id
        const products = read("./productos.txt")
        if (!products.find((prod)=>prod.id == num)){
            res.status(404)
            res.json({error: 404, descripcion: "producto no encontrado"})
            return
        }
        const index = products.findIndex((prod)=>prod.id == num)
        const deletedProduct = products[index]
        products.splice(index, 1)
        write("./productos.txt", products, true)
        res.json({deleted: deletedProduct})
    } else {
        res.status(403)
        res.json({error: 403, descripcion: `ruta ${req.path} metodo "${req.method}" no autorizado`})
    }
})

const cartRouter = Router()
app.use("/api/carrito", cartRouter)

cartRouter.post("/", (req, res)=>{
    const carts = read("./carts.txt")
    const time = Date.now()
    const cartProducts = req.body[0] ? req.body : []
    const newCart = {id: getId(carts), timeStamp: new Date(time).toLocaleString(), products: cartProducts}
    write("./carts.txt", newCart)    
    res.json({ cartID: newCart.id })
})
cartRouter.delete("/:id", (req, res)=>{
    const carts = read("./carts.txt")
    const num = req.params.id
    if (!carts.find((cart)=>cart.id == num)){
        res.status(404)
        res.json({error: 404, descripcion: "carrito no encontrado"})
        return
    }
    const index = carts.findIndex((cart)=>cart.id == num)
    carts.splice(index, 1)
    write("./carts.txt", carts, true)
    res.send(`Carrito con id:${num} eliminado.`)
})
cartRouter.get("/:id/productos", (req, res)=>{
    const carts = read("./carts.txt")
    const num = req.params.id
    if (!carts.find((cart)=>cart.id == num)){
        res.status(404)
        res.json({error: 404, descripcion: "carrito no encontrado"})
        return
    }
    const index = carts.findIndex((cart)=>cart.id == num)
    res.json(carts[index].products)
})
cartRouter.post("/:id/productos/:id_prod", (req, res)=>{
    const carts = read("./carts.txt")
    const products = read("./products.txt")
    const cartID = req.params.id
    const prodID = req.params.id_prod
    if (!carts.find((cart)=>cart.id == cartID)){
        res.status(404)
        res.json({error: 404, descripcion: "carrito no encontrado"})
        return
    }
    if (!products.find((prod)=>prod.id == prodID)){
        res.status(404)
        res.json({error: 404, descripcion: "producto no encontrado"})
        return
    }
    const cartIndex = carts.findIndex((cart)=>cart.id == cartID)
    const prodIndex = products.findIndex((prod)=>prod.id == prodID)
    const productToAdd = products[prodIndex]
    carts[cartIndex].products.push(products[prodIndex])
    write("./carts.txt", carts, true)
    res.send(`${productToAdd} añadido`)
})
cartRouter.delete("/:id/productos/:id_prod", (req, res)=>{
    const products = read("./products.txt")
    const carts = read("./carts.txt")
    const cartID = req.params.id
    const prodID = req.params.id_prod
    const cartIndex = carts.findIndex((cart)=>cart.id == cartID)
    const prodIndex = carts[cartIndex].products.findIndex((prod)=>prod.id == prodID)
    const eliminatedProduct = carts[cartIndex].products[prodIndex]
    carts[cartIndex].products.splice(prodIndex, 1)
    write("./carts.txt", carts, true)
    res.json({eliminado: eliminatedProduct})
})