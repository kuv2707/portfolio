function generateRandomString(length)
{
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
async function generateCodeChallenge(codeVerifier)
{
    function base64encode(string)
    {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return base64encode(digest);
}

const clientId = "5fe2644f61214899bdf2b0dc2f20234a"
const redirectUri = "https://kuv2707.github.io/portfolio/";
console.log(redirectUri)
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if(!code)
{
    let codeVerifier = generateRandomString(128);
    localStorage.setItem('code_verifier', codeVerifier);
    
    generateCodeChallenge(codeVerifier).then(codeChallenge =>
    {
        let state = generateRandomString(16);
        let scope = 'user-read-private user-read-email';
    
        localStorage.setItem('code_verifier', codeVerifier);
    
        let args = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirectUri,
            state: state,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge
        });
    
        window.location = 'https://accounts.spotify.com/authorize?' + args;
    })

}
else
{
    console.log("got code", code)
    let codeVerifier = localStorage.getItem('code_verifier');
    let args = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
        client_id: clientId
    });
    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: args
    }).then(res => res.json())
    .then(data => {
        // fetchProfile(data.access_token).then(profile => console.log(profile))
        getAlbum(data)
        getShow(data)
    })

}

async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}



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
    console.log(data)
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
    fetch("https://api.spotify.com/v1/shows/"+shows[Math.floor(Math.random()*shows.length)]+"?market=US",{
    authorization:"Bearer "+data.access_token,
    method:"GET",
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+data.access_token
      },
    
  }).then(res=>res.json()).then(data=>{
    let k=document.querySelector("#link_show")
    console.log(data)
    k.querySelector("#title").innerHTML=data.name
    k.querySelector("#artist").innerHTML=data.publisher
    k.querySelector("#cover").src=data.images[0].url
    k.querySelector("#cover").style.width="300px"
    k.querySelector("#cover").style.height="300px"
    k.querySelector("#cover").style.borderRadius="20px"
    k.href=data.external_urls.spotify
    })
}