import pool from '../../db'
import { Keyverify } from '../../secretverify';
var mysql = require('mysql2')
import dayjs from 'dayjs'

// create new visitor pass request by the student
// returns the data on success
// key, vRequestId, collegeId, description, visitOn, vStatus, count, foodCount
//////// request will contain the details of the visitors (name, phoneNumber, relation)

// key, requestId, requestType, oRequestId, collegeId, description, requestFrom, requestTo, duration, isAllowed, requestDate, username, phoneNumber
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    // current date time for updating
    // var currentDate =  dayjs(new Date(Date.now())).format('YYYY-MM-DD HH:mm:ss');

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

                try {
                    // create visitor request
                    const q = 'INSERT INTO visitorrequest (vRequestId, collegeId, visitOn, vStatus, isOpen, description, checkin, checkout, count, comments, foodCount, requestDate, approver, approvedName, approvedOn) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )';
                    // create new request
                    const [rows, fields] = await connection.execute(q, [ params.ids[1], params.ids[2], params.ids[3], "Submitted", 1, params.ids[4], null, null, params.ids[5], "-", params.ids[6], params.ids[7], "-","-",null]);
                    
                    // check if the request is created and add the visitors list
                    if(rows.affectedRows == false){
                        return Response.json({status: 404, message:'No request created!'}, {status: 200})
                    }
                    else {
                        // create visitors
                        const q1 = 'INSERT INTO visitors (vRequestId, name, phoneNumber, relation) VALUES ( ?, ?, ?, ?)';
                        
                        // get the visitorsData
                        const visitorsDataArray = JSON.parse(params.ids[8]);

                        // iterate through the visitors data and create each visitor
                        console.log('Received JSON Array:');
                        visitorsDataArray.forEach(async (obj, index) => {

                            console.log(`Object ${index + 1}:`, obj);

                            // create
                            const [rows1, fields] = await connection.execute(q1, [ params.ids[1], params.ids[2], params.ids[3], params.ids[4]]);
                            
                            // if(rows1.length > 0){
                            //     if(rows1[0].fatherPhoneNumber.length > 3){
                            //         // send SMS
                            //         sendSMS('S3',params.ids[7],rows1[0].fatherPhoneNumber, dayjs(params.ids[4]).format('hh:mm A, DD-MM-YY'));
                            //     }
                            // }
                        });
                        connection.release();

                        // send the notification
                        const notificationResult = await send_notification('👋 You checked out of the campus', params.ids[5], 'Single');

                        // return successful update
                        return Response.json({status: 200, message:'Updated!',notification: notificationResult,}, {status: 200})
                    }
                    
                    
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'Error creating request. Please try again later!'+error.message}, {status: 200})
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
          console.log(queryResult);
  }
  

