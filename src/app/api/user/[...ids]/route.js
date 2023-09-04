import pool from '../../db'
import { Keyverify } from '../../secretverify';

// API for updates to user data
// params used for this API
// key, type, collegeId, playerId
// U1 – playerId update
// U2 – get user details
// U3 – Search users – by CollegeId
// U4 – Search users – by Username
// U5 – Search user requests(active) – by CollegeId
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
            // get secondary details of the user
            else if(params.ids[1] == 'U2'){
                try {
                    const [rows, fields] = await connection.execute('SELECT u.*,IFNULL(h.hostelName, "") AS hostelName FROM user_details u JOIN hostel h ON u.hostelId=h.hostelId WHERE collegeId = "'+params.ids[2]+'"');
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
            // search for user details by "collegeId"
            else if(params.ids[1] == 'U3'){
                try {
                    // let q = 'SELECT * FROM user WHERE collegeId LIKE "%'+params.ids[2]+'%"';
                    // console.log(q);
                    let q = 'SELECT u.*, IFNULL(d.fatherName, "") AS fatherName, IFNULL(d.fatherPhoneNumber, "") AS fatherPhoneNumber, IFNULL(d.motherName, "") AS motherName, IFNULL(d.motherPhoneNumber, "") AS motherPhoneNumber, IFNULL(d.address, "") AS address, IFNULL(d.guardianName, "") AS guardianName, IFNULL(d.guardianPhoneNumber, "") AS guardianPhoneNumber, IFNULL(d.hostelId, "") AS hostelId, IFNULL(d.roomNumber, "") AS roomNumber, IFNULL(h.hostelName, "") AS hostelName FROM user u LEFT JOIN user_details d ON u.collegeId = d.collegeId LEFT JOIN `hostel` h ON d.hostelId = h.hostelId WHERE u.role = "Student" AND u.profileUpdated=1 AND u.collegeId LIKE "%'+params.ids[2]+'%" LIMIT 20 OFFSET '+params.ids[3];
                    const [rows, fields] = await connection.execute(q);
                    connection.release();
                    // return successful update

                    // check if user is found
                    if(rows.length > 0){
                        // return the requests data
                        return Response.json({status: 200, data: rows, message:'Details found!'}, {status: 200})

                    }
                    else {
                        // user doesn't exist in the system
                        return Response.json({status: 201, message:'No data found!'}, {status: 200})
                    }
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No user found!'}, {status: 200})
                }
            }
            // search for user details by "username"
            else if(params.ids[1] == 'U4'){
                try {
                    // let q = 'SELECT * FROM user WHERE collegeId LIKE "%'+params.ids[2]+'%"';
                    // console.log(q);
                    let q = 'SELECT u.*, IFNULL(d.fatherName, "") AS fatherName, IFNULL(d.fatherPhoneNumber, "") AS fatherPhoneNumber, IFNULL(d.motherName, "") AS motherName, IFNULL(d.motherPhoneNumber, "") AS motherPhoneNumber, IFNULL(d.address, "") AS address, IFNULL(d.guardianName, "") AS guardianName, IFNULL(d.guardianPhoneNumber, "") AS guardianPhoneNumber, IFNULL(d.hostelId, "") AS hostelId, IFNULL(d.roomNumber, "") AS roomNumber, IFNULL(h.hostelName, "") AS hostelName FROM user u LEFT JOIN user_details d ON u.collegeId = d.collegeId LEFT JOIN `hostel` h ON d.hostelId = h.hostelId WHERE u.role = "Student" AND u.profileUpdated=1 AND u.username LIKE "%'+params.ids[2]+'%" LIMIT 20 OFFSET '+params.ids[3];
                    const [rows, fields] = await connection.execute(q);
                    connection.release();
                    // return successful update

                    // check if user is found
                    if(rows.length > 0){
                        // return the requests data
                        return Response.json({status: 200, data: rows, message:'Details found!'}, {status: 200})

                    }
                    else {
                        // user doesn't exist in the system
                        return Response.json({status: 201, message:'No data found!'}, {status: 200})
                    }
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No user found!'}, {status: 200})
                }
            }
            // search for user requests that are active by "collegeId"
            else if(params.ids[1] == 'U5'){
                try {
                    // get outing requests
                    let q = 'SELECT * from request where collegeId = "'+params.ids[2]+'" AND isOpen = 1';
                    const [rows, fields] = await connection.execute(q);
                    // get visitor passes
                    let q1 = 'SELECT * from visitorpass where collegeId = "'+params.ids[2]+'" AND isOpen = 1';
                    const [rows1, fields1] = await connection.execute(q1);

                    // Check if requests are found
                    if (rows1.length > 0) {
                        
                        // Use each request to get visitors of it
                        const requestsData = await Promise.all(
                            rows1.map(async (row) => {
                            const [visitors, visitorFields] = await connection.execute('SELECT v.* FROM visitors v WHERE v.vRequestId = ?',[row.vRequestId]);
                            
                            // Add visitors data to the current row
                            return { ...row, visitors };
                            })
                        );
                        connection.release();

                        // Return the requests data
                        return Response.json({status: 200, outing: rows, visitorpass: requestsData, message:'Details found!'})
                    } else {
                        // Return the requests data
                        return Response.json({status: 200, outing: rows, visitorpass: rows1, message:'Details found!'})
                    }

                    // connection.release();
                    // return successful update

                    // check if data is found
                    // if(rows.length > 0 || rows1.length > 0){
                    //     // return the data
                    //     return Response.json({status: 200, outing: rows, visitorpass: rows1, message:'Details found!'})

                    // }
                    // else {
                    //     // user doesn't exist in the system
                    //     return Response.json({status: 201, message:'No data found!'}, {status: 200})
                    // }
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No user found!'+error}, {status: 200})
                }
            }
            // search for basic user details by "collegeId"
            // this is to check whether the user exists in the DB
            // only used for student registration purpose
            else if(params.ids[1] == 'U6'){
                try {
                    // let q = 'SELECT * FROM user WHERE collegeId LIKE "%'+params.ids[2]+'%"';
                    // console.log(q);
                    let q = 'SELECT * FROM user WHERE role = "Student" AND profileUpdated=0 AND collegeId = "'+params.ids[2]+'" LIMIT 1 OFFSET '+params.ids[3];
                    const [rows, fields] = await connection.execute(q);
                    connection.release();
                    // return successful update

                    // check if user is found
                    if(rows.length > 0){
                        // return the requests data
                        return Response.json({status: 200, data: rows, message:'Details found!'}, {status: 200})

                    }
                    else {
                        // user doesn't exist in the system
                        return Response.json({status: 201, message:'No Student found!'}, {status: 200})
                    }
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No Student found!'}, {status: 200})
                }
            }
            // create/update user details by "collegeId"
            // this is to check and update during student registration
            else if(params.ids[1] == 'U7'){
                try {
                    // let q = 'SELECT * FROM user WHERE collegeId LIKE "%'+params.ids[2]+'%"';
                    // console.log(params.ids[2]);
                    
                    let i = "https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/"+params.ids[2]+".jpeg?alt=media";

                    let q = `UPDATE user SET mediaCount = 1, userImage = '${i}' WHERE collegeId = '${params.ids[2]}'`;
                    const [rows, fields] = await connection.execute(q);
                    connection.release();
                    // return successful update

                    // check if user is found
                    if(rows.affectedRows > 0){
                        // return the requests data
                        return Response.json({status: 200, data: rows, message:'Details found!'}, {status: 200})

                    }
                    else {
                        // user doesn't exist in the system
                        return Response.json({status: 201, message:'No Student found!'}, {status: 200})
                    }
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No Student found!'+error.message}, {status: 200})
                }
            }
            // get user details by who are freshly registered
            else if(params.ids[1] == 'U8'){
                try {
                    // let q = `SELECT *,( SELECT COUNT(*)
                    //  FROM user 
                    //  WHERE mediaCount = 1 AND profileUpdated = 0) AS user_count FROM user WHERE mediaCount = 1 AND profileUpdated = 0 LIMIT 10 OFFSET `+params.ids[2];
                    let q1 = `SELECT COUNT(*) AS registered
                     FROM user 
                     WHERE profileUpdated = 0`;
                    let q2 = `SELECT COUNT(*) AS user_count
                    FROM user 
                    WHERE mediaCount = 1 AND profileUpdated = 0`;
                    let q3 = `SELECT *
                     FROM user 
                     WHERE (mediaCount = 1 OR mediaCount = 0) AND profileUpdated = 0 ORDER BY (mediaCount = 1) DESC, CAST(userObjectId AS SIGNED) ASC LIMIT 10 OFFSET `+params.ids[2];
                    
                    const [rows, fields] = await connection.execute(q1);
                    const [rows1, fields1] = await connection.execute(q2);
                    const [rows2, fields2] = await connection.execute(q3);
                    connection.release();
                    // return successful update

                    // check if user is found
                    if(rows2.length > 0){
                        // return the requests data
                        return Response.json({status: 200, registered: rows[0].registered, count: rows1[0].user_count, data: rows2, message:'Details found!'}, {status: 200})

                    }
                    else {
                        // user doesn't exist in the system
                        return Response.json({status: 201, message:'No Student found!'}, {status: 200})
                    }
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No Student found!'+error.message}, {status: 200})
                }
            }
            else {
                return Response.json({status: 404, message:'No Student found!'}, {status: 200})
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
  