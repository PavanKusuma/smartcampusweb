import pool from '../../db'
// const OneSignal = require('onesignal-node')
import { Keyverify } from '../../secretverify';
import dayjs from 'dayjs'

// const client = new OneSignal.Client(process.env.ONE_SIGNAL_APPID, process.env.ONE_SIGNAL_APIKEY)
// if 0, get all campuses list
// else, get campus record of specifc campusId
export async function GET(request,{params}) {

    const connection = await pool.getConnection();
    
        try{

          // authorize secret key
        if(await Keyverify(params.ids[0])){
            // authorize secret key
            if(params.ids[1] == '0'){

              const [rows, fields] = await connection.execute('SELECT campusId as campusId, campusName as campusName, courses as courses, departments as departments FROM campus order by modifiedDate DESC');
              connection.release();

              // send the notification
              // const notificationResult = await send_notification('Notification check', 'f2d0fbcf-24a7-4ba1-ab2f-886e1ce8f874', 'Single');
                              
              return Response.json({status: 200, data:rows}, {status: 200})

            }
            else{
                
              const [rows, fields] = await connection.execute('SELECT campusId as campusId, campusName as campusName, courses as courses, departments as departments FROM campus where campusId=? order by modifiedDate DESC',[params.ids[2]]);
              connection.release();

              
              // check if user is found
              if(rows.length > 0){
                  // return the requests data
                  return Response.json({status: 200, message:'Data found!', data: rows}, {status: 200})

              }
              else {
                  // user doesn't exist in the system
                  return Response.json({status: 404, message:'No data!'}, {status: 200})
              }

            }
            
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
  

  // send the notification using onesignal.
  // use the playerIds of the users.
  // check if playerId length > 2
  async function send_notification(message, playerId, type) {

    return new Promise(async (resolve, reject) => {
      // send notification only if there is playerId for the user
      if (playerId.length > 0) {
        var playerIds = [];
        playerIds.push(playerId);
        console.log('Sending1...');
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
          console.log(notificationResult);
          resolve(notificationResult);

        } catch (error) {
          console.log(error);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  }

