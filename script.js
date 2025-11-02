document.addEventListener('DOMContentLoaded',()=>{
const GAS='https://script.google.com/macros/s/AKfycbw8c4fjzl-rteNlO8z1V03T91EixcSUZ_E4xGlZE3yzx-xYIaL0yN7J-sMfntw3Jcfy/exec',q=s=>document.querySelector(s);
q('#pickupBtn').addEventListener('click',()=>q('#pickup').scrollIntoView({behavior:'smooth'}));
q('#contactScroll').addEventListener('click',()=>q('#contactUs').scrollIntoView({behavior:'smooth'}));
q('#clearBtn').addEventListener('click',()=>q('#pickupForm').reset());
async function sendToGAS(data){try{await fetch(GAS,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),mode:'no-cors'});showConfirm();}catch(e){alert('Error')}}
q('#pickupForm').addEventListener('submit',e=>{e.preventDefault();sendToGAS({formType:'pickup',name:q('#name').value,phone:q('#phone').value});});
function showConfirm(){q('#confirmPopup').style.display='flex';setTimeout(()=>q('#confirmPopup').style.display='none',2500);}
q('#waBtn').addEventListener('click',()=>window.open('https://wa.me/919821266799','_blank'));
});