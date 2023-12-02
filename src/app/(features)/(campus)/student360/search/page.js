'use client'

import { Inter } from 'next/font/google'
import { Check, Info, SpinnerGap, X, Plus, PencilSimple, UserGear } from 'phosphor-react'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useInView } from "react-intersection-observer";
const inter = Inter({ subsets: ['latin'] })
import styles from '../../../../../app/page.module.css'
import Biscuits from 'universal-cookie'
const biscuits = new Biscuits
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import Toast from '../../../../components/toast'
import AddStudent from '../../../../components/addstudent'
import UpdateUser from '../../../../components/updateuser'
import UpdateParents from '../../../../components/updateparents'
// import ImageWithShimmer from '../../components/imagewithshimmer'

// search for user based on collegeId or username
const searchNow = async (pass, collegeId, offset) => 
  
fetch("/api/user/"+pass+"/U3/"+collegeId+"/"+offset, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// get active requests for user based on collegeId
const getActiveRequests = async (pass, collegeId, offset) => 
  
fetch("/api/user/"+pass+"/U5/"+collegeId+"/"+offset, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// key, 
// get hostel details
const getHostelsAPICall = async (pass) => 

fetch("/api/hostels/"+pass+"/U1", {
    
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});


// pass state variable and the method to update state variable
export default function SearchStudents() {

    // create a router for auto navigation
    const router = useRouter();

    // user state and requests variable
    const [user, setUser] = useState();
    const [dummy, setDummy] = useState(0);
    const [offset, setOffset] = useState(0);
    const [dataStarted, setDataStarted] = useState(false);
    const [endOfData, setEndOfData] = useState(false);
    
    const [totalStudents, setTotalStudents] = useState(0);

    const [selectedStudent, setSelectedStudent] = useState();
    const [searchedStudentsList, setSearchedStudentsList] = useState();
    const [activeRequestsList, setActiveRequestsList] = useState();
    const [activeVisitorPassList, setActiveVisitorPasssList] = useState();
    const [dataFound, setDataFound] = useState(false); // use to declare 0 rows
    const [inputError, setInputError] = useState(false);
    const [searching, setSearching] = useState(false);
    const { ref, inView } = useInView();

    
    const [userDetailView, setUserDetailview] = useState(false);
    
    const [resultType, setResultType] = useState('');
    const [resultMessage, setResultMessage] = useState('');

    // hostel data
    const [hostels, setHostels] = useState();
    const [hostelNames, setHostelNames] = useState();
    const [hostelIds, setHostelIds] = useState();
    const [roomNumbers, setRoomNumbers] = useState();
    
    //create new date object
    const today = new dayjs();
    
    // update profile overlay
    const [show, showUpdateProfile] = useState(false);
    const toggleUpdateProfileOverlay = async () => {
        
        showUpdateProfile(!show)
    }
    
    // update parents overlay
    const [showParents, showUpdateParents] = useState(false);
    const toggleUpdateParentsOverlay = async () => {
        
        showUpdateParents(!showParents)
    }
    
    // create student overlay
    const [showAddStudent, showAddStudentView] = useState(false);
    const toggleAddStudentOverlay = async () => {
        
        showAddStudentView(!showAddStudent)
    }

    // this is the selected student object that will be call to update after every panel closes
    const updateSelectedStudent = (selectedStudent1) => {
        setSelectedStudent(selectedStudent1);
    }

    const [selectedSearchOption, setSelectedSearchOption] = useState(null);

    // Handler function for radio button changes
    const handleRadioChange = (event) => {
      setSelectedSearchOption(event.target.value);
    };

    // // a varaiable for showing enlarged image
    // const [isEnlarged, setIsEnlarged] = useState(false);
    // const toggleEnlarged = () => {
    //     setIsEnlarged(!isEnlarged);
    // };
   

    // get the user and fire the data fetch
    useEffect(()=>{

        let cookieValue = biscuits.get('sc_user_detail')
            if(cookieValue){
                const obj = JSON.parse(decodeURIComponent(cookieValue)) // get the cookie data

                // set the user state variable
                setUser(obj)
                getHostelDetails();
                
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
                router.push('/')
            }

            if (inView) {
                getData();
              }
    // });
    // This code will run whenever capturedStudentImage changes
    // console.log('capturedStudentImage'); // Updated value
    // console.log(capturedStudentImage); // Updated value


    },[selectedStudent, setSelectedStudent, inView]);

    // Function to handle the "Enter" key press
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            newSearch();
        }
    };

    // new search
    async function newSearch(){
        
        setEndOfData(false);
        setOffset(0);
        setSearchedStudentsList([]); // Set searchedStudentsList to an empty array
        setActiveRequestsList([]); // Set searchedStudentsList to an empty array
        setActiveVisitorPasssList([]); // Set searchedStudentsList to an empty array
        getData(); // now call the getData

        // clearing selection
        setSelectedStudent();
        setUserDetailview(false)
    }

    // get the requests data
    // for the user based on their role.
    // the actions will be seen that are specific to the role and by the selected status
    async function getData(){
        
        // check if the list is dataStarted.
        if(!endOfData){

            setSearching(true);

                try{
                
                    const collegeId = document.getElementById('userObjectId').value;
                    const result  = await searchNow(process.env.NEXT_PUBLIC_API_PASS, collegeId, offset)
                    const queryResult = await result.json() // get data
                    
                    setOffset(offset+20); // update the offset for every call
                    
                    // check for the status
                    if(queryResult.status == 200){

                        // check if data exits
                        if(queryResult.data.length > 0){

                            // set the state
                            // total students
                            // setTotalStudents(queryResult.count);
                            // setRegisteredStudents(queryResult.registered);

                            // check if students are present and accordingly add students list
                            if(searchedStudentsList==null){
                                setSearchedStudentsList(queryResult.data)
                                setDataStarted(true)
                            }
                            else {
                                setSearchedStudentsList((searchedStudentsList) => [...searchedStudentsList, ...queryResult.data]);
                                setDataStarted(true)
                            }
                            // set data found
                            setDataFound(true);
                        }
                        else {
                            setEndOfData(true);
                            setDataFound(false);
                        }

                        setSearching(false);
                        // setDataStarted(false);
                    }
                    else if(queryResult.status == 401) {
                        
                        setSearching(false);
                        setDataFound(false);
                        setDataStarted(false);
                    }
                    else if(queryResult.status == 404) {
                        
                        setSearching(false);
                        setDataFound(false);
                        setDataStarted(false);
                    }
                    else if(queryResult.status == 201) {
                        
                        setEndOfData(true);
                        setSearching(false);
                        setDataFound(false);
                        setDataStarted(false);
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
            
        else {
            
            console.log("DONE READING");
            // setEndOfData(true);
        }
}

 // get hostel details
 async function getHostelDetails(){

    try {
            
        // call the api using secret key and below columns
        // key, type, today, branch
        const result  = await getHostelsAPICall(process.env.NEXT_PUBLIC_API_PASS)
        const queryResult = await result.json() // get data
        
        // check if query result status is 200
        if(queryResult.status == 200) {
            
            // set the state variables with the user data
            setHostels(queryResult.data)
            // Extract hostel details into separate lists
            // setHostelNames(hostels.map((hostel) => hostel.hostelName));
            // setHostelIds(hostels.map((hostel) => hostel.hostelId));
            // setRoomNumbers(hostels.map((hostel) => hostel.roomNumbers));
            

        } else if(queryResult.status == 404) {
            
            console.log(queryResult.message);
            // show and hide message
            setResultType('error');
            setResultMessage('Issue loading. Please refresh or try again later!');
            setTimeout(function(){
                setResultType('');
                setResultMessage('');
            }, 3000);
            
        }
    }
    catch(e){

        // show and hide message
        setResultType('error');
        setResultMessage('Issue loading. Please refresh or try again later!');
        setTimeout(function(){
            setResultType('');
            setResultMessage('');
        }, 3000);
    }

}

    // get the requests data
    // for the user based on their role.
    async function getRequests(collegeId){
        

            // setSearching(true);
            const result  = await getActiveRequests(process.env.NEXT_PUBLIC_API_PASS, collegeId)
            const queryResult = await result.json() // get data
            
            // check for the status
            if(queryResult.status == 200){

                // check if data exits
                if(queryResult.outing.length > 0){
            
                    // set the state
                    // total students
                    // setTotalStudents(queryResult.count);
                    // setRegisteredStudents(queryResult.registered);

                    // requests
                    if(activeRequestsList==null){
                        setActiveRequestsList(queryResult.outing)
                        // setDataStarted(true)
                    }
                    else {
                        setActiveRequestsList((activeRequestsList) => [...activeRequestsList, ...queryResult.outing]);
                        // setDataStarted(true)
                    }

                    // visitor passes
                    if(activeVisitorPassList==null){
                        setActiveVisitorPasssList(queryResult.visitorpass)
                        // setDataStarted(true)
                    }
                    else {
                        setActiveVisitorPasssList((activeVisitorPassList) => [...activeVisitorPassList, ...queryResult.visitorpass]);
                        // setDataStarted(true)
                    }
                    // set data found
                    // setDataFound(true);
                }
                else {
                    // setEndOfData(true);
                    // setDataFound(false);
                }

                // setSearching(false);
                // setDataStarted(false);
            }
            else if(queryResult.status == 401) {
                
                // setSearching(false);
                // setDataFound(false);
                // setDataStarted(false);
            }
            else if(queryResult.status == 404) {
                
                // setSearching(false);
                // setDataFound(false);
                // setDataStarted(false);
            }
            else if(queryResult.status == 201) {
                
                // setEndOfData(true);
                // setSearching(false);
                // setDataFound(false);
                // setDataStarted(false);
            }
}


    // show user detail view
    function showUserDetail(collegeId){

        setSelectedStudent();
        setUserDetailview(false)

        const studentWithCollegeId = searchedStudentsList.find(
            (student) => student.collegeId === collegeId
          );
          

        setSelectedStudent(studentWithCollegeId);
        setUserDetailview(true);
        // console.log(collegeId);


        // get the active requests
        getRequests(studentWithCollegeId.collegeId);
    }

    
  return (
    
              

        //   <div className={styles.maindivcenter} style={{height:'90vh', contentVisibility:'auto',padding: '0px 24px'}}>
            

        //     <div style={{height:'10vh',display:'flex',flexDirection:'column',justifyContent:'center'}}>
        //         <h2 className={inter.className}>Student 360</h2>
        //         <div className={`${styles.menuItems} ${inter.className}`}>
        //             <div className={`${styles.menuItem} ${selectedTab === 'Search' ? styles.menuItem_selected : ''}`} onClick={() => handleTabChange('Search')}>Search student</div>
        //             <div className={`${styles.menuItem} ${selectedTab === 'Add student' ? styles.menuItem_selected : ''}`} onClick={() => handleTabChange('Add student')}>Add student</div>
                
        //         </div>
                
        //     </div>

            
          
         
        <div className={styles.verticalsection} style={{height:'80vh',gap:'8px'}}>

            <div style={{width:'100%',display:'flex', flexDirection:'row',justifyContent:'space-between'}}>
                
            {hostels ?  
                <div className={styles.horizontalsection}>
                    <div className={`${styles.primarybtn} `} style={{display:'flex', flexDirection:'row', width:'fit-content', cursor:'pointer', gap:'4px'}} onClick={toggleAddStudentOverlay}> 
                        <Plus />
                        <p className={`${inter.className}`}>Add student</p>
                    </div>
                    <div className={`${styles.overlayBackground} ${showAddStudent ? styles.hideshowdivshow : styles.hideshowdiv}`}>
                       {/* <AddStudent hostelData={hostels} toggleAddStudentOverlay={toggleAddStudentOverlay}/> */}
                       <AddStudent hostelDetail={hostels} toggleAddStudentOverlay={toggleAddStudentOverlay}/>
                    </div>
                </div>
                : ''}
                {(resultMessage.length > 0) ? <Toast type={resultType} message={resultMessage} /> : ''}
                {/* <div className={styles.horizontalsection}>
                    <div className={`${styles.btn1} `} style={{width:'fit-content', cursor:'pointer', gap:'4px'}} onClick={toggleAddStudentOverlay}> 
                        <Plus />
                        <p className={`${inter.className}`}>Add student</p>
                    </div>
                    <div className={`${styles.overlayBackground} ${showAddStudent ? styles.hideshowdivshow : styles.hideshowdiv}`}>
                        <AddStudent toggleAddStudentOverlay={toggleAddStudentOverlay}/> 
                    </div>
                </div> */}
            </div>

            <div className={styles.horizontalsection} style={{height:'100%', width:'100%'}}>
            
                <div className={styles.carddatasection} key={1234} style={{height:'100%'}}>
                       
                    <div className={styles.verticalsection} style={{height:'100%',overflow:'scroll'}}>

                        <div className={styles.horizontalsection}>
                        
                            <div className={styles.horizontalsection}>
                                <input type="radio" name="searchByCollegeId" value="searchByCollegeId" aria-label="Option 1"  checked={selectedSearchOption === 'searchByCollegeId'} onChange={handleRadioChange}/>
                                
                                <span className={`${inter.className} ${styles.text2}`}>College Id</span>
                            </div>
                            <div className={styles.horizontalsection}>
                                <input type="radio" name="searchByName" value="searchByName" checked={selectedSearchOption === 'searchByName'} onChange={handleRadioChange}/>
                                
                                <span className={`${inter.className} ${styles.text2}`}>Name</span>
                            </div>
                            <div className={styles.horizontalsection}>
                                <input type="radio" name="browseAll" value="browseAll" checked={selectedSearchOption === 'browseAll'} onChange={handleRadioChange}/>
                                
                                <span className={`${inter.className} ${styles.text2}`}>Browse All</span>
                            </div>
                            
                        </div>
                   
                        <p className={`${inter.className} ${styles.text3_heading}`}>Search by collegeId</p>
                        
                         <div className={`${inter.className}`} style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'8px'}}>
                                <input id="userObjectId" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Unique user ID" onKeyDown={handleKeyPress}/>
                                <button onClick={newSearch.bind(this)} className={`${inter.className} ${styles.scbtn}`} >Find</button>
                                
                                {/* {searching ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <p className={`${inter.className} ${styles.text3}`}>Searching...</p> 
                                </div> : ''} */}
{/*                                 
                                {(searchedStudentsList!=null && searchedStudentsList.length > 0) ? <div className={styles.horizontalsection}>
                                    <p className={`${inter.className} ${styles.text3}`}>Results:</p> 
                                    <p className={`${inter.className} ${styles.text1}`}>{searchedStudentsList.length}</p>
                                </div> : ''} */}
                            </div>

                            <div className={styles.horizontalsection}>
                                {(searchedStudentsList!=null && searchedStudentsList.length > 0) ? <div className={styles.horizontalsection}>
                                        <p className={`${inter.className} ${styles.text3}`}>Results:</p> 
                                        <p className={`${inter.className} ${styles.text1}`}>{searchedStudentsList.length}</p>
                                    </div> : ''}
                                {searching ? <div className={styles.horizontalsection}>
                                        <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                        <p className={`${inter.className} ${styles.text3}`}>Searching...</p> 
                                    </div> : ''}
                            </div>
                           
                            
                            {/* <button id="submit" onClick={loginHere.bind(this)} className={`${inter.className} ${styles.text2} ${styles.primarybtn}`}>Sign in</button> */}
                        
                            {(!dataFound && endOfData && searchedStudentsList.length == 0) ? <div className={`${styles.error} ${inter.className} ${styles.text2}`}>No match found</div>
                                :''}
                            {/* {inputError ? <div className={`${styles.error} ${inter.className} ${styles.text2}`}>Enter valid ID to proceed</div>
                                :''} */}
                            

                        {(!searchedStudentsList) ? 
                        ((!dataFound) ? 
                            <div className={styles.horizontalsection}>
                                <Check className={styles.icon} />
                                <p className={`${inter.className} ${styles.text3}`}>Search to see results!</p> 
                            </div>
                            : 
                            <div className={styles.horizontalsection}>
                                {/* <Loader className={`${styles.icon} ${styles.load}`} /> */}
                                <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                <p className={`${inter.className} ${styles.text3}`}>Getting students ...</p> 
                            </div>)
                            : 
                            <div className={styles.titlecard} style={{height: '80vh',alignItems:'stretch',overflow:'scroll'}}>
                            {searchedStudentsList.map(studentItem => (
                            
                                <div className={styles.verticalsection} key={studentItem.collegeId} style={{alignItems:'stretch', cursor:'pointer'}} onClick={() => showUserDetail(studentItem.collegeId)}>
                                    {/* <p className={`${inter.className} ${styles.text2}`} dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br>') }}></p> */}
                                    {/* <p className={`${inter.className} ${styles.text2}`}>{project.description.replace(/\n/g, '\n')}</p> */}
                                    
                                    <div  className={styles.cardBlockItem}>

                                        {/* <p className={(studentItem.requestType=='studentItem' ? 'requestItem_chip' : 'outing_chip')}>{studentItem.requestType}</p> */}

                                            <div className={styles.horizontalsection}> 


                                            {(studentItem.mediaCount == 1) ?
                                            <ImageComponent imageUrl={studentItem.userImage} id={studentItem.collegeId} username={studentItem.username}/>
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
                            {/* {(dataStarted2) ? */}
                            {(dataStarted && !endOfData) ?
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
                
            </div>

            {userDetailView ?

                    <div className={styles.carddatasection} key={12345} style={{height:'100%',flexGrow:'1',overflow:'scroll'}}>
                       
                       <div className={styles.verticalsection} style={{height:'100%',width:'100%'}}>
                        
                        <div className={styles.horizontalsection} style={{width: '100%',justifyContent: 'space-between'}}>
                            <h4 className={`${inter.className}`}>Profile</h4>
                            <div className={styles.horizontalsection} >
                                <div className={styles.horizontalsection}>
                                    <div className={`${styles.btn1} `} style={{width:'fit-content', cursor:'pointer', gap:'4px'}} onClick={toggleUpdateProfileOverlay}> 
                                        <PencilSimple />
                                        <p className={`${inter.className}`}>Update profile</p>
                                    </div>
                                    <div className={`${styles.overlayBackground} ${show ? styles.hideshowdivshow : styles.hideshowdiv}`}>
                                        <UpdateUser userDetail={selectedStudent} handleDataChange={updateSelectedStudent} toggleUpdateProfileOverlay={toggleUpdateProfileOverlay}/> 
                                    </div>
                                </div>
                                <div className={styles.horizontalsection}>
                                    <div className={`${styles.btn1} `} style={{width:'fit-content', cursor:'pointer', gap:'4px'}} onClick={toggleUpdateParentsOverlay}> 
                                        <PencilSimple />
                                        <p className={`${inter.className}`}>Parents & Hostel</p>
                                    </div>
                                    <div className={`${styles.overlayBackground} ${showParents ? styles.hideshowdivshow : styles.hideshowdiv}`}>
                                        <UpdateParents userDetail={selectedStudent} hostelDetail={hostels} handleDataChange={updateSelectedStudent} toggleUpdateParentsOverlay={toggleUpdateParentsOverlay}/> 
                                    </div>
                                </div>
                                
                            </div>
                        </div>

                        {/* <UpdateUser /> */}
                        <br/>
                        
                        
                        <div className={styles.verticalsection} style={{width:'100%'}}>
                            {/* <p className={`${inter.className} ${styles.text3_heading}`}>Total:</p> */}
                            
                            
                            {/* <div className={`${inter.className}`} style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px'}}>
                                <p className={`${inter.className} ${styles.text3_heading}`}>Name:</p>
                                <h3 className={`${inter.className}`} >{selectedStudent.username}</h3>
                            </div> */}

                            <div className={styles.horizontalsection} style={{gap:'24px',alignItems:'flex-start',padding:'32px',width:'100%'}}>
                                
                                <ImageComponentLarge imageUrl={selectedStudent.userImage} id={selectedStudent.collegeId} username={selectedStudent.username}/>
                                

                                {/* <!-- Enlarged image container --> */}
                                {/* <div id="enlargedimg" className={styles.enlargedImg} onClick={() => hideEnlarged()}>
                                    <ImageComponentLarge imageUrl={selectedStudent.userImage} id={selectedStudent.collegeId} username={selectedStudent.username}/>
                                   
                                </div> */}


                                <div className={styles.verticalsection} style={{flex:'1'}}>
                                    <h3 className={`${inter.className}`} >{selectedStudent.username}</h3>
                                    <p className={`${inter.className} ${styles.text2}`} style={{letterSpacing:'1px'}}>{selectedStudent.collegeId} • {selectedStudent.branch} • {selectedStudent.year} Year</p>
{/*                                     
                                    {(selectedStudent.type == 'Hostel' || selectedStudent.type == 'hostel') ? 
                                    <p className={`${inter.className} ${styles.text2}`}>Hosteler</p> 
                                    : <p className={`${inter.className} ${styles.text2}`}>Day scholar</p>}
                                    
                                    {(selectedStudent.type != '-') ? 
                                    <p className={`${inter.className} ${styles.text3} ${styles.tag}`}>Outing: {(selectedStudent.outingType == 'yes') ? 'Self permitted' : 'Not-self permitted'}</p>
                                    : ''}
                                         */}
                                    <br/>
                                    {(selectedStudent.type == 'Hostel' || selectedStudent.type == 'hostel') ? 
                                        <div style={{width:'100%'}}>
                                            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
                                                <p className={`${inter.className} ${styles.text3}`}>Student type:</p>
                                                <p className={`${inter.className} ${styles.text2}`}>Hosteler</p>
                                            </div>
                                            <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px 8px 0px'}}></div>
                                        </div>
                                        : 
                                        <div style={{width:'100%'}}>
                                            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
                                                <p className={`${inter.className} ${styles.text3}`}>Student type:</p>
                                                <p className={`${inter.className} ${styles.text2}`}>Day scholar</p>
                                            </div>
                                            <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px 8px 0px'}}></div>
                                        </div>
                                    }

                                    {(selectedStudent.type != '-') ? 
                                        <div style={{width:'100%'}}>
                                            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
                                                <p className={`${inter.className} ${styles.text3}`}>Outing type:</p>
                                                <p className={`${inter.className} ${styles.text2} ${styles.tag}`}>{(selectedStudent.outingType == 'yes') ? 'Self permitted' : 'Not-self permitted'}</p>
                                            </div>
                                            <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'12px 0px 4px 0px'}}></div>
                                        </div>
                                        :
                                        ''
                                    }
                                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
                                        <p className={`${inter.className} ${styles.text3}`}>Email:</p>
                                        <p className={`${inter.className} ${styles.text2}`}>{selectedStudent.email}</p>
                                    </div>
                                    <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px'}}></div>
                                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
                                        <p className={`${inter.className} ${styles.text3}`}>Mobile:</p>
                                        <p className={`${inter.className} ${styles.text2}`}>{selectedStudent.phoneNumber}</p>
                                    </div>
                                    <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px'}}></div>
                                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
                                        <p className={`${inter.className} ${styles.text3}`}>Hostel:</p>
                                        <p className={`${inter.className} ${styles.text2}`}>{selectedStudent.hostelName}</p>
                                    </div>
                                    <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px'}}></div>
                                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
                                        <p className={`${inter.className} ${styles.text3}`}>Room number:</p>
                                        <p className={`${inter.className} ${styles.text2}`}>{selectedStudent.roomNumber}</p>
                                    </div>
                                    <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px'}}></div>
                                    {/* <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',width:'100%'}}>
                                        <p className={`${inter.className} ${styles.text3}`}>Email: {selectedStudent.email}</p>
                                        <p className={`${inter.className} ${styles.text3}`}>Mobile: {selectedStudent.phoneNumber}</p>
                                    </div>
                                    <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'12px 0px'}}></div> */}
                                                
                                    {/* <br/>
                                    {(selectedStudent.type == 'Hostel' || selectedStudent.type == 'hostel') ? 
                                    <p className={`${inter.className} ${styles.text3}`}>Hostel: {selectedStudent.hostelName}, Room number: {selectedStudent.roomNumber}</p>
                                    : ''} */}
                                    <br/>
                                </div>
                            </div>
                            

                        </div>
                        
                        <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'12px 0px'}}></div>

                        {(activeRequestsList!=null && activeRequestsList.length > 0) ?
                        <div style={{display:'flex',flexWrap:'wrap' ,gap:'8px'}}>
                            <p className={`${inter.className} ${styles.text1}`} style={{color:'darkorange',fontSize:'28px'}} >•</p>
                            <p className={`${inter.className} ${styles.text1}`} >Outing request –</p>
                            <p className={`${inter.className} ${styles.text2}`}>{dayjs(activeRequestsList[0].requestFrom).format('MMM DD, YYYY')} – {dayjs(activeRequestsList[0].requestTo).format('MMM DD, YYYY')}</p>
                            <p className={`${inter.className} ${styles.text3}`}>({activeRequestsList[0].description})</p>
                        </div>
                        : <p className={`${inter.className} ${styles.text3}`} >No active requests</p>
                        }
                        
                        <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'12px 0px'}}></div>

                        {(activeVisitorPassList!=null && activeVisitorPassList.length > 0) ?
                        
                            <div style={{display:'flex',flexWrap:'wrap' ,gap:'8px',width:'100%'}}>
                                <p className={`${inter.className} ${styles.text1}`} style={{color:'darkorange',fontSize:'28px'}} >•</p>
                                <p className={`${inter.className} ${styles.text1}`} >Visitor pass –</p>
                                <p className={`${inter.className} ${styles.text2}`}>{dayjs(activeVisitorPassList[0].visitOn).format('MMM DD, YYYY')} – {activeRequestsList[0].count} members</p>
                                <p className={`${inter.className} ${styles.text3}`}>({activeRequestsList[0].description})</p>
                            </div>
                            
                        
                        : ''
                        }
                        {(activeVisitorPassList!=null && activeVisitorPassList.length > 0) ?
                        <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'12px 0px'}}></div>:''}
                        
                        <p className={`${inter.className} ${styles.text1}`} >Parents</p>
                        <div className={styles.verticalsection} style={{width:'100%'}}>
                            
                            {(selectedStudent.fatherName.length > 2) ? 
                            <div className={styles.horizontalsection} style={{alignItems:'flex-start'}}>
                                <ImageComponent imageUrl={"https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/"+selectedStudent.collegeId+"_1.jpeg?alt=media"} id={selectedStudent.collegeId} username={selectedStudent.fatherName}/>
                                <div>
                                    <p className={`${inter.className} ${styles.text2}`}>Father: {selectedStudent.fatherName}</p> 
                                    <p className={`${inter.className} ${styles.text2}`}>{selectedStudent.fatherPhoneNumber}</p> 
                                    <br/>
                                </div>
                            </div>
                            : ''}
                            
                            
                            {(selectedStudent.motherName.length > 2) ? 
                             <div className={styles.horizontalsection} style={{alignItems:'flex-start'}}>
                                <ImageComponent imageUrl={"https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/"+selectedStudent.collegeId+"_2.jpeg?alt=media"} id={selectedStudent.collegeId} username={selectedStudent.motherName}/>
                                <div>
                                    <p className={`${inter.className} ${styles.text2}`}>Mother: {selectedStudent.motherName}</p> 
                                    <p className={`${inter.className} ${styles.text2}`}>{selectedStudent.motherPhoneNumber}</p> 
                                    <br/>
                                </div>
                            </div>
                            : ''}
                            
                            {(selectedStudent.guardianName.length > 2) ? 
                            <div className={styles.horizontalsection} style={{alignItems:'flex-start'}}>
                                <ImageComponent imageUrl={"https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/"+selectedStudent.collegeId+"_3.jpeg?alt=media"} id={selectedStudent.collegeId} username={selectedStudent.guardianName}/>
                                <div>
                                    <p className={`${inter.className} ${styles.text2}`}>Guardian 1: {selectedStudent.guardianName}</p> 
                                    <p className={`${inter.className} ${styles.text2}`}>{selectedStudent.guardianPhoneNumber}</p> 
                                    <br/>
                                </div>
                            </div>
                            : ''}
                            
                            {(selectedStudent.guardian2Name.length > 2) ? 
                            <div className={styles.horizontalsection} style={{alignItems:'flex-start'}}>
                                <ImageComponent imageUrl={"https://firebasestorage.googleapis.com/v0/b/smartcampusimages-1.appspot.com/o/"+selectedStudent.collegeId+"_3.jpeg?alt=media"} id={selectedStudent.collegeId} username={selectedStudent.guardian2Name}/>
                                <div>
                                    <p className={`${inter.className} ${styles.text2}`}>Guardian 2: {selectedStudent.guardian2Name}</p> 
                                    <p className={`${inter.className} ${styles.text2}`}>{selectedStudent.guardian2PhoneNumber}</p> 
                                    <br/>
                                </div>
                            </div>
                            : ''}
                            
                        </div>

                        <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'12px 0px'}}></div>

                        <div style={{width:'100%'}}>
                                <p className={`${inter.className} ${styles.text1}`}>Address: {selectedStudent.address}</p> 
                            <br/>
                        </div>
                        <br/>
                      </div>
            </div>
            :
            '' }

        </div>
        
                
    </div>
    
    
    
  );
}



    // function ImageComponent({ imageUrl, id, username }) {
    //     return (
    //       <div>
    //         {/* Replace 'imageUrl' with the actual URL of the image */}
    //         <img key={id} src={imageUrl} alt={abbreviateName(username)} width={'50px'} height={'50px'} style={{objectFit:'cover',backgroundColor:'#F5F5F5',borderRadius:'50%'}} />
    //       </div>
    //     );
    //   }

     

    function ImageComponent({ imageUrl, id, username }) {
        
        const [imageLoaded, setImageLoaded] = useState(false);

        // a varaiable for showing enlarged image
        const [isEnlarged, setIsEnlarged] = useState(false);
        const toggleEnlarged = () => {
            setIsEnlarged(!isEnlarged);
        };

        useEffect(() => {

            try{
                const img = new Image();
                img.src = imageUrl;
            
                img.onload = () => {
                    setImageLoaded(true);
                };
            
                img.onerror = () => {
                    setImageLoaded(false);
                };
            }
            catch(e){
                // console.log("Error loading image");
            }
          }, [imageUrl]);
    
        return (
          <div>
            {imageLoaded ? (

                <div>
                {isEnlarged ? (
                        <div className="enlarged-image" onClick={toggleEnlarged} style={{ position: 'fixed', top: 0, left: 0, width: '100%',height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, }}>
                            <img key={id} src={imageUrl} alt="Profile image" style={{ objectFit: 'cover', backgroundColor: '#F5F5F5', borderRadius: '8px', cursor: 'pointer',maxWidth: '100%',maxHeight: '100%' }} onClick={toggleEnlarged} />
                        </div>
                    ) : 
                    ''}
                    <img
                        key={id}
                        src={imageUrl}
                        alt="Profile image"
                        width={'50px'}
                        height={'50px'}
                        style={{ objectFit: 'cover', backgroundColor: '#F5F5F5', borderRadius: '10%', cursor: 'pointer' }}
                        onClick={toggleEnlarged} 
                        title='Click to enlarge'
                    />
                    </div>
            //   <img
            //     key={id}
            //     src={imageUrl}
            //     alt="Downloaded Image"
            //     width={'50px'}
            //     height={'50px'}
            //     style={{ objectFit: 'cover', backgroundColor: '#F5F5F5', borderRadius: '50%' }}
            //   />
            ) : (
              <div style={{backgroundColor: '#f5f5f5', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}><p className={`${inter.className}`}>{abbreviateName(username)}</p></div>
            )}
          </div>
        );
      }
     
      function ImageComponentLarge({ imageUrl, id, username }) {
        
        const [imageLoaded, setImageLoaded] = useState(false);

        // a varaiable for showing enlarged image
        const [isEnlarged, setIsEnlarged] = useState(false);
        const toggleEnlarged = () => {
            setIsEnlarged(!isEnlarged);
        };

        useEffect(() => {
            const img = new Image();
            img.src = imageUrl;
        
            img.onload = () => {
              setImageLoaded(true);
            };
        
            img.onerror = () => {
              setImageLoaded(false);
            };
          }, [imageUrl]);
    
      
        return (
          <div>
            {imageLoaded ? (
                <div>
                {isEnlarged ? (
                        <div className="enlarged-image" onClick={toggleEnlarged} style={{ position: 'fixed', top: 0, left: 0, width: '100%',height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, }}>
                            <img key={id} src={imageUrl} alt="Profile image" style={{ objectFit: 'cover', backgroundColor: '#F5F5F5', borderRadius: '8px', cursor: 'pointer',maxWidth: '100%',maxHeight: '100%' }} onClick={toggleEnlarged} />
                        </div>
                    ) : 
                    ''}
                    <img
                        key={id}
                        src={imageUrl}
                        alt="Profile image"
                        width={'200px'}
                        height={'250px'}
                        style={{ objectFit: 'cover', backgroundColor: '#F5F5F5', borderRadius: '10%', cursor: 'pointer' }}
                        onClick={toggleEnlarged} 
                        title='Click to enlarge'
                    />
                    </div>

            //   <img
            //     key={id}
            //     src={imageUrl}
            //     alt="Downloaded Image"
            //     width={'200px'}
            //     height={'250px'}
            //     style={{ objectFit: 'cover', backgroundColor: '#F5F5F5', borderRadius: '10%', cursor: 'pointer' }}
            //     onClick={toggleEnlarged} 
            //   />
            ) : (
                <div style={{backgroundColor: '#f5f5f5', width: '200px', height: '250px', borderRadius: '10%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <h2 className={`${inter.className}`}>{abbreviateName(username)}</h2><br/>
                    <p className={`${inter.className} ${styles.text3}`}>No image</p>
                </div>
            )}
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