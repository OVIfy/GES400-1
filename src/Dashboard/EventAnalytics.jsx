import { useState } from 'react';
import Piechart from "../components/Piechart"
import "./EventAnalytics.css"
import { useLoaderData } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '../actions/actions';
import { useEffect } from 'react';
import { formatAMPM } from '../Utilities/utilis';
import { Spinner } from 'flowbite-react';
import axios from 'axios';
import { getUserFromSession } from '../hooks/hooks';

const EventAnalytics = () => {
    const [chartKey, setChartKey] = useState(0);
    const eventId = useLoaderData()
    const [event, setEvent] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLiveStatusLoading, setIsLiveStatusLoading] = useState(false)
    const { data , error, isLoading } = useSWR(import.meta.env.VITE_SERVER_URL  + `/api/events/${eventId}?populate[0]=cover&populate[1]=createdby&populate[2]=tickets`, fetcher, { refreshInterval : 100 });
    const [tickets, setTickets] = useState([])
  
    useEffect(()=>{
      if(data?.data?.attributes) setEvent(data.data.attributes)
      if(data?.data?.attributes?.tickets?.data) setTickets(data.data.attributes.tickets.data)

    }, [data])
  
    if(event) console.log(event)
    if(isLoading) console.log(isLoading)

  const renderChart = () => {
    setChartKey(chartKey + 3);
  };
  renderChart;

  async function updateEventLiveStatus(){
    if(!isLiveStatusLoading){ //if a request is not currentlly being processed
        if(eventId){ //if eventID is present
            setIsLiveStatusLoading(true)
            let newVal = !event.live
            console.log(newVal)
            await axios.put(import.meta.env.VITE_SERVER_URL  + `/api/events/${eventId}`, {data : {live : newVal}}, {
                headers:{
                    'Authorization' : 'Bearer ' + getUserFromSession()?.token
                }
            })
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
            setIsLiveStatusLoading(false)
        }

    }
  }

  return (
    <div className="event_analytics">
        {isLoading && <div className="absolute top-0 right-0 left-0 h-screen flex justify-center items-center">
        <Spinner size='xl'
        />
      </div>} 
        {event && <div className='home_section event_analytics_section'>
            <div className='event_analytics_section1'>
                <h3 className='section_head'>Event Analytics</h3>
                <span className="event_analytics_name">{event?.name}</span>
                <span className="event_analytics_date">{formatAMPM(new Date(event?.end || event?.start))}</span>
            </div>
            <div className="event_analytics_info">
                <span className="event_analytics_subhead">Event Info</span>
                <div className="event_analytics_subdiv">
                    <div className="event_visibility">
                        <div onClick={updateEventLiveStatus} className={`event_visibility_sub relative`}>
                            <span className="event_visibility_name">Live</span>
                            <div className="event_visibility_info">
                                {event?.live ? 'Your event is live on Primavera.' : 'Click to make your Event Live'}
                            </div>
                            {isLiveStatusLoading && <Spinner size="xs" className='absolute top-1 right-1'/>}
                            {!isLiveStatusLoading && !event?.live && <p className='inline-block absolute top-1 right-1'>🔴</p>}
                            {!isLiveStatusLoading && event?.live && <p className='inline-block absolute top-1 right-1'>🟢</p>}
                        </div> 
                        <div className="event_visibility_sub">
                            <span className="event_visibility_name">Public</span>
                            <div className="event_visibility_info">
                                Your event is set to public, for anyone.
                            </div>
                        </div>       
                    </div>
                </div>
            </div>
            <div className="event_analytics_tickets">
                <span className="event_analytics_subhead">Tickets</span>
                <div className="event_analytics_tickets_section">
                    <div className="ticket_pie_chart">
                        <Piechart key={chartKey}/>
                    </div>
                    <div className="pie_chart_details1">
                        <span className="pie_sub_details">
                            <span className="pie_sub_details_head">Sold:</span>
                            <span className="pie_sub_details_detss">100</span>
                        </span>
                        <span className="pie_sub_details">
                            <span className="pie_sub_details_head">Available:</span>
                            <span className="pie_sub_details_detss">1000</span>
                        </span>
                    </div>
                    <div className="pie_chart_details2">
                        <span className="pie_summary">100 tickets / 1000</span>
                    </div>
                </div>
            </div>
            <table>
                <span className="event_analytics_subhead">Registered Attendees</span>
                <tr>
                    <th className='first_one'>Full name</th>
                    <th>Ticket type</th>
                    <th>Ticket ID</th>
                    <th>Price</th>
                </tr>
                {
                    tickets.map((ticket, i) => 
                    <tr key={i}>
                        <td className='first_one'>{ticket?.attributes?.firstName} {ticket?.attributes?.lastName}</td>
                        <td>{ticket?.attributes?.type || 'Regular'}</td>
                        <td>{ticket?.id}</td>
                        <td>#{ticket?.attributes?.price || ''}</td>
                    </tr>
                    )
                }
                {/* <span className='space'>.</span> */}
            </table> 
        </div>}
    </div>
  )
}

export default EventAnalytics