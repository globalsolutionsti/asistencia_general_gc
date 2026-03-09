const API = "https://script.google.com/macros/s/AKfycbzhc9YUnKAGs63h1KLjIMUYFXmkGyjxqNjCS4xCHTnv-3Kicp99W70S-Ct33CEgyjkk/exec";

let pinGuardado = localStorage.getItem("pin");

if(pinGuardado){

mostrarApp();

}



function login(){

let pin = document.getElementById("pin").value;

fetch(API,{
method:"POST",
body:JSON.stringify({

action:"login",
pin:pin

})

})
.then(r=>r.json())
.then(data=>{

if(data.valid){

localStorage.setItem("pin",pin);

mostrarApp();

}else{

alert("PIN incorrecto");

}

});

}



function mostrarApp(){

document.getElementById("loginBox").style.display="none";
document.getElementById("appBox").style.display="block";

cargarSesiones();
cargarGrupos();

}



function cargarSesiones(){

fetch(API,{
method:"POST",
body:JSON.stringify({

action:"sesiones"

})
})
.then(r=>r.json())
.then(data=>{

let select = document.getElementById("sesion");

select.innerHTML="";

data.forEach(s=>{

let op = document.createElement("option");

op.value = s.fecha;
op.text = s.nombre + " ("+s.fecha+")";

select.appendChild(op);

});

cargarAsistencia();

});

}



function cargarGrupos(){

fetch(API,{
method:"POST",
body:JSON.stringify({

action:"grupos"

})
})
.then(r=>r.json())
.then(data=>{

let select = document.getElementById("grupo");

select.innerHTML="";

data.forEach(g=>{

let op = document.createElement("option");

op.value=g;
op.text=g;

select.appendChild(op);

});

});

}



document.getElementById("sesion").addEventListener("change",cargarAsistencia);



function cargarAsistencia(){

let fecha = document.getElementById("sesion").value;

fetch(API,{
method:"POST",
body:JSON.stringify({

action:"asistencia",
fecha:fecha

})
})
.then(r=>r.json())
.then(data=>{

let grupo = document.getElementById("grupo").value;

if(data[grupo]){

document.getElementById("cantidad").value = data[grupo];

document.getElementById("guardarBtn").innerText="Actualizar";

}else{

document.getElementById("cantidad").value="";

document.getElementById("guardarBtn").innerText="Guardar";

}

});

}



function guardar(){

let grupo = document.getElementById("grupo").value;
let fecha = document.getElementById("sesion").value;
let cantidad = document.getElementById("cantidad").value;

if(cantidad==""){

alert("Ingrese asistencia");
return;

}

fetch(API,{
method:"POST",
body:JSON.stringify({

action:"guardar",
grupo:grupo,
fecha:fecha,
cantidad:cantidad

})
})
.then(r=>r.json())
.then(data=>{

alert("Datos guardados");

document.getElementById("cantidad").value="";

});

}
