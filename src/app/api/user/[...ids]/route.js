import pool from '../../db'
import { Keyverify } from '../../secretverify';
import dayjs from 'dayjs'
const OneSignal = require('onesignal-node')

const client = new OneSignal.Client(process.env.ONE_SIGNAL_APPID, process.env.ONE_SIGNAL_APIKEY)

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
                    let q = 'SELECT u.*, IFNULL(d.fatherName, "") AS fatherName, IFNULL(d.fatherPhoneNumber, "") AS fatherPhoneNumber, IFNULL(d.motherName, "") AS motherName, IFNULL(d.motherPhoneNumber, "") AS motherPhoneNumber, IFNULL(d.address, "") AS address, IFNULL(d.guardianName, "") AS guardianName, IFNULL(d.guardianPhoneNumber, "") AS guardianPhoneNumber, IFNULL(d.guardian2Name, "") AS guardian2Name, IFNULL(d.guardian2PhoneNumber, "") AS guardian2PhoneNumber, IFNULL(d.hostelId, "") AS hostelId, IFNULL(d.roomNumber, "") AS roomNumber, IFNULL(h.hostelName, "") AS hostelName FROM user u LEFT JOIN user_details d ON u.collegeId = d.collegeId LEFT JOIN `hostel` h ON d.hostelId = h.hostelId WHERE u.role = "Student" AND u.collegeId LIKE "%'+params.ids[2]+'%" LIMIT 20 OFFSET '+params.ids[3];
                    // let q = 'SELECT u.*, IFNULL(d.fatherName, "") AS fatherName, IFNULL(d.fatherPhoneNumber, "") AS fatherPhoneNumber, IFNULL(d.motherName, "") AS motherName, IFNULL(d.motherPhoneNumber, "") AS motherPhoneNumber, IFNULL(d.address, "") AS address, IFNULL(d.guardianName, "") AS guardianName, IFNULL(d.guardianPhoneNumber, "") AS guardianPhoneNumber, IFNULL(d.guardian2Name, "") AS guardian2Name, IFNULL(d.guardian2PhoneNumber, "") AS guardian2PhoneNumber, IFNULL(d.hostelId, "") AS hostelId, IFNULL(d.roomNumber, "") AS roomNumber, IFNULL(h.hostelName, "") AS hostelName FROM user u LEFT JOIN user_details d ON u.collegeId = d.collegeId LEFT JOIN `hostel` h ON d.hostelId = h.hostelId WHERE u.role = "Student" AND u.profileUpdated=1 AND u.collegeId LIKE "%'+params.ids[2]+'%" LIMIT 20 OFFSET '+params.ids[3];
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
                    let q = 'SELECT u.*, IFNULL(d.fatherName, "") AS fatherName, IFNULL(d.fatherPhoneNumber, "") AS fatherPhoneNumber, IFNULL(d.motherName, "") AS motherName, IFNULL(d.motherPhoneNumber, "") AS motherPhoneNumber, IFNULL(d.address, "") AS address, IFNULL(d.guardianName, "") AS guardianName, IFNULL(d.guardianPhoneNumber, "") AS guardianPhoneNumber, IFNULL(d.guardian2Name, "") AS guardian2Name, IFNULL(d.guardian2PhoneNumber, "") AS guardian2PhoneNumber, IFNULL(d.hostelId, "") AS hostelId, IFNULL(d.roomNumber, "") AS roomNumber, IFNULL(h.hostelName, "") AS hostelName FROM user u LEFT JOIN user_details d ON u.collegeId = d.collegeId LEFT JOIN `hostel` h ON d.hostelId = h.hostelId WHERE u.role = "Student" AND u.profileUpdated=1 AND u.username LIKE "%'+params.ids[2]+'%" LIMIT 20 OFFSET '+params.ids[3];
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
                     WHERE (mediaCount = 1 OR mediaCount = 0) AND profileUpdated = 0 ORDER BY (mediaCount = 1) DESC, CAST(userObjectId AS SIGNED) ASC `;
                    //  WHERE (mediaCount = 1 OR mediaCount = 0) AND profileUpdated = 0 ORDER BY (mediaCount = 1) DESC, CAST(userObjectId AS SIGNED) ASC LIMIT 10 OFFSET `+params.ids[2];
                    
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
            // create/update user basic details by "collegeId"
            // admin can update from Student360
            else if(params.ids[1] == 'U9'){
                try {

                    // get the list of things to update
                    const jsonObject = JSON.parse(params.ids[3]);
                    var updateString = '';

                    // parse through the list of things to update and form a string
                    for (const key in jsonObject) {
                        if (jsonObject.hasOwnProperty(key)) {
                          const value = jsonObject[key];
                          
                            if(updateString.length == 0){
                                updateString = `${key}='${value}'`;
                            }
                            else {
                                updateString = updateString + `,${key}='${value}'`;
                            }
                        }
                      }
                      
                    console.log(`UPDATE user SET ${updateString} WHERE collegeId = '${params.ids[2]}'`);
                    let q = `UPDATE user SET ${updateString} WHERE collegeId = '${params.ids[2]}'`;
                    
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
            // UPDATE user parent details by "collegeId"
            // admin can update from Student360
            // this update happens via key value pairs
            else if(params.ids[1] == 'U10'){
                try {

                    // get the list of things to update
                    const jsonObject = JSON.parse(params.ids[3]);
                    var updateString = '';
                    var uDKeys = '', uDValues = '';

                    console.log(jsonObject);
                    // check if the details are present or not
                    const [drows, dfields] = await connection.execute('SELECT detailsId from user_details WHERE collegeId = ?', [params.ids[2]]);
                    console.log(drows.length);
                    // user parent details are present, hence just run the update query
                    if(drows.length > 0){

                        // parse through the list of things to update and form a string
                        for (const key in jsonObject) {
                            if (jsonObject.hasOwnProperty(key)) {
                            const value = jsonObject[key];
                            
                                if(updateString.length == 0){
                                    updateString = `${key}='${value}'`;
                                }
                                else {
                                    updateString = updateString + `,${key}='${value}'`;
                                }
                            }
                        }

                        // check if parents record exist or not
                        // update if exisits, else create new
                        
                        console.log(`UPDATE user_details SET ${updateString} WHERE collegeId = '${params.ids[2]}'`);
                        let q = `UPDATE user_details SET ${updateString} WHERE collegeId = '${params.ids[2]}'`;
                        
                        const [rows, fields] = await connection.execute(q);
                        connection.release();
                        // return successful update

                        // check if updated
                        if(rows.affectedRows > 0){
                            // return the requests data
                            return Response.json({status: 200, data: rows, message:'Updated successfully!'}, {status: 200})

                        }
                        else {
                            // user doesn't exist in the system
                            return Response.json({status: 201, message:'No updated!'}, {status: 200})
                        }

                    }
                    // user parent details are NOT present, hence insert the details
                    else {

                        // userDetailObject
                        for (const key in jsonObject) {
                            if (jsonObject.hasOwnProperty(key)) {
                            const value = jsonObject[key];
                            
                                if(uDKeys.length == 0){
                                    // updateString = `${key}='${value}'`;
                                    uDKeys = `${key}`;
                                    uDValues = `'${value}'`;

                                }
                                else {
                                    // updateString = updateString + `,${key}='${value}'`;
                                    uDKeys = uDKeys + `,${key}`;
                                    uDValues = uDValues + `,'${value}'`;
                                }
                            }
                        }

                        let q = `INSERT INTO user_details (collegeId,${uDKeys}) VALUES ('${params.ids[2]}',${uDValues})`;
                    
                            const [rows1, fields1] = await connection.execute(q);
                            connection.release();
                            // return successful update

                            // check if user is found
                            if(rows1.affectedRows > 0){
                                // return the requests data
                                return Response.json({status: 200, data1: rows1, message:'Updated successfully!'}, {status: 200})

                            }
                            else {
                                // user doesn't exist in the system
                                return Response.json({status: 201, message:'No updated!'}, {status: 200})
                            }

                    }
                    

                    
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No Student found!'+error.message}, {status: 200})
                }
            }
            // CREATE user basic and parent details
            // admin can CREATE from Student360
            // this update happens via key value pairs
            else if(params.ids[1] == 'U11'){
                try {

                    // get the list of things to update
                    const userObject = JSON.parse(params.ids[2]);
                    const userDetailObject = JSON.parse(params.ids[3]);
                    // var updateString = '';
                    var userKeys = '', userValues = '', userDetailKeys = '', userDetailValues = '';

                    // parse through the list of things to update and form a string
                    // userObject
                    for (const key in userObject) {
                        if (userObject.hasOwnProperty(key)) {
                          const value = userObject[key];
                          
                            if(userKeys.length == 0){
                                // updateString = `${key}='${value}'`;
                                userKeys = `${key}`;
                                userValues = `'${value}'`;

                            }
                            else {
                                // updateString = updateString + `,${key}='${value}'`;
                                userKeys = userKeys + `,${key}`;
                                userValues = userValues + `,'${value}'`;
                            }
                        }
                      }
                    // parse through the list of things to update and form a string
                    // userDetailObject
                    for (const key in userDetailObject) {
                        if (userDetailObject.hasOwnProperty(key)) {
                          const value = userDetailObject[key];
                          
                            if(userDetailKeys.length == 0){
                                // updateString = `${key}='${value}'`;
                                userDetailKeys = `${key}`;
                                userDetailValues = `'${value}'`;

                            }
                            else {
                                // updateString = updateString + `,${key}='${value}'`;
                                userDetailKeys = userDetailKeys + `,${key}`;
                                userDetailValues = userDetailValues + `,'${value}'`;
                            }
                        }
                      }
                      
                    console.log(`INSERT INTO user (${userKeys}) VALUES (${userValues})`);
                    console.log(`INSERT INTO user (${userDetailKeys}) VALUES (${userDetailValues})`);

                    let p = `INSERT INTO user (${userKeys}) VALUES (${userValues})`;
                    let q = `INSERT INTO user_details (${userDetailKeys}) VALUES (${userDetailValues})`;
                    
                    const [rows, fields] = await connection.execute(p);
                    const [rows1, fields1] = await connection.execute(q);
                    connection.release();
                    // return successful update

                    // check if user is found
                    if(rows.affectedRows > 0 && rows1.affectedRows > 0){
                        // return the requests data
                        return Response.json({status: 200, data: rows, data1: rows1, message:'Details found!'}, {status: 200})

                    }
                    else {
                        // user doesn't exist in the system
                        return Response.json({status: 201, message:'No Student found!'}, {status: 200})
                    }
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No Student found!'+error.message}, {status: 200})
                }
            }
            // get all details of the user
            // this is requested by the user itself to refresh their profile after update by admin
            else if(params.ids[1] == 'U12'){
                try {
                    const [rows, fields] = await connection.execute('SELECT u.*, IFNULL(d.fatherName, "") AS fatherName, IFNULL(d.fatherPhoneNumber, "") AS fatherPhoneNumber, IFNULL(d.motherName, "") AS motherName, IFNULL(d.motherPhoneNumber, "") AS motherPhoneNumber, IFNULL(d.address, "") AS address, IFNULL(d.guardianName, "") AS guardianName, IFNULL(d.guardianPhoneNumber, "") AS guardianPhoneNumber, IFNULL(d.guardian2Name, "") AS guardian2Name, IFNULL(d.guardian2PhoneNumber, "") AS guardian2PhoneNumber, IFNULL(d.hostelId, "") AS hostelId, IFNULL(d.roomNumber, "") AS roomNumber, IFNULL(h.hostelName, "") AS hostelName FROM user u LEFT JOIN user_details d ON u.collegeId = d.collegeId LEFT JOIN `hostel` h ON d.hostelId = h.hostelId WHERE u.collegeId = "'+params.ids[2]+'"');
                    connection.release();
                    // return successful update

                    // check if user is found
                    if(rows.length > 0){
                        // return the requests data
                        return Response.json({status: 200, data: rows[0], message:'Data found!'}, {status: 200})

                    }
                    else {
                        // user doesn't exist in the system
                        return Response.json({status: 201, message:'No data found!'}, {status: 200})
                    }
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No user found!'}, {status: 200})
                }
            }
            // update the profileUpdated to 3 for blocking or unblocking user
            // 4 – Temporary day scholar
            // 3 – Blocked from taking outing
            // 2 – Active & profile is not updated
            // 1 – Active & profile is updated
            // 0 – Inactive – out of college

            // Also change the student Type
            // Day Scholar
            // Hostel
            else if(params.ids[1] == 'U13'){
                try {
                    
                    const [rows, fields] = await connection.execute('UPDATE user SET profileUpdated ="'+params.ids[3]+'" and type = "'+params.ids[4]+'" where collegeId = "'+params.ids[2]+'"');
                    const [rows2, fields2] = await connection.execute('SELECT gcm_regId FROM user WHERE collegeId = "'+params.ids[2]+'"');

                    // send the notification
                    const notificationResult = await send_notification('✅ Your profile is updated by admin. Refresh profile to view.', rows2[0].gcm_regId, 'Single');
                        
                    connection.release();
                    // return successful update
                    return Response.json({status: 200, message:'Profile updated!',notification: notificationResult}, {status: 200})
                    

                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No user found!'}, {status: 200})
                }
            }
            // Change the outingType
            // yes - self-permitted
            // no - not self-permitted
            else if(params.ids[1] == 'U14'){
                try {
                    const [rows, fields] = await connection.execute('UPDATE user SET outingType ="'+params.ids[3]+'" where collegeId = "'+params.ids[2]+'"');
                    const [rows2, fields2] = await connection.execute('SELECT gcm_regId FROM user WHERE collegeId = "'+params.ids[2]+'"');

                    // send the notification
                    const notificationResult = await send_notification('✅ Your outing type is changed by admin. Refresh profile to view.', rows2[0].gcm_regId, 'Single');
                        
                    connection.release();
                    // return successful update
                    return Response.json({status: 200, message:'Outing type updated!',notification: notificationResult}, {status: 200})

                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No user found!',error: error.message}, {status: 200})
                }
            }
            // Change the phoneNumber
            else if(params.ids[1] == 'U15'){
                try {
                    const [rows, fields] = await connection.execute('UPDATE user SET phoneNumber ="'+params.ids[3]+'" where collegeId = "'+params.ids[2]+'"');
                    connection.release();
                    // return successful update
                    return Response.json({status: 200, message:'Phone number updated!'}, {status: 200})
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No user found!'}, {status: 200})
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
  

    // send the notification using onesignal.
  // use the playerIds of the users.
  // check if playerId length > 2
  async function send_notification(message, playerId, type) {

    return new Promise(async (resolve, reject) => {
      // send notification only if there is playerId for the user
      if (playerId.length > 0) {
        var playerIds = [];
        playerIds.push(playerId);
  
        var notification;
        // notification object
        if (type == 'Single') {
          notification = {
            contents: {
              'en': message,
            },
            // include_player_ids: ['playerId'],
            // include_player_ids: ['90323-043'],
            include_player_ids: [playerId],
          };
        } else {
          notification = {
            contents: {
              'en': message,
            },
            include_player_ids: playerIds,
          };
        }
  
        try {
          // create notification
          const notificationResult = await client.createNotification(notification);
          
          resolve(notificationResult);

        } catch (error) {
          
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  }