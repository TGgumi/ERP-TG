// src/ERP.jsx — Shell principal del ERP
import { useState, createContext } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { OFS_INIT, NCS_INIT, MANT_INIT, CTRL_INIT, MAQUINAS } from "./datos";

import Gerencia       from "./modulos/Gerencia";
import Produccion     from "./modulos/Produccion";
import Calidad        from "./modulos/Calidad";
import OficinaTecnica from "./modulos/OficinaTecnica";
import Laboratorio    from "./modulos/Laboratorio";
import Administracion from "./modulos/Administracion";
import Mantenimiento  from "./modulos/Mantenimiento";
import Financiero     from "./modulos/Financiero";
import VistaOperario  from "./modulos/VistaOperario";
import Logistica      from "./modulos/Logistica";
import PortalCliente  from "./modulos/PortalCliente";

export const ERPContext = createContext(null);

const NAV = [
  { d:"gerencia",       i:"◈", l:"Gerencia" },
  { sep:"Operaciones" },
  { d:"produccion",     i:"⚙", l:"Producción" },
  { d:"calidad",        i:"✓", l:"Calidad" },
  { d:"otecnica",       i:"◧", l:"Oficina Técnica" },
  { d:"laboratorio",    i:"⬡", l:"Laboratorio" },
  { sep:"Gestión" },
  { d:"administracion", i:"◉", l:"Administración" },
  { d:"mantenimiento",  i:"◌", l:"Mantenimiento" },
  { d:"financiero",     i:"€", l:"Financiero" },
  { d:"logistica",      i:"📦", l:"Logística" },
  { sep:"Planta" },
  { d:"operarios",      i:"⬟", l:"Vista Operarios" },
];

const MODULOS = {
  gerencia:       { comp: Gerencia,       titulo: "Gerencia" },
  produccion:     { comp: Produccion,     titulo: "Producción" },
  calidad:        { comp: Calidad,        titulo: "Calidad" },
  otecnica:       { comp: OficinaTecnica, titulo: "Oficina Técnica" },
  laboratorio:    { comp: Laboratorio,    titulo: "Laboratorio" },
  administracion: { comp: Administracion, titulo: "Administración" },
  mantenimiento:  { comp: Mantenimiento,  titulo: "Mantenimiento" },
  financiero:     { comp: Financiero,     titulo: "Financiero · CP2025" },
  logistica:      { comp: Logistica,      titulo: "Logística — APQs" },
  operarios:      { comp: VistaOperario,  titulo: "Vista Operarios" },
};


// ═══════════════════════════════════════════════════════════════════
// SISTEMA DE MEJORAS — Reportar, gestionar y trazar
// ═══════════════════════════════════════════════════════════════════
const TIPOS_REPORTE    = ["Mejora","Error / Bug","Propuesta","Otro"];
const PRIORIDADES      = ["Baja","Media","Alta","Urgente"];
const ESTADOS_MEJORA   = ["Pendiente","En análisis","En desarrollo","Implementado","Rechazado"];
const RESPONSABLES     = ["J. Torres (Admin)","J. García","M. Torres","A. Martín","P. Ramos","D. Gil","Sin asignar"];

const PRIO_STYLE = {
  Baja:    { bg:"#f9fafb", tx:"#6b7280", bd:"#e5e7eb" },
  Media:   { bg:"#eff6ff", tx:"#1d4ed8", bd:"#93c5fd" },
  Alta:    { bg:"#fffbeb", tx:"#92400e", bd:"#fde68a" },
  Urgente: { bg:"#fef2f2", tx:"#b91c1c", bd:"#fca5a5" },
};
const EST_STYLE = {
  "Pendiente":      { bg:"#f1f5f9", tx:"#64748b",  bd:"#cbd5e1",  icon:"⏳" },
  "En análisis":    { bg:"#eff6ff", tx:"#1d4ed8",  bd:"#93c5fd",  icon:"🔍" },
  "En desarrollo":  { bg:"#fffbeb", tx:"#92400e",  bd:"#fde68a",  icon:"⚙" },
  "Implementado":   { bg:"#f0fdf4", tx:"#166534",  bd:"#86efac",  icon:"✓" },
  "Rechazado":      { bg:"#fef2f2", tx:"#b91c1c",  bd:"#fca5a5",  icon:"✕" },
};

// ─── MODAL REPORTAR MEJORA (usuario) ─────────────────────────────
function ModalReportarMejora({ modulo, dept, onClose, onGuardar, total }) {
  const [form, setForm] = useState({
    tipo: "Mejora", prioridad: "Media",
    titulo:"", donde:"", descripcion:"", propuesta:"", autor:"",
    foto: null, fotoNombre:"",
  });
  const ff = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const MI = { border:"1.5px solid #d1d5db",borderRadius:8,padding:"8px 11px",fontSize:13,color:"#111827",background:"#fff",outline:"none",width:"100%",boxSizing:"border-box" };

  function handleFoto(e){
    const f=e.target.files[0];
    if(!f)return;
    const r=new FileReader();
    r.onload=ev=>setForm(p=>({...p,foto:ev.target.result,fotoNombre:f.name}));
    r.readAsDataURL(f);
  }

  function enviar(){
    if(!form.titulo.trim()||!form.descripcion.trim())return;
    const ahora = new Date();
    onGuardar({
      id: `MEJ-${String(total+1).padStart(3,"0")}`,
      ...form,
      modulo, dept,
      fecha: ahora.toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"}),
      hora:  ahora.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),
      ts: ahora.getTime(),
      estado: "Pendiente",
      responsable: "Sin asignar",
      comentarios: [],
      historial: [{ ts: ahora.getTime(), accion:"Reporte creado", usuario: form.autor||"Usuario", estado:"Pendiente" }],
    });
  }

  const canSend = form.titulo.trim() && form.descripcion.trim();

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,padding:16}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:14,width:580,maxWidth:"98%",maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 25px 60px rgba(0,0,0,.3)",overflow:"hidden"}}>

        {/* Header */}
        <div style={{padding:"16px 20px",borderBottom:"1px solid #f3f4f6",background:"#fafafa",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexShrink:0}}>
          <div>
            <div style={{fontWeight:700,fontSize:15,color:"#111827"}}>💡 Reportar mejora / incidencia</div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>
              Módulo: <b style={{color:"#1d4ed8"}}>{modulo}</b> · Se enviará al administrador con contexto completo
            </div>
          </div>
          <button onClick={onClose} style={{background:"#f3f4f6",border:"none",cursor:"pointer",width:30,height:30,borderRadius:"50%",fontSize:16,color:"#6b7280",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>

        {/* Body */}
        <div style={{flex:1,overflowY:"auto",padding:"18px 20px",display:"flex",flexDirection:"column",gap:12}}>

          {/* Tipo + Prioridad */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em"}}>Tipo de reporte</label>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {TIPOS_REPORTE.map(t=>(
                  <button key={t} onClick={()=>setForm(p=>({...p,tipo:t}))} style={{padding:"6px 10px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:form.tipo===t?700:500,border:`1.5px solid ${form.tipo===t?"#2563eb":"#e5e7eb"}`,background:form.tipo===t?"#eff6ff":"#fff",color:form.tipo===t?"#1d4ed8":"#6b7280"}}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em"}}>Prioridad percibida</label>
              <div style={{display:"flex",gap:5}}>
                {PRIORIDADES.map(p=>{const s=PRIO_STYLE[p];return(
                  <button key={p} onClick={()=>setForm(f=>({...f,prioridad:p}))} style={{flex:1,padding:"7px 4px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:form.prioridad===p?700:500,border:`1.5px solid ${form.prioridad===p?s.bd:"#e5e7eb"}`,background:form.prioridad===p?s.bg:"#fff",color:form.prioridad===p?s.tx:"#9ca3af"}}>{p}</button>
                );})}
              </div>
            </div>
          </div>

          {/* Título */}
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em"}}>Título <span style={{color:"#ef4444"}}>*</span></label>
            <input value={form.titulo} onChange={ff("titulo")} style={MI} placeholder="Resume en una frase qué hay que mejorar o qué falla…"/>
          </div>

          {/* Dónde */}
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em"}}>¿Dónde ocurre? — punto concreto</label>
            <input value={form.donde} onChange={ff("donde")} style={MI} placeholder="ej. Máquina TWIN44, formulario de NC, tab de Planificación, almacén…"/>
          </div>

          {/* Descripción */}
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em"}}>Descripción del problema / situación actual <span style={{color:"#ef4444"}}>*</span></label>
            <textarea value={form.descripcion} onChange={ff("descripcion")} rows={3} style={{...MI,resize:"vertical",fontFamily:"inherit"}} placeholder="Describe con detalle qué ocurre, qué falla o qué podría mejorarse…"/>
          </div>

          {/* Propuesta */}
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em"}}>Propuesta de solución (opcional)</label>
            <textarea value={form.propuesta} onChange={ff("propuesta")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}} placeholder="¿Cómo crees que se podría resolver?"/>
          </div>

          {/* Foto + Autor */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em"}}>Captura / foto (opcional)</label>
              <label style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",border:"2px dashed #d1d5db",borderRadius:8,cursor:"pointer",background:"#f9fafb"}}>
                <input type="file" accept="image/*" onChange={handleFoto} style={{display:"none"}}/>
                <span style={{fontSize:18}}>📷</span>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:"#374151"}}>{form.fotoNombre||"Adjuntar imagen"}</div>
                  <div style={{fontSize:10.5,color:"#9ca3af"}}>JPG, PNG, captura de pantalla</div>
                </div>
                {form.foto&&<span style={{marginLeft:"auto",fontSize:10,color:"#166534",fontWeight:700}}>✓</span>}
              </label>
              {form.foto&&<img src={form.foto} alt="preview" style={{width:"100%",maxHeight:80,objectFit:"cover",borderRadius:7,border:"1px solid #e5e7eb"}}/>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em"}}>Tu nombre (opcional)</label>
              <input value={form.autor} onChange={ff("autor")} style={MI} placeholder="ej. J. García, Operario turno mañana…"/>
              <div style={{marginTop:4,padding:"8px 10px",background:"#f0fdf4",border:"0.5px solid #86efac",borderRadius:7,fontSize:11,color:"#166534"}}>
                ✓ Contexto capturado automáticamente:<br/>
                <span style={{fontFamily:"monospace",fontSize:10}}>Módulo: {modulo} · Fecha: {new Date().toLocaleDateString("es-ES")} · Hora: {new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{padding:"14px 20px",borderTop:"1px solid #f3f4f6",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fafafa",flexShrink:0}}>
          <span style={{fontSize:11,color:"#9ca3af"}}>Módulo, fecha y hora se adjuntan automáticamente</span>
          <div style={{display:"flex",gap:10}}>
            <button onClick={onClose} style={{background:"transparent",border:"1px solid #d1d5db",color:"#374151",padding:"7px 16px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>Cancelar</button>
            <button onClick={enviar} disabled={!canSend} style={{background:canSend?"#2563eb":"#9ca3af",color:"#fff",border:"none",padding:"7px 20px",borderRadius:7,cursor:canSend?"pointer":"not-allowed",fontSize:12,fontWeight:700,opacity:canSend?1:.7}}>
              💡 Enviar reporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PANEL ADMIN DE MEJORAS (en Gerencia via contexto) ────────────
export function PanelMejoras({ mejoras, setMejoras }) {
  const [filtMod,   setFiltMod]   = useState("Todos");
  const [filtPrio,  setFiltPrio]  = useState("Todas");
  const [filtEst,   setFiltEst]   = useState("Todos");
  const [filtTipo,  setFiltTipo]  = useState("Todos");
  const [selId,     setSelId]     = useState(null);
  const [nuevoComentario, setNuevoComentario] = useState("");

  const mej = mejoras.find(m=>m.id===selId);
  const modulos = ["Todos",...new Set(mejoras.map(m=>m.modulo))];

  let vis = mejoras;
  if(filtMod!=="Todos")  vis=vis.filter(m=>m.modulo===filtMod);
  if(filtPrio!=="Todas") vis=vis.filter(m=>m.prioridad===filtPrio);
  if(filtEst!=="Todos")  vis=vis.filter(m=>m.estado===filtEst);
  if(filtTipo!=="Todos") vis=vis.filter(m=>m.tipo===filtTipo);

  function actualizarCampo(id, campo, valor){
    const ahora = new Date();
    setMejoras(p=>p.map(m=>{
      if(m.id!==id) return m;
      const hist = [...(m.historial||[]),{
        ts: ahora.getTime(),
        accion: `${campo==="estado"?"Estado":campo==="responsable"?"Responsable":"Campo"} → ${valor}`,
        usuario:"Administrador", estado: campo==="estado"?valor:m.estado,
      }];
      return {...m,[campo]:valor,historial:hist};
    }));
  }

  function enviarComentario(id){
    if(!nuevoComentario.trim())return;
    const ahora=new Date();
    setMejoras(p=>p.map(m=>{
      if(m.id!==id)return m;
      const com={ts:ahora.getTime(),texto:nuevoComentario.trim(),autor:"Administrador",fecha:ahora.toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit"}),hora:ahora.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})};
      const hist=[...(m.historial||[]),{ts:ahora.getTime(),accion:`Comentario añadido`,usuario:"Administrador",estado:m.estado}];
      return {...m,comentarios:[...(m.comentarios||[]),com],historial:hist};
    }));
    setNuevoComentario("");
  }

  const pend  = mejoras.filter(m=>m.estado==="Pendiente").length;
  const anali = mejoras.filter(m=>m.estado==="En análisis").length;
  const impl  = mejoras.filter(m=>m.estado==="Implementado").length;
  const urg   = mejoras.filter(m=>m.prioridad==="Urgente"&&m.estado!=="Implementado"&&m.estado!=="Rechazado").length;

  if(mejoras.length===0) return(
    <div style={{textAlign:"center",padding:60,color:"#9ca3af",fontSize:14,background:"#f9fafb",borderRadius:12,border:"1px dashed #e5e7eb"}}>
      <div style={{fontSize:48,marginBottom:12}}>💡</div>
      Sin reportes de mejora todavía.<br/>
      <span style={{fontSize:12}}>Usa el botón azul flotante 💡 en cualquier pantalla del ERP para reportar.</span>
    </div>
  );

  return(
    <div style={{display:"flex",gap:14,height:"calc(100vh - 200px)",minHeight:500}}>
      {/* Panel izquierdo — lista */}
      <div style={{width:340,flexShrink:0,display:"flex",flexDirection:"column",gap:8}}>
        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
          {[
            {l:"Pendientes",v:pend,  c:"#92400e",bg:"#fffbeb",bd:"#fde68a"},
            {l:"En análisis",v:anali,c:"#1d4ed8",bg:"#eff6ff",bd:"#93c5fd"},
            {l:"Implementadas",v:impl,c:"#166534",bg:"#f0fdf4",bd:"#86efac"},
            {l:"🚨 Urgentes",v:urg,  c:"#b91c1c",bg:"#fef2f2",bd:"#fca5a5"},
          ].map(k=>(
            <div key={k.l} style={{background:k.bg,border:`1px solid ${k.bd}`,borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
              <div style={{fontSize:9,color:k.c,textTransform:"uppercase",letterSpacing:".05em",fontWeight:600,marginBottom:2}}>{k.l}</div>
              <div style={{fontSize:20,fontWeight:700,color:k.c}}>{k.v}</div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {["Todos",...ESTADOS_MEJORA].map(e=>{const s=EST_STYLE[e]||{};return(
              <button key={e} onClick={()=>setFiltEst(e)} style={{padding:"3px 8px",borderRadius:4,cursor:"pointer",fontSize:10,fontWeight:filtEst===e?700:400,border:`0.5px solid ${filtEst===e?(s.bd||"#93c5fd"):"#e5e7eb"}`,background:filtEst===e?(s.bg||"#eff6ff"):"#f9fafb",color:filtEst===e?(s.tx||"#1d4ed8"):"#6b7280"}}>{s.icon||""} {e}</button>
            );})}
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {["Todas",...PRIORIDADES].map(p=>{const s=PRIO_STYLE[p]||{};return(
              <button key={p} onClick={()=>setFiltPrio(p)} style={{padding:"3px 8px",borderRadius:4,cursor:"pointer",fontSize:10,fontWeight:filtPrio===p?700:400,border:`0.5px solid ${filtPrio===p?(s.bd||"#93c5fd"):"#e5e7eb"}`,background:filtPrio===p?(s.bg||"#eff6ff"):"#f9fafb",color:filtPrio===p?(s.tx||"#1d4ed8"):"#6b7280"}}>{p}</button>
            );})}
          </div>
          <select value={filtMod} onChange={e=>setFiltMod(e.target.value)} style={{border:"1px solid #e5e7eb",borderRadius:6,padding:"5px 8px",fontSize:11,color:"#374151",background:"#fff",outline:"none"}}>
            {modulos.map(m=><option key={m}>{m}</option>)}
          </select>
        </div>

        {/* Lista */}
        <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:5}}>
          {vis.map(m=>{
            const ps=PRIO_STYLE[m.prioridad]||PRIO_STYLE.Media;
            const es=EST_STYLE[m.estado]||EST_STYLE["Pendiente"];
            const act=selId===m.id;
            return(
              <div key={m.id} onClick={()=>setSelId(act?null:m.id)} style={{padding:"10px 12px",borderRadius:9,cursor:"pointer",border:`1.5px solid ${act?"#2563eb":ps.bd}`,borderLeft:`4px solid ${ps.tx}`,background:act?"#eff6ff":"#fff"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <span style={{fontFamily:"monospace",fontSize:10,fontWeight:600,color:act?"#1d4ed8":"#9ca3af"}}>{m.id}</span>
                  <div style={{display:"flex",gap:4,alignItems:"center"}}>
                    <span style={{fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:3,background:ps.bg,color:ps.tx,border:`0.5px solid ${ps.bd}`}}>{m.prioridad}</span>
                    <span style={{fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:3,background:es.bg,color:es.tx,border:`0.5px solid ${es.bd}`}}>{es.icon} {m.estado}</span>
                  </div>
                </div>
                <div style={{fontSize:12,fontWeight:600,color:"#111827",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.titulo}</div>
                <div style={{fontSize:10.5,color:"#6b7280",display:"flex",gap:6,flexWrap:"wrap"}}>
                  <span>{m.modulo}</span><span>·</span>
                  <span>{m.tipo}</span><span>·</span>
                  <span>{m.fecha} {m.hora}</span>
                  {m.autor&&<><span>·</span><span>{m.autor}</span></>}
                </div>
                {m.comentarios?.length>0&&<div style={{fontSize:9.5,color:"#9ca3af",marginTop:3}}>💬 {m.comentarios.length} comentario{m.comentarios.length>1?"s":""}</div>}
              </div>
            );
          })}
          {vis.length===0&&<div style={{textAlign:"center",padding:20,color:"#9ca3af",fontSize:12}}>Sin resultados con este filtro</div>}
        </div>
      </div>

      {/* Panel derecho — detalle */}
      {mej?(
        <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:0,border:"1px solid #e5e7eb",borderRadius:12,overflow:"hidden",background:"#fff"}}>
          {/* Header detalle */}
          <div style={{padding:"14px 18px",borderBottom:"1px solid #f3f4f6",background:"#fafafa",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                <span style={{fontFamily:"monospace",fontSize:11,fontWeight:700,color:"#9ca3af"}}>{mej.id}</span>
                <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,...PRIO_STYLE[mej.prioridad]}}>{mej.prioridad}</span>
                <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,...EST_STYLE[mej.estado]}}>{EST_STYLE[mej.estado]?.icon} {mej.estado}</span>
                <span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:"#f1f5f9",color:"#6b7280"}}>{mej.tipo}</span>
              </div>
              <div style={{fontSize:15,fontWeight:700,color:"#111827"}}>{mej.titulo}</div>
              <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>
                {mej.modulo} · {mej.fecha} {mej.hora}
                {mej.autor&&<span> · <b>{mej.autor}</b></span>}
              </div>
            </div>
          </div>

          {/* Cuerpo scrollable */}
          <div style={{flex:1,overflowY:"auto",padding:"14px 18px",display:"flex",flexDirection:"column",gap:12}}>

            {/* Gestión admin */}
            <div style={{background:"#f8fafc",borderRadius:10,padding:"12px 14px",border:"1px solid #e5e7eb"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:10}}>⚙ Gestión</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em"}}>Estado</label>
                  <select value={mej.estado} onChange={e=>actualizarCampo(mej.id,"estado",e.target.value)} style={{border:"1.5px solid #d1d5db",borderRadius:7,padding:"7px 10px",fontSize:12,color:"#111827",background:"#fff",outline:"none",cursor:"pointer"}}>
                    {ESTADOS_MEJORA.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em"}}>Responsable</label>
                  <select value={mej.responsable||"Sin asignar"} onChange={e=>actualizarCampo(mej.id,"responsable",e.target.value)} style={{border:"1.5px solid #d1d5db",borderRadius:7,padding:"7px 10px",fontSize:12,color:"#111827",background:"#fff",outline:"none",cursor:"pointer"}}>
                    {RESPONSABLES.map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>Descripción</div>
              {mej.donde&&<div style={{padding:"7px 10px",background:"#f1f5f9",borderRadius:7,fontSize:12,color:"#374151",marginBottom:6}}><span style={{fontWeight:600,color:"#6b7280"}}>Dónde: </span>{mej.donde}</div>}
              <div style={{padding:"10px 12px",background:"#f9fafb",borderRadius:8,fontSize:13,color:"#374151",lineHeight:1.6,border:"0.5px solid #e5e7eb"}}>{mej.descripcion}</div>
            </div>

            {mej.propuesta&&(
              <div>
                <div style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>Propuesta del usuario</div>
                <div style={{padding:"10px 12px",background:"#f0fdf4",borderRadius:8,fontSize:13,color:"#166534",lineHeight:1.6,border:"0.5px solid #86efac"}}>{mej.propuesta}</div>
              </div>
            )}

            {mej.foto&&(
              <div>
                <div style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>Captura adjunta</div>
                <img src={mej.foto} alt="adjunto" style={{width:"100%",maxHeight:200,objectFit:"cover",borderRadius:8,border:"1px solid #e5e7eb",cursor:"pointer"}}/>
              </div>
            )}

            {/* Comentarios internos */}
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>💬 Comentarios internos ({mej.comentarios?.length||0})</div>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:8}}>
                {(mej.comentarios||[]).map((com,i)=>(
                  <div key={i} style={{padding:"9px 12px",background:"#eff6ff",borderRadius:8,border:"0.5px solid #93c5fd"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:11,fontWeight:700,color:"#1d4ed8"}}>{com.autor}</span>
                      <span style={{fontSize:10,color:"#9ca3af"}}>{com.fecha} {com.hora}</span>
                    </div>
                    <div style={{fontSize:12,color:"#374151"}}>{com.texto}</div>
                  </div>
                ))}
                {(!mej.comentarios||mej.comentarios.length===0)&&<div style={{fontSize:12,color:"#9ca3af",fontStyle:"italic"}}>Sin comentarios todavía</div>}
              </div>
              <div style={{display:"flex",gap:8}}>
                <input value={nuevoComentario} onChange={e=>setNuevoComentario(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();enviarComentario(mej.id);}}}
                  placeholder="Añadir comentario interno…" style={{flex:1,border:"1.5px solid #d1d5db",borderRadius:7,padding:"7px 11px",fontSize:12,color:"#111827",background:"#fff",outline:"none"}}/>
                <button onClick={()=>enviarComentario(mej.id)} disabled={!nuevoComentario.trim()} style={{background:nuevoComentario.trim()?"#2563eb":"#9ca3af",color:"#fff",border:"none",padding:"7px 14px",borderRadius:7,cursor:nuevoComentario.trim()?"pointer":"not-allowed",fontSize:12,fontWeight:600}}>Enviar</button>
              </div>
            </div>

            {/* Historial */}
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>📋 Historial de cambios</div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {(mej.historial||[]).slice().reverse().map((h,i)=>{
                  const es=EST_STYLE[h.estado]||EST_STYLE["Pendiente"];
                  return(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"6px 0",borderBottom:"0.5px solid #f3f4f6"}}>
                      <span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:3,background:es.bg,color:es.tx,border:`0.5px solid ${es.bd}`,flexShrink:0,marginTop:1}}>{es.icon} {h.estado}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,color:"#374151"}}>{h.accion}</div>
                        <div style={{fontSize:10,color:"#9ca3af"}}>{h.usuario} · {new Date(h.ts).toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"})} {new Date(h.ts).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ):(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#9ca3af",fontSize:13,gap:10,background:"#f9fafb",borderRadius:12,border:"1px dashed #e5e7eb"}}>
          <span style={{fontSize:40}}>💡</span>
          <span>Selecciona un reporte para ver el detalle y gestionarlo</span>
        </div>
      )}
    </div>
  );
}

// ─── FEEDBACK USUARIO — ver mis reportes ─────────────────────────
export function MisMejoras({ mejoras, autor }) {
  const misMej = mejoras.filter(m=>!autor||m.autor?.toLowerCase().includes(autor.toLowerCase()));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {misMej.length===0&&<div style={{textAlign:"center",padding:30,color:"#9ca3af",fontSize:12}}>No has reportado ninguna mejora todavía. Usa el botón 💡 azul.</div>}
      {misMej.map(m=>{
        const ps=PRIO_STYLE[m.prioridad]||PRIO_STYLE.Media;
        const es=EST_STYLE[m.estado]||EST_STYLE["Pendiente"];
        return(
          <div key={m.id} style={{background:"#fff",border:`1.5px solid ${es.bd}`,borderLeft:`4px solid ${es.tx}`,borderRadius:10,padding:"12px 14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <div>
                <div style={{fontWeight:700,fontSize:13,color:"#111827",marginBottom:2}}>{m.titulo}</div>
                <div style={{fontSize:10.5,color:"#6b7280"}}>{m.modulo} · {m.fecha} {m.hora} · {m.tipo}</div>
              </div>
              <div style={{display:"flex",gap:5,flexShrink:0}}>
                <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,...ps}}>{m.prioridad}</span>
                <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,...es}}>{es.icon} {m.estado}</span>
              </div>
            </div>
            {m.responsable&&m.responsable!=="Sin asignar"&&<div style={{fontSize:11,color:"#6b7280",marginBottom:4}}>👤 Responsable: <b>{m.responsable}</b></div>}
            {m.comentarios?.length>0&&(
              <div style={{marginTop:6,padding:"8px 10px",background:"#eff6ff",borderRadius:7,border:"0.5px solid #93c5fd"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#1d4ed8",marginBottom:3}}>Último comentario del administrador:</div>
                <div style={{fontSize:12,color:"#374151"}}>{m.comentarios[m.comentarios.length-1].texto}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
export default function ERP() {
  const [dept, setDept] = useState("gerencia");
  const [portal, setPortal] = useState(false);
  const [ofs,  setOfs]  = useState(OFS_INIT);
  const [ncs,  setNcs]  = useState(NCS_INIT);
  const [mant, setMant] = useState(MANT_INIT);
  const [ctrl, setCtrl] = useState(CTRL_INIT);
  const [bloqueadas, setBloqueadas] = useState([]);
  const [mejoras,    setMejoras]    = useState([]);
  const [fichas,     setFichas]     = useState([]);
  const [homologaciones, setHomologaciones] = useState([
    {id:"HOM-2026-001",ref:"208322450110",desc:"BUSHING SPACER L110 M42",cliente:"MATZ-ERREKA, S.COOP.",norma:"P14A-WE-0218",proceso:"FOSFATADO + GRANALLADO + 2xKL120 + 2xNEGRO GZ",nss_req:720,ofertaId:"OFT-2603",estado:"lab_ok",nss:{estado:"ok",horas:744,fecha:"2026-03-10",obs:"",tecnico:""},aspecto:{estado:"ok",fecha:"2026-03-10",obs:"",tecnico:""},metalografico:{estado:"ok",fecha:"2026-03-12",obs:"",tecnico:""},fecha_inicio:"2026-02-20",fecha_cierre:"2026-03-12"},
    {id:"HOM-2026-002",ref:"28825261 T44",desc:"TUBSA REF 261",cliente:"TUBSA AUTOMOCION",norma:"IATF 16949",proceso:"FOSFATADO + GRANALLADO + 2xKL120 + 2xNEGRO GZ",nss_req:480,ofertaId:"OFT-2601",estado:"ensayos_curso",nss:{estado:"en_curso",horas:312,fecha:"",obs:"",tecnico:""},aspecto:{estado:"pendiente",fecha:"",obs:"",tecnico:""},metalografico:{estado:"pendiente",fecha:"",obs:"",tecnico:""},fecha_inicio:"2026-03-15",fecha_cierre:""},
    {id:"HOM-2026-003",ref:"208400220055",desc:"NEW PART REF 220055",cliente:"MATZ-ERREKA, S.COOP.",norma:"DIN 50979",proceso:"FOSFATADO + 2xKL120 + 2xNEGRO GZ",nss_req:1000,ofertaId:"OFT-2602",estado:"pendiente",nss:{estado:"pendiente",horas:0,fecha:"",obs:"",tecnico:""},aspecto:{estado:"pendiente",fecha:"",obs:"",tecnico:""},metalografico:{estado:"pendiente",fecha:"",obs:"",tecnico:""},fecha_inicio:"2026-04-01",fecha_cierre:""},
  ]);
  const [modalMejora,setModalMejora]= useState(false);

  const oAc   = ofs.filter(o  => ["En Curso","Control Final","Expedición"].includes(o.est)).length;
  const ncsAb = ncs.filter(n  => n.est !== "Cerrada").length;
  const mVhoy = mant.filter(m => m.est === "Vence hoy").length;
  const nok   = ctrl.filter(c => !c.ok).length;
  const tKg   = MAQUINAS.filter(m=>m.est==="Operativa").reduce((s,m)=>s+m.kg,0);
  const avgOEE= (MAQUINAS.filter(m=>m.oee>0).reduce((s,m)=>s+m.oee,0)/MAQUINAS.filter(m=>m.oee>0).length).toFixed(1);
  const mejorasPend = mejoras.filter(m=>m.estado==="Pendiente").length;

  const getBadge = (d) => ({ produccion:oAc, calidad:ncsAb, mantenimiento:mVhoy, laboratorio:nok, gerencia:mejorasPend }[d] || 0);
  const ctx = { ofs, setOfs, ncs, setNcs, mant, setMant, ctrl, setCtrl, bloqueadas, setBloqueadas, mejoras, setMejoras, fichas, setFichas, homologaciones, setHomologaciones, mVhoy, oAc, ncsAb };
  const { comp: Modulo, titulo } = MODULOS[dept] || MODULOS.gerencia;

  if(portal) return <PortalCliente onSalir={()=>setPortal(false)}/>;

  return (
    <ERPContext.Provider value={ctx}>
      <div style={{ display:"flex", height:"100vh", fontFamily:"system-ui,-apple-system,sans-serif" }}>

        {/* SIDEBAR */}
        <div style={{ width:186, minWidth:186, background:"var(--color-background-secondary)", borderRight:"0.5px solid var(--color-border-tertiary)", display:"flex", flexDirection:"column", overflowY:"auto", flexShrink:0 }}>
          <div style={{ padding:"14px 16px 12px", borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
            <div style={{ fontSize:13, fontWeight:600 }}>RecubrimetalTech</div>
            <div style={{ fontSize:10, color:"var(--color-text-secondary)", marginTop:1 }}>ERP · IATF 16949</div>
          </div>
          <nav style={{ padding:"6px 0", flex:1 }}>
            {NAV.map((it, idx) => {
              if (it.sep) return <div key={idx} style={{ fontSize:9.5, color:"var(--color-text-secondary)", padding:"10px 14px 3px", letterSpacing:".08em", textTransform:"uppercase", fontWeight:600 }}>{it.sep}</div>;
              const activo = dept === it.d;
              const badge  = getBadge(it.d);
              return (
                <div key={it.d} onClick={() => setDept(it.d)} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 14px", cursor:"pointer", fontSize:12, borderLeft:`2px solid ${activo?"var(--color-border-info)":"transparent"}`, background:activo?"var(--color-background-primary)":"transparent", color:activo?"var(--color-text-info)":"var(--color-text-secondary)", fontWeight:activo?600:400 }}>
                  <span style={{ fontSize:13, width:14, textAlign:"center", flexShrink:0 }}>{it.i}</span>
                  <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{it.l}</span>
                  {badge > 0 && <span style={{ background:"var(--color-background-danger)", color:"var(--color-text-danger)", fontSize:9, padding:"1px 5px", borderRadius:8, fontWeight:700, flexShrink:0 }}>{badge}</span>}
                </div>
              );
            })}
          </nav>
          <div style={{ padding:"8px 12px", borderTop:"0.5px solid var(--color-border-tertiary)" }}>
            <button onClick={()=>setPortal(true)}
              style={{width:"100%",background:"#1e3a5f",color:"#fff",border:"none",borderRadius:7,padding:"8px 10px",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6,justifyContent:"center",marginBottom:6}}>
              🌐 Portal Cliente
            </button>
            <div style={{ fontSize:10, color:"var(--color-text-secondary)", textAlign:"center" }}>v1.0 · {new Date().toLocaleDateString("es-ES")}</div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden", background:"var(--color-background-primary)" }}>
          <div style={{ height:52, minHeight:52, display:"flex", alignItems:"center", padding:"0 20px", borderBottom:"0.5px solid var(--color-border-tertiary)", gap:10, flexShrink:0 }}>
            <span style={{ fontSize:14, fontWeight:600 }}>{titulo}</span>
            <span style={{ width:"0.5px", height:16, background:"var(--color-border-tertiary)" }}/>
            <span style={{ fontSize:11, color:"var(--color-text-secondary)" }}>
              {new Date().toLocaleDateString("es-ES",{weekday:"short",day:"2-digit",month:"2-digit",year:"numeric"})} · Turno mañana
            </span>
            <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
              <div style={{ fontSize:11, background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:6, padding:"3px 9px", color:"var(--color-text-secondary)" }}>Kg <b style={{color:"var(--color-text-primary)"}}>{tKg.toLocaleString()}</b></div>
              <div style={{ fontSize:11, background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:6, padding:"3px 9px", color:"var(--color-text-secondary)" }}>OEE <b style={{color:avgOEE>=80?"var(--color-text-success)":"var(--color-text-warning)"}}>{avgOEE}%</b></div>
              {mejorasPend>0&&(
                <div onClick={()=>setDept("gerencia")} style={{fontSize:11,background:"#fffbeb",border:"1px solid #fde68a",borderRadius:6,padding:"3px 9px",color:"#92400e",cursor:"pointer",fontWeight:600}}>
                  💡 {mejorasPend} mejora{mejorasPend>1?"s":""} pendiente{mejorasPend>1?"s":""}
                </div>
              )}
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
            <ErrorBoundary nombre={titulo}>
              <Modulo/>
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* Botón flotante */}
      <div style={{position:"fixed",bottom:24,right:24,zIndex:500,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
        {mejorasPend>0&&(
          <div onClick={()=>setDept("gerencia")} style={{background:"#fff",border:"1px solid #fde68a",borderRadius:8,padding:"6px 12px",fontSize:11,color:"#92400e",cursor:"pointer",fontWeight:600,boxShadow:"0 2px 8px rgba(0,0,0,.1)"}}>
            💡 {mejorasPend} pendiente{mejorasPend>1?"s":""} → Gerencia
          </div>
        )}
        <button
          onClick={()=>setModalMejora(true)}
          title="Reportar mejora o incidencia"
          style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:"50%",width:54,height:54,cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(37,99,235,.45)",transition:"transform .15s, box-shadow .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.12)";e.currentTarget.style.boxShadow="0 6px 24px rgba(37,99,235,.55)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 20px rgba(37,99,235,.45)";}}
        >💡</button>
      </div>

      {/* Modal reporte */}
      {modalMejora&&<ModalReportarMejora
        modulo={titulo}
        dept={dept}
        onClose={()=>setModalMejora(false)}
        onGuardar={m=>{setMejoras(p=>[m,...p]);setModalMejora(false);}}
        total={mejoras.length}
      />}
    </ERPContext.Provider>
  );
}
