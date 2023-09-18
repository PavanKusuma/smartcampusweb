import pool from '../../db'
import { Keyverify } from '../../secretverify';

// API for updates to user data
// params used for this API
// key, type, collegeId, playerId
// U1 – get hostels
// U2 – update hostels
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){
          
          if(params.ids[1] == 'U1'){
            const connection = await pool.getConnection();
            const [rows, fields] = await connection.execute('SELECT * FROM hostel order by hostelname ASC');
            connection.release();

            
            // return Response.json({data:rows}, {status: 200})
            // return Response.json({data:rows},{data1:fields}, {status: 200})
            return Response.json({status: 200, data: rows, message:'Details found!'}, {status: 200})
          }
          else if(params.ids[1] == 'U2'){
                try {
                    // let q = 'SELECT * FROM user WHERE collegeId LIKE "%'+params.ids[2]+'%"';
                    // console.log(q);
                    let q = 'SELECT u.*, IFNULL(d.fatherName, "") AS fatherName, IFNULL(d.fatherPhoneNumber, "") AS fatherPhoneNumber, IFNULL(d.motherName, "") AS motherName, IFNULL(d.motherPhoneNumber, "") AS motherPhoneNumber, IFNULL(d.address, "") AS address, IFNULL(d.guardianName, "") AS guardianName, IFNULL(d.guardianPhoneNumber, "") AS guardianPhoneNumber, IFNULL(d.hostelId, "") AS hostelId, IFNULL(d.roomNumber, "") AS roomNumber, IFNULL(h.hostelName, "") AS hostelName FROM user u LEFT JOIN user_details d ON u.collegeId = d.collegeId LEFT JOIN `hostel` h ON d.hostelId = h.hostelId WHERE u.role = "Student" AND u.profileUpdated=1 AND u.collegeId LIKE "%'+params.ids[2]+'%" LIMIT 20 OFFSET '+params.ids[3];
                    const [rows, fields] = await connection.execute(q);
                    connection.release();
                    // return successful update

                    // check if user is found
                    if(rows.length > 0){
                        // return the requests data
                        return Response.json({status: 200, data: rows, message:'Details found!'}, {status: 200})

                    }
                    else {
                        // user doesn't exist in the system
                        return Response.json({status: 201, message:'No data found!'}, {status: 200})
                    }
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No user found!'}, {status: 200})
                }
            }
            else {
                return Response.json({status: 404, message:'No Student found!'}, {status: 200})
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
  