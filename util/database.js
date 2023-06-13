const mysql=require('mysql2')

const pool=mysql.createPool({      //we use mysql pool so that we dont need to execute mysql and close mysql after every command
    host:'localhost',
    user:'ravi',
    database:'node_complete',
    password:'ravi2233'
})

module.exports=pool.promise();