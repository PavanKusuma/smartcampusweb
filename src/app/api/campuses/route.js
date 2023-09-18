import pool from '../../api/db'

export async function GET(request) {

    const connection = await pool.getConnection();
    const [rows, fields] = await connection.execute('SELECT campusId as campusId, campusName as campusName FROM campus order by modifiedDate DESC');
    connection.release();

    
    // return Response.json({data:rows}, {status: 200})
    return Response.json({data:rows},{data1:fields}, {status: 200})
    
  }
  

