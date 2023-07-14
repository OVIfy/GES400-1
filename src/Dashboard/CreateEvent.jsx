import "./CreateEvent.css"
import plus from "../assets/plus.svg"
import date2 from "../assets/date2.svg"
import time from "../assets/time.svg"
import down from "../assets/down.svg"
import locate from "../assets/location.svg"
import upload from "../assets/upload.svg"
import { useState } from "react"

/* eslint-disable react/prop-types */
import Map from "../components/Map"
import {Form} from 'react-router-dom'


const CreateEvent = (props) => {
    const [showEndInput, setShowEndInput] = useState(false)
    const [imgUrl, setImgUrl] = useState('')


    function EndDateAndTime(){
        return(
            <div className="start_date_time">
                    <div className="date_time">
                        <span className="date_time_head">{'End Date'}</span>
                        <input name="stop_date" className="block w-full date_detail" type="date"/>
                    </div>
                    <div className="date_time">
                        <span className="date_time_head">{'End Time'}</span>
                        <input name="stop_time" className="block w-full date_detail" type="time"/>
                    </div>
                </div>
        )
    }

    function showNewImage(e){
        setImgUrl(URL.createObjectURL(e.target.files[0]))
    }

  return (
    <div style={props.style} className="create_event">
        <div className='home_section new_event_section'>
            <div className='home_section1'>
                <h3 className='section_head'>Create Event</h3>
            </div>
            <Form method="POST" className="event_creation" encType="multipart/form-data">
                <div style={{backgroundImage : `url('${imgUrl}')`}} className="upload_picture bg-contain flex flex-col">
                    <img src={upload} className="upload " alt="icon"/>
                    <input type="file" name="files" onChange={showNewImage}/>
                </div>
                <label>
                    Event Name
                    <div className="inside_label">
                        <input type="text" name="name" id="event-name"  className="event-name name_input" placeholder="Enter event name"/>
                        <div className="add_description"><img src={plus} className="plus" alt="icon"/><span className="button_text">Add Description</span></div>
                    </div>
                </label>
                <label>
                    Organizer
                    <input type="text" name="organizer" id="event-organizer"  className="event-organizer" placeholder="Tell attendees who's organizing the event"/>
                </label>
                <div className="start_date_time">
                    <div className="date_time">
                        <span className="date_time_head">Date</span>
                        <input required name="start_date" className="block w-full date_detail" type="date"/>
                    </div>
                    <div className="date_time">
                        <span className="date_time_head">Time</span>
                        <input required name="start_time" className="block w-full date_detail" type="time"/>
                    </div>
                </div>
                {
                    !showEndInput ?
                    <button onClick={(e)=> setShowEndInput(true)} className="px-0 mb-3 mt-1 bg-transparent">+ End Date and Time</button>
                    :
                    <>
                        <EndDateAndTime/>
                        <button onClick={()=> setShowEndInput(false)} className="px-0 mb-3 mt-1 bg-transparent">- End Date and Time</button>
                    </>
                }
                <div className="end_date_time">
                    <div className="date_time">
                        <select className="dropdown_label inside_label" name="type">
                            <option value="in-person">in-person</option>
                            <option value="virtual">virtual</option>
                        </select>
                    </div>
                 
                    <div className="date_time">
                        <input name="category" placeholder='Category' className='h-full w-full p-2 rounded-md'/>
                    </div>
                </div>
                <label>
                    Location
                    <div className="inside_label">
                        <Map />
                    </div>
                </label>
                <label>
                    Description
                    <textarea type="text" name="description" id="event-description"  className="event-description"/>
                </label>
                <button type="submit" className="publish_event">Publish Event</button>
            </Form>
        </div>
    </div>
  )
}

export default CreateEvent