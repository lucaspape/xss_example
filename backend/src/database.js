const mysql = require('mysql')
const { v4: uuidv4 } = require('uuid')

const DB_NAME = 'server_database'

module.exports = class Database {
  constructor(){
    this.mysqlConnection = mysql.createConnection({
      host: 'localhost',
      user: 'server_user',
      password: 'server_password',
      database: DB_NAME
    })
  }

  connect(){
    return new Promise((resolve, reject) => {
      this.mysqlConnection.connect(async (err) => {
        if(err){
          reject(err)
        }else{
          try{
            await this.#createTables()
            resolve()
          }catch(e){
            reject(e)
          }
        }
      })
    })
  }

  insertUser(username, password) {
    return new Promise((resolve, reject) => {
        const id = uuidv4()

        const INSERT_USER_QUERY = 'INSERT INTO `' + DB_NAME + '`.`users` (id, username, password) VALUES (' + this.mysqlConnection.escape(id) + ',' + this.mysqlConnection.escape(username) + ',' + this.mysqlConnection.escape(password) + ');'

        this.mysqlConnection.query(INSERT_USER_QUERY, (err, result) => {
          if(err){
            reject(err)
          }else{
            resolve(result)
          }
        })
    })
  }

  getAllUsers(){
    return new Promise((resolve, reject) => {
      const GET_USERS_QUERY = 'SELECT * FROM `' + DB_NAME + '`.`users`;'

      this.mysqlConnection.query(GET_USERS_QUERY, (err, results) => {
        if(err){
          reject(err)
        }else{
          resolve(results)
        }
      })
    })
  }

  #createTables(){
    return new Promise((resolve, reject) => {
      const CREATE_USER_TABLE = 'CREATE TABLE IF NOT EXISTS `' + DB_NAME + '`.`users` (`id` VARCHAR(36), `username` TEXT, `password` TEXT, PRIMARY KEY(`Id`));'

      this.mysqlConnection.query(CREATE_USER_TABLE, (err, result) => {
        if(err){
          reject(err)
        }else{
          resolve()
        }
      })
    })
  }
}
