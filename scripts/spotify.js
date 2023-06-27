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



let albs=["1BUb9ayIoyy6T3iwMscDts","43mAHKPa4iB2er88lxD9Q8"]
let alb=albs[Math.floor(Math.random()*albs.length)]
let shows=["00h8GrMQbmSAfiNWYPLvhx","0sGGLIDnnijRPLef7InllD"]

const clientId = "5fe2644f61214899bdf2b0dc2f20234a"
const redirectUri = "https://kuv2707.github.io/portfolio/";
// const redirectUri = "http://localhost:5500/";
console.log(redirectUri)
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const token = localStorage.getItem("access_token");
if(!(!token || token == "undefined"))
{
    getAlbum(token)
    getShow(token)
    followSetup()
}
else if(!code)
{
    let codeVerifier = generateRandomString(128);
    localStorage.setItem('code_verifier', codeVerifier);
    
    generateCodeChallenge(codeVerifier).then(codeChallenge =>
    {
        let state = generateRandomString(16);
        let scope = 'user-read-private user-read-email user-follow-modify';
    
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
    localStorage.setItem('code', code);
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
        console.log("exchanged code for token",data.access_token)
        localStorage.setItem('access_token', data.access_token);
        getAlbum(data.access_token)
        getShow(data.access_token)
        followSetup()
    })

}

async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    }).catch(err=>{
        console.log(err)
    });

    return await result.json();
}




function getAlbum(access_token)
{
  fetch("https://api.spotify.com/v1/albums/"+alb,{
    authorization:"Bearer "+access_token,
    method:"GET",
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+access_token
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


function getShow(access_token)
{
    fetch("https://api.spotify.com/v1/shows/"+shows[Math.floor(Math.random()*shows.length)]+"?market=US",{
    authorization:"Bearer "+access_token,
    method:"GET",
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+access_token
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

function followSetup()
{
    let my_id="d658z0hizvq68jq71dem1iwtr"

    let follow=document.querySelector("#follow_spotify")
    
    fetch(`https://api.spotify.com/v1/me/following/contains?type=user&ids=${my_id}`,{
        headers:{
            'Authorization': 'Bearer '+token
        }
    }).then(k=>{console.log(k);return k.json()})
    .then(data=>{
        console.log("contains ",data)
        if(data[0])
        {
            follow.innerHTML="Following"
            follow.style.backgroundColor="grey"
        }
        else
        {
            follow.addEventListener("click",()=>{
                let params=new URLSearchParams()
                params.append("type","user")
                params.append("ids",my_id)
                let token=localStorage.getItem("access_token")
                console.log(token)
                fetch("https://api.spotify.com/v1/me/following?"+params,{
                    method:"PUT",
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+token
                    },
                    
                }).then(data=>{
                    if(data.status==204)
                    {
                        follow.innerHTML="Following"
                        follow.style.backgroundColor="grey"
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
            })
        }
    })
}

