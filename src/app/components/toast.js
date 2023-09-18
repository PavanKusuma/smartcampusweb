// import React from "react";
// import PropTypes from "prop-types";
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import styles from '../page.module.css'
import { Check, Info, Triangle, X } from 'phosphor-react'

// export const displayIcon = (type) => {
//   switch (type) {
//     case "success":
//       return <Check />;
//     case "info":
//       return <Info />;
//     case "error":
//       return <X />;
//     case "warning":
//       return <Triangle />;
//     default:
//       return <Triangle />;
//   }
// };

// const ToastMessage = ({ type, message }) =>
export default function Toast({ type, message }) {

//   toast[type](
//     <div style={{ display: "flex" }}>
//       <div style={{ flexGrow: 1, fontSize: 15, padding: "8px 12px" }}>
//         {message}
//       </div>
//     </div>
//   );

  // const handleClick = async (event, skip) => {
//   const closeClick = async () => {
//       seterrorMsg('');
//       toggleUpdateProfileOverlay(false)
//   }

//   const [type, setType] = useState(type);
//   const [message, setMessage] = useState(message);
//   const [created, setCreated] = useState(false);




//   useEffect(()=>{ 
//       // get blocked dates
//       console.log(today.toDate());
//       // getBlockedDates(dayjs(today.toDate()).format('YYYY-MM-DD'));
//       // updateUserNow();
//       setUsername(userDetail.username);
//       setEmail(userDetail.email);
//       setPhoneNumber(userDetail.phoneNumber);
//       setBranch(userDetail.branch);
//       setYear(userDetail.year);
//       setSemester(userDetail.semester);
//       setType(userDetail.type);
//       setOutingType(userDetail.outingType);
      

//     },[userDetail])




return (
  // new outing request form
  <div>
      
      {/* <div className={styles.titlecard}>
          <div className={styles.section_one}> */}
          
          {/* prompt the user for college Id
          and verify if it exists in the sytem */}
          <div>
            <div style={{ flexGrow: 1, fontSize: 15, padding: "8px", borderRadius:'50px' }}  className={`${styles.card_block1} ${styles.toastMessage} ${inter.className} ${styles.text2} ${styles.horizontalsection}`}>
            {(type == 'success') ? <Check className={styles.toasticon} style={{color:'#FFFFFF', backgroundColor: 'forestgreen'}}/> : ''}
            {(type == 'info') ? <Info className={styles.toasticon} style={{color:'#FFFFFF', backgroundColor:'darkgrey'}} /> : ''}
            {(type == 'error') ? <X className={styles.toasticon} style={{color:'#FFFFFF', backgroundColor:'firebrick'}}/> : ''}
            {(type == 'warning') ? <Triangle className={styles.toasticon} style={{color:'#FFFFFF', backgroundColor:'goldenrod'}}/> : ''}
             {message}
      </div>
    </div>

  
  </div>

  
  
  
);
        }
// ToastMessage.propTypes = {
//   message: PropTypes.string.isRequired,
//   type: PropTypes.string.isRequired
// };

// ToastMessage.dismiss = toast.dismiss;
