const observer= new IntersectionObserver(entries=>
{
    entries.forEach(entry=>{
        entry.target.classList.toggle("drop_down_anim",entry.isIntersecting)
    })
})
document.querySelectorAll('h1').forEach(h1=>observer.observe(h1))