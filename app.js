const API = "https://script.google.com/macros/s/AKfycbxwEIuABDWScCvHR0wLw-yNGK961FYIH8-C7fwfTldwpva0yLAMvbmj9263eUbjvMSu/exec";
/* LOGIN */

window.onload=function(){

let pinGuardado=localStorage.getItem("pin");

if(pinGuardado){

mostrarApp();

}else{

document.getElementById("loginBox").style.display="block";
document.getElementById("appBox").style.display="none";

}

}

/* LOGIN */

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

/* MOSTRAR APP */

function mostrarApp(){

document.getElementById("loginBox").style.display="none";
document.getElementById("appBox").style.display="block";

limpiarFormulario();

cargarSesiones();
cargarGrupos();

}

/* BOTON SALIR */

function salir(){

localStorage.removeItem("pin");

document.getElementById("appBox").style.display="none";
document.getElementById("loginBox").style.display="block";

document.getElementById("pin").value="";

}

/* LIMPIAR */

function limpiarFormulario(){

document.getElementById("sesion").innerHTML='<option value="">Seleccione sesión</option>';
document.getElementById("grupo").innerHTML='<option value="">Seleccione grupo</option>';
document.getElementById("cantidad").value="";

document.getElementById("guardarBtn").innerText="GUARDAR";

}

/* SESIONES */

function cargarSesiones(){

fetch(API,{
method:"POST",
body:JSON.stringify({action:"sesiones"})
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
body:JSON.stringify({action:"grupos"})
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

/* VERIFICAR SI EXISTE REGISTRO */

function verificarDatos(){

let sesion=document.getElementById("sesion").value;
let grupo=document.getElementById("grupo").value;

if(!sesion || !grupo){

document.getElementById("cantidad").value="";
document.getElementById("guardarBtn").innerText="GUARDAR";
return;

}

cargarAsistencia();

}

/* CARGAR DATOS */

function cargarAsistencia(){

let fecha=document.getElementById("sesion").value;
let grupo=document.getElementById("grupo").value;

fetch(API,{
method:"POST",
body:JSON.stringify({
action:"asistencia",
fecha:fecha
})
})
.then(r=>r.json())
.then(data=>{

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

mostrarMensaje("Datos guardados","success");

/* LIMPIAR FORMULARIO */

limpiarFormulario();

/* RECARGAR LISTAS */

cargarSesiones();
cargarGrupos();

});

}
function mostrarMensaje(texto,tipo){

const msg=document.getElementById("mensajeSistema");

msg.innerText=texto;

msg.className="mensaje show "+tipo;

setTimeout(()=>{

msg.className="mensaje";

},4000);

}
