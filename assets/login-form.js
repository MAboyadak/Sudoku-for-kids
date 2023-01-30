/* 
*
*
 Suduko Game
*
*
*/

// LOGIN

if(localStorage.getItem('username')){
    localStorage.clear();
}

let username = document.querySelector('#username');
let nameErr = document.querySelector('[name=name-err]')
let submitBtn = document.querySelector('#submit-btn');
let loginForm = document.querySelector('form');

loginForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    if(login(username)){
        // console.log(username.value)
        window.location.href = "pages/gallery.html";
        window.localStorage.setItem('username',username.value.trim())
        return;
    }
    // console.log(false)
})