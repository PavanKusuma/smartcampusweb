import pool from '../../db'
import { Keyverify } from '../../secretverify';

// get the "REQUESTS HISTORY" based on the user role and timing
// params used for this API
// key, role, status, offset, collegeId, branch, hostelId

export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

            // if Admin, get all requests w.r.t status and department
            if(params.ids[1] == 'SuperAdmin'){

                // remove the space between the words. Specially for "In outing".
                const sanitizedParam = params.ids[2].replace(/\s/g, '');

                // get all types of request with respect to the status mentioned
                var query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+sanitizedParam+'" ORDER BY approvedOn DESC LIMIT 20 OFFSET '+params.ids[3];
                const [rows, fields] = await connection.execute(query);
                connection.release();
            
                // check if user is found
                if(rows.length > 0){
                    // return the requests data
                    return Response.json({status: 200, message:'Data found!', data: rows}, {status: 200})

                }
                else {
                    // user doesn't exist in the system
                    return Response.json({status: 404, message:'No new requests!'}, {status: 200})
                }
            }
            // if Admin, get all requests w.r.t status and department
            else if(params.ids[1] == 'Admin'){

                // remove the space between the words. Specially for "In outing".
                const sanitizedParam = params.ids[2].replace(/\s/g, '');

                // get all types of request with respect to the status mentioned
                var query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+sanitizedParam+'" AND u.branch = "'+params.ids[5]+'" ORDER BY approvedOn DESC LIMIT 20 OFFSET '+params.ids[3];
                // var query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" AND u.branch = "'+params.ids[5]+'" ORDER BY approvedOn DESC LIMIT 20 OFFSET '+params.ids[3];
                const [rows, fields] = await connection.execute(query);
                connection.release();
            
                // check if user is found
                if(rows.length > 0){
                    // return the requests data
                    return Response.json({status: 200, message:'Data found!', data: rows}, {status: 200})

                }
                else {
                    // user doesn't exist in the system
                    return Response.json({status: 404, message:'No new requests!'}, {status: 200})
                }
            }
            // if OutingAdmin, get all requests that are approved by admins
            else if((params.ids[1] == 'OutingAdmin')){

                // remove the space between the words. Specially for "In outing".
                const sanitizedParam = params.ids[2].replace(/\s/g, '');

                var query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+sanitizedParam+'" ORDER BY approvedOn DESC LIMIT 20 OFFSET '+params.ids[3];
                const [rows, fields] = await connection.execute(query);
                connection.release();
            
                // check if user is found
                if(rows.length > 0){
                    // return the requests data
                    return Response.json({status: 200, message:'Data found!', data: rows}, {status: 200})

                }
                else {
                    // user doesn't exist in the system
                    return Response.json({status: 404, message:'No new requests!'}, {status: 200})
                }
            }
            // if OutingIssuer, get only OFFICIAL requests that are approved by admin and that belong to issuer hostel
            else if(params.ids[1] == 'OutingIssuer'){

                // remove the space between the words. Specially for "In outing".
                const sanitizedParam = params.ids[2].replace(/\s/g, '');

                const [rows, fields] = await connection.execute('SELECT r.*,u.*, d.* FROM request r JOIN user u ON r.collegeId = u.collegeId JOIN user_details d ON r.collegeId = d.collegeId WHERE r.requestStatus = "'+sanitizedParam+'" AND r.requestType="3" AND d.hostelId = "'+params.ids[6]+'" ORDER BY r.approvedOn DESC LIMIT 20 OFFSET '+params.ids[3]);
                connection.release();
            
                // check if user is found
                if(rows.length > 0){
                    // return the requests data
                    return Response.json({status: 200, message:'Data found!', data: rows}, {status: 200})

                }
                else {
                    // user doesn't exist in the system
                    return Response.json({status: 404, message:'No new requests!'}, {status: 200})
                }
            }
            // if OutingAssistant, get all requests that are issued by OutingIssuer
            else if(params.ids[1] == 'OutingAssistant'){

                // remove the space between the words. Specially for "In outing".
                const sanitizedParam = params.ids[2].replace(/\s/g, '');
                
                const [rows, fields] = await connection.execute('SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+sanitizedParam+'" ORDER BY issuedOn DESC LIMIT 20 OFFSET '+params.ids[3]);
                connection.release();
            
                // check if user is found
                if(rows.length > 0){
                    // return the requests data
                    return Response.json({status: 200, message:'Data found!', data: rows}, {status: 200})

                }
                else {
                    // user doesn't exist in the system
                    return Response.json({status: 404, message:'No new requests!'}, {status: 200})
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
  