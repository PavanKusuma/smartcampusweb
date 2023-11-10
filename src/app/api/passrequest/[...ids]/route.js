import pool from '../../db'
import { Keyverify } from '../../secretverify';

// get the requests based on the user role and timing
// params used for this API
// key, role, requestId, collegeId,

// requestType – if 4 – temporary day pass, 3 – its official request, 2 – Outcity, 1 – Local
// hostelId – Used for fetching specific hostel official requests
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

            // check for the user role
            // if SuperAdmin, get all the requests w.r.t status
            if(params.ids[1] == 'Student'){

                let query = '';
                // check what type of requests to be shown
                // if status is Submitted, that means student is looking for recent request
                
                query = 'SELECT * FROM passrequest WHERE requestId = "'+params.ids[2]+'" ORDER BY requestFrom ASC';
                const [rows, fields] = await connection.execute(query);
                connection.release();

                // check if user is found
                if(rows.length > 0){
                    // return the requests data
                    return Response.json({status: 200, message:'Data found!', data: rows}, {status: 200})

                }
                else {
                    // user doesn't exist in the system
                    return Response.json({status: 404, message:'No requests found!'}, {status: 200})
                }
            }

            else{
                // wrong role
                return Response.json({status: 401, message:'Unauthorized'}, {status: 200})
            }

            // search for user based on the provided collegeId
            // const [rows, fields] = await connection.execute('SELECT * FROM request where isOpen = 1 and collegeId = "'+params.ids[2]+'" ORDER BY requestDate LIMIT 5 OFFSET '+params.ids[3]);
            
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
  