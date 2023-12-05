const {Client} = require('pg')


const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "root",
    database: "NodeAppTest"
})

client.connect();

client.query(`SELECT * FROM public.posts`, (err, res) => {
    if(!err) {
        console.log(res.rows);
    } else {
        console.log("Error: ", err.message);
    }
    client.end;
})