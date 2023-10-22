import pool from '../../api/db'
const OneSignal = require('onesignal-node')

const client = new OneSignal.Client(process.env.ONE_SIGNAL_APPID, process.env.ONE_SIGNAL_APIKEY)

export async function GET(request) {

    const connection = await pool.getConnection();
    const [rows, fields] = await connection.execute('SELECT campusId as campusId, campusName as campusName FROM campus order by modifiedDate DESC');
    connection.release();

    // send the notification
    // const notificationResult = await send_notification('Notification check', 'f2d0fbcf-24a7-4ba1-ab2f-886e1ce8f874', 'Single');
                    
    return Response.json({data:rows}, {status: 200})
    // return Response.json({data:rows, notification: notificationResult},{data1:fields}, {notification: notificationResult}, {status: 200})
    
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

