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
        comment = params.ids[8]+'\n';
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
                            const notificationResult = await send_notification('🙌 Your visitor pass is approved. Use QR code to checkin and checkout visitors!', params.ids[9], params.ids[10]);
                            
                            // return the response
                            return Response.json({status: 200,message: 'Updated!',notification: notificationResult,});
                        }
                        else {
                            // send the notification
                            const notificationResult = await send_notification('❌ Your visitor pass is rejected!', params.ids[9], params.ids[10]);
                            
                            // return the response
                            return Response.json({status: 200,message: 'Updated!',notification: notificationResult,});
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
                        const notificationResult = await send_notification('🙌 Your visitor pass is approved. Use QR code to checkin and checkout visitors!', params.ids[9], params.ids[10]);
                        
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
                        const notificationResult = await send_notification('👋 Your visitors checked in to the campus', params.ids[5], 'Single');

                        // return successful update
                        return Response.json({status: 200, message:'Updated!',notification: notificationResult,}, {status: 200})
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
                    const notificationResult = await send_notification('✅ Your visitors checked out of the campus', params.ids[5], 'Single');
                    
                    // return successful update
                    return Response.json({status: 200, message:'Updated!',notification: notificationResult,}, {status: 200})
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
                            msg = 'Checkin Successful!';
                            // check if there is father phone number for the student
                            // if(rows1.length > 0){
                            //     if(rows1[0].fatherPhoneNumber.length > 3){
                            //         // send SMS
                            //         sendSMS('S2',params.ids[7],rows1[0].fatherPhoneNumber, dayjs(params.ids[2]).format('hh:mm A, DD-MM-YY'));
                            //     }
                            // }
                            // send the notification
                            notificationResult = await send_notification('👋 Your visitors checked in to the campuss', params.ids[3], 'Single');
                        }
                        else if(updatedRequestStatus == 'Checkout'){

                            // check if parent details are present to send SMS
                            msg = 'Checkout Successful!';
                            // check if there is father phone number for the student
                            // if(rows1.length > 0){
                            //     if(rows1[0].fatherPhoneNumber.length > 3){
                            //         // send SMS
                            //         sendSMS('S3',params.ids[7],rows1[0].fatherPhoneNumber, dayjs(params.ids[2]).format('hh:mm A, DD-MM-YY'));
                            //     }
                            // }
                            // send the notification
                            notificationResult = await send_notification('✅ Your visitors checked out of the campus', params.ids[3], 'Single');
                        }
                        
                        // return successful update
                        return Response.json({status: 200, message:msg, notification: notificationResult,}, {status: 200})
                    }

                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No request found!'+error.message}, {status: 200})
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