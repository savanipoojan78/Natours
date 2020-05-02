import '@babel/polyfill'
import {login,logout} from './login';
import {showMap} from './mapbox';
import {updateProfile} from './updateProfile';

const loginForm=document.querySelector('.form--login');
const logoutButton =document.querySelector('.nav__el--logout');
const updateProfileButton=document.querySelector('.save-setting')
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
        updateProfile(name,email);
    })
}
if(logoutButton){
    logoutButton.addEventListener('click',e=>{
        logout();
    })
}