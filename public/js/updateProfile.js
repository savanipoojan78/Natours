import axios from 'axios';
import {showAlert} from './alert';

export const updateProfile=async (name,email)=>{

    try{
        const res=await axios.patch('http://localhost:2000/api/v1/users/updateMe',{
            name,
            email
        });
        console.log('update res',res.data);
        if (res.data.status === 'success') {
            showAlert('success', 'Data Changed successfully!');
            window.setTimeout(()=>{
                location.assign('/me');
            },1000);
          }
    }catch(err){
        //const data=JOSN.parse(err)
        console.log('err is',err.response);
        showAlert('error', err.response.data.err.message);
    }
}