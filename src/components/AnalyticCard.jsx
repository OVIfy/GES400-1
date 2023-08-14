import "./EventCard.css"
import { useState } from 'react'
import { Spinner } from "flowbite-react"
import { Link } from "react-router-dom"

const AnalyticCard = ({title, type, url, hideLikeIcon, style, like, afterClick, eventId, interested, going}) => {
    const [islike, setIsLike] = useState(like)
    const [isLoading, setIsLoading] = useState(false)

    async function switchLike(){
        setIsLoading(true)
        if(afterClick){
            await afterClick(islike, eventId)
            setIsLike(!islike) 
            setIsLoading(false)
        }
        else{
            setIsLike(!islike)
            setIsLoading(false)
        }
    }

    return(
        <div className={style}>
            <div className='picture_div' onClick={switchLike}>
                {isLoading && <Spinner className='absolute top-2 left-2' size='md'/>} 
                <img src={url} className='event_img object-cover object-top' alt='image'/>
                { !hideLikeIcon && ( 
                        islike?
                        <p className='heart_icon' >❤️</p>
                        :
                        <p className='heart_icon' >🤍</p>
                    )
                    // <img src={heart} alt='icon' className='heart_icon'/>
                }
            </div>
            <div className='event_info'>
                <h2 className='event_name'><Link to={`/dashboard/analytics/${eventId}`}>{title}</Link></h2>
                <span className='event_booking'>{type}</span>
                <span className='event_popularity'>{interested} Interested . {going} Going</span>
            </div>
        </div>
    )
}



export default AnalyticCard