function toggleMenu(){

document
.querySelector(".sidebar")
.classList.toggle("active");

}

document.addEventListener(

"DOMContentLoaded",

()=>{

let page=
window.location.pathname
.split("/")
.pop();

document
.querySelectorAll(".sidebar a")
.forEach(link=>{

if(link.getAttribute("href")===page){

link.classList.add("active");

}

});

});