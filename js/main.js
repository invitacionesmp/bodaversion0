/* ====== CONFIGURACIÓN: edita aquí tus datos ====== */
const CONFIG = {
  fechaBoda: "2027-08-28T15:00:00",          // fecha y hora de la boda
  whatsapp: "5491112345678",                  // número que recibe las confirmaciones (código de país, sin + ni espacios)
  lugarMapa: "Hacienda Villa Amor, Valle Hermoso", // texto o enlace de Google Maps
  enlaceMapa: ""                              // opcional: pega aquí el enlace directo de Google Maps
};
/* ================================================= */
const $ = s => document.querySelector(s);
const toast = m => { const t = $("#toast"); t.textContent = m; t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 3500); };

// Cuenta regresiva
const ids = ["d","h","m","s"].map(k => $("#cd-"+k));
function cuenta(){
  let ms = Math.max(0, new Date(CONFIG.fechaBoda) - new Date());
  const v = [Math.floor(ms/864e5), Math.floor(ms/36e5)%24, Math.floor(ms/6e4)%60, Math.floor(ms/1e3)%60];
  v.forEach((n,i) => { const t = String(n).padStart(2,"0"); if(ids[i].textContent !== t){ ids[i].textContent = t; ids[i].classList.remove("tick"); void ids[i].offsetWidth; ids[i].classList.add("tick"); } });
}
cuenta(); setInterval(cuenta, 1000);

// Botón del mapa
$("#btnMapa").href = CONFIG.enlaceMapa || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.lugarMapa);

// Música (los navegadores exigen un toque del usuario para reproducir)
const audio = $("#musica"), bm = $("#btnMusica");
const estado = () => bm.classList.toggle("suena", !audio.paused);
bm.addEventListener("click", e => { e.stopPropagation(); audio.paused ? audio.play().catch(() => toast("Agrega tu canción en assets/music/musica.mp3")) : audio.pause(); });
audio.addEventListener("play", estado); audio.addEventListener("pause", estado);
["click","touchstart"].forEach(ev => addEventListener(ev, () => { if(audio.paused && !audio.dataset.i){ audio.dataset.i = 1; audio.play().catch(()=>{}); } }, { once:true, passive:true }));

// Efecto onda en botones
document.querySelectorAll(".btn").forEach(b => b.addEventListener("click", e => {
  const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height), s = document.createElement("span");
  s.className = "rip"; s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;
  b.appendChild(s); setTimeout(() => s.remove(), 600);
}));

// Aparición al hacer scroll
document.querySelectorAll(".titulo,.texto,.linea li,.lugar,.paleta,.foto-lugar,.foto-manos,form,.gracias,.cuenta,.tel").forEach(el => el.classList.add("rv"));
const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add("vis"); io.unobserve(e.target); } }), { threshold:.2 });
document.querySelectorAll(".rv").forEach(el => io.observe(el));

// Formulario → WhatsApp
$("#formRsvp").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target), nombre = $("#nombre").value.trim(), err = $("#error");
  if(!f.get("asiste")) return err.textContent = "Por favor, indica si podrás asistir.";
  if(nombre.length < 3) return err.textContent = "Escribe tu nombre y apellido.";
  err.textContent = "";
  const msg = `¡Hola! Soy ${nombre}.\n✔ Asistencia: ${f.get("asiste")}\n🥂 Bebida: ${f.get("bebida") || "Sin preferencia"}\n💌 Deseos: ${$("#deseos").value.trim() || "—"}`;
  toast("¡Gracias! Se abrirá WhatsApp para enviar tu respuesta 💌");
  setTimeout(() => window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank"), 900);
  e.target.reset();
});
