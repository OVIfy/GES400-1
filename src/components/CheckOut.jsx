import "./CheckOut.css";
import "../Dashboard/CreateEvent.css"
import bck from "../assets/bckgrnd.png"
import { useActionData } from "react-router-dom";
import { useEffect, useState } from "react"
import { Form } from "react-router-dom";
import { Spinner } from "flowbite-react";

/* eslint-disable react/prop-types */


const CheckOut = ({ onClose, setSwitchModal, eventID, ticketPrice, ticketType }) => {

  const action = useActionData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  useEffect(()=>{
    console.log(action)
    if(action == true){
      setSwitchModal(!action)
      setIsSubmitting(false)
    } 
  }, [action])
 
  return (
    <Form method="POST" className="CheckOutPage-container" onSubmit={() => setIsSubmitting(true)}>
      <div className="container">
        <div className="CheckOut">
          <div className="check_out">
            <h3 className="single_event_name checkout_name">Checkout</h3>
            <h4 className="details_head checkout_head">Ticket Name</h4>
            <div className="event_creation checkout_form" action="">
              <div className="FirstName">
                <label htmlFor="">
                  First Name
                  <input
                    type="text"
                    name="firstName"
                    id=""
                    placeholder="Enter your first name"
                  />
                  <input
                    type="text"
                    name="eventID"
                    id=""
                    defaultValue={eventID}
                    placeholder="Enter your first name"
                    className="hidden"
                  />
                  <input
                    type="number"
                    name="price"
                    id=""
                    defaultValue={ticketPrice}
                    placeholder="Enter your first name"
                    className="hidden"
                  />
                  <input
                    type="text"
                    name="type"
                    id=""
                    defaultValue={ticketType}
                    placeholder="Enter your first name"
                    className="hidden"
                  />
                </label>
                
                <label htmlFor="">
                  Last Name
                  <input
                    type="text"
                    name="lastName"
                    id=""
                    placeholder="Enter your last name"
                  />
                </label>
              </div>
              <div className="other_input">
              <label htmlFor="">
                Email
                <input type="email" name="email" id="" placeholder="abc@example.com" />
              </label>
              <label htmlFor="">
                Phone Number
                <input type="number" name="phone" id="" placeholder="+234" />
              </label>
              </div>
              <div className="checkbox_div">
                <p className="checkbox_head">Gender</p>
                <span className="Checkbox">
                  <input type="radio" name="gender" value="Male" id="" />
                  Male
                </span>
                <span className="Checkbox">
                  <input type="radio" name="gender" value="Female" id="" />
                  Female
                </span>
              </div>
            </div>
            
            <span className="terms">
              <p className="agree">
                <input type="checkbox" name="" id="" required/>
                <span> By clicking Register, I agree to the{" "} <strong>Primavera Terms of Service</strong>
                </span>
              </p>
              <div className="checkout_buttons">
                <button type="submit">Checkout {isSubmitting && <Spinner className="ml-1" size="md"/>}</button>
                <button onClick={onClose}>Cancel</button>
              </div>
            </span>
          </div>
          <div className="OrderSummary">
            <img src={bck} alt="" className="summary_image"/>
            <h3 className="summary_head">Order summary</h3>
            <span className="summary_details">
              <p>1x {ticketType}</p>
              <span>
                <p>#{ticketPrice}</p>
              </span>
            </span>
            {/* <span className="summary_details">
              <p>2x VIP Ticket</p>
              <span>
                <p> ₦20,000</p>
              </span>
            </span> */}
            <span className="total_summary">
              <h3>Total</h3>
              <span>
                <h3>{'#' + ticketPrice}</h3>
              </span>
            </span>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default CheckOut;
