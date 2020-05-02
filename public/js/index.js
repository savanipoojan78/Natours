import '@babel/polyfill'
import {login,logout} from './login';
import {showMap} from './mapbox';
import {updateProfile} from './updateProfile';
import { showAlert } from './alert';

const loginForm=document.querySelector('.form--login');
const logoutButton =document.querySelector('.nav__el--logout');
const updateProfileButton=document.querySelector('.save-setting');
const updatePassword=document.querySelector('.btn--password-save');
if(loginForm){
    loginForm.addEventListener('submit',e=>{
        e.preventDefault();
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        login(email,password);
    })
}

const map=document.getElementById("map")
if(map){
    const locations=JSON.parse(map.dataset.locations);
    showMap(locations);
}
if(updateProfileButton){
    updateProfileButton.addEventListener('click',e=>{
        e.preventDefault();
        const email=document.getElementById('email').value;
        const name=document.getElementById('name').value;
        updateProfile({name,email},'data');
    })
}
if(updatePassword){
    updatePassword.addEventListener('click', async e=>{
        const passwordCurrent=document.getElementById('password-current').value;
        const password=document.getElementById('password').value;
        const passwordConfirm=document.getElementById('password-confirm').value;
        updatePassword.textContent='Processing ...'
        await updateProfile({password,passwordConfirm,passwordCurrent},'password');
        updatePassword.textContent='Save password'
        showAlert('success','You are logout ,Please Login again')
        //logout();

    })
}
if(logoutButton){
    logoutButton.addEventListener('click',e=>{
        logout();
    })
}