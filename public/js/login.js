
import axios from 'axios';
import {showAlert} from './alert';
export const login=async (email,password)=>{
    console.log(email,password);
    try{
        const res=await axios.post('http://localhost:2000/api/v1/users/login',{
                email,
                password
    
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(()=>{
                console.log('timecalled');
                location.assign('/');
            },1500);
          }
    }catch(err){
        //const data=JOSN.parse(err)
        console.log('err is',err.response);
        showAlert('error', err.response.data.err.errorMessage);
    }
}

