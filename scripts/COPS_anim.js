let canvas=document.querySelector(".anim")

let g=canvas.getContext("2d")
window.addEventListener("resize",function()
{
    g=canvas.getContext("2d")
    w=canvas.width=window.innerWidth+100
    h=canvas.height=window.innerHeight
})
const BLOCK_SIZE=160
const N_PTS=150
const COUPLING_RADIUS=100
let w=canvas.width=window.innerWidth+100
let h=canvas.height=window.innerHeight
class Point
{
    constructor(x,y,vx,vy,rad)
    {
        this.x=x;
        this.y=y;
        this.vx=vx;
        this.vy=vy;
        this.rad=rad;
    }
}
let points=[]
let area=new Array()
for(let i=0;i<w/BLOCK_SIZE;i++)
{
    area[i]=new Array()
    for(let j=0;j<h/BLOCK_SIZE;j++)
    {
        area[i][j]=new Map()
    }
}
function addPt(xc=Math.random()*w,yc=Math.random()*h)
{
    points.push(new Point(xc,yc,Math.random()*2*MAXVEL-MAXVEL,Math.random()*2*MAXVEL-MAXVEL,2*Math.random()+1))
}
const MAXVEL=1
for(let i=0;i<N_PTS;i++)
{
    addPt()
}

const mainHandler=(e)=>addPt(e.offsetX,e.offsetY)
document.body.addEventListener("pointerdown",(e)=>
{
    document.body.addEventListener("pointermove",mainHandler)
    for(let i=0;i<5;i++)
    mainHandler(e)
})
document.body.addEventListener("pointerup",(e)=>document.body.removeEventListener("pointermove",mainHandler))
const mouseloc={x:-100,y:-100}
canvas.addEventListener("pointermove",function(e)
{
    mouseloc.x=e.offsetX
    mouseloc.y=e.offsetY
})
let starcol=0,t=0

function painter()
{
    updatePoints()
    starcol=180+Math.sin(t)*60
    t+=0.01
    g.clearRect(0,0,w,h)
    g.fillStyle=`rgb(${starcol},${starcol},${starcol})`
    g.lineWidth=0.1
    points.forEach(point=>{
        
        try{
            let xx=Math.floor(point.x/BLOCK_SIZE)
            let yy=Math.floor(point.y/BLOCK_SIZE)
            const nearBlocks=[area[xx][yy],area[xx+1][yy],area[xx-1][yy],area[xx][yy+1],area[xx][yy-1],area[xx+1][yy+1],area[xx-1][yy-1],area[xx+1][yy-1],area[xx-1][yy+1]]
            nearBlocks.forEach(myBlock=>{
                if(!myBlock)
                return
                myBlock.forEach((value,_)=>
                {
                    if(value!=point)
                    {
                        //check if distance is less than 100
                        
                        if(dist(point,value)>COUPLING_RADIUS)
                        return
                        let shade=255-222*dist(point,value)/100
                        g.strokeStyle=`rgb(${shade},${shade},${shade})`
                        
                        g.beginPath()
                        g.moveTo(point.x,point.y)
                        g.lineTo(value.x,value.y)
                        g.stroke()
                    }
                })
            }
            )
            
        }
        catch(e){}
        
    })
    points.forEach(point=>{
        g.beginPath()
        g.arc(point.x,point.y,point.rad,0,Math.PI*2)
        g.fill()
    })
    
    window.requestAnimationFrame(painter)
}
painter()
function updatePoints()
{
    points.forEach(point=>{
        try{

            area[Math.floor(point.x/BLOCK_SIZE)][Math.floor(point.y/BLOCK_SIZE)].delete(point)
        }
        catch(e){}
        point.x+=point.vx;
        point.y+=point.vy;
        if(point.x>w||point.x<0)
        {
            point.vx=-point.vx;
        }
        if(point.y>h||point.y<0)
        {
            point.vy=-point.vy;
        }
        //results of some vector math i did
        let a=Math.pow(point.vx,2)+Math.pow(point.vy,2)
        let b=2* (  point.vx*(point.x-mouseloc.x)  +  point.vy*(point.y-mouseloc.y)  )
        let c=-Math.pow(COUPLING_RADIUS,2)
        let r1=(-b+Math.pow(b*b-4*a*c,0.5))/(2*a)
        let r2=(-b-Math.pow(b*b-4*a*c,0.5))/(2*a)
        let r
        if(Math.abs(r1)<Math.abs(r2))
        r=r1
        else
        r=r2
        if(dist(mouseloc,point)<COUPLING_RADIUS)
        {

            point.x=point.x+r*point.vx
            point.y=point.y+r*point.vy
            point.vx=-point.vx
            point.vy=-point.vy
        }
        try{

            area[Math.floor(point.x/BLOCK_SIZE)][Math.floor(point.y/BLOCK_SIZE)].set(point,point)
        }
        catch(e){}
    })
}


function dist(point,value)
{
    return Math.sqrt((point.x-value.x)*(point.x-value.x)+(point.y-value.y)*(point.y-value.y))
}