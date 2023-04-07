import pool from '../../db'
import { Keyverify } from '../../secretverify';

// this is used to verify the user and send OTP for authorizing into the system
// returns the user data on success
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

            // search for user based on the provided collegeId
            const [rows, fields] = await connection.execute('SELECT u.*,d.* FROM user u LEFT JOIN user_details d ON u.collegeId = d.collegeId WHERE u.collegeId = "'+params.ids[1]+'"');
            connection.release();
            
            // check if user is found
            if(rows.length > 0){
                // return the user data
                return Response.json({status: 200, message:'User found!', data: rows[0]}, {status: 200})

            }
            else {
                // user doesn't exist in the system
                return Response.json({status: 404, message:'Registered number provided does not match with your college records!'}, {status: 200})
            }
        }
        else {
            // wrong secret key
            return Response.json({status: 401, message:'Unauthorized'}, {status: 200})
        }
    }
    catch (err){
        // some error occured
        return Response.json({status: 500, message:'Facing issues. Please try again!'}, {status: 200})
    }
    
    
  }
  