const express = require('express')
const bodyParser = require('body-parser')
const uuid = require('uuid')

const app = express();
app.use(bodyParser.json());

let drinks = [];

app.get('/api/drink', (_, res) =>{
    res.status(200).json(drinks);
});

app.get('/api/drink/:id', (req, res) => {
    const id = req.params['id'];
    for(i=0; i<drinks.length; i++) {
        if (drinks[i].id === id) {
            res.status(200).json(drinks[i]);
            return
        }
    }
    res.status(404).end()
})

app.post('/api/drink', (req, res) => {
    const drink = req.body;

    if (valid(drink)) {
        drink.id = uuid.v4()
        drinks.push(drink)
        res.status(201).json(drink);
        return
    }

    res.status(400).json({"error": "invalid drink"});
})

app.put('/api/drink/:id', (req, res) => {
    const drink = req.body
    
    if (!valid(drink)) {
        res.status(400).json({"error": "invalid drink"})
        return
    }

    const id = req.params['id']
    
    if (typeof(drink.id) !== 'undefined' && drink.id !== id) {
        res.status(400).json({"error": "id mismatch"})
    }

    drink.id = id
    
    for(i=0; i<drinks.length; i++) {
        if (drinks[i].id === id) {
            drinks[i] = drink
            res.status(200).json(drink)
            return
        }
    }

    res.status(404).end()
})

app.delete('/api/drink/:id', (req, res)=> {
    const id = req.params['id']

    for(i=0;i<drinks.length;i++) {
        if (drinks[i].id === id) {
            drinks.splice(i, 1);
            res.status(204).end()
        }
    }

    res.status(404).end()
})

app.listen(8000, () => {console.log("Api listening")});

function valid(drink) {
    if (typeof(drink.name) === undefined || typeof(drink.name) !== 'string') {
        return false;
    }
    if (typeof(drink.alcoholic) === undefined || typeof(drink.alcoholic) !== 'boolean') {
        return false;
    }
    return true;
}