import "./Tickets.css"
import Ticket from "../components/Ticket"
import useSWR from "swr"
import { fetcher } from "../actions/actions"
import { getUserFromSession } from "../hooks/hooks"
import {useState, useEffect} from 'react'
import { Spinner } from "flowbite-react"


/* eslint-disable react/prop-types */

const Tickets = (props) => {

  const { data , error, isLoading } = useSWR(import.meta.env.VITE_SERVER_URL  + `/api/tickets?populate=*&filters[user][id][$eq]=${getUserFromSession()?.id}&pagination[pageSize]=100`, fetcher, { refreshInterval : 100 });
  const [tickets, setTickets] = useState([])

  useEffect(()=>{
    console.log(data?.data)
    if(data) setTickets(data?.data)
  }, [data])

  return (
    <>
    {
    isLoading ? <div className="absolute top-0 right-0 left-0 h-screen flex justify-center items-center">
          <Spinner size='xl'/>
        </div>
    
      :

      <div style={props.style} className="tickets">
        <div className='home_section'>
            <div className='home_section1'>
                <h3 className='section_head'>Tickets</h3>
            </div>
            <h4 className='section_subhead manage_subhead'>Received</h4>
            <div className="received_tickets">
              {
                tickets?.length > 0 ?
                  tickets.map((ticket, i) => 
                    <Ticket
                      key={i}
                      userName={ticket?.attributes?.firstName + ' ' + ticket?.attributes?.lastName}
                      eventName={ticket?.attributes?.event?.data?.attributes?.name}
                      price={'#' + ticket?.attributes?.price}
                      ticketType={ticket?.attributes?.type || "Regular Ticket"}
                      ticketId={ticket?.id}
                    />
                  )
                    : <p className="tickets_text">You do not have any Tickets yet, Register for an event to get one</p>
              }
                          
            </div>
            {/* <h4 className='section_subhead manage_subhead'>Pending</h4>
            <div className="received_tickets">
            <div className="ticket_details">
                  <div className="ticket_name">U2018 CSC Champions League...</div>
                  <span className="ticket_owner">Okpara Joel Omehoma</span>
                  <span className="ticket_type">Regular Ticket</span>
                  <div className="ticket_detail">
                      <div className="ticket_price">#5000</div>
                      <span className="ticket_id">5jeu35</span>
                  </div>
                </div>
                <div className="ticket_details">
                  <div className="ticket_name">HOD’s Cup 2023</div>
                  <span className="ticket_owner">Okpara Joel Omehoma</span>
                  <span className="ticket_type">VIP Ticket</span>
                  <div className="ticket_detail">
                      <div className="ticket_price">#10000</div>
                      <span className="ticket_id">5jeu35</span>
                  </div>
                </div>                
            </div> */}
        </div>
    </div>   
    } 
    </>
 
  )
}

export default Tickets