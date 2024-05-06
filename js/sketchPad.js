class SketchPad{
    constructor(container,size=400)
    {
        this.canvas=document.createElement("canvas");
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style=`
            background-color:white;
            box-shadow: 0px 0px 10px 2px black;
        `;
        container.appendChild(this.canvas);

        const lineBreak=document.createElement("br");
        container.appendChild(lineBreak);

        this.undoBtn=document.createElement("button");
        this.undoBtn.innerHTML="UNDO";
        container.appendChild(this.undoBtn);

        container.appendChild(document.createElement("br"));

        this.pal = ["black","red","yellow",
        "blue","green","violet","orange"];
        this.palIndex =0;
        
        this.colorBtn=document.createElement("button");
        this.colorBtn.innerHTML="black";
        container.appendChild(this.colorBtn);

        this.ctx = this.canvas.getContext("2d");
        this.reset();
        
        this.#addEventListeners();
    }

    reset(){
        this.colors = [];
        this.paths = [];
        this.isDrawing = false;
        this.#redraw();
    }

    #addEventListeners()
    {
        this.canvas.onmousedown=(evt)=>{
            const mouse = this.#getMouse(evt);
            this.paths.push([mouse]);
            this.colors.push(this.pal[this.palIndex]);
            this.isDrawing=true;
        }

        this.canvas.onmousemove=(evt)=>{
            if(this.isDrawing)
            {
                const mouse = this.#getMouse(evt);
                const lastPath = this.paths[this.paths.length -1];
                lastPath.push(mouse);
                this.#redraw();
            }
        }

        document.onmouseup=()=>{
            this.isDrawing=false;
        }

        this.canvas.ontouchstart=(evt)=>{
            const loc = evt.touches[0];
            this.canvas.onmousedown(loc);
        }

        this.canvas.ontouchmove=(evt)=>{
            const loc = evt.touches[0];
            this.canvas.onmousemove(loc);
        }

        document.ontouchend=()=>{
            document.onmouseup();
        }

        this.undoBtn.onclick=()=>{
            this.paths.pop();
            this.colors.pop();
            this.#redraw();
        }

        this.colorBtn.onclick=()=>{
            if(this.palIndex >= this.pal.length -1)
                this.palIndex = 0;
            else
                this.palIndex++;
            this.colorBtn.innerHTML=this.pal[this.palIndex];
        }
    }

    #redraw(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        draw.paths(this.ctx,this.paths,this.colors);
        if(this.paths.length>0){
            this.undoBtn.disabled=false;
        }
        else{
            this.undoBtn.disabled=true;
        }
    }

    #getMouse(evt){
        const rect=this.canvas.getBoundingClientRect();
        const mous = [evt.clientX - rect.left,
            evt.clientY - rect.top];
        return mous.map(Math.round);
    }

}