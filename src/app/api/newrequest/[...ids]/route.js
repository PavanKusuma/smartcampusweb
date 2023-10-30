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

// requestType (1 – local outing, 2 – out-city outing, 3 – official outing)
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

                try {

                    // check if any active request exists for the provided collegeId
                    const q0 = 'select collegeId from request where collegeId="'+params.ids[4]+'" and isOpen = 1';
                    const [rows0, fields0] = await connection.execute(q0);
                    
                    if(rows0.length == 0){

                      // check if the user is not blocked by the admin
                      // if profileUpdated column value is 3, then user is meant to be blocked by admin.
                      const [rows1, fields1] = await connection.execute('SELECT profileUpdated from user where collegeId=?', [ params.ids[4] ]);
                      console.log(rows1);
                      
                      if(rows1[0].profileUpdated == 3){
                        // mention that admin blocked the user to raise request
                        return Response.json({status: 199, message:'You are not allowed to raise request. Contact your admin!'}, {status: 201})
                      }
                      else {
                        
                        // create query for insert
                        const q = 'INSERT INTO request (requestId, requestType, oRequestId, collegeId, description, requestFrom, requestTo, duration, requestStatus, requestDate, approver, approverName, approvedOn, comment, issuer, issuerName, issuedOn, consentBy, isOpen, isStudentOut, returnedOn, isAllowed) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )';
                        // create new request
                        const [rows, fields] = await connection.execute(q, [ params.ids[1], params.ids[2], params.ids[3], params.ids[4], decodeURIComponent(params.ids[5]), params.ids[6], params.ids[7], params.ids[8], "Submitted", params.ids[10] ,  '-','-', null, '-', '-','-',null, '-', 1, 0, null, params.ids[9]]);
                        connection.release();

                        // send SMS to parent
                        sendSMS(params.ids[11], params.ids[12], dayjs(params.ids[6]).format('DD-MM-YY hh:mm A'), dayjs(params.ids[7]).format('DD-MM-YY hh:mm A'))
                        // sendSMS(params.ids[11], params.ids[12], dayjs(params.ids[6]).format('DD-MM-YY hh:mm A'), dayjs(params.ids[7]).format('YYYY-MM-DD'))

                        // send the notification
                        const notificationResult = await send_notification('Outing request by '+params.ids[4], 'fd65be57-ccf5-4a28-b859-639fe66049e3', 'Single');
                            
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


