export async function Keyverify(secretKey) {
    console.log(secretKey)
    console.log(process.env.NEXT_PUBLIC_API_PASS)
    if (secretKey === process.env.NEXT_PUBLIC_API_PASS) {
        console.log(true)
        return true
    }
    else {
        console.log(false)
        return false
    }
  };