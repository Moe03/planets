import React from 'react'
import Image from 'next/image'

function Menu(props) {

  let isActive = props.isActive;  
  let setIsActive = props.setIsActive;
  let planets = props.planets;
  let currentPlanet = props.currentPlanet;
  let setCurrentPlanet = props.setCurrentPlanet;

  return (
    <div className={`${isActive ? 'translate-y-[0vh]' : 'translate-y-[-100vh]'} w-[100vw] h-[100vh] fixed z-50 bg-black duration-700 transition-all`}>
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-2 w-[85%] lg:gap-5 lg:w-[50%] mx-auto text-white mb-5'>
        <button onClick={() => setIsActive(false)} className='col-span-full relative w-8 h-8 bg-white rounded-full mx-auto'>
            <Image layout='fill' src={'/x.svg'} /> 
        </button>
      {planets.map((planet, index) => 
      
            <button key={index} onClick={() => {setCurrentPlanet(planet.name); setIsActive(false);}} id={planet.name} className='navbtns text-white relative flex flex-col jusitfy-center items-center border border-transparent rounded-lg hover:border-white'>
              <div className='relative w-16 h-16  lg:w-20 lg:h-20'>
                <Image id={planet.name} layout='fill' src={`/${planet.name}icon.svg`} />
              </div>
              <p className={planet.name == currentPlanet ? 'text-white font-bold' : 'text-gray-400' +  ` text-white w-full`}>{planet.name}</p>
            </button>
  
        )}
        <div className='w-full text-center col-span-full mt-5'>
          <a target={'_blank'} href={'https://github.com/moe03/planets'} className='inline ml-3 underline'>Github</a>
          
          <button className='block text-center mx-auto mt-1'>Designed and developed my <span className=' underline'>Moe</span></button>
        </div>

      </div>
    </div>
</div>
  )
}

export default Menu