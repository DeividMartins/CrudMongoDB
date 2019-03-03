const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const Object = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb://deivid:xxxxx.mlab.com:xxxxx/crud";

MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('crud') // colocar o nome do banco de dados

    app.listen(8080, () => {
        console.log('sever running on port 8080')
    })
})

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})

app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results })
    })
})

app.post('/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Salvo no banco de dados')
        res.redirect('/')
        db.collection('data').find().toArray((err, results) =>{
            console.log(results)
        })
    })
})

app.route('/edit/:id')
    .get((req, res) => {
        var id = req.params.id

        db.collection('data').find(Object(id)).toArray((err, result) => {
            if (err) return res.send(err)
            res.render('edit.ejs', { data: result })
        })
    })
    .post((req, res) => {
        var id = req.params.id
        var name = req.body.name
        var surname = req.body.surname

        db.collection('data').updateOne({ _id: Object(id) }, {
            $set: {
                name: name,
                surname: surname
            }
        }, (err,result) => {
            if (err) return res.send(err)
            res.redirect('/show')
            console.log('Atualizado no Banco de Dados')
        })
    })

    app.route('/delete/:id')
    .get((req, res) =>{
        var id = req.params.id

        db.collection('data').deleteOne({_id: Object(id)}, (err, result) =>{
            if (err) return res.send(500, err)
            console.log('Deletado do Banco de Dados!')
            res.redirect('/show')
        })
    })