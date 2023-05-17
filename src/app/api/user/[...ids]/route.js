import pool from '../../db'
import { Keyverify } from '../../secretverify';

// API for updates to user data
// params used for this API
// key, type, collegeId, playerId
// U1 – playerId update
// U2 – get user details
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

            // update the player Id for the user
            if(params.ids[1] == 'U1'){
                try {
                    const [rows, fields] = await connection.execute('UPDATE user SET gcm_regId ="'+params.ids[3]+'" where collegeId = "'+params.ids[2]+'"');
                    connection.release();
                    // return successful update
                    return Response.json({status: 200, message:'Updated!'}, {status: 200})
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No user found!'}, {status: 200})
                }
            }
            else if(params.ids[1] == 'U2'){
                try {
                    const [rows, fields] = await connection.execute('SELECT u.*,IFNULL(h.hostelName, "") AS hostelName FROM user_details u JOIN hostel h ON u.hostelsId=h.hostelsId WHERE collegeId = "'+params.ids[2]+'"');
                    connection.release();
                    // return successful update

                    // check if user is found
                    if(rows.length > 0){
                        // return the requests data
                        return Response.json({status: 200, data: rows[0], message:'Updated!'}, {status: 200})

                    }
                    else {
                        // user doesn't exist in the system
                        return Response.json({status: 201, message:'No parents data found!'}, {status: 200})
                    }
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No user found!'}, {status: 200})
                }
            }
            else {
                return Response.json({status: 404, message:'No request found!'}, {status: 200})
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
  