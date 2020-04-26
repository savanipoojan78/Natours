
const login=async (email,password)=>{
    console.log(email,password);
    try{
        const res=await axios.post('http://127.0.0.1:2000/api/v1/users/login',{
                email,
                password
    
        });
        console.log(res);
    }catch(err){
        console.log(err.response);
    }
}

document.querySelector('.form').addEventListener('submit',e=>{
    e.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    login(email,password);
})