'use client'

import { Inter } from 'next/font/google'
import React, {useEffect, useState } from 'react'
const inter = Inter({ subsets: ['latin'] })
import styles from '../page.module.css'
import Toast from './toast';
import dayjs from 'dayjs'

// create new request with below params
// key, collegeId, username, email, branch, phoneNumber, year, semester, type, outingType
  const createUser = async (pass, updateDataBasic, updateDataDetail) => 
  
    fetch("/api/user/"+pass+"/U11/"+updateDataBasic+"/"+updateDataDetail, {
        
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

// Create new outing request for student
export default function AddStudent({hostelDetail, toggleAddStudentOverlay}) {
// export default function AddUser({userDetail, handleDataChange, toggleUpdateProfileOverlay}) {
    // const [hostelDetail, showHostels] = useState(hostelDetail);

    const [user, showUser] = useState();
    // const [show, showUpdateDialog] = useState(handleClick);

    // const handleClick = async (event, skip) => {
    const closeClick = async () => {
        seterrorMsg('');
        toggleAddStudentOverlay(false)
    }

    
    //create new date object
    const today = new dayjs();

    const [errorMsg, seterrorMsg] = useState('');
    const [resultType, setResultType] = useState('');
    const [resultMessage, setResultMessage] = useState('');

    const [isAllowed, setIsallowed] = useState(true);

    // hostel data
    const [hostels, setHostels] = useState(hostelDetail);
    const [hostelNames, setHostelNames] = useState();
    const [hostelIds, setHostelIds] = useState();
    const [roomNumbers, setRoomNumbers] = useState();
    
   
    // BASIC USER DETAILS
    // collegeId
    const [collegeId, setCollegeId] = useState('');
    const updateCollegeId = (event) => {
        setCollegeId(event.target.value);
    };
    // username
    const [username, setUsername] = useState('');
    const updateUsername = (event) => {
        setUsername(event.target.value);
    };
    // email
    const [email, setEmail] = useState('');
    const updateEmail = (event) => {
        setEmail(event.target.value);
    };
    // phoneNumber
    const [phoneNumber, setPhoneNumber] = useState('');
    const updatePhoneNumber = (event) => {
        setPhoneNumber(event.target.value);
    };
    // branch
    const [branch, setBranch] = useState('');
    const updateBranch = (event) => {
        setBranch(event.target.value);
    };
    // year
    const [year, setYear] = useState(1);
    const updateYear = (event) => {
        setYear(event.target.value);
    };
    // semester
    const [semester, setSemester] = useState(1);
    const updateSemester = (event) => {
        setSemester(event.target.value);
    };
    // type
    const [type, setType] = useState('Day scholar');
    const updateType = (event) => {
        setType(event.target.value);
    };
    // outingType
    const [outingType, setOutingType] = useState('no');
    const updateOutingType = (event) => {
        setOutingType(event.target.value);
    };


    // USER DETAILS OF USER
    // father name
    const [fatherName, setFatherName] = useState('');
    const updateFatherName = (event) => {
        setFatherName(event.target.value);
    };
    // father phonenumber
    const [fatherPhoneNumber, setFatherPhoneNumber] = useState('');
    const updateFatherPhoneNumber = (event) => {
        setFatherPhoneNumber(event.target.value);
    };
    // mother name
    const [motherName, setMotherName] = useState('');
    const updateMotherName = (event) => {
        setMotherName(event.target.value);
    };
    // father phonenumber
    const [motherPhoneNumber, setMotherPhoneNumber] = useState('');
    const updateMotherPhoneNumber = (event) => {
        setMotherPhoneNumber(event.target.value);
    }; 
    // guardian name
    const [guardianName, setGuardianName] = useState('');
    const updateGuardianName = (event) => {
        setGuardianName(event.target.value);
    };
    // guardian phonenumber
    const [guardianPhoneNumber, setGuardianPhoneNumber] = useState('');
    const updateGuardianPhoneNumber = (event) => {
        setGuardianPhoneNumber(event.target.value);
    };
    // guardian2 name
    const [guardian2Name, setGuardian2Name] = useState('');
    const updateGuardian2Name = (event) => {
        setGuardian2Name(event.target.value);
    };
    // guardian2 phonenumber
    const [guardian2PhoneNumber, setGuardian2PhoneNumber] = useState('');
    const updateGuardian2PhoneNumber = (event) => {
        setGuardian2PhoneNumber(event.target.value);
    };
    // address
    const [address, setAddress] = useState('');
    const updateAddress = (event) => {
        setAddress(event.target.value);
    };
    // hostel id
    const [hostelId, setHostelId] = useState('');
    const [selectedHostelIdIndex, setSelectedHostelIdIndex] = useState(0);
    const updateHostelId = (event) => {
        setSelectedHostelIdIndex(hostelIds.indexOf(event.target.value));
        setHostelId(event.target.value);
        setHostelName(hostelNames[hostelIds.indexOf(event.target.value)]);
        // updateHostelName()
    };
    // hostel name
    const [hostelName, setHostelName] = useState('');
    const updateHostelName = (event) => {
        setHostelName(event.target.value);
    };
    // Room number
    const [roomNumber, setRoomNumber] = useState('');
    const updateRoomNumber = (event) => {
        setRoomNumber(event.target.value);
    };
    
    

    useEffect(()=>{ 
        
        // get the hostel details
        getHostelDetails();

    },[selectedHostelIdIndex, hostels])

    // get hostel details
    async function getHostelDetails(){


        // set the state variables with the user data
        if(hostels!=null){
            setHostels(hostels)
            
            // Extract hostel details into separate lists
            setHostelNames(hostels.map((hostel) => hostel.hostelName));
            setHostelIds(hostels.map((hostel) => hostel.hostelId));
            setRoomNumbers(hostels.map((hostel) => hostel.roomNumbers));
        }
        else {
            console.log("Not yet loaded bro");
        }


        // // call the api using secret key and below columns
        // // key, type, today, branch
        // const result  = await getHostelsAPICall(process.env.NEXT_PUBLIC_API_PASS)
        // const queryResult = await result.json() // get data
        
        // // check if query result status is 200
        // if(queryResult.status == 200) {
            
        //     // set the state variables with the user data
        //     setHostels(queryResult.data)
        //     console.log('Bro');
        //     console.log(queryResult.data);
        //     console.log(queryResult.data.map((hostel) => hostel.hostelName));
        //     console.log(queryResult.data.map((hostel) => hostel.hostelId));
            
        //     // Extract hostel details into separate lists
        //     setHostelNames(queryResult.data.map((hostel) => hostel.hostelName));
        //     setHostelIds(queryResult.data.map((hostel) => hostel.hostelId));
        //     setRoomNumbers(queryResult.data.map((hostel) => hostel.roomNumbers));

        // } else if(queryResult.status == 404) {

            
        // }
    }

    // update user
    async function createUserNow(){

    // check for the input
    if(document.getElementById('username').value.length > 0 && document.getElementById('email').value.length > 0 && document.getElementById('phoneNumber').value.length > 0 && document.getElementById('fatherName').value.length > 0 && document.getElementById('fatherPhoneNumber').value.length > 0){

        // this is the key value pair data that includes what all to be updated
        const updateDataBasic = {
        };
        const updateDataDetail = {
        };

        // check all the fields to understand what has changed.
        // create a key value pair object
        // update the local object
        // BASIC PROFILE
        
            updateDataBasic.userObjectId = collegeId
            updateDataBasic.campusId = 'SVECW'
            updateDataBasic.collegeId = collegeId
            updateDataBasic.password = collegeId
            updateDataBasic.role = 'Student'
            updateDataBasic.updatedAt = dayjs(today.toDate()).format('YYYY-MM-DD');
            updateDataBasic.mediaCount = 0;
            updateDataBasic.userImage = '-';
            updateDataBasic.gcm_regId = '-';
            updateDataBasic.section = '-';
            updateDataBasic.profileUpdated = 1; // 1 represents existing student with proper college Id

            updateDataBasic.username = username
            updateDataBasic.email = email
            updateDataBasic.phoneNumber = phoneNumber
            updateDataBasic.branch = branch
            updateDataBasic.year = year
            updateDataBasic.semester = semester
            updateDataBasic.type = type
            updateDataBasic.outingType = outingType

            updateDataDetail.collegeId = collegeId
            updateDataDetail.fatherName = ((fatherName.length>0) ? fatherName : '-')
            updateDataDetail.fatherPhoneNumber = ((fatherPhoneNumber.length > 0) ? fatherPhoneNumber : '-')
            updateDataDetail.motherName = ((motherName.length > 0) ? motherName : '-')
            updateDataDetail.motherPhoneNumber = ((motherPhoneNumber.length > 0) ? motherPhoneNumber : '-')
            updateDataDetail.guardianName = ((guardianName.length > 0) ? guardianName : '-')
            updateDataDetail.guardianPhoneNumber = ((guardianPhoneNumber.length > 0) ? guardianPhoneNumber : '-')
            updateDataDetail.guardian2Name = ((guardian2Name.length > 0) ? guardian2Name : '-')
            updateDataDetail.guardian2PhoneNumber = ((guardian2PhoneNumber.length > 0) ? guardian2PhoneNumber : '-')
            updateDataDetail.address = ((address.length > 0) ? address : '-')
            updateDataDetail.hostelId = ((hostelId.length > 0) ? hostelId : '-')
            updateDataDetail.roomNumber = ((roomNumber.length > 0) ? roomNumber : '-')
        
        // if(user.username != username){
        //     updateDataBasic.username = username
        // }
        // if(user.email != email){
        //     updateDataBasic.email = email
        // }
        // if(user.phoneNumber != phoneNumber){
        //     updateDataBasic.phoneNumber = phoneNumber
        // }
        // if(user.branch != branch){
        //     updateDataBasic.branch = branch
        // }
        // if(user.year != year){
        //     updateDataBasic.year = year
        // }
        // if(user.semester != semester){
        //     updateDataBasic.semester = semester
        // }
        // if(user.type != type){
        //     updateDataBasic.type = type
        // }
        // if(user.outingType != outingType){
        //     updateDataBasic.outingType = outingType
        // }

        // USER DETAILS
        // if(user.collegeId != collegeId){
        //     updateDataDetail.detailsId = collegeId
        // }
        // if(user.fatherName != fatherName){
        //     updateDataDetail.fatherName = fatherName
        // }
        // if(user.fatherPhoneNumber != fatherPhoneNumber){
        //     updateDataDetail.fatherPhoneNumber = fatherPhoneNumber
        // }
        // if(user.motherName != motherName){
        //     updateDataDetail.motherName = motherName
        // }
        // if(user.motherPhoneNumber != motherPhoneNumber){
        //     updateDataDetail.motherPhoneNumber = motherPhoneNumber
        // }
        // if(user.guardianName != guardianName){
        //     updateDataDetail.guardianName = guardianName
        // }
        // if(user.guardianPhoneNumber != guardianPhoneNumber){
        //     updateDataDetail.guardianPhoneNumber = guardianPhoneNumber
        // }
        // if(user.address != address){
        //     updateDataDetail.address = address
        // }
        // if(user.hostelId != hostelId){
        //     updateDataDetail.hostelId = hostelId
        // }
        // if(user.hostelName != hostelName){
        //     updateDataDetail.hostelName = hostelName
        // }
        // if(user.roomNumber != roomNumber){
        //     updateDataDetail.roomNumber = roomNumber
        // }

        // Check if updateData has any key-value pairs (not empty)
        if (Object.keys(updateDataBasic).length > 0 && Object.keys(updateDataDetail).length > 0) {
           
            // set the department
            // if(user.branch != branch){
                updateDataBasic.department = year+'_'+branch
            // }

            // call the api using secret key and below columns
            // key, type, today, branch
            console.log("/api/user/"+process.env.NEXT_PUBLIC_API_PASS+"/U11/"+JSON.stringify(updateDataBasic)+"/"+JSON.stringify(updateDataDetail));
            const result  = await createUser(process.env.NEXT_PUBLIC_API_PASS, JSON.stringify(updateDataBasic), JSON.stringify(updateDataDetail))
            const queryResult = await result.json() // get data
            
            // check if query result status is 200
            if(queryResult.status == 200) {
                // set the state variables with the user data
                
                seterrorMsg('');

                // show and hide message
                setResultType('success');
                setResultMessage('Updated!');
                setTimeout(function(){
                    setResultType('');
                    setResultMessage('');
                }, 3000);
                

            } else if(queryResult.status == 404) {

                seterrorMsg('');
                console.log(queryResult.message);
                // show and hide message
                setResultType('error');
                setResultMessage('Issue submitting request. Please try again later!');
                setTimeout(function(){
                    setResultType('');
                    setResultMessage('');
                }, 3000);
                
            }

            
        } else {
            seterrorMsg('');
            
            // show and hide message
            setResultType('info');
            setResultMessage('Nothing to update!');
            setTimeout(function(){
                setResultType('');
                setResultMessage('');
            }, 3000);
        }
    } else {
        // show error incase of no input
        seterrorMsg('Enter the required fields');
    }
  
}



  return (
    // new outing request form
    <div>
        
        {/* <div className={styles.titlecard}>
            <div className={styles.section_one}> */}
            
            {/* prompt the user for college Id
            and verify if it exists in the sytem */}
            <div className={styles.overlay}>

            <div style={{height:'100%',overflow:'scroll'}}>
            
                <h4 className={`${inter.className}`}>Add student</h4>
                <p className={`${inter.className} ${styles.text3}`}  style={{paddingTop:'4px'}}>Update one or more fields at a time.</p><br/>
                
                {(errorMsg.length > 0) ? 
                    <div className={`${styles.error} ${inter.className} ${styles.text2}`}>{errorMsg}</div>
                    :''}
                <p className={`${inter.className} ${styles.text3}`}>College ID:</p>
                <input id="collegeId" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="College registration ID" value={collegeId} onChange={updateCollegeId}/>
                <br/><br/>
                <p className={`${inter.className} ${styles.text3}`}>Full name:</p>
                <input id="username" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Full name" value={username} onChange={updateUsername}/>
                <br/><br/>
                <p className={`${inter.className} ${styles.text3}`}>Email:</p>
                <input id="email" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Your official email id" value={email} onChange={updateEmail}/>
                <br/><br/>
                <p className={`${inter.className} ${styles.text3}`}>Mobile number:</p>
                <input id="phoneNumber" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Mobile number" value={phoneNumber} onChange={updatePhoneNumber}/>
                <br/><br/>
                <p className={`${inter.className} ${styles.text3}`}>Branch:</p>
                <select value={branch} onChange={updateBranch} className={`${inter.className} ${styles.text2} ${styles.textInput}`}>
                    <option value="">Select...</option>
                    <option value="IT">IT</option>
                    <option value="CSE">CSE</option>
                    <option value="ME">ME</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="CE">CE</option>
                    <option value="AIDS">AIDS</option>
                    <option value="AIML">AIML</option>
                    <option value="CSM">CSM</option>
                    <option value="BS">BS</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="MBA">MBA</option>
                </select>
                <br/><br/>
                <p className={`${inter.className} ${styles.text3}`}>Year:</p>
                <select value={year} onChange={updateYear} className={`${inter.className} ${styles.text2} ${styles.textInput}`}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                <br/><br/>
                <p className={`${inter.className} ${styles.text3}`}>Semester:</p>
                <select value={semester} onChange={updateSemester} className={`${inter.className} ${styles.text2} ${styles.textInput}`}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
                <br/><br/>
                <p className={`${inter.className} ${styles.text3}`}>Student type:</p>
                <select value={type} onChange={updateType} className={`${inter.className} ${styles.text2} ${styles.textInput}`}>
                    <option value="Day scholar">Day scholar</option>
                    <option value="hostel">Hosteler</option>
                </select>
                <br/><br/>
                {(type == 'Hostel' || type == 'hostel') ? <div>
                    <br/>
                    <p className={`${inter.className} ${styles.text3}`}>Outing type:</p>
                    <select value={outingType} onChange={updateOutingType} className={`${inter.className} ${styles.text2} ${styles.textInput}`}>
                        <option value="no">Not-self</option>
                        <option value="yes">Self</option>
                    </select>
                </div>
                : ''}
                <br/><br/>




                <p className={`${inter.className} ${styles.text3}`}>Father name:</p>
                <input id="fatherName" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Father name" value={fatherName} onChange={updateFatherName}/>
                <br/><br/>
                <p className={`${inter.className} ${styles.text3}`}>Father phone number:</p>
                <input id="fatherPhoneNumber" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Father phone number" value={fatherPhoneNumber} onChange={updateFatherPhoneNumber}/>
                <br/><br/>
                <p className={`${inter.className} ${styles.text3}`}>Mother name:</p>
                <input id="motherName" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Mother name" value={motherName} onChange={updateMotherName}/>
                <br/><br/>
                <p className={`${inter.className} ${styles.text3}`}>Mother phone number:</p>
                <input id="motherPhoneNumber" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Mother phone number" value={motherPhoneNumber} onChange={updateMotherPhoneNumber}/>
                <br/><br/>
                <p className={`${inter.className} ${styles.text3}`}>Guardian 1 name:</p>
                <input id="guardianName" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Guardian 1 name" value={guardianName} onChange={updateGuardianName}/>
                <br/><br/>
                <p className={`${inter.className} ${styles.text3}`}>Guardian 1 phone number:</p>
                <input id="guardianPhoneNumber" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Guardian 1 phone number" value={guardianPhoneNumber} onChange={updateGuardianPhoneNumber}/>
                <br/><br/>
                <p className={`${inter.className} ${styles.text3}`}>Guardian 2 name:</p>
                <input id="guardian2Name" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Guardian 2 name" value={guardian2Name} onChange={updateGuardian2Name}/>
                <br/><br/>
                <p className={`${inter.className} ${styles.text3}`}>Guardian 2 phone number:</p>
                <input id="guardian2PhoneNumber" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Guardian 2 phone number" value={guardian2PhoneNumber} onChange={updateGuardian2PhoneNumber}/>
                <br/><br/>
                
                <p className={`${inter.className} ${styles.text3}`}>Address:</p>
                <input id="address" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Address" value={address} onChange={updateAddress}/>
                <br/><br/>

                {(type == 'Hostel' || type == 'hostel') ?
                <div>
                    <p className={`${inter.className} ${styles.text3}`}>Hostel:</p>
                    <select value={hostelId} onChange={updateHostelId} className={`${inter.className} ${styles.text2} ${styles.textInput}`}>
                    {hostelNames.map((hostelName, index) => (
                                <option key={hostelIds[index]} value={hostelIds[index]}>{hostelName}</option>
                            ))}
                    </select>
                    <br/><br/>
                </div> : ''}

                {(type == 'Hostel' || type == 'hostel') ? 
                <div>
                    <p className={`${inter.className} ${styles.text3}`}>Room number:</p>
                    <select value={roomNumber} onChange={updateRoomNumber} className={`${inter.className} ${styles.text2} ${styles.textInput}`}>
                    
                    {roomNumbers[selectedHostelIdIndex].split(',').map((roomNumber, index) => (
                        // Extract room numbers into an array
                                <option key={roomNumber} value={roomNumber}>{roomNumber}</option>
                                
                            ))}
                    </select>
                    <br/><br/>
                </div> : ''}
                
                {/* <input id="semester" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Mobile number" value={phoneNumber} onChange={updatePhoneNumber}/>
                <input id="type" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Mobile number" value={phoneNumber} onChange={updatePhoneNumber}/>
                <input id="outingType" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Mobile number" value={phoneNumber} onChange={updatePhoneNumber}/> */}
                
                <p className={`${inter.className} ${styles.text3}`}>Check all the fields before updating</p>


                
                {(errorMsg.length > 0) ? 
                    <div className={`${styles.error} ${inter.className} ${styles.text2}`}>{errorMsg}</div>
                    :''}

                 {(resultMessage.length > 0) ? <Toast type={resultType} message={resultMessage} /> : ''}

                 <br/>
                 <br/>
                 <br/>

                
            </div>
                <br/>
                <div style={{display:'flex',gap:'8px',position:'fixed',bottom:'0',padding: '8px 0px',width: '100%',backgroundColor: '#ffffff'}}>
                    <button id="submit" onClick={createUserNow} className={`${inter.className} ${styles.text2} ${styles.primarybtn}`}>Update now</button>
                    <button id="cancel" onClick={closeClick} className={`${inter.className} ${styles.text2} ${styles.secondarybtn}`}>Close</button>
                </div>
                

    </div>
    
    </div>

    
    
    
  );
}



  // get a random string
  function randString(){
    var s = "";
    while(s.length<9&&9>0){
        var r = Math.random();
        s = s + (r<0.1?Math.floor(r*100):String.fromCharCode(Math.floor(r*26) + (r>0.5?97:65)));
    }
    return s;
}