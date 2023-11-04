import pool from '../../db'
import { Keyverify } from '../../secretverify';

// get the requests based on the user role and timing
// params used for this API
// key, role, status, offset, collegeId
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
                if(params.ids[2] == 'Submitted'){
                    query = 'SELECT * FROM visitorpass WHERE collegeId = "'+params.ids[4]+'" AND isOpen = 1 ORDER BY requestDate DESC LIMIT 20 OFFSET '+params.ids[3];
                    // query = 'SELECT p.*,v.* FROM visitorpass p JOIN visitors v WHERE p.vRequestId = v.vRequestId AND p.collegeId = "'+params.ids[4]+'" AND isOpen = 1 ORDER BY requestDate DESC LIMIT 20 OFFSET '+params.ids[3];
                }
                // if not student is looking for requests from the past
                else {
                    query = 'SELECT * FROM visitorpass WHERE collegeId = "'+params.ids[4]+'" AND isOpen = 0 ORDER BY requestDate DESC LIMIT 20 OFFSET '+params.ids[3];
                    // query = 'SELECT p.*,v.* FROM visitorpass p JOIN visitors v WHERE p.vRequestId = v.vRequestId AND p.collegeId = "'+params.ids[4]+'" AND isOpen = 0 ORDER BY requestDate DESC LIMIT 20 OFFSET '+params.ids[3];
                }

                const [rows, fields] = await connection.execute(query);
                
                // Check if requests are found
                if (rows.length > 0) {
                    // Use each request to get visitors of it
                    const requestsData = await Promise.all(
                        rows.map(async (row) => {
                        const [visitors, visitorFields] = await connection.execute('SELECT v.* FROM visitors v WHERE v.vRequestId = ?',[row.vRequestId]);
                
                        // Add visitors data to the current row
                        return { ...row, visitors };
                        })
                    );
                    connection.release();

                    // Return the requests data
                    return Response.json({status: 200,message: 'Data found!',data: requestsData,});
                } else {
                    // No new requests found
                    return Response.json({ status: 404, message: 'No new requests!' });
                }
            }

            // check for the user role
            // if SuperAdmin, get all the requests w.r.t status
            else if(params.ids[1] == 'SuperAdmin' || params.ids[1] == 'OutingAdmin'){
                
                // First Query: Get visitorrequests and matching user information
                const [rows, fields] = await connection.execute('SELECT p.*, u.* FROM visitorpass p JOIN user u ON p.collegeId = u.collegeId WHERE p.vStatus = ? ORDER BY p.requestDate DESC LIMIT 20 OFFSET ?', [params.ids[2], params.ids[3]]);
            
                // Check if requests are found
                if (rows.length > 0) {
                // Use each request to get visitors of it
                const requestsData = await Promise.all(
                    rows.map(async (row) => {
                    const [visitors, visitorFields] = await connection.execute('SELECT v.* FROM visitors v WHERE v.vRequestId = ?',[row.vRequestId]);
            
                    // Add visitors data to the current row
                    return { ...row, visitors };
                    })
                );
                connection.release();

                // Return the requests data
                return Response.json({
                    status: 200,
                    message: 'Data found!',
                    data: requestsData,
                });
                } else {
                // No new requests found
                return Response.json({ status: 404, message: 'No new requests!' });
                }
  
  
            }
            
            // if OutingAssistant, get all requests that are issued by OutingAdmin or SuperAdmin
            else if(params.ids[1] == 'OutingAssistant' || params.ids[1] == 'FoodAdmin'){
                // const [rows, fields] = await connection.execute('SELECT p.*,v.* FROM visitorpass p JOIN visitors v WHERE p.vRequestId = v.vRequestId AND p.collegeId = "'+params.ids[2]+'" ORDER BY approvedOn DESC LIMIT 20 OFFSET '+params.ids[3]);
                // connection.release();


                // First Query: Get visitorrequests and matching user information
                const [rows, fields] = await connection.execute('SELECT p.*, u.* FROM visitorpass p JOIN user u ON p.collegeId = u.collegeId WHERE p.isOpen = 1 AND p.collegeId = ? ORDER BY p.requestDate DESC LIMIT 20 OFFSET ?', [params.ids[2], params.ids[3]]);
            
                // Check if requests are found
                if (rows.length > 0) {
                // Use each request to get visitors of it
                const requestsData = await Promise.all(
                    rows.map(async (row) => {
                    const [visitors, visitorFields] = await connection.execute('SELECT v.* FROM visitors v WHERE v.vRequestId = ?',[row.vRequestId]);
            
                    // Add visitors data to the current row
                    return { ...row, visitors };
                    })
                );
                connection.release();

                // Return the requests data
                return Response.json({
                    status: 200,
                    message: 'Data found!',
                    data: requestsData,
                });
                } else {
                // No new requests found
                return Response.json({ status: 404, message: 'No new requests!' });
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
  