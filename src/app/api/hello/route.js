import { log } from "console";

export async function GET(request) {
  
  
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