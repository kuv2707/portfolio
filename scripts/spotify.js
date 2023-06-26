var client_id = '5fe2644f61214899bdf2b0dc2f20234a';
var client_secret = 'a884e42736a3429298de55c9faf462e0';
const auth=btoa(client_id+":"+client_secret)
console.log(auth)
const fdata=new URLSearchParams()
fdata.append("grant_type","client_credentials")
fdata.append("client_id",client_id)
fdata.append("client_secret",client_secret)

fetch("https://accounts.spotify.com/api/token",{
    method:"POST",
    body:fdata,
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
})
.then(res=>res.json())
.then(data=>{
    getAlbum(data)
    getShow(data)
})

let albs=["1BUb9ayIoyy6T3iwMscDts","43mAHKPa4iB2er88lxD9Q8"]
let alb=albs[Math.floor(Math.random()*albs.length)]

function getAlbum(data)
{
  fetch("https://api.spotify.com/v1/albums/"+alb,{
    authorization:"Bearer "+data.access_token,
    method:"GET",
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+data.access_token
      },
    
  }).then(res=>res.json())
  .then(data=>{
    let k=document.querySelector("#link_album")
    k.querySelector("#title").innerHTML=data.name
    console.log(data.artists)
    k.querySelector("#artist").innerHTML=data.artists.map(a=>a.name).join(", ")
    k.querySelector("#cover").src=data.images[0].url
    k.querySelector("#cover").style.width="300px"
    k.querySelector("#cover").style.height="300px"
    k.querySelector("#cover").style.borderRadius="20px"
    k.href=data.external_urls.spotify

  })
}

let shows=["00h8GrMQbmSAfiNWYPLvhx","0sGGLIDnnijRPLef7InllD"]
function getShow(data)
{
    fetch("https://api.spotify.com/v1/shows/"+shows[Math.floor(Math.random()*shows.length)]+"?market=IN",{
    authorization:"Bearer "+data.access_token,
    method:"GET",
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+data.access_token
      },
    
  }).then(res=>res.json()).then(data=>{
    let k=document.querySelector("#link_show")
    k.querySelector("#title").innerHTML=data.name
    console.log(data)
    k.querySelector("#artist").innerHTML=data.publisher
    k.querySelector("#cover").src=data.images[0].url
    k.querySelector("#cover").style.width="300px"
    k.querySelector("#cover").style.height="300px"
    k.querySelector("#cover").style.borderRadius="20px"
    k.href=data.external_urls.spotify
    })
}