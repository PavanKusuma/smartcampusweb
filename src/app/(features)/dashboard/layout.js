'use client'
import { Inter } from 'next/font/google'
import styles from '../../../app/page.module.css'
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
  
  export default function DashboardLayout({ children }) {

    // // variable to store the active tab
    // const [selectedTab, setSelectedTab] = useState('Outing');
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

    return (


        <div className={styles.main}>
          
        <div className={inter.className}>
          <div className={styles.topbar}>
            <div className={styles.horizontalsection}>
              <Image src="/sc_logo1.svg" alt="Smart Campus" width={160} height={40} priority />
              {/* <h3>Smart Campus</h3> */}
            </div>
            <div>
              <h3 onClick={clearCookies.bind(this)} >PK</h3>
              {/* <ProfileBtn show={false} /> */}
            </div>
          </div>
         
              <div style={{border: '0px solid #E5E7EB', width:'100vw'}}></div>
              
              
          
        </div>

        {children}


          <div className={`${styles.bottombar} ${inter.className} ${styles.text3}`} style={{display: 'flex', flexDirection:'column'}}> 
          Made with 💙 to empower campuses
          <br/>
            
          </div>
      </div>
    )
  }
  