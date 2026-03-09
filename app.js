const API = "https://script.google.com/macros/s/AKfycbwHWaLXNoLrYKKilltXPRLvaQlVisw_fXSu1Jjx5kMsll8snWRq5vdkqqWwjwZDaL6S/exec";
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

/* EVENTOS */

document.getElementById("sesion").addEventListener("change",cargarAsistencia);
document.getElementById("grupo").addEventListener("change",cargarAsistencia);

/* CARGAR ASISTENCIA */

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

let grupo = document.getElementById("grupo").value;
let fecha = document.getElementById("sesion").value;
let cantidad = document.getElementById("cantidad").value;

let hoy = new Date();

let dia = String(hoy.getDate()).padStart(2,'0');
let mes = String(hoy.getMonth()+1).padStart(2,'0');
let anio = hoy.getFullYear();

let fechaHoy = dia+"/"+mes+"/"+anio;

if(fecha !== fechaHoy){

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

alert("Datos guardados correctamente");

/* LIMPIAR CAMPO */
document.getElementById("cantidad").value="";

/* RECARGAR DATOS */
cargarAsistencia();

});

}
