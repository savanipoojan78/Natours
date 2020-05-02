export const closeAlert=()=>{
    const el=document.querySelector('.alert');
    if(el) el.parentElement.removeChild(el);
}

export const showAlert=(type,message)=>{
    closeAlert();
    const markup=`<div class="alert alert--${type}">${message}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup);
    console.log('show alert-I');
    window.setTimeout(closeAlert,1500);
}