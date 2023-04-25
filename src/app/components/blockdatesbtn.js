'use client'

import { Inter } from 'next/font/google';
import { useState } from 'react';
import { Plus } from 'phosphor-react'
import styles from '../page.module.css'
import BlockDates from './blockdates';
const inter = Inter({ subsets: ['latin'] })


// pass state variable and the method to update state variable
export default function BlockDatesBtn( {titleDialog}) {

  const [show, showTitleDialog] = useState(titleDialog);

  // const handleClick = async (event, skip) => {
  const handleClick = async () => {
 
    // // change the button text to show loading
    // setDataLoading(true)
    showTitleDialog(!show)
  }

  
  return (
    
        
        <div className={styles.horizontalsection}>
            
            <div className={`${styles.likediv} `} style={{width:'fit-content', cursor:'pointer'}} onClick={handleClick}> 
                <Plus className={styles.icon} />&nbsp;
                <p className={`${inter.className} ${styles.text3}`}> Suggest a title</p>
            </div>
            <div className={`${show ? styles.hideshowdivshow : styles.hideshowdiv}`}>
                <BlockDates /> 
            </div>
        {/* {(show) ? <BlockDates /> : null} */}
        </div>

        
    
  );
}