import pool from '../../db'
import { Keyverify } from '../../secretverify';
var mysql = require('mysql2')
import dayjs from 'dayjs'
const OneSignal = require('onesignal-node')

const client = new OneSignal.Client(process.env.ONE_SIGNAL_APPID, process.env.ONE_SIGNAL_APIKEY)

// create new outing request by the student
// returns the data on success
// key, requestId, requestType, oRequestId, collegeId, description, requestFrom, requestTo, duration, isAllowed, requestDate, username, phoneNumber
//////// based on the requestType create the request

// requestType (1 – local outing, 2 – out-city outing, 3 – official outing, 4 – temporary day pass)
// key, requestId, requestType, oRequestId, collegeId, description, requestFrom, requestTo, duration, isAllowed, requestDate, username, phoneNumber
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    // current date time for updating
    // var currentDate =  dayjs(new Date(Date.now())).format('YYYY-MM-DD HH:mm:ss');

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

            // // check the type of request
            // if(params.ids[2] != 3){
              // check if consent is provided by student
              var consent = '-';
              if(params.ids[13]!=null){
                consent = params.ids[13];
              }
              var campusId = '-';
              if(params.ids[14]!=null){
                campusId = params.ids[14];
              }

                try {

                    // check if any active request exists for the provided collegeId
                    const q0 = 'select collegeId from request where collegeId="'+params.ids[4]+'" and isOpen = 1';
                    const [rows0, fields0] = await connection.execute(q0);
                    
                    if(rows0.length == 0){

                      // check if the user is not blocked by the admin
                      // if profileUpdated column value is 3, then user is meant to be blocked by admin.
                      const [rows1, fields1] = await connection.execute('SELECT branch, profileUpdated from user where collegeId=?', [ params.ids[4] ]);
                      
                      if(rows1[0].profileUpdated == 3){
                        // mention that admin blocked the user to raise request
                        return Response.json({status: 199, message:'You are not allowed to raise request. Contact your admin!'}, {status: 201})
                      }
                      else {

                        // create query for insert
                        const q = 'INSERT INTO request (requestId, campusId, requestType, oRequestId, collegeId, description, requestFrom, requestTo, duration, requestStatus, requestDate, approver, approverName, approvedOn, comment, issuer, issuerName, issuedOn, consentBy, isOpen, isStudentOut, checkoutOn, returnedOn, isAllowed) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )';
                        // create new request
                        const [rows, fields] = await connection.execute(q, [ params.ids[1], campusId, params.ids[2], params.ids[3], params.ids[4], decodeURIComponent(params.ids[5]), params.ids[6], params.ids[7], params.ids[8], "Submitted", params.ids[10] ,  '-','-', null, '-', '-','-',null, consent, 1, 0, null, null, params.ids[9]]);

                        // TEMPORARY DAY PASS, we need to request for each date
                        if(params.ids[2] == 4){
                          
                          var startDate = dayjs(params.ids[6]);
                          var endDate = dayjs(params.ids[7]);
                          var currentDate = startDate;

                          // check for date range and iterate to create request for each date.
                          while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)){

                            // create query for insert
                            const q = 'INSERT INTO passrequest (requestId, collegeId, requestFrom, checkoutOn, returnedOn, requestStatus) VALUES ( ?, ?, ?, ?, ?, ?)';
                            // create new request
                            var currentDateFormatted = currentDate.format('YYYY-MM-DD HH:mm:ss');
                            const [rows, fields] = await connection.execute(q, [ params.ids[1], params.ids[4], currentDateFormatted, null, null, "Submitted"],);

                            // increment to the next date
                            currentDate = currentDate.add(1,'day');
                          }
                        }
                        connection.release();

                        // send SMS to parent
                        sendSMS(params.ids[11], params.ids[12], dayjs(params.ids[6]).format('DD-MM-YY hh:mm A'), dayjs(params.ids[7]).format('DD-MM-YY hh:mm A'))
                        // sendSMS(params.ids[11], params.ids[12], dayjs(params.ids[6]).format('DD-MM-YY hh:mm A'), dayjs(params.ids[7]).format('YYYY-MM-DD'))

                        // get the gcm_regIds of SuperAdmin and branch admin to notify
                        const [nrows, nfields] = await connection.execute('SELECT gcm_regId FROM `user` where role IN ("SuperAdmin") or (role="Admin" AND branch = ?)', [ rows1[0].branch ],);

                        // get the gcm_regIds list from the query result
                        var gcmIds = [];
                        for (let index = 0; index < nrows.length; index++) {
                          const element = nrows[index].gcm_regId;
                          if(element.length > 3)
                            gcmIds.push(element); 
                        }

                        // var gcmIds = 
                        // console.log(gcmIds);

                        // send the notification
                        const notificationResult = await send_notification('Outing request by '+params.ids[4], gcmIds, 'Multiple');
                            
                        // return successful update
                        return Response.json({status: 200, message:'Request submitted!', notification: notificationResult}, {status: 200})

                        // return the user data
                        // return Response.json({status: 200, message:'Request submitted!'}, {status: 200})                   
                      
                      
                             
                      }

                    }
                    else {
                      // return message to close active requests
                      return Response.json({status: 201, message:'Close active requests before raising new one!'}, {status: 201})
                    }

                    
                } catch (error) {
                    // user doesn't exist in the system
                    return Response.json({status: 404, message:'Error creating request. Please try again later!'+error.message}, {status: 200})
                }
            // }
            // else if(params.ids[2] == 3){
            //     // the only difference for official request is, we are adding approver details
            //     // while the request gets created.
            //     // this way, the official request is pre-approved
            //     // incase the HOD wants to reject the outing for specific students, they can update the status to Rejected
            //     try {
            //         // create query for insert
            //         const q = 'INSERT INTO request (requestId, requestType, oRequestId, collegeId, description, requestFrom, requestTo, duration, requestStatus, requestDate, approver, approverName, approvedOn, comment, issuer, issuerName, issuedOn, isOpen, isStudentOut, returnedOn, isAllowed) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )';
            //         // create new request
            //         const [rows, fields] = await connection.execute(q, [ params.ids[1], params.ids[2], params.ids[3], params.ids[4], params.ids[5], params.ids[6], params.ids[7], params.ids[8], "Approved", params.ids[10],  '-','-',null, '-', '-','-',null, 1, 0, null, params.ids[9]]);
            //         connection.release();
            //         // return the user data
            //         return Response.json({status: 200, message:'Request submitted!'}, {status: 200})
            //     } catch (error) {
            //         // user doesn't exist in the system
            //         return Response.json({status: 404, message:'Error creating request. Please try again later!'+error.message}, {status: 200})
            //     }
            // }
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
  async function sendSMS(name, number, from, to){

    const result  = await fetch("http://webprossms.webprosindia.com/submitsms.jsp?user=SVCEWB&key=c280f55d6bXX&mobile="+number+"&message=Dear Parent, your ward, "+name+" has applied for outing from "+from+" to "+to+".  SVECWB Hostels&senderid=SVECWB&accusage=1&entityid=1001168809218467265&tempid=1007149047352803219", {
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
// console.log(playerId);
    return new Promise(async (resolve, reject) => {
      // send notification only if there is playerId for the user
      if (playerId.length > 0) {
        // var playerIds = [];
        // playerIds.push(playerId);
  
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
            include_player_ids: playerId,
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


