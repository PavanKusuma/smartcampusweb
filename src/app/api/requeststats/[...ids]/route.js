import pool from '../../db'
import { Keyverify } from '../../secretverify';

// get the requests based on the user role and timing
// params used for this API
// key, role, branch, status, level, date – for other roles
// key, role, collegeId – for student
// branch value can be 'All' to get complete data

export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

            // check for the user role
            // if SuperAdmin, get all the requests w.r.t status
            if(params.ids[1] == 'SuperAdmin' || params.ids[1] == 'Admin' || params.ids[1] == 'OutingAdmin' || params.ids[1] == 'OutingIssuer' ){

                let q = '';
                    
                // check if the level of stats are basic or detailed
                if(params.ids[4] == 1){
                    
                    // check if the request is asking for complete data or for specific branch
                    if(params.ids[3] == 'All' && params.ids[1] != 'Admin'){
                        // q = 'SELECT requestStatus, count(*) as count FROM request group by requestStatus';
                        // q = 'SELECT s.status AS requestStatus, COUNT(r.requestStatus) AS count FROM (SELECT "Submitted" AS status UNION SELECT "Approved" UNION SELECT "Issued" UNION SELECT "InOuting" UNION SELECT "Rejected" UNION SELECT "Cancelled" UNION SELECT "Returned") AS s LEFT JOIN request r ON s.status = r.requestStatus AND r.isOpen = 1 GROUP BY s.status UNION SELECT "InCampus" AS requestStatus, COUNT(*) AS COUNT FROM user WHERE type = "hostel" and role="student"';
                        q = 'SELECT s.status AS requestStatus, COUNT(r.requestStatus) AS count FROM (SELECT "Submitted" AS status UNION SELECT "Approved" UNION SELECT "Issued" UNION SELECT "InOuting" UNION SELECT "Rejected" UNION SELECT "Cancelled" UNION SELECT "Returned") AS s LEFT JOIN request r ON s.status = r.requestStatus AND r.isOpen = 1 GROUP BY s.status UNION SELECT "InCampus" AS requestStatus, COUNT(*) AS COUNT FROM user WHERE type = "hostel" and (year=1 or year=2 or year=3)';
                    }
                    else {
                        // q = 'SELECT s.status AS requestStatus, COUNT(r.requestStatus) AS count FROM (SELECT "Submitted" AS status UNION SELECT "Approved" UNION SELECT "Issued" UNION SELECT "InOuting" UNION SELECT "Rejected" UNION SELECT "Cancelled" UNION SELECT "Returned") AS s LEFT JOIN request r ON s.status = r.requestStatus AND r.isOpen = 1 GROUP BY s.status UNION SELECT "InCampus" AS requestStatus, COUNT(*) AS COUNT FROM user WHERE type = "hostel" AND branch="'+params.ids[2]+'"';
                        // q = 'SELECT r.requestStatus, count(*) as count FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND u.branch="'+params.ids[2]+'" GROUP BY r.requestStatus';

                        // break down the branch string for admins
                        var branchesString = params.ids[2];

                        // Split the string into an array
                        let branches = branchesString.split(',');

                        // check if there are more than 1 branch
                        var conditionsString = '';
                        if(branches.length > 1){
                            // Build the LIKE conditions with case sensitivity
                            let likeConditions = branches.map(branch => `BINARY CONCAT(u.department,'-',u.branch,'-',u.year) LIKE '%${branch}%'`);

                            // Join the conditions with OR
                            conditionsString = likeConditions.join(' OR ');
                        }
                        else {
                            conditionsString = `BINARY CONCAT(u.department,'-',u.branch,'-',u.year) LIKE '%${branchesString}%'`;
                        }

                        q = `SELECT s.status AS requestStatus, COUNT(r.requestStatus) AS count FROM ( SELECT "Submitted" AS status UNION SELECT "Approved" UNION SELECT "Issued" UNION SELECT "InOuting" UNION SELECT "Rejected" UNION SELECT "Cancelled" UNION SELECT "Returned" UNION SELECT "InCampus" AS status) AS s LEFT JOIN ( SELECT requestStatus, collegeId FROM request WHERE collegeId IN ( SELECT collegeId FROM user u WHERE (${conditionsString})) UNION ALL SELECT "InCampus", collegeId FROM user u WHERE type = "hostel" AND (${conditionsString}) ) AS r ON s.status = r.requestStatus GROUP BY s.status ORDER BY s.status = "InCampus" DESC, s.status`;
                        // q = 'SELECT s.status AS requestStatus, COUNT(r.requestStatus) AS count FROM ( SELECT "Submitted" AS status UNION SELECT "Approved" UNION SELECT "Issued" UNION SELECT "InOuting" UNION SELECT "Rejected" UNION SELECT "Cancelled" UNION SELECT "Returned" UNION SELECT "InCampus" AS status) AS s LEFT JOIN ( SELECT requestStatus, collegeId FROM request WHERE collegeId IN ( SELECT collegeId FROM user WHERE FIND_IN_SET("'+params.ids[2]+'",branch) > 0 ) UNION ALL SELECT "InCampus", collegeId FROM user WHERE type = "hostel" AND (year=1 or year=2 or year=3) AND FIND_IN_SET("'+params.ids[2]+'",branch) > 0) AS r ON s.status = r.requestStatus GROUP BY s.status ORDER BY s.status = "InCampus" DESC, s.status';
                        // q = 'SELECT s.status AS requestStatus, COUNT(r.requestStatus) AS count FROM ( SELECT "Submitted" AS status UNION SELECT "Approved" UNION SELECT "Issued" UNION SELECT "InOuting" UNION SELECT "Rejected" UNION SELECT "Cancelled" UNION SELECT "Returned" UNION SELECT "InCampus" AS status) AS s LEFT JOIN ( SELECT requestStatus, collegeId FROM request WHERE collegeId IN ( SELECT collegeId FROM user WHERE branch = "'+params.ids[2]+'" ) UNION ALL SELECT "InCampus", collegeId FROM user WHERE type = "hostel" AND (year=2 or year=3) AND branch = "'+params.ids[2]+'") AS r ON s.status = r.requestStatus GROUP BY s.status ORDER BY s.status = "InCampus" DESC, s.status';
                    }
                }
                else  {
                    q = `SELECT
                            DATE_FORMAT(months.month, '%Y-%m') AS month,
                            CONCAT(DATE_FORMAT(months.month, '%b'), '-', YEAR(months.month)) AS month_year,
                            COUNT(request.requestId) AS request_count
                        FROM
                            (
                                SELECT DATE_FORMAT(DATE_SUB("`+params.ids[5]+`", INTERVAL n.n + m.m * 10 MONTH), '%Y-%m-01') AS month
                                FROM
                                    (SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL
                                    SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS n
                                CROSS JOIN
                                    (SELECT 0 AS m UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL
                                    SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS m
                                WHERE
                                    DATE_SUB("`+params.ids[5]+`", INTERVAL n.n + m.m * 10 MONTH) >= DATE_SUB(DATE_FORMAT("`+params.ids[5]+`", '%Y-%m-01'), INTERVAL 12 MONTH)
                            ) AS months
                        LEFT JOIN
                            request ON DATE_FORMAT(request.requestDate, '%Y-%m') = DATE_FORMAT(months.month, '%Y-%m')
                        GROUP BY
                            months.month, month_year
                        ORDER BY
                            months.month DESC;
                        `;
                    // q = `SELECT
                    //         DATE_FORMAT(months.month, '%Y-%m') AS month,
                    //         CONCAT(MONTHNAME(months.month), ' ', YEAR(months.month)) AS month_year,
                    //         COUNT(request.requestId) AS request_count
                    //     FROM
                    //         (
                    //             SELECT DATE_FORMAT(DATE_SUB("`+params.ids[5]+`", INTERVAL n.n + m.m * 10 MONTH), '%Y-%m-01') AS month
                    //             FROM
                    //                 (SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL
                    //                 SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS n
                    //             CROSS JOIN
                    //                 (SELECT 0 AS m UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL
                    //                 SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS m
                    //             WHERE
                    //                 DATE_SUB("`+params.ids[5]+`", INTERVAL n.n + m.m * 10 MONTH) >= DATE_SUB(DATE_FORMAT("`+params.ids[5]+`", '%Y-%m-01'), INTERVAL 12 MONTH)
                    //         ) AS months
                    //     LEFT JOIN
                    //         request ON DATE_FORMAT(request.requestDate, '%Y-%m') = DATE_FORMAT(months.month, '%Y-%m')
                    //     GROUP BY
                    //         months.month, month_year
                    //     ORDER BY
                    //         months.month;
                    //     `;
                    
                }

                

                const [rows, fields] = await connection.execute(q);
                connection.release();
            
                // check if user is found
                if(rows.length > 0){
                    // return the requests data
                    return Response.json({status: 200, message:'Data found!', data: rows}, {status: 200})

                }
                else {
                    // user doesn't exist in the system
                    return Response.json({status: 404, message:'No new requests!'}, {status: 200})
                }
            }
            else if(params.ids[1] == 'Student'){

                // this is a combination of 2 queries that will return different status of the collegeId
                // Also it returns if there are any late returns
                let q = 'select \'Returned late\' AS requestStatus, count(*) as count from request where returnedOn > requestTo and collegeId="'+params.ids[2]+'" UNION select requestStatus, count(*) as count from request where collegeId="'+params.ids[2]+'" group by requestStatus';

                const [rows, fields] = await connection.execute(q);
                connection.release();
            
                // check if user is found
                if(rows.length > 0){
                    // return the requests data
                    return Response.json({status: 200, message:'Data found!', data: rows}, {status: 200})

                }
                else {
                    // user doesn't exist in the system
                    return Response.json({status: 404, message:'No new requests!'}, {status: 200})
                }
            }
            
            // if OutingIssuer, get all requests that are issued by OutingIssuer
            // else if(params.ids[1] == 'OutingAssistant'){
            //     const [rows, fields] = await connection.execute('SELECT r.*,u.* FROM request r JOIN user u WHERE r.collegeId = u.collegeId AND requestStatus = "'+params.ids[2]+'" ORDER BY issuedOn DESC LIMIT 20 OFFSET '+params.ids[3]);
            //     connection.release();
            
            //     // check if user is found
            //     if(rows.length > 0){
            //         // return the requests data
            //         return Response.json({status: 200, message:'Data found!', data: rows}, {status: 200})

            //     }
            //     else {
            //         // user doesn't exist in the system
            //         return Response.json({status: 404, message:'No new requests!'}, {status: 200})
            //     }
            // }
            else{
                // wrong role
                return Response.json({status: 401, message:'Unauthorized'}, {status: 200})
            }

            // search for user based on the provided collegeId
            // const [rows, fields] = await connection.execute('SELECT * FROM request where isOpen = 1 and collegeId = "'+params.ids[2]+'" ORDER BY requestDate LIMIT 5 OFFSET '+params.ids[3]);
            
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
  