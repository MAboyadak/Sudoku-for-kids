/*  
*
*
Suduko Game
*
*
*/

// LOGIN FORM

function isEmpty(nameObj){
    if(!nameObj.value.trim()){
        return true;
    }
    return false;
}


function login(username){
    if(isEmpty(username)){
        nameErr.classList.remove('hidden');
        nameErr.textContent = "* Username Required"
        return false;
    }else if(!isNaN(username.value)){
        nameErr.classList.remove('hidden');
        nameErr.textContent = "* Username can't be number"
        return false;
    }
    else{
        nameErr.classList.add('hidden');
        nameErr.textContent = ""
        return true;
    }    
}