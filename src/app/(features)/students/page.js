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

const storage = getStorage(firebase, "gs://smartcampusimages-1.appspot.com");

// Create a child reference
// const imagesRef = ref(storage, 'images');
// imagesRef now points to 'images'

// Child references can also take paths delimited by '/'
const spaceRef = ref(storage, '/');

// const spaceRef = ref(storage, 'images/space.jpg');
// check for the user
const getUsers = async (pass, offset) => 
  
fetch("/api/user/"+pass+"/U8/"+offset, {
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
    const [offset, setOffset] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
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

                // set the user state variable
                setUser(obj)
                getData();
                
                
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
    

    

    // }, [webcamRef]);
   


    // get the requests data
    // for the user based on their role.
    // the actions will be seen that are specific to the role and by the selected status
    async function getData(){
        
        setSearching(true);

        const result  = await getUsers(process.env.NEXT_PUBLIC_API_PASS, offset)
        const queryResult = await result.json() // get data
console.log(queryResult);
        // check for the status
        if(queryResult.status == 200){

            // check if data exits
            if(queryResult.data.length > 0){

                // set the state
                // setRequests(queryResult.data)
                // console.log(queryResult.data[0].username);
                setTotalStudents(queryResult.count);
                // setStudentName(true);
                // setStudentNameValue(queryResult.data[0].username)
            }
            else {
                console.log('No Data ')
                alert('No user found!');
                setStudentName(false);
                setStudentNameValue('')
                
            }

            setSearching(false);
        }
        else if(queryResult.status == 401) {
            console.log('Not Authorized ')
            alert('No user found!');
            
            setSearching(false);
            setStudentName(false);
                setStudentNameValue('')
        }
        else if(queryResult.status == 404) {
            console.log('Not more data')
            alert('No user found!');
            
            setSearching(false);
            setStudentName(false);
                setStudentNameValue('')
        }
        else {
            console.log('Yes the do!');
            alert('No user found!');
            // router.push('/')
            
            setSearching(false);
            setStudentName(false);
                setStudentNameValue('')
        }
    
}



// verify the collegeId by calling the API
async function submitHere(){

    // check for the input
    if(document.getElementById('userObjectId').value.length > 0){

        var id = document.getElementById('userObjectId').value;
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
            document.getElementById('userObjectId').value='';
            setStudentName(false);
            setStudentNameValue(null);

            setCapturedImage(false);
            setCapturedStudentImage(false);
            setCapturedFatherImage(false);
            setCapturedMotherImage(false);
            setCapturedGuardianImage(false);
            setCapturedGuardian2Image(false);

            // Success
            alert('✅ Submitted!')
            window.location.reload();
            
        }
        else if(resultData.state == 404) {
            // setuserFound(false)
            // setinfoMsg(true)
        }
        
    }
    else {
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
    
     <div>

        {/* <div className={`${styles.menuItems} ${inter.className}`}>
            <div className={`${styles.menuItem} ${selectedTab === 'Outing' ? styles.menuItem_selected : ''}`} onClick={() => handleTabChange('Outing')}>Outing</div>
            <div className={`${styles.menuItem} ${selectedTab === 'Students' ? styles.menuItem_selected : ''}`} onClick={() => handleTabChange('Students')}>Students</div>
            <div className={`${styles.menuItem} ${selectedTab === 'Circulars' ? styles.menuItem_selected : ''}`} onClick={() => handleTabChange('Circulars')}>Circulars</div>
        </div>
         */}
        <div style={{border: '0.5px solid #E5E7EB', width:'100vw'}}></div>
              

          <div className={styles.maindivcenter}>
            
            <h1 className={inter.className}>Students</h1><br/>
              <p className={`${inter.className} ${styles.headingtext2}`}>
              List of students from Campus database.
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
                            <p className={`${inter.className} ${styles.text3_heading}`}>Students:</p>
                            <div className={`${inter.className}`} style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px'}}>
                                {/* <input id="userObjectId" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Unique user ID"/> */}
                                {/* <button onClick={getData.bind(this)} className={`${inter.className} ${styles.primarybtn}`} >Find</button> */}
                                
                                {searching ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <p className={`${inter.className} ${styles.text3}`}>Gettings students ...</p> 
                                </div> : ''}
                                {/* <div className={`${inter.className} ${styles.text1}`}>{totalStudents}</div>  */}
                                <h1>{totalStudents}</h1>
                            </div>
                            <br/>
                            {/* <button id="submit" onClick={loginHere.bind(this)} className={`${inter.className} ${styles.text2} ${styles.primarybtn}`}>Sign in</button> */}
                            
                                {inputError ? <div className={`${styles.error} ${inter.className} ${styles.text2}`}>Enter valid ID to proceed</div>
                                    :''}
                            
                                {/* <p className={`${inter.className} ${styles.text2}`} dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br>') }}></p> */}
                                {/* <p className={`${inter.className} ${styles.text2}`}>{project.description.replace(/\n/g, '\n')}</p> */}
                                
                                
                                
                                    {/* <p className={(requestItem.requestType=='requestItem' ? 'requestItem_chip' : 'outing_chip')}>{requestItem.requestType}</p> */}
                                        

                                        {/* <p className={`${inter.className} ${styles.text3_heading}`}>Details:</p>
                                        
                                        <div className={`${inter.className} ${styles.verticalsection}`} style={{gap:'20px', alignItems: 'flex-start'}}>
                                            
                                            <div>Student
                                                
                                                    <div>
                                                        <img src={capturedImage} alt="Captured" />
                                                        <p>✅ Captured</p>
                                                        <button onClick={() => reTake('Student')} className={`${inter.className} ${styles.secondarybtn}`}>Retake</button>
                                                        </div>
                                                     
                                               
                                            </div>
                     
                                            
                                        </div> */}

                                        
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



    <div>

                            {/* <ImageComponent imageUrl={imageUrl} /> */}
                    </div>
                </div>
               
                {/* <div className={`${inter.className} ${styles.text3}`}>Only submit after capturing images.</div>
                <button id="submit" onClick={submitHere.bind(this)} className={`${inter.className} ${styles.text2} ${styles.primarybtn}`}>Submit</button> */}
            {/* )} */}
        </div>
        {/* } */}
    <br/>
    </div>
    </div>
    
    
  );
}



    function ImageComponent({ imageUrl }) {
        return (
          <div>
            {/* Replace 'imageUrl' with the actual URL of the image */}
            <img src={imageUrl} alt="Downloaded Image" />
          </div>
        );
      }