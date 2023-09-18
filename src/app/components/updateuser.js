'use client'

import { Inter } from 'next/font/google'
// import { SpinnerGap } from 'phosphor-react'
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
import { useEffect, useState } from 'react'
const inter = Inter({ subsets: ['latin'] })
import styles from '../page.module.css'
import Toast from './toast';

// create new request with below params
// key, collegeId, username, email, branch, phoneNumber, year, semester, type, outingType
  const updateUser = async (pass, collegeId, updateData) => 
  
    fetch("/api/user/"+pass+"/U9/"+collegeId+"/"+updateData, {
        
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
   
// Create new outing request for student
export default function UpdateUser({userDetail, handleDataChange, toggleUpdateProfileOverlay}) {

    const [user, showUser] = useState(userDetail);
    // const [show, showUpdateDialog] = useState(handleClick);

    // const handleClick = async (event, skip) => {
    const closeClick = async () => {
        handleDataChange(userDetail);
        seterrorMsg('');
        toggleUpdateProfileOverlay(false)
    }

    
    //create new date object
    const today = new dayjs();

    const [errorMsg, seterrorMsg] = useState('');
    const [resultType, setResultType] = useState('');
    const [resultMessage, setResultMessage] = useState('');

    const [startDate, setStartDate] = useState(today.toDate());
    const [maxDate, setMaxDate] = useState(today.add(5,'month').toDate());
    const [toDate, setToDate] = useState(today.toDate());
    const [duration, setDuration] = useState(0);
    const [disabledDates, setDisabledDates] = useState([]);
    const [isAllowed, setIsallowed] = useState(true);
   
    // username
    const [username, setUsername] = useState(userDetail.username);
    const updateUsername = (event) => {
        setUsername(event.target.value);
    };
    // email
    const [email, setEmail] = useState(userDetail.email);
    const updateEmail = (event) => {
        setEmail(event.target.value);
    };
    // phoneNumber
    const [phoneNumber, setPhoneNumber] = useState(userDetail.phoneNumber);
    const updatePhoneNumber = (event) => {
        setPhoneNumber(event.target.value);
    };
    // branch
    const [branch, setBranch] = useState(userDetail.branch);
    const updateBranch = (event) => {
        setBranch(event.target.value);
    };
    // year
    const [year, setYear] = useState(userDetail.year);
    const updateYear = (event) => {
        setYear(event.target.value);
    };
    // semester
    const [semester, setSemester] = useState(userDetail.semester);
    const updateSemester = (event) => {
        setSemester(event.target.value);
    };
    // type
    const [type, setType] = useState(userDetail.type);
    const updateType = (event) => {
        setType(event.target.value);
    };
    // outingType
    const [outingType, setOutingType] = useState(userDetail.outingType);
    const updateOutingType = (event) => {
        setOutingType(event.target.value);
    };



    useEffect(()=>{ 
        // getBlockedDates(dayjs(today.toDate()).format('YYYY-MM-DD'));
        // updateUserNow();
        // setUsername(userDetail.username);
        // setEmail(userDetail.email);
        // setPhoneNumber(userDetail.phoneNumber);
        // setBranch(userDetail.branch);
        // setYear(userDetail.year);
        // setSemester(userDetail.semester);
        // setType(userDetail.type);
        // setOutingType(userDetail.outingType);
        

      },[userDetail, type])

    // update user
    async function updateUserNow(){

    // check for the input
    if(document.getElementById('username').value.length > 0 && document.getElementById('email').value.length > 0 && document.getElementById('phoneNumber').value.length > 0){

        // this is the key value pair data that includes what all to be updated
        const updateData = {
        };

        // check all the fields to understand what has changed.
        // create a key value pair object
        // update the local object
        if(user.username != username){
            updateData.username = username
            userDetail.username = username
        }
        if(user.email != email){
            updateData.email = email
            userDetail.email = email
        }
        if(user.phoneNumber != phoneNumber){
            updateData.phoneNumber = phoneNumber
            userDetail.phoneNumber = phoneNumber
        }
        if(user.branch != branch){
            updateData.branch = branch
            userDetail.branch = branch
        }
        if(user.year != year){
            updateData.year = year
            userDetail.year = year
        }
        if(user.semester != semester){
            updateData.semester = semester
            userDetail.semester = semester
        }
        if(user.type != type){
            updateData.type = type
            userDetail.type = type
        }
        if(user.outingType != outingType){
            updateData.outingType = outingType
            userDetail.outingType = outingType
        }

        // Check if updateData has any key-value pairs (not empty)
        if (Object.keys(updateData).length > 0) {
           
            // call the api using secret key and below columns
            // key, type, today, branch
            const result  = await updateUser(process.env.NEXT_PUBLIC_API_PASS, userDetail.collegeId, JSON.stringify(updateData))
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
            
                <h4 className={`${inter.className}`}>Update profile</h4>
                <p className={`${inter.className} ${styles.text3}`}  style={{paddingTop:'4px'}}>Update one or more fields at a time.</p><br/>
                <p className={`${inter.className} ${styles.text1}`}>Regd.No: {userDetail.collegeId}</p><br/>
                {(errorMsg.length > 0) ? 
                    <div className={`${styles.error} ${inter.className} ${styles.text2}`}>{errorMsg}</div>
                    :''}
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
                {(type == 'Hostel' || type == 'hostel') ? <div>
                    <br/>
                    <p className={`${inter.className} ${styles.text3}`}>Outing type:</p>
                    <select value={outingType} onChange={updateOutingType} className={`${inter.className} ${styles.text2} ${styles.textInput}`}>
                        <option value="no">Not-self</option>
                        <option value="yes">Self</option>
                    </select>
                    <br/><br/>
                </div>
                : ''}
                
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
                    <button id="submit" onClick={updateUserNow} className={`${inter.className} ${styles.text2} ${styles.primarybtn}`}>Update now</button>
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