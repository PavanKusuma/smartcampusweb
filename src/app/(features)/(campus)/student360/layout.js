'use client'
import { Inter } from 'next/font/google'
import styles from '../../../../app/page.module.css'
import { PencilSimple } from 'phosphor-react'
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
  
  export default function CampusLayout({ children }) {

    // // variable to store the active tab
    const [selectedTab, setSelectedTab] = useState('Search');
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
    function navigateSearch(){
      setSelectedTab('Search')
      router.push('/student360/search')
    }
    // function navigateAddStudent(){
    //   setSelectedTab('AddStudent')
    //   router.push('/student360/addstudent')
    // }
    // function navigateRegistration(){
    //   setSelectedTab('Registration')
    //   router.push('/student360/registration')
    // }

    return (
      
<div>

<div style={{height:'8vh',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
              <h2 className={inter.className}>Student 360</h2>
          </div>
        {/* <div className={styles.maindivcenter} style={{height:'90vh', contentVisibility:'auto',padding: '0px 24px'}}>
            

        <div style={{height:'12vh',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
            <h2 className={inter.className}>Student 360</h2>

            {/* <div className={`${styles.menuItems} ${inter.className}`}>
                <div className={`${styles.menuItem} ${selectedTab === 'Search' ? styles.menuItem_selected : ''}`} onClick={navigateSearch.bind(this)}>Search student</div>
                <div className={`${styles.menuItem} ${selectedTab === 'Registration' ? styles.menuItem_selected : ''}`} onClick={navigateRegistration.bind(this)}>New registrations</div>
            </div> 
            
        </div>

        */}
          {children} 

          {/* {selectedTab=='Student360' ? <SearchStudents /> : ''}
          {selectedTab=='Registration' ? <Registration /> : ''} */}
        </div>
    )
  }
  