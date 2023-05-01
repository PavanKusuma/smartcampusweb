import pool from '../../db'
import { Keyverify } from '../../secretverify';
import dayjs from 'dayjs'
const OneSignal = require('onesignal-node')

const client = new OneSignal.Client(process.env.ONE_SIGNAL_APPID, process.env.ONE_SIGNAL_APIKEY)

// params used for this API
// Keyverify,stage,requestId,name,collegeId,role,status,updatedAt,comment, playerId,type

// type –– Single/Bulk update

// stage is useful to define which stage of the request is
// Stage1 –– To be Approved –– get the playerId of student for sending the status update for Stage 1 and 2
// Stage2 –– To be Issed
// Stage3 –– To be CheckOut –– get the playerId of student for check and checkIn to send notification
// Stage4 –– To be CheckIn
// Stage1.5 –– To be Rejected –– Move the request to closed by updating isOpen = 0
// Stage0.5 –– To be Canceled –– Move the request to closed by updating isOpen = 0 and status to Canceled
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    // check for the comment string incase if its empty
    let comment = '';
    if(params.ids[8] == '-'){
        comment = '';
    }
    else {
        comment = '\n'+params.ids[8];
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
                        const [rows, fields] = await connection.execute('UPDATE request SET approver ="'+params.ids[4]+'", approverName ="'+params.ids[3]+'", requestStatus ="'+params.ids[6]+'", approvedOn ="'+params.ids[7]+'", comment = CONCAT(comment,"'+comment+'") where requestId = "'+params.ids[2]+'"');
                        connection.release();
    
                        // send the notification
                        send_notification('🙌 Your outing is approved and is ⏳ waiting for issue by the warden!', params.ids[9]);
                        // return successful update
                        return Response.json({status: 200, message:'Updated!'}, {status: 200})
                    } catch (error) { // error updating
                        return Response.json({status: 404, message:'No request found!'+error.message}, {status: 200})
                    }
                }
                else {
                    
                    try {

                        const [rows, fields] = await connection.execute('UPDATE request SET approver ="'+params.ids[4]+'", approverName ="'+params.ids[3]+'", requestStatus ="'+params.ids[6]+'", approvedOn ="'+params.ids[7]+'", comment = CONCAT(comment,"'+comment+'") where requestId IN ('+params.ids[2]+')');
                        connection.release();
    
                        // send the notification
                        send_notification('🙌 Your outing is approved and is ⏳ waiting for issue by the warden!', params.ids[9]);
                        // return successful update
                        return Response.json({status: 200, message:'Updated!'}, {status: 200})
                    } catch (error) { // error updating
                        return Response.json({status: 404, message:'No request found!'+error.message}, {status: 200})
                    }

                }
                
            }
            // else if(params.ids[4] == 'OutingAdmin' || params.ids[4] == 'OutingIssuer'){
            else if(params.ids[1] == 'S2'){
                
                // check if the type of update request is bulk or single
                if(params.ids[10] == 'Single'){
                    try {
                        const [rows, fields] = await connection.execute('UPDATE request SET issuer ="'+params.ids[4]+'", issuerName ="'+params.ids[3]+'", requestStatus ="'+params.ids[6]+'", issuedOn ="'+params.ids[7]+'", comment = CONCAT(comment,"'+comment+'") where requestId = "'+params.ids[2]+'"');
                        connection.release();
    
                        // send the notification
                        send_notification('✅ Your outing is issued! Scan checkout QR code at security.', params.ids[9]);
                        // return successful update
                        return Response.json({status: 200, message:'Updated!'}, {status: 200})
                    } catch (error) { // error updating
                        return Response.json({status: 404, message:'No request found!'}, {status: 200})
                    }
                }
                else {
                    try {
                        const [rows, fields] = await connection.execute('UPDATE request SET issuer ="'+params.ids[4]+'", issuerName ="'+params.ids[3]+'", requestStatus ="'+params.ids[6]+'", issuedOn ="'+params.ids[7]+'", comment = CONCAT(comment,"'+comment+'") where requestId IN ('+params.ids[2]+')');
                        connection.release();
    
                        // send the notification
                        send_notification('✅ Your outing is issued! Scan checkout QR code at security.', params.ids[9]);
                        // return successful update
                        return Response.json({status: 200, message:'Updated!'}, {status: 200})
                    } catch (error) { // error updating
                        return Response.json({status: 404, message:'No request found!'}, {status: 200})
                    }

                }
                
            }
            // else if(params.ids[4] == 'OutingAssistant'){
            // stage1, requestId, status, updatedOn
            else if(params.ids[1] == 'S3'){ 
                try {
                    const [rows, fields] = await connection.execute('UPDATE request SET isStudentOut = 1, requestStatus ="'+params.ids[3]+'", checkoutOn = "'+params.ids[4]+'" where requestId = "'+params.ids[2]+'"');
                    connection.release();
                    
                    // send the notification
                    send_notification('👋 You checked out of the campus', params.ids[5]);
                    // return successful update
                    return Response.json({status: 200, message:'Updated!'}, {status: 200})
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No request found!'}, {status: 200})
                }
                
            }
            // else if(params.ids[4] == 'OutingAssistant'){
            // stage1, requestId, status, updatedOn
            else if(params.ids[1] == 'S4'){ 
                try {
                    const [rows, fields] = await connection.execute('UPDATE request SET isStudentOut = 0, requestStatus ="'+params.ids[3]+'", returnedOn="'+params.ids[4]+'" where requestId = "'+params.ids[2]+'"');
                    connection.release();
                    
                    // send the notification
                    send_notification('✅ You checked in to the campus', params.ids[5]);
                    // return successful update
                    return Response.json({status: 200, message:'Updated!'}, {status: 200})
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No request found!'}, {status: 200})
                }
                
            }
            // this is when student views the rejected request and it will be moved to closed.
            else if(params.ids[1] == 'S1.5'){ 
                try {
                    const [rows, fields] = await connection.execute('UPDATE request SET isOpen = 0 where requestId = "'+params.ids[2]+'"');
                    connection.release();
                    // return successful update
                    return Response.json({status: 200, message:'Updated!'}, {status: 200})
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No request found!'}, {status: 200})
                }
                
            }
            // this is when student cancels the request and it will be moved to closed.
            else if(params.ids[1] == 'S0.5'){ 
                try {
                    const [rows, fields] = await connection.execute('UPDATE request SET isOpen = 0, requestStatus="Cancelled" where requestId = "'+params.ids[2]+'"');
                    connection.release();
                    // return successful update
                    return Response.json({status: 200, message:'Cancelled!'}, {status: 200})
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
  
  // send the notification using onesignal.
  // use the playerIds of the users.
  // check if playerId length > 2
  function send_notification(message, playerId){
    
    // send notification only if there is playerId for the user
    if(playerId.length > 0){
        var playerIds = []
        playerIds.push(playerId)

        // notification object
        const notification = {

            contents: {
                'en' : message,
            },
            // include_player_ids: ['playerId'],
            include_player_ids: playerIds,
        };

        client.createNotification(notification).then(res => {
            // console.log(res);
        }).catch(e => {
            // console.log(e);
        })
    }
  }