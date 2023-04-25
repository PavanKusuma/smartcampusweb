import { Inter } from 'next/font/google'
import styles from './page.module.css'
import Vertification from './components/verification'
// import CampusList from './components/campuslist'
import OutingRequest from './components/outingrequest'
import BlockDates from './components/blockdates'
import Image from 'next/image'
const twilio = require('twilio')

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  // const [selectedTab, setSelectedTab] = useState('Projects');

  
  // check sms api
  async function sendSMS(){

    try {
      const accountSid = "AC922e697296cd14fe9c8b5eabfc602c41";
      const authToken = "82b9092f382438f4514ca5d2dd9b8697";
      const client = require('twilio')(accountSid, authToken);

      client.messages
        .create({
          body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
          from: '7799813519',
          to: '7799813519'
        })
        .then(message => console.log(message.sid))
        .catch(error => console.error(error));

    }
    catch (error) {
      console.log("Error SMS " + error);
      console.log("Error " + error);
    }
    
    
  }

// sendSMS()

  return (

    
    <main className={styles.main}>
      <div className={styles.description}>
        
          <Vertification />
          {/* <BlockDates /> */}
          {/* <Dashboard /> */}
          {/* <OutingRequest /> */}
        
      </div>

    
    </main>








   
  )
}
