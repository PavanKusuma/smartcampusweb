'use client'
import { Inter } from 'next/font/google'
import styles from '../../../app/page.module.css'
import { Monitor, UserFocus, ArrowSquareOut, PresentationChart, IdentificationBadge, CalendarCheck, UserPlus } from 'phosphor-react'
import Image from 'next/image'
import Biscuits from 'universal-cookie'
const biscuits = new Biscuits
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import Registration from './registration/form/page'
import SearchStudents from './student360/search/page'

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//     title: 'Dashboard',
//     description: 'Overview of your campus',
//   }
  
  export default function CampusLayout({ children }) {

    // // variable to store the active tab
    const [selectedTab, setSelectedTab] = useState('Dashboard');
    // function handleTabChange(tabName){
    //     setSelectedTab(tabName);
    //     console.log(tabName);
    //   }
    
    // create a router for auto navigation
    const router = useRouter();
    // setTab();
    // clear cookies or logout and navigate to verification
    function clearCookies(){

      //  document.cookie = "";
      biscuits.remove('sc_user_detail')
      router.push('/')
      
  }

  // this will ask you to stop before reloading
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     event.returnValue = 'ok ok';
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   }
  // }, []);

    
    // Navigation
    function navigateDashboard(){
      // biscuits.set('selectedTab', 'Dashboard', {path: '/', expires: new Date(Date.now() + 10800000)})
      setSelectedTab('Dashboard')
      router.push('/dashboard')
    }
    function navigateStudents(){
      // biscuits.set('selectedTab', 'Student 360', {path: '/', expires: new Date(Date.now() + 10800000)})
      setSelectedTab('Student 360')
      router.push('/student360/search')
    }
    function navigateRegistration(){
      // biscuits.set('selectedTab', 'Registration', {path: '/', expires: new Date(Date.now() + 10800000)})
      setSelectedTab('Registration')
      router.push('/registration/form')
    }

    return (


        <div className={styles.main}>
          
        <div className={inter.className}>
          <div className={styles.topbar} style={{height:'6vh'}}>
            <div className={styles.horizontalsection}>
              <Image src="/sc_logo1.svg" alt="Smart Campus" width={160} height={40} priority />
              <span style={{color: '#CCCCCC'}}>|</span>
              <Image src="/svecw_sc_logo.svg" alt="Smart Campus" width={90} height={40} priority />
              {/* <h3>Smart Campus</h3> */}
            </div>
            <div>
              <p onClick={clearCookies.bind(this)} className={`${inter.className} ${styles.text2}`} style={{cursor:'pointer'}} >Logout</p>
              {/* <ProfileBtn show={false} /> */}
            </div>
          </div>
         
          <div style={{border: '0.5px solid #E5E7EB', width:'100vw'}}></div>
              
              
          
        </div>

      <div className={styles.mainlayoutsection} style={{height:'94vh',gap:'0px'}}>
          <div style={{padding:'24px 12px 24px 20px',height: '100%',borderRight: '1px solid #efefef',width:'15%', display:'flex',flexDirection:'column',gap:'16px'}}>
            
            <div className={`${styles.horizontalsection} ${inter.className} ${selectedTab == 'Dashboard' ? styles.leftMenuItem_selected : styles.leftMenuItem} `} onClick={navigateDashboard.bind(this)} style={{cursor:'pointer'}}><Monitor className={styles.menuicon}/> Dashboard</div>
            <div className={`${styles.horizontalsection} ${inter.className} ${selectedTab == 'Student 360' ? styles.leftMenuItem_selected : styles.leftMenuItem} `} onClick={navigateStudents.bind(this)} style={{cursor:'pointer'}}><UserFocus className={styles.menuicon}/> Student 360</div>
            {/* <div className={`${styles.horizontalsection} ${inter.className} ${styles.text2}`} style={{cursor:'pointer'}}><ArrowSquareOut className={styles.menuicon} style={{backgroundColor: '#26379b'}}/> Outing</div>
            <div className={`${styles.horizontalsection} ${inter.className} ${styles.text2}`} style={{cursor:'pointer'}}><PresentationChart className={styles.menuicon} style={{backgroundColor: '#26379b'}}/> Reports</div> */}
            <div className={`${styles.horizontalsection} ${inter.className} ${selectedTab == 'Registration' ? styles.leftMenuItem_selected : styles.leftMenuItem} `} onClick={navigateRegistration.bind(this)} style={{cursor:'pointer'}}><UserPlus className={styles.menuicon}/> Registration</div>
            {/* <div className={`${styles.horizontalsection} ${inter.className} ${selectedTab == 'Registration' ? styles.text1 : styles.text2}`} onClick={navigateRegistration.bind(this)} style={{cursor:'pointer'}}><IdentificationBadge className={styles.menuicon} style={{backgroundColor: '#26379b'}}/> Visitor pass</div> */}
            {/* <div className={`${styles.horizontalsection} ${inter.className} ${styles.text2}`} ><CalendarCheck className={styles.menuicon} /> Control campus outing</div> */}
          </div>

        <div className={styles.maindivcenter} style={{height:'90vh', contentVisibility:'auto',padding: '0px 24px'}}>
            
{/* 
          <div style={{height:'8vh',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
              <h2 className={inter.className}>{selectedTab}</h2>
          </div> */}

          {children}

          
        </div>
          
        </div>





          {/* <div className={`${styles.bottombar} ${inter.className} ${styles.text3}`} style={{display: 'flex', flexDirection:'column', height:'4vh'}}> 
          Made with 💙 to empower campuses
          <br/>
            
          </div> */}
      </div>
    )
  }
  