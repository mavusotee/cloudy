import React from 'react'
import SmallButton from './SmallButton'
import Button from './Button'

function Footer() {
  return (
    <div className="w-full min-h-[90vh] md:min-h-[80vh] flex flex-col items-start justify-between pt-[clamp(2.5rem,8vw,7.5rem)]">
      
      {/*TOP DIV HOUSING CLIENT INFO*/}
      <div className="flex flex-col lg:flex-row justify-between w-full gap-[clamp(5rem,5vw,5rem)]">
        {/*LEFT DIV*/}
        <div className="flex flex-col items-start justify-start space-y-[clamp(1.5rem,3vw,3rem)]">
           <div className="flex flex-col space-y-[clamp(1.2rem,2vw,1.5rem)]">
            <h1 className="w-full max-w-[clamp(35rem,50vw,42.8125rem)] tracking-tight text-[clamp(1.75rem,3.5vw,3.6375rem)] font-sans font-medium text-ghost-white leading-[110%]">YOU BUILT THE SPACE NOW SECURE THE LEGACY</h1>
            <p className="w-full max-w-[clamp(20rem,40vw,36.875rem)] text-[clamp(0.8rem,1.2vw,1rem)] text-zinc-600 leading-[130%] font-geist-mono uppercase">You’ve put everything into building something incredible. Now, let’s make sure the rest of the world sees it that way.</p>
           </div>

           <Button text='CHECK AVAILABILITY' link="/contact" className=""/>
        </div>

        {/*RIGHT DIV*/}
        <div className="flex flex-col items-start justify-start space-y-[clamp(2.95rem,3vw,3rem)] lg:-translate-x-[clamp(1rem,5vw,5rem)]">
          {/*CONTACT DETAILS*/}
          <div className="flex flex-col space-y-[clamp(0.75rem,2vw,1.5rem)] items-start justify-start w-full">
           <h1 className="font font-geist-mono text-zinc-500 text-[clamp(0.65rem,1.1vw,1rem)]">CONTACT</h1>
            {/*DETAILS*/}
           <div className="flex flex-col -space-y-2 md:space-y-0 font-geist-mono text-ghost-white text-[clamp(0.525rem,4.5vw,1.225rem)] uppercase">
             <h1>0404 104 360</h1>
             <h1>ADELAIDE, SOUTH AUSTRALIA</h1>
             <h1>info@cloudhaus.com.au</h1>
           </div>
          </div>

          {/*CONTACT DETAILS*/}
          <div className="flex flex-col space-y-[clamp(0.75rem,2vw,1.5rem)]">
               <div className="flex flex-col space-y-[clamp(0.25rem,1vw,0.5rem)] items-start justify-start w-full">
           <h1 className="font font-geist-mono text-zinc-500 text-[clamp(0.65rem,1.1vw,1rem)]">SOCIALS</h1>
            {/*DETAILS*/}
           <div className="flex flex-row space-x-[clamp(1.5rem,1.5vw,1rem)] font-geist-mono text-ghost-white text-[clamp(0.625rem,4.5vw,1.225rem)] uppercase">
             
             <h1>INSTAGRAM</h1>
             <h1>FACEBOOK</h1>
             <h1>VIMEO</h1>
           </div>
          </div>
          </div>
        </div>

        
      </div>

      {/* BOTTOM CONTENT */}
      <div className="flex flex-col-reverse md:flex-row items-start md:items-end justify-between font-geist-mono text-ghost-white text-[clamp(0.3rem,2.5vw,0.725rem)] uppercase w-full gap-[clamp(0.55rem,0.8vw,1.5rem)] pt-[clamp(2.5rem,6vw,4rem)]">
        {/* GROUPED 1st AND 2nd DIVS: Horizontal on mobile, inline with desktop row */}
        <div className="flex flex-row md:contents justify-between w-full md:w-auto">
          <div className="flex flex-col md:flex-row space-y-0 space-x-[clamp(0.5rem,4.5vw,6rem)]">
            <h1>BASED IN ADELAIDE</h1>
            <h1 className="">PRIVACY POLICY</h1>
          </div>
          <div className="flex flex-col md:flex-row space-y-0 space-x-[clamp(0.5rem,4.5vw,6rem)]">
            <h1>PRIVACY POLICY</h1>
            <h1 className="font-bold">WEBSITE BY: ZANI</h1>
          </div>
        </div>

        {/* 3rd DIV: Below on mobile, start-aligned */}
        <div className="flex flex-row space-x-[clamp(0.5rem,4.5vw,6rem)]">
          <h1 className="font-bold">BACK TO HOME</h1>
        </div>
      </div>
    </div>
  )
}

export default Footer