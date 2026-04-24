// src/modulos/OficinaTecnica.jsx
import React, { useState, useContext } from "react";
import { ERPContext } from "../ERP";
import { CLIENTES, MAQUINAS, cn } from "../datos";
import { Tabs, Bdg, Card, Tbl, Al, KRow } from "../ui";

// ─── ESTILOS BASE (colores fijos para evitar problemas con CSS vars) ──
const C = {
  bg:"#ffffff", bgS:"#f8fafc", bgI:"#eff6ff", bgSu:"#f0fdf4", bgW:"#fffbeb", bgD:"#fef2f2",
  tx:"#111827", txS:"#6b7280", txI:"#1d4ed8", txSu:"#166534", txW:"#92400e", txD:"#b91c1c",
  bd:"rgba(0,0,0,.1)", bdS:"rgba(0,0,0,.2)", bdI:"#93c5fd", bdSu:"#86efac", bdW:"#fde68a", bdD:"#fca5a5",
};
const mo = { fontFamily:"monospace", fontSize:11 };
const inp = { border:`1.5px solid #d1d5db`, borderRadius:8, padding:"9px 12px", fontSize:13, color:"#111827", background:"#ffffff", outline:"none", width:"100%", boxSizing:"border-box" };
const inpSm = { ...inp, padding:"7px 10px", fontSize:12 };
const lbl = { fontSize:11, fontWeight:600, color:"#374151", textTransform:"uppercase", letterSpacing:".05em", marginBottom:4, display:"block" };
const btnBase = { border:"none", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600, padding:"7px 16px" };
const btnPrimary = { ...btnBase, background:"#2563eb", color:"white" };
const btnDanger  = { ...btnBase, background:"#dc2626", color:"white" };
const btnGhost   = { ...btnBase, background:"transparent", border:"1px solid #d1d5db", color:"#374151" };
const btnSuccess = { ...btnBase, background:"#16a34a", color:"white" };
const btnSm = { ...btnBase, padding:"4px 10px", fontSize:11 };

function badge(t){
  const l=(t||"").toLowerCase();
  let bg="#f1f5f9",tx="#6b7280",bd="#e2e8f0";
  if(/activa|activo|aprobada|conforme/.test(l)){bg="#f0fdf4";tx="#166534";bd="#86efac";}
  else if(/borrador|desarrollo|pendiente|revisión/.test(l)){bg="#fffbeb";tx="#92400e";bd="#fde68a";}
  else if(/obsoleta|rechazada|baja/.test(l)){bg="#fef2f2";tx="#b91c1c";bd="#fca5a5";}
  else if(/enviada|en curso/.test(l)){bg="#eff6ff";tx="#1d4ed8";bd="#93c5fd";}
  return <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:bg,color:tx,border:`0.5px solid ${bd}`,whiteSpace:"nowrap"}}>{t}</span>;
}

// ─── DATOS INICIALES ─────────────────────────────────────────────
const FICHAS_INIT = [
  {id:"FT-001",version:"v3",estado:"Activa",cli:58,cod:"00.11.1.22.0.058.0604",ref_cli:"22824108110",desc:"CLIP MANETA RO",tipo_rec:"Basecoat + Negro GZ",proceso:"FOSFATADO + GRANALLADO + 2xKL120 + 2xNEGRO GZ",esp_min:10,esp_max:16,esp_und:"μm",par_apriete:"",resist_corr:"240h NSS",norma:"WSS-M21P49-A3",norma_tt:"",peso_ud:0.04,color:"Negro",aprobado_por:"J. García",fecha_aprob:"2025-06-15",obs:"",cambios:[{v:"v3",fecha:"2025-06-15",motivo:"Cambio espesor mín. 8→10μm",autor:"J. García"},{v:"v2",fecha:"2024-03-10",motivo:"Actualización norma WSS",autor:"M. Torres"}]},
  {id:"FT-002",version:"v2",estado:"Activa",cli:102,cod:"00.11.2.00.0.102.0013",ref_cli:"0001302750",desc:"306 CLIP D.T.",tipo_rec:"Negro GZ",proceso:"FOSFATADO + GRANALLADO + 2xNEGRO GZ",esp_min:10,esp_max:15,esp_und:"μm",par_apriete:"",resist_corr:"240h NSS",norma:"",norma_tt:"",peso_ud:0.05,color:"Negro",aprobado_por:"M. Torres",fecha_aprob:"2024-11-02",obs:"",cambios:[{v:"v2",fecha:"2024-11-02",motivo:"Revisión parámetros horno",autor:"M. Torres"}]},
  {id:"FT-003",version:"v1",estado:"Activa",cli:458,cod:"00.20.0.00.1.458.0004",ref_cli:"8100484951",desc:"CASQ. SOLD. Ø22 M8x1.25",tipo_rec:"Desaceitado",proceso:"FOSFATADO + GRANALLADO + DESACEITADO",esp_min:4,esp_max:8,esp_und:"g/m²",par_apriete:"25",resist_corr:"720h NSS",norma:"",norma_tt:"BMW GS 90010",peso_ud:0.16,color:"Gris metálico",aprobado_por:"A. Martín",fecha_aprob:"2024-01-15",obs:"",cambios:[{v:"v1",fecha:"2024-01-15",motivo:"Creación inicial",autor:"A. Martín"}]},
  {id:"FT-004",version:"v1",estado:"Pendiente validación",cli:125,cod:"00.25.D.22.0.125.0019b",ref_cli:"3117100.45b",desc:"TENPLATU IRAOTU T44",tipo_rec:"Basecoat + Plata",proceso:"FOSFATADO + GRANALLADO + 2xKL120 + 2xPLATA",esp_min:10,esp_max:16,esp_und:"μm",par_apriete:"",resist_corr:"500h NSS",norma:"",norma_tt:"",peso_ud:0.08,color:"Plata",aprobado_por:"",fecha_aprob:"",obs:"Nueva referencia en desarrollo",cambios:[{v:"v1",fecha:"2026-03-10",motivo:"Nueva referencia en desarrollo",autor:"J. García"}]},
];
const RECETAS_INIT = [
  {id:"REC-001",fichaId:"FT-001",maquina:"TWIN44",version:"v3",estado:"Activa",desc:"CLIP MANETA RO — TWIN44",plc_id:"TWIN44_REC_058604",vBano:25,tBano:20,vCentr:200,tCentr:30,giros:1,kgCesta:40,tempHorno:200,tHorno:20,capasBC:2,capasTC:2,vBano_min:22,vBano_max:28,tBano_min:18,tBano_max:22,vCentr_min:180,vCentr_max:220,tCentr_min:25,tCentr_max:35,tHorno_min:190,tHorno_max:210,verificada:true,ultima_carga:"2026-03-19 08:14",obs:""},
  {id:"REC-002",fichaId:"FT-002",maquina:"MN-01",version:"v2",estado:"Activa",desc:"306 CLIP D.T. — MN-01",plc_id:"MN01_REC_102013",vBano:30,tBano:7,vCentr:220,tCentr:20,giros:1,kgCesta:50,tempHorno:175,tHorno:18,capasBC:0,capasTC:2,vBano_min:28,vBano_max:32,tBano_min:6,tBano_max:8,vCentr_min:210,vCentr_max:230,tCentr_min:18,tCentr_max:22,tHorno_min:165,tHorno_max:185,verificada:true,ultima_carga:"2026-03-19 07:45",obs:""},
  {id:"REC-003",fichaId:"FT-003",maquina:"DC02",version:"v1",estado:"Activa",desc:"CASQ. SOLD. Ø22 — DC02",plc_id:"DC02_REC_458004",vBano:0,tBano:1,vCentr:0.08,tCentr:0,giros:0,kgCesta:160,tempHorno:0,tHorno:0,capasBC:0,capasTC:0,vBano_min:0,vBano_max:5,tBano_min:0.5,tBano_max:2,vCentr_min:0.05,vCentr_max:0.12,tCentr_min:0,tCentr_max:1,tHorno_min:0,tHorno_max:0,verificada:false,ultima_carga:"2026-03-18 14:22",obs:""},
  {id:"REC-004",fichaId:"FT-004",maquina:"TWIN44",version:"v1",estado:"Borrador",desc:"TENPLATU IRAOTU T44 — TWIN44",plc_id:"",vBano:25,tBano:20,vCentr:150,tCentr:60,giros:1,kgCesta:80,tempHorno:195,tHorno:22,capasBC:2,capasTC:2,vBano_min:0,vBano_max:0,tBano_min:0,tBano_max:0,vCentr_min:0,vCentr_max:0,tCentr_min:0,tCentr_max:0,tHorno_min:0,tHorno_max:0,verificada:false,ultima_carga:"",obs:"En desarrollo"},
];
const RUTAS_INIT = [
  {id:"RUT-001",fichaId:"FT-001",version:"v2",estado:"Activa",desc:"CLIP MANETA RO — Línea TWIN",operaciones:[{orden:1,nombre:"Granallado",maquina:"GR-02",tmin:8,tmax:12,temp:"",vel_bano:10,vel_centr:"",producto:"Granalla S330",obs:""},{orden:2,nombre:"Pretratamiento",maquina:"PRE-02",tmin:16,tmax:20,temp:55,vel_bano:7,vel_centr:"",producto:"Fosfato Fe",obs:""},{orden:3,nombre:"Recubrimiento",maquina:"TWIN44",tmin:25,tmax:35,temp:180,vel_bano:25,vel_centr:200,producto:"KL120 + Negro GZ",obs:""},{orden:4,nombre:"Horno",maquina:"TWIN44",tmin:18,tmax:22,temp:200,vel_bano:"",vel_centr:"",producto:"—",obs:""}]},
  {id:"RUT-002",fichaId:"FT-002",version:"v1",estado:"Activa",desc:"306 CLIP D.T. — MN-01",operaciones:[{orden:1,nombre:"Granallado",maquina:"GR-01",tmin:8,tmax:12,temp:"",vel_bano:7,vel_centr:"",producto:"Granalla S330",obs:""},{orden:2,nombre:"Pretratamiento",maquina:"PRE-01",tmin:16,tmax:20,temp:55,vel_bano:7,vel_centr:"",producto:"Fosfato Fe",obs:""},{orden:3,nombre:"Recubrimiento",maquina:"MN-01",tmin:20,tmax:28,temp:170,vel_bano:30,vel_centr:220,producto:"Negro GZ",obs:""}]},
  {id:"RUT-003",fichaId:"FT-003",version:"v1",estado:"Activa",desc:"CASQ. SOLD. Ø22 — DC02",operaciones:[{orden:1,nombre:"Desengrasado",maquina:"DE02",tmin:10,tmax:15,temp:60,vel_bano:"",vel_centr:"",producto:"Desengrasante alcalino",obs:""},{orden:2,nombre:"Granallado",maquina:"GR-BAST",tmin:12,tmax:18,temp:"",vel_bano:15,vel_centr:"",producto:"Granalla S170",obs:""},{orden:3,nombre:"Desaceitado",maquina:"DC02",tmin:1,tmax:4,temp:"",vel_bano:0,vel_centr:0.08,producto:"Aceite MKR",obs:""}]},
];
const OFERTAS_INIT = [
  {id:"OFT-2601",cli:542,desc:"KLAMMER – Negro IATF",proceso:"FOSFATADO + GRANALLADO + 2xNEGRO GZ",precio_kg:0.28,kg_año:120000,estado:"Enviada",fecha:"2026-02-10",validez:"2026-05-10",contacto:"jgarcia@cefa.es",obs:"Pendiente respuesta cliente"},
  {id:"OFT-2602",cli:9,  desc:"Clip suspensión – VH321",proceso:"FOSFATADO + GRANALLADO + 1xVH302",precio_kg:0.34,kg_año:85000,estado:"Pendiente",fecha:"2026-03-01",validez:"2026-06-01",contacto:"compras@celo.es",obs:""},
  {id:"OFT-2603",cli:109,desc:"Ratchet – Negro+Deltalube",proceso:"FOSFATADO + GRANALLADO + 2xNEGRO GZ + DELTALUBE",precio_kg:0.41,kg_año:60000,estado:"Activa",fecha:"2026-01-15",validez:"2026-07-15",contacto:"tecnico@soniasa.es",obs:"Homologación en curso"},
];

// ─── MODAL GENÉRICO ───────────────────────────────────────────────
function Modal({ titulo, subtitulo, onClose, onGuardar, guardaBtnLabel="Guardar", guardaBtnColor=btnPrimary, children, ancho=560 }){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,padding:16}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:14,width:ancho,maxWidth:"98%",maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 25px 50px rgba(0,0,0,.25)",overflow:"hidden"}}>
        <div style={{padding:"18px 22px",borderBottom:"1px solid #f3f4f6",background:"#fafafa",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexShrink:0}}>
          <div>
            <div style={{fontWeight:700,fontSize:16,color:"#111827"}}>{titulo}</div>
            {subtitulo&&<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{subtitulo}</div>}
          </div>
          <button onClick={onClose} style={{background:"#f3f4f6",border:"none",cursor:"pointer",width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#6b7280",flexShrink:0}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"20px 22px",display:"flex",flexDirection:"column",gap:14}}>{children}</div>
        <div style={{padding:"14px 22px",borderTop:"1px solid #f3f4f6",display:"flex",justifyContent:"flex-end",gap:10,background:"#fafafa",flexShrink:0}}>
          <button onClick={onClose} style={btnGhost}>Cancelar</button>
          <button onClick={onGuardar} style={guardaBtnColor}>{guardaBtnLabel}</button>
        </div>
      </div>
    </div>
  );
}

function ModalConfirm({ texto, onClose, onConfirmar }){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:700}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:12,padding:"24px 28px",maxWidth:400,width:"90%",boxShadow:"0 20px 40px rgba(0,0,0,.25)"}}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:8,color:"#111827"}}>Confirmar eliminación</div>
        <div style={{fontSize:13,color:"#6b7280",marginBottom:20}}>{texto}</div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
          <button onClick={onClose} style={btnGhost}>Cancelar</button>
          <button onClick={onConfirmar} style={btnDanger}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

// ─── HELPERS FORM ─────────────────────────────────────────────────
function Campo({ label, required, children }){
  return <div style={{display:"flex",flexDirection:"column",gap:5}}><label style={lbl}>{label}{required&&<span style={{color:"#ef4444",marginLeft:2}}>*</span>}</label>{children}</div>;
}
function Row2({ children }){ return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>{children}</div>; }
function Row3({ children }){ return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>{children}</div>; }
function Sep({ label }){ return <div style={{display:"flex",alignItems:"center",gap:10,margin:"4px 0"}}><div style={{flex:1,height:1,background:"#f3f4f6"}}/><span style={{fontSize:11,fontWeight:600,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}}>{label}</span><div style={{flex:1,height:1,background:"#f3f4f6"}}/></div>; }

// ─── TAB FICHAS TÉCNICAS ──────────────────────────────────────────
function TabFichas(){
  const { fichas: fichasCtx, setFichas: setFichasCtx } = useContext(ERPContext);
  // Inicializar contexto con datos locales si está vacío
  const fichas = fichasCtx.length > 0 ? fichasCtx : FICHAS_INIT;
  function setFichas(fn) {
    const next = typeof fn === "function" ? fn(fichas) : fn;
    setFichasCtx(next);
  }
  const [sel,setSel]       = useState(null);
  const [q,setQ]           = useState("");
  const [modal,setModal]   = useState(null); // null | "nueva" | "editar" | "version"
  const [confirm,setConfirm]= useState(null);
  const [form,setForm]     = useState({});
  const [fCambio,setFCambio]= useState({motivo:"",autor:""});

  const filt = q ? fichas.filter(f=>(f.desc+cn(f.cli)+f.cod+f.ref_cli).toLowerCase().includes(q.toLowerCase())) : fichas;
  const ficha = fichas.find(f=>f.id===sel);

  function abrirNueva(){
    setForm({id:`FT-${String(fichas.length+1).padStart(3,"0")}`,version:"v1",estado:"Borrador",cli:CLIENTES[0].id,cod:"",ref_cli:"",desc:"",tipo_rec:"",proceso:"",esp_min:"",esp_max:"",esp_und:"μm",par_apriete:"",resist_corr:"",norma:"",norma_tt:"",peso_ud:"",color:"",aprobado_por:"",fecha_aprob:"",obs:"",foto:null});
    setModal("nueva");
  }
  function abrirEditar(){
    if(!ficha)return;
    setForm({...ficha});
    setModal("editar");
  }
  function guardarNueva(){
    if(!form.desc)return;
    const nueva={...form,cambios:[{v:form.version,fecha:new Date().toISOString().slice(0,10),motivo:"Creación inicial",autor:form.aprobado_por||"Usuario"}]};
    setFichas(p=>[...p,nueva]);setSel(nueva.id);setModal(null);
  }
  function guardarEditar(){
    setFichas(p=>p.map(f=>f.id===form.id?{...form,cambios:f.cambios}:f));setModal(null);
  }
  function eliminar(){
    setFichas(p=>p.filter(f=>f.id!==sel));setSel(null);setConfirm(null);
  }
  function guardarVersion(){
    if(!fCambio.motivo)return;
    const vNum=parseInt((ficha.version||"v0").replace("v",""))+1;
    const nuevaV=`v${vNum}`;
    setFichas(p=>p.map(f=>f.id===sel?{...f,version:nuevaV,cambios:[{v:nuevaV,fecha:new Date().toISOString().slice(0,10),...fCambio},...f.cambios]}:f));
    setFCambio({motivo:"",autor:""});setModal(null);
  }
  const ff = (k)=>e=>setForm(p=>({...p,[k]:e.target.value}));

  return(
    <div style={{display:"flex",gap:14}}>
      {/* Lista */}
      <div style={{width:290,flexShrink:0,display:"flex",flexDirection:"column",gap:8}}>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"#9ca3af"}}>⌕</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar referencia, cliente…" style={{...inp,paddingLeft:32,fontSize:12}}/>
        </div>
        <button onClick={abrirNueva} style={{...btnPrimary,width:"100%"}}>+ Nueva ficha técnica</button>
        <div style={{fontSize:11,color:"#9ca3af"}}>{filt.length} fichas</div>
        <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:540,overflowY:"auto"}}>
          {filt.map(f=>{
            const act=sel===f.id;
            return(
              <div key={f.id} onClick={()=>setSel(f.id)} style={{padding:"10px 13px",borderRadius:9,cursor:"pointer",border:`1.5px solid ${act?"#2563eb":"#e5e7eb"}`,background:act?"#eff6ff":"#fff",transition:"all .1s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <span style={{fontFamily:"monospace",fontSize:10.5,fontWeight:600,color:act?"#1d4ed8":"#9ca3af"}}>{f.id} · {f.version}</span>
                  {badge(f.estado)}
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  {f.foto&&<img src={f.foto} alt={f.desc} style={{width:36,height:36,objectFit:"cover",borderRadius:5,border:"0.5px solid #e2e8f0",flexShrink:0}}/>}
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#111827",marginBottom:2}}>{f.desc}</div>
                    <div style={{fontSize:10.5,color:"#6b7280"}}>{cn(f.cli)} · {f.tipo_rec}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalle */}
      {ficha?(
        <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:12}}>
          {/* Acciones */}
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button onClick={()=>{setFCambio({motivo:"",autor:""});setModal("version");}} style={{...btnBase,background:"#f0fdf4",color:"#166534",border:"1px solid #86efac"}}>+ Nueva versión</button>
            <button onClick={abrirEditar} style={{...btnBase,background:"#eff6ff",color:"#1d4ed8",border:"1px solid #93c5fd"}}>✏ Editar</button>
            <button onClick={()=>setConfirm(true)} style={{...btnBase,background:"#fef2f2",color:"#b91c1c",border:"1px solid #fca5a5"}}>🗑 Eliminar</button>
          </div>

          {/* Header */}
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"16px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                {ficha.foto&&<img src={ficha.foto} alt={ficha.desc} style={{width:72,height:72,objectFit:"cover",borderRadius:8,border:"1px solid #e2e8f0",flexShrink:0}}/>}
                <div><div style={{fontSize:17,fontWeight:700}}>{ficha.desc}</div><div style={{fontSize:11,color:"#9ca3af",marginTop:3,fontFamily:"monospace"}}>{ficha.cod} · Ref. cliente: {ficha.ref_cli}</div></div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>{badge(ficha.estado)}<span style={{fontSize:11,color:"#9ca3af",fontFamily:"monospace"}}>{ficha.version}</span></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8}}>
              {[["Cliente",cn(ficha.cli)],["Tipo recubrimiento",ficha.tipo_rec],["Espesor",`${ficha.esp_min}–${ficha.esp_max} ${ficha.esp_und}`],["Resistencia NSS",ficha.resist_corr||"—"],["Norma cliente",ficha.norma||"—"],["Norma TT",ficha.norma_tt||"—"],["Par apriete",ficha.par_apriete?`${ficha.par_apriete} Nm`:"N/A"],["Color",ficha.color||"—"],["Aprobado por",ficha.aprobado_por||"Pendiente"],["F. aprobación",ficha.fecha_aprob||"—"]].map(([k,v])=>(
                <div key={k} style={{background:"#f8fafc",borderRadius:7,padding:"7px 10px"}}>
                  <div style={{fontSize:9.5,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".05em",marginBottom:2}}>{k}</div>
                  <div style={{fontSize:11.5,fontWeight:500,color:"#111827"}}>{v}</div>
                </div>
              ))}
            </div>
            {ficha.proceso&&<div style={{marginTop:10,padding:"8px 12px",background:"#f8fafc",borderRadius:7,fontSize:11.5,color:"#374151"}}><b>Proceso:</b> {ficha.proceso}</div>}
            {ficha.obs&&<div style={{marginTop:6,padding:"8px 12px",background:"#fffbeb",borderRadius:7,fontSize:11.5,color:"#92400e",border:"0.5px solid #fde68a"}}>📝 {ficha.obs}</div>}
          </div>

          {/* Historial versiones */}
          <div>
            <div style={{fontSize:11,fontWeight:600,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Historial de cambios</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {ficha.cambios.map((c,i)=>(
                <div key={i} style={{padding:"9px 13px",borderRadius:8,border:`1px solid ${i===0?"#93c5fd":"#e5e7eb"}`,borderLeft:`3px solid ${i===0?"#2563eb":"#d1d5db"}`,background:i===0?"#eff6ff":"#fff"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <span style={{fontFamily:"monospace",fontWeight:700,fontSize:11,color:i===0?"#1d4ed8":"#9ca3af"}}>{c.v}</span>
                    <span style={{fontSize:10.5,color:"#9ca3af"}}>{c.fecha}</span>
                  </div>
                  <div style={{fontSize:11.5,color:"#374151"}}>{c.motivo}</div>
                  <div style={{fontSize:10.5,color:"#9ca3af",marginTop:2}}>— {c.autor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ):(
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#9ca3af",fontSize:13}}>← Selecciona una ficha técnica</div>
      )}

      {/* Modal nueva/editar */}
      {(modal==="nueva"||modal==="editar")&&(
        <Modal titulo={modal==="nueva"?"Nueva ficha técnica":"Editar ficha técnica"} subtitulo={form.desc||"Sin descripción"} onClose={()=>setModal(null)} onGuardar={modal==="nueva"?guardarNueva:guardarEditar}>
          <Row2>
            <Campo label="ID Interno"><input value={form.id||""} onChange={ff("id")} style={inp} disabled={modal==="editar"}/></Campo>
            <Campo label="Estado">
              <select value={form.estado||""} onChange={ff("estado")} style={inp}>
                {["Borrador","Pendiente validación","Activa","Obsoleta"].map(s=><option key={s}>{s}</option>)}
              </select>
            </Campo>
          </Row2>
          <Row2>
            <Campo label="Cliente" required>
              <select value={form.cli||""} onChange={e=>setForm(p=>({...p,cli:parseInt(e.target.value)}))} style={inp}>
                {CLIENTES.map(c=><option key={c.id} value={c.id}>{c.n}</option>)}
              </select>
            </Campo>
            <Campo label="Versión"><input value={form.version||""} onChange={ff("version")} style={inp}/></Campo>
          </Row2>
          <Campo label="Descripción / Referencia" required><input value={form.desc||""} onChange={ff("desc")} style={inp} placeholder="Nombre de la pieza…"/></Campo>
          <Row2>
            <Campo label="Código interno"><input value={form.cod||""} onChange={ff("cod")} style={inp}/></Campo>
            <Campo label="Referencia cliente"><input value={form.ref_cli||""} onChange={ff("ref_cli")} style={inp}/></Campo>
          </Row2>
          <Campo label="Proceso completo"><input value={form.proceso||""} onChange={ff("proceso")} style={inp} placeholder="FOSFATADO + GRANALLADO + …"/></Campo>
          <Sep label="Especificaciones técnicas"/>
          <Row3>
            <Campo label="Espesor mín."><input type="number" value={form.esp_min||""} onChange={ff("esp_min")} style={inp}/></Campo>
            <Campo label="Espesor máx."><input type="number" value={form.esp_max||""} onChange={ff("esp_max")} style={inp}/></Campo>
            <Campo label="Unidad"><select value={form.esp_und||"μm"} onChange={ff("esp_und")} style={inp}><option>μm</option><option>g/m²</option><option>mm</option></select></Campo>
          </Row3>
          <Row2>
            <Campo label="Resistencia NSS"><input value={form.resist_corr||""} onChange={ff("resist_corr")} style={inp} placeholder="240h NSS"/></Campo>
            <Campo label="Par de apriete (Nm)"><input value={form.par_apriete||""} onChange={ff("par_apriete")} style={inp}/></Campo>
          </Row2>
          <Row2>
            <Campo label="Norma cliente"><input value={form.norma||""} onChange={ff("norma")} style={inp}/></Campo>
            <Campo label="Norma tratamiento térmico"><input value={form.norma_tt||""} onChange={ff("norma_tt")} style={inp}/></Campo>
          </Row2>
          <Row3>
            <Campo label="Tipo recubrimiento"><input value={form.tipo_rec||""} onChange={ff("tipo_rec")} style={inp}/></Campo>
            <Campo label="Color"><input value={form.color||""} onChange={ff("color")} style={inp}/></Campo>
            <Campo label="Peso ud. (kg)"><input type="number" step="0.001" value={form.peso_ud||""} onChange={ff("peso_ud")} style={inp}/></Campo>
          </Row3>
          <Row2>
            <Campo label="Aprobado por"><input value={form.aprobado_por||""} onChange={ff("aprobado_por")} style={inp}/></Campo>
            <Campo label="Fecha aprobación"><input type="date" value={form.fecha_aprob||""} onChange={ff("fecha_aprob")} style={inp}/></Campo>
          </Row2>
          <Campo label="Foto de la referencia">
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <label style={{cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,background:"#f1f5f9",border:"1px dashed #cbd5e1",borderRadius:7,padding:"7px 14px",fontSize:12,color:"#475569",fontWeight:600}}>
                <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setForm(p=>({...p,foto:ev.target.result}));r.readAsDataURL(f);}}/>
                📷 Subir foto
              </label>
              {form.foto&&<img src={form.foto} alt="preview" style={{width:60,height:60,objectFit:"cover",borderRadius:7,border:"1px solid #e2e8f0"}}/>}
              {form.foto&&<button type="button" onClick={()=>setForm(p=>({...p,foto:null}))} style={{background:"#fee2e2",border:"0.5px solid #fca5a5",color:"#b91c1c",borderRadius:5,padding:"3px 8px",cursor:"pointer",fontSize:11}}>✕ Quitar</button>}
            </div>
          </Campo>
          <Campo label="Observaciones"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...inp,resize:"vertical",fontFamily:"inherit"}}/></Campo>
        </Modal>
      )}

      {/* Modal nueva versión */}
      {modal==="version"&&(
        <Modal titulo="Registrar nueva versión" subtitulo={`Ficha actual: ${ficha?.version}`} onClose={()=>setModal(null)} onGuardar={guardarVersion}>
          <Campo label="Motivo del cambio" required><textarea value={fCambio.motivo} onChange={e=>setFCambio(p=>({...p,motivo:e.target.value}))} rows={3} style={{...inp,resize:"vertical",fontFamily:"inherit"}} placeholder="Describe qué cambia y por qué…"/></Campo>
          <Campo label="Autor del cambio" required><input value={fCambio.autor} onChange={e=>setFCambio(p=>({...p,autor:e.target.value}))} style={inp} placeholder="Nombre del responsable"/></Campo>
          <div style={{padding:"10px 14px",background:"#eff6ff",borderRadius:8,fontSize:12,color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>
            ℹ La versión pasará de <b>{ficha?.version}</b> a <b>v{parseInt((ficha?.version||"v0").replace("v",""))+1}</b>
          </div>
        </Modal>
      )}

      {confirm&&<ModalConfirm texto={`¿Eliminar la ficha "${ficha?.desc}"? Esta acción no se puede deshacer.`} onClose={()=>setConfirm(null)} onConfirmar={eliminar}/>}
    </div>
  );
}

// ─── TAB RECETAS MÁQUINA ──────────────────────────────────────────
function TabRecetas({ fichas }){
  const [recetas,setRecetas] = useState(RECETAS_INIT);
  const [sel,setSel]         = useState(null);
  const [modal,setModal]     = useState(null);
  const [confirm,setConfirm] = useState(null);
  const [form,setForm]       = useState({});
  const rec = recetas.find(r=>r.id===sel);

  function abrirNueva(){
    setForm({id:`REC-${String(recetas.length+1).padStart(3,"0")}`,fichaId:"",maquina:MAQUINAS.filter(m=>m.est!=="Inhabilitada")[0]?.id||"",version:"v1",estado:"Borrador",desc:"",plc_id:"",vBano:0,tBano:0,vCentr:0,tCentr:0,giros:0,kgCesta:0,tempHorno:0,tHorno:0,capasBC:0,capasTC:0,vBano_min:0,vBano_max:0,tBano_min:0,tBano_max:0,vCentr_min:0,vCentr_max:0,tCentr_min:0,tCentr_max:0,tHorno_min:0,tHorno_max:0,verificada:false,ultima_carga:"",obs:""});
    setModal("form");
  }
  function abrirEditar(){if(rec){setForm({...rec});setModal("form");}}
  function guardar(){
    if(!form.desc)return;
    if(modal==="nueva"||!recetas.find(r=>r.id===form.id)){setRecetas(p=>[...p,form]);setSel(form.id);}
    else{setRecetas(p=>p.map(r=>r.id===form.id?form:r));}
    setModal(null);
  }
  function eliminar(){setRecetas(p=>p.filter(r=>r.id!==sel));setSel(null);setConfirm(null);}
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.type==="number"?parseFloat(e.target.value)||0:e.target.type==="checkbox"?e.target.checked:e.target.value}));

  function ParFila({label,val,min,max}){
    const fuera=min!==undefined&&max!==undefined&&val!=null&&(parseFloat(val)<min||parseFloat(val)>max);
    return(
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid #f3f4f6"}}>
        <span style={{fontSize:11.5,color:"#6b7280"}}>{label}</span>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {min!==undefined&&<span style={{fontSize:10,color:"#9ca3af"}}>[{min}–{max}]</span>}
          <span style={{fontFamily:"monospace",fontWeight:700,fontSize:14,color:fuera?"#b91c1c":"#1d4ed8"}}>{val??"-"}</span>
          {fuera&&<span style={{fontSize:9,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5",padding:"1px 5px",borderRadius:3,fontWeight:700}}>FUERA</span>}
        </div>
      </div>
    );
  }

  return(
    <div style={{display:"flex",gap:14}}>
      <div style={{width:280,flexShrink:0,display:"flex",flexDirection:"column",gap:6}}>
        <button onClick={abrirNueva} style={{...btnPrimary,width:"100%"}}>+ Nueva receta</button>
        {recetas.map(r=>{
          const act=sel===r.id;const f=fichas.find(fi=>fi.id===r.fichaId);
          return(
            <div key={r.id} onClick={()=>setSel(r.id)} style={{padding:"10px 13px",borderRadius:9,cursor:"pointer",border:`1.5px solid ${act?"#2563eb":"#e5e7eb"}`,background:act?"#eff6ff":"#fff"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontFamily:"monospace",fontSize:10.5,fontWeight:600,color:act?"#1d4ed8":"#9ca3af"}}>{r.id}</span>{badge(r.estado)}</div>
              <div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{f?.desc||r.desc}</div>
              <div style={{fontSize:10.5,color:"#6b7280",marginBottom:4}}>{r.maquina} · {r.version}</div>
              <span style={{fontSize:10,padding:"2px 6px",borderRadius:4,fontWeight:600,background:r.verificada?"#f0fdf4":"#fffbeb",color:r.verificada?"#166534":"#92400e",border:`0.5px solid ${r.verificada?"#86efac":"#fde68a"}`}}>{r.verificada?"✓ PLC OK":"⚠ Sin verificar"}</span>
            </div>
          );
        })}
      </div>

      {rec?(
        <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button onClick={()=>setRecetas(p=>p.map(r=>r.id===sel?{...r,verificada:!r.verificada}:r))} style={{...btnBase,background:rec.verificada?"#fffbeb":"#f0fdf4",color:rec.verificada?"#92400e":"#166534",border:`1px solid ${rec.verificada?"#fde68a":"#86efac"}`}}>{rec.verificada?"⚠ Desverificar":"✓ Marcar verificada"}</button>
            <button onClick={abrirEditar} style={{...btnBase,background:"#eff6ff",color:"#1d4ed8",border:"1px solid #93c5fd"}}>✏ Editar</button>
            <button onClick={()=>setConfirm(true)} style={{...btnBase,background:"#fef2f2",color:"#b91c1c",border:"1px solid #fca5a5"}}>🗑 Eliminar</button>
          </div>

          {/* Estado PLC */}
          <div style={{background:rec.verificada?"#f0fdf4":"#fffbeb",border:`1.5px solid ${rec.verificada?"#86efac":"#fde68a"}`,borderRadius:10,padding:"12px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:rec.verificada?"#166534":"#92400e"}}>{rec.verificada?"✓ Receta verificada en PLC":"⚠ Pendiente verificación PLC"}</div>
                <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>ID PLC: <b style={{fontFamily:"monospace"}}>{rec.plc_id||"Sin asignar"}</b>{rec.ultima_carga&&` · ${rec.ultima_carga}`}</div>
              </div>
              <button style={{...btnBase,background:"#1d4ed8",color:"white",padding:"5px 14px"}}>↑ Enviar a PLC</button>
            </div>
          </div>

          {/* Parámetros */}
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"16px 20px"}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:14}}>{rec.desc} <span style={{fontSize:11,color:"#9ca3af",fontWeight:400}}>— {rec.maquina} · {rec.version}</span></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              <div>
                <div style={{fontSize:10,fontWeight:600,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>Proceso</div>
                <ParFila label="Vel. baño (rpm)"    val={rec.vBano}   min={rec.vBano_min}  max={rec.vBano_max}/>
                <ParFila label="T. baño (min)"      val={rec.tBano}   min={rec.tBano_min}  max={rec.tBano_max}/>
                <ParFila label="Vel. centrif. (rpm)"val={rec.vCentr}  min={rec.vCentr_min} max={rec.vCentr_max}/>
                <ParFila label="T. centrif. (min)"  val={rec.tCentr}  min={rec.tCentr_min} max={rec.tCentr_max}/>
                <ParFila label="Giros"              val={rec.giros}/>
                <ParFila label="Kg por cesta"       val={rec.kgCesta}/>
              </div>
              <div>
                <div style={{fontSize:10,fontWeight:600,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>Horno y acabado</div>
                <ParFila label="Temp. horno (°C)"   val={rec.tempHorno} min={rec.tHorno_min} max={rec.tHorno_max}/>
                <ParFila label="T. horno (min)"     val={rec.tHorno}/>
                <ParFila label="Capas basecoat"     val={rec.capasBC}/>
                <ParFila label="Capas topcoat"      val={rec.capasTC}/>
              </div>
            </div>
            {rec.obs&&<div style={{marginTop:10,padding:"8px 12px",background:"#fffbeb",borderRadius:7,fontSize:11.5,color:"#92400e",border:"0.5px solid #fde68a"}}>📝 {rec.obs}</div>}
          </div>
        </div>
      ):(
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#9ca3af",fontSize:13}}>← Selecciona una receta</div>
      )}

      {modal==="form"&&(
        <Modal titulo={!recetas.find(r=>r.id===form.id)||modal==="nueva"?"Nueva receta":"Editar receta"} subtitulo={form.desc} onClose={()=>setModal(null)} onGuardar={guardar} ancho={620}>
          <Row3>
            <Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={inp}/></Campo>
            <Campo label="Estado"><select value={form.estado||""} onChange={ff("estado")} style={inp}>{["Borrador","Activa","Obsoleta"].map(s=><option key={s}>{s}</option>)}</select></Campo>
            <Campo label="Versión"><input value={form.version||""} onChange={ff("version")} style={inp}/></Campo>
          </Row3>
          <Row2>
            <Campo label="Ficha técnica">
              <select value={form.fichaId||""} onChange={ff("fichaId")} style={inp}>
                <option value="">— Sin ficha —</option>
                {fichas.map(f=><option key={f.id} value={f.id}>{f.id} · {f.desc}</option>)}
              </select>
            </Campo>
            <Campo label="Máquina">
              <select value={form.maquina||""} onChange={ff("maquina")} style={inp}>
                {MAQUINAS.filter(m=>m.est!=="Inhabilitada").map(m=><option key={m.id} value={m.id}>{m.id}</option>)}
              </select>
            </Campo>
          </Row2>
          <Campo label="Descripción"><input value={form.desc||""} onChange={ff("desc")} style={inp}/></Campo>
          <Campo label="ID PLC"><input value={form.plc_id||""} onChange={ff("plc_id")} style={inp} placeholder="Ej: TWIN44_REC_058604"/></Campo>
          <Sep label="Parámetros de proceso"/>
          <Row3>
            <Campo label="Vel. baño (rpm)"><input type="number" value={form.vBano||0} onChange={ff("vBano")} style={inp}/></Campo>
            <Campo label="T. baño (min)"><input type="number" step="0.1" value={form.tBano||0} onChange={ff("tBano")} style={inp}/></Campo>
            <Campo label="Giros"><input type="number" value={form.giros||0} onChange={ff("giros")} style={inp}/></Campo>
          </Row3>
          <Row3>
            <Campo label="Vel. centrif. (rpm)"><input type="number" step="0.01" value={form.vCentr||0} onChange={ff("vCentr")} style={inp}/></Campo>
            <Campo label="T. centrif. (min)"><input type="number" value={form.tCentr||0} onChange={ff("tCentr")} style={inp}/></Campo>
            <Campo label="Kg por cesta"><input type="number" value={form.kgCesta||0} onChange={ff("kgCesta")} style={inp}/></Campo>
          </Row3>
          <Row3>
            <Campo label="Temp. horno (°C)"><input type="number" value={form.tempHorno||0} onChange={ff("tempHorno")} style={inp}/></Campo>
            <Campo label="T. horno (min)"><input type="number" value={form.tHorno||0} onChange={ff("tHorno")} style={inp}/></Campo>
            <div/>
          </Row3>
          <Row2>
            <Campo label="Capas basecoat"><input type="number" value={form.capasBC||0} onChange={ff("capasBC")} style={inp}/></Campo>
            <Campo label="Capas topcoat"><input type="number" value={form.capasTC||0} onChange={ff("capasTC")} style={inp}/></Campo>
          </Row2>
          <Sep label="Tolerancias"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
            {[["Vb min",form.vBano_min,"vBano_min"],["Vb máx",form.vBano_max,"vBano_max"],["Vc min",form.vCentr_min,"vCentr_min"],["Vc máx",form.vCentr_max,"vCentr_max"],["T.H. min",form.tHorno_min,"tHorno_min"],["T.H. máx",form.tHorno_max,"tHorno_max"],["Tb min",form.tBano_min,"tBano_min"],["Tb máx",form.tBano_max,"tBano_max"],["Tc min",form.tCentr_min,"tCentr_min"],["Tc máx",form.tCentr_max,"tCentr_max"]].map(([l,v,k])=>(
              <Campo key={k} label={l}><input type="number" step="0.01" value={v||0} onChange={ff(k)} style={inpSm}/></Campo>
            ))}
          </div>
          <Campo label="Foto de la referencia">
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <label style={{cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,background:"#f1f5f9",border:"1px dashed #cbd5e1",borderRadius:7,padding:"7px 14px",fontSize:12,color:"#475569",fontWeight:600}}>
                <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setForm(p=>({...p,foto:ev.target.result}));r.readAsDataURL(f);}}/>
                📷 Subir foto
              </label>
              {form.foto&&<img src={form.foto} alt="preview" style={{width:60,height:60,objectFit:"cover",borderRadius:7,border:"1px solid #e2e8f0"}}/>}
              {form.foto&&<button type="button" onClick={()=>setForm(p=>({...p,foto:null}))} style={{background:"#fee2e2",border:"0.5px solid #fca5a5",color:"#b91c1c",borderRadius:5,padding:"3px 8px",cursor:"pointer",fontSize:11}}>✕ Quitar</button>}
            </div>
          </Campo>
          <Campo label="Observaciones"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...inp,resize:"vertical",fontFamily:"inherit"}}/></Campo>
        </Modal>
      )}
      {confirm&&<ModalConfirm texto={`¿Eliminar la receta "${rec?.desc}"?`} onClose={()=>setConfirm(null)} onConfirmar={eliminar}/>}
    </div>
  );
}

// ─── TAB RUTAS DE PROCESO ─────────────────────────────────────────
function TabRutas({ fichas }){
  const [rutas,setRutas]   = useState(RUTAS_INIT);
  const [sel,setSel]       = useState(null);
  const [modal,setModal]   = useState(null);
  const [confirm,setConfirm]=useState(null);
  const [form,setForm]     = useState({});
  const [opForm,setOpForm] = useState(null); // editar operación inline
  const ruta = rutas.find(r=>r.id===sel);

  function abrirNueva(){
    setForm({id:`RUT-${String(rutas.length+1).padStart(3,"0")}`,fichaId:"",version:"v1",estado:"Borrador",desc:"",operaciones:[]});
    setModal("form");
  }
  function abrirEditar(){if(ruta){setForm({...ruta,operaciones:[...ruta.operaciones.map(o=>({...o}))]});setModal("form");}}
  function guardar(){
    if(!form.desc)return;
    if(!rutas.find(r=>r.id===form.id)){setRutas(p=>[...p,form]);setSel(form.id);}
    else{setRutas(p=>p.map(r=>r.id===form.id?form:r));}
    setModal(null);
  }
  function eliminar(){setRutas(p=>p.filter(r=>r.id!==sel));setSel(null);setConfirm(null);}
  function addOp(){setForm(p=>({...p,operaciones:[...p.operaciones,{orden:p.operaciones.length+1,nombre:"",maquina:MAQUINAS[0]?.id||"",tmin:0,tmax:0,temp:"",vel_bano:"",vel_centr:"",producto:"",obs:""}]}));}
  function delOp(i){setForm(p=>({...p,operaciones:p.operaciones.filter((_,j)=>j!==i).map((o,j)=>({...o,orden:j+1}))}))}
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  function ffOp(i,k){return e=>setForm(p=>({...p,operaciones:p.operaciones.map((o,j)=>j===i?{...o,[k]:e.target.value}:o)}))}

  return(
    <div style={{display:"flex",gap:14}}>
      <div style={{width:260,flexShrink:0,display:"flex",flexDirection:"column",gap:6}}>
        <button onClick={abrirNueva} style={{...btnPrimary,width:"100%"}}>+ Nueva ruta</button>
        {rutas.map(r=>{
          const act=sel===r.id;const f=fichas.find(fi=>fi.id===r.fichaId);
          return(
            <div key={r.id} onClick={()=>setSel(r.id)} style={{padding:"10px 13px",borderRadius:9,cursor:"pointer",border:`1.5px solid ${act?"#2563eb":"#e5e7eb"}`,background:act?"#eff6ff":"#fff"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontFamily:"monospace",fontSize:10.5,fontWeight:600,color:act?"#1d4ed8":"#9ca3af"}}>{r.id}</span>{badge(r.estado)}</div>
              <div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{f?.desc||r.desc}</div>
              <div style={{fontSize:10.5,color:"#6b7280"}}>{r.operaciones.length} operaciones · {r.version}</div>
            </div>
          );
        })}
      </div>

      {ruta?(
        <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button onClick={abrirEditar} style={{...btnBase,background:"#eff6ff",color:"#1d4ed8",border:"1px solid #93c5fd"}}>✏ Editar</button>
            <button onClick={()=>setConfirm(true)} style={{...btnBase,background:"#fef2f2",color:"#b91c1c",border:"1px solid #fca5a5"}}>🗑 Eliminar</button>
          </div>
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"16px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div><div style={{fontSize:15,fontWeight:700}}>{ruta.desc}</div><div style={{fontSize:11,color:"#9ca3af",marginTop:2,fontFamily:"monospace"}}>{ruta.id} · {ruta.version}</div></div>
              {badge(ruta.estado)}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:0}}>
              {ruta.operaciones.map((op,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"28px 1fr",gap:10,alignItems:"stretch"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:"#1e3a5f",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{op.orden}</div>
                    {i<ruta.operaciones.length-1&&<div style={{flex:1,width:2,background:"#e5e7eb",margin:"3px 0",minHeight:20}}/>}
                  </div>
                  <div style={{background:"#f8fafc",borderRadius:9,padding:"10px 14px",marginBottom:8,border:"1px solid #e5e7eb"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <div style={{fontSize:13,fontWeight:700}}>{op.nombre}</div>
                      <span style={{fontFamily:"monospace",fontSize:11,color:"#6b7280"}}>{op.tmin}–{op.tmax} min</span>
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {[[op.maquina],[op.producto],op.temp&&`${op.temp}°C`,op.vel_bano&&`Vb: ${op.vel_bano}rpm`,op.vel_centr&&`Vc: ${op.vel_centr}rpm`].filter(Boolean).map((v,j)=>(
                        <span key={j} style={{fontSize:11,padding:"3px 8px",borderRadius:5,background:"#fff",border:"0.5px solid #e5e7eb",color:"#374151"}}>{v}</span>
                      ))}
                    </div>
                    {op.obs&&<div style={{marginTop:5,fontSize:10.5,color:"#9ca3af"}}>📝 {op.obs}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ):(
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#9ca3af",fontSize:13}}>← Selecciona una ruta</div>
      )}

      {modal==="form"&&(
        <Modal titulo="Editar ruta de proceso" subtitulo={form.desc} onClose={()=>setModal(null)} onGuardar={guardar} ancho={600}>
          <Row3>
            <Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={inp}/></Campo>
            <Campo label="Versión"><input value={form.version||""} onChange={ff("version")} style={inp}/></Campo>
            <Campo label="Estado"><select value={form.estado||""} onChange={ff("estado")} style={inp}>{["Borrador","Activa","Obsoleta"].map(s=><option key={s}>{s}</option>)}</select></Campo>
          </Row3>
          <Row2>
            <Campo label="Ficha técnica">
              <select value={form.fichaId||""} onChange={ff("fichaId")} style={inp}>
                <option value="">— Sin ficha —</option>
                {fichas.map(f=><option key={f.id} value={f.id}>{f.id} · {f.desc}</option>)}
              </select>
            </Campo>
            <Campo label="Descripción"><input value={form.desc||""} onChange={ff("desc")} style={inp}/></Campo>
          </Row2>
          <Sep label={`Operaciones (${form.operaciones?.length||0})`}/>
          {form.operaciones?.map((op,i)=>(
            <div key={i} style={{border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 14px",background:"#f8fafc",position:"relative"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontWeight:600,fontSize:13,color:"#111827"}}>Operación {op.orden}</span>
                <button onClick={()=>delOp(i)} style={{...btnSm,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>Eliminar</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
                <Campo label="Nombre"><input value={op.nombre||""} onChange={ffOp(i,"nombre")} style={inpSm} placeholder="Granallado, Pretratamiento…"/></Campo>
                <Campo label="Máquina">
                  <select value={op.maquina||""} onChange={ffOp(i,"maquina")} style={inpSm}>
                    {MAQUINAS.filter(m=>m.est!=="Inhabilitada").map(m=><option key={m.id} value={m.id}>{m.id}</option>)}
                  </select>
                </Campo>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:8}}>
                <Campo label="T. mín (min)"><input type="number" value={op.tmin||0} onChange={ffOp(i,"tmin")} style={inpSm}/></Campo>
                <Campo label="T. máx (min)"><input type="number" value={op.tmax||0} onChange={ffOp(i,"tmax")} style={inpSm}/></Campo>
                <Campo label="Temp. (°C)"><input type="number" value={op.temp||""} onChange={ffOp(i,"temp")} style={inpSm}/></Campo>
                <Campo label="Vel. baño"><input type="number" value={op.vel_bano||""} onChange={ffOp(i,"vel_bano")} style={inpSm}/></Campo>
                <Campo label="Vel. centrif."><input type="number" step="0.01" value={op.vel_centr||""} onChange={ffOp(i,"vel_centr")} style={inpSm}/></Campo>
              </div>
              <div style={{marginTop:8}}>
                <Campo label="Producto / Material"><input value={op.producto||""} onChange={ffOp(i,"producto")} style={inpSm} placeholder="Granalla S330, Fosfato Fe…"/></Campo>
              </div>
            </div>
          ))}
          <button onClick={addOp} style={{...btnBase,background:"#f0fdf4",color:"#166534",border:"1px solid #86efac",width:"100%"}}>+ Añadir operación</button>
        </Modal>
      )}
      {confirm&&<ModalConfirm texto={`¿Eliminar la ruta "${ruta?.desc}"?`} onClose={()=>setConfirm(null)} onConfirmar={eliminar}/>}
    </div>
  );
}

// ─── TAB OFERTAS ──────────────────────────────────────────────────
function TabOfertas(){
  const [ofertas,setOfertas] = useState(OFERTAS_INIT);
  const [sel,setSel]         = useState(null);
  const [modal,setModal]     = useState(null);
  const [confirm,setConfirm] = useState(null);
  const [form,setForm]       = useState({});
  const oferta = ofertas.find(o=>o.id===sel);
  const ESTADOS_OF=["Borrador","Enviada","Pendiente","Activa","Rechazada","Caducada"];

  function abrirNueva(){
    setForm({id:`OFT-${String(parseInt(new Date().getTime()/1000)).slice(-4)}`,cli:CLIENTES[0].id,desc:"",proceso:"",precio_kg:"",kg_año:"",estado:"Borrador",fecha:new Date().toISOString().slice(0,10),validez:"",contacto:"",obs:""});
    setModal("form");
  }
  function abrirEditar(){if(oferta){setForm({...oferta});setModal("form");}}
  function guardar(){
    if(!form.desc)return;
    if(!ofertas.find(o=>o.id===form.id)){setOfertas(p=>[...p,form]);setSel(form.id);}
    else{setOfertas(p=>p.map(o=>o.id===form.id?form:o));}
    setModal(null);
  }
  function eliminar(){setOfertas(p=>p.filter(o=>o.id!==sel));setSel(null);setConfirm(null);}
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.type==="number"?parseFloat(e.target.value)||0:e.target.type==="select-one"&&k==="cli"?parseInt(e.target.value):e.target.value}));

  return(
    <div style={{display:"flex",gap:14}}>
      <div style={{width:280,flexShrink:0,display:"flex",flexDirection:"column",gap:6}}>
        <button onClick={abrirNueva} style={{...btnPrimary,width:"100%"}}>+ Nueva oferta</button>
        {ofertas.map(o=>{
          const act=sel===o.id;
          return(
            <div key={o.id} onClick={()=>setSel(o.id)} style={{padding:"10px 13px",borderRadius:9,cursor:"pointer",border:`1.5px solid ${act?"#2563eb":"#e5e7eb"}`,background:act?"#eff6ff":"#fff"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontFamily:"monospace",fontSize:10.5,fontWeight:600,color:act?"#1d4ed8":"#9ca3af"}}>{o.id}</span>{badge(o.estado)}</div>
              <div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{o.desc}</div>
              <div style={{fontSize:10.5,color:"#6b7280"}}>{cn(o.cli)}</div>
              <div style={{fontSize:11,fontFamily:"monospace",fontWeight:600,marginTop:3,color:"#1d4ed8"}}>{o.precio_kg?`${parseFloat(o.precio_kg).toFixed(2)} €/kg`:""}</div>
            </div>
          );
        })}
      </div>

      {oferta?(
        <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button onClick={abrirEditar} style={{...btnBase,background:"#eff6ff",color:"#1d4ed8",border:"1px solid #93c5fd"}}>✏ Editar</button>
            <button onClick={()=>setConfirm(true)} style={{...btnBase,background:"#fef2f2",color:"#b91c1c",border:"1px solid #fca5a5"}}>🗑 Eliminar</button>
          </div>
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"16px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div><div style={{fontSize:16,fontWeight:700}}>{oferta.desc}</div><div style={{fontSize:11,color:"#9ca3af",marginTop:2,fontFamily:"monospace"}}>{oferta.id}</div></div>
              {badge(oferta.estado)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8,marginBottom:10}}>
              {[["Cliente",cn(oferta.cli)],["Precio €/kg",oferta.precio_kg?`${parseFloat(oferta.precio_kg).toFixed(2)} €`:"—"],["Kg/año estimado",oferta.kg_año?`${parseInt(oferta.kg_año).toLocaleString()} kg`:"—"],["Fecha oferta",oferta.fecha||"—"],["Válido hasta",oferta.validez||"—"],["Contacto",oferta.contacto||"—"]].map(([k,v])=>(
                <div key={k} style={{background:"#f8fafc",borderRadius:7,padding:"7px 10px"}}>
                  <div style={{fontSize:9.5,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".05em",marginBottom:2}}>{k}</div>
                  <div style={{fontSize:11.5,fontWeight:500,color:"#111827"}}>{v}</div>
                </div>
              ))}
            </div>
            {oferta.proceso&&<div style={{padding:"8px 12px",background:"#f8fafc",borderRadius:7,fontSize:11.5,color:"#374151",marginBottom:8}}><b>Proceso:</b> {oferta.proceso}</div>}
            {oferta.obs&&<div style={{padding:"9px 12px",background:"#fffbeb",borderRadius:7,fontSize:11.5,color:"#92400e",border:"0.5px solid #fde68a"}}>📝 {oferta.obs}</div>}
          </div>
        </div>
      ):(
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#9ca3af",fontSize:13}}>← Selecciona una oferta</div>
      )}

      {modal==="form"&&(
        <Modal titulo={!ofertas.find(o=>o.id===form.id)?"Nueva oferta":"Editar oferta"} subtitulo={form.desc} onClose={()=>setModal(null)} onGuardar={guardar}>
          <Row2>
            <Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={inp}/></Campo>
            <Campo label="Estado"><select value={form.estado||""} onChange={ff("estado")} style={inp}>{ESTADOS_OF.map(s=><option key={s}>{s}</option>)}</select></Campo>
          </Row2>
          <Campo label="Cliente" required>
            <select value={form.cli||""} onChange={e=>setForm(p=>({...p,cli:parseInt(e.target.value)}))} style={inp}>
              {CLIENTES.map(c=><option key={c.id} value={c.id}>{c.n}</option>)}
            </select>
          </Campo>
          <Campo label="Descripción de la pieza / referencia" required><input value={form.desc||""} onChange={ff("desc")} style={inp} placeholder="Nombre pieza y proceso…"/></Campo>
          <Campo label="Proceso completo"><input value={form.proceso||""} onChange={ff("proceso")} style={inp} placeholder="FOSFATADO + GRANALLADO + …"/></Campo>
          <Row3>
            <Campo label="Precio €/kg"><input type="number" step="0.001" value={form.precio_kg||""} onChange={ff("precio_kg")} style={inp}/></Campo>
            <Campo label="Kg/año estimado"><input type="number" value={form.kg_año||""} onChange={ff("kg_año")} style={inp}/></Campo>
            <Campo label="Contacto cliente"><input value={form.contacto||""} onChange={ff("contacto")} style={inp} placeholder="email o nombre"/></Campo>
          </Row3>
          <Row2>
            <Campo label="Fecha oferta"><input type="date" value={form.fecha||""} onChange={ff("fecha")} style={inp}/></Campo>
            <Campo label="Válida hasta"><input type="date" value={form.validez||""} onChange={ff("validez")} style={inp}/></Campo>
          </Row2>
          <Campo label="Observaciones"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...inp,resize:"vertical",fontFamily:"inherit"}} placeholder="Condiciones especiales, notas…"/></Campo>
        </Modal>
      )}
      {confirm&&<ModalConfirm texto={`¿Eliminar la oferta "${oferta?.desc}"?`} onClose={()=>setConfirm(null)} onConfirmar={eliminar}/>}
    </div>
  );
}

// ─── MÓDULO PRINCIPAL ─────────────────────────────────────────────

// ─── TAB: RECOMENDADOR CENTRÍFUGA (IA) ───────────────────────────
const HISTORIAL_CENTRIFUGA = {"TWIN44":{"F4":{"desc":"Delicada lenta — piezas sensibles (sub-ensamblajes, geometría irregular). Tiempo de centrifugado largo.","params":{"V_Centr":160,"T_Centr":90,"Giros":1,"Kg_cesta":76},"ejemplos":["MUNTATU Baugruppe SUB-assembly","rastscheiben R","rastscheiben L"],"n_refs":8},"F1":{"desc":"Estándar pesada — piezas comunes (tornillos, clips, bulones) en cesta ≥60 kg. Ciclo estándar.","params":{"V_Centr":180,"T_Centr":60,"Giros":1,"Kg_cesta":80},"ejemplos":["RF5X20","5x16","BOLT SCREW MACHINE M8","FT5x12","3x10","TORX M6X22"],"n_refs":158},"F3":{"desc":"Velocidad reducida pesada — piezas que no toleran alta velocidad pero cesta llena.","params":{"V_Centr":155,"T_Centr":56,"Giros":1,"Kg_cesta":80},"ejemplos":["MUELLE","DIN 961 AM12x1.50x45 - 8.8","Raststueck"],"n_refs":56},"F5":{"desc":"Centrifugado rápido — piezas sólidas de geometría simple que necesitan escurrido agresivo.","params":{"V_Centr":192,"T_Centr":29,"Giros":1,"Kg_cesta":50},"ejemplos":["TENPLATU ETA IRAOTU","CLIP","DREHFALLE"],"n_refs":19},"F2":{"desc":"Estándar ligera — misma velocidad que F1 pero cesta <60 kg.","params":{"V_Centr":180,"T_Centr":60,"Giros":1,"Kg_cesta":45},"ejemplos":["PLACA RESBALON","BLOCKER","MUELLE LARGO NEGRO"],"n_refs":13},"F3b":{"desc":"Velocidad reducida ligera — piezas delicadas en lote pequeño.","params":{"V_Centr":144,"T_Centr":44,"Giros":1,"Kg_cesta":40},"ejemplos":["DIN 6921 CM8x1.50-8.8","CLIP PUSH ON"],"n_refs":5}},"TWIN02":{"F1":{"desc":"Alta velocidad multi-giro — arandelas grandes, piezas planas que retienen líquido.","params":{"V_Centr":281,"T_Centr":23,"Giros":2,"Kg_cesta":76},"ejemplos":["Washer ISO 7089 - 48","ARANDELA M27 10","PLACA RESBALON"],"n_refs":36},"F3":{"desc":"Media-alta velocidad corta — bulones y tornillos métricos medianos.","params":{"V_Centr":259,"T_Centr":22,"Giros":1,"Kg_cesta":60},"ejemplos":["BOLT M6 X 10 X 1.0","TORNILLERIA VARIA M20 Y M16"],"n_refs":27},"F5":{"desc":"Velocidad media — muelles, clips, piezas con cavidades.","params":{"V_Centr":237,"T_Centr":24,"Giros":1,"Kg_cesta":61},"ejemplos":["MUELLE","CASQUILLO","GRAPA TAPON"],"n_refs":21},"F2":{"desc":"Alta velocidad 1 giro — tornillos y piezas estándar de alta resistencia.","params":{"V_Centr":280,"T_Centr":20,"Giros":1,"Kg_cesta":67},"ejemplos":["DIN 961 AM12x1.50x45 - 8.8","TORNILLERIA VARIA"],"n_refs":43},"F4":{"desc":"Media-alta velocidad larga — piezas grandes o con roscas profundas.","params":{"V_Centr":260,"T_Centr":32,"Giros":1,"Kg_cesta":54},"ejemplos":["Hexagon nut AD M36-10","MUELLE","BUSHING SPACER"],"n_refs":11},"F6":{"desc":"Velocidad baja / outlier — piezas muy grandes o muy delicadas.","params":{"V_Centr":185,"T_Centr":28,"Giros":1,"Kg_cesta":59},"ejemplos":["Washer A/D CENBNFCR0491 M48","DISTANCIADOR M24x22"],"n_refs":5}}};

function TabRecomendador(){
  const [maq,    setMaq]    = useState("TWIN44");
  const [kg,     setKg]     = useState("");
  const [desc,   setDesc]   = useState("");
  const [imagen, setImagen] = useState(null); // {b64, mime, url}
  const [estado, setEstado] = useState("idle"); // idle | loading | result | error
  const [result, setResult] = useState(null);
  const [error,  setError]  = useState("");
  const [msgIdx, setMsgIdx] = useState(0);

  const MSGS = ["Analizando geometría de la pieza...","Comparando con historial de homologaciones...","Determinando familia y parámetros..."];
  const CONF_STYLE = {
    alta:  {bg:"#f0fdf4",tx:"#166534",bd:"#86efac"},
    media: {bg:"#fffbeb",tx:"#92400e",bd:"#fde68a"},
    baja:  {bg:"#fef2f2",tx:"#b91c1c",bd:"#fca5a5"},
  };

  function handleFile(file){
    if(!file||!file.type.startsWith("image/"))return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const data=ev.target.result;
      setImagen({b64:data.split(",")[1],mime:file.type,url:data});
      setResult(null); setError("");
    };
    reader.readAsDataURL(file);
  }

  function buildPrompt(){
    const hist=JSON.stringify(HISTORIAL_CENTRIFUGA[maq],null,1);
    return `Eres un experto en procesos de centrifugado industrial para recubrimientos de piezas metálicas (zinc-níquel, zinc flake, etc.) en máquinas centrífugas TWIN de doble cesta.

MÁQUINA SELECCIONADA: ${maq}

HISTORIAL DE HOMOLOGACIONES:
${hist}

${kg?`PESO DEL LOTE: ${kg} kg`:""}
${desc?`DESCRIPCIÓN: ${desc}`:""}

Analiza la imagen de la pieza/lote adjunta y determina qué familia de centrifugado corresponde.
Factores clave: tipo de pieza, geometría, tamaño, superficie, fragilidad.

Responde ÚNICAMENTE con JSON válido:
{
  "familia":"código (ej: F1)",
  "familia_nombre":"nombre descriptivo",
  "familia_desc":"descripción",
  "V_Centr":número (rpm),
  "T_Centr":número (segundos),
  "Giros":número,
  "Kg_cesta":número (kg),
  "confianza":"alta"|"media"|"baja",
  "razonamiento":"explicación detallada en español",
  "alertas":["alertas si las hay"],
  "similares_historial":["hasta 4 piezas similares del historial"]
}
Sin texto adicional, sin markdown.`;
  }

  async function analizar(){
    if(!imagen)return;
    setEstado("loading"); setResult(null); setError("");
    let mi=0; setMsgIdx(0);
    const interval=setInterval(()=>{ mi=(mi+1)%MSGS.length; setMsgIdx(mi); },1800);
    try{
      const resp=await fetch("/anthropic/v1/messages",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "anthropic-dangerous-direct-browser-access":"true",
        },
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{role:"user",content:[
            {type:"image",source:{type:"base64",media_type:imagen.mime,data:imagen.b64}},
            {type:"text",text:buildPrompt()}
          ]}]
        })
      });
      clearInterval(interval);
      const data=await resp.json();
      if(data.error)throw new Error(data.error.message);
      const raw=data.content.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim();
      setResult(JSON.parse(raw));
      setEstado("result");
    }catch(err){
      clearInterval(interval);
      setError("Error al analizar: "+(err.message||"Inténtalo de nuevo."));
      setEstado("error");
    }
  }

  const inpStyle={border:"1.5px solid #d1d5db",borderRadius:8,padding:"8px 11px",fontSize:13,color:"#111827",background:"#fff",outline:"none",width:"100%",boxSizing:"border-box"};

  return(
    <div style={{maxWidth:680,display:"flex",flexDirection:"column",gap:14}}>
      {/* Cabecera */}
      <div style={{background:"#eff6ff",border:"0.5px solid #93c5fd",borderRadius:10,padding:"12px 16px"}}>
        <div style={{fontWeight:700,fontSize:14,color:"#1d4ed8",marginBottom:3}}>✦ Recomendador IA — Parámetros de centrífuga</div>
        <div style={{fontSize:12,color:"#1d4ed8",opacity:.8}}>Sube una foto de la pieza y la IA comparará con el historial de homologaciones para recomendar los parámetros óptimos.</div>
      </div>

      {/* Selector máquina */}
      <div>
        <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:8}}>Máquina</label>
        <div style={{display:"flex",gap:8}}>
          {["TWIN44","TWIN02"].map(m=>(
            <button key={m} onClick={()=>setMaq(m)} style={{padding:"8px 22px",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:600,border:"1.5px solid",borderColor:maq===m?"#111827":"#d1d5db",background:maq===m?"#111827":"#fff",color:maq===m?"#fff":"#6b7280"}}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Upload / Preview */}
      {!imagen?(
        <label style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,padding:"2.5rem",border:"2px dashed #d1d5db",borderRadius:10,cursor:"pointer",background:"#f9fafb",transition:"all .15s"}}
          onDragOver={e=>{e.preventDefault();}}
          onDrop={e=>{e.preventDefault();handleFile(e.dataTransfer.files[0]);}}>
          <input type="file" accept="image/*" onChange={e=>handleFile(e.target.files[0])} style={{display:"none"}}/>
          <span style={{fontSize:36}}>⬆</span>
          <div style={{fontWeight:600,fontSize:14,color:"#374151"}}>Arrastra la foto aquí o haz clic para seleccionar</div>
          <div style={{fontSize:12,color:"#9ca3af"}}>JPG, PNG, WEBP — foto de la pieza o lote</div>
        </label>
      ):(
        <div style={{position:"relative",borderRadius:10,overflow:"hidden",background:"#f1f5f9"}}>
          <img src={imagen.url} alt="preview" style={{width:"100%",maxHeight:280,objectFit:"contain",display:"block"}}/>
          <button onClick={()=>{setImagen(null);setResult(null);setError("");setEstado("idle");}}
            style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,.55)",border:"none",color:"#fff",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
      )}

      {/* Campos extra */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em"}}>Peso del lote (kg) — opcional</label>
          <input type="number" value={kg} onChange={e=>setKg(e.target.value)} placeholder="ej: 80" style={inpStyle}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em"}}>Descripción — opcional</label>
          <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="ej: tornillo M8 10.9, clip..." style={inpStyle}/>
        </div>
      </div>

      {/* Botón analizar */}
      <button onClick={analizar} disabled={!imagen||estado==="loading"} style={{width:"100%",padding:"13px",background:!imagen||estado==="loading"?"#9ca3af":"#111827",color:"#fff",border:"none",borderRadius:8,fontSize:15,fontWeight:600,cursor:!imagen||estado==="loading"?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        {estado==="loading"?(
          <><span style={{display:"inline-block",width:18,height:18,border:"2.5px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>{MSGS[msgIdx]}</>
        ):(
          <><span>✦</span> Analizar pieza y recomendar parámetros</>
        )}
      </button>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Error */}
      {estado==="error"&&(
        <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:8,padding:"12px 16px",fontSize:13,color:"#b91c1c"}}>{error}</div>
      )}

      {/* Resultado */}
      {estado==="result"&&result&&(()=>{
        const cs=CONF_STYLE[result.confianza]||CONF_STYLE.media;
        return(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {/* Header */}
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontWeight:700,fontSize:15,color:"#111827"}}>Recomendación</span>
              <span style={{fontSize:11,fontWeight:700,background:cs.bg,color:cs.tx,border:`0.5px solid ${cs.bd}`,padding:"3px 10px",borderRadius:20}}>
                Confianza {result.confianza}
              </span>
            </div>

            {/* Familia y parámetros */}
            <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"16px 18px"}}>
              <div style={{fontWeight:700,fontSize:15,color:"#111827",marginBottom:2}}>{result.familia} — {result.familia_nombre}</div>
              <div style={{fontSize:13,color:"#6b7280",marginBottom:14}}>{result.familia_desc}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {[["Velocidad",result.V_Centr,"rpm"],["Tiempo",result.T_Centr,"seg"],["Giros",result.Giros,"ciclos"],["Kg cesta",result.Kg_cesta,"kg"]].map(([l,v,u])=>(
                  <div key={l} style={{background:"#f8fafc",borderRadius:8,padding:"10px 12px",textAlign:"center",border:"1px solid #e5e7eb"}}>
                    <div style={{fontSize:10,color:"#9ca3af",marginBottom:4}}>{l}</div>
                    <div style={{fontSize:22,fontWeight:700,color:"#111827"}}>{v}</div>
                    <div style={{fontSize:10,color:"#9ca3af"}}>{u}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alertas */}
            {result.alertas&&result.alertas.length>0&&(
              <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"12px 16px"}}>
                <div style={{fontWeight:700,fontSize:12,color:"#92400e",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>⚠ Advertencias</div>
                <ul style={{paddingLeft:16,display:"flex",flexDirection:"column",gap:4}}>
                  {result.alertas.map((a,i)=><li key={i} style={{fontSize:13,color:"#78350f"}}>{a}</li>)}
                </ul>
              </div>
            )}

            {/* Razonamiento */}
            <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"14px 16px"}}>
              <div style={{fontWeight:700,fontSize:12,color:"#6b7280",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>Razonamiento</div>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.6}}>{result.razonamiento}</p>
            </div>

            {/* Similares */}
            {result.similares_historial&&result.similares_historial.length>0&&(
              <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"14px 16px"}}>
                <div style={{fontWeight:700,fontSize:12,color:"#6b7280",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>Piezas similares en historial</div>
                <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:4}}>
                  {result.similares_historial.map((s,i)=>(
                    <li key={i} style={{fontSize:13,color:"#6b7280",padding:"4px 0",borderBottom:i<result.similares_historial.length-1?"0.5px solid #f3f4f6":"none"}}>
                      <span style={{color:"#111827",fontWeight:500}}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Botón nueva */}
            <button onClick={()=>{setImagen(null);setResult(null);setEstado("idle");setKg("");setDesc("");}}
              style={{width:"100%",padding:"10px",background:"transparent",border:"1px solid #d1d5db",borderRadius:8,fontSize:14,cursor:"pointer",color:"#6b7280"}}>
              ↩ Analizar otra pieza
            </button>
          </div>
        );
      })()}
    </div>
  );
}


// ─── CALCULADORA DE COSTOS ────────────────────────────────────────
const MAQUINAS_CALC = {
  Esparreguera: {
    "Procesos dinámicos": [
      {id:"PRE-01",label:"PRE-01",reales:60},
      {id:"GR-01", label:"GR-01", reales:""},
      {id:"MN-01", label:"MN-01", reales:25, horno:true},
    ],
  },
  Vitoria: {
    "Procesos dinámicos": [
      {id:"PRE-02", label:"PRE-02",  reales:60},
      {id:"GR-02",  label:"GR-02",   reales:""},
      {id:"TWIN02", label:"TWIN02",  reales:45, horno:true},
      {id:"TWIN44", label:"TWIN44",  reales:40, horno:true},
    ],
    "Procesos estáticos": [
      {id:"DE02",    label:"DE02",     reales:""},
      {id:"DB02",    label:"DB02",     reales:""},
      {id:"GR-BAST", label:"GR-BAST", reales:""},
      {id:"MN Bastid",label:"MN Bastid",reales:250, horno:true},
    ],
    "Ensamblaje": [
      {id:"MALLADO", label:"MALLADO", reales:""},
    ],
  },
};
// Aplanar la lista de máquinas para una planta
function maqList(planta){ return Object.values(MAQUINAS_CALC[planta]||{}).flat(); }
const PRETRAT_DEF = ["Desengrasado","Fosfatado","Granallado"];
const BASECOAT_DEF = ["D. Protekt KL100","D. Protekt KL120"];
const TOPCOAT_DEF = [
  "D. Seal Negro GZ","D. Seal Negro","D. Seal Plata GZ","D. Seal Plata",
  "D. Protekt VH 301","D. Protekt VH 321","D. Protekt VH 315","D. Protekt VH 302 GZ",
  "D. Seal Amarillo","D. Seal Blanco","D. Seal 711 Negro","D. Seal 715 Negro",
  "D. Seal 711 Plata","D. Seal 715 Plata","D. TOP 502 GZ","Delta Lube 10 Verde",
  "D. Protekt VL-440","Aceitado MKR","Aceitado Non Rust 99 DW",
];

const HORNO_PARAMS = {
  "TWIN44":   {temp:"200°C",tiempo:"20 min",descripcion:"Polimerización Basecoat + Topcoat"},
  "TWIN02":   {temp:"200°C",tiempo:"20 min",descripcion:"Polimerización Basecoat + Topcoat"},
  "MN-01":    {temp:"180°C",tiempo:"15 min",descripcion:"Polimerización/Secado"},
  "MN Bastid":{temp:"180°C",tiempo:"15 min",descripcion:"Polimerización/Secado bastidor"},
};
const LOTES_CESTA  = ["0 - 79 (PM)","80 - 249","250 - 999","1000 - x"];
const LOTES_BASTID = ["0 - 50 (PM)","50 - 99","100 - 699","700 - x"];
const REALES_DEF   = {"PRE-01":60,"PRE-02":60,"TWIN02":45,"TWIN44":40,"MN Bastid":250,"MN-01":25};

const thG  = {border:"1px solid #d1d5db",padding:"3px 7px",fontSize:11,background:"#d9d9d9",fontWeight:700};
const thY  = {border:"1px solid #d1d5db",padding:"3px 7px",fontSize:11,background:"#fff2cc",fontWeight:400};
const tdC  = {border:"1px solid #d1d5db",padding:"3px 7px",fontSize:11,textAlign:"center"};
const tdGr = {border:"1px solid #d1d5db",padding:"2px 4px",fontSize:11,background:"#d9ead3",textAlign:"center"};
const INP  = {width:"100%",border:"none",background:"transparent",fontSize:11,outline:"none",padding:0};

// ── Gestión familias de piezas ─────────────────────────────────────
function GestorFamilias({ familias, setFamilias }){
  const [form,setForm] = useState({nombre:"",pesoMin:"",pesoMax:"",formas:"",notas:""});
  const ff = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const inp = {border:"1px solid #e5e7eb",borderRadius:5,padding:"5px 8px",fontSize:12,width:"100%",boxSizing:"border-box",outline:"none"};
  function guardar(){
    if(!form.nombre) return;
    setFamilias(p=>[...p,{...form,id:Date.now()}]);
    setForm({nombre:"",pesoMin:"",pesoMax:"",formas:"",notas:""});
  }
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{fontSize:13,fontWeight:700,color:"#111827"}}>📂 Base de datos de familias de pieza</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 2fr 2fr auto",gap:8,alignItems:"end"}}>
        {[["nombre","Nombre familia (ej. K)"],["pesoMin","Peso mín (g)"],["pesoMax","Peso máx (g)"],["formas","Formas / descripción"],["notas","Notas"]].map(([k,l])=>(
          <div key={k}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",marginBottom:3}}>{l}</div>
            <input value={form[k]} onChange={ff(k)} style={inp} placeholder={l}/>
          </div>
        ))}
        <button onClick={guardar} style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:6,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>+ Añadir</button>
      </div>
      {familias.length>0&&(
        <table style={{borderCollapse:"collapse",fontSize:11,width:"100%"}}>
          <thead>
            <tr style={{background:"#f1f5f9"}}>
              {["Familia","Peso mín","Peso máx","Formas / descripción","Notas",""].map(h=>(
                <th key={h} style={{padding:"6px 10px",textAlign:"left",borderBottom:"1px solid #e2e8f0",color:"#6b7280",fontWeight:700,textTransform:"uppercase",fontSize:10}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {familias.map((f,i)=>(
              <tr key={f.id} style={{background:i%2===0?"#fff":"#f9fafb"}}>
                <td style={{padding:"6px 10px",fontWeight:700,color:"#1d4ed8"}}>{f.nombre}</td>
                <td style={{padding:"6px 10px"}}>{f.pesoMin} g</td>
                <td style={{padding:"6px 10px"}}>{f.pesoMax} g</td>
                <td style={{padding:"6px 10px"}}>{f.formas}</td>
                <td style={{padding:"6px 10px",color:"#6b7280"}}>{f.notas}</td>
                <td style={{padding:"6px 10px"}}>
                  <button onClick={()=>setFamilias(p=>p.filter(x=>x.id!==f.id))}
                    style={{background:"#fee2e2",border:"0.5px solid #fca5a5",color:"#b91c1c",borderRadius:4,padding:"2px 8px",fontSize:10,cursor:"pointer"}}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {familias.length===0&&<div style={{color:"#9ca3af",fontSize:12,textAlign:"center",padding:"20px 0"}}>Sin familias definidas aún. Añade la primera arriba.</div>}
    </div>
  );
}

// ── Calculadora principal ──────────────────────────────────────────
function CalculadoraForm({ planta, familias }){
  const API_KEY = import.meta.env.VITE_ANTHROPIC_KEY;
  const [loading,setLoading]     = useState(false);
  const [loadingFam,setLoadingFam] = useState(false);
  const [error,setError]         = useState("");

  // Foto + familia
  const [fotoB64,setFotoB64]     = useState(null);
  const [fotoPreview,setFotoPreview] = useState(null);
  const [familiaIA,setFamiliaIA] = useState("");

  // Inputs básicos
  const [peso,setPeso]     = useState("");
  const [ancho,setAncho]   = useState("");
  const [alto,setAlto]     = useState("");
  const [largo,setLargo]   = useState("");
  const [familia,setFamilia] = useState("");
  const [reales,setReales] = useState({...REALES_DEF});
  const maquinas = maqList(planta);

  // Pretratamiento
  const [pretratBase]  = useState(PRETRAT_DEF);
  const [pretratExtra, setPretratExtra] = useState([]);
  const [pretratSel,setPretratSel]   = useState({Desengrasado:true,Fosfatado:false,Granallado:true});
  const [newPretrat,setNewPretrat]   = useState("");

  // Recubrimiento
  const [basecoatBase]  = useState(BASECOAT_DEF);
  const [basecoatExtra,setBasecoatExtra] = useState([]);
  const [basecoatSel,setBasecoatSel] = useState({});   // {producto: nCapas}
  const [topcoatBase]   = useState(TOPCOAT_DEF);
  const [topcoatExtra,setTopcoatExtra] = useState([]);
  const [topcoatSel,setTopcoatSel]   = useState({});   // {producto: nCapas}
  const [newBasecoat,setNewBasecoat]   = useState("");
  const [newTopcoat,setNewTopcoat]     = useState("");

  // Resultados
  const [superficie,setSuperficie] = useState("-");
  const [pesoPiezaKg,setPesoPiezaKg] = useState("");
  const [volumen,setVolumen]       = useState("");
  const [kgSug,setKgSug]           = useState({});
  const [tablaCesta,setTablaCesta]   = useState(null);
  const [tablaBastid,setTablaBastid] = useState(null);

  async function cargarFoto(e){
    const file = e.target.files[0];
    if(!file) return;
    const b64 = await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(file);});
    setFotoB64(b64);
    setFotoPreview(URL.createObjectURL(file));
    // Auto-detectar familia si hay peso
    if(peso) detectarFamilia(b64, peso);
  }

  async function detectarFamilia(b64=fotoB64, pesoVal=peso){
    if(!b64||!pesoVal) return;
    setLoadingFam(true);
    const famDB = familias.length>0 ? familias.map(f=>`Familia ${f.nombre}: peso ${f.pesoMin}-${f.pesoMax}g, forma: ${f.formas}. ${f.notas}`).join("\n") : "No hay familias definidas, estima la familia según forma y peso (letras A-T).";
    try{
      const resp = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:100,
          messages:[{role:"user",content:[
            {type:"image",source:{type:"base64",media_type:"image/jpeg",data:b64}},
            {type:"text",text:`Analiza esta pieza metálica. Peso: ${pesoVal}g.\n\nBase de datos familias:\n${famDB}\n\nResponde SOLO con la letra/nombre de familia más adecuada, sin explicación.`}
          ]}]})
      });
      const data = await resp.json();
      const fam = data.content?.find(b=>b.type==="text")?.text?.trim()||"";
      setFamiliaIA(fam);
      setFamilia(fam);
    }catch(e){console.error(e);}
    finally{setLoadingFam(false);}
  }

  function toggleCapas(sel,setSel,prod,defaultN=1){
    setSel(p=>({...p,[prod]:p[prod]?0:defaultN}));
  }
  function setCapas(sel,setSel,prod,n){
    setSel(p=>({...p,[prod]:parseInt(n)||1}));
  }

  const pretratAll = [...pretratBase,...pretratExtra];
  const basecoatAll = [...basecoatBase,...basecoatExtra];
  const topcoatAll  = [...topcoatBase,...topcoatExtra];

  async function calcular(){
    if(!peso){setError("Indica el peso");return;}
    setLoading(true); setError("");
    const pretratActivo = pretratAll.filter(p=>pretratSel[p]);
    const basecoatActivo = basecoatAll.filter(p=>basecoatSel[p]>0).map(p=>`${basecoatSel[p]}x ${p}`);
    const topcoatActivo  = topcoatAll.filter(p=>topcoatSel[p]>0).map(p=>`${topcoatSel[p]}x ${p}`);
    const proceso = [...pretratActivo,...basecoatActivo,...topcoatActivo].join(" + ");

    const realesMap = {};
    maqList(planta).forEach(m=>{if(reales[m.id]!=null&&reales[m.id]!=="")realesMap[m.label]=reales[m.id];});

    const prompt = `Calculadora Torres Gumà planta ${planta}.
Peso: ${peso}g | Dim: ${ancho||"?"}x${alto||"?"}x${largo||"?"}mm | Familia: ${familia||"?"} | Proceso: ${proceso||"sin definir"}
Kg reales/cesta: ${JSON.stringify(realesMap)}

Planta {planta} con secciones: {JSON.stringify(Object.fromEntries(Object.entries(MAQUINAS_CALC[planta]||{}).map(([s,ms])=>[s,ms.map(m=>m.label)]))}).
Calcula como el Excel Torres Gumà. Responde SOLO JSON:
{"superficie":"- cm²","peso_kg":"0.0000","volumen":"0.0000","kg_sugeridos":{"PRE-01":0,"GR-01":0,"MN-01":0,"PRE-02":0,"GR-02":0,"TWIN02":0,"TWIN44":0,"DE02":0,"DB02":0,"GR-BAST":0,"MN Bastid":0,"MALLADO":0},"cesta":[{"lote":"0 - 79 (PM)","c1":0,"c2":0,"c3":0,"c4":0},{"lote":"80 - 249","c1":0,"c2":0,"c3":0,"c4":0},{"lote":"250 - 999","c1":0,"c2":0,"c3":0,"c4":0},{"lote":"1000 - x","c1":0,"c2":0,"c3":0,"c4":0}],"bastidor":[{"lote":"0 - 50 (PM)","c1":0,"c2":0,"c3":0},{"lote":"50 - 99","c1":0,"c2":0,"c3":0},{"lote":"100 - 699","c1":0,"c2":0,"c3":0},{"lote":"700 - x","c1":0,"c2":0,"c3":0}]}`;

    try{
      const resp = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,messages:[{role:"user",content:prompt}]})
      });
      const data = await resp.json();
      if(data.error) throw new Error(data.error.message);
      const r = JSON.parse(data.content?.find(b=>b.type==="text")?.text?.replace(/```json|```/g,"").trim()||"{}");
      setSuperficie(r.superficie||"-");
      setPesoPiezaKg(r.peso_kg||"0.0000");
      setVolumen(r.volumen||"0.0000");
      setKgSug(r.kg_sugeridos||{});
      setTablaCesta(r.cesta||null);
      setTablaBastid(r.bastidor||null);
    }catch(e){setError("Error: "+e.message);}
    finally{setLoading(false);}
  }

  function fmt4(v){return v!=null?Number(v).toLocaleString("es-ES",{minimumFractionDigits:4,maximumFractionDigits:4}):""}

  const sInput = {border:"1px solid #d1d5db",borderRadius:4,padding:"3px 6px",fontSize:11,outline:"none",width:"100%",boxSizing:"border-box"};
  const sChk = (active) => ({display:"flex",alignItems:"center",gap:5,padding:"4px 8px",borderRadius:5,cursor:"pointer",background:active?"#d9ead3":"#f8fafc",border:`0.5px solid ${active?"#6ee7b7":"#e2e8f0"}`,userSelect:"none",fontSize:11});

  return(
    <div style={{display:"flex",gap:14,alignItems:"flex-start",flexWrap:"wrap"}}>

      {/* ── COLUMNA IZQUIERDA ── */}
      <div style={{flex:"0 0 310px",minWidth:280,display:"flex",flexDirection:"column",gap:10}}>

        {/* FOTO + FAMILIA */}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"12px 14px"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:8,borderBottom:"1px solid #f1f5f9",paddingBottom:5}}>📷 Foto de la pieza</div>
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <label style={{cursor:"pointer",flex:1}}>
              <input type="file" accept="image/*" style={{display:"none"}} onChange={cargarFoto}/>
              <div style={{border:"2px dashed #d1d5db",borderRadius:8,padding:"12px",textAlign:"center",fontSize:11,color:"#9ca3af",cursor:"pointer",background:"#f9fafb"}}>
                {fotoPreview?<img src={fotoPreview} style={{maxWidth:"100%",maxHeight:80,objectFit:"contain",borderRadius:5}}/>:"📎 Subir foto"}
              </div>
            </label>
            {fotoPreview&&(
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                <button onClick={()=>detectarFamilia()} disabled={!peso||loadingFam}
                  style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:6,padding:"6px 10px",fontSize:11,cursor:"pointer",fontWeight:700,whiteSpace:"nowrap"}}>
                  {loadingFam?"⏳ Analizando...":"🔍 Detectar familia"}
                </button>
                {familiaIA&&<div style={{fontSize:10,color:"#166534",fontWeight:700,background:"#d1fae5",borderRadius:4,padding:"3px 8px",textAlign:"center"}}>IA → Familia {familiaIA}</div>}
              </div>
            )}
          </div>
        </div>

        {/* PESO + DIMENSIONES */}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,overflow:"hidden"}}>
          <div style={{background:"#bdd7ee",padding:"5px 10px",fontSize:11,fontWeight:700,textAlign:"center"}}>Calculadora prova preu recobriment</div>
          <div style={{background:"#bdd7ee",padding:"4px 10px",fontSize:10,fontWeight:700,textAlign:"center",borderTop:"1px solid #9fc5e8"}}>Indica amb una "A,B,C,D,F,G..."</div>
          <table style={{borderCollapse:"collapse",width:"100%"}}>
            <tbody>
              {[["Especifica pes de la peça (g) *",peso,setPeso],["Ancho (mm)",ancho,setAncho],["Alto (mm)",alto,setAlto],["Largo (mm)",largo,setLargo]].map(([l,v,fn])=>(
                <tr key={l}>
                  <td style={{...thY,width:"65%"}}>{l}</td>
                  <td style={{border:"1px solid #d1d5db",padding:"2px 4px",background:"#fff"}}>
                    <input value={v} onChange={e=>fn(e.target.value)} style={{...INP}}/>
                  </td>
                </tr>
              ))}
              <tr>
                <td style={thY}>Especifica familia de peça</td>
                <td style={{border:"1px solid #d1d5db",padding:"2px 4px",background:"#fff"}}>
                  <input value={familia} onChange={e=>setFamilia(e.target.value.toUpperCase().slice(0,2))} style={{...INP}} placeholder="A-T"/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PRETRATAMIENTO */}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"12px 14px"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:8,borderBottom:"1px solid #f1f5f9",paddingBottom:5}}>🧪 Pretratamiento</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {pretratAll.map(p=>(
              <label key={p} style={sChk(pretratSel[p])} onClick={()=>setPretratSel(x=>({...x,[p]:!x[p]}))}>
                <input type="checkbox" checked={!!pretratSel[p]} readOnly style={{accentColor:"#22c55e"}}/>
                <span>{p}</span>
              </label>
            ))}
            <div style={{display:"flex",gap:5,marginTop:4}}>
              <input value={newPretrat} onChange={e=>setNewPretrat(e.target.value)} placeholder="Añadir producto..."
                style={{...sInput,flex:1}} onKeyDown={e=>{if(e.key==="Enter"&&newPretrat.trim()){setPretratExtra(p=>[...p,newPretrat.trim()]);setPretratSel(x=>({...x,[newPretrat.trim()]:true}));setNewPretrat("");}}}/>
              <button onClick={()=>{if(newPretrat.trim()){setPretratExtra(p=>[...p,newPretrat.trim()]);setPretratSel(x=>({...x,[newPretrat.trim()]:true}));setNewPretrat("");}}}
                style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:5,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>+</button>
            </div>
          </div>
        </div>

        {/* RECUBRIMIENTO - BASECOAT */}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"12px 14px"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:8,borderBottom:"1px solid #f1f5f9",paddingBottom:5}}>🎨 Recubrimiento — Basecoat</div>
          <div style={{fontSize:10,color:"#6b7280",marginBottom:6}}>Nº capas Basecoat (editable para todas las referencias)</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {basecoatAll.map(p=>(
              <div key={p} style={{display:"flex",alignItems:"center",gap:6}}>
                <label style={{...sChk(basecoatSel[p]>0),flex:1}} onClick={()=>toggleCapas(basecoatSel,setBasecoatSel,p)}>
                  <input type="checkbox" checked={!!(basecoatSel[p]>0)} readOnly style={{accentColor:"#2563eb"}}/>
                  <span>{p}</span>
                </label>
                {basecoatSel[p]>0&&(
                  <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                    <button onClick={()=>setCapas(basecoatSel,setBasecoatSel,p,Math.max(1,(basecoatSel[p]||1)-1))} style={{background:"#e5e7eb",border:"none",borderRadius:3,width:20,height:20,cursor:"pointer",fontSize:12,fontWeight:700}}>−</button>
                    <span style={{fontSize:12,fontWeight:700,minWidth:16,textAlign:"center"}}>{basecoatSel[p]}</span>
                    <button onClick={()=>setCapas(basecoatSel,setBasecoatSel,p,(basecoatSel[p]||1)+1)} style={{background:"#e5e7eb",border:"none",borderRadius:3,width:20,height:20,cursor:"pointer",fontSize:12,fontWeight:700}}>+</button>
                  </div>
                )}
              </div>
            ))}
            <div style={{display:"flex",gap:5,marginTop:4}}>
              <input value={newBasecoat} onChange={e=>setNewBasecoat(e.target.value)} placeholder="Añadir producto..."
                style={{...sInput,flex:1}} onKeyDown={e=>{if(e.key==="Enter"&&newBasecoat.trim()){setBasecoatExtra(p=>[...p,newBasecoat.trim()]);setNewBasecoat("");}}}/>
              <button onClick={()=>{if(newBasecoat.trim()){setBasecoatExtra(p=>[...p,newBasecoat.trim()]);setNewBasecoat("");}}}
                style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:5,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>+</button>
            </div>
          </div>
        </div>

        {/* RECUBRIMIENTO - TOPCOAT */}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"12px 14px"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:8,borderBottom:"1px solid #f1f5f9",paddingBottom:5}}>✨ Recubrimiento — Topcoat</div>
          <div style={{fontSize:10,color:"#6b7280",marginBottom:6}}>Nº capas Topcoat (editable)</div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {topcoatAll.map(p=>(
              <div key={p} style={{display:"flex",alignItems:"center",gap:6}}>
                <label style={{...sChk(topcoatSel[p]>0),flex:1}} onClick={()=>toggleCapas(topcoatSel,setTopcoatSel,p)}>
                  <input type="checkbox" checked={!!(topcoatSel[p]>0)} readOnly style={{accentColor:"#7c3aed"}}/>
                  <span>{p}</span>
                </label>
                {topcoatSel[p]>0&&(
                  <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                    <button onClick={()=>setCapas(topcoatSel,setTopcoatSel,p,Math.max(1,(topcoatSel[p]||1)-1))} style={{background:"#e5e7eb",border:"none",borderRadius:3,width:20,height:20,cursor:"pointer",fontSize:12,fontWeight:700}}>−</button>
                    <span style={{fontSize:12,fontWeight:700,minWidth:16,textAlign:"center"}}>{topcoatSel[p]}</span>
                    <button onClick={()=>setCapas(topcoatSel,setTopcoatSel,p,(topcoatSel[p]||1)+1)} style={{background:"#e5e7eb",border:"none",borderRadius:3,width:20,height:20,cursor:"pointer",fontSize:12,fontWeight:700}}>+</button>
                  </div>
                )}
              </div>
            ))}
            <div style={{display:"flex",gap:5,marginTop:4}}>
              <input value={newTopcoat} onChange={e=>setNewTopcoat(e.target.value)} placeholder="Añadir producto..."
                style={{...sInput,flex:1}} onKeyDown={e=>{if(e.key==="Enter"&&newTopcoat.trim()){setTopcoatExtra(p=>[...p,newTopcoat.trim()]);setNewTopcoat("");}}}/>
              <button onClick={()=>{if(newTopcoat.trim()){setTopcoatExtra(p=>[...p,newTopcoat.trim()]);setNewTopcoat("");}}}
                style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:5,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>+</button>
            </div>
          </div>
        </div>

        {/* BOTÓN CALCULAR */}
        <button onClick={calcular} disabled={loading}
          style={{background:loading?"#94a3b8":"#1e3a5f",color:"#fff",border:"none",borderRadius:8,padding:"10px",fontSize:13,fontWeight:700,cursor:loading?"not-allowed":"pointer"}}>
          {loading?"⏳ Calculando...":"⚡ Calcular costos"}
        </button>
        {error&&<div style={{fontSize:11,color:"#b91c1c",fontWeight:600}}>{error}</div>}
      </div>

      {/* ── COLUMNA DERECHA — RESULTADOS ── */}
      <div style={{flex:1,minWidth:380,display:"flex",flexDirection:"column",gap:10}}>



        {/* KG por ciclo — por secciones */}
        <table style={{borderCollapse:"collapse",fontSize:11,width:"100%"}}>
          <thead>
            <tr>
              <td style={{...thG,minWidth:180}}>KG por ciclo</td>
              <td style={{...thG,textAlign:"center",minWidth:80}}>Sugeridos</td>
              <td style={{...thG,textAlign:"center",minWidth:80}}>Reales</td>
            </tr>
          </thead>
          <tbody>
            {Object.entries(MAQUINAS_CALC[planta]||{}).map(([seccion,maquinas])=>(
              <>
                <tr key={seccion}>
                  <td colSpan={3} style={{background:"#1e3a5f",color:"#fff",fontWeight:700,fontSize:10,padding:"3px 8px",textTransform:"uppercase",letterSpacing:".06em"}}>
                    {seccion}
                  </td>
                </tr>
                {maquinas.map(m=>(
                  <React.Fragment key={m.id}>
                    <tr>
                      <td style={thY}>{m.label}</td>
                      <td style={tdC}>{kgSug[m.label]!=null?fmt4(kgSug[m.label]):""}</td>
                      <td style={tdGr}>
                        <input value={reales[m.id]??m.reales??""} onChange={e=>setReales(p=>({...p,[m.id]:e.target.value}))} style={{...INP,background:"transparent"}}/>
                      </td>
                    </tr>
                    {m.horno&&(
                      <tr style={{background:"#fff7ed"}}>
                        <td colSpan={3} style={{padding:"2px 8px 2px 20px",fontSize:10,color:"#c2410c",fontStyle:"italic",border:"1px solid #fed7aa"}}>
                          🔥 Horno: {HORNO_PARAMS[m.id]?.temp||"—"} · {HORNO_PARAMS[m.id]?.tiempo||"—"} — {HORNO_PARAMS[m.id]?.descripcion||"Polimerización/Secado"}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </>
            ))}
          </tbody>
        </table>

        {/* CISTELLA */}
        <table style={{borderCollapse:"collapse",fontSize:11}}>
          <thead>
            <tr>
              <td style={thG} rowSpan={2}>CISTELLA</td>
              <td colSpan={4} style={{...thG,textAlign:"center",background:"#cfe2f3"}}>Produccions anuals</td>
            </tr>
            <tr>
              {[["Prio 1/2: No aplica","Prio 3/4: 0-2999"],["Prio 1/2: 0-9999","Prio 3/4: 3000-9999"],["Prio 1/2: 10k-99k","Prio 3/4: 10k-99k"],["100000 - x"]].map((h,i)=>(
                <td key={i} style={{...thG,background:"#fff2cc",fontSize:9,textAlign:"center"}}>{Array.isArray(h)?h.join("\n"):h}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {(tablaCesta||LOTES_CESTA.map(l=>({lote:l}))).map((r,i)=>(
              <tr key={i}><td style={thY}>{r.lote}</td>{["c1","c2","c3","c4"].map(c=><td key={c} style={tdC}>{r[c]!=null?fmt4(r[c]):""}</td>)}</tr>
            ))}
          </tbody>
        </table>

        {/* BASTIDOR */}
        <table style={{borderCollapse:"collapse",fontSize:11}}>
          <thead>
            <tr>
              <td style={thG}>BASTIDOR</td>
              <td colSpan={3} style={{...thG,textAlign:"center",background:"#cfe2f3"}}>Produccions anuals</td>
            </tr>
            <tr>
              {["Produccions lots (unitats)","0-699","700 - 4999","5000 - x"].map((h,i)=>(
                <td key={i} style={{...thG,background:"#fff2cc",fontSize:10,textAlign:"center"}}>{h}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {(tablaBastid||LOTES_BASTID.map(l=>({lote:l}))).map((r,i)=>(
              <tr key={i}><td style={thY}>{r.lote}</td>{["c1","c2","c3"].map(c=><td key={c} style={tdC}>{r[c]!=null?fmt4(r[c]):""}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Tab principal con sub-tabs ──────────────────────────────────────
function TabCalculadoras(){
  const [subTab,setSubTab] = useState("calc");
  const [planta,setPlanta] = useState("Esparreguera");
  const [familias,setFamilias] = useState([]);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {/* Sub-tabs + planta */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",gap:2,background:"#f1f5f9",borderRadius:8,padding:3}}>
          {[["calc","⚡ Calculadora"],["familias","📂 Familias de pieza"]].map(([v,l])=>(
            <button key={v} onClick={()=>setSubTab(v)}
              style={{padding:"6px 14px",borderRadius:6,fontSize:12,fontWeight:subTab===v?700:400,cursor:"pointer",
                background:subTab===v?"#fff":"transparent",color:subTab===v?"#1d4ed8":"#6b7280",
                border:subTab===v?"1px solid #e2e8f0":"none",boxShadow:subTab===v?"0 1px 3px rgba(0,0,0,.08)":"none"}}>
              {l}
            </button>
          ))}
        </div>
        {subTab==="calc"&&(
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <span style={{fontSize:11,color:"#6b7280"}}>Planta:</span>
            {["Esparreguera","Vitoria"].map(p=>(
              <button key={p} onClick={()=>setPlanta(p)}
                style={{padding:"4px 12px",borderRadius:6,fontSize:11,fontWeight:planta===p?700:400,cursor:"pointer",
                  background:planta===p?"#1e3a5f":"#f1f5f9",color:planta===p?"#fff":"#374151",
                  border:planta===p?"none":"1px solid #e2e8f0"}}>
                {p==="Vitoria"?"🏙":"🌿"} {p}
              </button>
            ))}
          </div>
        )}
      </div>
      {subTab==="calc"    && <CalculadoraForm planta={planta} familias={familias}/>}
      {subTab==="familias"&& <GestorFamilias familias={familias} setFamilias={setFamilias}/>}
    </div>
  );
}


export default function OficinaTecnica(){
  const [tab,setTab]   = useState("fichas");
  const [fichas,setFichas] = useState(FICHAS_INIT);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <Tabs items={[["fichas","Fichas técnicas"],["recetas","Recetas máquina"],["rutas","Rutas proceso"],["ofertas","Ofertas"],["calc","🧮 Calculadoras"],["ia","✦ Recomendador IA"]]} cur={tab} onChange={setTab}/>
      {tab==="fichas"  && <TabFichas/>}
      {tab==="recetas" && <TabRecetas fichas={fichas}/>}
      {tab==="rutas"   && <TabRutas fichas={fichas}/>}
      {tab==="ofertas" && <TabOfertas/>}
      {tab==="calc"    && <TabCalculadoras/>}
      {tab==="ia"      && <TabRecomendador/>}
    </div>
  );
}
