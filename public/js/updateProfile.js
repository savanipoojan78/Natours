import axios from 'axios';
import {showAlert} from './alert';

export const updateProfile=async (data,type)=>{

    try{
        const url=type==='password'?'http://localhost:2000/api/v1/users/updatePassword':'http://localhost:2000/api/v1/users/updateMe'
        const res=await axios.patch(url,data);
        if (res.data.status === 'success') {
            showAlert('success', `${type.toUppearCase()} Changed successfully!`);
        }
    }catch(err){
        //const data=JOSN.parse(err)
        console.log('err is',err.response);
        showAlert('error', err.response.data.err.message);
    }
}