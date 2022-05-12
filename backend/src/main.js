const express = require('express')
const Database = require('./database')

const PORT = 8080

const database = new Database()
database.connect().then(() => {
  const app = express()

  app.get('/register', async (req, res) => {
    const username = req.query.username
    const password = req.query.password

    if(!username){
      res.status(400).send('No username')
    }else if(!password){
      res.status(400).send('No password')
    }else{
      try{
        await database.insertUser(username, password)

        res.send('Registered user ' + username)
      }catch(e){
        console.log(e)
        res.status(500).send(e)
      }
    }
  })

  app.get('/users', async (req, res) => {
    try{
      const users = await database.getAllUsers()
      res.send(users)
    }catch(e){
      res.status(500).send(e)
    }
  })

  app.listen(PORT, () => {
    console.log('Server started listening on port ' + PORT)
  })
}).catch(err => {
  console.log(err)
})
