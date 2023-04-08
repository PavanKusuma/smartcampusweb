'use client'

import { Inter } from 'next/font/google'
// import { SpinnerGap } from 'phosphor-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
import { useEffect, useState } from 'react'
const inter = Inter({ subsets: ['latin'] })
import Biscuits from 'universal-cookie'
import styles from '../page.module.css'
import { useRouter } from 'next/navigation'
const biscuits = new Biscuits

// create new request with below params
// key, requestId, requestType, collegeId, description, requestFrom, requestTo, duration
  const createNewRequest = async (pass, requestId, requestType, collegeId, description, requestFrom, requestTo, duration, isAllowed) => 
    fetch("/api/newrequest/"+pass+"/"+requestId+"/"+requestType+"/"+collegeId+"/"+description+"/"+requestFrom+"/"+requestTo+"/"+duration+"/"+isAllowed, {
        
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
export default function OutingRequest() {
    
    // create a router for auto navigation
    const router = useRouter();

    //create new date object
    const today = new dayjs();

    // block the dates
    const blockedDates = [];
    // const disabledDates = [
    //     new Date('2022-12-25'), // Christmas Day
    //     new Date('2023-01-01'), // New Year's Day
    //     new Date('2023-08-15'), // Independence Day
    //   ];

    const [errorMsg, seterrorMsg] = useState('');
    const [created, setCreated] = useState(false);

    const [startDate, setStartDate] = useState(today.toDate());
    const [maxDate, setMaxDate] = useState(today.add(5,'month').toDate());
    const [toDate, setToDate] = useState(today.toDate());
    const [duration, setDuration] = useState(0);
    const [disabledDates, setDisabledDates] = useState([]);
    const [isAllowed, setIsallowed] = useState(true);

    useEffect(()=>{ 
        // get blocked dates
        console.log(today.toDate());
        getBlockedDates(dayjs(today.toDate()).format('YYYY-MM-DD'));
        
      },[])

    // select the start date
    function fromDateChange(date){
        // set the start and toDate to reflect
        setStartDate(date)
        setToDate(date)
        setMaxDate(dayjs(date).add(5,'month').toDate())
    }
    // select the end date and set duration
    // on set of the end date, check if the duration selected by students includes any blocked date.
    // if so, throw an error and they cannot submit the request
    function toDateChange(date){
        setToDate(date)
        setDuration(dayjs(date).diff(dayjs(startDate), 'day')+1)

        // check block dates in selected start and to date
        const allow = disabledDates.every(blockedDate => {
            
            // condition to check if blockedDate exists between the selceted duration
            if(dayjs(blockedDate).isBetween(dayjs(startDate), dayjs(date))){
                return false; // this means not allowed and breaks the loop
            }
            else {
                return true;
            }
        })

        // set the state variable to show messaging for blocked dates
        if(allow){
            // this means there is no blocked date in the student selected duration
            setIsallowed(true)
        } else { // There is a blocked date in the student selected duration
            setIsallowed(false)
        }
    }

    // get blocked dates
    async function getBlockedDates(today){
        
        // call the api using secret key and below columns
        // key, type, today, branch
        const result  = await getBlockedOuting(process.env.NEXT_PUBLIC_API_PASS, today, 'IT')
        const queryResult = await result.json() // get data
        
        // check if query result status is 200
        if(queryResult.status == 200) {
            // set the state variables with the user data
            // console.log('Created'+queryResult.data);

            const parsedArray = queryResult.data
            parsedArray.forEach(element => {
                // check if the duration is more than 1 and accordingly form blocked dates array
                // block the dates
                if(element.duration == 1) {
                    blockedDates.push(new Date(dayjs(element.blockFrom).format('YYYY-MM-DD')));
                } else {
                    let currentDate = dayjs(element.blockFrom) // get the first date of the duration
                    // iterate to get all the dates between the duration and add to the disabled dates list
                    while (currentDate.diff(dayjs(element.blockTo),'day') <= 0) {
                        blockedDates.push(new Date(currentDate.format('YYYY-MM-DD')));
                        currentDate = currentDate.add(1,'day');
                    }
                }
            });
            // set the disabled dates once blocked dates list is ready
            setDisabledDates(blockedDates)
        } else if(queryResult.state == 404) {
            seterrorMsg(queryResult.message)
            console.log('Created'+queryResult.message);
        }
    }


    // create the outing request
    async function requestOuting(){

    // check for the input
    if(document.getElementById('description').value.length > 0){
        
        // call the api using secret key and below columns
        // key, requestId, requestType, collegeId, description, requestFrom, requestTo, duration
        const rId = "R"+randString() // generate request Id
        const result  = await createNewRequest(process.env.NEXT_PUBLIC_API_PASS, rId, 'Outing', 'yeswe02', document.getElementById('description').value, dayjs(startDate).format("YYYY-MM-DD HH:mm:ss"), dayjs(toDate).format("YYYY-MM-DD HH:mm:ss"), duration, ((isAllowed) ? 0 : 1),  dayjs(today.toDate()).format("YYYY-MM-DD HH:mm:ss"))
        const queryResult = await result.json() // get data
        
        // check if query result status is 200
        if(queryResult.status == 200) {
            // set the state variables with the user data
            setCreated(true)
            seterrorMsg('')

        } else if(queryResult.status == 404) {
            setCreated(false)
            seterrorMsg('Issue submitting request. Please try again later')
        }
    } else {
        // show error incase of no input
        seterrorMsg('Enter the reason for outing')
    }
  
}
// const renderDayContents = (date, isHighlighted) => {
//     console.log(date);
//     // if (!(date instanceof Date)) {
//     //     return null;
//     //   }
//     const classNames = ['custom-day'];
//     if (isHighlighted) {
//       classNames.push('highlighted-day');
//     }
//     return <div className={classNames.join(' ')}>{date}</div>;
//   };
const highlightWithRanges1 = [
    {
      "highlighted-day": disabledDates,
    }
  ];

// const highlightClassName = (date) => {
//     return disabledDates.some((highlightDate) =>
//       date.toDateString() === highlightDate.toDateString()
//     )
//       ? 'highlighted-day'
//       : null;
//   };

const highlightWithRanges = [
    {
      "react-datepicker__day--highlighted-custom-1": disabledDates,
    },
  ];

  return (
    // new outing request form
    <div>
        
        <div className={styles.titlecard}>
            <div className={styles.section_one}>
            
            {/* prompt the user for college Id
            and verify if it exists in the sytem */}
            <div className={styles.card_block1}>
            
                <p className={`${inter.className} ${styles.text2}`}>Reason for outing </p><br/>
                <textarea id="description" className={`${inter.className} ${styles.textInput} ${styles.text2}`} placeholder="Type Your Reason for Outing"/>
                <br/><br/>
                <div>
                    {(disabledDates.length > 0) ?
                    <div>
                        <p className={`${inter.className} ${styles.text2}`}>From :</p>
                            <DatePicker
                            selected={startDate}
                            dateFormat="dd-MMM-yyyy"
                            selectsStart
                            minDate={today.toDate()}
                            // startDate={startDate}
                            // endDate={toDate}
                            // excludeDates={disabledDates}
                            highlightDates={highlightWithRanges}
                            // renderDayContents={renderDayContents}
                            onChange={fromDateChange} 
                            className={`${inter.className} ${styles.textInput} ${styles.text2}`}/>
                            {/* className={`${styles.textInput} ${inter.className} ${styles.text2}`}/> */}
                    </div>  : ''}
                    <br/>
                    <div>
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
                            highlightDates={highlightWithRanges}
                            onChange={toDateChange} 
                            className={`${inter.className} ${styles.text2} ${styles.textInput}`}/>
                             {/* className={`${styles.textInput} ${inter.className} ${styles.text2}`} */}
                    </div>
                </div>
                <br/>

                <p className={`${inter.className} ${styles.text2}`}>{duration} day(s)</p>
                <br/>
                <div style={{display:'flex',gap:'8px'}}>
                    <button id="submit" onClick={requestOuting} className={`${inter.className} ${styles.text2} ${styles.primarybtn}`}>Request outing</button>
                    <button id="cancel" onClick={requestOuting} className={`${inter.className} ${styles.text2} ${styles.secondarybtn}`}>Cancel</button>
                </div>
                <br/>
                    {(errorMsg.length > 0) ? 
                        
                        <div className={`${styles.error} ${inter.className} ${styles.text2}`}>{errorMsg}</div>
                        :''}
                    
                <br/>
                    {(!isAllowed) ? 
                        
                        <div className={`${styles.error} ${inter.className} ${styles.text2}`}>
                            Your duration contains the dates blocked by your management for taking outing.
                            <br/>You can anyway submit the request.
                            {/* <br/>Dates:
                            <br/>
                            <div>
                                {disabledDates.map((item, index) => (
                                    <p key={index}>{dayjs(item).format('YYYY-MMM-DD')}</p>
                                ))}
                            </div> */}
                        </div>
                        :''}
                    
                {(errorMsg.length > 0) ?
                    <p className={`${inter.className} ${styles.text2}`}>{errorMsg}</p>  
                    :
                    ''}
            </div>

            </div>
        </div>
    <br/>
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