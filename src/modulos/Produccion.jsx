// src/modulos/Produccion.jsx
import { useState, useContext, useEffect, useRef } from "react";
import { ERPContext } from "../ERP";
import { CLIENTES, HOMS, MAQUINAS, oc, cn } from "../datos";
import { Dot, Bdg, Al, Card, Tbl, Tabs, PBox, KRow, ck } from "../ui";

let nOF = 2609;
const mo = { fontFamily:"monospace", fontSize:11 };
const bsm = { border:"1px solid #e5e7eb", background:"transparent", color:"#111827", padding:"3px 8px", borderRadius:5, cursor:"pointer", fontSize:11, fontWeight:500 };
const inp = { border:"1px solid #e5e7eb", background:"#f8fafc", color:"#111827", padding:"7px 10px", borderRadius:6, fontSize:12, outline:"none", width:"100%", boxSizing:"border-box" };

// ─── DATOS PRODUCCIÓN ─────────────────────────────────────────────

const ESTADOS_POSIBLES = ["Produciendo","Espera","Ajuste","Avería","Parada","Limpieza","Cambio formato","Mantenimiento"];
const COLOR_ESTADO = {
  "Produciendo":   { bg:"#f0fdf4", bd:"#22c55e", tx:"#166534" },
  "Espera":        { bg:"#eff6ff", bd:"#60a5fa", tx:"#1d4ed8" },
  "Ajuste":        { bg:"#fffbeb", bd:"#f59e0b", tx:"#92400e" },
  "Avería":        { bg:"#fef2f2", bd:"#ef4444", tx:"#b91c1c" },
  "Parada":        { bg:"#f9fafb", bd:"#9ca3af", tx:"#374151" },
  "Limpieza":      { bg:"#faf5ff", bd:"#a78bfa", tx:"#5b21b6" },
  "Cambio formato":{ bg:"#fff7ed", bd:"#fb923c", tx:"#9a3412" },
  "Mantenimiento": { bg:"#fef3c7", bd:"#fbbf24", tx:"#78350f" },
};

// Estado inicial de máquinas
const ESTADOS_INIT = {
  "PRE-01":"Produciendo","PRE-02":"Produciendo",
  "GR-01":"Produciendo", "GR-02":"Espera",
  "TWIN44":"Produciendo","TWIN02":"Ajuste",
  "MN-01":"Produciendo", "RO-5":"Parada","RO-6":"Parada",
  "DC02":"Produciendo",  "DE02":"Espera",
  "DB02":"Limpieza",     "GR-BAST":"Produciendo",
  "MN Bastid":"Produciendo","MALLADO":"Espera",
};

// Consumos por máquina (hoy)
const CONSUMOS_INIT = [
  { maq:"TWIN44", energia_kwh:142, quimico_l:8.4,  granalla_kg:0,    gas_m3:12.1, of:"OF-2601", kg_prod:400  },
  { maq:"MN-01",  energia_kwh:98,  quimico_l:6.2,  granalla_kg:0,    gas_m3:8.3,  of:"OF-2602", kg_prod:250  },
  { maq:"GR-01",  energia_kwh:54,  quimico_l:0,    granalla_kg:12.0, gas_m3:0,    of:"OF-2603", kg_prod:320  },
  { maq:"GR-02",  energia_kwh:48,  quimico_l:0,    granalla_kg:10.5, gas_m3:0,    of:"OF-2603", kg_prod:320  },
  { maq:"PRE-01", energia_kwh:32,  quimico_l:4.1,  granalla_kg:0,    gas_m3:3.2,  of:"OF-2605", kg_prod:180  },
  { maq:"PRE-02", energia_kwh:35,  quimico_l:4.3,  granalla_kg:0,    gas_m3:3.5,  of:"OF-2601", kg_prod:400  },
  { maq:"DC02",   energia_kwh:28,  quimico_l:2.8,  granalla_kg:0,    gas_m3:0,    of:"OF-2604", kg_prod:480  },
];

// Incidencias de producción
const INCIDENCIAS_INIT = [
  { id:"INC-001", maq:"TWIN02",  tipo:"Parada máquina",   desc:"Fallo sensor temperatura horno",            turno:"Mañana", op:"C. Font",  min_perdidos:35, est:"Resuelta",  hora:"07:22" },
  { id:"INC-002", maq:"GR-02",   tipo:"Ajuste proceso",   desc:"Velocidad granallado fuera de rango",        turno:"Mañana", op:"R. Mas",   min_perdidos:12, est:"Resuelta",  hora:"08:45" },
  { id:"INC-003", maq:"DC02",    tipo:"Falta material",   desc:"Stock aceite MKR bajo mínimo",               turno:"Mañana", op:"D. Gil",   min_perdidos:20, est:"Abierta",   hora:"09:10" },
  { id:"INC-004", maq:"MN-01",   tipo:"Error de carga",   desc:"Kg cesta superado — carga redistribuida",    turno:"Mañana", op:"J. Pérez", min_perdidos:8,  est:"Resuelta",  hora:"10:30" },
];

// Historial de producción diaria (últimos 7 días)
const HISTORICO_DIARIO = [
  { fecha:"13/03", kg_obj:8200, kg_real:7940, ofs_obj:18, ofs_real:16, paradas_min:45, incidencias:2, rechazos_kg:120 },
  { fecha:"14/03", kg_obj:8200, kg_real:8100, ofs_obj:18, ofs_real:17, paradas_min:30, incidencias:1, rechazos_kg:80  },
  { fecha:"15/03", kg_obj:8200, kg_real:7600, ofs_obj:18, ofs_real:15, paradas_min:110,incidencias:4, rechazos_kg:210 },
  { fecha:"17/03", kg_obj:8200, kg_real:8350, ofs_obj:18, ofs_real:19, paradas_min:15, incidencias:1, rechazos_kg:40  },
  { fecha:"18/03", kg_obj:8200, kg_real:8050, ofs_obj:18, ofs_real:17, paradas_min:40, incidencias:2, rechazos_kg:95  },
  { fecha:"19/03", kg_obj:8200, kg_real:6120, ofs_obj:18, ofs_real:11, paradas_min:75, incidencias:4, rechazos_kg:150 },
];

// ─── MODAL NUEVA OF ───────────────────────────────────────────────
function OFModal({ onClose, onSave }) {
  const [step, setStep]   = useState(1);
  const [cliId, setCli]   = useState(null);
  const [homId, setHom]   = useState(null);
  const [kg, setKg]       = useState("");
  const [fe, setFe]       = useState("");
  const [lote, setLote]   = useState("L-001");
  const [prio, setPrio]   = useState("Normal");
  const [qCli, setQCli]   = useState("");
  const [qHom, setQHom]   = useState("");

  const actH    = HOMS.filter(h => h.cli===cliId && h.est==="Activa");
  const inactH  = HOMS.filter(h => h.cli===cliId && h.est!=="Activa");
  const hom     = HOMS.find(h => h.id===homId);
  const maqMant = hom && MAQUINAS.find(m => m.id===hom.maq)?.est==="Mantenimiento";
  const canNext = (step===1&&cliId)||(step===2&&homId)||(step===3&&kg&&fe)||step===4;
  function goNext(){ if(canNext){ setStep(s=>s+1); setQCli(""); setQHom(""); } }
  function goBack(){ setStep(s=>s-1); setQCli(""); setQHom(""); }
  const STEPS   = ["Cliente","Homologación","Detalles","Confirmar"];
  const btn0    = { border:"1px solid #e5e7eb", background:"transparent", color:"#111827", padding:"5px 12px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:500 };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#ffffff",border:"1px solid #e5e7eb",borderRadius:12,width:520,maxWidth:"96%",maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"13px 18px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <span style={{fontWeight:600,fontSize:14}}>Nueva orden de fabricación</span>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#6b7280"}}>✕</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4,padding:"10px 18px",borderBottom:"1px solid #f3f4f6",flexShrink:0,flexWrap:"wrap"}}>
          {STEPS.map((s,i)=>{
            const done=i<step-1, act=i===step-1;
            return(
              <div key={s} style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11.5,fontWeight:act||done?500:400,color:act?"#1d4ed8":done?"#166534":"#9ca3af"}}>
                  <span style={{width:18,height:18,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:500,flexShrink:0,...(act?ck("info"):done?ck("success"):ck("secondary"))}}>{done?"✓":i+1}</span>
                  {s}
                </div>
                {i<3&&<span style={{color:"#6b7280",margin:"0 2px",fontSize:11}}>›</span>}
              </div>
            );
          })}
        </div>
        <div style={{padding:18,overflowY:"auto",flex:1}}>
          {step===1&&(
            <div>
              <p style={{fontSize:11.5,color:"#6b7280",marginBottom:8}}>Solo clientes con homologaciones activas pueden generar OFs.</p>
              <div style={{position:"relative",marginBottom:10}}>
                <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"#9ca3af",pointerEvents:"none"}}>⌕</span>
                <input value={qCli} onChange={e=>setQCli(e.target.value)} placeholder="Buscar cliente..." style={{border:"1px solid #e5e7eb",borderRadius:6,padding:"6px 10px 6px 28px",fontSize:12,width:"100%",boxSizing:"border-box",outline:"none",color:"#111827",background:"#f9fafb"}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:290,overflowY:"auto"}}>
                {CLIENTES.filter(c=>!qCli||c.n.toLowerCase().includes(qCli.toLowerCase())||c.s?.toLowerCase().includes(qCli.toLowerCase())).map(c=>{
                  const nA=HOMS.filter(h=>h.cli===c.id&&h.est==="Activa").length;
                  const nT=HOMS.filter(h=>h.cli===c.id).length;
                  const dis=nA===0, sel=cliId===c.id;
                  return(
                    <div key={c.id} onClick={()=>{if(!dis){setCli(c.id);setQCli("");}}} style={{padding:"10px 12px",borderRadius:7,display:"flex",alignItems:"center",gap:10,cursor:dis?"not-allowed":"pointer",opacity:dis?.4:1,border:`1px solid ${sel?"#93c5fd":"#e5e7eb"}`,background:sel?"#eff6ff":"#ffffff"}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:500}}>{c.n}</div>
                        <div style={{fontSize:10.5,color:"#6b7280",marginTop:1}}>{c.s}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <Bdg t={nA>0?"Activa":"Sin homs."}/>
                        <div style={{fontSize:10,color:"#6b7280",marginTop:2}}>{nA} activas{nT>nA?` · ${nT-nA} inact.`:""}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {step===2&&(
            <div>
              <p style={{fontSize:11.5,color:"#6b7280",marginBottom:8}}>Referencias de <b style={{color:"#111827"}}>{cn(cliId)}</b></p>
              <div style={{position:"relative",marginBottom:10}}>
                <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"#9ca3af",pointerEvents:"none"}}>⌕</span>
                <input value={qHom} onChange={e=>setQHom(e.target.value)} placeholder="Buscar referencia, código, máquina..." style={{border:"1px solid #e5e7eb",borderRadius:6,padding:"6px 10px 6px 28px",fontSize:12,width:"100%",boxSizing:"border-box",outline:"none",color:"#111827",background:"#f9fafb"}}/>
              </div>
              {actH.length===0&&<Al type="w">⚠ Sin homologaciones activas.</Al>}
              <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:290,overflowY:"auto"}}>
                {actH.filter(h=>!qHom||h.desc.toLowerCase().includes(qHom.toLowerCase())||h.ref?.toLowerCase().includes(qHom.toLowerCase())||h.cod?.toLowerCase().includes(qHom.toLowerCase())||h.maq?.toLowerCase().includes(qHom.toLowerCase())).map(h=>{
                  const sel=homId===h.id;
                  return(
                    <div key={h.id} onClick={()=>{setHom(h.id);setQHom("");}} style={{padding:"10px 12px",borderRadius:7,display:"flex",alignItems:"center",gap:10,cursor:"pointer",border:`1px solid ${sel?"#93c5fd":"#e5e7eb"}`,background:sel?"#eff6ff":"#ffffff"}}>
                      <Dot top={h.top} sz={10}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:500}}>{h.desc}</div>
                        <div style={{fontSize:10.5,color:"#6b7280",marginTop:2,display:"flex",gap:5}}>
                          <span>{h.maq}</span><span>·</span><span>{h.ref}</span><span>·</span><span>{h.top}</span>
                        </div>
                      </div>
                      <div style={{textAlign:"right",fontSize:10.5,color:"#6b7280"}}>
                        <div>{h.kg}kg</div><div>Vb:{h.vb} Tb:{h.tb}</div>
                      </div>
                    </div>
                  );
                })}
                {inactH.length>0&&(
                  <>
                    <p style={{fontSize:10.5,color:"#6b7280",marginTop:6,paddingTop:6,borderTop:"1px solid #f3f4f6"}}>No disponibles ({inactH.length})</p>
                    {inactH.map(h=>(
                      <div key={h.id} style={{padding:"8px 12px",border:"1px solid #e5e7eb",borderRadius:7,display:"flex",alignItems:"center",gap:10,opacity:.4}}>
                        <Dot top={h.top} sz={10}/><div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{h.desc}</div></div><Bdg t={h.est}/>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
          {step===3&&hom&&(
            <div>
              <Al type="b"><span><b>{hom.desc}</b> — {hom.cod}</span></Al>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,margin:"12px 0"}}>
                {[["V. Baño",hom.vb,"rpm"],["T. Baño",hom.tb,"min"],["V. Centrif.",hom.vc,"rpm"],["T. Centrif.",hom.tc,"min"],["Giros",hom.g,""],["Kg cesta",hom.kg,"kg"]].map(([l,v,u])=><PBox key={l} l={l} v={v} u={u}/>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[["Máquina",hom.maq],["Topcoat",hom.top]].map(([l,v])=>(
                  <div key={l} style={{display:"flex",flexDirection:"column",gap:4}}>
                    <label style={{fontSize:10.5,fontWeight:500,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em"}}>{l}</label>
                    <input value={v} disabled style={{...inp,opacity:.7}}/>
                  </div>
                ))}
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:10.5,fontWeight:500,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em"}}>Kg *</label>
                  <input type="number" value={kg} onChange={e=>setKg(e.target.value)} style={inp}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:10.5,fontWeight:500,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em"}}>F. Entrega (DD/MM) *</label>
                  <input value={fe} onChange={e=>setFe(e.target.value)} placeholder="ej. 25/03" style={inp}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:10.5,fontWeight:500,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em"}}>Lote</label>
                  <select value={lote} onChange={e=>setLote(e.target.value)} style={inp}>{["L-001","L-002","L-003","L-004"].map(l=><option key={l}>{l}</option>)}</select>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:10.5,fontWeight:500,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em"}}>Prioridad</label>
                  <select value={prio} onChange={e=>setPrio(e.target.value)} style={inp}><option>Normal</option><option>Urgente</option></select>
                </div>
              </div>
              {maqMant&&<div style={{marginTop:10}}><Al type="w">⚠ {hom.maq} en mantenimiento.</Al></div>}
            </div>
          )}
          {step===4&&hom&&(
            <div>
              <Al type="g">✓ Datos verificados. OF vinculada a homologación activa.</Al>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:14}}>
                {[["Cliente",cn(cliId)],["Referencia",hom.desc],["Cód. interno",hom.cod],["Máquina",hom.maq],["Topcoat",hom.top],["Kg",`${kg} kg`],["F. Entrega",fe],["Lote",lote],["Prioridad",prio],["Parámetros",`Vb:${hom.vb}·Tb:${hom.tb}·Vc:${hom.vc}·Tc:${hom.tc}`]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",gap:10,fontSize:12}}>
                    <span style={{minWidth:130,color:"#6b7280"}}>{k}</span>
                    <span style={{fontWeight:500}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{padding:"12px 18px",borderTop:"1px solid #f3f4f6",display:"flex",justifyContent:"flex-end",gap:8,flexShrink:0}}>
          {step>1&&<button onClick={goBack} style={btn0}>← Atrás</button>}
          <button onClick={onClose} style={btn0}>Cancelar</button>
          {step<4
            ?<button onClick={goNext} style={{...ck("info"),padding:"5px 13px",borderRadius:6,cursor:canNext?"pointer":"not-allowed",fontSize:12,fontWeight:500,opacity:canNext?1:.45}}>Siguiente →</button>
            :<button onClick={()=>{onSave({id:`OF-${nOF++}`,hid:hom.id,cli:cliId,maq:hom.maq,kg:parseInt(kg),top:hom.top,est:"Pendiente",prio,fe,lote,alb:null});onClose();}} style={{...ck("success"),padding:"5px 13px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:500}}>✓ Crear OF</button>
          }
        </div>
      </div>
    </div>
  );
}

// ─── TAB: PANEL TIEMPO REAL ───────────────────────────────────────
function TabPanel({ ofs, estadoMaquinas, setEstadoMaquinas, incidencias }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(v => v+1), 30000);
    return () => clearInterval(t);
  }, []);

  const hora = new Date().toLocaleTimeString("es-ES", { hour:"2-digit", minute:"2-digit" });
  const averias   = MAQUINAS.filter(m => estadoMaquinas[m.id]==="Avería").length;
  const paradas   = MAQUINAS.filter(m => ["Parada","Mantenimiento"].includes(estadoMaquinas[m.id])).length;
  const incAbier  = incidencias.filter(i => i.est==="Abierta").length;
  const kgHoy     = ofs.filter(o=>o.est==="Completada").reduce((s,o)=>s+o.kg,0);
  const ofsActivas= ofs.filter(o=>["En Curso","Control Final"].includes(o.est)).length;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {/* Cabecera estado planta */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",animation:"pulse 1.5s ease-in-out infinite"}}/>
          <span style={{fontSize:12,color:"#6b7280"}}>En tiempo real · {hora}</span>
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
        </div>
        {averias>0&&<span style={{fontSize:11,fontWeight:700,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5",padding:"3px 10px",borderRadius:5}}>⚠ {averias} avería{averias>1?"s":""} activa{averias>1?"s":""}</span>}
      </div>

      {/* KPIs */}
      <KRow items={[
        {l:"Kg producidos hoy", v:kgHoy.toLocaleString(), c:kgHoy>5000?"var(--color-text-success)":"var(--color-text-warning)"},
        {l:"OFs en curso",      v:ofsActivas},
        {l:"Máquinas activas",  v:MAQUINAS.filter(m=>estadoMaquinas[m.id]==="Produciendo").length, c:"var(--color-text-success)"},
        {l:"Averías",          v:averias, c:averias>0?"var(--color-text-danger)":undefined},
        {l:"Paradas",          v:paradas, c:paradas>0?"var(--color-text-warning)":undefined},
        {l:"Incidencias abier.",v:incAbier,c:incAbier>0?"var(--color-text-warning)":undefined},
      ]}/>

      {/* Grid máquinas */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8}}>
        {MAQUINAS.filter(m=>m.est!=="Inhabilitada").map(m=>{
          const estado = estadoMaquinas[m.id] || "Espera";
          const col    = COLOR_ESTADO[estado] || COLOR_ESTADO["Espera"];
          const ofAct  = ofs.find(o=>o.maq===m.id&&["En Curso","Pendiente"].includes(o.est));
          const hom    = ofAct?HOMS.find(h=>h.id===ofAct.hid):null;

          return(
            <div key={m.id} style={{background:col.bg,border:`1.5px solid ${col.bd}`,borderRadius:10,overflow:"hidden"}}>
              {/* Header */}
              <div style={{padding:"8px 12px",borderBottom:`0.5px solid ${col.bd}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:col.tx}}>{m.id}</div>
                  <div style={{fontSize:10,color:col.tx,opacity:.75}}>{m.tipo}</div>
                </div>
                <select
                  value={estado}
                  onChange={e=>setEstadoMaquinas(prev=>({...prev,[m.id]:e.target.value}))}
                  style={{fontSize:10,fontWeight:600,background:"rgba(255,255,255,.7)",border:`0.5px solid ${col.bd}`,color:col.tx,borderRadius:4,padding:"2px 5px",cursor:"pointer",outline:"none"}}>
                  {ESTADOS_POSIBLES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              {/* OF activa */}
              <div style={{padding:"8px 12px"}}>
                {ofAct?(
                  <>
                    <div style={{fontSize:12,fontWeight:700,color:col.tx,fontFamily:"monospace"}}>{ofAct.id}</div>
                    <div style={{fontSize:11,color:col.tx,opacity:.8,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{hom?.desc?.slice(0,22)||cn(ofAct.cli)}</div>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:5,fontSize:11}}>
                      <span style={{color:col.tx,opacity:.7}}>{ofAct.kg.toLocaleString()} kg</span>
                      <span style={{color:col.tx,fontWeight:600}}>Fe. {ofAct.fe}</span>
                    </div>
                    <div style={{marginTop:5,height:4,background:"rgba(255,255,255,.4)",borderRadius:2}}>
                      <div style={{height:"100%",width:estado==="Produciendo"?"65%":"20%",background:col.bd,borderRadius:2,transition:"width .5s"}}/>
                    </div>
                  </>
                ):(
                  <div style={{fontSize:11,color:col.tx,opacity:.6,textAlign:"center",paddingTop:4}}>
                    {estado==="Produciendo"?"Sin OF asignada":"—"}
                  </div>
                )}
                <div style={{marginTop:6,fontSize:10,color:col.tx,opacity:.6}}>{m.op}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Máquinas inhabilitadas */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
        {MAQUINAS.filter(m=>m.est==="Inhabilitada").map(m=>(
          <div key={m.id} style={{padding:"5px 12px",borderRadius:7,border:"1px solid #e5e7eb",background:"#f8fafc",opacity:.5,fontSize:11}}>
            {m.id} · ⊘ Inhabilitada
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── RUTAS DE PROCESO POR MÁQUINA PRINCIPAL ──────────────────────
const RUTAS = {
  "MN-01":    ["PRE-01","GR-01","MN-01"],
  "TWIN44":   ["PRE-02","GR-02","TWIN44"],
  "TWIN02":   ["PRE-02","GR-02","TWIN02"],
  "DC02":     ["DC02"],
  "DE02":     ["DE02"],
  "DB02":     ["DB02"],
  "GR-01":    ["PRE-01","GR-01"],
  "GR-02":    ["PRE-02","GR-02"],
  "PRE-01":   ["PRE-01"],
  "PRE-02":   ["PRE-02"],
  "MN Bastid":["DE02","GR-BAST","MN Bastid"],
  "GR-BAST":  ["GR-BAST"],
};

const CTRL_MAQ = {
  "PRE-01":"Zirblast","PRE-02":"Zirblast",
  "DC02":"Zirblast","DE02":"Zirblast","DB02":"Zirblast",
  "GR-01":"Sulfato de cobre","GR-02":"Sulfato de cobre","GR-BAST":"Sulfato de cobre",
  "TWIN44":"Control pintura","TWIN02":"Control pintura","MN-01":"Control pintura","MN Bastid":"Control pintura",
};

const MAQ_TIPO = {
  "PRE-01":"Pretratamiento","PRE-02":"Pretratamiento",
  "DC02":"Desaceitado","DE02":"Desengrasado","DB02":"Desengrasado",
  "GR-01":"Granallado","GR-02":"Granallado","GR-BAST":"Granallado",
  "MN-01":"Recubrimiento","TWIN44":"Recubrimiento","TWIN02":"Recubrimiento","MN Bastid":"Recubrimiento",
};

const TC_COLOR = {"Negro":"#1f2937","Plata":"#64748b","VH":"#0F6E56","Deltalube":"#6d28d9"};

function PasoRuta({ maq, esUltimo, hom }) {
  const ctrl  = CTRL_MAQ[maq];
  const tipo  = MAQ_TIPO[maq] || maq;
  const esPintura = ctrl==="Control pintura";
  const esGran    = ctrl==="Sulfato de cobre";
  const esPre     = ctrl==="Zirblast";

  // Parámetros relevantes según el tipo de máquina
  const params = [];
  if(esPintura && hom) {
    if(hom.vb)  params.push({l:"V. Baño",    v:hom.vb,  u:"rpm"});
    if(hom.tb)  params.push({l:"T. Baño",    v:hom.tb,  u:"min"});
    if(hom.vc)  params.push({l:"V. Centrif.",v:hom.vc,  u:"rpm"});
    if(hom.tc)  params.push({l:"T. Centrif.",v:hom.tc,  u:"min"});
    if(hom.g)   params.push({l:"Giros",      v:hom.g,   u:""});
    if(hom.kg)  params.push({l:"Kg cesta",   v:hom.kg,  u:"kg"});
  }
  if(esPre)  params.push({l:"Control",v:"Zirblast",u:""},{l:"Foto pieza",v:"Obligatoria",u:""});
  if(esGran) params.push({l:"Control",v:"Sulfato Cu",u:""},{l:"Foto pieza",v:"Obligatoria",u:""});

  const colBg  = esPintura?"#eff6ff":esGran?"#faf5ff":esPre?"#f0fdf4":"#f8fafc";
  const colBd  = esPintura?"#93c5fd":esGran?"#c4b5fd":esPre?"#86efac":"#e2e8f0";
  const colTx  = esPintura?"#1d4ed8":esGran?"#5b21b6":esPre?"#166534":"#374151";

  return(
    <div style={{display:"flex",alignItems:"flex-start",gap:0}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:colBg,border:`2px solid ${colBd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,zIndex:1}}>
          {esPintura?"🎨":esGran?"🧪":esPre?"🧫":"⚙"}
        </div>
        {!esUltimo&&<div style={{width:2,height:40,background:"#e2e8f0",marginTop:0}}/>}
      </div>
      <div style={{flex:1,marginLeft:12,paddingBottom:esUltimo?0:28}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
          <span style={{fontWeight:700,fontSize:13,color:"#111827"}}>{maq}</span>
          <span style={{fontSize:10,fontWeight:600,background:colBg,color:colTx,border:`0.5px solid ${colBd}`,padding:"1px 7px",borderRadius:4}}>{tipo}</span>
          {ctrl&&<span style={{fontSize:10,color:"#6b7280",fontStyle:"italic"}}>{ctrl}</span>}
        </div>
        {params.length>0&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:6}}>
            {params.map(p=>(
              <div key={p.l} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:7,padding:"6px 10px"}}>
                <div style={{fontSize:9,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".05em",marginBottom:2}}>{p.l}</div>
                <div style={{fontSize:12,fontWeight:700,color:"#111827"}}>{p.v}{p.u&&<span style={{fontSize:10,fontWeight:400,color:"#6b7280",marginLeft:2}}>{p.u}</span>}</div>
              </div>
            ))}
          </div>
        )}
        {esPintura&&hom&&(
          <div style={{marginTop:6,display:"flex",gap:5,alignItems:"center"}}>
            <span style={{fontSize:11,color:"#6b7280"}}>Topcoat:</span>
            <span style={{fontSize:11,fontWeight:700,color:TC_COLOR[hom.top]||"#374151",background:TC_COLOR[hom.top]+"18",border:`0.5px solid ${TC_COLOR[hom.top]||"#e2e8f0"}55`,padding:"2px 8px",borderRadius:4}}>● {hom.top}</span>
            {hom.fase&&<span style={{fontSize:10,color:"#9ca3af"}}>Fase {hom.fase}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function OFDetalle({ o, onClose }) {
  const h    = HOMS.find(x=>x.id===o.hid);
  const ruta = RUTAS[o.maq] || [o.maq];
  const tc   = TC_COLOR[o.top] || "#374151";

  return(
    <div style={{width:380,flexShrink:0,background:"#fff",borderLeft:"1px solid #e5e7eb",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {/* Header */}
      <div style={{padding:"14px 16px",borderBottom:"1px solid #f3f4f6",background:"#fafafa",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexShrink:0}}>
        <div>
          <div style={{fontWeight:700,fontSize:15,color:"#111827"}}>{o.id}</div>
          <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{h?.desc||"—"} · {cn(o.cli)}</div>
        </div>
        <button onClick={onClose} style={{background:"#f3f4f6",border:"none",cursor:"pointer",width:28,height:28,borderRadius:"50%",fontSize:14,color:"#6b7280",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
      </div>

      {/* Resumen OF */}
      <div style={{padding:"12px 16px",borderBottom:"1px solid #f3f4f6",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,flexShrink:0}}>
        {[
          {l:"Estado",    v:<Bdg t={o.est}/>},
          {l:"Kg",        v:<span style={{fontFamily:"monospace",fontWeight:700}}>{o.kg} kg</span>},
          {l:"F. Entrega",v:<span style={{fontFamily:"monospace"}}>{o.fe}</span>},
          {l:"Lote",      v:<span style={{fontFamily:"monospace"}}>{o.lote}</span>},
          {l:"Topcoat",   v:<span style={{fontWeight:700,color:tc}}>● {o.top}</span>},
          {l:"Prioridad", v:o.prio==="Urgente"?<span style={{fontSize:10,fontWeight:700,color:"#b91c1c"}}>⚡ Urgente</span>:<span style={{fontSize:11,color:"#6b7280"}}>Normal</span>},
        ].map(({l,v})=>(
          <div key={l} style={{background:"#f8fafc",borderRadius:6,padding:"6px 8px"}}>
            <div style={{fontSize:9,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".05em",marginBottom:2}}>{l}</div>
            <div style={{fontSize:11}}>{v}</div>
          </div>
        ))}
      </div>

      {/* Ruta y parámetros */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 16px 16px 12px"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".06em",marginBottom:14}}>Ruta de proceso y parámetros</div>
        {ruta.map((maq,i)=>(
          <PasoRuta key={maq} maq={maq} esUltimo={i===ruta.length-1} hom={h}/>
        ))}
      </div>

      {/* Cod. homologación */}
      {h&&(
        <div style={{padding:"10px 16px",borderTop:"1px solid #f3f4f6",background:"#f8fafc",fontSize:10,color:"#9ca3af",flexShrink:0}}>
          Homologación: <span style={{fontFamily:"monospace",color:"#374151"}}>{h.cod}</span> · ref. {h.ref}
        </div>
      )}
    </div>
  );
}

// ─── TAB: ÓRDENES OF ─────────────────────────────────────────────
function TabOFs({ ofs, setOfs, onNuevaOF }) {
  const [filtEst, setFiltEst] = useState("Todas");
  const adv = (id,est) => setOfs(p=>p.map(o=>o.id===id?{...o,est,...(est==="Completada"?{alb:`ALB-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${String(p.filter(x=>x.alb).length+1).padStart(3,"0")}`}:{})}:o));

  const ESTADOS_FILT = ["Todas","Pendiente","En Curso","Control Final","Completada","Expedición"];
  const ofsVis = filtEst==="Todas"?ofs:ofs.filter(o=>o.est===filtEst);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {ESTADOS_FILT.map(e=>(
            <button key={e} onClick={()=>setFiltEst(e)} style={{
              padding:"4px 10px",borderRadius:5,cursor:"pointer",fontSize:11,
              border:`0.5px solid ${filtEst===e?"#93c5fd":"#e5e7eb"}`,
              background:filtEst===e?"#eff6ff":"#f8fafc",
              color:filtEst===e?"#1d4ed8":"#6b7280",fontWeight:filtEst===e?600:400,
            }}>{e}{e!=="Todas"?` (${ofs.filter(o=>o.est===e).length})`:""}</button>
          ))}
        </div>
        <button onClick={onNuevaOF} style={{background:"#2563eb",color:"#fff",border:"none",padding:"5px 13px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600}}>+ Nueva OF</button>
      </div>
      <Card>
        <Tbl
          cols={["OF","Cliente","Ref.","Máq.","Top.","Kg","Lote","Fe.","Est.","Acción"]}
          rows={ofsVis.map(o=>{
            const h=HOMS.find(x=>x.id===o.hid);
            return[
              <span style={{...mo,fontWeight:600}}>{o.id}</span>,
              <span style={{fontSize:11,display:"block",maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cn(o.cli)}</span>,
              <span style={{fontSize:10.5,color:"#6b7280",display:"block",maxWidth:90,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h?.desc||"—"}</span>,
              <span style={mo}>{o.maq}</span>,
              <span style={{display:"flex",alignItems:"center",gap:4}}><Dot top={o.top} sz={8}/>{o.top}</span>,
              <span style={mo}>{o.kg}</span>,
              <span style={mo}>{o.lote}</span>,
              <span style={{fontSize:11}}>{o.fe}</span>,
              <Bdg t={o.est}/>,
              <span style={{display:"flex",gap:5,alignItems:"center"}}>
                {o.est==="Pendiente"&&<button style={bsm} onClick={()=>adv(o.id,"En Curso")}>Iniciar</button>}
                {o.est==="En Curso"&&<button style={bsm} onClick={()=>adv(o.id,"Control Final")}>→CF</button>}
                {o.est==="Control Final"&&<button style={{...bsm,background:"#f0fdf4",color:"#166534",border:"0.5px solid #86efac"}} onClick={()=>adv(o.id,"Completada")}>Albarán</button>}
                {o.alb&&<span style={{...mo,fontSize:10,color:"#166534"}}>{o.alb}</span>}
              </span>,
            ];
          })}
        />
      </Card>
    </div>
  );
}

// ─── TAB: ESTADOS MÁQUINA ─────────────────────────────────────────
function TabEstados({ estadoMaquinas, setEstadoMaquinas }) {
  const [historial] = useState([
    {maq:"TWIN02",estado:"Avería",  inicio:"06:45",fin:"07:22",motivo:"Fallo sensor temperatura",min:37},
    {maq:"GR-02", estado:"Ajuste",  inicio:"08:30",fin:"08:42",motivo:"Velocidad granallado fuera rango",min:12},
    {maq:"DC02",  estado:"Parada",  inicio:"09:05",fin:"09:25",motivo:"Falta stock aceite MKR",min:20},
    {maq:"MN-01", estado:"Ajuste",  inicio:"10:25",fin:"10:33",motivo:"Redistribución de carga",min:8},
    {maq:"DB02",  estado:"Limpieza",inicio:"11:00",fin:"11:40",motivo:"Limpieza periódica",min:40},
  ]);

  const totalParadas = historial.reduce((s,h)=>s+h.min, 0);
  const minProd = MAQUINAS.filter(m=>estadoMaquinas[m.id]==="Produciendo").length;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <KRow items={[
        {l:"Produciendo ahora",  v:minProd,       c:"var(--color-text-success)"},
        {l:"Paradas hoy (min)",  v:totalParadas,  c:totalParadas>60?"var(--color-text-danger)":"var(--color-text-warning)"},
        {l:"Incidencias turno",  v:historial.length},
        {l:"Disponibilidad",     v:`${(100-totalParadas/480*100).toFixed(1)}%`, c:"var(--color-text-info)"},
      ]}/>

      {/* Estado actual */}
      <div style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:".06em"}}>Estado actual — cambio manual</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
        {MAQUINAS.filter(m=>m.est!=="Inhabilitada").map(m=>{
          const estado = estadoMaquinas[m.id]||"Espera";
          const col    = COLOR_ESTADO[estado]||COLOR_ESTADO["Espera"];
          return(
            <div key={m.id} style={{background:col.bg,border:`1px solid ${col.bd}`,borderRadius:8,padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:col.tx}}>{m.id}</div>
                <div style={{fontSize:10,color:col.tx,opacity:.75}}>{m.tipo}</div>
              </div>
              <select
                value={estado}
                onChange={e=>setEstadoMaquinas(prev=>({...prev,[m.id]:e.target.value}))}
                style={{fontSize:11,fontWeight:600,background:"rgba(255,255,255,.7)",border:`0.5px solid ${col.bd}`,color:col.tx,borderRadius:5,padding:"3px 6px",cursor:"pointer",outline:"none",maxWidth:130}}>
                {ESTADOS_POSIBLES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          );
        })}
      </div>

      {/* Historial turno */}
      <div style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:".06em",marginTop:4}}>Historial de paradas — turno mañana</div>
      <Card>
        <Tbl cols={["Máquina","Estado","Inicio","Fin","Duración","Motivo"]}
          rows={historial.map(h=>{
            const col=COLOR_ESTADO[h.estado]||COLOR_ESTADO["Espera"];
            return[
              <b style={mo}>{h.maq}</b>,
              <span style={{fontSize:10,fontWeight:600,background:col.bg,color:col.tx,border:`0.5px solid ${col.bd}`,padding:"2px 6px",borderRadius:4}}>{h.estado}</span>,
              <span style={mo}>{h.inicio}</span>,
              <span style={mo}>{h.fin}</span>,
              <span style={{...mo,fontWeight:h.min>30?700:400,color:h.min>30?"var(--color-text-danger)":undefined}}>{h.min} min</span>,
              <span style={{fontSize:11.5}}>{h.motivo}</span>,
            ];
          })}
        />
      </Card>
    </div>
  );
}

// ─── TAB: CONSUMOS ────────────────────────────────────────────────
function TabConsumos() {
  const totales = CONSUMOS_INIT.reduce((acc,c)=>({
    energia: acc.energia+c.energia_kwh,
    quimico: acc.quimico+c.quimico_l,
    granalla:acc.granalla+c.granalla_kg,
    gas:     acc.gas+c.gas_m3,
    kg_prod: acc.kg_prod+c.kg_prod,
  }), {energia:0,quimico:0,granalla:0,gas:0,kg_prod:0});

  const kwh_kg  = totales.kg_prod>0?(totales.energia/totales.kg_prod).toFixed(2):0;
  const l_kg    = totales.kg_prod>0?(totales.quimico/totales.kg_prod).toFixed(3):0;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <KRow items={[
        {l:"Energía total (kWh)", v:totales.energia.toFixed(1)},
        {l:"Químico (L)",         v:totales.quimico.toFixed(1)},
        {l:"Granalla (kg)",       v:totales.granalla.toFixed(1)},
        {l:"Gas (m³)",            v:totales.gas.toFixed(1)},
        {l:"kWh / kg prod.",      v:kwh_kg, c:"var(--color-text-info)"},
        {l:"L químico / kg",      v:l_kg,   c:"var(--color-text-info)"},
      ]}/>

      {/* Gráfico energía por máquina */}
      <Card title="Energía por máquina (kWh) — turno actual">
        <div style={{padding:"12px 16px"}}>
          {CONSUMOS_INIT.sort((a,b)=>b.energia_kwh-a.energia_kwh).map((c,i)=>{
            const pct = (c.energia_kwh/CONSUMOS_INIT[0].energia_kwh)*100;
            return(
              <div key={c.maq} style={{display:"grid",gridTemplateColumns:"70px 1fr 60px",gap:8,alignItems:"center",marginBottom:8}}>
                <span style={{...mo,fontSize:11}}>{c.maq}</span>
                <div style={{height:14,background:"#f8fafc",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:i===0?"#ef4444":i===1?"#f59e0b":"#60a5fa",borderRadius:3,transition:"width .4s"}}/>
                </div>
                <span style={{...mo,fontSize:11,textAlign:"right"}}>{c.energia_kwh} kWh</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Tabla detalle */}
      <Card title="Detalle consumos por máquina y OF">
        <Tbl cols={["Máquina","OF","Kg prod.","Energía kWh","kWh/kg","Químico L","Granalla kg","Gas m³"]}
          rows={CONSUMOS_INIT.map(c=>[
            <b style={mo}>{c.maq}</b>,
            <span style={mo}>{c.of}</span>,
            <span style={mo}>{c.kg_prod}</span>,
            <span style={{...mo,fontWeight:600}}>{c.energia_kwh}</span>,
            <span style={{...mo,color:"#1d4ed8"}}>{(c.energia_kwh/c.kg_prod).toFixed(2)}</span>,
            <span style={mo}>{c.quimico_l>0?c.quimico_l:"—"}</span>,
            <span style={mo}>{c.granalla_kg>0?c.granalla_kg:"—"}</span>,
            <span style={mo}>{c.gas_m3>0?c.gas_m3:"—"}</span>,
          ])}
        />
      </Card>
    </div>
  );
}

// ─── TAB: INCIDENCIAS ─────────────────────────────────────────────
function TabIncidencias({ incidencias, setIncidencias }) {
  const [modal, setModal] = useState(false);
  const [maq,  setMaq]   = useState(MAQUINAS[0].id);
  const [tipo, setTipo]  = useState("Parada máquina");
  const [desc, setDesc]  = useState("");
  const TIPOS = ["Parada máquina","Ajuste proceso","Falta material","Error de carga","Fallo de receta","Problema manipulación","Otro"];

  const abiertas  = incidencias.filter(i=>i.est==="Abierta").length;
  const minPerdidos = incidencias.reduce((s,i)=>s+i.min_perdidos,0);

  function guardar() {
    if (!desc.trim()) return;
    const nueva = {
      id:`INC-${String(incidencias.length+1).padStart(3,"0")}`,
      maq, tipo, desc, turno:"Mañana", op:"Usuario", min_perdidos:0, est:"Abierta",
      hora:new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),
    };
    setIncidencias(p=>[nueva,...p]);
    setDesc(""); setModal(false);
  }

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <KRow items={[
          {l:"Abiertas",     v:abiertas,    c:abiertas>0?"var(--color-text-danger)":undefined},
          {l:"Resueltas hoy",v:incidencias.filter(i=>i.est==="Resuelta").length,c:"var(--color-text-success)"},
          {l:"Min. perdidos",v:minPerdidos, c:minPerdidos>60?"var(--color-text-danger)":"var(--color-text-warning)"},
        ]}/>
        <button onClick={()=>setModal(true)} style={{...ck("danger"),padding:"5px 13px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:500,marginLeft:12,flexShrink:0}}>+ Registrar incidencia</button>
      </div>

      <Card>
        <Tbl cols={["ID","Hora","Máquina","Tipo","Descripción","Turno","Operario","Min.","Estado"]}
          rows={incidencias.map(i=>[
            <span style={mo}>{i.id}</span>,
            <span style={{...mo,fontSize:10.5}}>{i.hora}</span>,
            <b style={mo}>{i.maq}</b>,
            <span style={{fontSize:11,color:"#6b7280"}}>{i.tipo}</span>,
            <span style={{display:"block",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i.desc}</span>,
            <span style={{fontSize:11}}>{i.turno}</span>,
            <span style={{fontSize:11}}>{i.op}</span>,
            <span style={{...mo,fontWeight:i.min_perdidos>20?700:400,color:i.min_perdidos>20?"var(--color-text-danger)":undefined}}>{i.min_perdidos>0?`${i.min_perdidos} min`:"—"}</span>,
            <Bdg t={i.est}/>,
          ])}
        />
      </Card>

      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500}}
          onClick={e=>{if(e.target===e.currentTarget)setModal(false);}}>
          <div style={{background:"#ffffff",border:"1px solid #e5e7eb",borderRadius:12,width:440,maxWidth:"96%",overflow:"hidden"}}>
            <div style={{padding:"13px 18px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontWeight:600,fontSize:14}}>Registrar incidencia</span>
              <button onClick={()=>setModal(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#6b7280"}}>✕</button>
            </div>
            <div style={{padding:18,display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:10.5,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em"}}>Máquina</label>
                  <select value={maq} onChange={e=>setMaq(e.target.value)} style={inp}>
                    {MAQUINAS.filter(m=>m.est!=="Inhabilitada").map(m=><option key={m.id} value={m.id}>{m.id}</option>)}
                  </select>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:10.5,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em"}}>Tipo</label>
                  <select value={tipo} onChange={e=>setTipo(e.target.value)} style={inp}>
                    {TIPOS.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:10.5,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em"}}>Descripción *</label>
                <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={3} placeholder="Describe la incidencia…" style={{...inp,resize:"vertical",fontFamily:"inherit"}}/>
              </div>
            </div>
            <div style={{padding:"12px 18px",borderTop:"1px solid #f3f4f6",display:"flex",justifyContent:"flex-end",gap:8}}>
              <button onClick={()=>setModal(false)} style={{border:"1px solid #e5e7eb",background:"transparent",color:"#111827",padding:"5px 12px",borderRadius:6,cursor:"pointer",fontSize:12}}>Cancelar</button>
              <button onClick={guardar} disabled={!desc.trim()} style={{...ck("danger"),padding:"5px 13px",borderRadius:6,cursor:desc.trim()?"pointer":"not-allowed",fontSize:12,fontWeight:600,opacity:desc.trim()?1:.45}}>Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TAB: OEE ────────────────────────────────────────────────────
function TabOEE() {
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:10}}>
      {MAQUINAS.map(m=>(
        <div key={m.id} style={{background:"#ffffff",border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 14px",opacity:m.est==="Inhabilitada"?.45:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <span style={{fontWeight:600,fontSize:13}}>{m.id}</span><Bdg t={m.est}/>
          </div>
          <div style={{fontSize:10,color:"#6b7280",marginBottom:2}}>{m.tipo} · {m.linea}</div>
          {m.est!=="Inhabilitada"?(
            <>
              <div style={{fontSize:10,color:"#6b7280",marginBottom:7}}>{m.modo==="HORNO"?"🔥 Horno":"→ FIFO"}</div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:2}}>
                <span style={{color:"#6b7280"}}>OEE</span>
                <span style={{fontWeight:600,color:oc(m.oee)}}>{m.oee}%</span>
              </div>
              <div style={{height:5,background:"#f8fafc",borderRadius:3,overflow:"hidden",marginBottom:7}}>
                <div style={{height:"100%",width:`${m.oee}%`,background:oc(m.oee),borderRadius:3}}/>
              </div>
              {[["D",m.disp],["R",m.rend],["C",m.cal]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:10.5,marginTop:3}}>
                  <span style={{color:"#6b7280"}}>{l}</span>
                  <span style={{fontFamily:"monospace"}}>{v}%</span>
                </div>
              ))}
              <div style={{borderTop:"0.5px solid var(--color-border-tertiary)",marginTop:7,paddingTop:6,fontSize:10.5}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{color:"#6b7280"}}>Kg</span>
                  <span style={{fontFamily:"monospace"}}>{m.kg.toLocaleString()}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:2}}>
                  <span style={{color:"#6b7280"}}>Op.</span>
                  <span>{m.op}</span>
                </div>
              </div>
            </>
          ):(
            <div style={{fontSize:11,color:"#6b7280",marginTop:8,textAlign:"center"}}>⊘ Inhabilitada</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── TAB: CIERRE DIARIO ───────────────────────────────────────────
function TabCierre({ ofs, incidencias }) {
  const KG_OBJ = 8200;
  const OFS_OBJ = 18;

  const kgHoy   = ofs.filter(o=>o.est==="Completada").reduce((s,o)=>s+o.kg,0);
  const ofsOk   = ofs.filter(o=>o.est==="Completada").length;
  const ofsPend = ofs.filter(o=>["Pendiente","En Curso","Control Final"].includes(o.est)).length;
  const minPerd = incidencias.reduce((s,i)=>s+i.min_perdidos,0);
  const cumpl   = KG_OBJ>0?Math.round(kgHoy/KG_OBJ*100):0;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {/* Resumen del día */}
      <div style={{background:"#f8fafc",border:"1px solid #e5e7eb",borderRadius:10,padding:"14px 18px"}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Resumen turno · 19/03/2026 · Mañana</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10}}>
          {[
            {l:"Kg producidos",    v:`${kgHoy.toLocaleString()} kg`,   obj:`obj. ${KG_OBJ.toLocaleString()}`, ok:kgHoy>=KG_OBJ},
            {l:"OFs completadas",  v:ofsOk,                            obj:`obj. ${OFS_OBJ}`,                 ok:ofsOk>=OFS_OBJ},
            {l:"OFs pendientes",   v:ofsPend,                          obj:"para turno siguiente",            ok:ofsPend===0},
            {l:"Min. de paradas",  v:`${minPerd} min`,                 obj:"obj. <60 min",                    ok:minPerd<60},
            {l:"Incidencias",      v:incidencias.length,               obj:`${incidencias.filter(i=>i.est==="Abierta").length} abiertas`, ok:incidencias.filter(i=>i.est==="Abierta").length===0},
            {l:"Cumplimiento",     v:`${cumpl}%`,                      obj:"obj. 100%",                       ok:cumpl>=95},
          ].map(({l,v,obj,ok})=>(
            <div key={l} style={{background:"#ffffff",borderRadius:8,padding:"10px 12px",border:`0.5px solid ${ok?"var(--color-border-success)":"var(--color-border-warning)"}`}}>
              <div style={{fontSize:9.5,color:"#6b7280",textTransform:"uppercase",letterSpacing:".05em",marginBottom:3}}>{l}</div>
              <div style={{fontSize:18,fontWeight:700,color:ok?"var(--color-text-success)":"var(--color-text-warning)"}}>{v}</div>
              <div style={{fontSize:10,color:"#6b7280",marginTop:2}}>{obj}</div>
            </div>
          ))}
        </div>
        {/* Barra progreso */}
        <div style={{marginTop:14}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
            <span style={{color:"#6b7280"}}>Producción vs objetivo</span>
            <span style={{fontWeight:600,color:cumpl>=95?"var(--color-text-success)":"var(--color-text-warning)"}}>{cumpl}%</span>
          </div>
          <div style={{height:8,background:"#f8fafc",borderRadius:4,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${Math.min(cumpl,100)}%`,background:cumpl>=95?"#22c55e":cumpl>=75?"#f59e0b":"#ef4444",borderRadius:4,transition:"width .5s"}}/>
          </div>
        </div>
      </div>

      {/* Histórico 7 días */}
      <Card title="Histórico 7 días">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
            <thead><tr>{["Fecha","Kg obj.","Kg real","Cumpl.","OFs obj.","OFs real","Paradas","Incidencias","Rechazos"].map((c,i)=>(
              <th key={i} style={{textAlign:"left",padding:"6px 10px",fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",color:"#6b7280",borderBottom:"1px solid #f3f4f6",background:"#f8fafc",whiteSpace:"nowrap"}}>{c}</th>
            ))}</tr></thead>
            <tbody>
              {HISTORICO_DIARIO.map((d,i)=>{
                const cumplD=Math.round(d.kg_real/d.kg_obj*100);
                const esHoy=i===HISTORICO_DIARIO.length-1;
                return(
                  <tr key={i} style={{background:esHoy?"var(--color-background-info)":""}}>
                    <td style={{padding:"7px 10px",borderBottom:"1px solid #f3f4f6",fontWeight:esHoy?700:400}}>{d.fecha}{esHoy?" (hoy)":""}</td>
                    <td style={{padding:"7px 10px",borderBottom:"1px solid #f3f4f6",fontFamily:"monospace"}}>{d.kg_obj.toLocaleString()}</td>
                    <td style={{padding:"7px 10px",borderBottom:"1px solid #f3f4f6",fontFamily:"monospace",fontWeight:600}}>{d.kg_real.toLocaleString()}</td>
                    <td style={{padding:"7px 10px",borderBottom:"1px solid #f3f4f6"}}>
                      <span style={{fontFamily:"monospace",fontWeight:700,color:cumplD>=95?"var(--color-text-success)":cumplD>=80?"var(--color-text-warning)":"var(--color-text-danger)"}}>{cumplD}%</span>
                    </td>
                    <td style={{padding:"7px 10px",borderBottom:"1px solid #f3f4f6",fontFamily:"monospace"}}>{d.ofs_obj}</td>
                    <td style={{padding:"7px 10px",borderBottom:"1px solid #f3f4f6",fontFamily:"monospace"}}>{d.ofs_real}</td>
                    <td style={{padding:"7px 10px",borderBottom:"1px solid #f3f4f6",fontFamily:"monospace",color:d.paradas_min>60?"var(--color-text-danger)":undefined}}>{d.paradas_min} min</td>
                    <td style={{padding:"7px 10px",borderBottom:"1px solid #f3f4f6",fontFamily:"monospace"}}>{d.incidencias}</td>
                    <td style={{padding:"7px 10px",borderBottom:"1px solid #f3f4f6",fontFamily:"monospace",color:d.rechazos_kg>100?"var(--color-text-danger)":undefined}}>{d.rechazos_kg} kg</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── TAB: FIFO ────────────────────────────────────────────────────
// ─── TAB: PLANIFICACIÓN (drag & drop) ────────────────────────────
const LINEAS_PLAN = [
  { id:"TWIN", label:"Línea TWIN",     maquinas:["TWIN44","TWIN02","PRE-02","GR-02"],  color:"#185FA5" },
  { id:"MN",   label:"Línea MN",       maquinas:["MN-01","PRE-01","GR-01"],             color:"#0F6E56" },
  { id:"BAST", label:"Bastidor",       maquinas:["MN Bastid","GR-BAST","DE02"],         color:"#92400e" },
  { id:"DESAC",label:"Desaceitado",    maquinas:["DC02"],                               color:"#5b21b6" },
];
const TOP_COLOR = { "Negro":"#1f2937","Plata":"#64748b","VH":"#0F6E56","Deltalube":"#6d28d9" };

function PlanOFCard({ o, idx, maq, dragIdx, onDragStart, onDragOver, onDrop, onDragEnd }) {
  const h    = HOMS.find(x=>x.id===o.hid);
  const hoy  = new Date();
  const fe   = o.fe ? o.fe.split("/").reverse().join("-") : null;
  const dias  = fe ? Math.floor((new Date(fe)-hoy)/86400000) : null;
  const atras = dias !== null && dias < 0;
  const urgente = o.prio === "Urgente";
  const isDragging = dragIdx === idx;
  const tc = TOP_COLOR[o.top] || "#374151";

  return(
    <div
      draggable
      onDragStart={()=>onDragStart(idx)}
      onDragOver={e=>{e.preventDefault();onDragOver(idx);}}
      onDrop={()=>onDrop(idx)}
      onDragEnd={onDragEnd}
      style={{
        background: isDragging ? "#f0f9ff" : "#fff",
        border: isDragging ? "2px dashed #3b82f6" : `1.5px solid ${atras?"#fca5a5":"#e5e7eb"}`,
        borderLeft: `4px solid ${tc}`,
        borderRadius: 9,
        padding: "9px 12px",
        cursor: "grab",
        display: "grid",
        gridTemplateColumns: "22px 1fr auto",
        gap: 8,
        alignItems: "start",
        opacity: isDragging ? 0.5 : 1,
        transition: "background .15s, border .15s",
        userSelect: "none",
      }}
    >
      {/* Número posición */}
      <div style={{width:20,height:20,borderRadius:"50%",background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#64748b",flexShrink:0,marginTop:2}}>
        {idx+1}
      </div>
      {/* Info */}
      <div>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
          <span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:"#111827"}}>{o.id}</span>
          {urgente && <span style={{fontSize:9,fontWeight:700,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5",padding:"1px 5px",borderRadius:3}}>⚡ URG</span>}
          {atras   && <span style={{fontSize:9,fontWeight:700,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5",padding:"1px 5px",borderRadius:3}}>⚠ ATRASO</span>}
        </div>
        <div style={{fontSize:11.5,fontWeight:500,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:200}}>
          {h?.desc || cn(o.cli)}
        </div>
        <div style={{fontSize:10.5,color:"#6b7280",marginTop:2}}>{cn(o.cli)}</div>
        <div style={{display:"flex",gap:5,marginTop:4,flexWrap:"wrap"}}>
          <span style={{fontSize:10,background:"#f1f5f9",border:"0.5px solid #e2e8f0",color:"#374151",padding:"1px 6px",borderRadius:4,fontFamily:"monospace"}}>{o.lote}</span>
          <span style={{fontSize:10,background:tc+"22",border:`0.5px solid ${tc}55`,color:tc,padding:"1px 6px",borderRadius:4,display:"flex",alignItems:"center",gap:3}}>
            <Dot top={o.top} sz={7}/>{o.top}
          </span>
        </div>
      </div>
      {/* Métricas */}
      <div style={{textAlign:"right",flexShrink:0}}>
        <div style={{fontFamily:"monospace",fontWeight:700,fontSize:14,color:"#111827"}}>{o.kg} kg</div>
        <div style={{fontSize:10.5,color:"#6b7280",marginTop:1}}>Fe. {o.fe}</div>
        {dias !== null && (
          <div style={{fontSize:10,fontWeight:600,marginTop:2,color:atras?"#b91c1c":dias<=3?"#92400e":"#166534"}}>
            {atras ? `${-dias}d retraso` : dias===0 ? "Hoy" : `${dias}d`}
          </div>
        )}
        <Bdg t={o.est}/>
      </div>
    </div>
  );
}

function PanelMaquina({ maqId, ofsMaq, setOfsOrder }) {
  const [dragFrom, setDragFrom] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  function handleDrop(toIdx) {
    if (dragFrom === null || dragFrom === toIdx) return;
    const newArr = [...ofsMaq];
    const [moved] = newArr.splice(dragFrom, 1);
    newArr.splice(toIdx, 0, moved);
    setOfsOrder(newArr);
  }

  const pendientes = ofsMaq.filter(o=>o.est!=="Completada"&&o.est!=="Expedición");
  const completadas = ofsMaq.filter(o=>o.est==="Completada"||o.est==="Expedición");
  const kgTotal = pendientes.reduce((s,o)=>s+o.kg,0);
  const urgentes = pendientes.filter(o=>o.prio==="Urgente").length;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {/* Header máquina */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#f8fafc",border:"1px solid #e5e7eb",borderRadius:10,padding:"10px 14px"}}>
        <div>
          <div style={{fontSize:15,fontWeight:700,color:"#111827"}}>{maqId}</div>
          <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>
            {pendientes.length} OFs pendientes · {kgTotal.toLocaleString()} kg
            {urgentes>0&&<span style={{marginLeft:8,fontSize:10,fontWeight:700,color:"#b91c1c"}}>⚡ {urgentes} urgente{urgentes>1?"s":""}</span>}
          </div>
        </div>
        <div style={{fontSize:11,color:"#9ca3af",fontStyle:"italic"}}>↕ arrastra para reordenar</div>
      </div>

      {pendientes.length===0 && (
        <div style={{textAlign:"center",color:"#9ca3af",fontSize:12,padding:24,background:"#f9fafb",borderRadius:8,border:"1px dashed #e5e7eb"}}>
          Sin órdenes pendientes en esta máquina
        </div>
      )}

      {/* OFs pendientes — draggable */}
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {pendientes.map((o,idx)=>(
          <PlanOFCard
            key={o.id}
            o={o} idx={idx} maq={maqId}
            dragIdx={dragOver}
            onDragStart={i=>{setDragFrom(i);setDragOver(i);}}
            onDragOver={i=>setDragOver(i)}
            onDrop={handleDrop}
            onDragEnd={()=>{setDragFrom(null);setDragOver(null);}}
          />
        ))}
      </div>

      {/* Completadas colapsadas */}
      {completadas.length>0&&(
        <div style={{fontSize:11,color:"#9ca3af",padding:"6px 10px",background:"#f0fdf4",borderRadius:7,border:"0.5px solid #86efac"}}>
          ✓ {completadas.length} OF{completadas.length>1?"s":""} completada{completadas.length>1?"s":""}
        </div>
      )}
    </div>
  );
}

function TabPlanificacion({ ofs, setOfs }) {
  const [maqSel, setMaqSel] = useState("TWIN44");
  // Orden local por máquina — copia de ofs indexada por maquina
  const [ordenes, setOrdenes] = useState({});

  // Para cada máquina, obtener OFs ordenadas (orden local si existe, sino por defecto)
  function getOfsMaq(maqId) {
    const base = ofs.filter(o=>o.maq===maqId);
    const ord  = ordenes[maqId];
    if (!ord) return base;
    // Reordenar según el orden guardado (por id)
    const map  = Object.fromEntries(base.map(o=>[o.id,o]));
    const sorted = ord.filter(id=>map[id]).map(id=>map[id]);
    const nuevas = base.filter(o=>!ord.includes(o.id));
    return [...sorted, ...nuevas];
  }

  function setOfsOrder(maqId, newArr) {
    setOrdenes(p=>({...p, [maqId]: newArr.map(o=>o.id)}));
  }

  const todasMaqs = LINEAS_PLAN.flatMap(l=>l.maquinas);
  const ofsMaqSel = getOfsMaq(maqSel);
  const maqSinOFs = todasMaqs.filter(m=>ofs.filter(o=>o.maq===m&&o.est!=="Completada"&&o.est!=="Expedición").length===0);

  return(
    <div style={{display:"flex",gap:0,background:"#f9fafb",borderRadius:12,border:"1px solid #e5e7eb",overflow:"hidden",minHeight:500}}>
      {/* Sidebar máquinas */}
      <div style={{width:200,flexShrink:0,borderRight:"1px solid #e5e7eb",background:"#fff",display:"flex",flexDirection:"column"}}>
        {LINEAS_PLAN.map(linea=>(
          <div key={linea.id}>
            {/* Cabecera línea */}
            <div style={{padding:"8px 12px",background:linea.color+"18",borderBottom:"0.5px solid "+linea.color+"33"}}>
              <div style={{fontSize:10,fontWeight:700,color:linea.color,textTransform:"uppercase",letterSpacing:".06em"}}>{linea.label}</div>
            </div>
            {/* Máquinas de la línea */}
            {linea.maquinas.map(mId=>{
              const nPend = ofs.filter(o=>o.maq===mId&&o.est!=="Completada"&&o.est!=="Expedición").length;
              const nUrg  = ofs.filter(o=>o.maq===mId&&o.prio==="Urgente"&&o.est!=="Completada").length;
              const act   = maqSel===mId;
              return(
                <div key={mId} onClick={()=>setMaqSel(mId)}
                  style={{padding:"8px 14px",cursor:"pointer",borderBottom:"0.5px solid #f3f4f6",
                    background:act?linea.color+"18":"#fff",
                    borderLeft:`3px solid ${act?linea.color:"transparent"}`,
                    display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:act?700:500,color:act?linea.color:"#374151"}}>{mId}</div>
                    {nPend>0&&<div style={{fontSize:10,color:"#6b7280",marginTop:1}}>{nPend} OF{nPend>1?"s":""}</div>}
                    {nPend===0&&<div style={{fontSize:10,color:"#d1d5db",marginTop:1}}>vacía</div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                    {nPend>0&&<span style={{fontSize:10,fontWeight:700,background:act?linea.color+"22":"#f1f5f9",color:act?linea.color:"#64748b",padding:"1px 6px",borderRadius:10}}>{nPend}</span>}
                    {nUrg>0&&<span style={{fontSize:9,fontWeight:700,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5",padding:"1px 4px",borderRadius:3}}>⚡{nUrg}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Panel derecho */}
      <div style={{flex:1,padding:14,overflowY:"auto"}}>
        <PanelMaquina
          key={maqSel}
          maqId={maqSel}
          ofsMaq={ofsMaqSel}
          setOfsOrder={newArr=>setOfsOrder(maqSel,newArr)}
        />
      </div>
    </div>
  );
}


// ─── MÓDULO PRINCIPAL ─────────────────────────────────────────────
export default function Produccion() {
  const { ofs, setOfs } = useContext(ERPContext);
  const [tab, setTab]   = useState("panel");
  const [showOF, setShowOF] = useState(false);
  const [estadoMaquinas, setEstadoMaquinas] = useState(ESTADOS_INIT);
  const [incidencias, setIncidencias]       = useState(INCIDENCIAS_INIT);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <Tabs
        items={[
          ["panel",      "Panel tiempo real"],
          ["ofs",        "Órdenes OF"],
          ["estados",    "Estados máquina"],
          ["consumos",   "Consumos"],
          ["incidencias","Incidencias"],
          ["plan",       "Planificación"],
          ["oee",        "OEE"],
          ["cierre",     "Cierre diario"],
        ]}
        cur={tab} onChange={setTab}
      />

      {tab==="panel"       && <TabPanel       ofs={ofs} estadoMaquinas={estadoMaquinas} setEstadoMaquinas={setEstadoMaquinas} incidencias={incidencias}/>}
      {tab==="ofs"         && <TabOFs         ofs={ofs} setOfs={setOfs} onNuevaOF={()=>setShowOF(true)}/>}
      {tab==="estados"     && <TabEstados     estadoMaquinas={estadoMaquinas} setEstadoMaquinas={setEstadoMaquinas}/>}
      {tab==="consumos"    && <TabConsumos/>}
      {tab==="incidencias" && <TabIncidencias incidencias={incidencias} setIncidencias={setIncidencias}/>}
      {tab==="plan"        && <TabPlanificacion ofs={ofs} setOfs={setOfs}/>}
      {tab==="oee"         && <TabOEE/>}
      {tab==="cierre"      && <TabCierre      ofs={ofs} incidencias={incidencias}/>}

      {showOF && (
        <OFModal
          onClose={()=>setShowOF(false)}
          onSave={of=>{ setOfs(p=>[...p,of]); setShowOF(false); setTab("ofs"); }}
        />
      )}
    </div>
  );
}
