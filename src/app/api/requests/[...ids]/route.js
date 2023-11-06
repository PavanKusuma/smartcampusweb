import pool from '../../db'
import { Keyverify } from '../../secretverify';

// get the requests based on the user role and timing
// params used for this API
// key, role, status, offset, collegeId, branch, requestType, hostelId

// requestType – if 3, its official request, 2 – Outcity, 1 – Local
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
                if(params.ids[2] == 'Submitted'){
                    query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND r.collegeId = "'+params.ids[4]+'" AND isOpen = 1 ORDER BY requestDate DESC LIMIT 20 OFFSET '+params.ids[3];
                }
                // if not student is looking for requests from the past
                else {
                    query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND r.collegeId = "'+params.ids[4]+'" AND isOpen = 0 ORDER BY requestDate DESC LIMIT 20 OFFSET '+params.ids[3];
                }

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

            // check for the user role
            // if SuperAdmin, get all the requests w.r.t status
            else if(params.ids[1] == 'SuperAdmin'){

                // verify what type of requests admin is asking
                let query = '';

                // based on the status, the query might change because of the ORDER BY
                if(params.ids[2] == 'Submitted'){

                    // check for request type (official or general)
                    if(params.ids[6] == '3'){
                        query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestType="3" AND requestStatus = "'+params.ids[2]+'" ORDER BY requestFrom ASC LIMIT 50 OFFSET '+params.ids[3];
                    }
                    else {
                        query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestType!="3" AND requestStatus = "'+params.ids[2]+'" ORDER BY requestFrom ASC LIMIT 50 OFFSET '+params.ids[3];
                    }
                }
                else if(params.ids[2] == 'Approved'){
                    query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" ORDER BY requestFrom ASC LIMIT 50 OFFSET '+params.ids[3];
                    // query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" ORDER BY approvedOn DESC LIMIT 50 OFFSET '+params.ids[3];
                }
                else if(params.ids[2] == 'Issued' || params.ids[2] == 'InOuting' ){
                    query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" ORDER BY requestFrom ASC LIMIT 50 OFFSET '+params.ids[3];
                    // query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" ORDER BY issuedOn DESC LIMIT 50 OFFSET '+params.ids[3];
                }
                else if(params.ids[2] == 'Returned' ){
                    query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" ORDER BY requestFrom ASC LIMIT 50 OFFSET '+params.ids[3];
                    // query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" ORDER BY returnedOn DESC LIMIT 50 OFFSET '+params.ids[3];
                }
                else {
                    query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" ORDER BY requestFrom ASC LIMIT 50 OFFSET '+params.ids[3];
                    // query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" ORDER BY requestDate DESC LIMIT 50 OFFSET '+params.ids[3];
                }

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

                // verify what type of requests admin is asking
                let query = '';
                if(params.ids[6] == '3'){
                    // for the admin, removing the offset
                    // loading all the results at a time so that search can be made inline
                    query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" AND FIND_IN_SET("'+params.ids[5]+'",u.branch) > 0 AND requestType="3" ORDER BY u.year,u.collegeId DESC';
                    // query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" AND u.branch = "'+params.ids[5]+'" AND requestType="3" ORDER BY u.year,u.collegeId DESC';
                }
                else {
                    query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" AND FIND_IN_SET("'+params.ids[5]+'",u.branch) > 0 AND requestType!="3"  ORDER BY u.year,u.collegeId DESC LIMIT 20 OFFSET '+params.ids[3];
                    // query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" AND u.branch = "'+params.ids[5]+'" AND requestType!="3"  ORDER BY u.year,u.collegeId DESC LIMIT 20 OFFSET '+params.ids[3];
                }

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

                // verify what type of requests issuer is asking
                let query = '';
                if(params.ids[6] == '3'){
                    query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" AND requestType="3" ORDER BY requestFrom ASC LIMIT 20 OFFSET '+params.ids[3];
                    // query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" AND requestType="3" ORDER BY approvedOn DESC LIMIT 20 OFFSET '+params.ids[3];
                }
                else {
                    // we want to return all requests irrespective of official or general outing just for viewing
                    // if user is asking for pending requests (approved), then only return what they can approve
                    if(params.ids[2] == 'Approved'){
                        query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" AND requestType!="3" ORDER BY requestFrom ASC LIMIT 20 OFFSET '+params.ids[3];
                        // query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" AND requestType!="3" ORDER BY approvedOn DESC LIMIT 20 OFFSET '+params.ids[3];
                    }
                    else {
                        query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" ORDER BY requestFrom ASC LIMIT 20 OFFSET '+params.ids[3];
                        // query = 'SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" ORDER BY approvedOn DESC LIMIT 20 OFFSET '+params.ids[3];
                    }
                }

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
                const [rows, fields] = await connection.execute('SELECT r.*,u.*, d.* FROM request r JOIN user u ON r.collegeId = u.collegeId JOIN user_details d ON r.collegeId = d.collegeId WHERE r.requestStatus = "'+params.ids[2]+'" AND r.requestType="3" AND d.hostelId = "'+params.ids[6]+'" ORDER BY r.requestFrom ASC LIMIT 20 OFFSET '+params.ids[3]);
                // const [rows, fields] = await connection.execute('SELECT r.*,u.*, d.* FROM request r JOIN user u ON r.collegeId = u.collegeId JOIN user_details d ON r.collegeId = d.collegeId WHERE r.requestStatus = "'+params.ids[2]+'" AND r.requestType="3" AND d.hostelId = "'+params.ids[6]+'" ORDER BY r.approvedOn DESC LIMIT 20 OFFSET '+params.ids[3]);
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
                const [rows, fields] = await connection.execute('SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND r.isOpen = 1 AND r.collegeId = "'+params.ids[2]+'" ORDER BY requestFrom ASC LIMIT 20 OFFSET '+params.ids[3]);
                // const [rows, fields] = await connection.execute('SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" ORDER BY issuedOn DESC LIMIT 20 OFFSET '+params.ids[3]);
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
  