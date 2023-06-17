import { log } from "console";
import dayjs from 'dayjs'

export async function GET(request) {
  
  // sendSMS(params.ids[11], params.ids[12], dayjs(params.ids[6]).format('YYYY-MM-DD'), dayjs(params.ids[7]).format('YYYY-MM-DD'))
  // console.log(dayjs('2023-06-15 10:17:11').format('YYYY-MM-DD'))
  // console.log(dayjs('2023-06-15 10:17:11').format('YYYY-MM-DD'))
  // console.log(dayjs('2023-06-15 10:17:11').format('DD-MM-YY hh:mm A'))
  // console.log(dayjs('2023-06-15 16:17:11').format('hh:mm A, DD-MM-YY'))
  return new Response('Hello, Next.js!')

}

// async function callAPI(){

//   const result  = await fetch("http://webprossms.webprosindia.com/submitsms.jsp?user=SVCEWB&key=c280f55d6bXX&mobile=+917799813519&message=Dear Parent, your ward, Pavan has applied for outing from 13/07/23 to 15/06/23.  SVECWB Hostels&senderid=SVECWB&accusage=1&entityid=1001168809218467265&tempid=1007149047352803219", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//         },
//       });
//         const queryResult = await result.text() // get data
//         console.log(queryResult);
// }