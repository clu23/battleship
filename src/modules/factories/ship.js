

class Ship{
    constructor (size, name) {
        this.size=size;
        this.name=name;
        this.hits=0;
        this.sunk=false;
    }

    sunk(){
        this.sunk=true;
    }

    hit(){
        this.hits+=1;
        if (this.hits===this.length){
            this.sunk();
        }
    }

    isSunk(){
        return(this.sunk)
    }

    getName(){
        return(this.name)
    }
}

export default Ship