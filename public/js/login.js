
const login=async (email,password)=>{
    console.log(email,password);
    try{
        const res=await axios.post('http://localhost:2000/api/v1/users/login',{
                email,
                password
    
        });
        if (res.data.status === 'success') {
            window.alert('success', 'Logged in successfully!');
            window.setTimeout(() => {
              location.assign('/');
            }, 1500);
          }
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