import '@babel/polyfill'
import {login,logout} from './login';
import {showMap} from './mapbox';

const loginForm=document.querySelector('.form');
const logoutButton =document.querySelector('.nav__el--logout');
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
if(logoutButton){
    logoutButton.addEventListener('click',e=>{
        logout();
    })
}