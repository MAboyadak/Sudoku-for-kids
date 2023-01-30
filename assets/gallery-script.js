/* 
*
*
 Suduko Game
*
*
*/


// GALLERY

if(!localStorage.getItem('username')){
    window.location.href = "../login.html";
}

localStorage.removeItem('gallery');

let galleryBtn = document.querySelectorAll('.gallery-btn');
let galleryImgArr;
let galleryImgSrcArr = [];

galleryBtn.forEach((btn)=>{
    btn.addEventListener('click',function(){

        galleryImgArr = this.parentElement.parentElement.getElementsByTagName('img');
        
        for(let i in galleryImgArr){
            if(galleryImgArr[i].nodeName === "IMG"){
                galleryImgSrcArr.push(galleryImgArr[i].src);
            }
        }

        localStorage.setItem('gallery',JSON.stringify(galleryImgSrcArr));
        window.location.href = "../pages/game.html";

    })
})