import axios, { formToJSON } from "axios";
import { getUserFromSession } from "../hooks/hooks";
// import { redirect } from "react-router";


{/* <input type="text" name="ref" value="api::restaurant.restaurant" />
<input type="text" name="refId" value="5c126648c7415f0c0ef1bccd" />
<input type="text" name="field" value="cover" />
<input type="file" name="cover" className=""/> */}

export async function createAction({request}) {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    console.log(updates)

    const startDate = new Date(updates.start_date + ' ' + updates.start_time);
    if(updates.stop_time && updates.stop_date){
        let stopDate = new Date(updates.stop_date + ' ' + updates.stop_time)
        updates.end = stopDate.toISOString()
    }

    updates.createdby =  { "connect" : [getUserFromSession().id]} //attaching id of user who created event
    updates.start = startDate.toISOString() //setting start date to form acceptable by strapi server
    updates.createdby.connect = [Number(getUserFromSession()?.id)]

    updates.tickettypes = []
    updates.live = false

        //massive code bruh, I deserve a pat on the back!!
        for (const [key, value] of Object.entries(updates)) {
            if(key.startsWith("tp") || key.startsWith("tt")){
                let index = key.split("_")[1]

                if(updates.tickettypes[index]){
                    updates.tickettypes[index][key.split("_")[0]] = value
                }
                else{
                    updates.tickettypes[index] = {}
                    updates.tickettypes[index][key.split("_")[0]] = value
                }
                delete(updates[key])
            }
        }
    
    try {
        const res = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/events', {data : updates}, {
            headers:{
                'Authorization' : 'Bearer ' + getUserFromSession().token
            }
        })

        //updating formData to submit and link image to event created above using id
        formData.append("ref", "api::event.event")
        formData.append("refId", res.data.data.id)
        formData.append("field", "cover")

        await axios.post(import.meta.env.VITE_SERVER_URL + '/api/upload', formData, {
            headers:{
                'Authorization' : 'Bearer ' + getUserFromSession().token
            }
        })

        // return redirect('/dashboard/manage')
        return true
    } catch (error) {
        console.log(error)
    }

    return null
}

// export async function createAction({request}) {
//     const formData = await request.formData();
//     const updates = Object.fromEntries(formData);
//     console.log(updates)

//     const startDate = new Date(updates.start_date + ' ' + updates.start_time);
//     if(updates.stop_time && updates.stop_date){
//         let stopDate = new Date(updates.stop_date + ' ' + updates.stop_time)
//         updates.end = stopDate.toISOString()
//     }

//     updates.createdby =  { "connect" : [getUserFromSession().id]} //attaching id of user who created event
//     updates.start = startDate.toISOString() //setting start date to form acceptable by strapi server
//     updates.createdby.connect = [Number(getUserFromSession()?.id)]
//     updates.tickettypes = []

//     //massive code bruh, I deserve a pat on the back!!
//     for (const [key, value] of Object.entries(updates)) {
//         if(key.startsWith("tp") || key.startsWith("tt")){
//             let index = key.split("_")[1]

//             if(updates.tickettypes[index]){
//                 updates.tickettypes[index][key.split("_")[0]] = value
//             }
//             else{
//                 updates.tickettypes[index] = {}
//                 updates.tickettypes[index][key.split("_")[0]] = value
//             }
//             delete(updates[key])
//         }
//     }
      
//     let data = {}
//     let formData2 = new FormData()

//     formData2.append("files.cover", formData.get("files"))
//     delete(updates.files)
//     formData2.append("data", JSON.stringify(updates))
//     const updates2 = Object.fromEntries(formData2);

//     console.log(updates2)

//     try {
//         await axios.post(import.meta.env.VITE_SERVER_URL + '/api/events', formData2, {
//             headers:{
//                 'Authorization' : 'Bearer ' + getUserFromSession().token
//             }
//         })

    
//         return true
//     } catch (error) {
//         console.log(error)
//     }

//     return null
// }




export async function updateUserAction({request}){
    const formData = await request.formData();

    let updates = Object.fromEntries(formData);

    if(!updates.is_cover_choosen) formData.delete("cover")
    if(!updates.is_profile_choosen) formData.delete("profile")

    updates = Object.fromEntries(formData);
    console.log(updates)

    try {
        let returnedUser =  await axios.post(import.meta.env.VITE_SERVER_URL + `/api/users-permissions/bob`, 
        formData, 
        {
            headers:{
                'Authorization' : 'Bearer ' + getUserFromSession().token
            }
        })

        return returnedUser
    } catch (error) {
        console.log(error)
        return null
    }
}



export const fetcher = (url) =>
    axios
      .get(url, { headers: { Authorization: "Bearer " + getUserFromSession()?.token } })
      .then((res) => res.data);

export async function handleHeartClick(isLiked, eventID){
    isLiked = !isLiked //note to self: react value for this will be delayed b/c itll only be updated after setState
    console.log(typeof(getUserFromSession().id))
    try {
        if(isLiked){
            await axios.put(import.meta.env.VITE_SERVER_URL + `/api/events/${eventID}`, 
            {data : {likedby : {connect : [getUserFromSession()?.id]} }}, { headers: { Authorization: "Bearer " + getUserFromSession()?.token } })
        }
        else{
            await axios.put(import.meta.env.VITE_SERVER_URL + `/api/events/${eventID}`, 
            {data : {likedby : {disconnect : [getUserFromSession()?.id]} }}, { headers: { Authorization: "Bearer " + getUserFromSession()?.token } })
        }
        

        return true
    } catch (error) {
        return false
    }
}

export async function checkoutAction({request}){
    try{
        const formData = await request.formData();
        let updates = Object.fromEntries(formData);

        //updating the submitted form with the user id and event id for relationship
        updates.event = {connect : [updates.eventID]}
        updates.user = {connect : [getUserFromSession()?.id]}
        delete updates.eventID
        // console.log(updates)
        //simulate payment and get response from paystack
        //note to self: we might as well use the transcation code as the ticket identifier
        const response = await payWithPaystack(updates.price)
        
        // creating ticket after payment is successfull
        if(response)
        await axios.post(import.meta.env.VITE_SERVER_URL + `/api/tickets`, {data : updates}, {headers: { Authorization: "Bearer " + getUserFromSession()?.token }})

        return true
    }catch(e){
        console.log(e)
        return null
    }

    // return null
}



async function payWithPaystack(price) {
    return new Promise(function(resolve, reject) {    
        let handler = PaystackPop.setup({
            key: 'pk_test_6c3ee31919315e74bb8f076a2789144c567526ff', // Replace with your public key
            email: 'ovifeanyichukwu@gmail.com',
            amount: Number(price || 100) * 100, // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
            // label: "Optional string that replaces customer email"
            onClose: function(){
              reject()

            },
            callback: function(response){
              // let message = 'Payment complete! Reference: ' + response.reference;
              // alert(message);
              resolve(response)
            }
          });
        
          handler.openIframe();
    });

  }

  