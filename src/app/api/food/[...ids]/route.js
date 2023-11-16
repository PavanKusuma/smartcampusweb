import pool from '../../db'
import { Keyverify } from '../../secretverify';

// get the requests based on the user role and timing
// params used for this API
// key, role, collegeId, datetime, playerId, username
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

            // check for the user role
            if(params.ids[1] == 'FoodAdmin'){

                // check if there are any visitors available for the given collegeId
                // if visitors are available, update the foodAvail column + food table and return the visitor details
                // else update the food table

                const [rows, fields] = await connection.execute('SELECT * FROM visitorpass WHERE isOpen = 1 AND collegeId = ? ORDER BY requestDate DESC', [params.ids[2]]);
            
                // Check if requests are found
                if (rows.length > 0) {
                // // Use each request to get visitors of it
                // const requestsData = await Promise.all(
                //     rows.map(async (row) => {
                //     const [visitors, visitorFields] = await connection.execute('SELECT v.* FROM visitors v WHERE v.vRequestId = ?',[row.vRequestId]);
            
                //     // Add visitors data to the current row
                //     return { ...row, visitors };
                //     })
                // );
                    const [rows1, fields1] = await connection.execute('UPDATE visitorpass SET foodAvail = foodCount WHERE isOpen = 1 AND foodAvail != foodCount AND collegeId = ?',[params.ids[2]]);

                    if(rows1 && rows1.affectedRows === 1){
                        const [rows2, fields2] = await connection.execute('INSERT INTO food (collegeId, availCount, takenOn) VALUES (?,?,?)',[params.ids[2],rows[0].foodCount,params.ids[3]]);
                        connection.release();

                        // send the notification
                        const notificationResult = await send_notification('Food coupon availed for '+params.ids[4]+' people', params.ids[4], 'Single');
                        
                        // Return the requests data
                        return Response.json({ status: 201, message: 'Student + '+rows[0].foodCount+' visitors', data: rows[0], notification: notificationResult });
                    }
                    else {
                        // Return the requests data
                        return Response.json({ status: 199, message: 'Already availed!', });
                    }
                    
                }
                else {
                    const [rows3, fields3] = await connection.execute('INSERT INTO food (collegeId, availCount, takenOn) SELECT ?, 1, ? FROM food WHERE DATE(takenOn) = ? HAVING COUNT(*) == 0',[params.ids[2],1,params.ids[3]]);
                    connection.release();

                    if(rows3 && rows3.affectedRows === 1){
                        
                        // send the notification
                        const notificationResult = await send_notification('Food coupon availed.', params.ids[4], 'Single');

                        // Return the requests data
                        return Response.json({ status: 200, message: 'Scan success!', notification: notificationResult });    
                    }
                    else {
                        // Return the requests data
                        return Response.json({ status: 199, message: 'Already availed!', });
                    }
                    
                    
                }
                


                } else {
                    // No new requests found
                    return Response.json({ status: 401, message: 'Unauthorized!' });
                }
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