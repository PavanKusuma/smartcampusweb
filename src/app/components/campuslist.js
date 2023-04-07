'use client'

import { Inter } from 'next/font/google'
import Link from 'next/link'
import { SpinnerGap } from 'phosphor-react'
import { useEffect, useState } from 'react'
const inter = Inter({ subsets: ['latin'] })
import styles from '../page.module.css'

  export const getCampus = async (data) => 
    fetch("/api/campuses/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
    
    

// pass state variable and the method to update state variable
export default function Vertification() {

    const [campuses, setcampuses] = useState();

    useEffect(()=> {

        console.log('Starting verification')

        async function getData(){
            const result  = await getCampus(process.env.DB_PASS)
            const dbCampusList = await result.json()
            console.log(dbCampusList.data)
            setcampuses(dbCampusList.data)
        }
        getData();
    
},[])


  
  return (
    // based on the available list, show the Load more CTA 

    <div>
    {(!campuses) ? 
        <div className={styles.horizontalsection}>
            {/* <Loader className={`${styles.icon} ${styles.load}`} /> */}
            <SpinnerGap className={`${styles.icon} ${styles.load}`} />
            <p className={`${inter.className} ${styles.text3}`}>Loading...</p> 
        </div>
        : 
        
        <div className={styles.titlecard}>
            {campuses.map(campus => (

                <div className={styles.carddatasection} key={campus.campusId}>
                    <div className={styles.projectsection}>
                        <Link href={{
                            pathname: '/details/project',
                            query: campus
                            }}>
                            <div className={styles.verticalsection}>
                                <h5 className={`${inter.className} ${styles.text1}`}>{campus.campusId}</h5>
                                {/* <p className={`${inter.className} ${styles.text2}`} dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br>') }}></p> */}
                                {/* <p className={`${inter.className} ${styles.text2}`}>{project.description.replace(/\n/g, '\n')}</p> */}
                                <p className={`${inter.className} ${styles.text2}`} >{campus.campusName}</p>
                                {/* <p className={`${inter.className} ${styles.text2} ${styles.ellipsistext}`} style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{campus.campusName}</p> */}
                            </div>
                        </Link>
                    </div>
                    <div className={styles.horizontalsection}>
                    
                        <Link href={{
                            pathname: '/details/project',
                            query: campus
                        }}>
                        <p className={`${inter.className} ${styles.smallbtn}`}>Details</p>
                        </Link>
                        {/* <div className={`${styles.likediv} ${styles.smallbtn}`} onClick={() => handleClick(project)}>
                            <ThumbsUp className={styles.icon} />
                            <p className={`${inter.className} ${styles.text3}`}>{likes}</p>
                        </div> */}
                    
                    </div>
                </div>
            ))}
        </div>
    }
    <br/>
    </div>
    
    
  );
}