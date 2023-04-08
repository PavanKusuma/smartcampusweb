import pool from '../../db'
import { Keyverify } from '../../secretverify';
var mysql = require('mysql2')
import dayjs from 'dayjs'

// create new block for outing by the Admins
// key, what, blockId, duration, from, to, blockBy, description, branch
// key, what, today, branch
// what is used to understand what the request is about – whether to send data back or create data
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    // current date time for updating
    var currentDate =  dayjs(new Date(Date.now())).format('YYYY-MM-DD HH:mm:ss');
    console.log(currentDate);

    try{
        // authorize secret key
        if(await Keyverify(params.ids[0])){

            if(params.ids[1] == 0){ // create block dates data
                try {
                    // create query for insert
                    const q = 'INSERT INTO blocks (blockId, duration, blockFrom, blockTo, blockBy, description, branch) VALUES ( ?, ?, ?, ?, ?, ?, ?)';
                    // create new request
                    const [rows, fields] = await connection.execute(q, [ params.ids[2], params.ids[3], params.ids[4], params.ids[5], params.ids[6], params.ids[7], params.ids[8] ]);
                    connection.release();
                    // return the user data
                    return Response.json({status: 200, message:'Block request submitted!'}, {status: 200})
                } catch (error) {
                    // user doesn't exist in the system
                    return Response.json({status: 404, message:'Error creating request. Please try again later!'}, {status: 200})
                }
            }
            else { // fetch data
                const [rows, fields] = await connection.execute('SELECT * from blocks WHERE branch = "'+params.ids[3]+'" AND blockFrom >= "'+params.ids[2]+'" ORDER BY blockFrom DESC');
                connection.release();
            
                // check if user is found
                if(rows.length > 0){
                    // return the requests data
                    return Response.json({status: 200, message:'Data found!', data: rows}, {status: 200})

                }
                else {
                    // user doesn't exist in the system
                    return Response.json({status: 404, message:'No new blockers!'}, {status: 200})
                }
            }
        }
        else {
            // wrong secret key
            return Response.json({status: 401, message:'Unauthorized'}, {status: 200})
        }
    }
    catch (err){
        // some error occured
        return Response.json({status: 500, message:'Facing issues. Please try again!'+err.message}, {status: 200})
    }
    
    
  }
  

