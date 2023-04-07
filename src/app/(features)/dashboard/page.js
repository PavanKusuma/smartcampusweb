'use client'

import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Check, Info, SpinnerGap, X } from 'phosphor-react'
import { useCallback, useEffect, useState } from 'react'
const inter = Inter({ subsets: ['latin'] })
import styles from '../../../app/page.module.css'
import Biscuits from 'universal-cookie'
const biscuits = new Biscuits
import dateFormat from 'dateformat'
import { useRouter } from 'next/navigation'

  export const getRequests = async (Keyverify,role, status,offset,collegeId,branch) => 

    fetch("/api/requests/"+Keyverify+"/"+role+"/"+status+"/"+offset+"/"+collegeId+"/"+branch, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
  export const updateRequestAPI = async (Keyverify,stage,requestId,name,collegeId,role, status,comment) => 
    fetch("/api/updaterequests/"+Keyverify+"/"+stage+"/"+requestId+"/"+name+"/"+collegeId+"/"+role+"/"+status+"/"+comment, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
    
    

// pass state variable and the method to update state variable
export default function Dashboard() {

    // create a router for auto navigation
    const router = useRouter();

    // user state and requests variable
    const [user, setUser] = useState();
    const [requests, setRequests] = useState();
    const [dataFound, setDataFound] = useState(true); // use to declare 0 rows
    
    // this is choose from different statuses for viewing data – In tabs
    const [viewByStatus, setViewByStatus] = useState('');

    // table columns specific states
    const [t_duration, setTDuration] = useState(true);

    // get the user and fire the data fetch
    useEffect(()=>{

        let cookieValue = biscuits.get('sc_user_detail')
            if(cookieValue){
                const obj = JSON.parse(decodeURIComponent(cookieValue)) // get the cookie data

                // set the user state variable
                setUser(obj)
                
                
                // get the requests data if doesnot exist
                if(!requests){

                    // set the view by status based on the role
                    if(obj.role == 'Student'){
                        console.log('Student');
                        setViewByStatus('Submitted')
                        getData(obj.role, 'Submitted', obj.collegeId, obj.branch);
                    }
                    else if(obj.role == 'SuperAdmin' || obj.role == 'Admin'){
                        console.log('SuperAdmin');
                        setViewByStatus('Submitted')
                        getData(obj.role, 'Submitted', obj.collegeId, obj.branch);
                    }
                    else if(obj.role == 'OutingAdmin' || obj.role == 'OutingIssuer'){
                        console.log('OutingAdmin');
                        setViewByStatus('Approved')
                        getData(obj.role, 'Approved', obj.collegeId, obj.branch);
                    }
                    else if(obj.role == 'OutingAssistant'){
                        console.log('OutingAssistant');
                        setViewByStatus('Issued')
                        getData(obj.role, 'Issued', obj.collegeId, obj.branch);
                    }
                    
                    
                }

                

            }
            else{
                console.log('Not found')
                router.push('/')
            }
    },[]);


    // get the requests data
    // for the user based on their role.
    // the actions will be seen that are specific to the role and by the selected status
    async function getData(role, status, collegeId, branch){
        const result  = await getRequests(process.env.NEXT_PUBLIC_API_PASS, role, status, 0, collegeId, branch)
        const queryResult = await result.json() // get data

        // check for the status
        if(queryResult.status == 200){

            // check if data exits
            if(queryResult.data.length > 0){

                // set the state
                setRequests(queryResult.data)
            }
            else {
                console.log('No Data ')
                setDataFound(false)
            }
        }
        else if(queryResult.state == 401) {
            console.log('Not Authorized ')
            setDataFound(false)
        }
        else {
            router.push('/')
            setDataFound(false)
        }
    }

    // handle user action
    // use the function outside the main component and pass the necessary state variables
    const handleClick = useCallback(({requestId, status}) => {
        
        // stage 1
        if(user.role == 'Admin' || user.role == 'SuperAdmin'){
            updateRequest("S1", requestId, status, user, document.getElementById(requestId).value)
        }
        // stage 2
        else if(user.role == 'OutingAdmin' || user.role == 'OutingIssuer'){
            updateRequest("S2", requestId, status, user, document.getElementById(requestId).value)
        }
    },[user]);

    // check if we can create table like UI
    function hideColumn(){
        setTDuration(!t_duration)
    }

    
  return (
    
    <div>
        {/* check if data is not – API return 0 rows */}
    
    {/* if data is getting fetched, show the loading */}
    {(!requests) ? 
    ((!dataFound) ? 
        <div className={styles.horizontalsection}>
            <Check className={styles.icon} />
            <p className={`${inter.className} ${styles.text3}`}>No requests yet!</p> 
        </div>
        : 
        <div className={styles.horizontalsection}>
            {/* <Loader className={`${styles.icon} ${styles.load}`} /> */}
            <SpinnerGap className={`${styles.icon} ${styles.load}`} />
            <p className={`${inter.className} ${styles.text3}`}>Loading...</p> 
        </div>)
        : 
        <div className={styles.titlecard}>
            {requests.map(requestItem => (

                <div className={styles.carddatasection} key={requestItem.requestId}>
                    <div className={styles.projectsection}>
                       
                            <div className={styles.verticalsection}>
                                <h5 className={`${inter.className} ${styles.text1}`}>{requestItem.requestId}</h5>
                                {/* <p className={`${inter.className} ${styles.text2}`} dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br>') }}></p> */}
                                {/* <p className={`${inter.className} ${styles.text2}`}>{project.description.replace(/\n/g, '\n')}</p> */}
                                
                                
                                <div key={requestItem.requestId}  className={styles.card_block1}  style={{margin:'8px 16px 8px 0px'}} >

                                    {/* <p className={(requestItem.requestType=='requestItem' ? 'requestItem_chip' : 'outing_chip')}>{requestItem.requestType}</p> */}
                                        

                                        <div>
                                            <p className={`${inter.className} ${styles.text3_heading}`}>Reason:</p>
                                            <p className={`${inter.className} ${styles.text1}`}>{requestItem.description}</p>
                                        </div>
                                        <br/>
                                        {(t_duration) ? 
                                        <div>
                                            <p className={`${inter.className} ${styles.text3_heading}`}>Duration: </p>
                                            <p className={`${inter.className} ${styles.text2}`}>{dateFormat(requestItem.requestFrom, "dd mmm, yyyy")} - {dateFormat(requestItem.requestTo, "dd mmm, yyyy")}
                                                <br/><span className={`${inter.className} ${styles.text3}`}>{requestItem.duration} day(s)</span>
                                            </p>
                                        </div>
                                        : ''}
                                        <br/>
                                        {((requestItem.requestStatus=='Submitted')) ?
                                        <div>
                                            <p className={`${inter.className} ${styles.text3_heading}`}> Status:</p>
                                            <p className={`${inter.className} ${styles.text2} ${styles.success}`}>Submitted</p> 
                                            <p className={`${inter.className} ${styles.text3}`}>on {dateFormat(requestItem.requestDate, "dd mmm, yyyy HH:mm:ss")}</p>
                                        </div>
                                         : ''}
                                         
                                         <br/>
                                        {(requestItem.comment.length) > 2 ? 
                                        <div>
                                            <p className={`${inter.className} ${styles.text3_heading}`}>Comments: </p>
                                            <p className={`${inter.className} ${styles.text3}`} style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{requestItem.comment}</p>
                                        </div>
                                            : ''}
                                            <br/>
                                            {(requestItem.requestStatus=='Approved') ? 
                                            <div >
                                                <p className={`${inter.className} ${styles.text3_heading}`}> Status:</p>
                                                <p className={`${inter.className} ${styles.text2} ${styles.success}`}>Submitted</p> 
                                                <p className={`${inter.className} ${styles.text3}`}>on {dateFormat(requestItem.requestDate, "dd mmm, yyyy HH:mm:ss")}</p>
                                                <br/>
                                                <p className={`${inter.className} ${styles.text2} ${styles.success}`}>{requestItem.requestStatus}</p>
                                                <p className={`${inter.className} ${styles.text3}`}>by {requestItem.approverName} on {dateFormat(requestItem.approvedOn, "dd mmm, yyyy HH:mm:ss")}
                                                <br/>Waiting for Hostel Administrator to allow the outing.</p>
                                            </div>
                                            : ''}
                                            
                                            {/* {(requestItem.requestStatus)=='Allowed' ? 
                                            <div>
                                                <p className={`${inter.className} ${styles.text3_heading}`}> Status:</p>
                                                <p className={`${inter.className} ${styles.text2} ${styles.success}`}>Approved</p>
                                                <p className={`${inter.className} ${styles.text3}`}>by {requestItem.approverName} on {dateFormat(requestItem.approvedOn, "dd mmm, yyyy HH:mm:ss")}</p>

                                                <p className={`${inter.className} ${styles.text2} ${styles.success}`}>Allowed</p>
                                                <p className={`${inter.className} ${styles.text3}`}>by {requestItem.allowedName} on {dateFormat(requestItem.allowedOn, "dd mmm, yyyy HH:mm:ss")}
                                                <br/>Waiting for warden to issue outing </p>

                                            </div>
                                            : ''} */}
                                            
                                            {(requestItem.requestStatus)=='Issued' ? 
                                            <div>
                                                <p className={`${inter.className} ${styles.text3_heading}`}> Status:</p>
                                                <p className={`${inter.className} ${styles.text2} ${styles.success}`}>Submitted</p> 
                                                <p className={`${inter.className} ${styles.text3}`}>on {dateFormat(requestItem.requestDate, "dd mmm, yyyy HH:mm:ss")}</p>
                                                <br/>
                                                <p className={`${inter.className} ${styles.text2} ${styles.success}`}>Approved</p>
                                                <p className={`${inter.className} ${styles.text3}`}>by {requestItem.approverName} on {dateFormat(requestItem.approvedOn, "dd mmm, yyyy HH:mm:ss")}</p>
                                                
                                                {/* <p className={`${inter.className} ${styles.text2} ${styles.success}`}>Allowed</p>
                                                <p className={`${inter.className} ${styles.text3}`}>by {requestItem.allowedName} on {dateFormat(requestItem.allowedOn, "dd mmm, yyyy HH:mm:ss")}</p> */}
                                                <br/>
                                                <p className={`${inter.className} ${styles.text2} ${styles.success}`}>Issued</p>
                                                <p className={`${inter.className} ${styles.text3}`}>by {requestItem.issuerName} on {dateFormat(requestItem.issuedOn, "dd mmm, yyyy HH:mm:ss")}
                                                <br/>Security to update on return </p>
                                            </div>
                                            : ''}
                                            
                                            {(requestItem.requestStatus=='Returned') ?
                                            <div>
                                                <p className={`${inter.className} ${styles.text3_heading}`}> Status:</p>
                                                <p className={`${inter.className} ${styles.text2} ${styles.success}`}>Submitted</p> 
                                                <p className={`${inter.className} ${styles.text3}`}>on {dateFormat(requestItem.requestDate, "dd mmm, yyyy HH:mm:ss")}</p>
                                                <br/>
                                                <p className={`${inter.className} ${styles.text2} ${styles.success}`}>Approved</p>
                                                <p className={`${inter.className} ${styles.text3}`}>by {requestItem.approverName} on {dateFormat(requestItem.approvedOn, "dd mmm, yyyy HH:mm:ss")}</p>
                                                
                                                {/* <p className={`${inter.className} ${styles.text2} ${styles.success}`}>Allowed</p>
                                                <p className={`${inter.className} ${styles.text3}`}>by {requestItem.allowedName} on {dateFormat(requestItem.allowedOn, "dd mmm, yyyy HH:mm:ss")}</p> */}
                                                <br/>
                                                <p className={`${inter.className} ${styles.text2} ${styles.success}`}>Issued</p>
                                                <p className={`${inter.className} ${styles.text3}`}>by {requestItem.issuerName} on {dateFormat(requestItem.issuedOn, "dd mmm, yyyy HH:mm:ss")}</p>
                                                <br/>
                                                <p className={`${inter.className} ${styles.text2} ${styles.success}`}>Returned</p>
                                                <p className={`${inter.className} ${styles.text3}`}>on {dateFormat(requestItem.returnedOn, "dd mmm, yyyy HH:mm:ss")}</p>
                                            </div>
                                             : ''}
                                            <br/>

                                            {((requestItem.requestStatus=='Rejected')) ?
                                            <div>
                                                <p className={`${inter.className} ${styles.text3_heading}`}> Status:</p>
                                                <p className={`${inter.className} ${styles.text2} ${styles.success}`}>Submitted</p> 
                                                <p className={`${inter.className} ${styles.text3}`}>on {dateFormat(requestItem.requestDate, "dd mmm, yyyy HH:mm:ss")}</p>
                                                <br/>
                                                <p className={`${inter.className} ${styles.text3_heading}`}> Status:</p>
                                                <p className={`${inter.className} ${styles.text2} ${styles.error}`}>Rejected</p>
                                                {(requestItem.issuedOn != null) ?
                                                    <p className={`${inter.className} ${styles.text3}`}>by {requestItem.issuerName} on {dateFormat(requestItem.issuedOn, "dd mmm, yyyy HH:mm:ss")}</p> 
                                                    : ''
                                                        }
                                                
                                                
                                                
                                                {/* <button className={`${inter.className} ${styles.text2} ${styles.success} ${styles.secondarybtn}`} value="close" id={requestItem.requestId}  onClick={() => this.closeRequest(requestItem.requestId)} style={{verticalAlign:'text-top'}}>
                                                    <Check size={16} style={{verticalAlign:'text-top'}} /> CLOSE REQUEST </button> */}
                                            </div>
                                             : ''}
                                            
                                            {/* Actions to be taken based on the role */}
                                            {((user.role == 'SuperAdmin') || user.role == 'Admin') ?
                                            <div className={styles.verticalsection} style={{gap: '8px', width:'100%'}} >
                                                <div><input className={`${inter.className} ${styles.textInput}`} id={requestItem.requestId} placeholder="Type your comment here..."  type="text"/></div>
                                                <div className={styles.horizontalsection} style={{gap: '8px'}}>
                                                    <button className={`${inter.className} ${styles.text2} ${styles.success} ${styles.primarybtn}`} onClick={()=>handleClick({requestId: requestItem.requestId, status: 'Allowed'})} style={{verticalAlign:'text-top'}}>
                                                        <Check size={16} style={{verticalAlign:'text-top'}} /> Approve </button>
                                                    <button className={`${inter.className} ${styles.text2} ${styles.success} ${styles.secondarybtn}`} onClick={()=>handleClick({requestId: requestItem.requestId, status: 'Rejected'})} style={{verticalAlign:'text-top'}}>
                                                        <X size={16} style={{verticalAlign:'text-top'}} /> Reject </button>
                                                    <button className={`${inter.className} ${styles.text2} ${styles.success} ${styles.teritarybtn}`} style={{verticalAlign:'text-top'}}>
                                                        <Info size={16} style={{verticalAlign:'text-top'}} /> More details </button>
                                                </div>
                                            </div>
                                             : ''}
                                            
                                             {(user.role == 'OutingAdmin' || user.role == 'OutingIssuer') ?
                                            <div className={styles.horizontalsection} style={{gap: '8px'}}>
                                                <button className={`${inter.className} ${styles.text2} ${styles.success} ${styles.primarybtn}`} onClick={()=>handleClick({requestId: requestItem.requestId, status: 'Issued'})} style={{verticalAlign:'text-top'}}>
                                                    <Check size={16} style={{verticalAlign:'text-top'}} /> Issue </button>
                                                <button className={`${inter.className} ${styles.text2} ${styles.success} ${styles.secondarybtn}`} onClick={()=>handleClick({requestId: requestItem.requestId, status: 'Rejected'})} style={{verticalAlign:'text-top'}}>
                                                    <X size={16} style={{verticalAlign:'text-top'}} /> Reject </button>
                                                <button className={`${inter.className} ${styles.text2} ${styles.success} ${styles.teritarybtn}`} style={{verticalAlign:'text-top'}}>
                                                    <Info size={16} style={{verticalAlign:'text-top'}} /> More details </button>
                                            </div>
                                             : ''}


                                    </div>
                            </div>
                       
                       
                    </div>
                    <div className={styles.horizontalsection}>
                    
                        <button onClick={()=>hideColumn()} >Hide Duration </button>
                        {/* <div className={`${styles.likediv} ${styles.smallbtn}`} onClick={() => handleClick(project)}>
                            <ThumbsUp className={styles.icon} />
                            <p className={`${inter.className} ${styles.text3}`}>{likes}</p>
                        </div> */}
                    
                    </div>
                </div>
            ))}
        </div>
        }
    <br/>
    </div>
    
    
  );
}


    // update the request with status and other details
    // Keyverify,stage,requestId,name,collegeId,role,status,comment
    async function updateRequest(stage, requestId, status, myUser, comment){

        const result  = await updateRequestAPI(process.env.NEXT_PUBLIC_API_PASS, stage, requestId, myUser.username, myUser.collegeId, myUser.role, status,((comment.length > 0) ? comment : ''))
        const queryResult = await result.json() // get data

        // check for the status
        if(queryResult.status == 200){
            console.log(queryResult.message)
        }
        else if(queryResult.state == 401) {
            console.log('Not Authorized ')
        }
        else {
            console.log('Some error '+queryResult.message)
        }
    }
