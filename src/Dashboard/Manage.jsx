import "./Manage.css"
import bck from "../assets/bckgrnd.png"
import heart from "../assets/heart.svg"
import { getUserFromSession } from "../hooks/hooks"
import { useState, useEffect } from "react"
import EventCard from "../components/EventCard"
import AnalyticCard from "../components/AnalyticCard"
import useSWR from 'swr'
import { fetcher, handleHeartClick } from "../actions/actions"
import Loading from "./Loading"
// import {useNavigate} from 'react-router-dom'

/* eslint-disable react/prop-types */

const Manage = (props) => {
    const [createdEvents, setCreatedEvents] = useState([])
    const [InterestedEvents, setInterestedEvents] = useState([])
    const { data, error, isLoading } = useSWR(import.meta.env.VITE_SERVER_URL  + `/api/users/${getUserFromSession()?.id}?populate[createdevents][populate][0]=cover&populate[likes][populate][0]=cover&populate[createdevents][populate][1]=likedby&populate[likes][populate][1]=likedby&populate[createdevents][populate][2]=tickets`, fetcher, { refreshInterval : 100 });

    if(error) console.log(error)
    if(data) console.log(data)
    // const navigate = useNavigate();

    useEffect(()=> {
        // setCreatedEvents(data?.data?.filter(data => data?.attributes?.createdby?.data?.id == Number(getUserFromSession()?.id)))
        // setInterestedEvents(data?.data?.filter(data => data?.attributes?.likedby?.data?.find(data => data.id == Number(getUserFromSession()?.id))))
        setCreatedEvents(data?.createdevents)
        setInterestedEvents(data?.likes)
    }, [data, InterestedEvents, createdEvents])

  return (
    <div style={props.style} className="manage">
        <div className='home_section'>
            <div className='home_section1'>
                <h3 className='section_head'>Manage</h3>
            </div>
            <h4 className='section_subhead manage_subhead'>Created Events</h4>
            <div className='manage_section2'>
                <div className="scroll_div">
                    {
                        createdEvents?.map(event => 
                            <AnalyticCard
                                key={event.id}
                                title={event.name}
                                type={event.type}
                                // url={import.meta.env.VITE_SERVER_URL + event.attributes.cover.data.attributes.url}
                                url={event?.cover?.url}
                                style={"manage_event"}
                                hideLikeIcon={true}
                                afterClick={handleHeartClick}
                                eventId={event.id}
                                interested={event?.likedby?.length}
                                going={event?.tickets?.length}
                            />)
                            
                    }
                    {
                        createdEvents?.length < 1 ?  <p className="italic text-gray-300 nothing">you haven't created any events yet</p> : null
                    }
                </div>
            </div>
            <h4 className='section_subhead manage_subhead'>Interested Events</h4>
            <div className='manage_section2'>
                <div className="scroll_div">
                {
                        InterestedEvents?.map(event =>  event.live == true &&
                            <EventCard 
                                key={event?.id}
                                title={event?.name}
                                type={event?.type}
                                // url={import.meta.env.VITE_SERVER_URL + event.attributes.cover.data.attributes.url}
                                url={event?.cover?.url}
                                style={"manage_event"}
                                like={true}
                                afterClick={handleHeartClick}
                                eventId={event?.id}
                                interested={event?.likedby?.length}
                            />)
                    }
                    {
                        InterestedEvents?.length < 1 ?  <p className="italic text-gray-300 nothing">you have not liked any events yet</p> : null
                    }
                </div>
            </div>
            <h4 className='section_subhead manage_subhead'>Paid Events</h4>
            <div className='manage_section2'>
                <div className="scroll_div">
                    <p className="italic text-gray-300 nothing">Have not paid or registered for any events yet</p>
                </div>
            </div>
        </div>

        {isLoading && <Loading isopen={true}/>}
    </div>
  )
}

export default Manage