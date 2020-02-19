// configurando o servidor
const express = require("express")
const server = express()

// configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// habilitar body do formulario
server.use(express.urlencoded({ extended: true }))

// configurar o DB
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password:'363252',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})





// configurar a apresentação da pagina
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
    
})


server.post("/", function(req, res){
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood ==""){
        return res.send("Todos os campos são obrigatórios.")
    }

    // colocar valores dentro do DB
    const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        if(err) return res.send("Erro no banco de dados.")

        return res.redirect("/")
    })

    
})




//ligar servidor e permitir o acesso na porta 3000
server.listen(3000)