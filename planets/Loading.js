import React, {useState, useEffect} from 'react'

const spaceFax = [
    {title: 'A FULL NASA SPACE SUIT COSTS $12,000,000.',
     details: "While the entire suit costs a cool $12m, 70% of that cost is for the backpack and control module. However, the space suits that NASA uses were built in 1974."},
     {title: 'THERE IS A PLANET MADE OF DIAMONDS',
     details: 'There’s a planet made of diamonds twice the size of earth The "super earth," aka 55 Cancri e, is most likely covered in graphite and diamond.'},
     {title: 'THE SUNSET ON MARS APPEARS BLUE ',
     details: "Just as colors are made more dramatic in sunsets on Earth, sunsets on Mars, according to NASA,  would appear bluish to human observers watching from the red planet."},
     {title: 'ONE DAY ON VENUS IS LONGER THAN ONE YEAR.',
     details: 'Venus has a slow axis rotation which takes 243 Earth days to complete its day. The orbit of Venus around the Sun is 225 Earth days.'},
     {title: 'THE HOTTEST PLANET IN OUR SOLAR SYSTEM IS 450° C.',
     details: "Venus; even though is not the closet planet to the sun is the hottest planet in the solar system and has an average surface temperature of around 450° C. "},
]

export default function Loading(props) {

    let view = props.load == 1 ? ' translate-y-[100vh] fixed ' : ' fixed translate-y-[0] z-50 ';

    const [randomNum, setRandom] = useState('loading')
    
    useEffect(() => {
        setRandom(Math.floor(Math.random() * 5));
    }, []);

  return (
    <>
    <div className={'duration-1000 transition-all bg-zinc-900 z-50 w-full h-full flex flex-col justify-center items-center text-white text-center ' + view }>

  
        <div className={'z-50 flex items-center justify-center font-[Inter] text-center transition-all duration-500 mb-4 ' + props.className}>
                <div className=' mx-auto bg-transparent rounded-xl ' >
                    <div className="flex items-center justify-center h-full">
                        <div className={(props.light ? 'border-slate-100 ' : 'border-slate-100 ') + " rounded-full animate-spin " + (props.loadClass ? props.loadClass : ' w-16 h-16 border-b-4')}></div>
                </div>
            </div>
        </div>
        <div className={'text-white text-2xl '}>Loading: {Math.round(props.load * 100)}%</div>
        {randomNum == 'loading' ? '' : 
        <div className='w-[90%] lg:w-[50%] mx-auto font-[Inter] mt-5'>
            <p className='text-xs mb-2'>DID YOU KNOW</p>
            <p className='text-sm mb-2'>{spaceFax[randomNum].title}</p>
            <p className='text-sm'>{spaceFax[randomNum].details}</p>
        </div>
            }
    </div>
    </>
  )
}
