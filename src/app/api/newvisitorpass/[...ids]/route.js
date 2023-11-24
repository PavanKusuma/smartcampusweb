import pool from '../../db'
import { Keyverify } from '../../secretverify';
var mysql = require('mysql2')
import dayjs from 'dayjs'

// create new visitor pass request by the student
// returns the data on success
// key, vRequestId, collegeId, description, visitOn, vStatus, count, foodCount, visitors, isAllowed
//////// request will contain the details of the visitors (name, phoneNumber, relation)

// key, requestId, collegeId, visitOn, description, count, foodCount, requestDate, visitors, isAllowed
// list of visitors
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    // current date time for updating
    // var currentDate =  dayjs(new Date(Date.now())).format('YYYY-MM-DD HH:mm:ss');

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

            var campusId = '-';
              if(params.ids[12]!=null){
                campusId = params.ids[12];
              }

                try {
                    // check if any active request exists for the provided collegeId
                    const q0 = 'select collegeId from visitorpass where collegeId="'+params.ids[2]+'" and isOpen = 1';
                    const [rows0, fields0] = await connection.execute(q0);
                    
                    if(rows0.length == 0){

                        // check if the visitor count is > 0
                        if(params.ids[5] > 0){
                            
                            // create visitor request
                            const q = 'INSERT INTO visitorpass (vRequestId, campusId, collegeId, visitOn, vStatus, isOpen, description, checkin, checkout, count, comment, foodCount, foodAvail, requestDate, approver, approverName, approvedOn, isAllowed) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )';
                            // create new request
                            const [rows, fields] = await connection.execute(q, [ params.ids[1], campusId, params.ids[2], params.ids[3], "Submitted", 1, decodeURIComponent(params.ids[4]), null, null, params.ids[5], "-", params.ids[6], 0, params.ids[7], "-","-",null, params.ids[9]]);
                            
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
                                visitorsDataArray.forEach(async (obj, index) => {

                                    // create
                                    const [rows1, fields] = await connection.execute(q1, [ params.ids[1], obj.name, obj.phoneNumber, obj.relation]);
                                    
                                });
                                connection.release();

                                // send SMS to parent
                                sendSMS(params.ids[10], params.ids[11], dayjs(params.ids[3]).format('DD-MM-YY hh:mm A'), params.ids[9]);

                                // return successful update
                                return Response.json({status: 200, message:'Updated!',}, {status: 200})
                            }
                        }
                        else {
                            // return successful update
                        return Response.json({status: 201, message:'Add alteast 1 visitor'}, {status: 201})
                        }
                    }
                    else {
                        // return successful update
                      return Response.json({status: 201, message:'Close active requests before raising new one!'}, {status: 201})
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
  async function sendSMS(name, number, visitOn, isAllowed){
    var url = "";
    var name1 = name + " has applied";

    if(isAllowed == 1){
        url = "http://webprossms.webprosindia.com/submitsms.jsp?user=SVCEWB&key=c280f55d6bXX&mobile="+number+"&message=Dear Parent, your ward, "+name1+" member visitor pass for "+visitOn+", parents not included.  SVECWB Hostels&senderid=SVECWB&accusage=1&entityid=1001168809218467265&tempid=1007484333121191024";
    }
    else {
        url = "http://webprossms.webprosindia.com/submitsms.jsp?user=SVCEWB&key=c280f55d6bXX&mobile="+number+"&message=Dear Parent, your ward, "+name1+" member visitor pass for "+visitOn+".  SVECWB Hostels&senderid=SVECWB&accusage=1&entityid=1001168809218467265&tempid=1007081800825766218";
    }
    const result  = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
          },
        });
          const queryResult = await result.text() // get data
        //   console.log(queryResult);
  }
  

