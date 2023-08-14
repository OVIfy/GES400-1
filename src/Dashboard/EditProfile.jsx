import "./EditProfile.css"
import plus1 from "../assets/plus1.svg"
import plus2 from "../assets/plus2.svg"
import default1 from "../assets/default1.png"
import default2 from "../assets/default2.jpeg"
import { useEffect, useState } from "react"
import { Form } from "react-router-dom"
import { Spinner } from "flowbite-react"

const EditProfile = ({isOpen, onClose, username, twitter, instagram, facebook, website, bio, phone, loading}) => {
    const [cover, setCover] = useState(default2)
    const [profile, setProfile] = useState(default1)
    const [didPictureChange, setDidPictureChange] = useState({cover : false, profile : false})
    const [formSubmitted, setFormSubmitted] = useState(false)

    useEffect(()=>{
        if(!isOpen) setFormSubmitted(false)
    }, [isOpen])


    function showCoverImage(e){
        setDidPictureChange({...didPictureChange, cover : true})
        setCover(URL.createObjectURL(e.target.files[0]))
    }

    function showProfileImage(e){
        setDidPictureChange({...didPictureChange, profile : true})
        setProfile(URL.createObjectURL(e.target.files[0]))
    }

    function afterFormSubmit(){
        setDidPictureChange({cover : false, profile : false})
        setFormSubmitted(true)
    }

  return (<>
    {isOpen && <Form method="POST" encType="multipart/form-data" className='edit_profile_page' onSubmit={afterFormSubmit}>
        <div className="overlays" onClick={onClose}>
            <div className="edit_profile_section" onClick={(e) => e.stopPropagation()}>
                <div className='eprofile_section1'>
                    <div className="profile_background">
                        <img className='back_profile_picture' alt="pic" src={cover}/>
                        <div className='dark_color'></div>
                        <label htmlFor="files"><img src={plus1} className="upload_icon" alt="icon"/></label>
                        <input onChange={showCoverImage} type="file" className="profile_file1" name="cover" id="files"/>
                    </div>
                    
                    <div className="profile_picture_div">
                        <img className='profile_picture' alt='pic' src={profile}/>
                        <div className='dark_color'></div>
                        <label htmlFor="profile"><img src={plus2} className="upload_icon" alt="icon"/></label>
                        <input onChange={showProfileImage} type="file" className="profile_file1" name="profile" id="profile"/>
                    </div>
                </div>
                <div className='edit_profile_section2'>
                    <div className="profile_form1">
                        <label>
                            User name
                            <input type="text" defaultValue={username} name="username" id="user_name"  className="profile_input" placeholder="Username" required/>
                        </label>
                        <label>
                            Phone number
                            <input defaultValue={phone} type="tel" name="phone" id="phone_number"  className="profile_input" placeholder="Your mobile number" />
                        </label>
                        <label>
                            Bio
                            <textarea defaultValue={bio} type="text" name="bio" id="bio_input"  className="bio_input" placeholder="Tell attendees who's organizing the event" />
                        </label>
                    </div>
                    <div className="profile_form2">
                    <label>
                            Website
                            <input defaultValue={website} type="url" name="website" id="website"  className="website_url" placeholder="Enter url"/>
                        </label>
                        <label>
                            Facebook
                            <input defaultValue={facebook} type="url" name="facebook" id="facebook"  className="facebook_url" placeholder="Enter url"/>
                        </label>
                        <label>
                            Twitter
                            <input defaultValue={twitter} type="url" name="twitter" id="twitter"  className="twitter_url" placeholder="Enter url"/>
                        </label>
                        <label>
                            Instagram
                            <input defaultValue={instagram} type="url" name="instagram" id="instagram"  className="instagram_url" placeholder="Enter url"/>
                        </label>
                    </div>
                </div>

                <input className="hidden" readOnly type="checkbox" checked={didPictureChange.cover} name="is_cover_choosen"/>
                <input className="hidden" readOnly type="checkbox" checked={didPictureChange.profile} name="is_profile_choosen"/>
                <div className="update_div"><button className='bg-white px-2 update_button'>Update {formSubmitted && <Spinner className="ml-2" size="sm"/>}</button></div>
            </div>
        </div>

        
    </Form>
    }
    </>
  )
}

export default EditProfile