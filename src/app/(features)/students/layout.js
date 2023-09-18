'use client'
import { Inter } from 'next/font/google'
import styles from '../../../app/page.module.css'
import { UserFocus, ArrowSquareOut, PresentationChart, IdentificationBadge, CalendarCheck } from 'phosphor-react'
import Image from 'next/image'
import Biscuits from 'universal-cookie'
const biscuits = new Biscuits
import { useRouter } from 'next/navigation'
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//     title: 'Dashboard',
//     description: 'Overview of your campus',
//   }
  
  export default function StudentsLayout({ children }) {

    // // variable to store the active tab
    const [selectedTab, setSelectedTab] = useState('Student360');
    // function handleTabChange(tabName){
    //     setSelectedTab(tabName);
    //     console.log(tabName);
    //   }

    // create a router for auto navigation
    const router = useRouter();

    // clear cookies or logout and navigate to verification
    function clearCookies(){

      //  document.cookie = "";
      biscuits.remove('sc_user_detail')
      router.push('/')
      
  }
    
    // Navigation
    function navigateStudents(){
      setSelectedTab('Student360')
      router.push('/students/search')
    }
    function navigateRegistration(){
      setSelectedTab('Registration')
      router.push('/registration')
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

        <div className={styles.mainlayoutsection} style={{height:'90vh'}}>
          <div style={{padding:'24px 12px 24px 20px',height: '100%',borderRight: '1px solid #efefef',width:'15%', display:'flex',flexDirection:'column',gap:'16px'}}>
            
            <div className={`${styles.horizontalsection} ${inter.className} ${selectedTab == 'Student360' ? styles.text1 : styles.text2}`} onClick={navigateStudents.bind(this)}><UserFocus className={styles.menuicon} style={{backgroundColor: '#26379b'}}/> Student 360</div>
            <div className={`${styles.horizontalsection} ${inter.className} ${styles.text2}`} ><ArrowSquareOut className={styles.menuicon} style={{backgroundColor: '#26379b'}}/> Outing</div>
            <div className={`${styles.horizontalsection} ${inter.className} ${styles.text2}`} ><PresentationChart className={styles.menuicon} style={{backgroundColor: '#26379b'}}/> Reports</div>
            <div className={`${styles.horizontalsection} ${inter.className} ${selectedTab == 'Registration' ? styles.text1 : styles.text2}`} onClick={navigateRegistration.bind(this)}><IdentificationBadge className={styles.menuicon} style={{backgroundColor: '#26379b'}}/> Visitor pass</div>
            {/* <div className={`${styles.horizontalsection} ${inter.className} ${styles.text2}`} ><CalendarCheck className={styles.menuicon} /> Control campus outing</div> */}
          </div>
          {children}
        </div>





          <div className={`${styles.bottombar} ${inter.className} ${styles.text3}`} style={{display: 'flex', flexDirection:'column', height:'4vh'}}> 
          Made with 💙 to empower campuses
          <br/>
            
          </div>
      </div>
    )
  }
  