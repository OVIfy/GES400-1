import "./CheckoutSuccess.css";
import success from "../assets/illustration.svg"
import close from "../assets/icon-close.svg"
import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */

const CheckoutSuccess = ({ onClose }) => {
  const navigate = useNavigate();

  function Close(){
    onClose()
    navigate('/dashboard/tickets')
  }

  return (
    <div className="CheckoutSuccess-container">
      <div className="CheckoutSuccess">
      <div className="close_div">
        <img className="close_img" src={close} alt="close" onClick={Close}/>
      </div>
        <h2 className="CheckoutSuccess_header">Checkout</h2>
        <img src={success} alt="" className="success_img"/>
        <h2 className="CheckoutSuccess_subheader">Order Placed</h2>
        <p className="CheckoutSuccess_text">Your order has been placed successfully</p>
        {/* <button onClick={onClose}>Close</button> */}
      </div>
    </div>
  );
};

export default CheckoutSuccess;
