'use client'

import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { Check, Info, SpinnerGap, X } from 'phosphor-react'
import React, { useCallback, useEffect, useState, useRef } from 'react'
const inter = Inter({ subsets: ['latin'] })
import styles from '../../../app/page.module.css'
import Biscuits from 'universal-cookie'
const biscuits = new Biscuits
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import ImageWithShimmer from '../../components/imagewithshimmer'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// const storage = getStorage();
import firebase from '../../../app/firebase';
import Webcam from 'react-webcam';

const storage = getStorage(firebase);

// Create a child reference
// const imagesRef = ref(storage, 'images');
// imagesRef now points to 'images'

// Child references can also take paths delimited by '/'
const spaceRef = ref(storage, '/');

// const spaceRef = ref(storage, 'images/space.jpg');

  const getRequests = async (Keyverify,role, status,offset,collegeId,branch) => 

    fetch("/api/requests/"+Keyverify+"/"+role+"/"+status+"/"+offset+"/"+collegeId+"/"+branch, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
  const updateRequestAPI = async (Keyverify,stage,requestId,name,collegeId,role, status,approvedOn, comment, playerId) => 
    fetch("/api/updaterequests/"+Keyverify+"/"+stage+"/"+requestId+"/"+name+"/"+collegeId+"/"+role+"/"+status+"/"+approvedOn+"/"+comment+"/"+playerId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
   

// pass state variable and the method to update state variable
export default function Registration() {

    // variable to store the active tab
    const [selectedTab, setSelectedTab] = useState('Outing');
    function handleTabChange(tabName) {
        setSelectedTab(tabName)
        console.log(tabName);
      }

    // create a router for auto navigation
    const router = useRouter();

    // user state and requests variable
    const [user, setUser] = useState();
    const [requests, setRequests] = useState();
    const [dataFound, setDataFound] = useState(true); // use to declare 0 rows
    
    // this is choose from different statuses for viewing data – In tabs
    const [viewByStatus, setViewByStatus] = useState('');

    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };


    //create new date object
    const today = new dayjs();

    // get the user and fire the data fetch
    useEffect(()=>{

        let cookieValue = biscuits.get('sc_user_detail')
            if(cookieValue){
                const obj = JSON.parse(decodeURIComponent(cookieValue)) // get the cookie data

                // set the user state variable
                setUser(obj)
                
                
                // get the requests data if doesnot exist
                // if(!requests){

                //     // set the view by status based on the role
                //     if(obj.role == 'Student'){
                //         console.log('Student');
                //         setViewByStatus('Returned')
                //         getData(obj.role, 'Returned', obj.collegeId, obj.branch);
                //     }
                //     else if(obj.role == 'SuperAdmin' || obj.role == 'Admin'){
                //         console.log('SuperAdmin');
                //         setViewByStatus('Submitted')
                //         getData(obj.role, 'Submitted', obj.collegeId, obj.branch);
                //     }
                //     else if(obj.role == 'OutingAdmin' || obj.role == 'OutingIssuer'){
                //         console.log('OutingAdmin');
                //         setViewByStatus('Approved')
                //         getData(obj.role, 'Approved', obj.collegeId, obj.branch);
                //     }
                //     else if(obj.role == 'OutingAssistant'){
                //         console.log('OutingAssistant');
                //         setViewByStatus('Issued')
                //         getData(obj.role, 'Issued', obj.collegeId, obj.branch);
                //     }   
                // }
            }
            else{
                console.log('Not found')
                router.push('/')
            }
    },[requests]);

    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);

    const startCapture = async () => {
        try {
        const userMedia = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(userMedia);
        videoRef.current.srcObject = userMedia;
        } catch (error) {
        console.error('Error accessing webcam:', error);
        }
    };

    const stopCapture = () => {
        if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        }
    };


    const webcamRef = React.useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);

    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc); // set captured image

        const capturedImage = new File([imageSrc], 'test101.jpeg', { type: 'image/jpeg' }); // create a file for captured image
        uploadPics(capturedImage); // handle it

    }, [webcamRef]);
    
    const reTake = React.useCallback(() => {
        setCapturedImage(null);
    });


    async function uploadPics(file){
        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: 'image/jpeg'
        };
        
        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, '/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
        (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case 'paused':
            console.log('Upload is paused');
            break;
            case 'running':
            console.log('Upload is running');
            break;
        }
        }, 
        (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
            case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
            case 'storage/canceled':
            // User canceled the upload
            break;

            // ...

            case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
        }, 
        () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
        });
        }
        );
  
    }

    // get the requests data
    // for the user based on their role.
    // the actions will be seen that are specific to the role and by the selected status
    async function getData(role, status, collegeId, branch){
        const result  = await getRequests(process.env.NEXT_PUBLIC_API_PASS, role, status, 0, collegeId, branch)
        const queryResult = await result.json() // get data
// console.log(queryResult);
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
        else if(queryResult.status == 401) {
            console.log('Not Authorized ')
            setDataFound(false)
        }
        else if(queryResult.status == 404) {
            console.log('Not more requests')
            setDataFound(false)
        }
        else {
            console.log('Yes the do!');
            // router.push('/')
            setDataFound(false)
        }
    }

    // handle user action
    // use the function outside the main component and pass the necessary state variables
    const handleClick = useCallback(({requestId, status, playerId}) => {
        // print(playerId);
        console.log(playerId);
        // stage 1
        if(user.role == 'Admin' || user.role == 'SuperAdmin'){
            updateRequest("S1", requestId, status, user, document.getElementById(requestId).value, today, playerId)
        }
        // stage 2
        else if(user.role == 'OutingAdmin' || user.role == 'OutingIssuer'){
            updateRequest("S2", requestId, status, user, document.getElementById(requestId).value, today, playerId)
        }
    },[user]);

    // check if we can create table like UI
    function hideColumn(){
        console.log(spaceRef);
    }

    // clear cookies or logout
    function clearCookies(){

        //  document.cookie = "";
        biscuits.remove('sc_user_detail')

        // clearing the state variable
        setUser()
        
    }
    
  return (
    
     <div>

        {/* <div className={`${styles.menuItems} ${inter.className}`}>
            <div className={`${styles.menuItem} ${selectedTab === 'Outing' ? styles.menuItem_selected : ''}`} onClick={() => handleTabChange('Outing')}>Outing</div>
            <div className={`${styles.menuItem} ${selectedTab === 'Students' ? styles.menuItem_selected : ''}`} onClick={() => handleTabChange('Students')}>Students</div>
            <div className={`${styles.menuItem} ${selectedTab === 'Circulars' ? styles.menuItem_selected : ''}`} onClick={() => handleTabChange('Circulars')}>Circulars</div>
        </div>
         */}
        <div style={{border: '0.5px solid #E5E7EB', width:'100vw'}}></div>
              

          <div className={styles.maindivcenter}>
            
            <h1 className={inter.className}>Student Registration</h1><br/>
              <p className={`${inter.className} ${styles.headingtext2}`}>
              Fill in the fields and submit to register student into Campus database.
              </p>
             
              <br />
            {/* <div>{children}</div> */}
            {/* <ProjectsList /> */}
            {/* <ProjectsList allProjects={allProjects}/> */}
            <br />
            {/* <MoreBtn projects={projects}/> */}
            {/* <MoreBtn skip={skip} projects={projects}/> */}
          

      

        {/* check if data is not – API return 0 rows */}
    
    {/* if data is getting fetched, show the loading */}
    {/* {(!requests) ? 
    ((!dataFound) ?  */}
        {/* <div className={styles.horizontalsection}>
            <Check className={styles.icon} />
            <p className={`${inter.className} ${styles.text3}`}>No requests yet!</p> 
        </div> */}
        {/* <div className={styles.horizontalsection}>
            <SpinnerGap className={`${styles.icon} ${styles.load}`} />
            <p className={`${inter.className} ${styles.text3}`}>Loading...</p> 
        </div> */}
        {/* ) */}
         
        <div className={styles.titlecard}>

                <div className={styles.carddatasection} key={1234}>
                    <div className={styles.projectsection}>
                       
                            <div className={styles.verticalsection}>
                                <h5 className={`${inter.className} ${styles.text1}`}>{1234}</h5>
                                {/* <p className={`${inter.className} ${styles.text2}`} dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br>') }}></p> */}
                                {/* <p className={`${inter.className} ${styles.text2}`}>{project.description.replace(/\n/g, '\n')}</p> */}
                                
                                
                                
                                    {/* <p className={(requestItem.requestType=='requestItem' ? 'requestItem_chip' : 'outing_chip')}>{requestItem.requestType}</p> */}
                                        

                                        <div>
                                            <p className={`${inter.className} ${styles.text3_heading}`}>Reason:</p>
                                            <p className={`${inter.className} ${styles.text1}`}>Checking description</p>
                                        </div>
                                        <br/>
                                        
                                        <br/>
                                        
                                            

                                    </div>
                            
                       
                    </div>
                    <br/>
                    
                    {/* <Image
                        src={'https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/22B05A1214.JPG?alt=media'}
                        alt="Image"
                        width={100}
                        height={200}
                        // onLoad={() => setIsLoading(false)}
                        /> */}

{/* <div>
      <button onClick={startCapture}>Start Capture</button>
      <button onClick={stopCapture}>Stop Capture</button>
      <video ref={videoRef} autoPlay playsInline />
    </div> */}


    <div>
    {!capturedImage ?
      <div width='200px'>
        <Webcam 
            width={300}
            height={300}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
        />
        <button onClick={capture}>Capture</button>
      </div>
      :
      <br/>}

      

        {/* <input type="file" onChange={()=>handleFileChange()}  />
        <button onClick={()=>hideColumn()} >Upload</button> */}

                    <div className={styles.horizontalsection}>
                        {capturedImage ? 
                        <div>
                                <img src={capturedImage} alt="Captured" />
                                <button onClick={reTake}>Retake</button>
                                </div>
                                :
                                <br/>
                                }
                            </div>
                    </div>
                </div>
            {/* )} */}
        </div>
        {/* } */}
    <br/>
    </div>
    </div>
    
    
  );
}


    // update the request with status and other details
    // Keyverify,stage,requestId,name,collegeId,role,status,comment
    async function updateRequest(stage, requestId, status, myUser, comment, today, playerId){

        const result  = await updateRequestAPI(process.env.NEXT_PUBLIC_API_PASS, stage, requestId, myUser.username, myUser.collegeId, myUser.role, status,dayjs(today.toDate()).format("YYYY-MM-DD HH:mm:ss"),((comment.length > 0) ? comment : ''), playerId)
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
