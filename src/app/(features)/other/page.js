'use client'
import { useEffect, useState } from 'react';

export default function D() {

  const [count, setCount] = useState(0);

  useEffect(()=>{
    function handleClick1() {
      setCount(count + 1);
      bro()
    }  
    handleClick1()
  })
  function handleClick() {
    setCount(count + 1);
    bro()
  }

  function bro(){
    console.log(count);
  }


  return (

    
    <main>
      <div>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>Click me</button>
    </div>

    
    </main>
  )
}
