'use client'

import Dashboard from '../(features)/dashboard/page'
import { Inter } from 'next/font/google'
import { SpinnerGap } from 'phosphor-react'
import { useEffect, useState } from 'react'
const inter = Inter({ subsets: ['latin'] })
import Biscuits from 'universal-cookie'
import styles from '../page.module.css'
import { useRouter } from 'next/navigation'
const biscuits = new Biscuits

// declare the apis of this page
  const verifyUser = async (pass, id) => 
    fetch("/api/verify/"+pass+"/"+id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
   
// verification using college Id
// In future, based on the type of the user verification can be succeded
// If the user is found in the database, OTP will be sent for the user mobile number based on the user type
// incase parent is logging in on behalf of student, the OTP is sent to parent's number
// After verification, data is saved in local storage
export default function Vertification() {
    
    // create a router for auto navigation
    const router = useRouter();
        
    // session variable to track login
    const [session, setSession] = useState(false);

    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [userFound, setuserFound] = useState(false);
    const [errorMsg, seterrorMsg] = useState('');

    const [otpSent, setotpSent] = useState(false);
    const [verifyOtpMsg, setverifyOtpMsg] = useState('');
    const [otp, setOTP] = useState()

    const [infoMsg, setinfoMsg] = useState(false);
    const [user, setUser] = useState();

    useEffect(()=>{
        // Retrieve the cookie
        let cookieValue = biscuits.get('sc_user_detail')
        // let cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)sc_user_detail\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if(cookieValue){
        const obj = JSON.parse(decodeURIComponent(cookieValue))
        console.log("This is from cookie"+obj.username)
        setSession(true)
        router.push('/dashboard')
        }
        else{
        setSession(false)
        console.log('Not found')
        }
    },[]);
 

// verify the collegeId by calling the API
async function loginHere(){

    // check for the input
    if(document.getElementById('collegeId').value.length > 0){
        
        // call the api using secret key and collegeId provided
        const result  = await verifyUser(process.env.NEXT_PUBLIC_API_PASS, document.getElementById('collegeId').value)
        const queryResult = await result.json() // get data
        
        // check if query result status is 200
        if(queryResult.status == 200) {
            // set the state variables with the user data
            setuserFound(true)
            setUser(queryResult.data)
            setUsername(queryResult.data.username)
            setPhone(queryResult.data.phoneNumber)

            // save the data to local cookie
            let jsonString = JSON.stringify(queryResult.data)
            biscuits.set('sc_user_detail', encodeURIComponent(jsonString), {path: '/', expires: new Date(Date.now() + 300000)})
            // document.cookie = "sc_user_detail="+encodeURIComponent(jsonString)+ "; expires=" + new Date(Date.now() + 300000).toUTCString() + "; path=/";

            // Retrieve the cookie
            // let cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)sc_user_detail\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            let cookieValue = biscuits.get('sc_user_detail')
            const obj = JSON.parse(decodeURIComponent(cookieValue))
            console.log("This is from cookie"+obj.username)


            // call the OTP api
            // const otpResult = sendOTP()



            var val = Math.floor(1000 + Math.random() * 9000);
            console.log("OTP : "+val)
            // generate OTP
            setOTP(val)

            // if OTP is sent, prompt the user to enter OTP
            if(true){
                setotpSent(true)

            }
        }
        else if(queryResult.state == 404) {
            setuserFound(false)
            setinfoMsg(true)
        }
        
    }
    else {
        // show error incase of no input
        seterrorMsg('Enter your college registered number')
    }
  
}

// clear cookies
function clearCookies(){

     // clear cookies
    //  document.cookie = "";
     biscuits.remove('sc_user_detail')

     // clearing the state variable
     setUsername(''),setPhone(''),setuserFound(false),seterrorMsg(''),setotpSent(false),setverifyOtpMsg(''),setOTP(),setinfoMsg(false),setUser()
     
  }


function sendOTP(){
    console.log("Phone : "+phone)
    if(phone.length > 0){
  
      var val = Math.floor(1000 + Math.random() * 9000);
      console.log("OTP : "+val)
      // generate OTP
      setOTP(val)
      

      // call the API

      // verify the result
        return true

      // send OTP request
    //   fetch(withQuery('/api/user/sendotp', 
    //     {
    //         phoneNumber: this.state.phone,
    //         // phoneNumber: this.refs.phonenumber.value,
    //         otp: val,
    //     }),
    //     {
    //         method: 'GET',
    //         headers: {'Content-Type': 'application/json'},
            
    //     })
    //   .then(res => res.json())
    //   .then(data => this.setState({data}, () => {
    //     // console.log(`Customers fetched`, data)
    //     // console.log(`Customers fetched`, this.state.otpNumber)
    //     // save new number
    //     cookies.set('phone', this.state.phone, {path: '/'})
    //     if(data.status == 200) {
    //       this.setState({otpMsg: 'OTP sent!', otpSent: true})
    //     }
    //     else {
    //       // retry sending OTP again
    //     }
    //   })
    // );
  
    }
    else {
      return false
    }
  }
  
  
function verifyOTP(){

    // check for OTP input
    if(document.getElementById('otp').value.length == 4){
        // verify the otp
        if(document.getElementById('otp').value == otp){
           
            setverifyOtpMsg('OTP verified! Redirecting you to dashboard...')
            // navigate to dashboard
            router.push('/dashboard')
        }
        else{
            setverifyOtpMsg('Invalid OTP!')
        }
    }
    else {
        // show error message
        setverifyOtpMsg('Enter OTP to proceed')
    }
    // if(this.refs.otp.value.length == 4){
  
    //   // verify OTP value
    //   // if(this.refs.otp.value == this.state.otpNumber){
    //   if(true){
        
    //     this.setState({verifyOtpMsg: 'Your mobile is verified! Redirecting you to dashboard...', otpVerify: true})
  
    //     // delay the navigation
    //     setTimeout(function() { //Start the timer
  
    //       // navigate to home
    //       this.props.history.push('/home')
  
    //     }.bind(this), 500)
  
        
    //   }
    //   else {
    //     this.setState({verifyOtpMsg: 'Invalid OTP!'})  
    //   }
  
    // }
    // else {
    //   this.setState({verifyOtpMsg: 'Enter OTP sent to your mobile'})
    // }
  }

  
  return (
    // based on the available list, show the Load more CTA 

    
    <div>
        
        {(session) ? 
          <Dashboard />
          :
        <div className={styles.titlecard}>
            <div className={styles.section_one}>
            <div ><img src="/sc_logo1.svg" style={{height:'66px', width:'220px', float:'left'}}/></div>
            
            
            {/* prompt the user for college Id
            and verify if it exists in the sytem */}
            <div>
                {(!userFound) ?
                <div className={styles.card_block1}>
            
                    <p className={`${inter.className} ${styles.text2}`}>Your college registered Id </p><br/>
                    <input id="collegeId"className={`${styles.textInput} ${inter.className} ${styles.text2}`} placeholder=""/>
                    <br/><br/>
                    <button id="submit" onClick={loginHere.bind(this)} className={`${inter.className} ${styles.text2} ${styles.primarybtn}`}>Sign in</button>
                    <br/>
                    <br/>
                        {(errorMsg.length > 0) ? 
                            
                            <div className={`${styles.error} ${inter.className} ${styles.text2}`}>{errorMsg}</div>
                            :''}
                        
                    <br/>
                    
                    {(infoMsg) ?
                    <div className={infoMsg ? '':'styles.hidden'}>
                        <div className={`${inter.className} ${styles.text2}`}>
                            <br/>We couldnot find you in our system for any of below reasons:<br/>
                            <ul style={{listStyle:'none'}}>
                                <li>1. Your college Id might be incorrect.</li>
                                <li>2. Your college is not registered with Smart Campus yet</li>
                            </ul>  
                        </div>
                        <br/>
                        <p className={`${inter.className} ${styles.text3}`}>Please contact your college administration or drop a mail with your campus name to <a href="mailto:hello.helpmecode@gmail.com"  className={styles.information}>hello.helpmecode@gmail.com</a></p>
                        <br/>
                    </div>
                    :
                    ''}
                    
                    <div>
                        <p className={`${inter.className} ${styles.text3}`}>No account? <a href="/signup"  className={styles.secondarybtn}>Join now</a></p>
                    </div>
                    
                </div>
                :
                ''
                }
            </div>

           
           {/* Show the OTP sending status while api is called */}
            <div>
                {(userFound && !otpSent) ?
                <div className={styles.card_block1}>
                    <div className={styles.horizontalsection}>
                        {/* <Loader className={`${styles.icon} ${styles.load}`} /> */}
                        <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                        <p className={`${inter.className} ${styles.text3}`}>Sending OTP to {username}...</p> 
                    </div>
                </div>
                :''}
            </div>


            {/* Prompt the user to enter the OTP */}
            <div>
                {(otpSent) ?
                <div className={styles.card_block1}>
                    <p className={`${inter.className} ${styles.text3}`}>Verify your mobile</p>
                    <p className={`${inter.className} ${styles.text2}`}>Please enter the verification code sent to {phone.slice(0, 4).padEnd(phone.length, '*')}</p>
                    <br/>
                    <input id="otp" className={`${styles.input_one} ${inter.className} ${styles.text3}`} placeholder="OTP" maxLength="4" style={{letterSpacing:30}} />
                    <br/>
                    <br/>
                    <button onClick={clearCookies.bind(this)} className={`${inter.className} ${styles.secondarybtn}`}>back</button> &nbsp;&nbsp;
                    <button onClick={verifyOTP.bind(this)} className={`${inter.className} ${styles.primarybtn}`} >Verify OTP</button>
                    <div>
                        {(verifyOtpMsg.length) > 0 ?
                        <div>
                            <br/><br/>
                            <span className={`${inter.className} ${styles.text2}`}>{verifyOtpMsg}</span>
                        </div>
                        :''}
                    </div>
                </div>
                :''}
            </div>
            
            
            

            </div>
        </div>
     } 
    <br/>
    </div>
    
    
  );
}
