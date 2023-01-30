const knex = require("knex")

const DBclient = knex({
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        user: "root",
        database: "ecommerce"
    }
})

const sqlite3 = knex({
    client: "sqlite3",
    connection: {
        filename: "./ecommerce.sqlite"
    },
    useNullAsDefault: true
})

module.exports = { clientDB: DBclient, sqlite: sqlite3 }