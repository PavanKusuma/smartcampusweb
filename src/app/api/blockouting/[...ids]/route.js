import pool from '../../db'
import { Keyverify } from '../../secretverify';
import dayjs from 'dayjs'

// create new officialrequest for outing by the Admins
// key, what, oRequestId, type, duration, from, to, by, description, branch, year – Super admin
// key, what, today – Super admin, Outing Issuer Admin, Outing Issuer
// key, what, today, branch – Department Admin
// key, what, today, branch, year – student

// what is used to understand what the request is about – whether to send data back or create data
// what – If it is 0, then create
// what – If it is 1, fetch data for all branches – Super admin
// what – If it is 2, fetch data for specific branch – Department Admin
// what – If it is 3, fetch data for specific branch and year – student
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    // current date time for updating
    var currentDate =  dayjs(new Date(params.ids[2])).format('YYYY-MM-DD');
    console.log(currentDate);

    try{
        // authorize secret key
        if(await Keyverify(params.ids[0])){

            if(params.ids[1] == 0){ // create official / blocked dates data
                try {
                    // create query for insert
                    const q = 'INSERT INTO officialrequest (oRequestId, oType, duration, oFrom, oTo, oBy,oByName, description, campusId, branch, year, createdOn) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    // create new request
                    const [rows, fields] = await connection.execute(q, [ params.ids[2], params.ids[3], params.ids[4], params.ids[5], params.ids[6], params.ids[7], params.ids[8], params.ids[9], params.ids[10], params.ids[11], params.ids[12],params.ids[13] ]);
                    connection.release();
                    // return the user data
                    return Response.json({status: 200, message: params.ids[3]+' request submitted!'}, {status: 200})
                } catch (error) {
                    // user doesn't exist in the system
                    return Response.json({status: 404, message:'Error creating request. Please try again later!'+error.message}, {status: 200})
                }
            }
            else if(params.ids[1] == 1){ // fetch data for all branches – Super admin & Outing Issuer Admin & Outing Issuer
                // console.log('SELECT * from officialrequest WHERE (DATE(oFrom) >= DATE("'+currentDate+'") OR DATE(oTo) >= DATE("'+currentDate+'")) ORDER BY createdOn DESC');
                const [rows, fields] = await connection.execute('SELECT * from officialrequest WHERE (oFrom >= "'+currentDate+'" OR oTo >= "'+currentDate+'") ORDER BY createdOn DESC');
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
            else if(params.ids[1] == 2){ // fetch data for specific branch – Department Admin
                const [rows, fields] = await connection.execute('SELECT * from officialrequest WHERE branch = "All" or FIND_IN_SET("'+params.ids[3]+'", branch)>0 AND (oFrom >= "'+currentDate+'" OR oTo >= "'+currentDate+'") ORDER BY oFrom DESC');
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
            else if(params.ids[1] == 3){ // fetch data for specific branch and year – student
                const [rows, fields] = await connection.execute('SELECT * from officialrequest WHERE campusId = "'+params.ids[3]+'" AND (branch = "All" or FIND_IN_SET("'+params.ids[4]+'", branch)>0) AND (oFrom >= "'+currentDate+'" OR oTo >= "'+currentDate+'") ORDER BY oFrom DESC');
                // const [rows, fields] = await connection.execute('SELECT * from officialrequest WHERE (campusId = "All" or FIND_IN_SET("'+params.ids[5]+'", campusId)>0) AND (course = "All" or FIND_IN_SET("'+params.ids[6]+'", course)>0) AND (branch = "All" or FIND_IN_SET("'+params.ids[3]+'", branch)>0) AND (year="All" or FIND_IN_SET("'+params.ids[4]+'",year)>0) AND (oFrom >= "'+currentDate+'" OR oTo >= "'+currentDate+'") ORDER BY oFrom DESC');
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
  

