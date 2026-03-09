const API = "https://script.google.com/macros/s/AKfycbxwEIuABDWScCvHR0wLw-yNGK961FYIH8-C7fwfTldwpva0yLAMvbmj9263eUbjvMSu/exec";
let pinGuardado = localStorage.getItem("pin");

if(pinGuardado){
mostrarApp();
}

function login(){

let pin=document.getElementById("pin").value;

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

/* SESIONES */

function cargarSesiones(){

fetch(API,{
method:"POST",
body:JSON.stringify({
action:"sesiones"
})
})
.then(r=>r.json())
.then(data=>{

let select=document.getElementById("sesion");

select.innerHTML='<option value="">Seleccione sesión</option>';

data.forEach(s=>{

let op=document.createElement("option");

op.value=s.fecha;
op.text=s.nombre+" ("+s.fecha+")";

select.appendChild(op);

});

});

}

/* GRUPOS */

function cargarGrupos(){

fetch(API,{
method:"POST",
body:JSON.stringify({
action:"grupos"
})
})
.then(r=>r.json())
.then(data=>{

let select=document.getElementById("grupo");

select.innerHTML='<option value="">Seleccione grupo</option>';

data.forEach(g=>{

let op=document.createElement("option");

op.value=g;
op.text=g;

select.appendChild(op);

});

});

}

/* EVENTOS */

document.getElementById("sesion").addEventListener("change",verificarDatos);
document.getElementById("grupo").addEventListener("change",verificarDatos);

function verificarDatos(){

let sesion=document.getElementById("sesion").value;
let grupo=document.getElementById("grupo").value;

if(!sesion || !grupo){
return;
}

cargarAsistencia();

}

/* CARGAR ASISTENCIA */

function cargarAsistencia(){

let fecha=document.getElementById("sesion").value;

fetch(API,{
method:"POST",
body:JSON.stringify({
action:"asistencia",
fecha:fecha
})
})
.then(r=>r.json())
.then(data=>{

let grupo=document.getElementById("grupo").value;

if(data[grupo]){

document.getElementById("cantidad").value=data[grupo];

document.getElementById("guardarBtn").innerText="ACTUALIZAR";

}else{

document.getElementById("cantidad").value="";

document.getElementById("guardarBtn").innerText="GUARDAR";

}

});

}

/* GUARDAR */

function guardar(){

let grupo=document.getElementById("grupo").value;
let fecha=document.getElementById("sesion").value;
let cantidad=document.getElementById("cantidad").value;

if(!grupo || !fecha){

alert("Seleccione sesión y grupo");
return;

}

let hoy=new Date();

let dia=String(hoy.getDate()).padStart(2,'0');
let mes=String(hoy.getMonth()+1).padStart(2,'0');
let anio=hoy.getFullYear();

let fechaHoy=dia+"/"+mes+"/"+anio;

if(fecha!==fechaHoy){

alert("Solo se puede registrar asistencia en la sesión de hoy");
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

if(data.status==="error"){

alert(data.mensaje);
return;

}

alert("Datos guardados correctamente");

/* RECARGAR DATOS */

cargarAsistencia();

});

}
