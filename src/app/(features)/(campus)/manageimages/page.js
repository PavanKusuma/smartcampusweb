'use client'

import { Inter } from 'next/font/google'
import { Check, Info, SpinnerGap, X, Plus } from 'phosphor-react'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Area, AreaChart } from 'recharts';
const inter = Inter({ subsets: ['latin'] })
import styles from '../../../../app/page.module.css'
import Biscuits from 'universal-cookie'
const biscuits = new Biscuits
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
// import ImageWithShimmer from '../../components/imagewithshimmer'
import { getStorage, ref, listAll, deleteObject, list, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// const storage = getStorage();
import firebase from '../../../firebase';
import Toast from '../../../components/toast'
const storage = getStorage(firebase, "gs://smartcampusimages-1.appspot.com");

// Create a child reference
// const imagesRef = ref(storage, 'images');
// imagesRef now points to 'images'

// Child references can also take paths delimited by '/'
const spaceRef = ref(storage, '/'); 

// const spaceRef = ref(storage, 'images/space.jpg');
// check for the user
const getStats = async (pass, role, branch) => 
  
fetch("/api/requeststats/"+pass+"/"+role+"/"+branch+"/All/1", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});



// pass state variable and the method to update state variable
export default function ManageImages() {

    // create a router for auto navigation
    const router = useRouter();

    // user state and requests variable
    const [user, setUser] = useState();
    const [role, setRole] = useState('');
    const [branch, setBranch] = useState('');
    const [offset, setOffset] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [totalStudents, setTotalStudents] = useState(0);
    const [studentsInCampus, setStudentsInCampus] = useState(0);
    
    const [requestsInOuting, setRequestsInOuting] = useState(0);
    const [requestsIssued, setRequestsIssued] = useState(0);
    const [requestsApproved, setRequestsApproved] = useState(0);
    const [requestsPending, setRequestsPending] = useState(0);

    const [resultType, setResultType] = useState('');
    const [resultMessage, setResultMessage] = useState('');

    const [studentsList, setStudentsList] = useState();
    const [dataFound, setDataFound] = useState(true); // use to declare 0 rows
    const [inputError, setInputError] = useState(false);
    const [searching, setSearching] = useState(false);

    const [outingData, setOutingData] = useState();
    const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const webcamRef = React.useRef(null);
    //create new date object
    const today = new dayjs();
    
    


    // get the user and fire the data fetch
    useEffect(()=>{

        let cookieValue = biscuits.get('sc_user_detail')
            if(cookieValue){
                const obj = JSON.parse(decodeURIComponent(cookieValue)) // get the cookie data

                // set the user state variable
                setUser(obj)
                // readImagesAndPrintReferences();
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


    },[]);

    // }, [webcamRef]);
   

async function readImagesAndPrintReferences(pageToken = null) {
    try {
        const storageRef = ref(storage);
        const imagesRef = ref(storageRef, '/'); // Change 'images' to your storage folder name
    
        // // List images with pagination
        // const pageOptions = { maxResults: 30, pageToken };
        // const imageList = await list(imagesRef, pageOptions);
    
        // // Print the reference names of images
        // imageList.items.forEach((item) => {
        //   console.log('Reference Name:', item.fullPath);
        // });
    
        // // If there are more items, continue with the next page
        // if (imageList.nextPageToken) {
        //   await readImagesAndPrintReferences(imageList.nextPageToken);
        // }


        // List all items in the folder
        const items = await listAll(imagesRef);
        const prefix = '22B01'

        // Filter items based on the prefix
        // const filteredItems = items.items.filter((item) =>
        //     item.name.startsWith(prefix)
        // );
        // Filter items based on the prefix and length
        const filteredItems = items.items.filter((item) =>
            item.name.startsWith(prefix) && item.name.length == 14
        );

        // Print the count of matching images
        console.log('Matching Image Count:', filteredItems.length);

        // Print the reference names of filtered images
        console.log('Matching Image Reference Names:');
        filteredItems.forEach((item) => {
            console.log(item.fullPath);
        });

         // Delete each matching image
        // for (const item of filteredItems) {
        //     await deleteObject(item);
        //     console.log(`Deleted: ${item.fullPath}`);
        // }

        // console.log('Deletion completed.');


      } catch (error) {
        console.error('Error reading images:', error);
      }
  }
// async function readImagesAndPrintReferences() {
//     try {
//       const storageRef = ref(storage);
//       const imagesRef = ref(storageRef, '/'); // Change 'images' to your storage folder name
//       const imageList = await listAll(imagesRef);
  
//       imageList.items.forEach((item) => {
//         console.log('Reference Name:', item.fullPath);
//       });
//     } catch (error) {
//       console.error('Error reading images:', error);
//     }
//   }


    // get the requests data
    // for the user based on their role.
    // the actions will be seen that are specific to the role and by the selected status
    async function getData(){
        
        setSearching(true);
        setOffset(offset+10); // update the offset for every call

        try {    
            const result  = await getStats(process.env.NEXT_PUBLIC_API_PASS, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).branch)
            const queryResult = await result.json() // get data

            // check for the status
            if(queryResult.status == 200){

                // check if data exits
                if(queryResult.data.length > 0){

                    // set the state
                    // total students
                    const result = queryResult.data;

                    // Initialize counters
                    let inHostel = 0;
                    let totalStrength = 0;

                    // Iterate through the array
                    for (const element of result) {
                        if (element.requestStatus === 'InOuting') {
                            inHostel += element.count;
                        }

                        if (element.requestStatus === 'InCampus') {
                            totalStrength += element.count;
                            setTotalStudents(element.count)
                        }
                        if (element.requestStatus === 'InOuting') {
                            setRequestsInOuting(element.count)
                        }
                        if (element.requestStatus === 'Issued') {
                            setRequestsIssued(element.count)
                        }
                        if (element.requestStatus === 'Approved') {
                            setRequestsApproved(element.count)
                        }
                        if (element.requestStatus === 'Submitted') {
                            setRequestsPending(element.count)
                        }
                    }

                    // Calculate studentsInCampus
                    setStudentsInCampus(totalStrength - inHostel);
                    
                    
                    // setStudentsGraph({name:'Total',value: totalStrength},{name: 'In campus',value:studentsInCampus});
                    
                    // setTotalStudents(result[0].requestStatus);
                    // setStudentsInCampus(result[0].requestStatus);
                    // setStudentsInCampus(queryResult.data[7].count);

                    // check if students are present and accordingly add students list
                    // if(studentsList==null){
                    //    setStudentsList(queryResult.data)
                    // }
                    // else {
                    //     setStudentsList((studentsList) => [...studentsList, ...queryResult.data]);
                    // }
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
        catch (e){
            
            // show and hide message
            setResultType('error');
            setResultMessage('Issue loading. Please refresh or try again later!');
            setTimeout(function(){
                setResultType('');
                setResultMessage('');
            }, 3000);
        }
}



    
  return (
    
        <div className={styles.verticalsection} style={{height:'100vh',gap:'8px'}}>
            
          <div style={{height:'8vh',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
              <h2 className={inter.className}>Manage images</h2>
          </div>      

            {/* <div style={{width:'100%',display:'flex', flexDirection:'row',justifyContent:'space-between'}}>
                <div className={styles.horizontalsection}>
                    <div className={`${styles.primarybtn} `} style={{display:'flex', flexDirection:'row', width:'fit-content', cursor:'pointer', gap:'4px'}}> 
                        <Plus />
                        <p className={`${inter.className}`}>New circular</p>
                    </div>
                    <div className={`${styles.overlayBackground} ${showAddStudent ? styles.hideshowdivshow : styles.hideshowdiv}`}>
                        <AddStudent toggleAddStudentOverlay={toggleAddStudentOverlay}/> 
                    </div>
                </div>
               
            </div> */}
          
            
          
         
        <div className={styles.verticalsection} style={{height:'80vh', width:'100%',gap:'8px'}}>

        <div className={styles.horizontalsection} style={{height:'100%', width:'100%'}}>

                <div className={styles.carddatasection} key={1234} style={{height:'100%', width:'100%'}}>
                       
                <div className={styles.verticalsection} style={{height:'100%',width:'100%',overflow:'scroll'}}>
                        
                        <p className={`${inter.className} ${styles.text1_heading}`}>STUDENTS</p>
                        <div className={styles.horizontalsection} style={{gap:'16px',paddingTop:'4px'}}>
                           
                            <div className={`${inter.className}`} style={{display:'flex',flexDirection:'column',gap:'8px', borderLeft: '4px solid #e5e5e5',padding: '4px 12px', width:'260px !important'}}>
                                {/* <input id="userObjectId" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Unique user ID"/> */}
                                {/* <button onClick={getData.bind(this)} className={`${inter.className} ${styles.primarybtn}`} >Find</button> */}
                                <p className={`${inter.className} ${styles.text3}`}>Hostel strength:</p>
                                {searching ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
                                </div> : ''}
                                {/* <div className={`${inter.className} ${styles.text1}`}>{totalStudents}</div>  */}
                                <h2>{totalStudents}</h2>
                            </div>
                            <div className={`${inter.className}`} style={{display:'flex',flexDirection:'column',gap:'8px', borderLeft: '4px solid #e5e5e5',padding: '4px 12px', width:'260px !important'}}>
                                {/* <input id="userObjectId" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Unique user ID"/> */}
                                {/* <button onClick={getData.bind(this)} className={`${inter.className} ${styles.primarybtn}`} >Find</button> */}
                                <p className={`${inter.className} ${styles.text3}`}>Students in campus hostel:</p>
                                {searching ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
                                </div> : ''}
                                {/* <div className={`${inter.className} ${styles.text1}`}>{totalStudents}</div>  */}
                                <h2>{studentsInCampus}</h2>
                            </div>
                        </div>
                            
                         {/* OUTING */}
                         <br/>
                        
                            
                        
                        

                       
                        {(resultMessage.length > 0) ? <Toast type={resultType} message={resultMessage} /> : ''}
                      </div>
                <div>
                    
                </div>
            </div>

              
        </div>
               
                
        </div>
    
    </div>
    
    
  );
}

