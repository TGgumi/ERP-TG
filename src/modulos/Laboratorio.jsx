// src/modulos/Laboratorio.jsx
import { useContext, useState } from "react";
import { ERPContext } from "../ERP";
import { CLIENTES, HOMS, cn } from "../datos";
import { Bdg, Card, Tbl, Tabs, Al, KRow, ck } from "../ui";

// ─── DATOS ───────────────────────────────────────────────────────

const mo  = { fontFamily:"monospace", fontSize:11 };
const inp = { border:"0.5px solid var(--color-border-tertiary)", background:"var(--color-background-secondary)", color:"var(--color-text-primary)", padding:"7px 10px", borderRadius:6, fontSize:12, outline:"none", width:"100%", boxSizing:"border-box" };

// Baños químicos
const BANOS = [
  {
    id:"BAN-001", nombre:"Baño fosfatado Fe — PRE-01", maquina:"PRE-01", producto:"Fosfato Fe",
    estado:"OK", ultima_med:"08:30",
    params:[
      { nombre:"pH",            valor:8.2,  min:7.5,  max:9.0,  unidad:"",     ok:true  },
      { nombre:"Concentración", valor:42.1, min:38.0, max:48.0, unidad:"g/L",  ok:true  },
      { nombre:"Temperatura",   valor:55.3, min:50.0, max:60.0, unidad:"°C",   ok:true  },
      { nombre:"Conductividad", valor:3.8,  min:3.0,  max:5.0,  unidad:"mS/cm",ok:true  },
    ],
    historico:[
      { fecha:"19/03", turno:"M", ph:8.2, conc:42.1, temp:55.3, ok:true  },
      { fecha:"18/03", turno:"T", ph:8.1, conc:41.8, temp:54.9, ok:true  },
      { fecha:"18/03", turno:"M", ph:8.4, conc:43.2, temp:55.8, ok:true  },
      { fecha:"17/03", turno:"T", ph:7.9, conc:39.5, temp:56.1, ok:true  },
      { fecha:"17/03", turno:"M", ph:8.0, conc:40.2, temp:55.0, ok:true  },
    ],
    vida_dias:45, dias_uso:12, prox_cambio:"01/04",
  },
  {
    id:"BAN-002", nombre:"Baño fosfatado Fe — PRE-02", maquina:"PRE-02", producto:"Fosfato Fe",
    estado:"OK", ultima_med:"08:35",
    params:[
      { nombre:"pH",            valor:8.0,  min:7.5,  max:9.0,  unidad:"",     ok:true  },
      { nombre:"Concentración", valor:44.5, min:38.0, max:48.0, unidad:"g/L",  ok:true  },
      { nombre:"Temperatura",   valor:56.1, min:50.0, max:60.0, unidad:"°C",   ok:true  },
      { nombre:"Conductividad", valor:4.2,  min:3.0,  max:5.0,  unidad:"mS/cm",ok:true  },
    ],
    historico:[
      { fecha:"19/03", turno:"M", ph:8.0, conc:44.5, temp:56.1, ok:true  },
      { fecha:"18/03", turno:"T", ph:8.3, conc:45.0, temp:55.5, ok:true  },
      { fecha:"18/03", turno:"M", ph:8.1, conc:43.8, temp:56.0, ok:true  },
    ],
    vida_dias:45, dias_uso:8, prox_cambio:"06/04",
  },
  {
    id:"BAN-003", nombre:"Baño KL120 — TWIN44", maquina:"TWIN44", producto:"KL120 Basecoat",
    estado:"ALERTA", ultima_med:"09:00",
    params:[
      { nombre:"Residuo seco",  valor:248,  min:220,  max:280,  unidad:"g/L",  ok:true  },
      { nombre:"pH",            valor:9.8,  min:8.5,  max:9.5,  unidad:"",     ok:false },
      { nombre:"Temperatura",   valor:23.5, min:20.0, max:28.0, unidad:"°C",   ok:true  },
      { nombre:"Viscosidad",    valor:18.2, min:15.0, max:22.0, unidad:"cP",   ok:true  },
    ],
    historico:[
      { fecha:"19/03", turno:"M", ph:9.8, conc:248, temp:23.5, ok:false },
      { fecha:"18/03", turno:"T", ph:9.3, conc:245, temp:23.1, ok:true  },
      { fecha:"18/03", turno:"M", ph:9.1, conc:242, temp:23.4, ok:true  },
      { fecha:"17/03", turno:"T", ph:9.0, conc:240, temp:22.8, ok:true  },
    ],
    vida_dias:30, dias_uso:22, prox_cambio:"26/03",
  },
  {
    id:"BAN-004", nombre:"Baño Negro GZ — TWIN44", maquina:"TWIN44", producto:"Negro GZ Topcoat",
    estado:"OK", ultima_med:"09:05",
    params:[
      { nombre:"Residuo seco",  valor:192,  min:180,  max:210,  unidad:"g/L",  ok:true  },
      { nombre:"pH",            valor:8.7,  min:8.0,  max:9.0,  unidad:"",     ok:true  },
      { nombre:"Temperatura",   valor:22.8, min:20.0, max:26.0, unidad:"°C",   ok:true  },
      { nombre:"Conductividad", valor:2.9,  min:2.5,  max:4.0,  unidad:"mS/cm",ok:true  },
    ],
    historico:[
      { fecha:"19/03", turno:"M", ph:8.7, conc:192, temp:22.8, ok:true },
      { fecha:"18/03", turno:"T", ph:8.8, conc:194, temp:22.5, ok:true },
    ],
    vida_dias:30, dias_uso:5, prox_cambio:"13/04",
  },
  {
    id:"BAN-005", nombre:"Baño desaceitado — DC02", maquina:"DC02", producto:"Aceite MKR",
    estado:"CRÍTICO", ultima_med:"10:00",
    params:[
      { nombre:"Viscosidad",    valor:28.4, min:15.0, max:25.0, unidad:"cP",   ok:false },
      { nombre:"Contaminación", valor:3.8,  min:0,    max:2.0,  unidad:"%",    ok:false },
      { nombre:"Temperatura",   valor:21.5, min:18.0, max:25.0, unidad:"°C",   ok:true  },
    ],
    historico:[
      { fecha:"19/03", turno:"M", ph:null, conc:28.4, temp:21.5, ok:false },
      { fecha:"18/03", turno:"T", ph:null, conc:24.8, temp:21.0, ok:true  },
      { fecha:"17/03", turno:"M", ph:null, conc:22.1, temp:21.2, ok:true  },
    ],
    vida_dias:14, dias_uso:13, prox_cambio:"20/03",
  },
];

// Muestras y ensayos
const MUESTRAS = [
  { id:"MU-2601", of:"OF-2601", ref:"CLIP MANETA RO",    cli:58,  fecha:"2026-03-19", hora:"08:45", maq:"TWIN44", estado:"En análisis",
    ensayos:[
      { tipo:"Espesor",         metodo:"Medidor magnético",freq:"Control",  valor:12.4, min:10,  max:16,  unidad:"μm",  resultado:"PASS" },
      { tipo:"Adherencia",      metodo:"Cross-cut ISO 2409",freq:"1/turno", valor:0,    min:0,   max:1,   unidad:"Gt",  resultado:"PASS" },
      { tipo:"Aspecto visual",  metodo:"Inspección visual", freq:"100%",    valor:null, min:null,max:null, unidad:"OK/NOK",resultado:"PASS" },
    ]
  },
  { id:"MU-2602", of:"OF-2602", ref:"306 CLIP D.T.",     cli:102, fecha:"2026-03-19", hora:"09:10", maq:"MN-01",  estado:"Finalizada",
    ensayos:[
      { tipo:"Espesor",         metodo:"Medidor magnético",freq:"Control",  valor:13.1, min:10,  max:15,  unidad:"μm",  resultado:"PASS" },
      { tipo:"Aspecto visual",  metodo:"Inspección visual", freq:"100%",    valor:null, min:null,max:null, unidad:"OK/NOK",resultado:"PASS" },
    ]
  },
  { id:"MU-2603", of:"OF-2605", ref:"GRAPA",             cli:87,  fecha:"2026-03-12", hora:"10:30", maq:"PRE-01", estado:"Finalizada",
    ensayos:[
      { tipo:"Adherencia",      metodo:"Cross-cut ISO 2409",freq:"1/turno", valor:2,    min:0,   max:1,   unidad:"Gt",  resultado:"FAIL" },
      { tipo:"Espesor",         metodo:"Medidor magnético",freq:"Control",  valor:11.8, min:10,  max:16,  unidad:"μm",  resultado:"PASS" },
    ]
  },
  { id:"MU-2604", of:"OF-2604", ref:"CASQ. SOLD. Ø22",   cli:458, fecha:"2026-03-18", hora:"14:45", maq:"DC02",   estado:"Pendiente",
    ensayos:[
      { tipo:"Par de apriete",  metodo:"Torquímetro",       freq:"5/lote",  valor:null, min:23,  max:27,  unidad:"Nm",  resultado:"Pendiente" },
    ]
  },
];

// Niebla salina NSS
const NSS = [
  { id:"NS-001", hom_id:1, ref:"306 CLIP D.T.",       cli:102, spec_h:240, horas_act:240, fecha_ini:"2026-01-10", resultado:"PASS",    obs:"Sin corrosión base"             },
  { id:"NS-002", hom_id:4, ref:"CLIP MANETA RO",       cli:58,  spec_h:500, horas_act:500, fecha_ini:"2026-01-15", resultado:"PASS",    obs:"Ligera oxidación en cantos OK"  },
  { id:"NS-003", hom_id:2, ref:"CASQ. SOLD. Ø22",     cli:458, spec_h:720, horas_act:480, fecha_ini:"2026-02-01", resultado:"En curso",obs:"240h restantes"                  },
  { id:"NS-004", hom_id:8, ref:"TENPLATU ETA IRAOTU",  cli:125, spec_h:240, horas_act:240, fecha_ini:"2026-02-10", resultado:"FAIL",    obs:"Corrosión base metal <240h"     },
  { id:"NS-005", hom_id:6, ref:"GRAPA",                cli:87,  spec_h:480, horas_act:120, fecha_ini:"2026-03-05", resultado:"En curso",obs:"360h restantes"                  },
];

// Equipos de laboratorio
const EQUIPOS = [
  { id:"EQ-001", nombre:"Medidor espesor Fischer",   tipo:"Medición",     serie:"FE-2204-A", calib_prox:"2026-06-01", calib_ult:"2025-12-01", estado:"Calibrado",   uso:"Diario"   },
  { id:"EQ-002", nombre:"pH-metro Hach",             tipo:"Análisis",     serie:"HM-4418",   calib_prox:"2026-04-15", calib_ult:"2026-01-15", estado:"Calibrado",   uso:"Diario"   },
  { id:"EQ-003", nombre:"Cámara niebla salina",      tipo:"Ensayo",       serie:"NSS-880B",  calib_prox:"2026-05-20", calib_ult:"2025-11-20", estado:"Calibrado",   uso:"Continuo" },
  { id:"EQ-004", nombre:"Viscosímetro Brookfield",   tipo:"Análisis",     serie:"BK-DV3T",   calib_prox:"2026-03-25", calib_ult:"2025-09-25", estado:"Próximo",     uso:"Diario"   },
  { id:"EQ-005", nombre:"Torquímetro Gedore",        tipo:"Ensayo",       serie:"GD-TRQ22",  calib_prox:"2026-07-10", calib_ult:"2026-01-10", estado:"Calibrado",   uso:"Semanal"  },
  { id:"EQ-006", nombre:"Conductímetro Mettler",     tipo:"Análisis",     serie:"MT-COND5",  calib_prox:"2026-03-22", calib_ult:"2025-09-22", estado:"Vence pronto",uso:"Diario"   },
  { id:"EQ-007", nombre:"Microscopio óptico",        tipo:"Inspección",   serie:"OPT-LEI3",  calib_prox:"2026-09-01", calib_ult:"2025-09-01", estado:"Calibrado",   uso:"Semanal"  },
  { id:"EQ-008", nombre:"Espectrofotómetro UV-Vis",  tipo:"Análisis",     serie:"UVV-A400",  calib_prox:"2026-02-28", calib_ult:"2025-08-28", estado:"Vencido",     uso:"Mensual"  },
];

// ─── HELPERS ─────────────────────────────────────────────────────

function EstadoBano({ est }) {
  const cfg = {
    "OK":      { bg:"#f0fdf4", bd:"#86efac", tx:"#166534", label:"✓ OK"      },
    "ALERTA":  { bg:"#fffbeb", bd:"#fde68a", tx:"#92400e", label:"⚠ Alerta"  },
    "CRÍTICO": { bg:"#fef2f2", bd:"#fca5a5", tx:"#b91c1c", label:"✕ Crítico" },
  }[est] || { bg:"var(--color-background-secondary)", bd:"var(--color-border-tertiary)", tx:"var(--color-text-secondary)", label:est };
  return <span style={{ fontSize:10, fontWeight:700, background:cfg.bg, color:cfg.tx, border:`0.5px solid ${cfg.bd}`, padding:"2px 7px", borderRadius:4 }}>{cfg.label}</span>;
}

function EstadoEquipo({ est }) {
  const cfg = {
    "Calibrado":    { k:"success" },
    "Próximo":      { k:"warning" },
    "Vence pronto": { k:"warning" },
    "Vencido":      { k:"danger"  },
  }[est] || { k:"secondary" };
  return <span style={{ ...ck(cfg.k), fontSize:10, fontWeight:600, padding:"2px 6px", borderRadius:4, display:"inline-flex" }}>{est}</span>;
}

function ResultadoBadge({ r }) {
  const cfg = {
    "PASS":     { bg:"#f0fdf4", bd:"#86efac", tx:"#166534" },
    "FAIL":     { bg:"#fef2f2", bd:"#fca5a5", tx:"#b91c1c" },
    "Pendiente":{ bg:"#fffbeb", bd:"#fde68a", tx:"#92400e" },
    "En curso": { bg:"#eff6ff", bd:"#93c5fd", tx:"#1d4ed8" },
  }[r] || { bg:"var(--color-background-secondary)", bd:"var(--color-border-tertiary)", tx:"var(--color-text-secondary)" };
  return <span style={{ fontSize:10, fontWeight:700, background:cfg.bg, color:cfg.tx, border:`0.5px solid ${cfg.bd}`, padding:"2px 7px", borderRadius:4 }}>{r}</span>;
}

// ─── TAB: BAÑOS QUÍMICOS ──────────────────────────────────────────

// ─── TAB: MUESTRAS Y ENSAYOS ──────────────────────────────────────
function TabEnsayos() {
  const [sel, setSel]    = useState(null);
  const [modal, setModal] = useState(false);
  const [muestras, setMuestras] = useState(MUESTRAS);

  const muestra = muestras.find(m => m.id === sel);
  const pendientes = muestras.filter(m => m.estado === "Pendiente").length;
  const fails      = muestras.flatMap(m => m.ensayos).filter(e => e.resultado === "FAIL").length;

  return (
    <div style={{ display:"flex", gap:12 }}>
      {/* Lista */}
      <div style={{ width:280, flexShrink:0, display:"flex", flexDirection:"column", gap:6 }}>
        {fails > 0 && <Al type="r">✕ {fails} ensayo{fails > 1 ? "s" : ""} con resultado FAIL</Al>}
        <button onClick={() => setModal(true)} style={{ ...ck("info"), padding:"6px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600 }}>
          + Nueva muestra
        </button>

        {muestras.map(m => {
          const activo = sel === m.id;
          const hasFail = m.ensayos.some(e => e.resultado === "FAIL");
          const hasPend = m.ensayos.some(e => e.resultado === "Pendiente");
          return (
            <div key={m.id} onClick={() => setSel(m.id)} style={{ padding:"10px 13px", borderRadius:9, cursor:"pointer",
              border:`0.5px solid ${activo ? "var(--color-border-info)" : hasFail ? "#fca5a5" : "var(--color-border-tertiary)"}`,
              background: activo ? "var(--color-background-info)" : "var(--color-background-primary)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                <span style={{ fontFamily:"monospace", fontSize:10.5, fontWeight:600, color: activo ? "var(--color-text-info)" : "var(--color-text-secondary)" }}>{m.id}</span>
                <Bdg t={m.estado}/>
              </div>
              <div style={{ fontSize:12, fontWeight:600, marginBottom:2 }}>{m.ref}</div>
              <div style={{ fontSize:10.5, color:"var(--color-text-secondary)", marginBottom:4 }}>
                {cn(m.cli)} · {m.maq} · {m.fecha} {m.hora}
              </div>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                {m.ensayos.map((e, i) => <ResultadoBadge key={i} r={e.resultado}/>)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detalle muestra */}
      {muestra ? (
        <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:10, padding:"13px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:700 }}>{muestra.id} — {muestra.ref}</div>
                <div style={{ fontSize:11, color:"var(--color-text-secondary)", marginTop:2 }}>
                  {cn(muestra.cli)} · {muestra.maq} · OF {muestra.of}
                </div>
              </div>
              <Bdg t={muestra.estado}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))", gap:8 }}>
              {[["Fecha",muestra.fecha],["Hora",muestra.hora],["Máquina",muestra.maq],["OF",muestra.of],["Cliente",cn(muestra.cli)]].map(([k,v])=>(
                <div key={k} style={{ background:"var(--color-background-secondary)", borderRadius:6, padding:"6px 10px" }}>
                  <div style={{ fontSize:9.5, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".05em", marginBottom:2 }}>{k}</div>
                  <div style={{ fontSize:11.5, fontWeight:500 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <Card title="Resultados de ensayos">
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11.5 }}>
                <thead><tr>{["Tipo ensayo","Método","Frecuencia","Valor","Mín.","Máx.","Unidad","Resultado"].map((c,i)=>(
                  <th key={i} style={{ textAlign:"left", padding:"6px 10px", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".04em", color:"var(--color-text-secondary)", borderBottom:"0.5px solid var(--color-border-tertiary)", background:"var(--color-background-secondary)", whiteSpace:"nowrap" }}>{c}</th>
                ))}</tr></thead>
                <tbody>
                  {muestra.ensayos.map((e, i) => (
                    <tr key={i} style={{ background: e.resultado === "FAIL" ? "#fef2f2" : "" }}>
                      <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontWeight:500 }}>{e.tipo}</td>
                      <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontSize:11, color:"var(--color-text-secondary)" }}>{e.metodo}</td>
                      <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{e.freq}</td>
                      <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace", fontWeight:700,
                        color: e.resultado === "PASS" ? "var(--color-text-success)" : e.resultado === "FAIL" ? "var(--color-text-danger)" : undefined }}>
                        {e.valor ?? "—"}
                      </td>
                      <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{e.min ?? "—"}</td>
                      <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{e.max ?? "—"}</td>
                      <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{e.unidad}</td>
                      <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)" }}><ResultadoBadge r={e.resultado}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {muestra.ensayos.some(e => e.resultado === "FAIL") && (
            <Al type="r">✕ Ensayo FAIL — generar No Conformidad y notificar a Calidad</Al>
          )}
        </div>
      ) : (
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"var(--color-text-secondary)", fontSize:13 }}>
          ← Selecciona una muestra
        </div>
      )}

      {/* Modal nueva muestra */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.3)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500 }}
          onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-secondary)", borderRadius:12, width:420, maxWidth:"96%", overflow:"hidden" }}>
            <div style={{ padding:"13px 18px", borderBottom:"0.5px solid var(--color-border-tertiary)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontWeight:600, fontSize:14 }}>Nueva muestra de ensayo</span>
              <button onClick={() => setModal(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"var(--color-text-secondary)" }}>✕</button>
            </div>
            <div style={{ padding:18, fontSize:12, color:"var(--color-text-secondary)", textAlign:"center" }}>
              Formulario de registro de muestra — conectar con Supabase para persistencia
            </div>
            <div style={{ padding:"12px 18px", borderTop:"0.5px solid var(--color-border-tertiary)", display:"flex", justifyContent:"flex-end" }}>
              <button onClick={() => setModal(false)} style={{ border:"0.5px solid var(--color-border-secondary)", background:"transparent", color:"var(--color-text-primary)", padding:"5px 12px", borderRadius:6, cursor:"pointer", fontSize:12 }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TAB: NIEBLA SALINA NSS ───────────────────────────────────────


// ─── ESTILOS FIJOS (modales y formularios) ────────────────────────
const MI  = { border:"1.5px solid #d1d5db", borderRadius:8, padding:"8px 11px", fontSize:13, color:"#111827", background:"#fff", outline:"none", width:"100%", boxSizing:"border-box" };
const ML  = { fontSize:11, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:".05em", marginBottom:4, display:"block" };
const MB  = { border:"none", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600, padding:"7px 16px" };
const MBP = { ...MB, background:"#2563eb", color:"#fff" };
const MBG = { ...MB, background:"transparent", border:"1px solid #d1d5db", color:"#374151" };
const MBD = { ...MB, background:"#dc2626", color:"#fff" };
const MBS = { ...MB, padding:"4px 10px", fontSize:11 };

function Campo({ label, required, children }){
  return <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={ML}>{label}{required&&<span style={{color:"#ef4444",marginLeft:2}}>*</span>}</label>{children}</div>;
}
function G2({children}){ return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{children}</div>; }
function G3({children}){ return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>{children}</div>; }
function Sep({label}){ return <div style={{display:"flex",alignItems:"center",gap:10,margin:"4px 0"}}><div style={{flex:1,height:1,background:"#f3f4f6"}}/><span style={{fontSize:11,fontWeight:600,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}}>{label}</span><div style={{flex:1,height:1,background:"#f3f4f6"}}/></div>; }
function OkBdg({ok}){ return <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:ok?"#f0fdf4":"#fef2f2",color:ok?"#166534":"#b91c1c",border:`0.5px solid ${ok?"#86efac":"#fca5a5"}`}}>{ok?"✓ Conforme":"✕ No conforme"}</span>; }

function ModalBase({ titulo, subtitulo, onClose, onGuardar, ancho=580, children }){
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
          <button onClick={onGuardar} style={MBP}>Guardar registro</button>
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

// ─── DATOS INICIALES NSS AMPLIADO ─────────────────────────────────
const SOLUCIONES_INIT = [
  { id:"SOL-001", fecha:"2026-03-20", hora:"09:00", lote_sal:"SAL-2026-03", operario:"A. Martín", litros:600, kg_sal:30, naoh_ml:15, densidad:1032, ph:6.8, ok:true, obs:"" },
  { id:"SOL-002", fecha:"2026-03-13", hora:"09:15", lote_sal:"SAL-2026-02", operario:"A. Martín", litros:600, kg_sal:30, naoh_ml:15, densidad:1031, ph:6.9, ok:true, obs:"" },
];

const CONTROLES_CAMARA_INIT = [
  { id:"CC-001", camara:"C1", fecha_col:"2026-03-17", hora_col:"13:30", fecha_ret:"2026-03-18", hora_ret:"09:00", presion_ent:1.0, presion_sal:0.9, caudal_ent:1.2, caudal_sal:1.1, temp:35.0, vol_recogido:1.8, ph:6.8, densidad:1032, conc_sal:5.1, ok:true, obs:"" },
  { id:"CC-002", camara:"C2", fecha_col:"2026-03-17", hora_col:"13:30", fecha_ret:"2026-03-18", hora_ret:"09:00", presion_ent:1.0, presion_sal:0.9, caudal_ent:1.1, caudal_sal:1.0, temp:35.1, vol_recogido:1.7, ph:6.9, densidad:1031, conc_sal:5.0, ok:true, obs:"" },
];

const MUESTRAS_NSS_INIT = [
  { id:"NSS-2026-001", fecha_alta:"2026-03-10", ref:"CLIP MANETA RO", recubrimiento:"Negro GZ", horas_spec:240, horas_act:240, ox_blanca:false, ox_roja:false, resultado:"PASS", foto:null, fecha_fin:"2026-03-20", obs:"Sin oxidación", ubicacion:"Caja A-1" },
  { id:"NSS-2026-002", fecha_alta:"2026-03-15", ref:"5x16 T44", recubrimiento:"Negro GZ", horas_spec:480, horas_act:120, ox_blanca:true, ox_roja:false, resultado:"En curso", foto:null, fecha_fin:null, obs:"Leve oxidación blanca en hora 120", ubicacion:"Cámara C1" },
  { id:"NSS-2026-003", fecha_alta:"2026-03-18", ref:"TENPLATU T44", recubrimiento:"Plata", horas_spec:240, horas_act:48, ox_blanca:false, ox_roja:false, resultado:"En curso", foto:null, fecha_fin:null, obs:"", ubicacion:"Cámara C2" },
];

// ─── DATOS CONTROL FOSFATADO ──────────────────────────────────────
const FOSFATADO_INIT = [
  { id:"FOS-001", fecha:"2026-03-20", turno:"Mañana", hora:"07:00", ph:5.3, temp:52.0, ac_total:5.4, ac_cons:0.8, gardobond_l:0, aditivo_h7064_l:3.0, ok:true, obs:"Control inicio turno" },
  { id:"FOS-002", fecha:"2026-03-20", turno:"Mañana", hora:"14:30", ph:5.5, temp:51.8, ac_total:5.6, ac_cons:0.9, gardobond_l:0, aditivo_h7064_l:3.0, ok:true, obs:"Control fin turno" },
  { id:"FOS-003", fecha:"2026-03-19", turno:"Mañana", hora:"07:00", ph:5.1, temp:52.5, ac_total:4.8, ac_cons:1.3, gardobond_l:2.5, aditivo_h7064_l:3.5, ok:false, obs:"Acidez consumida alta — corrección con Gardobond A4957" },
];

// ─── DATOS CONTENIDO SÓLIDO ───────────────────────────────────────
const SOLIDO_INIT = [
  { id:"CS-001", fecha:"2026-03-19", linea:"MN-01", producto:"KL120 Negro", viscosidad:"DIN4=25s", temp:20.0, programa:"P-KL120", resultado:65.2, rango_min:62, rango_max:68, ok:true, obs:"" },
  { id:"CS-002", fecha:"2026-03-17", linea:"MN-01", producto:"KL100 Plata", viscosidad:"DIN4=22s", temp:21.0, programa:"P-KL100", resultado:58.8, rango_min:56, rango_max:62, ok:true, obs:"" },
];

// ─── DATOS AGUA Y DEPURACIÓN ──────────────────────────────────────
const DEPURADORA_INIT = [
  { id:"DEP-001", fecha:"2026-03-19", estado_deposito:"Correcto", estado_mezcla:"Homogénea", bomba_ok:true, incidencias:"", acciones:"Verificación rutinaria" },
  { id:"DEP-002", fecha:"2026-03-17", estado_deposito:"Correcto", estado_mezcla:"Homogénea", bomba_ok:false, incidencias:"Bomba dosificadora con caudal reducido", acciones:"Limpieza filtro bomba" },
];

const SAL_PASTILLAS_INIT = [
  { id:"SP-001", fecha:"2026-03-20", cantidad_kg:25, estado_deposito:"80% lleno", operario:"D. Gil", obs:"" },
  { id:"SP-002", fecha:"2026-03-19", cantidad_kg:25, estado_deposito:"65% lleno", operario:"D. Gil", obs:"" },
];

const DUREZA_INIT = [
  { id:"DUR-001", fecha:"2026-03-10", punto:"Entrada red", resultado_ppm:145, limite_ppm:180, ok:true, obs:"" },
  { id:"DUR-002", fecha:"2026-02-24", punto:"Entrada red", resultado_ppm:138, limite_ppm:180, ok:true, obs:"" },
];

const PH_SALIDA_INIT = [
  { id:"PHS-001", fecha:"2026-03-19", punto:"Salida depuradora", ph:7.2, ok:true, obs:"" },
  { id:"PHS-002", fecha:"2026-03-17", punto:"Salida depuradora", ph:7.4, ok:true, obs:"" },
];

// ─── DATOS RECEPCIONES ────────────────────────────────────────────
const RECEPCIONES_PINTURA_INIT = [
  { id:"RP-001", fecha:"2026-03-15", hora:"10:30", proveedor:"Doerken MKS", material:"KL120 Negro GZ", lote:"L2026-0312", cantidad_l:200, pedido:"PED-2026-08", validado:true, adr:true, ubicacion:"Almacén principal — Estante A3", obs:"" },
  { id:"RP-002", fecha:"2026-03-08", hora:"09:00", proveedor:"Doerken MKS", material:"KL100 Plata", lote:"L2026-0298", cantidad_l:100, pedido:"PED-2026-07", validado:true, adr:true, ubicacion:"Almacén principal — Estante A4", obs:"" },
];

const RECEPCIONES_AGUA_INIT = [
  { id:"RA-001", fecha:"2026-03-18", hora:"08:00", proveedor:"AguaPura S.L.", lote:"AP-2026-045", volumen_l:1000, deposito_destino:"Depósito D2", validado:true, albaran:"ALB-2026-0892", obs:"" },
  { id:"RA-002", fecha:"2026-03-04", hora:"07:30", proveedor:"AguaPura S.L.", lote:"AP-2026-031", volumen_l:1000, deposito_destino:"Depósito D1", validado:true, albaran:"ALB-2026-0741", obs:"" },
];

// ─── DATOS EQUIPOS AMPLIADO ───────────────────────────────────────
const CALIBRACIONES_INIT = [
  { id:"CAL-001", fecha:"2026-03-20", hora:"07:00", equipo:"pH-metro Hanna HI98130", sol_ph7:true, sol_ph4:true, resultado:"Correcto", operario:"A. Martín", obs:"" },
  { id:"CAL-002", fecha:"2026-03-19", hora:"07:05", equipo:"pH-metro Hanna HI98130", sol_ph7:true, sol_ph4:true, resultado:"Correcto", operario:"A. Martín", obs:"" },
];

const COPAS_INIT = [
  { id:"COP-001", fecha:"2026-03-17", copa:"Copa DIN4 — ø4mm", disolvente:"Xileno", tiempo_s:18.2, limpieza:false, resultado_final:18.2, ok:true, obs:"" },
  { id:"COP-002", fecha:"2026-03-17", copa:"Copa DIN4 — ø6mm", disolvente:"Butanol", tiempo_s:22.1, limpieza:true, resultado_final:18.0, ok:true, obs:"Requirió limpieza con cepillo nylon ø3" },
];

const ALMACEN_MN01_INIT = [
  { id:"ALM-001", fecha:"2026-03-19", pintura_ok:true, disolvente_ok:true, reposicion:false, cantidad_trasladada:"", medio:"", origen:"", destino:"", almacenamiento_seguro:true, incidencias:"", acciones:"" },
  { id:"ALM-002", fecha:"2026-03-17", pintura_ok:false, disolvente_ok:true, reposicion:true, cantidad_trasladada:"4 bidones KL120", medio:"Traspaleta eléctrica", origen:"Almacén principal", destino:"Almacén intermedio MN01", almacenamiento_seguro:true, incidencias:"Stock KL120 bajo mínimo", acciones:"Reposición completada" },
];

// ═══════════════════════════════════════════════════════════════════

// ─── REGISTRO PDF NIEBLA SALINA ───────────────────────────────────
function SubRegistroPDF() {
  const API_KEY = import.meta.env.VITE_ANTHROPIC_KEY;
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [sel, setSel]             = useState(null);

  async function procesarPDF(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true); setError("");

    // Convertir PDF a base64
    const base64 = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result.split(",")[1]);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-opus-4-5",
          max_tokens: 2000,
          messages: [{
            role: "user",
            content: [
              { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
              { type: "text", text: `Extrae todos los datos de este informe de ensayo de cámara de niebla salina (NSS). 
Devuelve SOLO un JSON con esta estructura exacta, sin markdown ni explicaciones:
{
  "ensayo_num": "",
  "camara_num": "",
  "cliente": "",
  "referencia": "",
  "of": "",
  "codigo_interno": "",
  "albaran": "",
  "serie_lote": "",
  "norma": "",
  "recubrimiento": "",
  "denominacion": "",
  "ox_blanca_horas": 0,
  "ox_roja_horas": 0,
  "num_piezas": 0,
  "fecha_inicio": "",
  "fecha_fin_prevista": "",
  "resultados": [{"fecha":"","horas":0,"nok":0,"acep":0,"ok":0}],
  "ox_blanca_aparicion": "",
  "ox_roja_aparicion": "",
  "duracion_total": "",
  "conclusion": "",
  "comentarios": "",
  "laboratorio": "",
  "validacion": "",
  "fecha_validacion": ""
}` }
            ]
          }]
        })
      });

      const data = await resp.json();
      const txt = data.content?.find(b => b.type === "text")?.text || "";
      const clean = txt.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      const nuevo = {
        ...parsed,
        id: `NSS-PDF-${Date.now()}`,
        archivo: file.name,
        fecha_registro: new Date().toLocaleDateString("es-ES", {day:"2-digit",month:"2-digit",year:"numeric"}) + " " + new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),
      };
      setRegistros(p => [nuevo, ...p]);
      setSel(nuevo);
    } catch(err) {
      setError("Error al procesar el PDF: " + err.message);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  const concC = {
    "Conforme":    {bg:"#d1fae5",tx:"#065f46",bd:"#6ee7b7"},
    "Aceptable":   {bg:"#fef9c3",tx:"#854d0e",bd:"#fde68a"},
    "No conforme": {bg:"#fee2e2",tx:"#b91c1c",bd:"#fca5a5"},
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>

      {/* Upload */}
      <div style={{background:"#f8fafc",border:"2px dashed #cbd5e1",borderRadius:12,padding:"28px 20px",textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:8}}>📄</div>
        <div style={{fontSize:14,fontWeight:700,color:"#334155",marginBottom:4}}>Subir informe NSS en PDF</div>
        <div style={{fontSize:12,color:"#64748b",marginBottom:16}}>La IA extrae automáticamente todos los datos del informe Torres Gumà</div>
        <label style={{display:"inline-block",cursor:"pointer"}}>
          <input type="file" accept=".pdf" onChange={procesarPDF} style={{display:"none"}} disabled={loading}/>
          <span style={{background:loading?"#94a3b8":"#2563eb",color:"#fff",padding:"10px 24px",borderRadius:8,fontSize:13,fontWeight:700,cursor:loading?"not-allowed":"pointer",display:"inline-block"}}>
            {loading ? "⏳ Procesando PDF..." : "📁 Seleccionar PDF"}
          </span>
        </label>
        {error && <div style={{marginTop:12,color:"#b91c1c",fontSize:12,fontWeight:600}}>{error}</div>}
      </div>

      {/* Lista registros */}
      {registros.length > 0 && (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{fontSize:13,fontWeight:700,color:"#111827"}}>Ensayos registrados ({registros.length})</div>
          {registros.map(r => {
            const cc = concC[r.conclusion] || {bg:"#f1f5f9",tx:"#64748b",bd:"#e2e8f0"};
            return (
              <div key={r.id} onClick={()=>setSel(r===sel?null:r)}
                style={{background:"#fff",border:`1px solid ${sel?.id===r.id?"#3b82f6":"#e2e8f0"}`,borderRadius:10,padding:"12px 16px",cursor:"pointer",transition:"all .15s"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <span style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:"#1d4ed8"}}>{r.id}</span>
                  {r.conclusion && <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:cc.bg,color:cc.tx,border:`0.5px solid ${cc.bd}`}}>{r.conclusion}</span>}
                  <span style={{fontSize:11,color:"#6b7280",marginLeft:"auto"}}>{r.fecha_registro} · {r.archivo}</span>
                </div>
                <div style={{fontSize:12,fontWeight:600,color:"#374151",marginTop:4}}>{r.cliente} — {r.referencia}</div>
                <div style={{fontSize:11,color:"#6b7280"}}>{r.recubrimiento} · OF: {r.of} · {r.ox_roja_horas}h NSS spec.</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detalle ensayo seleccionado */}
      {sel && (
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
          {/* Cabecera */}
          <div style={{background:"#1e3a5f",padding:"14px 20px",color:"#fff"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:16,fontWeight:700}}>ENSAYO DE CORROSIÓN EN CÁMARA DE NIEBLA SALINA</div>
                <div style={{fontSize:11,opacity:.8,marginTop:2}}>Norma DIN UNE-EN 9227 · Ensayo NSS</div>
              </div>
              <button onClick={()=>setSel(null)} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:12}}>✕ Cerrar</button>
            </div>
          </div>

          <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:14}}>

            {/* Datos generales */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[
                ["Nombre cliente", sel.cliente],
                ["Referencia", sel.referencia],
                ["OF Torres Gumà", sel.of],
                ["Cód. interno TG", sel.codigo_interno],
                ["Albarán", sel.albaran],
                ["Serie/Lote", sel.serie_lote],
                ["Norma", sel.norma],
                ["Tipo recubrimiento", sel.recubrimiento],
              ].map(([lbl,val])=>val?(
                <div key={lbl} style={{background:"#f8fafc",borderRadius:6,padding:"6px 10px"}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".05em"}}>{lbl}</div>
                  <div style={{fontSize:12,fontWeight:600,color:"#111827"}}>{val||"—"}</div>
                </div>
              ):null)}
            </div>

            {/* Denominación */}
            {sel.denominacion && (
              <div style={{background:"#eff6ff",borderRadius:6,padding:"8px 12px",fontSize:12,color:"#1d4ed8",fontWeight:600}}>
                📦 {sel.denominacion}
              </div>
            )}

            {/* Parámetros */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              {[["Oxidación blanca",sel.ox_blanca_horas+"h"],["Oxidación roja",sel.ox_roja_horas+"h"],["Nº piezas",sel.num_piezas]].map(([lbl,val])=>(
                <div key={lbl} style={{background:"#f8fafc",borderRadius:6,padding:"8px 12px",textAlign:"center"}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#9ca3af",textTransform:"uppercase"}}>{lbl}</div>
                  <div style={{fontSize:18,fontWeight:700,color:"#1e3a5f"}}>{val}</div>
                </div>
              ))}
            </div>

            {/* Fechas */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={{background:"#f8fafc",borderRadius:6,padding:"6px 10px"}}>
                <div style={{fontSize:9,fontWeight:700,color:"#9ca3af",textTransform:"uppercase"}}>Fecha inicio</div>
                <div style={{fontSize:12,fontWeight:600,color:"#111827"}}>{sel.fecha_inicio||"—"}</div>
              </div>
              <div style={{background:"#f8fafc",borderRadius:6,padding:"6px 10px"}}>
                <div style={{fontSize:9,fontWeight:700,color:"#9ca3af",textTransform:"uppercase"}}>Fecha fin prevista</div>
                <div style={{fontSize:12,fontWeight:600,color:"#111827"}}>{sel.fecha_fin_prevista||"—"}</div>
              </div>
            </div>

            {/* Tabla resultados hora a hora */}
            {sel.resultados?.length > 0 && (
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:8}}>Resultados hora a hora</div>
                <div style={{overflowX:"auto"}}>
                  <table style={{borderCollapse:"collapse",fontSize:10,width:"100%"}}>
                    <thead>
                      <tr style={{background:"#1e3a5f",color:"#fff"}}>
                        <th style={{padding:"5px 8px",textAlign:"left"}}>Fecha</th>
                        <th style={{padding:"5px 8px",textAlign:"center"}}>Horas</th>
                        <th style={{padding:"5px 8px",textAlign:"center",color:"#fca5a5"}}>NOK</th>
                        <th style={{padding:"5px 8px",textAlign:"center",color:"#fde68a"}}>ACEP</th>
                        <th style={{padding:"5px 8px",textAlign:"center",color:"#86efac"}}>OK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sel.resultados.map((r,i)=>(
                        <tr key={i} style={{background:i%2===0?"#fff":"#f8fafc"}}>
                          <td style={{padding:"4px 8px",fontWeight:500}}>{r.fecha}</td>
                          <td style={{padding:"4px 8px",textAlign:"center",fontFamily:"monospace",fontWeight:700}}>{r.horas}</td>
                          <td style={{padding:"4px 8px",textAlign:"center",color:r.nok>0?"#b91c1c":"#9ca3af",fontWeight:r.nok>0?700:400}}>{r.nok>0?r.nok:"—"}</td>
                          <td style={{padding:"4px 8px",textAlign:"center",color:r.acep>0?"#854d0e":"#9ca3af",fontWeight:r.acep>0?700:400}}>{r.acep>0?r.acep:"—"}</td>
                          <td style={{padding:"4px 8px",textAlign:"center",color:r.ok>0?"#166534":"#9ca3af",fontWeight:r.ok>0?700:400}}>{r.ok>0?r.ok:"—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Conclusión */}
            {sel.conclusion && (()=>{
              const cc = concC[sel.conclusion]||{bg:"#f1f5f9",tx:"#64748b",bd:"#e2e8f0"};
              return(
                <div style={{background:cc.bg,border:`1px solid ${cc.bd}`,borderRadius:8,padding:"12px 16px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:cc.tx,textTransform:"uppercase",letterSpacing:".05em",marginBottom:4}}>Conclusión del ensayo</div>
                  <div style={{fontSize:15,fontWeight:700,color:cc.tx}}>{sel.conclusion}</div>
                  {sel.ox_blanca_aparicion && <div style={{fontSize:11,color:cc.tx,marginTop:4}}>Oxidación blanca: {sel.ox_blanca_aparicion}</div>}
                  {sel.ox_roja_aparicion   && <div style={{fontSize:11,color:cc.tx,marginTop:2}}>Oxidación roja: {sel.ox_roja_aparicion}</div>}
                  {sel.duracion_total      && <div style={{fontSize:11,color:cc.tx,marginTop:2}}>Duración total: {sel.duracion_total}</div>}
                  {sel.comentarios         && <div style={{fontSize:11,color:cc.tx,marginTop:6,fontStyle:"italic"}}>"{sel.comentarios}"</div>}
                </div>
              );
            })()}

            {/* Firmas */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,borderTop:"1px solid #f1f5f9",paddingTop:12}}>
              {[["Laboratorio",sel.laboratorio],["Validación CNS",sel.validacion],["Fecha validación",sel.fecha_validacion]].map(([lbl,val])=>(
                <div key={lbl} style={{background:"#f8fafc",borderRadius:6,padding:"6px 10px"}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#9ca3af",textTransform:"uppercase"}}>{lbl}</div>
                  <div style={{fontSize:12,color:"#374151"}}>{val||"—"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// TAB NSS COMPLETO (solución salina + cámaras + muestras)
// ═══════════════════════════════════════════════════════════════════
function TabNSSCompleto() {
  const [subtab, setSubtab] = useState("solucion");
  const tabs2 = [["solucion","Solución salina"],["camaras","Control cámaras"],["pdf","📄 Registro PDF"]];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {/* Sub-tabs */}
      <div style={{display:"flex",gap:6,borderBottom:"1px solid #e5e7eb",paddingBottom:8}}>
        {tabs2.map(([k,l])=>(
          <button key={k} onClick={()=>setSubtab(k)} style={{padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:subtab===k?700:500,border:`1px solid ${subtab===k?"#3b82f6":"#e5e7eb"}`,background:subtab===k?"#eff6ff":"#fff",color:subtab===k?"#1d4ed8":"#6b7280"}}>{l}</button>
        ))}
      </div>
      {subtab==="solucion"  && <SubSolucionSalina/>}
      {subtab==="camaras"   && <SubControlCamaras/>}
      {subtab==="pdf"       && <SubRegistroPDF/>}
    </div>
  );
}

// ── Ensayos NSS (alta, seguimiento, cierre) ───────────────────────
function SubMuestrasNSS(){
  const [muestras,setMuestras] = useState(MUESTRAS_NSS_INIT);
  const [sel,setSel]           = useState(null);
  const [modal,setModal]       = useState(null);
  const [confirm,setConfirm]   = useState(false);
  const [form,setForm]         = useState({});
  const [fotoUrl,setFotoUrl]   = useState(null);

  const muestra = muestras.find(m=>m.id===sel);
  const enCurso = muestras.filter(m=>m.resultado==="En curso");

  function abrirNueva(){
    const id=`NSS-${new Date().getFullYear()}-${String(muestras.length+1).padStart(3,"0")}`;
    setForm({id,fecha_alta:new Date().toISOString().slice(0,10),ref:"",recubrimiento:"",horas_spec:240,horas_act:0,ox_blanca:false,ox_roja:false,resultado:"En curso",foto:null,fecha_fin:"",obs:"",ubicacion:""});
    setFotoUrl(null); setModal("form");
  }
  function abrirEditar(){ if(muestra){setForm({...muestra});setFotoUrl(muestra.foto);setModal("form");} }
  function guardar(){
    if(!form.ref)return;
    const reg={...form,foto:fotoUrl};
    if(!muestras.find(m=>m.id===form.id)){setMuestras(p=>[reg,...p]);setSel(reg.id);}
    else{setMuestras(p=>p.map(m=>m.id===form.id?reg:m));}
    setModal(null);
  }
  function eliminar(){ setMuestras(p=>p.filter(m=>m.id!==sel)); setSel(null); setConfirm(false); }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.type==="checkbox"?e.target.checked:e.target.type==="number"?parseFloat(e.target.value)||0:e.target.value}));

  return(
    <div style={{display:"flex",gap:14}}>
      {/* Lista */}
      <div style={{width:280,flexShrink:0,display:"flex",flexDirection:"column",gap:6}}>
        <button onClick={abrirNueva} style={{...MBP,width:"100%",textAlign:"center"}}>+ Nuevo ensayo NSS</button>
        <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:520,overflowY:"auto"}}>
          {muestras.map(m=>{
            const act=sel===m.id;
            const enCur=m.resultado==="En curso";
            const pct=Math.round(m.horas_act/m.horas_spec*100);
            return(
              <div key={m.id} onClick={()=>setSel(m.id)} style={{padding:"10px 12px",borderRadius:9,cursor:"pointer",border:`1.5px solid ${act?"#3b82f6":enCur?"#93c5fd":"#e5e7eb"}`,background:act?"#eff6ff":"#fff"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontFamily:"monospace",fontSize:10,fontWeight:600,color:act?"#1d4ed8":"#6b7280"}}>{m.id}</span>
                  <span style={{fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:3,background:m.resultado==="PASS"?"#f0fdf4":m.resultado==="FAIL"?"#fef2f2":"#eff6ff",color:m.resultado==="PASS"?"#166534":m.resultado==="FAIL"?"#b91c1c":"#1d4ed8"}}>{m.resultado}</span>
                </div>
                <div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{m.ref}</div>
                <div style={{fontSize:10.5,color:"#6b7280"}}>{m.recubrimiento} · {m.horas_spec}h spec</div>
                {enCur&&(
                  <div style={{marginTop:5}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#6b7280",marginBottom:2}}><span>{m.horas_act}h</span><span>{pct}%</span></div>
                    <div style={{height:4,background:"#e5e7eb",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:"#3b82f6",borderRadius:2}}/></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalle */}
      {muestra?(
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button onClick={abrirEditar} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏ Editar / Revisar</button>
            <button onClick={()=>setConfirm(true)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑 Eliminar</button>
          </div>
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"14px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:16,fontWeight:700}}>{muestra.id}</div>
                <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{muestra.ref} · {muestra.recubrimiento}</div>
              </div>
              <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:4,background:muestra.resultado==="PASS"?"#f0fdf4":muestra.resultado==="FAIL"?"#fef2f2":"#eff6ff",color:muestra.resultado==="PASS"?"#166534":muestra.resultado==="FAIL"?"#b91c1c":"#1d4ed8"}}>{muestra.resultado}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8,marginBottom:10}}>
              {[["F. Alta",muestra.fecha_alta],["Horas spec",`${muestra.horas_spec}h`],["Horas actuales",`${muestra.horas_act}h`],["F. Fin",muestra.fecha_fin||"—"],["Ubicación",muestra.ubicacion||"—"]].map(([k,v])=>(
                <div key={k} style={{background:"#f8fafc",borderRadius:6,padding:"6px 10px"}}>
                  <div style={{fontSize:9,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".05em",marginBottom:2}}>{k}</div>
                  <div style={{fontSize:12,fontWeight:600}}>{v}</div>
                </div>
              ))}
            </div>
            {muestra.resultado==="En curso"&&(
              <div style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#6b7280",marginBottom:4}}><span>Progreso</span><span>{Math.round(muestra.horas_act/muestra.horas_spec*100)}%</span></div>
                <div style={{height:8,background:"#e5e7eb",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(Math.round(muestra.horas_act/muestra.horas_spec*100),100)}%`,background:"#3b82f6",borderRadius:4}}/></div>
              </div>
            )}
            <div style={{display:"flex",gap:10}}>
              <span style={{fontSize:11,padding:"3px 10px",borderRadius:4,background:muestra.ox_blanca?"#fffbeb":"#f8fafc",color:muestra.ox_blanca?"#92400e":"#9ca3af",border:`0.5px solid ${muestra.ox_blanca?"#fde68a":"#e2e8f0"}`,fontWeight:500}}>OxBl: {muestra.ox_blanca?"SÍ":"No"}</span>
              <span style={{fontSize:11,padding:"3px 10px",borderRadius:4,background:muestra.ox_roja?"#fef2f2":"#f8fafc",color:muestra.ox_roja?"#b91c1c":"#9ca3af",border:`0.5px solid ${muestra.ox_roja?"#fca5a5":"#e2e8f0"}`,fontWeight:500}}>OxRoj: {muestra.ox_roja?"SÍ":"No"}</span>
            </div>
            {muestra.obs&&<div style={{marginTop:8,fontSize:11.5,color:"#374151",fontStyle:"italic"}}>"{muestra.obs}"</div>}
            {muestra.foto&&<img src={muestra.foto} alt="foto" style={{marginTop:10,width:"100%",maxHeight:160,objectFit:"cover",borderRadius:8,border:"1px solid #e5e7eb"}}/>}
          </div>
        </div>
      ):(
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#9ca3af",fontSize:13}}>← Selecciona un ensayo</div>
      )}

      {modal==="form"&&(
        <ModalBase titulo={!muestras.find(m=>m.id===form.id)?"Nuevo ensayo NSS":"Editar / Revisar ensayo NSS"} subtitulo={form.id} onClose={()=>setModal(null)} onGuardar={guardar} ancho={620}>
          <G2><Campo label="Número de ensayo"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
          <Campo label="Fecha de alta" required><input type="date" value={form.fecha_alta||""} onChange={ff("fecha_alta")} style={MI}/></Campo></G2>
          <G2><Campo label="Referencia / pieza" required><input value={form.ref||""} onChange={ff("ref")} style={MI}/></Campo>
          <Campo label="Recubrimiento"><input value={form.recubrimiento||""} onChange={ff("recubrimiento")} style={MI} placeholder="ej. Negro GZ, Plata KL100…"/></Campo></G2>
          <G3><Campo label="Horas especificación"><input type="number" value={form.horas_spec||0} onChange={ff("horas_spec")} style={MI}/></Campo>
          <Campo label="Horas actuales"><input type="number" value={form.horas_act||0} onChange={ff("horas_act")} style={MI}/></Campo>
          <Campo label="Resultado"><select value={form.resultado||""} onChange={ff("resultado")} style={MI}>{["En curso","PASS","FAIL"].map(r=><option key={r}>{r}</option>)}</select></Campo></G3>
          <G2>
            <Campo label="Oxidación blanca">
              <label style={{display:"flex",alignItems:"center",gap:8,marginTop:6,cursor:"pointer"}}>
                <input type="checkbox" checked={!!form.ox_blanca} onChange={ff("ox_blanca")} style={{width:16,height:16}}/>
                <span style={{fontSize:13,color:"#374151"}}>Presente</span>
              </label>
            </Campo>
            <Campo label="Oxidación roja">
              <label style={{display:"flex",alignItems:"center",gap:8,marginTop:6,cursor:"pointer"}}>
                <input type="checkbox" checked={!!form.ox_roja} onChange={ff("ox_roja")} style={{width:16,height:16}}/>
                <span style={{fontSize:13,color:"#374151"}}>Presente</span>
              </label>
            </Campo>
          </G2>
          {form.resultado!=="En curso"&&<G2><Campo label="Fecha de finalización"><input type="date" value={form.fecha_fin||""} onChange={ff("fecha_fin")} style={MI}/></Campo>
          <Campo label="Ubicación de conservación"><input value={form.ubicacion||""} onChange={ff("ubicacion")} style={MI} placeholder="ej. Caja A-1, Bolsa 3…"/></Campo></G2>}
          <Campo label="Foto de la muestra">
            <label style={{display:"flex",alignItems:"center",gap:10,padding:"10px",border:"2px dashed #d1d5db",borderRadius:8,cursor:"pointer",background:"#f9fafb"}}>
              <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>setFotoUrl(ev.target.result);r.readAsDataURL(f);}}} style={{display:"none"}}/>
              <span style={{fontSize:20}}>📷</span>
              <span style={{fontSize:12,color:"#374151"}}>{fotoUrl?"✓ Foto cargada":"Seleccionar foto"}</span>
            </label>
            {fotoUrl&&<img src={fotoUrl} alt="preview" style={{marginTop:6,width:"100%",maxHeight:120,objectFit:"cover",borderRadius:7,border:"1px solid #e5e7eb"}}/>}
          </Campo>
          <Campo label="Observaciones sobre evolución"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
        </ModalBase>
      )}
      {confirm&&<ModalConfirm texto={`¿Eliminar el ensayo "${muestra?.id}"?`} onClose={()=>setConfirm(false)} onConfirmar={eliminar}/>}
    </div>
  );
}

// ── Preparación solución salina (func. 1) ─────────────────────────
function SubSolucionSalina(){
  const [regs,setRegs]   = useState(SOLUCIONES_INIT);
  const [modal,setModal] = useState(false);
  const [confirm,setConfirm]=useState(null);
  const [form,setForm]   = useState({});
  const [calcLitros, setCalcLitros] = useState(600);
  const kgSalCalc = +(calcLitros/20).toFixed(1);

  function abrirNueva(){
    setForm({id:`SOL-${String(regs.length+1).padStart(3,"0")}`,fecha:new Date().toISOString().slice(0,10),hora:"",lote_sal:"",operario:"",litros:600,kg_sal:30,naoh_ml:15,densidad:"",ph:"",ok:true,obs:""});
    setModal(true);
  }
  function guardar(){
    if(!form.fecha)return;
    const ok=(parseFloat(form.densidad)>=1029&&parseFloat(form.densidad)<=1036)&&(parseFloat(form.ph)>=6.5&&parseFloat(form.ph)<=7.2);
    const reg={...form,ok};
    if(!regs.find(r=>r.id===form.id)){setRegs(p=>[reg,...p]);}
    else{setRegs(p=>p.map(r=>r.id===form.id?reg:r));}
    setModal(false);
  }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.type==="number"?parseFloat(e.target.value)||0:e.target.value}));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:12,color:"#6b7280"}}>Preparación semanal — 1 kg NaCl / 20 L agua · 15 ml NaOH 1M · Densidad: 1029–1036 g/mL · pH: 6,5–7,2</div>
        <button onClick={abrirNueva} style={{...MBP,flexShrink:0}}>+ Nueva preparación</button>
      </div>
      {/* Calculadora kg sal */}
      <div style={{background:"#eff6ff",border:"1px solid #93c5fd",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
        <div style={{fontSize:12,fontWeight:700,color:"#1d4ed8"}}>🧮 Calculadora de sal</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <label style={{fontSize:12,color:"#374151"}}>Litros de depósito:</label>
          <input type="number" value={calcLitros} onChange={e=>setCalcLitros(parseFloat(e.target.value)||0)} style={{border:"1.5px solid #93c5fd",borderRadius:6,padding:"5px 10px",fontSize:13,color:"#111827",background:"#fff",outline:"none",width:80,textAlign:"center"}} min={0}/>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,background:"#fff",border:"1px solid #93c5fd",borderRadius:8,padding:"8px 14px"}}>
          <span style={{fontSize:12,color:"#6b7280"}}>Kg de sal necesarios:</span>
          <span style={{fontSize:22,fontWeight:700,color:"#1d4ed8"}}>{kgSalCalc} kg</span>
        </div>
        <div style={{fontSize:11,color:"#6b7280"}}>({calcLitros} L ÷ 20 = {kgSalCalc} kg NaCl)</div>
      </div>
      <div style={{overflowX:"auto",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
          <thead><tr style={{background:"#f8fafc"}}>{["ID","Fecha","Hora","Lote sal","Operario","Litros","Kg sal","NaOH (ml)","Densidad","pH","Resultado","Acciones"].map(c=><th key={c} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:600,textTransform:"uppercase",color:"#9ca3af",borderBottom:"1px solid #f3f4f6",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
          <tbody>
            {regs.map(r=>(
              <tr key={r.id} style={{background:"#fff"}}>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:600}}>{r.id}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.fecha}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.hora}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.lote_sal}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.operario}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.litros}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.kg_sal}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.naoh_ml}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",color:(r.densidad>=1029&&r.densidad<=1036)?"#166534":"#b91c1c",fontWeight:700}}>{r.densidad}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",color:(r.ph>=6.5&&r.ph<=7.2)?"#166534":"#b91c1c",fontWeight:700}}>{r.ph}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><OkBdg ok={r.ok}/></td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>
                  <div style={{display:"flex",gap:5}}>
                    <button onClick={()=>{setForm({...r});setModal(true);}} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏</button>
                    <button onClick={()=>setConfirm(r.id)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal&&(
        <ModalBase titulo={!regs.find(r=>r.id===form.id)?"Nueva preparación solución salina":"Editar preparación"} onClose={()=>setModal(false)} onGuardar={guardar}>
          <G2><Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
          <Campo label="Fecha" required><input type="date" value={form.fecha||""} onChange={ff("fecha")} style={MI}/></Campo></G2>
          <G3><Campo label="Hora"><input type="time" value={form.hora||""} onChange={ff("hora")} style={MI}/></Campo>
          <Campo label="Lote de sal"><input value={form.lote_sal||""} onChange={ff("lote_sal")} style={MI}/></Campo>
          <Campo label="Operario"><input value={form.operario||""} onChange={ff("operario")} style={MI}/></Campo></G3>
          <Sep label="Composición"/>
          <G3><Campo label="Litros de agua"><input type="number" value={form.litros||0} onChange={ff("litros")} style={MI}/></Campo>
          <Campo label="Kg de sal"><input type="number" value={form.kg_sal||0} onChange={ff("kg_sal")} style={MI}/></Campo>
          <Campo label="NaOH 1M (ml)"><input type="number" value={form.naoh_ml||0} onChange={ff("naoh_ml")} style={MI}/></Campo></G3>
          <Sep label="Resultados analíticos"/>
          <G2><Campo label="Densidad (g/mL) — rango: 1029–1036"><input type="number" step="0.1" value={form.densidad||""} onChange={ff("densidad")} style={{...MI,borderColor:form.densidad?(parseFloat(form.densidad)>=1029&&parseFloat(form.densidad)<=1036?"#86efac":"#fca5a5"):"#d1d5db"}} placeholder="ej. 1032"/></Campo>
          <Campo label="pH — rango: 6,5–7,2"><input type="number" step="0.1" value={form.ph||""} onChange={ff("ph")} style={{...MI,borderColor:form.ph?(parseFloat(form.ph)>=6.5&&parseFloat(form.ph)<=7.2?"#86efac":"#fca5a5"):"#d1d5db"}} placeholder="ej. 6.8"/></Campo></G2>
          <Campo label="Observaciones"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
        </ModalBase>
      )}
      {confirm&&<ModalConfirm texto={`¿Eliminar preparación "${confirm}"?`} onClose={()=>setConfirm(null)} onConfirmar={()=>{setRegs(p=>p.filter(r=>r.id!==confirm));setConfirm(null);}}/>}
    </div>
  );
}

// ── Control cámaras NSS (func. 2) ─────────────────────────────────
function SubControlCamaras(){
  const [regs,setRegs]   = useState(CONTROLES_CAMARA_INIT);
  const [modal,setModal] = useState(false);
  const [confirm,setConfirm]=useState(null);
  const [form,setForm]   = useState({});

  function abrirNueva(){
    setForm({id:`CC-${String(regs.length+1).padStart(3,"0")}`,camara:"C1",fecha_col:new Date().toISOString().slice(0,10),hora_col:"13:30",fecha_ret:"",hora_ret:"",presion_ent:"",presion_sal:"",caudal_ent:"",caudal_sal:"",temp:"",vol_recogido:"",vol_condensacion:"",ph:"",densidad:"",conc_sal:"",ok:true,obs:""});
    setModal(true);
  }
  function guardar(){
    if(!form.camara||!form.fecha_col)return;
    const phOk=parseFloat(form.ph)>=6.5&&parseFloat(form.ph)<=7.2;
    const denOk=parseFloat(form.densidad)>=1029&&parseFloat(form.densidad)<=1036;
    const reg={...form,ok:phOk&&denOk};
    if(!regs.find(r=>r.id===form.id)){setRegs(p=>[reg,...p]);}
    else{setRegs(p=>p.map(r=>r.id===form.id?reg:r));}
    setModal(false);
  }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.value}));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:12,color:"#6b7280"}}>Control 2x/semana según UNE-EN ISO 9227 — Colocación lunes 13:30 h, retirada martes</div>
        <button onClick={abrirNueva} style={{...MBP,flexShrink:0}}>+ Nuevo control</button>
      </div>
      <div style={{overflowX:"auto",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
          <thead><tr style={{background:"#f8fafc"}}>{["ID","Cámara","F. Colocación","F. Retirada","Temp.","Vol. recogido","Vol. condensación","pH","Densidad","Conc. sal","Resultado","Acciones"].map(c=><th key={c} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:600,textTransform:"uppercase",color:"#9ca3af",borderBottom:"1px solid #f3f4f6",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
          <tbody>
            {regs.map(r=>(
              <tr key={r.id}>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:600}}>{r.id}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontWeight:700}}>{r.camara}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.fecha_col} {r.hora_col}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.fecha_ret||"—"} {r.hora_ret||""}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.temp}°C</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.vol_recogido} mL</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.vol_condensacion||"—"} mL</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",color:(r.ph>=6.5&&r.ph<=7.2)?"#166534":"#b91c1c",fontWeight:700}}>{r.ph}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.densidad}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.conc_sal}%</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><OkBdg ok={r.ok}/></td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>
                  <div style={{display:"flex",gap:5}}>
                    <button onClick={()=>{setForm({...r});setModal(true);}} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏</button>
                    <button onClick={()=>setConfirm(r.id)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal&&(
        <ModalBase titulo="Control cámara niebla salina" onClose={()=>setModal(false)} onGuardar={guardar} ancho={620}>
          <G3><Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
          <Campo label="Cámara"><select value={form.camara||""} onChange={ff("camara")} style={MI}>{["C1","C2"].map(c=><option key={c}>{c}</option>)}</select></Campo>
          <div/></G3>
          <Sep label="Colocación de probetas"/>
          <G2><Campo label="Fecha colocación"><input type="date" value={form.fecha_col||""} onChange={ff("fecha_col")} style={MI}/></Campo>
          <Campo label="Hora colocación"><input type="time" value={form.hora_col||""} onChange={ff("hora_col")} style={MI}/></Campo></G2>
          <Sep label="Retirada y análisis"/>
          <G2><Campo label="Fecha retirada"><input type="date" value={form.fecha_ret||""} onChange={ff("fecha_ret")} style={MI}/></Campo>
          <Campo label="Hora retirada"><input type="time" value={form.hora_ret||""} onChange={ff("hora_ret")} style={MI}/></Campo></G2>
          <G3><Campo label="Presión entrada (bar)"><input type="number" step="0.1" value={form.presion_ent||""} onChange={ff("presion_ent")} style={MI}/></Campo>
          <Campo label="Presión salida (bar)"><input type="number" step="0.1" value={form.presion_sal||""} onChange={ff("presion_sal")} style={MI}/></Campo>
          <Campo label="Temperatura (°C)"><input type="number" step="0.1" value={form.temp||""} onChange={ff("temp")} style={MI}/></Campo></G3>
          <G3><Campo label="Caudal entrada"><input type="number" step="0.1" value={form.caudal_ent||""} onChange={ff("caudal_ent")} style={MI}/></Campo>
          <Campo label="Caudal salida"><input type="number" step="0.1" value={form.caudal_sal||""} onChange={ff("caudal_sal")} style={MI}/></Campo>
          <Campo label="Vol. recogido (mL)"><input type="number" step="0.1" value={form.vol_recogido||""} onChange={ff("vol_recogido")} style={MI}/></Campo>
          <Campo label="Vol. total condensación (mL)"><input type="number" step="0.1" value={form.vol_condensacion||""} onChange={ff("vol_condensacion")} style={MI}/></Campo></G3>
          <G3><Campo label="pH — rango: 6,5–7,2"><input type="number" step="0.1" value={form.ph||""} onChange={ff("ph")} style={{...MI,borderColor:form.ph?(parseFloat(form.ph)>=6.5&&parseFloat(form.ph)<=7.2?"#86efac":"#fca5a5"):"#d1d5db"}}/></Campo>
          <Campo label="Densidad (g/mL)"><input type="number" step="0.1" value={form.densidad||""} onChange={ff("densidad")} style={MI}/></Campo>
          <Campo label="Concentración sal (%)"><input type="number" step="0.1" value={form.conc_sal||""} onChange={ff("conc_sal")} style={MI}/></Campo></G3>
          <Campo label="Observaciones"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
        </ModalBase>
      )}
      {confirm&&<ModalConfirm texto={`¿Eliminar control "${confirm}"?`} onClose={()=>setConfirm(null)} onConfirmar={()=>{setRegs(p=>p.filter(r=>r.id!==confirm));setConfirm(null);}}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TAB BAÑOS AMPLIADO — añade control fosfatado y contenido sólido
// ═══════════════════════════════════════════════════════════════════
function TabControlQuimico(){
  const [subtab,setSubtab]=useState("fosfatado");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",gap:6,borderBottom:"1px solid #e5e7eb",paddingBottom:8}}>
        {[["fosfatado","Control fosfatado"],["solido","Contenido sólido pintura"]].map(([k,l])=>(
          <button key={k} onClick={()=>setSubtab(k)} style={{padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:subtab===k?700:500,border:`1px solid ${subtab===k?"#3b82f6":"#e5e7eb"}`,background:subtab===k?"#eff6ff":"#fff",color:subtab===k?"#1d4ed8":"#6b7280"}}>{l}</button>
        ))}
      </div>
      {subtab==="fosfatado" && <SubControlFosfatado/>}
      {subtab==="solido"    && <SubContenidoSolido/>}
    </div>
  );
}

// ── Control fosfatado (func. 4) ───────────────────────────────────
function SubControlFosfatado(){
  const [regs,setRegs]   = useState(FOSFATADO_INIT);
  const [modal,setModal] = useState(false);
  const [confirm,setConfirm]=useState(null);
  const [form,setForm]   = useState({});

  function abrirNueva(){
    setForm({id:`FOS-${String(regs.length+1).padStart(3,"0")}`,fecha:new Date().toISOString().slice(0,10),turno:"Mañana",linea:"PRE-01",hora:"",ph:"",temp:"",ac_total:"",ac_cons:"",gardobond_l:0,aditivo_h7064_l:3,ok:true,obs:""});
    setModal(true);
  }
  function guardar(){
    const phOk=parseFloat(form.ph)>=5&&parseFloat(form.ph)<=5.8;
    const acTOk=parseFloat(form.ac_total)>=5&&parseFloat(form.ac_total)<=6;
    const acCOk=parseFloat(form.ac_cons)>=0.5&&parseFloat(form.ac_cons)<=1.2;
    const ok=phOk&&acTOk&&acCOk;
    // Calcular aditivo automático (20% de Gardobond)
    const aditivo_h7064_l = parseFloat(form.gardobond_l)>0
      ? parseFloat(form.aditivo_h7064_l)||0
      : 3;
    const reg={...form,ok,aditivo_h7064_l};
    if(!regs.find(r=>r.id===form.id)){setRegs(p=>[reg,...p]);}
    else{setRegs(p=>p.map(r=>r.id===form.id?reg:r));}
    setModal(false);
  }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.type==="number"?parseFloat(e.target.value)||0:e.target.value}));
  // Auto-calcular aditivo al cambiar gardobond
  const ffGardobond=e=>{
    const g=parseFloat(e.target.value)||0;
    setForm(p=>({...p,gardobond_l:g,aditivo_h7064_l:+(3+g*0.2).toFixed(1)}));
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:12,color:"#6b7280"}}>2x turno (inicio y fin) · pH: 5–5,8 · Acid. total: 5 · Acid. cons.: 0,5–1,2 · Aditivo H7064: siempre 3L + 20% del Gardobond añadido</div>
        <button onClick={abrirNueva} style={{...MBP,flexShrink:0}}>+ Nuevo control</button>
      </div>
      <div style={{overflowX:"auto",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
          <thead><tr style={{background:"#f8fafc"}}>{["ID","Fecha","Línea","Turno","Hora","pH","Temp.","Ac. Total","Ac. Cons.","Gardobond L","Aditivo H7064 L","Resultado","Acciones"].map(c=><th key={c} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:600,textTransform:"uppercase",color:"#9ca3af",borderBottom:"1px solid #f3f4f6",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
          <tbody>
            {regs.map(r=>{
              const phOk=r.ph>=5&&r.ph<=5.8;
              const acTOk=r.ac_total>=5&&r.ac_total<=6;
              const acCOk=r.ac_cons>=0.5&&r.ac_cons<=1.2;
              return(
                <tr key={r.id}>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:600}}>{r.id}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.fecha}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.linea||"—"}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.turno}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.hora}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",color:phOk?"#166534":"#b91c1c",fontWeight:700}}>{r.ph}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.temp}°C</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",color:acTOk?"#166534":"#b91c1c",fontWeight:700}}>{r.ac_total}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",color:acCOk?"#166534":"#b91c1c",fontWeight:700}}>{r.ac_cons}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.gardobond_l>0?r.gardobond_l:"—"}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.aditivo_h7064_l}</td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><OkBdg ok={r.ok}/></td>
                  <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>
                    <div style={{display:"flex",gap:5}}>
                      <button onClick={()=>{setForm({...r});setModal(true);}} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏</button>
                      <button onClick={()=>setConfirm(r.id)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {modal&&(
        <ModalBase titulo="Control baño de fosfatado" onClose={()=>setModal(false)} onGuardar={guardar} ancho={620}>
          <G3><Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
          <Campo label="Fecha"><input type="date" value={form.fecha||""} onChange={ff("fecha")} style={MI}/></Campo>
          <Campo label="Turno"><select value={form.turno||""} onChange={ff("turno")} style={MI}>{["Mañana","Tarde","Noche"].map(t=><option key={t}>{t}</option>)}</select></Campo></G3>
          <Campo label="Línea de producción"><select value={form.linea||""} onChange={ff("linea")} style={MI}>
            {MAQUINAS.filter(m=>m.est!=="Inhabilitada").map(m=><option key={m.id} value={m.id}>{m.id} — {m.tipo||""} ({m.est||"Operativa"})</option>)}
            {MAQUINAS.filter(m=>m.est==="Inhabilitada").map(m=><option key={m.id} value={m.id} style={{color:"#9ca3af"}}>{m.id} — Inhabilitada</option>)}
          </select></Campo>
          <Campo label="Hora"><input type="time" value={form.hora||""} onChange={ff("hora")} style={MI}/></Campo>
          <Sep label="Parámetros analíticos"/>
          <G2><Campo label="pH — rango 5,0–5,8"><input type="number" step="0.1" value={form.ph||""} onChange={ff("ph")} style={{...MI,borderColor:form.ph?(parseFloat(form.ph)>=5&&parseFloat(form.ph)<=5.8?"#86efac":"#fca5a5"):"#d1d5db"}}/></Campo>
          <Campo label="Temperatura (°C)"><input type="number" step="0.1" value={form.temp||""} onChange={ff("temp")} style={MI}/></Campo></G2>
          <G2><Campo label="Acidez total — rango 5–6"><input type="number" step="0.1" value={form.ac_total||""} onChange={ff("ac_total")} style={{...MI,borderColor:form.ac_total?(parseFloat(form.ac_total)>=5&&parseFloat(form.ac_total)<=6?"#86efac":"#fca5a5"):"#d1d5db"}}/></Campo>
          <Campo label="Acidez consumida — rango 0,5–1,2"><input type="number" step="0.1" value={form.ac_cons||""} onChange={ff("ac_cons")} style={{...MI,borderColor:form.ac_cons?(parseFloat(form.ac_cons)>=0.5&&parseFloat(form.ac_cons)<=1.2?"#86efac":"#fca5a5"):"#d1d5db"}}/></Campo></G2>
          <Sep label="Adiciones de productos"/>
          <G2><Campo label="Gardobond A4957 añadido (L)"><input type="number" step="0.5" value={form.gardobond_l||0} onChange={ffGardobond} style={MI}/></Campo>
          <Campo label="Additive H7064 (L) — auto 3L + 20% Gardobond">
            <input type="number" step="0.1" value={form.aditivo_h7064_l||0} onChange={ff("aditivo_h7064_l")} style={{...MI,background:"#f0fdf4"}}/>
            {form.gardobond_l>0&&<div style={{fontSize:10,color:"#166534",marginTop:3}}>✓ 3L base + {(form.gardobond_l*0.2).toFixed(1)}L (20% de {form.gardobond_l}L Gardobond)</div>}
          </Campo></G2>
          <Campo label="Observaciones e incidencias"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
        </ModalBase>
      )}
      {confirm&&<ModalConfirm texto={`¿Eliminar control "${confirm}"?`} onClose={()=>setConfirm(null)} onConfirmar={()=>{setRegs(p=>p.filter(r=>r.id!==confirm));setConfirm(null);}}/>}
    </div>
  );
}

// ── Contenido sólido pintura (func. 6) ────────────────────────────
function SubContenidoSolido(){
  const [regs,setRegs]   = useState(SOLIDO_INIT);
  const [modal,setModal] = useState(false);
  const [confirm,setConfirm]=useState(null);
  const [form,setForm]   = useState({});

  function abrirNueva(){
    setForm({id:`CS-${String(regs.length+1).padStart(3,"0")}`,fecha:new Date().toISOString().slice(0,10),linea:"MN-01",producto:"",viscosidad:"",temp:"",programa:"",resultado:"",humedad:"",rango_min:"",rango_max:"",ok:true,obs:""});
    setModal(true);
  }
  function guardar(){
    const res=parseFloat(form.resultado);
    const ok=res>=parseFloat(form.rango_min)&&res<=parseFloat(form.rango_max);
    const reg={...form,ok};
    if(!regs.find(r=>r.id===form.id)){setRegs(p=>[reg,...p]);}
    else{setRegs(p=>p.map(r=>r.id===form.id?reg:r));}
    setModal(false);
  }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.value}));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:12,color:"#6b7280"}}>2x/semana · Balanza KERN · Muestras de línea MN01 identificadas con producto, viscosidad y temperatura</div>
        <button onClick={abrirNueva} style={{...MBP,flexShrink:0}}>+ Nuevo control</button>
      </div>
      <div style={{overflowX:"auto",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
          <thead><tr style={{background:"#f8fafc"}}>{["ID","Fecha","Línea","Producto","Viscosidad","Temp.","Programa","Resultado","Humedad %","Rango","Resultado","Acciones"].map(c=><th key={c} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:600,textTransform:"uppercase",color:"#9ca3af",borderBottom:"1px solid #f3f4f6",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
          <tbody>
            {regs.map(r=>(
              <tr key={r.id}>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:600}}>{r.id}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.fecha}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.linea}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontWeight:500}}>{r.producto}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.viscosidad}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.temp}°C</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.programa}</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",color:r.ok?"#166534":"#b91c1c",fontWeight:700}}>{r.resultado}%</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",color:"#6b7280"}}>{r.rango_min}–{r.rango_max}%</td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><OkBdg ok={r.ok}/></td>
                <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>
                  <div style={{display:"flex",gap:5}}>
                    <button onClick={()=>{setForm({...r});setModal(true);}} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏</button>
                    <button onClick={()=>setConfirm(r.id)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal&&(
        <ModalBase titulo="Control contenido sólido de pintura" onClose={()=>setModal(false)} onGuardar={guardar}>
          <G3><Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
          <Campo label="Fecha"><input type="date" value={form.fecha||""} onChange={ff("fecha")} style={MI}/></Campo>
          <Campo label="Línea"><input value={form.linea||""} onChange={ff("linea")} style={MI}/></Campo></G3>
          <G2><Campo label="Producto" required><input value={form.producto||""} onChange={ff("producto")} style={MI} placeholder="ej. KL120 Negro"/></Campo>
          <Campo label="Programa KERN"><input value={form.programa||""} onChange={ff("programa")} style={MI} placeholder="ej. P-KL120"/></Campo></G2>
          <G2><Campo label="Viscosidad"><input value={form.viscosidad||""} onChange={ff("viscosidad")} style={MI} placeholder="ej. DIN4=25s"/></Campo>
          <Campo label="Temperatura (°C)"><input type="number" step="0.1" value={form.temp||""} onChange={ff("temp")} style={MI}/></Campo></G2>
          <Sep label="Resultado"/>
          <G3><Campo label="Resultado (%)"><input type="number" step="0.1" value={form.resultado||""} onChange={ff("resultado")} style={MI}/></Campo>
          <Campo label="Humedad (%)"><input type="number" step="0.1" value={form.humedad||""} onChange={ff("humedad")} style={MI} placeholder="ej. 2.3"/></Campo></G3>
          <G2><Campo label="Rango mín. (%)"><input type="number" step="0.1" value={form.rango_min||""} onChange={ff("rango_min")} style={MI}/></Campo>
          <Campo label="Rango máx. (%)"><input type="number" step="0.1" value={form.rango_max||""} onChange={ff("rango_max")} style={MI}/></Campo></G2>
          <Campo label="Observaciones"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
        </ModalBase>
      )}
      {confirm&&<ModalConfirm texto={`¿Eliminar control "${confirm}"?`} onClose={()=>setConfirm(null)} onConfirmar={()=>{setRegs(p=>p.filter(r=>r.id!==confirm));setConfirm(null);}}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TAB AGUA Y DEPURACIÓN (funcs. 7, 8, 9, 12)
// ═══════════════════════════════════════════════════════════════════
function TabAguaDepuracion(){
  const [subtab,setSubtab]=useState("depuradora");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",gap:6,borderBottom:"1px solid #e5e7eb",paddingBottom:8,flexWrap:"wrap"}}>
        {[["depuradora","Depuradora"],["sal","Sal pastillas"],["dureza","Dureza agua"],["ph_salida","pH salida"]].map(([k,l])=>(
          <button key={k} onClick={()=>setSubtab(k)} style={{padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:subtab===k?700:500,border:`1px solid ${subtab===k?"#3b82f6":"#e5e7eb"}`,background:subtab===k?"#eff6ff":"#fff",color:subtab===k?"#1d4ed8":"#6b7280"}}>{l}</button>
        ))}
      </div>
      {subtab==="depuradora" && <SubDepuradora/>}
      {subtab==="sal"        && <SubSalPastillas/>}
      {subtab==="dureza"     && <SubDurezaAgua/>}
      {subtab==="ph_salida"  && <SubPhSalida/>}
    </div>
  );
}

function SubDepuradora(){
  const [regs,setRegs]=useState(DEPURADORA_INIT);
  const [modal,setModal]=useState(false);
  const [confirm,setConfirm]=useState(null);
  const [form,setForm]=useState({});
  function abrirNueva(){ setForm({id:`DEP-${String(regs.length+1).padStart(3,"0")}`,fecha:new Date().toISOString().slice(0,10),estado_deposito:"Correcto",estado_mezcla:"Homogénea",bomba_ok:true,incidencias:"",acciones:""}); setModal(true); }
  function guardar(){ const reg={...form}; if(!regs.find(r=>r.id===form.id)){setRegs(p=>[reg,...p]);}else{setRegs(p=>p.map(r=>r.id===form.id?reg:r));} setModal(false); }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.type==="checkbox"?e.target.checked:e.target.value}));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:12,color:"#6b7280"}}>2x/semana — depósito SIDAFLOC + bomba dosificadora</div>
        <button onClick={abrirNueva} style={{...MBP,flexShrink:0}}>+ Nueva verificación</button>
      </div>
      <div style={{overflowX:"auto",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
          <thead><tr style={{background:"#f8fafc"}}>{["ID","Fecha","Depósito","Mezcla","Bomba","Incidencias","Acciones realizadas","Acciones"].map(c=><th key={c} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:600,textTransform:"uppercase",color:"#9ca3af",borderBottom:"1px solid #f3f4f6",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
          <tbody>{regs.map(r=>(
            <tr key={r.id}>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:600}}>{r.id}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.fecha}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.estado_deposito}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.estado_mezcla}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><OkBdg ok={r.bomba_ok}/></td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11,color:r.incidencias?"#b91c1c":"#9ca3af",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.incidencias||"—"}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.acciones||"—"}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><div style={{display:"flex",gap:5}}>
                <button onClick={()=>{setForm({...r});setModal(true);}} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏</button>
                <button onClick={()=>setConfirm(r.id)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal&&(<ModalBase titulo="Verificación depuradora" onClose={()=>setModal(false)} onGuardar={guardar}>
        <G2><Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
        <Campo label="Fecha"><input type="date" value={form.fecha||""} onChange={ff("fecha")} style={MI}/></Campo></G2>
        <G2><Campo label="Estado depósito"><input value={form.estado_deposito||""} onChange={ff("estado_deposito")} style={MI}/></Campo>
        <Campo label="Estado mezcla"><input value={form.estado_mezcla||""} onChange={ff("estado_mezcla")} style={MI}/></Campo></G2>
        <Campo label="Bomba dosificadora">
          <label style={{display:"flex",alignItems:"center",gap:8,marginTop:6,cursor:"pointer"}}>
            <input type="checkbox" checked={!!form.bomba_ok} onChange={ff("bomba_ok")} style={{width:16,height:16}}/>
            <span style={{fontSize:13}}>Funcionamiento correcto</span>
          </label>
        </Campo>
        <Campo label="Incidencias detectadas"><textarea value={form.incidencias||""} onChange={ff("incidencias")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
        <Campo label="Acciones realizadas"><textarea value={form.acciones||""} onChange={ff("acciones")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
      </ModalBase>)}
      {confirm&&<ModalConfirm texto={`¿Eliminar verificación "${confirm}"?`} onClose={()=>setConfirm(null)} onConfirmar={()=>{setRegs(p=>p.filter(r=>r.id!==confirm));setConfirm(null);}}/>}
    </div>
  );
}

function SubSalPastillas(){
  const [regs,setRegs]=useState(SAL_PASTILLAS_INIT);
  const [modal,setModal]=useState(false);
  const [confirm,setConfirm]=useState(null);
  const [form,setForm]=useState({});
  function abrirNueva(){ setForm({id:`SP-${String(regs.length+1).padStart(3,"0")}`,fecha:new Date().toISOString().slice(0,10),cantidad_kg:25,estado_deposito:"",operario:"",obs:""}); setModal(true); }
  function guardar(){ const reg={...form,cantidad_kg:parseFloat(form.cantidad_kg)||0}; if(!regs.find(r=>r.id===form.id)){setRegs(p=>[reg,...p]);}else{setRegs(p=>p.map(r=>r.id===form.id?reg:r));} setModal(false); }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:12,color:"#6b7280"}}>Reposición diaria — sacos 25 kg — sistema descalcificación depuradora</div>
        <button onClick={abrirNueva} style={{...MBP,flexShrink:0}}>+ Nueva reposición</button>
      </div>
      <div style={{overflowX:"auto",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
          <thead><tr style={{background:"#f8fafc"}}>{["ID","Fecha","Cantidad (kg)","Estado depósito","Operario","Observaciones","Acciones"].map(c=><th key={c} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:600,textTransform:"uppercase",color:"#9ca3af",borderBottom:"1px solid #f3f4f6",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
          <tbody>{regs.map(r=>(
            <tr key={r.id}>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:600}}>{r.id}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.fecha}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:700}}>{r.cantidad_kg} kg</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.estado_deposito}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.operario}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11,color:"#6b7280"}}>{r.obs||"—"}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><div style={{display:"flex",gap:5}}>
                <button onClick={()=>{setForm({...r});setModal(true);}} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏</button>
                <button onClick={()=>setConfirm(r.id)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal&&(<ModalBase titulo="Reposición sal pastillas" onClose={()=>setModal(false)} onGuardar={guardar}>
        <G2><Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
        <Campo label="Fecha"><input type="date" value={form.fecha||""} onChange={ff("fecha")} style={MI}/></Campo></G2>
        <G2><Campo label="Cantidad añadida (kg)"><input type="number" value={form.cantidad_kg||0} onChange={ff("cantidad_kg")} style={MI}/></Campo>
        <Campo label="Estado depósito"><input value={form.estado_deposito||""} onChange={ff("estado_deposito")} style={MI} placeholder="ej. 80% lleno"/></Campo></G2>
        <Campo label="Operario responsable"><input value={form.operario||""} onChange={ff("operario")} style={MI}/></Campo>
        <Campo label="Observaciones"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
      </ModalBase>)}
      {confirm&&<ModalConfirm texto={`¿Eliminar reposición "${confirm}"?`} onClose={()=>setConfirm(null)} onConfirmar={()=>{setRegs(p=>p.filter(r=>r.id!==confirm));setConfirm(null);}}/>}
    </div>
  );
}

function SubDurezaAgua(){
  const [regs,setRegs]=useState(DUREZA_INIT);
  const [modal,setModal]=useState(false);
  const [confirm,setConfirm]=useState(null);
  const [form,setForm]=useState({});
  function abrirNueva(){ setForm({id:`DUR-${String(regs.length+1).padStart(3,"0")}`,fecha:new Date().toISOString().slice(0,10),punto:"Entrada red",resultado_ppm:"",limite_ppm:180,ok:true,obs:""}); setModal(true); }
  function guardar(){ const ok=parseFloat(form.resultado_ppm)<=parseFloat(form.limite_ppm||180); const reg={...form,resultado_ppm:parseFloat(form.resultado_ppm)||0,limite_ppm:parseFloat(form.limite_ppm)||180,ok}; if(!regs.find(r=>r.id===form.id)){setRegs(p=>[reg,...p]);}else{setRegs(p=>p.map(r=>r.id===form.id?reg:r));} setModal(false); }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:12,color:"#6b7280"}}>Cada 15 días · Kit FTK 118 · Límite máximo: 180 ppm</div>
        <button onClick={abrirNueva} style={{...MBP,flexShrink:0}}>+ Nuevo control</button>
      </div>
      <div style={{overflowX:"auto",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
          <thead><tr style={{background:"#f8fafc"}}>{["ID","Fecha","Punto","Resultado (ppm)","Límite (ppm)","Resultado","Observaciones","Acciones"].map(c=><th key={c} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:600,textTransform:"uppercase",color:"#9ca3af",borderBottom:"1px solid #f3f4f6",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
          <tbody>{regs.map(r=>(
            <tr key={r.id}>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:600}}>{r.id}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.fecha}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.punto}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:700,color:r.ok?"#166534":"#b91c1c"}}>{r.resultado_ppm}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",color:"#6b7280"}}>{r.limite_ppm}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><OkBdg ok={r.ok}/></td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11,color:"#6b7280"}}>{r.obs||"—"}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><div style={{display:"flex",gap:5}}>
                <button onClick={()=>{setForm({...r});setModal(true);}} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏</button>
                <button onClick={()=>setConfirm(r.id)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal&&(<ModalBase titulo="Control dureza agua" onClose={()=>setModal(false)} onGuardar={guardar}>
        <G2><Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
        <Campo label="Fecha"><input type="date" value={form.fecha||""} onChange={ff("fecha")} style={MI}/></Campo></G2>
        <G2><Campo label="Punto de toma"><input value={form.punto||""} onChange={ff("punto")} style={MI}/></Campo>
        <Campo label="Límite máximo (ppm)"><input type="number" value={form.limite_ppm||180} onChange={ff("limite_ppm")} style={MI}/></Campo></G2>
        <Campo label="Resultado (ppm)" required><input type="number" step="1" value={form.resultado_ppm||""} onChange={ff("resultado_ppm")} style={{...MI,borderColor:form.resultado_ppm?(parseFloat(form.resultado_ppm)<=180?"#86efac":"#fca5a5"):"#d1d5db"}}/></Campo>
        <Campo label="Observaciones"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
      </ModalBase>)}
      {confirm&&<ModalConfirm texto={`¿Eliminar control "${confirm}"?`} onClose={()=>setConfirm(null)} onConfirmar={()=>{setRegs(p=>p.filter(r=>r.id!==confirm));setConfirm(null);}}/>}
    </div>
  );
}

function SubPhSalida(){
  const [regs,setRegs]=useState(PH_SALIDA_INIT);
  const [modal,setModal]=useState(false);
  const [confirm,setConfirm]=useState(null);
  const [form,setForm]=useState({});
  function abrirNueva(){ setForm({id:`PHS-${String(regs.length+1).padStart(3,"0")}`,fecha:new Date().toISOString().slice(0,10),punto:"Salida depuradora",ph:"",ok:true,obs:""}); setModal(true); }
  function guardar(){ const ok=parseFloat(form.ph)>=6&&parseFloat(form.ph)<=9; const reg={...form,ph:parseFloat(form.ph)||0,ok}; if(!regs.find(r=>r.id===form.id)){setRegs(p=>[reg,...p]);}else{setRegs(p=>p.map(r=>r.id===form.id?reg:r));} setModal(false); }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:12,color:"#6b7280"}}>2x/semana · pH salida depuradora · Rango aceptable: 6–9</div>
        <button onClick={abrirNueva} style={{...MBP,flexShrink:0}}>+ Nuevo control</button>
      </div>
      <div style={{overflowX:"auto",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
          <thead><tr style={{background:"#f8fafc"}}>{["ID","Fecha","Punto","pH","Resultado","Observaciones","Acciones"].map(c=><th key={c} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:600,textTransform:"uppercase",color:"#9ca3af",borderBottom:"1px solid #f3f4f6",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
          <tbody>{regs.map(r=>(
            <tr key={r.id}>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:600}}>{r.id}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.fecha}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.punto}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:700,color:r.ok?"#166534":"#b91c1c"}}>{r.ph}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><OkBdg ok={r.ok}/></td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11,color:"#6b7280"}}>{r.obs||"—"}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><div style={{display:"flex",gap:5}}>
                <button onClick={()=>{setForm({...r});setModal(true);}} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏</button>
                <button onClick={()=>setConfirm(r.id)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal&&(<ModalBase titulo="Control pH salida depuradora" onClose={()=>setModal(false)} onGuardar={guardar}>
        <G2><Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
        <Campo label="Fecha"><input type="date" value={form.fecha||""} onChange={ff("fecha")} style={MI}/></Campo></G2>
        <Campo label="Punto de muestreo"><input value={form.punto||""} onChange={ff("punto")} style={MI}/></Campo>
        <Campo label="Valor de pH" required><input type="number" step="0.1" value={form.ph||""} onChange={ff("ph")} style={{...MI,borderColor:form.ph?(parseFloat(form.ph)>=6&&parseFloat(form.ph)<=9?"#86efac":"#fca5a5"):"#d1d5db"}}/></Campo>
        <Campo label="Observaciones"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
      </ModalBase>)}
      {confirm&&<ModalConfirm texto={`¿Eliminar control "${confirm}"?`} onClose={()=>setConfirm(null)} onConfirmar={()=>{setRegs(p=>p.filter(r=>r.id!==confirm));setConfirm(null);}}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TAB RECEPCIONES (funcs. 13, 14)
// ═══════════════════════════════════════════════════════════════════
function TabRecepciones(){
  const [subtab,setSubtab]=useState("pintura");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",gap:6,borderBottom:"1px solid #e5e7eb",paddingBottom:8}}>
        {[["pintura","Pintura"],["agua","Agua desionizada"]].map(([k,l])=>(
          <button key={k} onClick={()=>setSubtab(k)} style={{padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:subtab===k?700:500,border:`1px solid ${subtab===k?"#3b82f6":"#e5e7eb"}`,background:subtab===k?"#eff6ff":"#fff",color:subtab===k?"#1d4ed8":"#6b7280"}}>{l}</button>
        ))}
      </div>
      {subtab==="pintura" && <SubRecepcionPintura/>}
      {subtab==="agua"    && <SubRecepcionAgua/>}
    </div>
  );
}

function SubRecepcionPintura(){
  const [regs,setRegs]=useState(RECEPCIONES_PINTURA_INIT);
  const [modal,setModal]=useState(false);
  const [confirm,setConfirm]=useState(null);
  const [form,setForm]=useState({});
  function abrirNueva(){ setForm({id:`RP-${String(regs.length+1).padStart(3,"0")}`,fecha:new Date().toISOString().slice(0,10),hora:"",proveedor:"",material:"",lote:"",cantidad_l:0,validado:false,adr:false,ubicacion:"",obs:""}); setModal(true); }
  function guardar(){ const reg={...form,cantidad_l:parseFloat(form.cantidad_l)||0}; if(!regs.find(r=>r.id===form.id)){setRegs(p=>[reg,...p]);}else{setRegs(p=>p.map(r=>r.id===form.id?reg:r));} setModal(false); }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.type==="checkbox"?e.target.checked:e.target.value}));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:12,color:"#6b7280"}}>Recepción y verificación de pintura · Registro ADR obligatorio</div>
        <button onClick={abrirNueva} style={{...MBP,flexShrink:0}}>+ Nueva recepción</button>
      </div>
      <div style={{overflowX:"auto",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
          <thead><tr style={{background:"#f8fafc"}}>{["ID","Fecha","Proveedor","Material","Lote","Cantidad (L)","Pedido","Validado","ADR","Ubicación","Acciones"].map(c=><th key={c} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:600,textTransform:"uppercase",color:"#9ca3af",borderBottom:"1px solid #f3f4f6",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
          <tbody>{regs.map(r=>(
            <tr key={r.id}>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:600}}>{r.id}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.fecha} {r.hora}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontWeight:500}}>{r.proveedor}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.material}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.lote}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:700}}>{r.cantidad_l}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.pedido}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><OkBdg ok={r.validado}/></td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><span style={{fontSize:10,fontWeight:600,padding:"1px 6px",borderRadius:3,background:r.adr?"#f0fdf4":"#fef2f2",color:r.adr?"#166534":"#b91c1c"}}>{r.adr?"✓ ADR":"Pendiente"}</span></td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11,color:"#6b7280",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.ubicacion}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><div style={{display:"flex",gap:5}}>
                <button onClick={()=>{setForm({...r});setModal(true);}} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏</button>
                <button onClick={()=>setConfirm(r.id)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal&&(<ModalBase titulo="Recepción de pintura" onClose={()=>setModal(false)} onGuardar={guardar} ancho={620}>
        <G3><Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
        <Campo label="Fecha"><input type="date" value={form.fecha||""} onChange={ff("fecha")} style={MI}/></Campo>
        <Campo label="Hora"><input type="time" value={form.hora||""} onChange={ff("hora")} style={MI}/></Campo></G3>
        <G2><Campo label="Proveedor" required><input value={form.proveedor||""} onChange={ff("proveedor")} style={MI}/></Campo>
        <Campo label="Material recibido" required><input value={form.material||""} onChange={ff("material")} style={MI} placeholder="ej. KL120 Negro GZ"/></Campo></G2>
        <G2><Campo label="Lote"><input value={form.lote||""} onChange={ff("lote")} style={MI}/></Campo>
        <Campo label="Cantidad (L)"><input type="number" value={form.cantidad_l||0} onChange={ff("cantidad_l")} style={MI}/></Campo></G2>
        <G2>
          <Campo label="Validación entrada">
            <label style={{display:"flex",alignItems:"center",gap:8,marginTop:6,cursor:"pointer"}}><input type="checkbox" checked={!!form.validado} onChange={ff("validado")} style={{width:16,height:16}}/><span style={{fontSize:13}}>Material validado</span></label>
          </Campo>
          <Campo label="Registro ADR">
            <label style={{display:"flex",alignItems:"center",gap:8,marginTop:6,cursor:"pointer"}}><input type="checkbox" checked={!!form.adr} onChange={ff("adr")} style={{width:16,height:16}}/><span style={{fontSize:13}}>Registrado en plataforma ADR</span></label>
          </Campo>
        </G2>
        <Campo label="Ubicación de almacenamiento"><input value={form.ubicacion||""} onChange={ff("ubicacion")} style={MI} placeholder="ej. Almacén principal — Estante A3"/></Campo>
        <Campo label="Incidencias"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
      </ModalBase>)}
      {confirm&&<ModalConfirm texto={`¿Eliminar recepción "${confirm}"?`} onClose={()=>setConfirm(null)} onConfirmar={()=>{setRegs(p=>p.filter(r=>r.id!==confirm));setConfirm(null);}}/>}
    </div>
  );
}

function SubRecepcionAgua(){
  const [regs,setRegs]=useState(RECEPCIONES_AGUA_INIT);
  const [modal,setModal]=useState(false);
  const [confirm,setConfirm]=useState(null);
  const [form,setForm]=useState({});
  function abrirNueva(){ setForm({id:`RA-${String(regs.length+1).padStart(3,"0")}`,fecha:new Date().toISOString().slice(0,10),hora:"",proveedor:"",lote:"",volumen_l:0,deposito_destino:"",obs:""}); setModal(true); }
  function guardar(){ const reg={...form,volumen_l:parseFloat(form.volumen_l)||0}; if(!regs.find(r=>r.id===form.id)){setRegs(p=>[reg,...p]);}else{setRegs(p=>p.map(r=>r.id===form.id?reg:r));} setModal(false); }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.type==="checkbox"?e.target.checked:e.target.value}));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:12,color:"#6b7280"}}>Recepción agua desionizada por furgoneta · Etiquetado de depósito + registro CERTIFICADOS</div>
        <button onClick={abrirNueva} style={{...MBP,flexShrink:0}}>+ Nueva recepción</button>
      </div>
      <div style={{overflowX:"auto",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
          <thead><tr style={{background:"#f8fafc"}}>{["ID","Fecha","Proveedor","Lote","Volumen (L)","Depósito","Observaciones","Acciones"].map(c=><th key={c} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:600,textTransform:"uppercase",color:"#9ca3af",borderBottom:"1px solid #f3f4f6",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
          <tbody>{regs.map(r=>(
            <tr key={r.id}>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:600}}>{r.id}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.fecha} {r.hora}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.proveedor}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.lote}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:700}}>{r.volumen_l} L</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.deposito_destino}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11,color:"#6b7280"}}>{r.obs||"—"}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><div style={{display:"flex",gap:5}}>
                <button onClick={()=>{setForm({...r});setModal(true);}} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏</button>
                <button onClick={()=>setConfirm(r.id)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal&&(<ModalBase titulo="Recepción agua desionizada" onClose={()=>setModal(false)} onGuardar={guardar}>
        <G3><Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
        <Campo label="Fecha"><input type="date" value={form.fecha||""} onChange={ff("fecha")} style={MI}/></Campo>
        <Campo label="Hora"><input type="time" value={form.hora||""} onChange={ff("hora")} style={MI}/></Campo></G3>
        <G2><Campo label="Proveedor"><input value={form.proveedor||""} onChange={ff("proveedor")} style={MI}/></Campo>
        <Campo label="Lote"><input value={form.lote||""} onChange={ff("lote")} style={MI}/></Campo></G2>
        <G2><Campo label="Volumen recibido (L)"><input type="number" value={form.volumen_l||0} onChange={ff("volumen_l")} style={MI}/></Campo>
        <Campo label="Depósito de destino"><input value={form.deposito_destino||""} onChange={ff("deposito_destino")} style={MI} placeholder="ej. Depósito D1"/></Campo></G2>

        <Campo label="Observaciones"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
      </ModalBase>)}
      {confirm&&<ModalConfirm texto={`¿Eliminar recepción "${confirm}"?`} onClose={()=>setConfirm(null)} onConfirmar={()=>{setRegs(p=>p.filter(r=>r.id!==confirm));setConfirm(null);}}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TAB EQUIPOS AMPLIADO (funcs. 3, 10, 11)
// ═══════════════════════════════════════════════════════════════════
function TabEquiposCompleto(){
  const [subtab,setSubtab]=useState("calibracion");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",gap:6,borderBottom:"1px solid #e5e7eb",paddingBottom:8,flexWrap:"wrap"}}>
        {[["calibracion","Calibración pH-metro"],["copas","Copas viscosidad"],["almacen","Almacén MN01"]].map(([k,l])=>(
          <button key={k} onClick={()=>setSubtab(k)} style={{padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:subtab===k?700:500,border:`1px solid ${subtab===k?"#3b82f6":"#e5e7eb"}`,background:subtab===k?"#eff6ff":"#fff",color:subtab===k?"#1d4ed8":"#6b7280"}}>{l}</button>
        ))}
      </div>
      {subtab==="calibracion" && <SubCalibracion/>}
      {subtab==="copas"       && <SubCopasViscosidad/>}
      {subtab==="almacen"     && <SubAlmacenMN01/>}
    </div>
  );
}

function SubCalibracion(){
  const [regs,setRegs]=useState(CALIBRACIONES_INIT);
  const [modal,setModal]=useState(false);
  const [confirm,setConfirm]=useState(null);
  const [form,setForm]=useState({});
  function abrirNueva(){ setForm({id:`CAL-${String(regs.length+1).padStart(3,"0")}`,fecha:new Date().toISOString().slice(0,10),hora:"",equipo:"pH-metro Hanna HI98130",sol_ph7:false,sol_ph4:false,resultado:"Correcto",operario:"",obs:""}); setModal(true); }
  function guardar(){ const reg={...form}; if(!regs.find(r=>r.id===form.id)){setRegs(p=>[reg,...p]);}else{setRegs(p=>p.map(r=>r.id===form.id?reg:r));} setModal(false); }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.type==="checkbox"?e.target.checked:e.target.value}));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:12,color:"#6b7280"}}>Calibración diaria antes del uso · Tampones pH 7 y pH 4</div>
        <button onClick={abrirNueva} style={{...MBP,flexShrink:0}}>+ Nueva calibración</button>
      </div>
      <div style={{overflowX:"auto",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
          <thead><tr style={{background:"#f8fafc"}}>{["ID","Fecha","Hora","Equipo","Resultado","Operario","Observaciones","Acciones"].map(c=><th key={c} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:600,textTransform:"uppercase",color:"#9ca3af",borderBottom:"1px solid #f3f4f6",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
          <tbody>{regs.map(r=>(
            <tr key={r.id}>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:600}}>{r.id}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.fecha}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.hora}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.equipo}</td>

              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><OkBdg ok={r.resultado==="Correcto"}/></td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.operario}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11,color:"#6b7280"}}>{r.obs||"—"}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><div style={{display:"flex",gap:5}}>
                <button onClick={()=>{setForm({...r});setModal(true);}} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏</button>
                <button onClick={()=>setConfirm(r.id)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal&&(<ModalBase titulo="Calibración pH-metro" onClose={()=>setModal(false)} onGuardar={guardar}>
        <G2><Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
        <Campo label="Fecha"><input type="date" value={form.fecha||""} onChange={ff("fecha")} style={MI}/></Campo></G2>
        <G2><Campo label="Hora"><input type="time" value={form.hora||""} onChange={ff("hora")} style={MI}/></Campo>
        <Campo label="Equipo"><input value={form.equipo||""} onChange={ff("equipo")} style={MI}/></Campo></G2>

        <G2><Campo label="Resultado"><select value={form.resultado||""} onChange={ff("resultado")} style={MI}>{["Correcto","Incorrecto — requiere ajuste"].map(r=><option key={r}>{r}</option>)}</select></Campo>
        <Campo label="Operario"><input value={form.operario||""} onChange={ff("operario")} style={MI}/></Campo></G2>
        <Campo label="Incidencias u observaciones"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
      </ModalBase>)}
      {confirm&&<ModalConfirm texto={`¿Eliminar calibración "${confirm}"?`} onClose={()=>setConfirm(null)} onConfirmar={()=>{setRegs(p=>p.filter(r=>r.id!==confirm));setConfirm(null);}}/>}
    </div>
  );
}

function SubCopasViscosidad(){
  const [regs,setRegs]=useState(COPAS_INIT);
  const [modal,setModal]=useState(false);
  const [confirm,setConfirm]=useState(null);
  const [form,setForm]=useState({});
  function abrirNueva(){ setForm({id:`COP-${String(regs.length+1).padStart(3,"0")}`,fecha:new Date().toISOString().slice(0,10),copa:"Copa DIN4 — ø4mm",disolvente:"",tiempo_s:"",limpieza:false,resultado_final:"",ok:true,obs:""}); setModal(true); }
  function guardar(){ const ok=parseFloat(form.resultado_final)===18; const reg={...form,tiempo_s:parseFloat(form.tiempo_s)||0,resultado_final:parseFloat(form.resultado_final)||0,ok}; if(!regs.find(r=>r.id===form.id)){setRegs(p=>[reg,...p]);}else{setRegs(p=>p.map(r=>r.id===form.id?reg:r));} setModal(false); }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.type==="checkbox"?e.target.checked:e.target.value}));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:12,color:"#6b7280"}}>2x/semana (lunes y viernes) · Tiempo correcto: 18 s · Si no, limpiar orificio con cepillo nylon</div>
        <button onClick={abrirNueva} style={{...MBP,flexShrink:0}}>+ Nueva verificación</button>
      </div>
      <div style={{overflowX:"auto",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
          <thead><tr style={{background:"#f8fafc"}}>{["ID","Fecha","Copa","Disolvente","Tiempo (s)","Limpieza","Resultado final","Resultado","Observaciones","Acciones"].map(c=><th key={c} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:600,textTransform:"uppercase",color:"#9ca3af",borderBottom:"1px solid #f3f4f6",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
          <tbody>{regs.map(r=>(
            <tr key={r.id}>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:600}}>{r.id}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.fecha}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.copa}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.disolvente}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace"}}>{r.tiempo_s}s</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><span style={{fontSize:10,color:r.limpieza?"#92400e":"#9ca3af",fontWeight:r.limpieza?700:400}}>{r.limpieza?"Sí":"No"}</span></td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:700,color:r.ok?"#166534":"#b91c1c"}}>{r.resultado_final}s</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><OkBdg ok={r.ok}/></td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11,color:"#6b7280"}}>{r.obs||"—"}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><div style={{display:"flex",gap:5}}>
                <button onClick={()=>{setForm({...r});setModal(true);}} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏</button>
                <button onClick={()=>setConfirm(r.id)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal&&(<ModalBase titulo="Verificación copa de viscosidad" onClose={()=>setModal(false)} onGuardar={guardar}>
        <G2><Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
        <Campo label="Fecha"><input type="date" value={form.fecha||""} onChange={ff("fecha")} style={MI}/></Campo></G2>
        <G2><Campo label="Copa"><input value={form.copa||""} onChange={ff("copa")} style={MI} placeholder="ej. Copa DIN4 — ø4mm"/></Campo>
        <Campo label="Disolvente"><input value={form.disolvente||""} onChange={ff("disolvente")} style={MI} placeholder="ej. Xileno"/></Campo></G2>
        <G2><Campo label="Tiempo medido (s)"><input type="number" step="0.1" value={form.tiempo_s||""} onChange={ff("tiempo_s")} style={MI} placeholder="Referencia: 18 s"/></Campo>
        <Campo label="Resultado final (s) — tras limpieza si aplica"><input type="number" step="0.1" value={form.resultado_final||""} onChange={ff("resultado_final")} style={{...MI,borderColor:form.resultado_final?(parseFloat(form.resultado_final)===18?"#86efac":"#fca5a5"):"#d1d5db"}}/></Campo></G2>
        <Campo label="Limpieza realizada">
          <label style={{display:"flex",alignItems:"center",gap:8,marginTop:6,cursor:"pointer"}}><input type="checkbox" checked={!!form.limpieza} onChange={ff("limpieza")} style={{width:16,height:16}}/><span style={{fontSize:13}}>Se limpió el orificio con cepillo de nylon</span></label>
        </Campo>
        <Campo label="Observaciones"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
      </ModalBase>)}
      {confirm&&<ModalConfirm texto={`¿Eliminar verificación "${confirm}"?`} onClose={()=>setConfirm(null)} onConfirmar={()=>{setRegs(p=>p.filter(r=>r.id!==confirm));setConfirm(null);}}/>}
    </div>
  );
}

function SubAlmacenMN01(){
  const [regs,setRegs]=useState(ALMACEN_MN01_INIT);
  const [modal,setModal]=useState(false);
  const [confirm,setConfirm]=useState(null);
  const [form,setForm]=useState({});
  function abrirNueva(){ setForm({id:`ALM-${String(regs.length+1).padStart(3,"0")}`,fecha:new Date().toISOString().slice(0,10),pintura_ok:true,disolvente_ok:true,reposicion:false,cantidad_trasladada:"",medio:"",origen:"",destino:"",almacenamiento_seguro:true,incidencias:"",acciones:""}); setModal(true); }
  function guardar(){ const reg={...form}; if(!regs.find(r=>r.id===form.id)){setRegs(p=>[reg,...p]);}else{setRegs(p=>p.map(r=>r.id===form.id?reg:r));} setModal(false); }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.type==="checkbox"?e.target.checked:e.target.value}));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:12,color:"#6b7280"}}>Verificación almacén intermedio MN01 — pintura, disolvente y almacenamiento seguro</div>
        <button onClick={abrirNueva} style={{...MBP,flexShrink:0}}>+ Nueva verificación</button>
      </div>
      <div style={{overflowX:"auto",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
          <thead><tr style={{background:"#f8fafc"}}>{["ID","Fecha","Pintura","Disolvente","Reposición","Cantidad","Medio","Almac. seguro","Incidencias","Acciones"].map(c=><th key={c} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:600,textTransform:"uppercase",color:"#9ca3af",borderBottom:"1px solid #f3f4f6",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
          <tbody>{regs.map(r=>(
            <tr key={r.id}>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontFamily:"monospace",fontWeight:600}}>{r.id}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}>{r.fecha}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><span style={{fontSize:10,color:r.pintura_ok?"#166534":"#b91c1c",fontWeight:700}}>{r.pintura_ok?"✓ OK":"✕ Bajo"}</span></td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><span style={{fontSize:10,color:r.disolvente_ok?"#166534":"#b91c1c",fontWeight:700}}>{r.disolvente_ok?"✓ OK":"✕ Bajo"}</span></td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><span style={{fontSize:10,color:r.reposicion?"#1d4ed8":"#9ca3af",fontWeight:r.reposicion?700:400}}>{r.reposicion?"Sí":"No"}</span></td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11}}>{r.cantidad_trasladada||"—"}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11}}>{r.medio||"—"}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><span style={{fontSize:10,color:r.almacenamiento_seguro?"#166534":"#b91c1c",fontWeight:700}}>{r.almacenamiento_seguro?"✓":"✕"}</span></td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6",fontSize:11,color:r.incidencias?"#b91c1c":"#9ca3af",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.incidencias||"—"}</td>
              <td style={{padding:"8px 10px",borderBottom:"0.5px solid #f3f4f6"}}><div style={{display:"flex",gap:5}}>
                <button onClick={()=>{setForm({...r});setModal(true);}} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏</button>
                <button onClick={()=>setConfirm(r.id)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal&&(<ModalBase titulo="Verificación almacén intermedio MN01" onClose={()=>setModal(false)} onGuardar={guardar} ancho={620}>
        <G2><Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
        <Campo label="Fecha"><input type="date" value={form.fecha||""} onChange={ff("fecha")} style={MI}/></Campo></G2>
        <Sep label="Estado stock"/>
        <G2>
          <Campo label="Pintura">
            <label style={{display:"flex",alignItems:"center",gap:8,marginTop:6,cursor:"pointer"}}><input type="checkbox" checked={!!form.pintura_ok} onChange={ff("pintura_ok")} style={{width:16,height:16}}/><span style={{fontSize:13}}>Stock suficiente</span></label>
          </Campo>
          <Campo label="Disolvente">
            <label style={{display:"flex",alignItems:"center",gap:8,marginTop:6,cursor:"pointer"}}><input type="checkbox" checked={!!form.disolvente_ok} onChange={ff("disolvente_ok")} style={{width:16,height:16}}/><span style={{fontSize:13}}>Stock suficiente</span></label>
          </Campo>
        </G2>
        <Campo label="Reposición realizada">
          <label style={{display:"flex",alignItems:"center",gap:8,marginTop:6,cursor:"pointer"}}><input type="checkbox" checked={!!form.reposicion} onChange={ff("reposicion")} style={{width:16,height:16}}/><span style={{fontSize:13}}>Se realizó reposición</span></label>
        </Campo>
        {form.reposicion&&(<>
          <Sep label="Datos de reposición"/>
          <Campo label="Cantidad trasladada"><input value={form.cantidad_trasladada||""} onChange={ff("cantidad_trasladada")} style={MI} placeholder="ej. 4 bidones KL120"/></Campo>
          <G3><Campo label="Medio de traslado"><input value={form.medio||""} onChange={ff("medio")} style={MI} placeholder="ej. Traspaleta eléctrica"/></Campo>
          <Campo label="Origen"><input value={form.origen||""} onChange={ff("origen")} style={MI}/></Campo>
          <Campo label="Destino"><input value={form.destino||""} onChange={ff("destino")} style={MI}/></Campo></G3>
        </>)}
        <Sep label="Seguridad"/>
        <Campo label="Almacenamiento seguro">
          <label style={{display:"flex",alignItems:"center",gap:8,marginTop:6,cursor:"pointer"}}><input type="checkbox" checked={!!form.almacenamiento_seguro} onChange={ff("almacenamiento_seguro")} style={{width:16,height:16}}/><span style={{fontSize:13}}>Pintura en almacén principal, sin material inflamable fuera de zona autorizada</span></label>
        </Campo>
        <Campo label="Incidencias detectadas"><textarea value={form.incidencias||""} onChange={ff("incidencias")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
        <Campo label="Acciones realizadas"><textarea value={form.acciones||""} onChange={ff("acciones")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
      </ModalBase>)}
      {confirm&&<ModalConfirm texto={`¿Eliminar verificación "${confirm}"?`} onClose={()=>setConfirm(null)} onConfirmar={()=>{setRegs(p=>p.filter(r=>r.id!==confirm));setConfirm(null);}}/>}
    </div>
  );
}

function TabEquipos() {
  const vencidos   = EQUIPOS.filter(e => e.estado === "Vencido");
  const proximos   = EQUIPOS.filter(e => ["Próximo","Vence pronto"].includes(e.estado));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <KRow items={[
        { l:"Total equipos",    v:EQUIPOS.length },
        { l:"Calibrados",       v:EQUIPOS.filter(e=>e.estado==="Calibrado").length,    c:"var(--color-text-success)" },
        { l:"Próx. caducidad",  v:proximos.length,                                     c:proximos.length>0?"var(--color-text-warning)":undefined },
        { l:"Vencidos",         v:vencidos.length,                                     c:vencidos.length>0?"var(--color-text-danger)":undefined },
      ]}/>

      {vencidos.length > 0 && <Al type="r">⊘ {vencidos.length} equipo{vencidos.length>1?"s":""} con calibración vencida — NO usar hasta recalibrar</Al>}
      {proximos.length > 0 && <Al type="w">⚠ {proximos.length} equipo{proximos.length>1?"s":""} con calibración próxima a vencer</Al>}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:10 }}>
        {EQUIPOS.map(eq => {
          const bloq = eq.estado === "Vencido";
          return (
            <div key={eq.id} style={{ background:"var(--color-background-primary)",
              border:`1.5px solid ${bloq ? "#fca5a5" : eq.estado === "Calibrado" ? "#86efac" : "#fde68a"}`,
              borderRadius:10, padding:"12px 14px", opacity: bloq ? .85 : 1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:700 }}>{eq.nombre}</div>
                  <div style={{ fontSize:10.5, color:"var(--color-text-secondary)", marginTop:1 }}>{eq.tipo} · {eq.uso}</div>
                </div>
                <EstadoEquipo est={eq.estado}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginTop:8 }}>
                {[
                  ["Serie",       eq.serie],
                  ["Últ. calibr.",eq.calib_ult],
                  ["Próx. calibr.",eq.calib_prox],
                  ["Estado",      eq.estado],
                ].map(([k,v])=>(
                  <div key={k} style={{ background:"var(--color-background-secondary)", borderRadius:5, padding:"5px 8px" }}>
                    <div style={{ fontSize:9.5, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".04em", marginBottom:1 }}>{k}</div>
                    <div style={{ fontSize:11, fontWeight:500 }}>{v}</div>
                  </div>
                ))}
              </div>
              {bloq && (
                <div style={{ marginTop:8, padding:"5px 10px", borderRadius:5, background:"#fef2f2", color:"#b91c1c", fontSize:11, fontWeight:600 }}>
                  ⊘ Bloqueado — calibración vencida
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TAB: KPIs LABORATORIO ────────────────────────────────────────
function TabKPIs({ ctrl }) {
  const nok     = ctrl.filter(c => !c.ok).length;
  const pctOk   = ctrl.length > 0 ? Math.round(ctrl.filter(c => c.ok).length / ctrl.length * 100) : 100;
  const maqsNok = [...new Set(ctrl.filter(c => !c.ok).map(c => c.maq))];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <KRow items={[
        { l:"Controles hoy",      v:ctrl.length },
        { l:"OK",                 v:ctrl.filter(c=>c.ok).length,   c:"var(--color-text-success)" },
        { l:"NOK",                v:nok,                           c:nok>0?"var(--color-text-danger)":undefined },
        { l:"% conformidad",      v:`${pctOk}%`,                  c:pctOk>=95?"var(--color-text-success)":pctOk>=80?"var(--color-text-warning)":"var(--color-text-danger)" },
        { l:"Baños en alerta",    v:BANOS.filter(b=>b.estado!=="OK").length, c:BANOS.filter(b=>b.estado!=="OK").length>0?"var(--color-text-danger)":undefined },
        { l:"Equipos vencidos",   v:EQUIPOS.filter(e=>e.estado==="Vencido").length, c:EQUIPOS.filter(e=>e.estado==="Vencido").length>0?"var(--color-text-danger)":undefined },
      ]}/>

      {maqsNok.length > 0 && <Al type="r">⚠ Controles NOK en: {maqsNok.join(", ")} — verificar parámetros</Al>}

      {/* Controles del día */}
      <Card title="Controles de proceso — turno actual">
        <Tbl cols={["ID","Hora","Máquina","Parámetro","Valor","Mín.","Máx.","Resultado"]}
          rows={ctrl.map(c => [
            <span style={mo}>{c.id}</span>,
            <span style={{ fontSize:11 }}>{c.ts}</span>,
            <span style={mo}>{c.maq}</span>,
            <span style={{ fontSize:11.5 }}>{c.par}</span>,
            <span style={{ ...mo, fontSize:14, fontWeight:700, color: c.ok ? "var(--color-text-success)" : "var(--color-text-danger)" }}>{c.val}</span>,
            <span style={mo}>{c.min}</span>,
            <span style={mo}>{c.max}</span>,
            <span style={{ fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:4,
              background: c.ok ? "#f0fdf4" : "#fef2f2",
              color:      c.ok ? "#166534" : "#b91c1c",
              border:     `0.5px solid ${c.ok ? "#86efac" : "#fca5a5"}` }}>
              {c.ok ? "✓ OK" : "✕ NOK"}
            </span>,
          ])}
        />
      </Card>

      {/* Estado baños resumen */}
      <Card title="Estado baños — resumen">
        <div style={{ padding:"10px 16px", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:8 }}>
          {BANOS.map(b => {
            const nok = b.params.filter(p => !p.ok).length;
            return (
              <div key={b.id} style={{ background:"var(--color-background-secondary)", borderRadius:8, padding:"9px 12px",
                border:`0.5px solid ${b.estado==="CRÍTICO"?"#fca5a5":b.estado==="ALERTA"?"#fde68a":"var(--color-border-tertiary)"}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                  <span style={{ fontSize:11.5, fontWeight:600 }}>{b.maquina}</span>
                  <EstadoBano est={b.estado}/>
                </div>
                <div style={{ fontSize:10.5, color:"var(--color-text-secondary)" }}>{b.producto}</div>
                {nok > 0 && <div style={{ marginTop:4, fontSize:10, fontWeight:700, color:"#b91c1c" }}>⚠ {nok} param. fuera rango</div>}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── MÓDULO PRINCIPAL ─────────────────────────────────────────────


// ─── MÓDULO PRINCIPAL ─────────────────────────────────────────────
export default function Laboratorio() {
  const { ctrl } = useContext(ERPContext);
  const [tab, setTab] = useState("kpis");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Tabs
        items={[
          ["kpis",     "Dashboard"],
          ["ctrl_quim","Control químico"],
          ["nss",      "NSS Completo"],
          ["agua",     "Agua y depuración"],
          ["recepc",   "Recepciones"],
          ["equipos",  "Equipos y calibración"],
        ]}
        cur={tab} onChange={setTab}
      />

      {tab==="kpis"      && <TabKPIs ctrl={ctrl}/>}
      {tab==="ctrl_quim" && <TabControlQuimico/>}
      {tab==="nss"       && <TabNSSCompleto/>}
      {tab==="agua"      && <TabAguaDepuracion/>}
      {tab==="recepc"    && <TabRecepciones/>}
      {tab==="equipos"   && <TabEquiposCompleto/>}
    </div>
  );
}
