import pool from '../../db'
import { Keyverify } from '../../secretverify';

// get the requests based on the user role and timing
// params used for this API
// key, role, branch, status, – for other roles
// key, role, collegeId – for student
// branch value can be 'All' to get complete data

export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

            // check for the user role
            // if SuperAdmin, get all the requests w.r.t status
            if(params.ids[1] == 'SuperAdmin' || params.ids[1] == 'Admin' || params.ids[1] == 'OutingAdmin' || params.ids[1] == 'OutingIssuer' ){

                // check if the request is asking for complete data or for specific branch
                let q = '';
                if(params.ids[3] == 'All' && params.ids[1] != 'Admin'){
                    q = 'SELECT requestStatus, count(*) as count FROM request group by requestStatus';
                }
                else {
                    q = 'SELECT r.requestStatus, count(*) as count FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND u.branch="'+params.ids[2]+'" GROUP BY r.requestStatus';
                }

                const [rows, fields] = await connection.execute(q);
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
            else if(params.ids[1] == 'Student'){

                // this is a combination of 2 queries that will return different status of the collegeId
                // Also it returns if there are any late returns
                let q = 'select \'returnedOn > requestTo\' AS criteria, count(*) as count from request where returnedOn > requestTo and collegeId="'+params.ids[2]+'" UNION select requestStatus, count(*) as count from request where collegeId="'+params.ids[2]+'" group by requestStatus';

                const [rows, fields] = await connection.execute(q);
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
            
            // if OutingIssuer, get all requests that are issued by OutingIssuer
            // else if(params.ids[1] == 'OutingAssistant'){
            //     const [rows, fields] = await connection.execute('SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" ORDER BY issuedOn DESC LIMIT 20 OFFSET '+params.ids[3]);
            //     connection.release();
            
            //     // check if user is found
            //     if(rows.length > 0){
            //         // return the requests data
            //         return Response.json({status: 200, message:'Data found!', data: rows}, {status: 200})

            //     }
            //     else {
            //         // user doesn't exist in the system
            //         return Response.json({status: 404, message:'No new requests!'}, {status: 200})
            //     }
            // }
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
  