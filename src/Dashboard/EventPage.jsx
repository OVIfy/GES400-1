import { useEffect, useState } from "react";
import "./EventPage.css";
import Modal from "../components/Modal";
// import CheckOut from "../components/CheckOut";
import { useLoaderData} from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "../actions/actions";
import { formatAMPM } from "../Utilities/utilis";
// import { Spinner } from "flowbite-react";
import clock from '../assets/public/Clock.png'
import calender from '../assets/public/Calender.png'
import union from '../assets/public/union.png'
import location from '../assets/public//mapLocation.png'
import tag from '../assets/public/Tag.png'
import ellipse from '../assets/public/ellipse-14.png'
import { AiOutlineFacebook, AiOutlineInstagram } from "react-icons/ai";
import { BsGlobe } from "react-icons/bs";
import { FiTwitter } from "react-icons/fi";
// import bck from "../assets/bckgrnd.png"
import { Spinner } from "flowbite-react";





function EventPage() {
  const eventId = useLoaderData()
  const [event, setEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data , error, isLoading } = useSWR(import.meta.env.VITE_SERVER_URL  + `/api/events/${eventId}?populate[0]=cover&populate[1]=createdby&populate[2]=createdby.profile`, fetcher, { refreshInterval : 100 });
  const { data:user } = useSWR(import.meta.env.VITE_SERVER_URL  + `/api/users/${data?.data?.attributes?.createdby?.data?.id}?populate=*`, fetcher, { refreshInterval : 100 });

  //ticket logic
  const [currentTicketIndex, setCurrTicketIndex] = useState(0)
  const [tickets, setTickets] = useState([{tt : "Regular", tp : 500}, {tt : "Silver", tp : 200}])
  
  useEffect(()=>{
    if(data?.data?.attributes) setEvent(data.data.attributes)
    if(data?.data?.attributes?.tickettypes?.length > 0) setTickets(data?.data?.attributes?.tickettypes)
    console.log(data?.data?.attributes?.tickettype)
    console.log(tickets)
  }, [data])

  const Slide = () => {

  }

  // if(data) console.log(data) 
  // if(user) console.log(user)
  // function payWithPaystack(e) {
  //   e.preventDefault();
  
  //   let handler = PaystackPop.setup({
  //     key: 'pk_test_6c3ee31919315e74bb8f076a2789144c567526ff', // Replace with your public key
  //     email: 'ovifeanyichukwu@gmail.com',
  //     amount: 100 * 100, // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
  //     // label: "Optional string that replaces customer email"
  //     onClose: function(){
  //       alert('Window closed.');
  //     },
  //     callback: function(response){
  //       // let message = 'Payment complete! Reference: ' + response.reference;
  //       // alert(message);
  //       console.log(response)
  //     }
  //   });
  
  //   handler.openIframe();
  // }

  function increaseCurrentTicketIndex(){
    if(currentTicketIndex != tickets.length - 1)
      setCurrTicketIndex(currentTicketIndex + 1)
    else setCurrTicketIndex(0)
  }

  function decreaseCurrentTicketIndex(){
    if(currentTicketIndex != 0)
      setCurrTicketIndex(currentTicketIndex - 1)
    else setCurrTicketIndex(tickets.length - 1)
  }

  return (
    <div className='event_page'>
      {isLoading && <div className="absolute top-0 right-0 left-0 h-screen flex justify-center items-center">
        <Spinner size='xl'
        />
      </div>}
      <div className='event_page_section'>
        {event &&
          <>
          <div className='event_page_section1'>
            <div className="field_image_div" style={{backgroundImage: `url(${event?.cover?.data?.attributes?.url})`}} >
            </div>
            {/* <img className="fleidImg" src={bck} alt="Fleid" /> */}
            <img className="fleidImg" src={event?.cover?.data?.attributes?.url} alt="Fleid" />
          </div>
          <div className='event_page_section2'>
            <div className="event_page_header">
              <h2 className="single_event_name">{event?.name}</h2>
              <h4 className="single_event_name2">{event?.type}</h4>
            </div>
            <div className="In-person_event">
              <div className="Details">
                <h3 className="details_head">Details</h3>
                <div className="details_de">
                  <span>
                    <img src={clock} alt="clock  icon"/>5 Hrs
                  </span>
                  <span>
                    <img src={calender} alt="calender icon"/>
                    {formatAMPM(new Date(event.start))} {event.end && ` - ${formatAMPM(new Date(event.end))}`}
                  </span>
                  <span>
                    <img src={union} alt="users icon"/>
                    Event by {event.organizer}
                  </span>
                  <span>
                    <img src={location} alt="location icon"/>
                    {event.location}
                  </span>
                  <span>
                    <img src={tag} alt="tags icon"/>
                    {event.category?.split(',')[0]}
                    {event.category?.split(',')[1] && ' & ' + event.category?.split(',')[1]}
                  </span>
                </div>
                
                <h3 className="details_head">Description</h3>
                <p className="event_description">
                  {event.description}
                </p>
                <h3 className="details_head">Tags</h3>
                <span className="Tags">
                  {
                    event.category?.split(",")?.map((tag, i) => <p key={i} className="event_tag">{tag}</p>)
                  }
                </span>
              </div>
              <div className="Tickets">
                {tickets?.length > 0 && 
                <>
                <h3 className="details_head">Tickets</h3>
                <p className="single_event_name2">Type</p>
                <div className="ticket_types">
                  <span className="next_button" onClick={increaseCurrentTicketIndex}>&gt;</span>
                  <div className="the_tickets">
                    <div className="each_ticket showing">
                      <span className="ticket_type_name">{tickets[currentTicketIndex]?.tt}</span>
                      <span className="ticket_type_price">{tickets[currentTicketIndex]?.tp}</span>
                    </div>
                  </div>
                  <span className="next_button" onClick={decreaseCurrentTicketIndex}>&lt;</span> 
                </div>
                </>}
                
                
                {/* <div className="Quantities">
                  <p className="details_subhead">Quantity</p>
                  <input type="number" name="" id="" min="1" max="5" className="quantity_field"/>
                  <p className="details_subhead">Amount</p>
                  <input type="number" name="" id="" className="quantity_field"/>
                </div> */}
                <button onClick={() => setIsModalOpen(true)} className="checkout_button">Checkout</button>
            
              </div>
             {user ? <div className="About">
                <h2 className="details_head">About your Host</h2>
                <span className="about_location">
                  <img src={user?.profile?.url || ellipse} alt="" className="w-[50px] object-cover rounded-full aspect-square"/>
                  {user?.username}
                </span>
                <p className="about_description">
                  {user?.bio || 'No Bio Yet'}
                </p>
                <h3 className="details_subhead"> Has hosted {user?.createdevents?.length == 1 ? user?.createdevents?.length + ' event' : user?.createdevents?.length + 'events'}  on Easy Events</h3>
                <span className="about_socials">
                  <a href={user?.facebook || '#facebook link goes here'}><AiOutlineFacebook className="social_icon1"/></a>
                  <a href={user?.instagram || '#instagram link goes here'}><AiOutlineInstagram className="social_icon1"/></a>
                  <a href={user?.twitter || '#twitter link goes here'}><FiTwitter className="social_icon2"/></a>
                  <a href={user?.website || '#website link goes here'}><BsGlobe className="social_icon2"/></a>
                </span>
              </div> : <Spinner size="md"/>}
            </div>
          </div>
        </>
        }
        {
          error && <p>No Event to show</p>
        }
      </div>
      {/* {isModalOpen && <CheckOut setIsModalOpen={setIsModalOpen} />} */}
      {event && <Modal ticketPrice={tickets[currentTicketIndex]?.tp} ticketType={tickets[currentTicketIndex]?.tt} eventID={data?.data?.id} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default EventPage;
