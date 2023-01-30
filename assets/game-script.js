/* 
*
*
 Suduko Game
*
*
*/

// GAME PAGE
if(!localStorage.getItem('gallery')){
    window.location.href = "gallery.html";
}

if(!localStorage.getItem('username')){
    window.location.href = "../login.html";
}


class Game{

    #currentBoxNumber;
    #currentBox;
    #interval_id;
    #grid = [];
    #randomImgsCreated = [];

    constructor(gridContainer,gallery,timerSpan,gridLength){
        this.gridContainer = gridContainer;
        // console.log(this.gridContainer);
        this.gallerySrcs = gallery;
        this.timerSpan = timerSpan;
        this.gridLength = gridLength;
        

        this.createGrid(this.gridContainer,gridLength);
        
        this.start = this.start.bind(this);
        document.querySelector('#start-btn').addEventListener('click',this.start)
    }

    setHeaderBoxes(header){
        let imgCollecton = header.querySelectorAll('img');
        for(let i in imgCollecton){
            if(imgCollecton[i].nodeName === "IMG"){
                imgCollecton[i].src = this.gallerySrcs[i];
            }
        }
    }

    start(){
        // console.log(this);
        let counter = 60

        this.#removeFocus();
        // document.querySelector('.col .box').className = 'active';

        this.#currentBoxNumber = 1;
        this.#currentBox = document.getElementById('1');

        this.#setKeyListener();
        this.#randomize();

        // console.log(this.#randomImgsCreated);

        // if first box is randomized make the default active in 2nd box
        if(this.#randomImgsCreated[0]['index'] == 0){
            this.#currentBoxNumber = 2;
            this.#currentBox = document.getElementById('2');
        }

        document.getElementById(`${this.#currentBoxNumber}`).className = 'active';


        let id = setInterval(()=>{

            counter--;
            this.timerSpan.textContent = counter;

            if(counter == 0){

                clearInterval(id);
                this.timerSpan.textContent = "00"

                if(this.#checkWin()){
                    this.#alertWin();
                }else{
                    this.#alertLose();
                }

            }
        },1000);
        this.#interval_id = id;

        document.querySelector('#start-btn').removeEventListener('click',this.start)
    }

    #randomize(){

        let quartersOrderArr = [
            [1,2,5,6],
            [3,4,7,8],
            [9,10,13,14],
            [11,12,15,16]
        ];


        let normalOrderArr = [
            [1,2,3,4],
            [5,6,7,8],
            [9,10,11,12],
            [13,14,15,16]
        ];

        function getRandomItem(arr) {

            // get random index value
            const randomIndex = Math.floor(Math.random() * arr.length);
        
            // get random item
            const item = arr[randomIndex];
        
            return item;
        }

        let rndImg;
        
        let boxId;
        
        let normalArrIndex;
        let normalIndexPos;
        // let normalIndexVal;

        for(let row in this.#grid){
            
            
            rndImg = Math.ceil(Math.random()*4);
            boxId = getRandomItem(quartersOrderArr[row]); // then boxid which will be assigned the image in html
        
            function assignNormal(){ // to get the normal values of boxid
                for(let j in normalOrderArr){ // loop in normal order arrays

                    if(normalOrderArr[j].includes(boxId)){ // check if any includes the boxid and assign normal values 
                        normalArrIndex = j;
                        normalIndexPos = normalOrderArr[j].indexOf(boxId);
                        // normalIndexVal = normalOrderArr[j][normalIndexPos];
                    }

                }
            }

            assignNormal();

            // console.log(normalArrIndex,normalIndexPos,normalIndexVal)
            // console.log(this.#randomImgsCreated);
            // check existence 
            for(let j=0; j<this.#randomImgsCreated.length; j++){
                
                if(this.#randomImgsCreated[j]['row'] == normalArrIndex && this.#randomImgsCreated[j]['img'] == rndImg){
                    
                    console.log(`matching in row- :(image): ${rndImg} , (row): ${normalArrIndex} , (col):${normalIndexPos}`)
                    
                    rndImg = Math.ceil(Math.random()*4);
                    boxId = getRandomItem(quartersOrderArr[row]);
                    
                    assignNormal();
                    console.log(`replaced with - (image): ${rndImg} , (row): ${normalArrIndex} , (col):${normalIndexPos}`)
                    
                    j=-1;
                    continue;
                }

                if(this.#randomImgsCreated[j]['index'] == normalIndexPos && this.#randomImgsCreated[j]['img'] == rndImg){
                    console.log(`matching in Col- :(image): ${rndImg} , (row): ${normalArrIndex} , (col):${normalIndexPos}`)
                    
                    rndImg = Math.ceil(Math.random()*4);
                    boxId = getRandomItem(quartersOrderArr[row]);
                    
                    assignNormal();
                    console.log(`replaced with - (image): ${rndImg} , (row): ${normalArrIndex} , (col):${normalIndexPos}`)
                    
                    j=-1;
                    continue;
                }
            }

            document.getElementById(`${boxId}`).parentElement.classList.add('random')
            document.getElementById(`${boxId}`).querySelector('img').src = this.gallerySrcs[rndImg-1];
            
            this.#grid[normalArrIndex][normalIndexPos] = rndImg;
            
            this.#randomImgsCreated.push({'row':normalArrIndex,'index':normalIndexPos,'img':rndImg});


        }
    }



    // Create grid Method

    createGrid(gridContainer,rowsNumber){
        // console.log(this.#grid)
        if(rowsNumber>9 || rowsNumber<3){
            alert('Rows number can\'nt be less than 4 or more than 9');
            rowsNumber = 4;
        }
        let id = 0;

        for(let row=1; row<=rowsNumber; row++)
        {
            let newRow = document.createElement('div');
            newRow.className = 'row';

            for(let col=1; col<=rowsNumber; col++){
                id++

                let newCol = document.createElement('div')
                newCol.className = 'col';

                let newBox = document.createElement('div')
                newBox.className = 'box';
                newBox.id = `${id}`;

                let newImg = document.createElement('img')
                // newImg.src=;
                // newImg.style.border = "none";
                // newImg.style.outline = "none";

                newBox.append(newImg);
                newCol.append(newBox);
                newRow.append(newCol);
            }

            this.#grid.push([]);
            // console.log(this.#grid)

            gridContainer.append(newRow);
        }
    }


    #setKeyListener(){
        this.moveFocus = this.moveFocus.bind(this);
        document.addEventListener('keydown',this.moveFocus)
        // this.moveFocus = this.moveFocus.bind(this);
        // (e)=>{
        //     //e.key: ArrowRight, ArrowDown, ArrowLeft, ArrowUp
        //     this.moveFocus(e.key);
        // }
    }

    moveFocus(key){
        key=key.key;
        // console.log(this)
        let gridCells = this.#grid.length * this.#grid.length; // the actual length of grid

        switch(key){
            case 'ArrowRight':

                this.#removeFocus();
                
                // console.log('right')
                this.#currentBoxNumber += 1;

                if(this.#currentBoxNumber > gridCells){
                    this.#currentBoxNumber = 1;
                    this.#currentBox = document.getElementById(this.#currentBoxNumber);
                }

                this.#moveIfExistInRandomArr('right');


                this.#currentBox = document.getElementById(this.#currentBoxNumber);

                

                this.#currentBox.className = 'active';                

                break;

            case 'ArrowLeft':

                this.#removeFocus();
                // console.log('left')

                
                this.#currentBoxNumber -= 1;
                if(this.#currentBoxNumber < 1){
                    this.#currentBoxNumber = gridCells;
                    this.#currentBox = document.getElementById(this.#currentBoxNumber);
                }
                this.#moveIfExistInRandomArr('left');
                
                this.#currentBox = document.getElementById(this.#currentBoxNumber);

                

                this.#currentBox.className = 'active';

                break;

            case 'ArrowUp':

                this.#removeFocus();

                this.#currentBoxNumber -= this.#grid.length;

                this.#moveIfExistInRandomArr('up');

                this.#currentBox = document.getElementById(this.#currentBoxNumber);

                if(this.#currentBoxNumber < 1){
                    this.#currentBoxNumber += this.#grid.length * 4;
                    this.#moveIfExistInRandomArr('up');

                    this.#currentBox = document.getElementById(this.#currentBoxNumber);
                }

                this.#currentBox.className = 'active';

                break;

            case 'ArrowDown':

                this.#removeFocus();

                
                this.#currentBoxNumber += this.#grid.length;
                this.#moveIfExistInRandomArr('down');

                this.#currentBox = document.getElementById(this.#currentBoxNumber);

                if(this.#currentBoxNumber > gridCells){
                    this.#currentBoxNumber -= this.#grid.length * 4;
                    this.#moveIfExistInRandomArr('down');

                    this.#currentBox = document.getElementById(this.#currentBoxNumber);
                }

                this.#currentBox.className = 'active';
            
                break;

        default:
            this.#updateBoxImage(key);
        }
    }

    #moveIfExistInRandomArr(direction){

        let box_corresponding_value_in_arr; //the corresponding calculated value to the one in the random_imgs_created 
        let gridCells = this.#grid.length * this.#grid.length;

        for(let i=0; i < this.#randomImgsCreated.length; i++){

            box_corresponding_value_in_arr = ((parseInt(this.#randomImgsCreated[i]['row'])*this.#grid.length)+this.#randomImgsCreated[i]['index'])+1

            // console.log(box_corresponding_value_in_arr,this.#currentBoxNumber)

            if(box_corresponding_value_in_arr == this.#currentBoxNumber){
                if(direction == "right")
                {
                    // console.log('inside right')
                    this.#currentBoxNumber++;

                    if(this.#currentBoxNumber > gridCells){
                        this.#currentBoxNumber = 1;
                    }

                    return this.#moveIfExistInRandomArr('right')
                }
                else if(direction == 'left')
                {
                    // console.log('inside left')
                    this.#currentBoxNumber--;

                    if(this.#currentBoxNumber < 1){
                        this.#currentBoxNumber = gridCells;
                    }

                    return this.#moveIfExistInRandomArr('left')
                }
                else if(direction == 'up')
                {
                    this.#currentBoxNumber -= this.#grid.length;
                    return;
                }
                else
                {
                    this.#currentBoxNumber += this.#grid.length;
                    return;
                }
            }
        }
    
    }

    #updateBoxImage(key){
        
        if(key > 0 && key <= 4){
            this.#updateRowArr(key);
        }

        let gridCells = this.#grid.length * this.#grid.length;

        switch(key){
            case '1':
                this.#currentBox.querySelector('img').src = this.gallerySrcs[0];
                if(this.#getUpdatedBoxesCount() === gridCells){
                    
                    if(this.#checkWin()){
                            this.#alertWin();
                    }else{
                            this.#alertLose();
                    }
                }
                break;

            case '2':
                this.#currentBox.querySelector('img').src = this.gallerySrcs[1];
                if(this.#getUpdatedBoxesCount() === gridCells){
                    if(this.#checkWin()){
                        this.#alertWin();
                    }else{
                            this.#alertLose();
                    }
                }
                break;

            case '3':
                this.#currentBox.querySelector('img').src = this.gallerySrcs[2];
                if(this.#getUpdatedBoxesCount() === gridCells){
                    if(this.#checkWin()){
                        this.#alertWin();
                    }else{
                            this.#alertLose();
                    }
                }
                break;

            case '4':
                this.#currentBox.querySelector('img').src = this.gallerySrcs[3];
                if(this.#getUpdatedBoxesCount() === gridCells){
                    if(this.#checkWin()){
                        this.#alertWin();
                    }else{
                            this.#alertLose();
                    }
                }
                break;

            default:
                
        }
    }

    #checkWin(){
        // IF NOT FILLED WITHN 16 BOXES =>> LOST (FALSE)
        if(this.#getUpdatedBoxesCount() < this.gridLength * this.gridLength){
            return false;
        }

        // LOOP the Grid array (parent of Rows to iterate each row) itself
        for(let i = 0; i < this.#grid.length; i++){
            
            // check rows
            // iterate each row in grid rows
            for(let j=0; j < this.#grid.length; j++){
                
                for(let c=j+1; c<this.#grid.length; c++){
                
                    if(this.#grid[i][j] == this.#grid[i][c]){
                        return false;
                    }
                
                }

            }

            // check columns
            // iterate each column in grid columns
            for(let j=0; j < this.#grid.length; j++){
                
                for(let c=i+1; c<this.#grid.length; c++){
                
                    if(this.#grid[i][j] == this.#grid[c][j]){
                        return false;
                    }
                
                }

            }
        }
        // alert('you won')
        return true;
    }

    #alertWin(){
        document.removeEventListener('keydown',this.moveFocus);
        clearInterval(this.#interval_id);
        Swal.fire({
            title: 'Congratlations , You have Won ! Do you want play again ?',
            width: 600,
            padding: '3em',
            color: '#716add',
            // background: '#fff url(/images/trees.png)',
            backdrop: `
              rgb(193 198 65 / 43%)
              url("../images/golden-cat.gif")
              left top
              no-repeat`,
            confirmButtonText: 'Play again',
            cancelButtonText: 'No, Back Home',
            showCancelButton: true,
            showCloseButton: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.#handlePlayAgain()
            } else if (
              result.dismiss === Swal.DismissReason.cancel
            ) {
              window.location.href = "../login.html"
            }
        })
    }

    #alertLose(){
        document.removeEventListener('keydown',this.moveFocus);
        clearInterval(this.#interval_id)
        Swal.fire({
            title: 'Sorry , You have Lost ! Do you want play again ?',
            width: 600,
            padding: '3em',
            color: '#716add',
            backdrop: `
                rgb(235 24 24 / 40%)
                url("../images/lost.gif")
                left top
                no-repeat`,
            confirmButtonText: 'Play again',
            cancelButtonText: 'No, Back Home',
            showCancelButton: true,
            showCloseButton: false,
            }).then((result) => {
            if (result.isConfirmed) {
              this.#handlePlayAgain()
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                console.log('error cancelling');
                window.location.href = "../login.html"
            }
        })
    }

    #handlePlayAgain(){
        // console.log('again');
        this.#currentBoxNumber=1;
        this.#currentBox = '';
        this.#grid = [];
        this.#randomImgsCreated = [];

        this.gridContainer.innerHtml = ' ';
        this.timerSpan.textContent = "59"
        // console.log(this.gridContainer);
        this.gridContainer.innerHTML='';
        this.createGrid(this.gridContainer,this.gridLength)
        // this.#randomize();
        this.start(this.timerSpan);
    }

    #getUpdatedBoxesCount(){
        let boxChangedCount = 0;
        for(let i in this.#grid){
        
            for(let index in this.#grid[i]){
                boxChangedCount ++
            }

            // for(let index in this.#grid[i]){
            //     boxChangedCount ++
            // } 

            // for(let index in this.#grid[i]){
            //     boxChangedCount ++
            // } 

            // for(let index in this.#grid[i]){
            //     boxChangedCount ++
            // }
        
        }
        return boxChangedCount;
    }

    #updateRowArr(key){

        /*
        * 1.0135 || 3.458 || 4.781 each one means that its division calc is more than row length
        *  so it will (ceil) go to the next row
        */
       let rowNumber = Math.ceil(this.#currentBoxNumber / this.#grid.length); 


        /*
        * reminder of division is the index of row array ::
        * if row (which is same length of grid.length becuase its a square shape) is 9 and reminder 12/9 is 3
        * then it moves three indexes after end of row
        **/
        let rowIndex  = this.#currentBoxNumber % this.#grid.length;


        /* if box is the last box in the row then reminder will be 0 
        * which means rowIndex instead of 3 (for example if length is 3),
        * is gonna make it 0 which raise unexpected-behaviour  
        * so, if reminder is 0 make it = length (which euals the last col)
        */
        if(rowIndex === 0){
            rowIndex = this.#grid.length ;
        }
        // console.log(rowIndex)
        
        
        // UPDATE the grid array with the 1 2 3 4 (choosen gallery values)//
        this.#grid[rowNumber-1][rowIndex-1] = key;
        // console.log(rowIndex,rowNumber,this.#grid);
        
            
            /********* THE OLD CODE ***********/

            // for(let i=1; i<=this.#grid.length; i+=4){

                //if(this.#currentBoxNumber >= i && this.#currentBoxNumber <= i+3 ){
                //    this.#grid[0][this.#currentBoxNumber - 1] = key;
                //}
                
                // if(this.#currentBoxNumber >= 5 && this.#currentBoxNumber <= 8 ){
                //     this.#grid[this.#currentBoxNumber - 1 - 4] = key;
                // }

                // if(this.#currentBoxNumber >= 9 && this.#currentBoxNumber <= 12 ){
                //     this.#grid[this.#currentBoxNumber - 1 - 8] = key;
                // }

                // if(this.#currentBoxNumber >= 13 && this.#currentBoxNumber <= 16 ){
                //     this.#grid[this.#currentBoxNumber - 1 - 12] = key;
                // }
            // }
    }

    #removeFocus(){
        let allBoxes = document.querySelectorAll('.row .col div');
        allBoxes.forEach((box)=>{
            box.className = "box";
        })
    }
}
let timerSpan = document.querySelector('#timer');
let gridContainer = document.querySelector('#game-container'); 
let gallery = JSON.parse(localStorage.getItem('gallery') );

let game = new Game(gridContainer, gallery, timerSpan,4);

let header = document.querySelector('.header');
game.setHeaderBoxes(header);

// game.createGrid(gridContainer,3);