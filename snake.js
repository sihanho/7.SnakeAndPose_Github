

class Snake{
    constructor(){
        this.len = 0
        this.body = []
        this.body[0] = createVector(floor(w/2), floor(h/2))
        this.xdir = 0
        this.ydir = 0
    }

    setDir(x,y){
        let currentPoDirX = this.xdir * (-1)
        let currentPoDirY = this.ydir * (-1)
        if(this.body.length > 1){
            if(x == currentPoDirX){
                return
            }
            if(y == currentPoDirY){ 
                return
            }
        }
        this.xdir = x
        this.ydir = y
    }

    update(){
        let head = this.body[this.body.length-1].copy()
        this.body.shift()
        //console.log("1. " + this.body)
            
        head.x += this.xdir
        head.y += this.ydir
        this.body.push(head)

        
        

        //console.log("2. " + this.body)
        // this.body[0].x += this.xdir
        // this.body[0].y += this.ydir
    }

    grow(){
        let head = this.body[this.body.length-1].copy()
        this.len ++
        this.body.push(head)
        document.getElementById("Score").innerHTML = this.len+1
    }

    eat(pos){
        let x = this.body[this.body.length-1].x
        let y = this.body[this.body.length-1].y
        if(x == pos.x && y == pos.y){
            this.grow()
            return true
        }
        return false
    }

    endGame(){
        let x = this.body[this.body.length-1].x
        let y = this.body[this.body.length-1].y
        if(x > w-1 || x < 0 || y > h-1 || y < 0){ //hit the wall
            print("hitwall")
            return true
        }
        for(let i = 0; i < this.body.length-1; i++){ //hit itself
            let part = this.body[i]
            //print(`${x},${y}||${part.x},${part.y}`)
            if(part.x == x && part.y == y){
                print("hit itself")
                return true
            }
        }
        return false
    }

    show(){
        for(let i = 0; i<this.body.length; i++){
            fill(0,255,0)
            noStroke()
            rect(this.body[i].x, this.body[i].y, 1, 1)
        }
    }
}