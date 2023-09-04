'use client'

import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { Check, Info, SpinnerGap, X } from 'phosphor-react'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useInView } from "react-intersection-observer";
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
    const [completed, setCompleted] = useState(false);
    const [totalStudents, setTotalStudents] = useState(0);
    const [registeredStudents, setRegisteredStudents] = useState(0);
    const [studentsList, setStudentsList] = useState();
    const [dataFound, setDataFound] = useState(true); // use to declare 0 rows
    const [inputError, setInputError] = useState(false);
    const [searching, setSearching] = useState(false);
    const { ref, inView } = useInView();

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
                
                if(!completed){
                    getData();
                }
                else {
                    console.log("DONE READING");
                }
                
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

            // if (inView) {
            //     console.log("YO YO YO!");
            //   }
    // });
    // This code will run whenever capturedStudentImage changes
    // console.log('capturedStudentImage'); // Updated value
    // console.log(capturedStudentImage); // Updated value


    },[capturedStudentImage, inView]);

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
        setOffset(offset+10); // update the offset for every call

        const result  = await getUsers(process.env.NEXT_PUBLIC_API_PASS, offset)
        const queryResult = await result.json() // get data

        // check for the status
        if(queryResult.status == 200){

            // check if data exits
            if(queryResult.data.length > 0){

                // set the state
                // total students
                setTotalStudents(queryResult.count);
                setRegisteredStudents(queryResult.registered);

                // check if students are present and accordingly add students list
                if(studentsList==null){
                   setStudentsList(queryResult.data)
                }
                else {
                    setStudentsList((studentsList) => [...studentsList, ...queryResult.data]);
                }
                // set data found
                setDataFound(true);
            }
            else {
                
                setDataFound(false);
            }

            setSearching(false);
            setCompleted(false);
        }
        else if(queryResult.status == 401) {
            
            setSearching(false);
            setDataFound(false);
            setCompleted(true);
        }
        else if(queryResult.status == 404) {
            
            setSearching(false);
            setDataFound(false);
            setCompleted(true);
        }
        else if(queryResult.status == 201) {
            
            setSearching(false);
            setDataFound(false);
            setCompleted(true);
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
              Newly registered students.
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
                            <p className={`${inter.className} ${styles.text3_heading}`}>Students</p>
                           <div className={styles.horizontalsection}>
                           <p className={`${inter.className} ${styles.text3_heading}`}>Total:</p>
                                <div className={`${inter.className}`} style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px'}}>
                                    {/* <input id="userObjectId" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Unique user ID"/> */}
                                    {/* <button onClick={getData.bind(this)} className={`${inter.className} ${styles.primarybtn}`} >Find</button> */}
                                    
                                    {searching ? <div className={styles.horizontalsection}>
                                        <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                        <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
                                    </div> : ''}
                                    {/* <div className={`${inter.className} ${styles.text1}`}>{totalStudents}</div>  */}
                                    <h1>{registeredStudents}</h1>
                                </div>
                                
                                <div className={`${inter.className}`} style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px'}}>
                                    {/* <input id="userObjectId" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Unique user ID"/> */}
                                    {/* <button onClick={getData.bind(this)} className={`${inter.className} ${styles.primarybtn}`} >Find</button> */}
                                    <p className={`${inter.className} ${styles.text3_heading}`}>Registered:</p>
                                    {searching ? <div className={styles.horizontalsection}>
                                        <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                        <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
                                    </div> : ''}
                                    {/* <div className={`${inter.className} ${styles.text1}`}>{totalStudents}</div>  */}
                                    <h1>{totalStudents}</h1>
                                </div>
                            </div>
                            <br/>
                            {/* <button id="submit" onClick={loginHere.bind(this)} className={`${inter.className} ${styles.text2} ${styles.primarybtn}`}>Sign in</button> */}
                            
                                {inputError ? <div className={`${styles.error} ${inter.className} ${styles.text2}`}>Enter valid ID to proceed</div>
                                    :''}
                            

                            {(!studentsList) ? 
                            ((!dataFound) ? 
                                <div className={styles.horizontalsection}>
                                    <Check className={styles.icon} />
                                    <p className={`${inter.className} ${styles.text3}`}>No students yet!</p> 
                                </div>
                                : 
                                <div className={styles.horizontalsection}>
                                    {/* <Loader className={`${styles.icon} ${styles.load}`} /> */}
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <p className={`${inter.className} ${styles.text3}`}>Gettings students ...</p> 
                                </div>)
                                : 
                            <div className={styles.titlecard}>
                            {studentsList.map(studentItem => (

                                
                                            <div className={styles.verticalsection} key={studentItem.collegeId} >
                                                {/* <p className={`${inter.className} ${styles.text2}`} dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br>') }}></p> */}
                                                {/* <p className={`${inter.className} ${styles.text2}`}>{project.description.replace(/\n/g, '\n')}</p> */}
                                                
                                                
                                                <div  className={styles.card_block2}>

                                                    {/* <p className={(studentItem.requestType=='studentItem' ? 'requestItem_chip' : 'outing_chip')}>{studentItem.requestType}</p> */}

                                                       <div className={styles.horizontalsection}> 


                                                       {(studentItem.mediaCount == 1) ?
                                                        <ImageComponent imageUrl={studentItem.userImage} id={studentItem.collegeId}/>
                                                            :
                                                            <div className={`${styles.abbrevationBG}`}>
                                                                <p className={`${inter.className} ${styles.text2}`}>{abbreviateName(studentItem.username)}</p>
                                                            </div>
                                                        }
                                                        
                                                        <div>
                                                            <p className={`${inter.className} ${styles.text2}`}>{studentItem.collegeId}</p>
                                                            <p className={`${inter.className} ${styles.text1}`}>{studentItem.username}</p>
                                                        </div>
                                                        </div>
                                                        
                                                        {/* <div>
                                                            <p className={`${inter.className} ${styles.text3_heading}`}>Name:</p>
                                                            <p className={`${inter.className} ${styles.text1}`}>{studentItem.username}</p>
                                                        </div> */}
                                                        {/* <br/> */}

                                                        {/* <div>
                                                            <p className={`${inter.className} ${styles.text3_heading}`}>Photo status: </p>
                                                            <p className={`${inter.className} ${styles.text2}`}>Hello date
                                                                <br/><span className={`${inter.className} ${styles.text3}`}>{studentItem.mediaCount} updated</span>
                                                            </p>
                                                        </div> */}
                                                        
                                                        {/* <br/> */}
                                                       

                                    </div>
                            
                       
                       
                    </div>
                    
                
            ))}
            <br/>
            {(!completed) ?
                <div ref={ref} className={styles.horizontalsection}>
                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                    <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
                </div>
                :
                ''
            }
        </div>
        
         }
                                {/* <p className={`${inter.className} ${styles.text2}`} dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br>') }}></p> */}
                                {/* <p className={`${inter.className} ${styles.text2}`}>{project.description.replace(/\n/g, '\n')}</p> */}
                                
                                
                                
                                    {/* <p className={(studentItem.requestType=='studentItem' ? 'requestItem_chip' : 'outing_chip')}>{studentItem.requestType}</p> */}
                                        

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



    function ImageComponent({ imageUrl, id }) {
        return (
          <div>
            {/* Replace 'imageUrl' with the actual URL of the image */}
            <img key={id} src={imageUrl} alt="Downloaded Image" width={'50px'} height={'50px'} style={{objectFit:'cover',backgroundColor:'#F5F5F5',borderRadius:'50%'}}/>
          </div>
        );
      }

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