import pool from '../../db'
import { Keyverify } from '../../secretverify';
var mysql = require('mysql2')
import dayjs from 'dayjs'

// create new outing request by the student
// returns the data on success
// key, requestId, requestType, collegeId, description, requestFrom, requestTo, duration, isAllowed, requestDate,
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    // current date time for updating
    // var currentDate =  dayjs(new Date(Date.now())).format('YYYY-MM-DD HH:mm:ss');

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

            try {
                // create query for insert
                const q = 'INSERT INTO request (requestId, requestType, collegeId, description, requestFrom, requestTo, duration, requestStatus, requestDate, approver, approverName, approvedOn, comment, issuer, issuerName, issuedOn, isOpen, isStudentOut, returnedOn, isAllowed) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )';
                // create new request
                const [rows, fields] = await connection.execute(q, [ params.ids[1], params.ids[2], params.ids[3], params.ids[4], params.ids[5], params.ids[6], params.ids[7], "Submitted", params.ids[9] ,  '-','-', null, '-', '-','-',null, 1, 0, null, params.ids[8]]);
                connection.release();
                // return the user data
                return Response.json({status: 200, message:'Request submitted!'}, {status: 200})
            } catch (error) {
                // user doesn't exist in the system
                return Response.json({status: 404, message:'Error creating request. Please try again later!'+error.message}, {status: 200})
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
  

