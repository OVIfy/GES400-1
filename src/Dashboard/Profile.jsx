import "./Profile.css"
import { getUserFromSession } from "../hooks/hooks"
import default1 from "../assets/default1.png"
import default2 from "../assets/default2.jpeg"
// import back from "../assets/bckgrnd.png"
import { GoPencil } from "react-icons/go";
import { AiOutlineLink, AiOutlineInstagram } from "react-icons/ai";
import { LiaFacebookSquare, LiaCalendarAlt } from "react-icons/lia";
import { FiTwitter } from "react-icons/fi";
import EditProfile from "./EditProfile";
import useSWR from "swr";
import { fetcher } from "../actions/actions";
import { useEffect, useState } from "react";
import { formatAMPM } from "../Utilities/utilis";
import Loading from "./Loading";
import { useActionData } from "react-router-dom";
import { Spinner } from "flowbite-react";

/* eslint-disable react/prop-types */

const Profile = () => {
  const [user, setUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data : User, isLoading } = useSWR(import.meta.env.VITE_SERVER_URL  + `/api/users/${getUserFromSession().id}?populate=*`, fetcher);

  const updatedUser = useActionData()

  useEffect(()=>{
    setUser(User)
  }, [User])

  useEffect(()=>{
    if(updatedUser) setUser(updatedUser.data?.data)
    setIsModalOpen(false)
  }, [updatedUser])

  const EditFunction = () => {
    // alert("clicked")
    // props.EditF("open")
    setIsModalOpen(true)
  }

  function closeModal(){
    setIsModalOpen(false)
  }

  if(user){
    console.log(user)
  }
  return (
    <>{ isLoading ? <Loading isopen={true}/> :
    <div className='profile'>
      <div className='profile_section'>
        <div className='profile_section1'>
            <img className='back_picture' alt="pic" src={user?.cover?.url || default2}/>
            <div className="profile_picture_div">
              <img className='profile_picture' alt='pic' src={user?.profile?.url || default1}/>
              <Spinner size="md"/>
            </div>
        </div>
        <div className='profile_section2'>
          <h2 className='person_name'>{user?.username}</h2>
          <span className='user_name'>@{user?.username}</span>
          <div className='link_and_join'>
              <a className='website' href={user?.website || '#'}><AiOutlineLink className='link_icon'/>{user?.website || (<span>www.your<span className="text-black">personal</span>website.domain</span>)}</a>
              <span className='join_date'><LiaCalendarAlt className='date_icon'/>joined {user?.createdAt ? formatAMPM(new Date(user.createdAt)) : '...'}</span>
          </div>
          <div className='bio'>
              {user?.bio || 'Your Bio goes here'}
          </div>
          <div className='socials'>
            <a href={user?.facebook || '#facebook link goes here'}><LiaFacebookSquare/></a>
            <a href={user?.instagram || '#instagram link goes here'}><AiOutlineInstagram/></a>
            <a href={user?.twitter || '#twitter link goes here'}><FiTwitter/></a>
          </div>
           <div className='edit_link' onClick={EditFunction}>
              <GoPencil className="pencil_icon"/>
              <span className='mini_edit_link' >Edit Profile</span>
          </div>
        </div>
      </div>
      <EditProfile 
        isOpen={isModalOpen} 
        onClose={closeModal}
        username={user?.username}
        bio={user?.bio}
        facebook={user?.facebook}
        twitter={user?.twitter}
        instagram={user?.instagram}
        website={user?.website}
        phone={user?.phone}
      />
    </div>}
    </>
  )
}

export default Profile