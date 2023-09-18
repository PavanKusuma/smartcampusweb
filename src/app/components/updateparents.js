'use client'

import { Inter } from 'next/font/google'
// import { SpinnerGap } from 'phosphor-react'
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
import { useEffect, useState } from 'react'
const inter = Inter({ subsets: ['latin'] })
import Biscuits from 'universal-cookie'
import styles from '../page.module.css'
import { useRouter } from 'next/navigation'
import Toast from './toast';
const biscuits = new Biscuits

// create new request with below params
// key, collegeId, username, email, branch, phoneNumber, year, semester, type, outingType
  const updateParentsAPICall = async (pass, collegeId, updateData) => 
  
    fetch("/api/user/"+pass+"/U10/"+collegeId+"/"+updateData, {
        
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    // key, 
    // get hostel details
//   const getHostelsAPICall = async (pass) => 
  
//     fetch("/api/user/"+pass+"/U1", {
        
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//         },
//     });
   
// Create new outing request for student
export default function UpdateParents({userDetail, hostelDetail, handleDataChange, toggleUpdateParentsOverlay}) {

    const [user, showUser] = useState(userDetail);
    // const [show, showUpdateDialog] = useState(handleClick);

    // const handleClick = async (event, skip) => {
    const closeClick = async () => {
        handleDataChange(userDetail);
        seterrorMsg('');
        toggleUpdateParentsOverlay(false)
    }


    const [errorMsg, seterrorMsg] = useState('');
    const [resultType, setResultType] = useState('');
    const [resultMessage, setResultMessage] = useState('');

    const [hostels, setHostels] = useState(hostelDetail);
    // setHostelNames(hostelDetail.map((hostel) => hostel.hostelname));
    //     setHostelIds(hostelDetail.map((hostel) => hostel.hostelId));
    //     setRoomNumbers(hostelDetail.map((hostel) => hostel.roomNumbers));

    
    const [hostelNames, setHostelNames] = useState(hostelDetail ? hostelDetail.map((hostel) => hostel.hostelName) : []);
    const [hostelIds, setHostelIds] = useState(hostelDetail ? hostelDetail.map((hostel) => hostel.hostelId) : []);
    const [roomNumbers, setRoomNumbers] = useState(hostelDetail ? hostelDetail.map((hostel) => hostel.roomNumbers) : []);
    
    const [duration, setDuration] = useState(0);
    const [disabledDates, setDisabledDates] = useState([]);
    const [isAllowed, setIsallowed] = useState(true);
   
    // type
    const [type, setType] = useState(userDetail.type);
    
    // father name
    const [fatherName, setFatherName] = useState(userDetail.fatherName);
    const updateFatherName = (event) => {
        setFatherName(event.target.value);
    };
    // father phonenumber
    const [fatherPhoneNumber, setFatherPhoneNumber] = useState(userDetail.fatherPhoneNumber);
    const updateFatherPhoneNumber = (event) => {
        setFatherPhoneNumber(event.target.value);
    };
    // mother name
    const [motherName, setMotherName] = useState(userDetail.motherName);
    const updateMotherName = (event) => {
        setMotherName(event.target.value);
    };
    // father phonenumber
    const [motherPhoneNumber, setMotherPhoneNumber] = useState(userDetail.motherPhoneNumber);
    const updateMotherPhoneNumber = (event) => {
        setMotherPhoneNumber(event.target.value);
    }; 
    // mother name
    const [guardianName, setGuardianName] = useState(userDetail.guardianName);
    const updateGuardianName = (event) => {
        setGuardianName(event.target.value);
    };
    // father phonenumber
    const [guardianPhoneNumber, setGuardianPhoneNumber] = useState(userDetail.guardianPhoneNumber);
    const updateGuardianPhoneNumber = (event) => {
        setGuardianPhoneNumber(event.target.value);
    };
    // mother name
    const [address, setAddress] = useState(userDetail.address);
    const updateAddress = (event) => {
        setAddress(event.target.value);
    };
    // hostel id
    const [hostelId, setHostelId] = useState(userDetail.hostelId);
    const [selectedHostelIdIndex, setSelectedHostelIdIndex] = useState(0);
    const updateHostelId = (event) => {
        setSelectedHostelIdIndex(hostelIds.indexOf(event.target.value));
        setHostelId(event.target.value);
        
        // updateHostelName()
    };
    // hostel name
    const [hostelName, setHostelName] = useState(userDetail.hostelName);
    const updateHostelName = (event) => {
        setHostelName(event.target.value);
    };
    // Room number
    const [roomNumber, setRoomNumber] = useState(userDetail.roomNumber);
    const updateRoomNumber = (event) => {
        setRoomNumber(event.target.value);
    };
    


    useEffect(()=>{ 

        // Extract hostel details into separate lists
        setType(userDetail.type);
        setHostelNames(hostels.map((hostel) => hostel.hostelName));
        setHostelIds(hostels.map((hostel) => hostel.hostelId));
        setRoomNumbers(hostels.map((hostel) => hostel.roomNumbers));

      },[type, userDetail])
   
    // update user
    async function updateParentsNow(){

    // check for the input
    if(document.getElementById('fatherName').value.length > 0 && document.getElementById('fatherPhoneNumber').value.length > 0){

        // this is the key value pair data that includes what all to be updated
        const updateData = {
        };

        // check all the fields to understand what has changed.
        if(user.fatherName != fatherName){
            updateData.fatherName = fatherName
            userDetail.fatherName = fatherName
        }
        if(user.fatherPhoneNumber != fatherPhoneNumber){
            updateData.fatherPhoneNumber = fatherPhoneNumber
            userDetail.fatherPhoneNumber = fatherPhoneNumber
        }
        if(user.motherName != motherName){
            updateData.motherName = motherName
            userDetail.motherName = motherName
        }
        if(user.motherPhoneNumber != motherPhoneNumber){
            updateData.motherPhoneNumber = motherPhoneNumber
            userDetail.motherPhoneNumber = motherPhoneNumber
        }
        if(user.guardianName != guardianName){
            updateData.guardianName = guardianName
            userDetail.guardianName = guardianName
        }
        if(user.guardianPhoneNumber != guardianPhoneNumber){
            updateData.guardianPhoneNumber = guardianPhoneNumber
            userDetail.guardianPhoneNumber = guardianPhoneNumber
        }
        if(user.address != address){
            updateData.address = address
            userDetail.address = address
        }
        if(user.hostelId != hostelId){
            updateData.hostelId = hostelId
            userDetail.hostelId = hostelId
        }
        if(user.hostelName != hostelName){
            updateData.hostelName = hostelName
            userDetail.hostelName = hostelName
        }
        if(user.roomNumber != roomNumber){
            updateData.roomNumber = roomNumber
            userDetail.roomNumber = roomNumber
        }



        // Check if updateData has any key-value pairs (not empty)
        if (Object.keys(updateData).length > 0) {
           
            // call the api using secret key and below columns
            // key, type, today, branch
            const result  = await updateParentsAPICall(process.env.NEXT_PUBLIC_API_PASS, userDetail.collegeId, JSON.stringify(updateData))
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
            
                <h4 className={`${inter.className}`}>Update parent and hostel details</h4>
                <p className={`${inter.className} ${styles.text3}`} style={{paddingTop:'4px'}}>Check all the fields before updating.</p><br/>
                <p className={`${inter.className} ${styles.text1}`}>Regd.No: {userDetail.collegeId}</p><br/>
                {(errorMsg.length > 0) ? 
                    <div className={`${styles.error} ${inter.className} ${styles.text2}`}>{errorMsg}</div>
                    :''}
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
                <p className={`${inter.className} ${styles.text3}`}>Guardian name:</p>
                <input id="guardianName" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Guardian name" value={guardianName} onChange={updateGuardianName}/>
                <br/><br/>
                <p className={`${inter.className} ${styles.text3}`}>Guardian phone number:</p>
                <input id="guardianPhoneNumber" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Guardian phone number" value={guardianPhoneNumber} onChange={updateGuardianPhoneNumber}/>
                <br/><br/>
                
                <p className={`${inter.className} ${styles.text3}`}>Address:</p>
                <input id="address" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Address" value={address} onChange={updateAddress}/>
                <br/><br/>

                {(userDetail.type == 'Hostel' || userDetail.type == 'hostel') ? 
                <div>
                    <p className={`${inter.className} ${styles.text3}`}>Hostel:</p>
                    <select value={hostelId} onChange={updateHostelId} className={`${inter.className} ${styles.text2} ${styles.textInput}`}>
                    {hostelNames.map((hostelName, index) => (
                                <option key={hostelIds[index]} value={hostelIds[index]}>{hostelName}</option>
                            ))}
                    </select>
                    <br/><br/>
                </div> : ''}

                {((userDetail.type == 'Hostel' || userDetail.type == 'hostel') && roomNumbers!= null) ? 
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
                
                <p className={`${inter.className} ${styles.text3}`}>Check all the fields before updating</p>


                
                {(errorMsg.length > 0) ? 
                    <div className={`${styles.error} ${inter.className} ${styles.text2}`}>{errorMsg}</div>
                    :''}
{/* <Toast type='warning' message='resultMessage' /> */}
                 {(resultMessage.length > 0) ? <Toast type={resultType} message={resultMessage} /> : ''}

                 <br/>
                 <br/>
                 <br/>

                
            </div>
                <br/>
                <div style={{display:'flex',gap:'8px',position:'fixed',bottom:'0',padding: '8px 0px',width: '100%',backgroundColor: '#ffffff'}}>
                    <button id="submit" onClick={updateParentsNow} className={`${inter.className} ${styles.text2} ${styles.primarybtn}`}>Update now</button>
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