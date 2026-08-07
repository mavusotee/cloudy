import React from 'react'

function ClientsSection() {
  return (
    <div className="w-full h-auto bg-carbon-black mt-30">
       <div className="flex flex-row items-center justify-between w-full text-zinc-300">
            <div className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)] flex items-center gap-2">
              <div className="w-2 h-2 bg-zinc-300" />
              <h1>CLIENTS</h1>
            </div>
            <h1 className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)]">[CLOUD_4]</h1>
          </div>

          {/*TITLE*/}
          <div className="flex flex-col space-y-18 mt-10">
             <h1 className="text-4xl font-sans tracking-tight text-ghost-white w-[40rem]">OUR CURRENT ROSTER:</h1>

             <div className="flex flex-row space-x-6 overflow-x-hidden">
                <div className="w-[45rem] h-[15rem] border border-eclipse bg-carbon-black"></div>
                <div className="w-[45rem] h-[15rem] border border-eclipse bg-carbon-black"></div>
                <div className="w-[45rem] h-[15rem] border border-eclipse bg-carbon-black"></div>
                <div className="w-[45rem] h-[15rem] border border-eclipse bg-carbon-black"></div>
                <div className="w-[45rem] h-[15rem] border border-eclipse bg-carbon-black"></div>
                <div className="w-[45rem] h-[15rem] border border-eclipse bg-carbon-black"></div>
             </div>
          </div>


    </div>
  )
}

export default ClientsSection