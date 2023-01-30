const { clientDB, sqlite } = require("./config/config");

clientDB.schema.createTable("messages", (t)=>{
    t.string("clientID")
    t.string("messages")
    t.date("date")
    clientDB.destroy()
})  .then(console.log("rdy"))
    .catch((e)=>console.log(e.message))

sqlite.schema.createTable("products", (t)=>{
    t.string("title")
    t.integer("price")
    t.string("thumbnail")
    sqlite.destroy()
})  .then(console.log("rdy"))
    .catch((e)=>console.log(e.message))