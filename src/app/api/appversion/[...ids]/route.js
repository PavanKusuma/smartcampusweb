import pool from '../../db'
import { Keyverify } from '../../secretverify';

// params used for this API
// key, collegeId

export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

            let q = 'SELECT profileUpdated from user WHERE collegeId = "'+params.ids[2]+'"';
            
            // search for user based on the provided collegeId
            const [rows, fields] = await connection.execute(q);

            if(rows[0].profileUpdated != 0){

                // check for the updated app version
                if(params.ids[1] == '1.1.4'){

                    // return the requests data
                    return Response.json({status: 200, message:'Updated!', data: rows[0]}, {status: 200})

                }
                else{
                    // wrong role
                    return Response.json({status: 404, message:'Not updated'}, {status: 200})
                }
            }
            else {
                // wrong role
                return Response.json({status: 402, message:'Your access is revoked by your campus!'}, {status: 200})
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
  