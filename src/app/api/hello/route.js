import { log } from "console";

export async function GET(request) {
  // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
  callAPI()
  return new Response('Hello, Next.js!')

}

async function callAPI(){

  const result  = await fetch("https://webprossms.webprosindia.com/submitsms.jsp?user=SVCEWB&key=c280f55d6bXX&mobile=+917799813519&message=Dear Parent, your ward Pavan is absent for the periods 4,5 on 25May. Shri Vishnu Engineering College for Women&senderid=SVECWB&accusage=1&entityid=1001168809218467265&tempid=1007595110436205179", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
      });
        const queryResult = await result.json() // get data
// console.log(result);
console.log(queryResult);
        // check for the status
        // if(queryResult.status == 200){

        //     // check if data exits
        //     if(queryResult.data.length > 0){

        //         // set the state
        //         setRequests(queryResult.data)
        //     }
        //     else {
        //         console.log('No Data ')
        //         setDataFound(false)
        //     }
        // }
}

function callAPI1() {
  const url = 'webprossms.webprosindia.com/submitsms.jsp?user=SVCEWB&key=c280f55d6bXX&mobile=+919542918778&message=Dear Parent, your ward Pavan is absent for the periods 4,5 on 25May. Shri Vishnu Engineering College for Women&senderid=SVECWB&accusage=1&entityid=1001168809218467265&tempid=1007595110436205179';


  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      // Handle the response data
      console.log(data);
    })
    .catch((error) => {
      // Handle the request error
      console.error(error);
    });
}