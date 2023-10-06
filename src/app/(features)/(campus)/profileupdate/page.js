'use client'

import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { Check, Info, SpinnerGap, X } from 'phosphor-react'
import React, { useCallback, useEffect, useState, useRef } from 'react'
const inter = Inter({ subsets: ['latin'] })
import styles from '../../../../app/page.module.css'
import Biscuits from 'universal-cookie'
const biscuits = new Biscuits
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// const storage = getStorage();
import firebase from '../../../../app/firebase';
import Webcam from 'react-webcam';

const storage = getStorage(firebase, "gs://smartcampusimages-1.appspot.com");

// Create a child reference
// const imagesRef = ref(storage, 'images');
// imagesRef now points to 'images'

// Child references can also take paths delimited by '/'
const spaceRef = ref(storage, '/');

// const spaceRef = ref(storage, 'images/space.jpg');
// check for the user
const checkUser = async (pass, id) => 
  
fetch("/api/user/"+pass+"/U6/"+id+"/0", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// declare the apis of this page
const submitUser = async (pass, id) => 
  
fetch("/api/user/"+pass+"/U7/"+id, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// pass state variable and the method to update state variable
export default function ProfileUpdate() {

    // create a router for auto navigation
    const router = useRouter();

    // user state and requests variable
    const [user, setUser] = useState();
    const [collegeId, setCollegeId] = useState('');
    const [inputError, setInputError] = useState(false);
    const [searching, setSearching] = useState(false);
    const [studentName, setStudentName] = useState(false);
    const [studentImage, setStudentImage] = useState(false);
    const [fatherImage, setFatherImage] = useState(false);
    const [motherImage, setMotherImage] = useState(false);
    const [guardianImage, setGuardianImage] = useState(false);
    const [guardianImage2, setGuardian2Image] = useState(false);

    const [capturedStudentImage, setCapturedStudentImage] = useState(null);
    const [studentNameValue, setStudentNameValue] = useState(null);
    const [capturedFatherImage, setCapturedFatherImage] = useState(null);
    const [capturedMotherImage, setCapturedMotherImage] = useState(null);
    const [capturedGuardianImage, setCapturedGuardianImage] = useState(null);
    const [capturedGuardian2Image, setCapturedGuardian2Image] = useState(null);
    const [dataFound, setDataFound] = useState(true); // use to declare 0 rows
    
    // this is choose from different statuses for viewing data – In tabs
    const [viewByStatus, setViewByStatus] = useState('');

    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const webcamRef = React.useRef(null);
    // var capturedStudentImage = false;
    // var capturedFatherImage = false;
    // var capturedMotherImage = false;
    // var capturedGuardianImage = false;
    const [capturedImage, setCapturedImage] = useState(null);
    
    const [imageUrl, setImageUrl] = useState(null);

    //create new date object
    const today = new dayjs();


   

    // get the user and fire the data fetch
    useEffect(()=>{

        let cookieValue = biscuits.get('sc_user_detail')
            if(cookieValue){
                const obj = JSON.parse(decodeURIComponent(cookieValue)) // get the cookie data
console.log(obj.userImage);
                // set the user state variable
                setUser(obj)
                setCollegeId(obj.collegeId)
                setStudentName(true);
                setStudentNameValue(obj.username)
                
                
                
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
    // });
    // This code will run whenever capturedStudentImage changes
    // console.log('capturedStudentImage'); // Updated value
    // console.log(capturedStudentImage); // Updated value


    },[capturedStudentImage]);

    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [facingMode, setFacingMode] = useState('environment');
    const videoConstraints = {
        facingMode: facingMode,
      };
    
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

    // start and stop camera for student
        const startStudentCapture = React.useCallback(() => {
            setStudentImage(true);
        })
        const stopStudentCapture = React.useCallback(() => {
            setStudentImage(false);
        })

    // start and stop camera for father
        const startFatherCapture = React.useCallback(() => {
            setFatherImage(true);
        })
        const stopFatherCapture = React.useCallback(() => {
            setFatherImage(false);
        })

    // start and stop camera for mother
        const startMotherCapture = React.useCallback(() => {
            setMotherImage(true);
        })
        const stopMotherCapture = React.useCallback(() => {
            setMotherImage(false);
        })

    // start and stop camera for guardian
        const startGuardianCapture = React.useCallback(() => {
            setGuardianImage(true);
        })
        const stopGuardianCapture = React.useCallback(() => {
            setGuardianImage(false);
        })

    // start and stop camera for guardian2
        const startGuardian2Capture = React.useCallback(() => {
            setGuardian2Image(true);
        })
        const stopGuardian2Capture = React.useCallback(() => {
            setGuardian2Image(false);
        })

    // capture student
    const captureStudent = React.useCallback(() => {
        console.log(collegeId);

        // check if the student unique id is entered
        if(collegeId.length > 0 && studentName){
            setInputError(false);
            
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedImage(imageSrc); // set captured image
            setCapturedStudentImage(imageSrc);
            // convertToBlob(imageSrc); // covert to Blob

            setStudentImage(false);
            convertToBlob(imageSrc, collegeId); // covert to Blob
            

        }
        else {
            setInputError(true);
        }
    });
 
    // capture father image
    const captureFather = React.useCallback(() => {

        console.log(collegeId);

        // check if the student unique id is entered
        if(collegeId.length > 0 && studentName){
            setInputError(false);
            
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedFatherImage(imageSrc); // set captured image
            
            setFatherImage(false);
            convertToBlob(imageSrc, collegeId+'_1'); // covert to Blob
        }
        else {
            setInputError(true);
        }
    });
    
    // capture Mother image
    const captureMother = React.useCallback(() => {

        console.log(collegeId);

        // check if the student unique id is entered
        if(collegeId.length > 0 && studentName){
            setInputError(false);
            
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedMotherImage(imageSrc); // set captured image
            
            setMotherImage(false);
            convertToBlob(imageSrc, collegeId+'_2'); // covert to Blob
        }
        else {
            setInputError(true);
        }
    });
    
    // capture Guardian 1 image
    const captureGuardian1 = React.useCallback(() => {

        console.log(collegeId);

        // check if the student unique id is entered
        if(collegeId.length > 0 && studentName){
            setInputError(false);
            
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedGuardianImage(imageSrc); // set captured image
            
            setGuardianImage(false);
            convertToBlob(imageSrc, collegeId+'_3'); // covert to Blob
        }
        else {
            setInputError(true);
        }
    });
    
    // capture Guardian 2 image
    const captureGuardian2 = React.useCallback(() => {

        console.log(collegeId);

        // check if the student unique id is entered
        if(collegeId.length > 0 && studentName){
            setInputError(false);
            
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedGuardian2Image(imageSrc); // set captured image
            
            setGuardian2Image(false);
            convertToBlob(imageSrc, collegeId+'_4'); // covert to Blob
        }
        else {
            setInputError(true);
        }
    });
    

    // }, [webcamRef]);
    
    const reTake = (type) => {
        if(type=='Student'){
            setStudentImage(true);
            // setCapturedImage(false);
            setCapturedStudentImage(false);
        }
        else if(type == 'Father'){
            setFatherImage(true);
            // setCapturedImage(false);
            setCapturedFatherImage(false);
        }
        else if(type == 'Mother'){
            setMotherImage(true);
            setCapturedMotherImage(false);
        }
        else if(type == 'Guardian'){
            setGuardianImage(true);
            setCapturedGuardianImage(false);
        }
        else if(type == 'Guardian2'){
            setGuardian2Image(true);
            setCapturedGuardian2Image(false);
        }
    };

    const convertToBlob = (dataURL, imageName) => {
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
    
        for (let i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i);
        }
    
        const blob = new Blob([arrayBuffer], { type: mimeString });
        const file = new File([blob], imageName+'.jpeg', { type: 'image/jpeg' });
        
        // You can now use the 'file' instance for uploading or further processing
        console.log(file);

        uploadPics(file); // handle it
      };


    async function uploadPics(file){
        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: 'image/jpeg'
        };
        console.log(file.name);
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
            console.log(error.message);
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
setImageUrl(downloadURL);
        });
        }
        );
  
    }

    // get the requests data
    // for the user based on their role.
    // the actions will be seen that are specific to the role and by the selected status
//     async function getData(){

//         if(collegeId.length > 0){

//             setSearching(true);

//         const result  = await checkUser(process.env.NEXT_PUBLIC_API_PASS, collegeId)
//         const queryResult = await result.json() // get data

//         // check for the status
//         if(queryResult.status == 200){

//             // check if data exits
//             if(queryResult.data.length > 0){

//                 // set the state
//                 // setRequests(queryResult.data)
//                 console.log(queryResult.data[0].username);
//                 setStudentName(true);
//                 setStudentNameValue(queryResult.data[0].username)
//             }
//             else {
//                 console.log('No Data ')
//                 alert('No user found!');
//                 setStudentName(false);
//                 setStudentNameValue('')
                
//             }

//             setSearching(false);
//         }
//         else if(queryResult.status == 401) {
//             console.log('Not Authorized ')
//             alert('No user found!');
            
//             setSearching(false);
//             setStudentName(false);
//                 setStudentNameValue('')
//         }
//         else if(queryResult.status == 404) {
//             console.log('Not more data')
//             alert('No user found!');
            
//             setSearching(false);
//             setStudentName(false);
//                 setStudentNameValue('')
//         }
//         else {
//             console.log('Yes the do!');
//             alert('No user found!');
//             // router.push('/')
            
//             setSearching(false);
//             setStudentName(false);
//                 setStudentNameValue('')
//         }
    
//     }
//     else {
//         alert('Enter unique ID');
//     }
// }


// verify the collegeId by calling the API
async function submitHere(){

    // check for the input
    if(collegeId.length > 0){

        setSearching(true);

        var id = collegeId;
        console.log(id);
        // call the api using secret key and collegeId provided
        // const result  = await submitUser(process.env.NEXT_PUBLIC_API_PASS,id, "https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/"+id+".jpeg?alt=media")
        const result  = await submitUser(process.env.NEXT_PUBLIC_API_PASS,id)
        // const result  = await submitUser(process.env.NEXT_PUBLIC_API_PASS,id, encodeURIComponent(`https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/${id}.jpeg?alt=media`))
        const resultData = await result.json() // get data
        
        // check if query result status is 200
        // if 200, that means, user is found and OTP is sent
        if(resultData.status == 200) {
            
            // set the state variables with the user data
            setCollegeId('');
            setStudentName(false);
            setStudentNameValue(null);

            setCapturedImage(false);
            setCapturedStudentImage(false);
            setCapturedFatherImage(false);
            setCapturedMotherImage(false);
            setCapturedGuardianImage(false);
            setCapturedGuardian2Image(false);

            // Success
            setSearching(false);
            alert('✅ Saved successfully!')
            window.location.reload();
            
        }
        else if(resultData.state == 404) {
            // setuserFound(false)
            // setinfoMsg(true)
            setSearching(false);
        }
        
    }
    else {
        setSearching(false);
        // show error incase of no input
        alert('Enter Student ID')
    }
  
}


    // clear cookies or logout
    function clearCookies(){

        //  document.cookie = "";
        biscuits.remove('sc_user_detail')

        // clearing the state variable
        setUser()
        
    }
    
  return (
    
          <div className={styles.verticalsection} style={{height:'90vh',gap:'8px',marginTop:'16px'}}>

            <div className={styles.horizontalsection} style={{height:'100%', width:'100%'}}>

                <div className={styles.carddatasection} key={1234} style={{height:'100%',overflow:'scroll',alignItems:'flex-start',padding:'24px',gap:'0px'}}>
                  
                  {user ?
                        <div className={styles.verticalsection}>
                            {/* <p className={`${inter.className} ${styles.text3_heading}`}>Full name:</p>
                            <div className={`${inter.className}`} style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px'}}>
                                
                                {studentName ? <div className={`${inter.className} ${styles.text1}`}>{studentNameValue}</div> : ''}
                            </div>
                            <br/> */}
                            {/* <button id="submit" onClick={loginHere.bind(this)} className={`${inter.className} ${styles.text2} ${styles.primarybtn}`}>Sign in</button> */}
                            
                                {inputError ? <div className={`${styles.error} ${inter.className} ${styles.text2}`}>Enter valid ID to proceed</div>
                                    :''}
                            
                                {/* <p className={`${inter.className} ${styles.text2}`} dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br>') }}></p> */}
                                {/* <p className={`${inter.className} ${styles.text2}`}>{project.description.replace(/\n/g, '\n')}</p> */}
                                
                                    <p className={`${inter.className} ${styles.text1}`}>Profile details</p>
                                    <br/>
                                        <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%',flexWrap:'wrap'}}>
                                            <p className={`${inter.className} ${styles.text3}`}>Full name:</p>
                                            <p className={`${inter.className} ${styles.text2}`}>{user.username}</p>
                                        </div>
                                        <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px'}}></div>
                                        
                                        <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%',flexWrap:'wrap'}}>
                                            <p className={`${inter.className} ${styles.text3}`}>College Regd Id:</p>
                                            <p className={`${inter.className} ${styles.text2}`}>{user.collegeId}</p>
                                        </div>
                                        <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px'}}></div>
                                        
                                        <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%',flexWrap:'wrap'}}>
                                            <p className={`${inter.className} ${styles.text3}`}>Branch:</p>
                                            <p className={`${inter.className} ${styles.text2}`}>{user.year} year, {user.branch} Dept</p>
                                        </div>
                                        <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px'}}></div>
                                        
                                        {(user.type == 'Hostel' || user.type == 'hostel') ? 
                                            <div style={{width:'100%'}}>
                                                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%',flexWrap:'wrap'}}>
                                                    <p className={`${inter.className} ${styles.text3}`}>Type:</p>
                                                    <p className={`${inter.className} ${styles.text2}`}>Hosteler</p>
                                                </div>
                                                <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px 8px 0px'}}></div>
                                            </div>
                                            : 
                                            <div style={{width:'100%'}}>
                                                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%',flexWrap:'wrap'}}>
                                                    <p className={`${inter.className} ${styles.text3}`}>Type:</p>
                                                    <p className={`${inter.className} ${styles.text2}`}>Day scholar</p>
                                                </div>
                                                <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px 8px 0px'}}></div>
                                            </div>
                                        }

                                        {(user.type != '-') ? 
                                            <div style={{width:'100%'}}>
                                                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%',flexWrap:'wrap'}}>
                                                    <p className={`${inter.className} ${styles.text3}`}>Outing type:</p>
                                                    <p className={`${inter.className} ${styles.text2} ${styles.tag}`}>{(user.outingType == 'yes') ? 'Self permitted' : 'Not-self permitted'}</p>
                                                </div>
                                                <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'12px 0px 4px 0px'}}></div>
                                            </div>
                                            :
                                            ''
                                        }
                                        <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%',flexWrap:'wrap'}}>
                                            <p className={`${inter.className} ${styles.text3}`}>Email:</p>
                                            <p className={`${inter.className} ${styles.text2}`}>{user.email}</p>
                                        </div>
                                        <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px'}}></div>
                                        <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%',flexWrap:'wrap'}}>
                                            <p className={`${inter.className} ${styles.text3}`}>Mobile:</p>
                                            <p className={`${inter.className} ${styles.text2}`}>{user.phoneNumber}</p>
                                        </div>
                                        <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px'}}></div>
                                        <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%',flexWrap:'wrap'}}>
                                            <p className={`${inter.className} ${styles.text3}`}>Hostel:</p>
                                            <p className={`${inter.className} ${styles.text2}`}>{user.hostelName}</p>
                                        </div>
                                        <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px'}}></div>
                                        <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%',flexWrap:'wrap'}}>
                                            <p className={`${inter.className} ${styles.text3}`}>Room number:</p>
                                            <p className={`${inter.className} ${styles.text2}`}>{user.roomNumber}</p>
                                        </div>
                                        <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px'}}></div>
                                    <p className={`${inter.className} ${styles.text3}`} style={{fontSize:'10px'}}>Contact your campus admin to update above details</p>
                                    {/* <p className={(requestItem.requestType=='requestItem' ? 'requestItem_chip' : 'outing_chip')}>{requestItem.requestType}</p> */}

                                {/* {user ?
                                    <div className={styles.verticalsection} style={{width:'100%'}}>
                            
                                        {(user.username.length > 2) ? 
                                        <div className={styles.horizontalsection} style={{alignItems:'flex-start'}}>
                                            <img src={imageUrl} alt="Downloaded Image" key={collegeId} width={'50px'} height={'50px'} style={{ objectFit: 'cover', backgroundColor: '#F5F5F5', borderRadius: '50%' }}/>
                                            <ImageComponent imageUrl={"https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/"+collegeId+".jpeg?alt=media"} id={user.collegeId} username={user.username}/>
                                            <div>
                                                <p className={`${inter.className} ${styles.text2}`}>Father: {user.username}</p> 
                                                <p className={`${inter.className} ${styles.text2}`}>{user.phoneNumber}</p> 
                                                <br/>
                                            </div>
                                        </div>
                                        : ''}
                                        
                                        {(user.fatherName.length > 2) ? 
                                        <div className={styles.horizontalsection} style={{alignItems:'flex-start'}}>
                                            <ImageComponent imageUrl={"https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/"+collegeId+"_1.jpeg?alt=media"} id={user.collegeId} username={user.fatherName}/>
                                            <div>
                                                <p className={`${inter.className} ${styles.text2}`}>Father: {user.fatherName}</p> 
                                                <p className={`${inter.className} ${styles.text2}`}>{user.fatherPhoneNumber}</p> 
                                                <br/>
                                            </div>
                                        </div>
                                        : ''}
                                        
                                        
                                        {(user.motherName.length > 2) ? 
                                        <div className={styles.horizontalsection} style={{alignItems:'flex-start'}}>
                                            <ImageComponent imageUrl={"https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/"+user.collegeId+"_2.jpeg?alt=media"} id={user.collegeId} username={user.motherName}/>
                                            <div>
                                                <p className={`${inter.className} ${styles.text2}`}>Mother: {user.motherName}</p> 
                                                <p className={`${inter.className} ${styles.text2}`}>{user.motherPhoneNumber}</p> 
                                                <br/>
                                            </div>
                                        </div>
                                        : ''}
                                        
                                        {(user.guardianName.length > 2) ? 
                                        <div className={styles.horizontalsection} style={{alignItems:'flex-start'}}>
                                            <ImageComponent imageUrl={"https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/"+user.collegeId+"_3.jpeg?alt=media"} id={user.collegeId} username={user.guardianName}/>
                                            <div>
                                                <p className={`${inter.className} ${styles.text2}`}>Guardian 1: {user.guardianName}</p> 
                                                <p className={`${inter.className} ${styles.text2}`}>{user.guardianPhoneNumber}</p> 
                                                <br/>
                                            </div>
                                        </div>
                                        : ''}
                                        
                                        {(user.guardian2Name.length > 2) ? 
                                        <div className={styles.horizontalsection} style={{alignItems:'flex-start'}}>
                                            <ImageComponent imageUrl={"https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/"+user.collegeId+"_3.jpeg?alt=media"} id={user.collegeId} username={user.guardian2Name}/>
                                            <div>
                                                <p className={`${inter.className} ${styles.text2}`}>Guardian 2: {user.guardian2Name}</p> 
                                                <p className={`${inter.className} ${styles.text2}`}>{user.guardian2PhoneNumber}</p> 
                                                <br/>
                                            </div>
                                        </div>
                                        : ''}
                                        
                                    </div>
                                    :''} */}

                                    <br/>
                                    <p className={`${inter.className} ${styles.text1}`}>Update below details</p>
                                
                                        {/* <p className={`${inter.className} ${styles.text3_heading}`}>Update below photos as applicable:</p> */}
                                        <br/>
                                        <div className={`${inter.className} ${styles.verticalsection}`} style={{gap:'20px', alignItems: 'flex-start'}}>
                                            {/* Student image capture */}
                                            <div>Your image: <br/>
                                             {user.mediaCount > 0 && !capturedImage ?
                                                 <img src={user.userImage} alt="Captured" style={{borderRadius:'10px',margin:'8px 0px'}} onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block';}}/>
                                             :''}
                                            {/* {studentName ? <div className={`${inter.className} ${styles.text1}`}>{studentNameValue}</div> :  */}
                                                {/* <input id="studentName" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder={studentName ? studentNameValue : 'Student name'} style={{width:'160px',marginTop:'8px',marginBottom:'8px'}}/> */}
                                                {studentImage ?
                                                    <div width='200px'>
                                                        <Webcam 
                                                            width={270}
                                                            height={200}
                                                            audio={false}
                                                            ref={webcamRef}
                                                            videoConstraints={videoConstraints}
                                                            mirrored={facingMode === 'environment'}
                                                            screenshotFormat="image/jpeg"
                                                            style={{borderRadius:'10px',margin:'8px 0px'}} 
                                                        />
                                                        <button onClick={captureStudent} className={`${inter.className} ${styles.primarybtn}`} >Capture</button> &nbsp;&nbsp;
                                                        <button onClick={stopStudentCapture} className={`${inter.className} ${styles.secondarybtn}`}>Close</button>
                        
                                                    </div>
                                                :
                                                capturedImage ? 
                                                    <div>
                                                        <img src={capturedImage} alt="Captured" style={{borderRadius:'10px',margin:'8px 0px'}} />
                                                        <p>✅ Captured</p>
                                                        <button onClick={() => reTake('Student')} className={`${inter.className} ${styles.secondarybtn}`}>Retake</button>
                                                        </div>
                                                        :
                                                    <div>
                                                        <p className={styles.text2}>Not available</p>
                                                        {/* Commenting this section to stop the student image upload from student side
                                                        admins will provide the student images
                                                        <button onClick={startStudentCapture} className={`${inter.className} ${styles.secondarybtn}`}>Open camera</button> */}
                                                    </div>
                                                }

                                               
                                            </div>
                                             
                                            
                                            {/* Father image capture */}
                                            <div>Father image:<br/>
                                            {user.mediaCount > 0 && !capturedFatherImage ?
                                                <img src={"https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/"+user.collegeId+"_1.jpeg?alt=media"} alt="Captured" style={{borderRadius:'10px',margin:'8px 0px'}} onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block';}}/>
                                             :''}
                                                {fatherImage ?
                                                    // capturedFatherImage ? 
                                                    // <div>
                                                    //     <img src={capturedFatherImage} alt="Captured" />
                                                    //     <button onClick={reTake('Father')} className={`${inter.className} ${styles.secondarybtn}`}>Retake</button>
                                                    //     </div>
                                                    //     :
                                                    <div width='200px'>
                                                        <Webcam 
                                                            width={270}
                                                            height={200}
                                                            audio={false}
                                                            ref={webcamRef}
                                                            videoConstraints={videoConstraints}
                                                            mirrored={facingMode === 'environment'}
                                                            screenshotFormat="image/jpeg"
                                                            style={{borderRadius:'10px',margin:'8px 0px'}} 
                                                        />
                                                        <button onClick={captureFather} className={`${inter.className} ${styles.primarybtn}`} >Capture</button> &nbsp;&nbsp;
                                                        <button onClick={stopFatherCapture} className={`${inter.className} ${styles.secondarybtn}`}>Close</button>
                        
                                                    </div>
                                                :
                                                capturedFatherImage ? 
                                                    <div>
                                                        <img src={capturedFatherImage} alt="Captured" style={{borderRadius:'10px',margin:'8px 0px'}}  />
                                                        <p>✅ Captured</p>
                                                        <button onClick={() => reTake('Father')} className={`${inter.className} ${styles.secondarybtn}`}>Retake</button>
                                                        </div>
                                                        :
                                                <div><button onClick={startFatherCapture} className={`${inter.className} ${styles.secondarybtn}`}>Open camera</button></div>}
                                            </div>
                                            
                                            {/* Mother image capture */}
                                            <div>Mother image:<br/>
                                            {user.mediaCount > 0 && !capturedMotherImage ?
                                                <img src={"https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/"+user.collegeId+"_2.jpeg?alt=media"} alt="Captured" style={{borderRadius:'10px',margin:'8px 0px'}} onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block';}}/>
                                             :''}
                                                {motherImage ?
                                                    // capturedMotherImage ? 
                                                    // <div>
                                                    //     <img src={capturedMotherImage} alt="Captured" />
                                                    //     <button onClick={reTake('Mother')} className={`${inter.className} ${styles.secondarybtn}`}>Retake</button>
                                                    //     </div>
                                                    //     :
                                                    <div width='200px'>
                                                        <Webcam 
                                                            width={270}
                                                            height={200}
                                                            audio={false}
                                                            ref={webcamRef}
                                                            videoConstraints={videoConstraints}
                                                            mirrored={facingMode === 'environment'}
                                                            screenshotFormat="image/jpeg"
                                                            style={{borderRadius:'10px',margin:'8px 0px'}} 
                                                        />
                                                        <button onClick={captureMother} className={`${inter.className} ${styles.primarybtn}`} >Capture</button> &nbsp;&nbsp;
                                                        <button onClick={stopMotherCapture} className={`${inter.className} ${styles.secondarybtn}`}>Close</button>
                        
                                                    </div>
                                                :
                                                capturedMotherImage ? 
                                                    <div>
                                                        <img src={capturedMotherImage} alt="Captured" style={{borderRadius:'10px',margin:'8px 0px'}}  />
                                                        <p>✅ Captured</p>
                                                        <button onClick={() => reTake('Mother')} className={`${inter.className} ${styles.secondarybtn}`}>Retake</button>
                                                        </div>
                                                        :
                                                <div><button onClick={startMotherCapture} className={`${inter.className} ${styles.secondarybtn}`}>Open camera</button></div>}
                                            </div>
                                            
                                            {/* Guardian image capture */}
                                            <div>Guardian image:<br/>
                                            {user.mediaCount > 0 && !capturedGuardianImage ?
                                                <img src={"https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/"+user.collegeId+"_3.jpeg?alt=media"} alt="Captured" style={{borderRadius:'10px',margin:'8px 0px'}} onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block';}}/>
                                             :''}
                                                {guardianImage ?
                                                // capturedGuardianImage ? 
                                                //     <div>
                                                //         <img src={capturedGuardianImage} alt="Captured" />
                                                //         <button onClick={reTake('Guardian')} className={`${inter.className} ${styles.secondarybtn}`}>Retake</button>
                                                //         </div>
                                                //         :
                                                    <div width='200px'>
                                                        <Webcam 
                                                            width={270}
                                                            height={200}
                                                            audio={false}
                                                            ref={webcamRef}
                                                            videoConstraints={videoConstraints}
                                                            mirrored={facingMode === 'environment'}
                                                            screenshotFormat="image/jpeg"
                                                            style={{borderRadius:'10px',margin:'8px 0px'}} 
                                                        />
                                                        <button onClick={captureGuardian1} className={`${inter.className} ${styles.primarybtn}`} >Capture</button> &nbsp;&nbsp;
                                                        <button onClick={stopGuardianCapture} className={`${inter.className} ${styles.secondarybtn}`}>Close</button>
                        
                                                    </div>
                                                :
                                                capturedGuardianImage ? 
                                                    <div>
                                                        <img src={capturedGuardianImage} alt="Captured" style={{borderRadius:'10px',margin:'8px 0px'}}  />
                                                        <p>✅ Captured</p>
                                                        <button onClick={() => reTake('Guardian')} className={`${inter.className} ${styles.secondarybtn}`}>Retake</button>
                                                        </div>
                                                        :
                                                <div><button onClick={startGuardianCapture} className={`${inter.className} ${styles.secondarybtn}`}>Open camera</button></div>}
                                            </div>
                                            
                                            {/* Guardian2 image capture */}
                                            <div>Guardian 2 image:<br/>
                                            {user.mediaCount > 0 && !capturedGuardian2Image ?
                                                <img src={"https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/"+user.collegeId+"_4.jpeg?alt=media"} alt="Captured" style={{borderRadius:'10px',margin:'8px 0px'}} onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block';}}/>
                                             :''}
                                                {guardianImage2 ?
                                                // capturedGuardianImage ? 
                                                //     <div>
                                                //         <img src={capturedGuardianImage} alt="Captured" />
                                                //         <button onClick={reTake('Guardian')} className={`${inter.className} ${styles.secondarybtn}`}>Retake</button>
                                                //         </div>
                                                //         :
                                                    <div width='200px'>
                                                        <Webcam 
                                                            width={270}
                                                            height={200}
                                                            audio={false}
                                                            ref={webcamRef}
                                                            videoConstraints={videoConstraints}
                                                            mirrored={facingMode === 'environment'}
                                                            screenshotFormat="image/jpeg"
                                                            style={{borderRadius:'10px',margin:'8px 0px'}} 
                                                        />
                                                        <button onClick={captureGuardian2} className={`${inter.className} ${styles.primarybtn}`} >Capture</button> &nbsp;&nbsp;
                                                        <button onClick={stopGuardian2Capture} className={`${inter.className} ${styles.secondarybtn}`}>Close</button>
                        
                                                    </div>
                                                :
                                                capturedGuardian2Image ? 
                                                    <div>
                                                        <img src={capturedGuardian2Image} alt="Captured" style={{borderRadius:'10px',margin:'8px 0px'}}  />
                                                        <p>✅ Captured</p>
                                                        <button onClick={() => reTake('Guardian2')} className={`${inter.className} ${styles.secondarybtn}`}>Retake</button>
                                                        </div>
                                                        :
                                                <div><button onClick={startGuardian2Capture} className={`${inter.className} ${styles.secondarybtn}`}>Open camera</button></div>}
                                            </div>

                                            
                                        </div>

                                        <br/>
                                        <br/>

                                        <div className={`${inter.className} ${styles.text3}`}>Only submit after capturing atleast 1 image.</div>
                                        {searching ? 
                                            <div className={styles.horizontalsection}>
                                                <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                                <p className={`${inter.className} ${styles.text3}`}>Saving details. Please wait...</p> 
                                            </div> 
                                        : <button id="submit" onClick={submitHere.bind(this)} className={`${inter.className} ${styles.text2} ${styles.primarybtn}`}>Submit</button>
                                        }
                                    </div>
                            
                            :''}
                       
                    
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
    {/* {!capturedImage ?
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
      <br/>} */}

      

        {/* <input type="file" onChange={()=>handleFileChange()}  />
        <button onClick={()=>hideColumn()} >Upload</button> */}

                    

                            {/* <ImageComponent imageUrl={imageUrl} /> */}
                    </div>
                </div>



                
                
                
            {/* )} */}
        </div>
        </div>
       
    
    
    
  );
}

// function ImageComponent({ imageUrl, id, username  }) {

//     const [imageLoaded, setImageLoaded] = useState(false);
//         useEffect(() => {
    
//             const checkImageExists = async () => {
//                 try {
//                   // Make a request to the server-side API route to check if the image exists
//                   const response = await fetch(`/api/check-image?imageUrl=${decodeURIComponent(imageUrl)}`);
//                   const data = await response.json();
          
//                   if (data.exists) {
//                     // Image exists, set 'imageExists' to true
//                     setImageLoaded(true);
//                   } else {
//                     // Image doesn't exist, set 'imageExists' to false
//                     setImageLoaded(false);
//                   }
//                 } catch (error) {
//                   // Handle errors, or if the response is not OK, set 'imageExists' to false
//                   setImageLoaded(false);
//                 }
//               };
          
//               checkImageExists();
//           }, [imageLoaded]);
    
//     return (
//       <div>
//         {/* Replace 'imageUrl' with the actual URL of the image */}
//         {imageLoaded ? (
//         <img
//             key={id}
//             src={imageUrl}
//             alt="Downloaded Image"
//             width={'50px'}
//             height={'50px'}
//             style={{ objectFit: 'cover', backgroundColor: '#F5F5F5', borderRadius: '50%' }}
//           />
//           ) : (
//             <div style={{backgroundColor: '#f5f5f5', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}><p className={`${inter.className}`}>{abbreviateName(username)}</p></div>
//         )}
//       </div>
//     );
//   }


  function abbreviateName(name) {
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`;
    } else if (words.length === 1) {
      return `${words[0][0]}${words[0][1]}`;
    } else {
      return 'Invalid Name';
    }
  }


      