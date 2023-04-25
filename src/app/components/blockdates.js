'use client'

import { Inter } from 'next/font/google'
// import { SpinnerGap } from 'phosphor-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
const inter = Inter({ subsets: ['latin'] })
import Biscuits from 'universal-cookie'
import styles from '../page.module.css'
import { useRouter } from 'next/navigation'
const biscuits = new Biscuits

// create new request with below params
// key, blockId, duration, from, to, blockBy, description, branch
  const blockOuting = async (pass, blockId, duration, blockFrom, blockTo, blockBy, description, branch) => 
    fetch("/api/blockouting/"+pass+"/0/"+blockId+"/"+duration+"/"+blockFrom+"/"+blockTo+"/"+blockBy+"/"+description+"/"+branch, {
        
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    // get blocked dates
    const getBlockedOuting = async (pass, today, branch) => 
    fetch("/api/blockouting/"+pass+"/1/"+today+"/"+branch, {
        
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
   
// Create new outing request for student
export default function BlockDates() {
    
    // create a router for auto navigation
    const router = useRouter();

    //create new date object
    const today = new dayjs();

    // block the dates
    const disabledDates = [
        new Date('2022-12-25'), // Christmas Day
        new Date('2023-01-01'), // New Year's Day
        new Date('2023-08-15'), // Independence Day
      ];

    const [errorMsg, seterrorMsg] = useState('');
    const [single, setSingle] = useState(true);

    const [startDate, setStartDate] = useState(today.toDate());
    const [maxDate, setMaxDate] = useState(today.add(5,'month').toDate());
    const [toDate, setToDate] = useState(today.toDate());
    const [duration, setDuration] = useState(1);

    useEffect(()=>{ 
        console.log(dayjs(today.toDate()).format('YYYY-MM-DD'));
        getBlockedDates(dayjs(today.toDate()).format('YYYY-MM-DD'))
      },[])
        
    // change the type of the blocking
    // single
    function typeChangeSingle(){
        setSingle(true)
        setDuration(1) // duration is 1 for single
    }
    // multiple/duration
    function typeChangeDuration(){
        setSingle(false)
        setDuration(dayjs(toDate).diff(dayjs(startDate), 'day')+1)
    }

    // select the start date
    function fromDateChange(date){
        console.log("Check");
        console.log("Check"+date);
        console.log("Check"+maxDate);

        // set the start and toDate to reflect
        setStartDate(date)
        setToDate(date)
        setMaxDate(dayjs(date).add(5,'month').toDate())
        // console.log(dayjs(date).add(5,'month').date);
    }
    // select the end date and set duration
    function toDateChange(date){
        setToDate(date)
        setDuration(dayjs(date).diff(dayjs(startDate), 'day')+1)
    }

    // get blocked dates
    async function getBlockedDates(date){
        // seterrorMsg('') // hide error
        // // call the api using secret key and below columns
        // // key, blockId, duration, from, to, blockBy, description, branch
        // const bId = "B"+randString() // generate request Id
        // const result  = await blockOuting(process.env.NEXT_PUBLIC_API_PASS, bId, duration, from, to, 'yeswe02', document.getElementById('description').value, 'IT')
        // const queryResult = await result.json() // get data
        
        // // check if query result status is 200
        // if(queryResult.status == 200) {
        //     // set the state variables with the user data
        //     console.log('Created');
        //     console.log('Created'+queryResult.message);

        // } else if(queryResult.state == 404) {
        //     seterrorMsg(queryResult.message)
        //     console.log('Created'+queryResult.message);
        // }
    }

    // block dates
    async function blockNow(){

        // check if the reason for blocking is provided
        if(document.getElementById('description').value.length > 0){
            // For every block, check the type 
            // single date block – make from and to same dates and duration is 1
            if(single){
                sendBlockRequest(dayjs(startDate).format("YYYY-MM-DD HH:mm:ss"), dayjs(startDate).format("YYYY-MM-DD HH:mm:ss"))
            }
            // duration block – make from and to different dates and duration is the difference
            else {
                sendBlockRequest(dayjs(startDate).format("YYYY-MM-DD HH:mm:ss"), dayjs(toDate).format("YYYY-MM-DD HH:mm:ss"))
            }
        } else {
            // show error incase of no input
            seterrorMsg('Enter the reason to block')
        }
    }
    
    // block dates request
    async function sendBlockRequest(from, to){
        seterrorMsg('') // hide error
        // call the api using secret key and below columns
        // key, blockId, duration, from, to, blockBy, description, branch
        const bId = "B"+randString() // generate request Id
        const result  = await blockOuting(process.env.NEXT_PUBLIC_API_PASS, bId, duration, from, to, 'yeswe02', document.getElementById('description').value, 'IT')
        const queryResult = await result.json() // get data
        
        // check if query result status is 200
        if(queryResult.status == 200) {
            // set the state variables with the user data
            console.log('Created');
            console.log('Created'+queryResult.message);

        } else if(queryResult.state == 404) {
            seterrorMsg(queryResult.message)
            console.log('Created'+queryResult.message);
        }
    }

  return (
    // new outing request form
    <div className={`${styles.titleDialog}`} >
        
        <div>
            <div>
        {/* <div className={styles.titlecard}>
            <div className={styles.section_one}> */}
            
            {/* prompt the user for college Id
            and verify if it exists in the sytem */}
            <div>
            
                <h3 className={`${inter.className}`}>Block outing dates  </h3><br/>
                <p className={`${inter.className} ${styles.text2}`}>Reason for blocking </p><br/>
                <textarea id="description" className={`${inter.className} ${styles.textInput} ${styles.text2}`} placeholder="Type here for students to know the reason" style={{minWidth:'300px'}}/>
                <br/><br/>
                <div style={{display:'flex', gap: '8px'}}>
                    <label className={`${inter.className} ${styles.text2}`}>
                    <input className={`${inter.className} ${styles.text2}`} type="radio" name="option" value="option1" onChange={typeChangeSingle} checked={single}/> Single date
                    </label>

                    <label className={`${inter.className} ${styles.text2}`}>
                    <input className={`${inter.className} ${styles.text2}`} type="radio" name="option" value="option2" onChange={typeChangeDuration} checked={!single}/> Duration
                    </label>
                </div>
                <br/>

                <div>
                    {(single) ? 
                    <div>
                        <p className={`${inter.className} ${styles.text2}`}>Select date :</p>
                            <DatePicker
                            selected={startDate}
                            dateFormat="dd-MMM-yyyy"
                            selectsStart
                            minDate={startDate}
                            maxDate={dayjs(startDate).add(1,'year').toDate()}
                            onChange={fromDateChange} 
                            className={`${inter.className} ${styles.textInput} ${styles.text2}`}/>
                            {/* className={`${styles.textInput} ${inter.className} ${styles.text2}`}/> */}
                    </div>  
                    :
                    <div>
                        <p className={`${inter.className} ${styles.text2}`}>From :</p>
                            <DatePicker
                            selected={startDate}
                            dateFormat="dd-MMM-yyyy"
                            selectsStart
                            minDate={startDate}
                            // startDate={startDate}
                            // endDate={toDate}
                            excludeDates={disabledDates}
                            onChange={fromDateChange} 
                            className={`${inter.className} ${styles.textInput} ${styles.text2}`}/>
                            {/* className={`${styles.textInput} ${inter.className} ${styles.text2}`}/> */}
                    <br/>  
                        <p className={`${inter.className} ${styles.text2}`}>To :</p>
                            <DatePicker
                            selected={toDate}
                            dateFormat="dd-MMM-yyyy"
                            selectsEnd
                            minDate={startDate}
                            maxDate={maxDate}
                            // maxDate={dayjs().add(5, 'month')}
                            // startDate={startDate}
                            // endDate={toDate}
                            onChange={toDateChange} 
                            className={`${inter.className} ${styles.text2} ${styles.textInput}`}/>
                             {/* className={`${styles.textInput} ${inter.className} ${styles.text2}`} */}
                    </div>
                }
                </div>
                <br/>

                <p className={`${inter.className} ${styles.text2}`}>{duration} day(s)</p>
                <br/>
                <div style={{display:'flex',gap:'8px'}}>
                <button id="submit" onClick={blockNow} className={`${inter.className} ${styles.text2} ${styles.primarybtn}`}>Block date(s)</button>
                <button id="cancel" className={`${inter.className} ${styles.text2} ${styles.secondarybtn}`}>Cancel</button>
                </div>
                <br/>
                    {(errorMsg.length > 0) ? 
                        
                        <div className={`${styles.error} ${inter.className} ${styles.text2}`}>{errorMsg}</div>
                        :''}
                    
                    
            </div>

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