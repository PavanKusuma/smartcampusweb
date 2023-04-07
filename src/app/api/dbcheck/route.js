const mysql = require('mysql')

export async function GET(request) {

    var connection = mysql.createConnection({
        host: '142.93.223.38',
        // host: 'https://www.smartcampus.tools/',
        // port: '3306',
        user: 'marvel', //
        password: '33@Arcane', //
        database: 'campus_gwen',
      })
    //   connection.connect();

      connection.connect((err) => {
        if (err) {
          console.log(err)
          return
        }
        console.log('Database connected')
      })


      connection.query('select distinct(role) from user', (err, data, fields) => {
        if(!err)
            {
                console.log(data)
                
            }
        else
            console.log('Try again');

      })
      
    return new Response('Hello, Next.js!')
  }
  