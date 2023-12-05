const {Client} = require('pg')


const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "root",
    database: "NodeAppTest"
})

client.connect();

// client.query(`SELECT * FROM public.posts`, (err, res) => {
//     if(!err) {
//         console.log(res.rows);
//     } else {
//         console.log("Error: ", err.message);
//     }
//     client.end;
// })

// const dbHost = process.env.DATABASE_URL;
// const dbUser = process.env.PGUSER;
// const dbPassword = process.env.PGPASSWORD;
// const dbDatabase = process.env.PGDATABASE;
// const Pool = require('pg').Pool

// const pool = new Pool({
//     user: dbUser,
//     host: dbHost,
//     database: dbDatabase,
//     password: dbPassword,
//     port: 5432,
// });

// module.exports = pool;