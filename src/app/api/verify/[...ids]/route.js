import { randomUUID } from 'crypto';
import pool from '../../db'
import { Keyverify } from '../../secretverify';
import nodemailer from 'nodemailer';
const OneSignal = require('onesignal-node')
import dayjs from 'dayjs'

const client = new OneSignal.Client(process.env.ONE_SIGNAL_APPID, process.env.ONE_SIGNAL_APIKEY)
// this is used to verify the user and send OTP for authorizing into the system
// returns the user data on success

// pass, collegeId, OTP, deviceId, loginTime
// campusId to be added – helps to identify the student campus
export async function GET(request,{params}) {

    // Send emails to each user with their respective OTP code
    const transporter = nodemailer.createTransport({
        // host: 'smtp.gmail.com',
        // port: 587,
        // secure: false,
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PWD,
        },
      })

    // get the pool connection to db
    const connection = await pool.getConnection();

    // current date time for updating
    var currentDate =  dayjs(new Date(Date.now())).format('YYYY-MM-DD HH:mm:ss');

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

            let q = 'SELECT u.*, IFNULL(d.fatherName, "") AS fatherName, IFNULL(d.fatherPhoneNumber, "") AS fatherPhoneNumber, IFNULL(d.motherName, "") AS motherName, IFNULL(d.motherPhoneNumber, "") AS motherPhoneNumber, IFNULL(d.address, "") AS address, IFNULL(d.guardianName, "") AS guardianName, IFNULL(d.guardianPhoneNumber, "") AS guardianPhoneNumber, IFNULL(d.guardian2Name, "") AS guardian2Name, IFNULL(d.guardian2PhoneNumber, "") AS guardian2PhoneNumber, IFNULL(d.hostelId, "") AS hostelId, IFNULL(d.roomNumber, "") AS roomNumber, IFNULL(h.hostelName, "") AS hostelName FROM user u LEFT JOIN user_details d ON u.collegeId = d.collegeId LEFT JOIN `hostel` h ON d.hostelId = h.hostelId WHERE u.collegeId = "'+params.ids[1]+'"';
            // 'SELECT u.*,d.* FROM user u LEFT JOIN user_details d ON u.collegeId = d.collegeId WHERE u.collegeId = "'+params.ids[1]+'"'
     
            // search for user based on the provided collegeId
            const [rows, fields] = await connection.execute(q);
            
            // check if user is found
            if(rows.length > 0){

                // profileUpdated value is used to remove the student from the central system
                // other features outside the central system can be still accessed.
                if(rows[0].profileUpdated != 0){
                    
                    // check if email is present
                    if(rows[0].email.length > 2){
                        // send mail with defined transport object
                        let info = await transporter.sendMail({
                            name: 'Smart Campus',
                            from: '"Smart campus" <smartcampus@svecw.edu.in>', // sender address
                            // from: '"Smart campus" <hello.helpmecode@gmail.com>', // sender address
                            to: rows[0].email, // list of receivers
                            subject: "OTP for "+rows[0].collegeId+" login", // Subject line
                            // text: "Hello world?", // plain text body
                            html: '<center><table style="text-align: center;border:1px solid  rgba(80,80,80,0.3);border-radius:8px; padding:16px;"><tr><td><span style="font-size: 50px;display: inline-block; color: #1b6aff;">SC</span></td></tr><tr><td><h1 style="color:#333;font-size:20px;line-height:10px;">Login to Smart Campus</h1></td></tr><tr><td><p>Copy and paste below OTP to verify your <b>'+rows[0].collegeId+'</b> login</p></td></tr><tbody><tr><td><h1 style="background-color: #f5f5f5;text-align: center;padding: 10px;border-radius:8px;font-family: monospace;letter-spacing: 12px;font-size: xx-large;">'+params.ids[2]+'</h1></td></tr> <tr><td><p style="color: #697882;">Smart Campus<br>A smart assistant to you at your campus.</p></td></tr><tr><td height="10" style="line-height:1px;font-size:1px;height:10px">&nbsp;</td></tr><tr><td><br><div style="display: flex;justify-content: space-between;color: #697882;"><span><a href="https://piltovr.com" style="text-decoration:none;color:#697882" target="_blank">A Piltovr Product</a></span></div></td></tr></tbody></table><br></center>', // html body
                            // html: '<center><table style="text-align: center;border:1px solid  rgba(80,80,80,0.3);border-radius:8px; padding:16px;"><tr><td><h1 style="color:#333;font-size:20px">Login to Smart Campus</h1></td></tr><tr><td><p>Copy and paste below OTP to verify your '+rows[0].collegeId+' login</p></td></tr><tbody><tr><td><h1 style="background-color: #f5f5f5;text-align: center;padding: 10px;border-radius:8px;">'+params.ids[2]+'</h1></td></tr> <tr><td><p style="color: #697882;">Smart Campus<br><span style="font-size:14px">A smart assistant to you at your campus.</span></p></td></tr><tr><td height="10" style="line-height:1px;font-size:1px;height:10px">&nbsp;</td></tr><tr><td><br><div style="display: flex;flex-direction:row;justify-content: space-between;color: #697882;"><span><a href="https://piltovr.com" style="text-decoration:none;color:#697882" target="_blank">A Piltovr Product</a></span><a href="https://www.smartcampus.tools/privacy" style="text-decoration:none;color:#697882" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.smartcampus.tools/privacy&amp;source=gmail&amp;ust=1701507513628000&amp;usg=AOvVaw0a_wK1kV3y2bLZRnHvj_cK">Privacy policy</a></div></td></tr></tbody></table><br></center>', // html body
                            // html: '<center><table style="text-align: center;"><tr><td><h1 style="color:#333;font-size:20px">Login to Smart Campus</h1></td></tr><tr><td><p>Copy and paste below OTP to verify your '+rows[0].collegeId+' login</p></td></tr><tbody><tr><td><h1 style="background-color: #f5f5f5;text-align: center;padding: 10px;">'+params.ids[2]+'</h1></td></tr> <tr><td><p>Smart Campus, a smart assistant to you at your campus.</p></td></tr></tbody></table><br></center>', // html body
                            // html: '<center><table><tr><td><p>Copy and paste below OTP to verify your login</p></td></tr> <tr><td><h1 style="background-color:#f5f5f5,text-align:center">'+params.ids[2]+'</h1></td></tr></table><br/></center>', // html body
                        });
                    }

                    // create query for insert
                    const q1 = 'INSERT INTO user_sessions (collegeId, deviceId, sessionToken, isLoggedIn, lastActivityTime) VALUES ( ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE isLoggedIn = isLoggedIn + 1, lastActivityTime = "'+currentDate+'";';
                    // create new request
                    const [rows1, fields] = await connection.execute(q1, [ params.ids[1], params.ids[3], randomUUID(), 1, currentDate]);
                    connection.release();
                    // console.log("Message sent: %s", info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                    // Preview only available when sending through an Ethereal account
                    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

                    // return the user data
                    return Response.json({status: 200, message:'User found!', data: rows[0]}, {status: 200})
                }
                else {
                    // wrong secret key
                    return Response.json({status: 402, message:'Your access is revoked by your campus!'}, {status: 200})
                }

            }
            else {
                // user doesn't exist in the system
                return Response.json({status: 404, message:'This Regd.No does not match with any campus records!'}, {status: 200})
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
  