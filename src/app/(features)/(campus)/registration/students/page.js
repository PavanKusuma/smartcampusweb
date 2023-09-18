'use client'

import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { useInView } from "react-intersection-observer";
import { Check, Info, SpinnerGap, X } from 'phosphor-react'
import React, { useCallback, useEffect, useState, useRef } from 'react'
const inter = Inter({ subsets: ['latin'] })
import styles from '../../../../../app/page.module.css'
import Biscuits from 'universal-cookie'
const biscuits = new Biscuits
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// const storage = getStorage();
import firebase from '../../../../firebase';
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
export default function RegistrationStudents() {

    // create a router for auto navigation
    const router = useRouter();

    // user state and requests variable
    const [user, setUser] = useState();
    const [inputError, setInputError] = useState(false);
    const [offset, setOffset] = useState(0);
    const [searching, setSearching] = useState(false);
    const [dataFound, setDataFound] = useState(true); // use to declare 0 rows
    const [completed, setCompleted] = useState(false);
    const [totalStudents, setTotalStudents] = useState(0);
    const [registeredStudents, setRegisteredStudents] = useState(0);
    const [studentsList, setStudentsList] = useState();
   
    const { ref, inView } = useInView();

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

            if (inView) {
                console.log("YO YO YO!");
                getData();
              }
    // });
    // This code will run whenever capturedStudentImage changes
    // console.log('capturedStudentImage'); // Updated value
    // console.log(capturedStudentImage); // Updated value


    },[inView]);


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




    
  return (
    
    
    

    // <div className={styles.maindivcenter} style={{height:'90vh', contentVisibility:'auto',padding: '0px 24px'}}>
            
    //         <div style={{height:'10vh',display:'flex',flexDirection:'column',justifyContent:'center'}}>
    //             <h1 className={inter.className}>Students registration</h1>
    //             <p className={`${inter.className} ${styles.text3}`}>
    //             Fill in the fields and submit to update student details into Campus database.
    //             </p>
    //         </div>
          
    
         
          <div className={styles.verticalsection} style={{height:'80vh',gap:'8px'}}>

            <div className={styles.horizontalsection} style={{height:'100%', width:'100%'}}>

                <div className={styles.carddatasection} key={1234} style={{height:'100%'}}>
                       
                    <div className={styles.verticalsection} style={{height:'100%',overflow:'scroll'}}>
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
                            <div className={styles.titlecard} style={{height: '80vh',alignItems:'stretch'}}>
                            {studentsList.map(studentItem => (
                            
                                <div className={styles.verticalsection} key={studentItem.collegeId} style={{alignItems:'stretch'}}>
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
                                
                            
                        </div>
                    <div>
                        
                    </div>
                </div>
                
                
            {/* )} */}
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