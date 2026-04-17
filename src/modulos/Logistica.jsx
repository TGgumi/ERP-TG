// src/modulos/Logistica.jsx
import { useState } from "react";
import { Tabs, Card, KRow, Bdg } from "../ui";

const mo = { fontFamily:"monospace", fontSize:11 };
const MI = { border:"1.5px solid #d1d5db", borderRadius:8, padding:"8px 11px", fontSize:13, color:"#111827", background:"#fff", outline:"none", width:"100%", boxSizing:"border-box" };
const ML = { fontSize:11, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".05em", marginBottom:4, display:"block" };
const MB = { border:"none", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600, padding:"7px 16px" };
const MBP = { ...MB, background:"#2563eb", color:"#fff" };
const MBG = { ...MB, background:"transparent", border:"1px solid #d1d5db", color:"#374151" };
const MBD = { ...MB, background:"#dc2626", color:"#fff" };
const MBS = { ...MB, padding:"4px 10px", fontSize:11 };

function Campo({ label, required, children }){
  return <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={ML}>{label}{required&&<span style={{color:"#ef4444",marginLeft:2}}>*</span>}</label>{children}</div>;
}
function G2({children}){ return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{children}</div>; }
function G3({children}){ return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>{children}</div>; }

function ModalBase({ titulo, subtitulo, onClose, onGuardar, ancho=560, children }){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,padding:16}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:14,width:ancho,maxWidth:"98%",maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 25px 50px rgba(0,0,0,.25)",overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #f3f4f6",background:"#fafafa",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexShrink:0}}>
          <div>
            <div style={{fontWeight:700,fontSize:15,color:"#111827"}}>{titulo}</div>
            {subtitulo&&<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{subtitulo}</div>}
          </div>
          <button onClick={onClose} style={{background:"#f3f4f6",border:"none",cursor:"pointer",width:30,height:30,borderRadius:"50%",fontSize:16,color:"#6b7280",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"18px 20px",display:"flex",flexDirection:"column",gap:12}}>{children}</div>
        <div style={{padding:"12px 20px",borderTop:"1px solid #f3f4f6",display:"flex",justifyContent:"flex-end",gap:10,background:"#fafafa",flexShrink:0}}>
          <button onClick={onClose} style={MBG}>Cancelar</button>
          <button onClick={onGuardar} style={MBP}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
function ModalConfirm({texto,onClose,onConfirmar}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:700}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:12,padding:"24px 28px",maxWidth:420,width:"90%",boxShadow:"0 20px 40px rgba(0,0,0,.2)"}}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:8}}>Confirmar eliminación</div>
        <div style={{fontSize:13,color:"#6b7280",marginBottom:20}}>{texto}</div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
          <button onClick={onClose} style={MBG}>Cancelar</button>
          <button onClick={onConfirmar} style={MBD}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

// ─── TIPOS DE PINTURA DISPONIBLES ────────────────────────────────
const TIPOS_PINTURA = [
  "KL120 Negro GZ","KL100 Negro GZ","KL100 Plata","VH302","Deltalube",
  "KL120 Plata","Disolvente xileno","Disolvente butanol","Additive H7064",
  "Gardobond A4957","NaCl (sal)","SIDAFLOC","Otro",
];

// ─── DATOS INICIALES POR APQ ──────────────────────────────────────
const APQ_IDS = [
  { id:"apq_esp",      label:"APQ Esparreguera",           color:"#185FA5", ubicacion:"Esparreguera" },
  { id:"apq_esp_int",  label:"APQ Esparreguera Intermedio",color:"#0F6E56", ubicacion:"Esparreguera" },
  { id:"apq_vit",      label:"APQ Vitoria",                color:"#92400e", ubicacion:"Vitoria" },
];

const STOCK_INIT = {
  apq_esp: [
    { id:"S-001", tipo:"KL120 Negro GZ",   cantidad:800,  unidad:"L",  lote:"L2026-0312", fecha_entrada:"2026-03-15", obs:"" },
    { id:"S-002", tipo:"KL100 Plata",       cantidad:300,  unidad:"L",  lote:"L2026-0298", fecha_entrada:"2026-03-08", obs:"" },
    { id:"S-003", tipo:"Disolvente xileno", cantidad:200,  unidad:"L",  lote:"D2026-011",  fecha_entrada:"2026-03-10", obs:"" },
    { id:"S-004", tipo:"Additive H7064",    cantidad:60,   unidad:"L",  lote:"A2026-005",  fecha_entrada:"2026-02-28", obs:"" },
  ],
  apq_esp_int: [
    { id:"S-101", tipo:"KL120 Negro GZ",   cantidad:160,  unidad:"L",  lote:"L2026-0312", fecha_entrada:"2026-03-17", obs:"Reposición desde APQ principal" },
    { id:"S-102", tipo:"Disolvente xileno", cantidad:40,   unidad:"L",  lote:"D2026-011",  fecha_entrada:"2026-03-17", obs:"" },
  ],
  apq_vit: [
    { id:"S-201", tipo:"KL100 Negro GZ",   cantidad:400,  unidad:"L",  lote:"L2026-0301", fecha_entrada:"2026-03-12", obs:"" },
    { id:"S-202", tipo:"VH302",             cantidad:150,  unidad:"L",  lote:"V2026-009",  fecha_entrada:"2026-03-05", obs:"" },
    { id:"S-203", tipo:"Disolvente butanol",cantidad:100,  unidad:"L",  lote:"D2026-010",  fecha_entrada:"2026-03-10", obs:"" },
  ],
};

const MOVIMIENTOS_INIT = {
  apq_esp:     [],
  apq_esp_int: [
    { id:"M-101", fecha:"2026-03-17", tipo:"Entrada", material:"KL120 Negro GZ", cantidad:160, unidad:"L", origen:"APQ Esparreguera", destino:"APQ Esparreguera Intermedio", medio:"Traspaleta eléctrica", operario:"D. Gil", obs:"" },
  ],
  apq_vit: [],
};

// ─── COMPONENTE APQ ───────────────────────────────────────────────
function TabAPQ({ apqId, apqLabel, apqColor }){
  const [stock,setStock]   = useState(STOCK_INIT[apqId]||[]);
  const [movs,setMovs]     = useState(MOVIMIENTOS_INIT[apqId]||[]);
  const [modalStock,setModalStock] = useState(false);
  const [modalMov,setModalMov]     = useState(false);
  const [confirm,setConfirm]       = useState(null);
  const [formStock,setFormStock]   = useState({});
  const [formMov,setFormMov]       = useState({});
  const [vista,setVista]           = useState("stock"); // "stock" | "movimientos"

  // ── Stock ──
  function abrirNuevoStock(){
    setFormStock({id:`S-${apqId.slice(-3).toUpperCase()}-${String(stock.length+1).padStart(3,"0")}`,tipo:TIPOS_PINTURA[0],cantidad:0,unidad:"L",lote:"",fecha_entrada:new Date().toISOString().slice(0,10),obs:""});
    setModalStock(true);
  }
  function guardarStock(){
    if(!formStock.tipo)return;
    const reg={...formStock,cantidad:parseFloat(formStock.cantidad)||0};
    if(!stock.find(s=>s.id===formStock.id)){setStock(p=>[...p,reg]);}
    else{setStock(p=>p.map(s=>s.id===formStock.id?reg:s));}
    setModalStock(false);
  }
  function eliminarStock(id){ setStock(p=>p.filter(s=>s.id!==id)); setConfirm(null); }

  // ── Movimientos ──
  function abrirNuevoMov(){
    setFormMov({id:`M-${apqId.slice(-3).toUpperCase()}-${String(movs.length+1).padStart(3,"0")}`,fecha:new Date().toISOString().slice(0,10),tipo:"Entrada",material:TIPOS_PINTURA[0],cantidad:0,unidad:"L",origen:"",destino:apqLabel,medio:"",operario:"",obs:""});
    setModalMov(true);
  }
  function guardarMov(){
    if(!formMov.material)return;
    const reg={...formMov,cantidad:parseFloat(formMov.cantidad)||0};
    setMovs(p=>[reg,...p]);
    // Actualizar stock si es Entrada
    if(formMov.tipo==="Entrada"){
      const existe=stock.find(s=>s.tipo===formMov.material);
      if(existe){setStock(p=>p.map(s=>s.tipo===formMov.material?{...s,cantidad:+(s.cantidad+parseFloat(formMov.cantidad)).toFixed(1)}:s));}
      else{setStock(p=>[...p,{id:`S-${apqId.slice(-3).toUpperCase()}-${String(p.length+1).padStart(3,"0")}`,tipo:formMov.material,cantidad:parseFloat(formMov.cantidad)||0,unidad:formMov.unidad,lote:"",fecha_entrada:formMov.fecha,obs:""}]);}
    }
    if(formMov.tipo==="Salida"){
      setStock(p=>p.map(s=>s.tipo===formMov.material?{...s,cantidad:Math.max(0,+(s.cantidad-parseFloat(formMov.cantidad)).toFixed(1))}:s));
    }
    setModalMov(false);
  }

  const ff_s=k=>e=>setFormStock(p=>({...p,[k]:e.target.value}));
  const ff_m=k=>e=>setFormMov(p=>({...p,[k]:e.target.value}));

  const totalItems = stock.length;
  const stockBajo  = stock.filter(s=>s.cantidad<20).length;
  const totalL     = stock.filter(s=>s.unidad==="L").reduce((a,s)=>a+s.cantidad,0);
  const totalKg    = stock.filter(s=>s.unidad==="kg").reduce((a,s)=>a+s.cantidad,0);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10}}>
        {[
          {l:"Líneas de producto",v:totalItems},
          {l:"Total litros",      v:`${totalL.toLocaleString()} L`},
          {l:"Total kg",          v:`${totalKg.toLocaleString()} kg`},
          {l:"Stock bajo (<20)",  v:stockBajo, c:stockBajo>0?"#b91c1c":undefined, bg:stockBajo>0?"#fef2f2":"#f8fafc"},
        ].map(k=>(
          <div key={k.l} style={{background:k.bg||"#f8fafc",border:`1px solid ${k.c?"#fca5a5":"#e2e8f0"}`,borderRadius:10,padding:"11px 14px"}}>
            <div style={{fontSize:10,color:k.c||"#9ca3af",textTransform:"uppercase",letterSpacing:".05em",fontWeight:500,marginBottom:4}}>{k.l}</div>
            <div style={{fontSize:20,fontWeight:700,color:k.c||"#111827"}}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* Alertas stock bajo */}
      {stockBajo>0&&(
        <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#b91c1c",fontWeight:600}}>
          ⚠ {stockBajo} producto{stockBajo>1?"s":""} con stock bajo (&lt;20 unidades): {stock.filter(s=>s.cantidad<20).map(s=>`${s.tipo} (${s.cantidad} ${s.unidad})`).join(", ")}
        </div>
      )}

      {/* Selector vista */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:6}}>
          {[["stock","📦 Stock actual"],["movimientos","🔄 Movimientos"]].map(([v,l])=>(
            <button key={v} onClick={()=>setVista(v)} style={{padding:"6px 14px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:vista===v?700:500,border:`1px solid ${vista===v?apqColor:"#e5e7eb"}`,background:vista===v?apqColor+"18":"#fff",color:vista===v?apqColor:"#6b7280"}}>{l}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          {vista==="stock"&&<button onClick={abrirNuevoStock} style={{...MBP,fontSize:11}}>+ Añadir producto</button>}
          {vista==="movimientos"&&<button onClick={abrirNuevoMov} style={{...MBP,fontSize:11,background:apqColor}}>+ Registrar movimiento</button>}
        </div>
      </div>

      {/* Vista Stock */}
      {vista==="stock"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
          {stock.map(s=>{
            const bajo = s.cantidad<20;
            return(
              <div key={s.id} style={{background:"#fff",border:`1.5px solid ${bajo?"#fca5a5":"#e5e7eb"}`,borderRadius:10,padding:"12px 14px",display:"flex",flexDirection:"column",gap:6}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#111827",flex:1,marginRight:8}}>{s.tipo}</div>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={()=>{setFormStock({...s});setModalStock(true);}} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd",padding:"2px 7px"}}>✏</button>
                    <button onClick={()=>setConfirm(s.id)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5",padding:"2px 7px"}}>🗑</button>
                  </div>
                </div>
                <div style={{fontSize:28,fontWeight:700,color:bajo?"#b91c1c":apqColor}}>
                  {s.cantidad.toLocaleString()} <span style={{fontSize:14,fontWeight:500,color:"#6b7280"}}>{s.unidad}</span>
                </div>
                {bajo&&<div style={{fontSize:10,fontWeight:700,color:"#b91c1c",background:"#fef2f2",padding:"2px 8px",borderRadius:4,display:"inline-block"}}>⚠ Stock bajo</div>}
                <div style={{fontSize:10.5,color:"#9ca3af"}}>Lote: {s.lote||"—"} · Entrada: {s.fecha_entrada}</div>
                {s.obs&&<div style={{fontSize:11,color:"#6b7280",fontStyle:"italic"}}>{s.obs}</div>}
                {/* Mini barra visual */}
                <div style={{height:4,background:"#f1f5f9",borderRadius:2,overflow:"hidden",marginTop:2}}>
                  <div style={{height:"100%",width:`${Math.min((s.cantidad/500)*100,100)}%`,background:bajo?"#ef4444":apqColor,borderRadius:2}}/>
                </div>
              </div>
            );
          })}
          {stock.length===0&&(
            <div style={{gridColumn:"1/-1",textAlign:"center",padding:40,color:"#9ca3af",fontSize:13,background:"#f9fafb",borderRadius:10,border:"1px dashed #e5e7eb"}}>
              Sin productos en este APQ
            </div>
          )}
        </div>
      )}

      {/* Vista Movimientos */}
      {vista==="movimientos"&&(
        <div style={{overflowX:"auto",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
            <thead><tr style={{background:"#f8fafc"}}>{["ID","Fecha","Tipo","Material","Cantidad","Origen","Destino","Medio","Operario","Obs."].map(col=><th key={col} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:600,textTransform:"uppercase",color:"#9ca3af",borderBottom:"1px solid #f3f4f6",whiteSpace:"nowrap"}}>{col}</th>)}</tr></thead>
            <tbody>
              {movs.map(m=>(
                <tr key={m.id}>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:600}}>{m.id}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{m.fecha}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:m.tipo==="Entrada"?"#f0fdf4":"#fef2f2",color:m.tipo==="Entrada"?"#166534":"#b91c1c",border:`0.5px solid ${m.tipo==="Entrada"?"#86efac":"#fca5a5"}`}}>{m.tipo==="Entrada"?"↓ Entrada":"↑ Salida"}</span>
                  </td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontWeight:500}}>{m.material}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:700}}>{m.cantidad} {m.unidad}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11,color:"#6b7280"}}>{m.origen||"—"}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11,color:"#6b7280"}}>{m.destino||"—"}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11}}>{m.medio||"—"}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11}}>{m.operario||"—"}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11,color:"#6b7280"}}>{m.obs||"—"}</td>
                </tr>
              ))}
              {movs.length===0&&<tr><td colSpan={10} style={{padding:24,textAlign:"center",color:"#9ca3af",fontSize:12}}>Sin movimientos registrados</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal nuevo/editar producto */}
      {modalStock&&(
        <ModalBase titulo={!stock.find(s=>s.id===formStock.id)?"Añadir producto al APQ":"Editar producto"} subtitulo={apqLabel} onClose={()=>setModalStock(false)} onGuardar={guardarStock}>
          <Campo label="Tipo de producto / pintura" required>
            <select value={formStock.tipo||""} onChange={ff_s("tipo")} style={MI}>
              {TIPOS_PINTURA.map(t=><option key={t}>{t}</option>)}
            </select>
          </Campo>
          <G3>
            <Campo label="Cantidad" required><input type="number" step="0.1" value={formStock.cantidad||0} onChange={ff_s("cantidad")} style={MI}/></Campo>
            <Campo label="Unidad"><select value={formStock.unidad||"L"} onChange={ff_s("unidad")} style={MI}>{["L","kg","ud","saco"].map(u=><option key={u}>{u}</option>)}</select></Campo>
            <Campo label="Lote"><input value={formStock.lote||""} onChange={ff_s("lote")} style={MI}/></Campo>
          </G3>
          <G2>
            <Campo label="Fecha de entrada"><input type="date" value={formStock.fecha_entrada||""} onChange={ff_s("fecha_entrada")} style={MI}/></Campo>
            <Campo label="ID"><input value={formStock.id||""} onChange={ff_s("id")} style={MI}/></Campo>
          </G2>
          <Campo label="Observaciones"><textarea value={formStock.obs||""} onChange={ff_s("obs")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
        </ModalBase>
      )}

      {/* Modal nuevo movimiento */}
      {modalMov&&(
        <ModalBase titulo="Registrar movimiento" subtitulo={apqLabel} onClose={()=>setModalMov(false)} onGuardar={guardarMov} ancho={620}>
          <G3>
            <Campo label="ID"><input value={formMov.id||""} onChange={ff_m("id")} style={MI}/></Campo>
            <Campo label="Fecha"><input type="date" value={formMov.fecha||""} onChange={ff_m("fecha")} style={MI}/></Campo>
            <Campo label="Tipo"><select value={formMov.tipo||""} onChange={ff_m("tipo")} style={MI}>{["Entrada","Salida","Traslado"].map(t=><option key={t}>{t}</option>)}</select></Campo>
          </G3>
          <Campo label="Material / Producto" required>
            <select value={formMov.material||""} onChange={ff_m("material")} style={MI}>
              {TIPOS_PINTURA.map(t=><option key={t}>{t}</option>)}
            </select>
          </Campo>
          <G2>
            <Campo label="Cantidad"><input type="number" step="0.1" value={formMov.cantidad||0} onChange={ff_m("cantidad")} style={MI}/></Campo>
            <Campo label="Unidad"><select value={formMov.unidad||"L"} onChange={ff_m("unidad")} style={MI}>{["L","kg","ud","saco"].map(u=><option key={u}>{u}</option>)}</select></Campo>
          </G2>
          <G2>
            <Campo label="Origen"><input value={formMov.origen||""} onChange={ff_m("origen")} style={MI} placeholder="ej. APQ Esparreguera"/></Campo>
            <Campo label="Destino"><input value={formMov.destino||""} onChange={ff_m("destino")} style={MI} placeholder="ej. APQ Esparreguera Intermedio"/></Campo>
          </G2>
          <G2>
            <Campo label="Medio de traslado"><input value={formMov.medio||""} onChange={ff_m("medio")} style={MI} placeholder="ej. Traspaleta eléctrica, toro…"/></Campo>
            <Campo label="Operario"><input value={formMov.operario||""} onChange={ff_m("operario")} style={MI}/></Campo>
          </G2>
          <Campo label="Observaciones"><textarea value={formMov.obs||""} onChange={ff_m("obs")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
        </ModalBase>
      )}

      {confirm&&<ModalConfirm texto={`¿Eliminar "${stock.find(s=>s.id===confirm)?.tipo}" del stock?`} onClose={()=>setConfirm(null)} onConfirmar={()=>eliminarStock(confirm)}/>}
    </div>
  );
}

// ─── MÓDULO PRINCIPAL ─────────────────────────────────────────────
export default function Logistica(){
  const [tab,setTab] = useState("apq_esp");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <Tabs
        items={[
          ["apq_esp",    "APQ Esparreguera"],
          ["apq_esp_int","APQ Esparreguera Interm."],
          ["apq_vit",    "APQ Vitoria"],
        ]}
        cur={tab} onChange={setTab}
      />
      {APQ_IDS.map(apq=>(
        tab===apq.id&&<TabAPQ key={apq.id} apqId={apq.id} apqLabel={apq.label} apqColor={apq.color}/>
      ))}
    </div>
  );
}
