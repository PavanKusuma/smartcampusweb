import pool from '../../db'
import { Keyverify } from '../../secretverify';
import dayjs from 'dayjs'
const OneSignal = require('onesignal-node')

const client = new OneSignal.Client(process.env.ONE_SIGNAL_APPID, process.env.ONE_SIGNAL_APIKEY)

// params used for this API
// Keyverify,stage,vRequestId,name,collegeId,role,status,updatedAt,comment, playerId,type

// type –– Single/Bulk update

// stage is useful to define which stage of the request is
// Stage1 –– To be Approved –– get the playerId of student for sending the status update for Stage 1 and 2
// Stage2 –– To be CheckIn –– get the playerId of student for check and checkIn to send notification
// Stage3 –– To be CheckOut
// Stage1.5 –– To be Rejected and move to closed –– by updating isOpen = 0
// Stage0.5 –– To be Canceled –– Move the request to closed by updating isOpen = 0 and status to Canceled – This can be done by Student or Admin (Add extra comment to mention who did it)

// Stage22 –– This is the stage to verify at security

export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    // check for the comment string incase if its empty
    let comment = '';
    if(params.ids[8] == '-'){
        comment = '-';
    }
    else {
        comment = decodeURIComponent(params.ids[8])+'\n';
        // comment = '\n'+params.ids[8];
    }

    // current date time for updating
    // var currentDate =  dayjs(new Date(Date.now())).format('YYYY-MM-DD HH:mm:ss');
    
    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

            // verify the role and accordingly update the columns specific to each role
            // if(params.ids[4] == 'Admin' || params.ids[4] == 'SuperAdmin'){
            if(params.ids[1] == 'S1'){

                // check if the type of update request is bulk or single
                if(params.ids[10] == 'Single'){
                    
                    try {
                        // const [rows, fields] = await connection.execute('UPDATE request SET approver ="'+params.ids[4]+'", approverName ="'+params.ids[3]+'", requestStatus ="'+params.ids[6]+'", approvedOn ="'+params.ids[7]+'" where requestId = "'+params.ids[2]+'"');
                        const [rows, fields] = await connection.execute('UPDATE visitorpass SET approver ="'+params.ids[4]+'", approverName ="'+params.ids[3]+'", vStatus ="'+params.ids[6]+'", approvedOn ="'+params.ids[7]+'", comment = CASE WHEN comment = "-" THEN REPLACE(comment,"-","'+comment+'") ELSE CONCAT(comment,"'+comment+'") END where vRequestId = "'+params.ids[2]+'"');
                        
                        connection.release();
    
                        if(params.ids[6] == 'Approved'){
                            // send the notification
                            const notificationResult = await send_notification('🙌 Your Parent/Guardian visit is approved. Use QR code to checkin and checkout visitors!', params.ids[9], params.ids[10]);
                            
                            // return the response
                            return Response.json({status: 200,message: 'Updated!',notification: notificationResult,});
                        }
                        else {
                            // send the notification
                            const notificationResult = await send_notification('❌ Your Parent/Guardian visit is rejected!', params.ids[9], params.ids[10]);
                            
                            // return the response
                            return Response.json({status: 200,message: 'Request rejected!',notification: notificationResult,});
                        }
  
                    } catch (error) { // error updating
                        return Response.json({status: 404, message:'No request found!'+error.message}, {status: 200})
                    }
                }
                else {
                    
                    try {

                        const [rows, fields] = await connection.execute('UPDATE visitorpass SET approver ="'+params.ids[4]+'", approverName ="'+params.ids[3]+'", vStatus ="'+params.ids[6]+'", approvedOn ="'+params.ids[7]+'", comment = CASE WHEN comment = "-" THEN REPLACE(comment,"-","'+comment+'") ELSE CONCAT(comment,"'+comment+'") END where vRequestId IN ('+params.ids[2]+')');
                        connection.release();
    
                        // send the notification
                        const notificationResult = await send_notification('🙌 Your Parent/Guardian visit is approved. Use QR code to checkin and checkout visitors!', params.ids[9], params.ids[10]);
                        
                        // return successful update
                        return Response.json({status: 200, message:'Updated!',notification: notificationResult,}, {status: 200})
                    } catch (error) { // error updating
                        return Response.json({status: 404, message:'No request found!'+error.message}, {status: 200})
                    }

                }
                
            }
            // else if(params.ids[4] == 'OutingAssistant'){
            // 0. Pass
            // 1. stage
            // 2. requestId
            // 3. status
            // 4. checkoutOn
            // 5. playerId
            // 6. single
            // 7. username
            // 8. collegeId
            else if(params.ids[1] == 'S2'){ 
                try {
                    const [rows, fields] = await connection.execute('UPDATE visitorpass SET vStatus ="'+params.ids[3]+'", checkin = "'+params.ids[4]+'" where vRequestId = "'+params.ids[2]+'" and isOpen = 1');
                    
                    // check if the request is updated. 
                    // It will not get updated incase Any Admin has cancelled the request before checkout
                    if(rows.affectedRows == 0){
                        return Response.json({status: 403, message:'Your request is rejected!'}, {status: 200})
                    }
                    else {
                        // check if the student parent phone number is present
                        const [rows1, fields1] = await connection.execute('SELECT fatherPhoneNumber from user_details where collegeId = "'+params.ids[8]+'"');
                        
                        if(rows1.length > 0){
                            if(rows1[0].fatherPhoneNumber.length > 3){
                                // send SMS
                                sendSMS('S2',params.ids[7],rows1[0].fatherPhoneNumber, dayjs(params.ids[4]).format('hh:mm A, DD-MM-YY'));
                            }
                        }

                        // send the notification
                        const notificationResult = await send_notification('👋 Your Parent/Guardian checked in to the campus', params.ids[5], 'Single');

                        // return successful update
                        return Response.json({status: 200, message:'Parent/Guardian checkin success!',notification: notificationResult,}, {status: 200})
                    }
                    connection.release();
                    
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No request found!'}, {status: 200})
                }
                
            }
            // else if(params.ids[4] == 'OutingAssistant'){
            // 0. Pass
            // 1. stage
            // 2. requestId
            // 3. status
            // 4. returnedOn
            // 5. playerId
            // 6. single
            // 7. username
            // 8. collegeId
            else if(params.ids[1] == 'S3'){ 
                try {
                    const [rows, fields] = await connection.execute('UPDATE visitorpass SET vStatus ="'+params.ids[3]+'", checkout="'+params.ids[4]+'" where vRequestId = "'+params.ids[2]+'"');
                    connection.release();

                    // check if the student parent phone number is present
                    const [rows1, fields1] = await connection.execute('SELECT fatherPhoneNumber from user_details where collegeId = "'+params.ids[8]+'"');
                    // console.log(rows1[0].fatherPhoneNumber);
                    
                    // check if there is father phone number for the student
                    if(rows1.length > 0){
                        if(rows1[0].fatherPhoneNumber.length > 3){
                            // send SMS
                            sendSMS('S3',params.ids[7],rows1[0].fatherPhoneNumber, dayjs(params.ids[4]).format('hh:mm A, DD-MM-YY'));
                        }
                    }
                    
                    // send the notification
                    const notificationResult = await send_notification('✅ Your Parent/Guardian checked out of the campus', params.ids[5], 'Single');
                    
                    // return successful update
                    return Response.json({status: 200, message:'Parent/Guardian checkout success!',notification: notificationResult,}, {status: 200})
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No request found!'+error.message}, {status: 200})
                }
                
            }
            // else if(params.ids[4] == 'OutingAssistant'){
            // 0. Pass
            // 1. stage
            // 2. dateInstance
            // 3. playerId
            // 4. username
            // 5. collegeId
            else if(params.ids[1] == 'S22'){ 
                try {
                    let q = `UPDATE visitorpass
                            SET
                                checkin = CASE
                                    WHEN vStatus = 'Approved' THEN "`+params.ids[2]+`"
                                    ELSE checkin
                                END,
                                checkout = CASE
                                    WHEN vStatus = 'Checkin' THEN "`+params.ids[2]+`"
                                    ELSE checkout
                                END,
                                vStatus = CASE
                                    WHEN vStatus = 'Approved' THEN 'Checkin'
                                    WHEN vStatus = 'Checkin' THEN 'Checkout'
                                    ELSE vStatus
                                END
                            WHERE
                        collegeId = "`+params.ids[5]+`" AND isOpen = 1;`;

                    const [rows, fields] = await connection.execute(q);
                    connection.release();

                    // check if the request is updated. 
                    // It will not get updated incase Any Admin has cancelled the request before checkout
                    if(rows.changedRows == 0){
                        return Response.json({status: 403, message:'No active request!'}, {status: 200})
                    }
                    else {
                        // check if the student parent phone number is present
                        // const [rows1, fields1] = await connection.execute('SELECT fatherPhoneNumber from user_details where collegeId = "'+params.ids[5]+'"');
                        
                        // Select query to retrieve the updated requestStatus
                        // this helps us to understand if the student is 'checking out' or 'checking in'
                        const selectQuery = `SELECT vStatus FROM visitorpass WHERE collegeId = "`+params.ids[5]+`" AND isOpen = 1`;
                        const [rows2, fields] = await connection.execute(selectQuery);
                        
                        // get the updated vStatus
                        const updatedRequestStatus = rows2[0].vStatus;

                        var msg = '';
                        var notificationResult;
                        

                        // based on the updated requestStatus, send the messaging to parents
                        if(updatedRequestStatus == 'Checkin'){

                            // check if parent details are present to send SMS
                            msg = 'Parent/Guardian Checkin Successful!';
                            // check if there is father phone number for the student
                            // if(rows1.length > 0){
                            //     if(rows1[0].fatherPhoneNumber.length > 3){
                            //         // send SMS
                            //         sendSMS('S2',params.ids[7],rows1[0].fatherPhoneNumber, dayjs(params.ids[2]).format('hh:mm A, DD-MM-YY'));
                            //     }
                            // }
                            // send the notification
                            notificationResult = await send_notification('👋 Your Parent/Guardian checked in to the campus', params.ids[3], 'Single');
                        }
                        else if(updatedRequestStatus == 'Checkout'){

                            // check if parent details are present to send SMS
                            msg = 'Parent/Guardian Checkout Successful!';
                            // check if there is father phone number for the student
                            // if(rows1.length > 0){
                            //     if(rows1[0].fatherPhoneNumber.length > 3){
                            //         // send SMS
                            //         sendSMS('S3',params.ids[7],rows1[0].fatherPhoneNumber, dayjs(params.ids[2]).format('hh:mm A, DD-MM-YY'));
                            //     }
                            // }
                            // send the notification
                            notificationResult = await send_notification('✅ Your Parent/Guardian checked out of the campus', params.ids[3], 'Single');
                        }
                        
                        // return successful update
                        return Response.json({status: 200, message:msg, notification: notificationResult,}, {status: 200})
                    }

                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No request found!'+error.message}, {status: 200})
                }
                
            }




            else if(params.ids[1] == 'S333'){ 
                
                var notificationResult;

                try {

                    // Select query to retrieve the request that is active
                    // this helps us to understand if the student is 'checking out' or 'checking in'
                    var q = `SELECT
                                visitorpass.*,
                                CASE
                                WHEN LENGTH(fatherPhoneNumber) > 2 THEN fatherPhoneNumber
                                WHEN LENGTH(motherPhoneNumber) > 2 THEN motherPhoneNumber
                                WHEN LENGTH(guardianPhoneNumber) > 2 THEN guardianPhoneNumber
                                WHEN LENGTH(guardian2PhoneNumber) > 2 THEN guardian2PhoneNumber
                                ELSE NULL 
                                END AS phoneNumber
                            FROM visitorpass
                            LEFT JOIN user_details
                            ON visitorpass.collegeId = user_details.collegeId
                            WHERE visitorpass.collegeId = "`+params.ids[5]+`" AND visitorpass.isOpen = 1;`;
                    
                    const [rows, fields] = await connection.execute(q);
                    // const [rows, fields] = await connection.execute('SELECT * FROM request WHERE collegeId = "'+params.ids[5]+'" AND isOpen = 1');
                    
                    // check if active request exists
                    if(rows.length > 0){

                        // get the updated requestStatus
                        const updatedRequestStatus = rows[0].vStatus;
                        
                        // check the status of the active request
                        if(updatedRequestStatus == 'Approved'){

                            // if Issued, visitor is trying to checkin
                            // check for the double scan, that means check if 'checkin' is already present or not
                            if(rows[0].checkin == null){
                                
                                if(true){ // check if student tries to checkout way before their checkout time
                                // if(dayjs(params.ids[2]).diff(dayjs(rows[0].requestTo), 'minute') < 30){

                                    // mark as Checkin
                                    const [rows1, fields] = await connection.execute('UPDATE visitorpass SET vStatus ="Checkin", checkin = "'+params.ids[2]+'" where vRequestId = "'+rows[0].vRequestId+'" and isOpen = 1');

                                        // check if the request is updated. 
                                        // It will not get updated incase Any Admin has cancelled the request before checkout
                                        if(rows1.affectedRows == 0){
                                            return Response.json({status: 199, message:'Request rejected! \nContact admin'}, {status: 200})
                                        }
                                        else {
                                            // check if the student parent phone number is present
                                            if(rows[0].phoneNumber != null){
                                                // send SMS
                                                sendSMS('S2',params.ids[4],rows[0].phoneNumber, dayjs(params.ids[2]).format('hh:mm A, DD-MM-YY'));
                                            }

                                            // send the notification
                                            const notificationResult = await send_notification('👋 Your Parent/Guardian checked in to the campus', params.ids[3], 'Single');

                                            // return successful update
                                            return Response.json({status: 200, message:'Checkin success!', data: rows[0], notification: notificationResult,}, {status: 200})
                                            // return Response.json({status: 200, message:'You checked out of the campus!',notification: notificationResult,}, {status: 200})
                                        }
                                        
                                }
                                else {
                                    // student is not allowed to checkout way before. Show warning.
                                    return Response.json({status: 198, message:'Not allowed. Your checkin time is at'+ rows[0].checkin}, {status: 200})
                                }
                            }
                            else {
                                // this section is very rare, only occurs in case of glitch
                                // student is trying to double scan, show message to not do that
                                return Response.json({status: 199, message:'Error. Contact admin'}, {status: 200})
                            }
                        
                        }
                        else if(updatedRequestStatus == 'Checkin'){

                            // if Checkin, vistor is trying to checkout
                            // check if the time difference between checkout and checkin is more than 5 mins
                            if(dayjs(params.ids[2]).diff(dayjs(rows[0].checkin), 'minute') > 5){

                                // mark as returned
                                const [rows1, fields] = await connection.execute('UPDATE visitorpass SET vStatus ="Checkout", checkout = "'+params.ids[2]+'" where vRequestId = "'+rows[0].vRequestId+'" and isOpen = 1');

                                        // check if the request is updated. 
                                        // It will not get updated incase Any Admin has cancelled the request before checkout
                                        if(rows1.affectedRows == 0){
                                            return Response.json({status: 199, message:'Request rejected! \nContact admin'}, {status: 200})
                                        }
                                        else {
                                            // check if the student parent phone number is present
                                            if(rows[0].phoneNumber != null){
                                                // send SMS
                                                sendSMS('S3',params.ids[4],rows[0].phoneNumber, dayjs(params.ids[2]).format('hh:mm A, DD-MM-YY'));
                                            }

                                            // send the notification
                                            const notificationResult = await send_notification('👋 Your Parent/Guardian checked out of the campuss', params.ids[3], 'Single');

                                            // return successful update
                                            return Response.json({status: 200, message:'Checkout success!', data: rows[0], notification: notificationResult,}, {status: 200})
                                            // return Response.json({status: 200, message:'You checked in to the campus',notification: notificationResult,}, {status: 200})
                                        }

                            }
                            else {
                                // student is trying to double scan
                                // notify about that their checkout is already done.
                                return Response.json({status: 201, message:'Checkin success! \nPlease proceed.', data: rows[0]}, {status: 200})
                            }

                        }
                        else if(updatedRequestStatus == 'Checkout'){
                            // student is trying to double scan
                            // notify student that they already checked in

                            // send the notification
                            const notificationResult = await send_notification('✅ Your Parent/Guardian check out is already recorded. Please proceed and close the request.', params.ids[3], 'Single');

                            // return update
                            return Response.json({status: 201, message:'Checkout success! \nPlease proceed.', data: rows[0], notification: notificationResult,}, {status: 200})
                        }
                        else if(updatedRequestStatus == 'Submitted'){
                            // send the notification
                            const notificationResult = await send_notification('❌ Your request is not Approved. Contact admin.', params.ids[3], 'Single');

                            // return update
                            return Response.json({status: 199, message:'Request not issued!.',notification: notificationResult,}, {status: 200})
                        }
                        else if(updatedRequestStatus == 'Rejected'){
                            // send the notification
                            const notificationResult = await send_notification('❌ Your request is rejected. Contact admin.', params.ids[3], 'Single');

                            // return update
                            return Response.json({status: 199, message:'Request rejected!.',notification: notificationResult,}, {status: 200})
                        }
                        else if(updatedRequestStatus == 'Cancelled'){
                            // send the notification
                            const notificationResult = await send_notification('❌ Your request is cancelled. Contact admin.', params.ids[3], 'Single');

                            // return update
                            return Response.json({status: 199, message:'Request cancelled!.',notification: notificationResult,}, {status: 200})
                        }
                        else {
                            // return update
                            return Response.json({status: 199, message:'Error. Contact admin.',notification: notificationResult,}, {status: 200})
                        }

                    }
                    else {
                        // request not found
                        return Response.json({status: 404, message:'No active request found!'}, {status: 200})
                        // return Response.json({status: 404, message:'Your request is not approved or rejected or closed!'}, {status: 200})
                    }
                    
                    
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'Error. Contact admin.'+error}, {status: 200})
                }
                
            }



            // this is when student views the rejected request and it will be moved to closed.
            else if(params.ids[1] == 'S1.5'){ 
                try {
                    const [rows, fields] = await connection.execute('UPDATE visitorpass SET isOpen = 0 where vRequestId = "'+params.ids[2]+'"');
                    connection.release();
                    // return successful update
                    return Response.json({status: 200, message:'Updated!'}, {status: 200})
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No request found!'}, {status: 200})
                }
                
            }
            // this is when student or admin cancels the request.
            else if(params.ids[1] == 'S0.5'){ 
                try {
                    // check for the comment string incase if its empty
                    let remark = '';
                    if(params.ids[4] == '-'){
                        remark = '-';
                    }
                    else {
                        remark = params.ids[4]+'\n';
                    }
                    const [rows, fields] = await connection.execute('UPDATE visitorpass SET isOpen = 0, vStatus="Cancelled", comment = CASE WHEN comment = "-" THEN REPLACE(comment,"-","'+remark+'") ELSE CONCAT(comment,"'+remark+'") END where vRequestId = "'+params.ids[2]+'"');
                    connection.release();
                    
                    if(params.ids[3] != '-'){
                        // send the notification
                        const notificationResult = await send_notification('❌ You request is cancelled', params.ids[3], 'Single');
                        
                        // return successful update
                        return Response.json({status: 200, message:'Cancelled!', notification: notificationResult}, {status: 200})
                    }
                    else {
                        // return successful update
                        return Response.json({status: 200, message:'Cancelled!'}, {status: 200})
                    }
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No request found!'}, {status: 200})
                }
                
            }
            else{
                // wrong role
                return Response.json({status: 401, message:'Unauthorized'}, {status: 200})
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

    // function to call the SMS API
    async function sendSMS(type, name, number, date){

        var query = '';

        if(type == 'S2'){
            query = "http://webprossms.webprosindia.com/submitsms.jsp?user=SVCEWB&key=c280f55d6bXX&mobile="+number+"&message=Dear Parent, your ward "+name+", has left the campus for outing at "+date+". SVECWB Hostels&senderid=SVECWB&accusage=1&entityid=1001168809218467265&tempid=1007626043853520503";
        }
        else if(type == 'S3'){
            query = "http://webprossms.webprosindia.com/submitsms.jsp?user=SVCEWB&key=c280f55d6bXX&mobile="+number+"&message=Dear Parent, your ward "+name+" has returned to the campus from outing at "+date+". SVECWB Hostels&senderid=SVECWB&accusage=1&entityid=1001168809218467265&tempid=1007892539567152714";
        }
        const result  = await fetch(query, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
              },
            });
              const queryResult = await result.text() // get data
            //   console.log(queryResult);
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

//   async function send_notification(message, playerId, type){
    
//     // send notification only if there is playerId for the user
//     if(playerId.length > 0){
//         var playerIds = []
//         playerIds.push(playerId)

//         var notification;
//         // notification object
//         if(type == 'Single'){
//             notification = {
//                 contents: {
//                     'en' : message,
//                 },
//                 // include_player_ids: ['playerId'],
//                 include_player_ids: [playerId]
//             };
//         }
//         else {
//             notification = {
                
//             contents: {
//                 'en' : message,
//             },
//             include_player_ids: playerIds,
//         };
//         }

//         await client.createNotification(notification).then(res => {
//             console.log(res);
//         }).catch(e => {
//             console.log(e);
//         })
        
        
//     }
//   }