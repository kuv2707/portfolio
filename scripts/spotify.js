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
