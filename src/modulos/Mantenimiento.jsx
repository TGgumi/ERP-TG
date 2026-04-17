// src/modulos/Mantenimiento.jsx
import { useContext, useState } from "react";
import { ERPContext } from "../ERP";
import { MAQUINAS } from "../datos";
import { Bdg, Card, Tbl, Tabs, Al, KRow, ck } from "../ui";

// ─── DATOS ───────────────────────────────────────────────────────

const mo  = { fontFamily:"monospace", fontSize:11 };
const inp = { border:"0.5px solid var(--color-border-tertiary)", background:"var(--color-background-secondary)", color:"var(--color-text-primary)", padding:"7px 10px", borderRadius:6, fontSize:12, outline:"none", width:"100%", boxSizing:"border-box" };

// Activos — inventario técnico
const ACTIVOS = [
  { id:"ACT-001", maq:"TWIN44",   nombre:"Twin 44 — Centrifugadora bicapa",  fab:"Baruffaldi",   serie:"BRF-T44-2019", inst:"2019-03-15", estado:"Operativa",  horas_total:18420, horas_mes:312, componentes:["Motor centrif.","Horno resistencias","Cadena transporte","Bomba baño"] },
  { id:"ACT-002", maq:"TWIN02",   nombre:"Twin 02 — Centrifugadora bicapa",  fab:"Baruffaldi",   serie:"BRF-T02-2021", inst:"2021-06-20", estado:"Operativa",  horas_total:11240, horas_mes:290, componentes:["Motor centrif.","Horno resistencias","Cadena transporte","Bomba baño"] },
  { id:"ACT-003", maq:"MN-01",    nombre:"Máq. Neumática 01",                fab:"Tecnowey",     serie:"TW-MN1-2018",  inst:"2018-11-10", estado:"Operativa",  horas_total:21880, horas_mes:320, componentes:["Motor neumático","Bomba baño","Sellos","Filtros"] },
  { id:"ACT-004", maq:"GR-01",    nombre:"Granallado 01",                    fab:"Wheelabrator", serie:"WB-GR1-2017",  inst:"2017-05-08", estado:"Operativa",  horas_total:26100, horas_mes:310, componentes:["Turbina principal","Válvula dosificación","Motor elevador","Criba separación"] },
  { id:"ACT-005", maq:"GR-02",    nombre:"Granallado 02",                    fab:"Wheelabrator", serie:"WB-GR2-2020",  inst:"2020-09-14", estado:"Operativa",  horas_total:14600, horas_mes:295, componentes:["Turbina principal","Válvula dosificación","Motor elevador","Criba separación"] },
  { id:"ACT-006", maq:"PRE-01",   nombre:"Pregrease 01",                     fab:"Inoxtork",     serie:"IT-PRE1-2018", inst:"2018-03-22", estado:"Operativa",  horas_total:20340, horas_mes:308, componentes:["Bomba calefacción","Resistencias","Válvulas","Agitador"] },
  { id:"ACT-007", maq:"PRE-02",   nombre:"Pregrease 02",                     fab:"Inoxtork",     serie:"IT-PRE2-2022", inst:"2022-01-10", estado:"Operativa",  horas_total:8450,  horas_mes:305, componentes:["Bomba calefacción","Resistencias","Válvulas","Agitador"] },
  { id:"ACT-008", maq:"DC02",     nombre:"Desaceitadora 02",                  fab:"Deltam",       serie:"DT-DC2-2020",  inst:"2020-04-30", estado:"Operativa",  horas_total:12800, horas_mes:280, componentes:["Motor centrifugado","Bomba aceite","Filtros","Sellos"] },
  { id:"ACT-009", maq:"DE02",     nombre:"Desengrasadora Estática 02",        fab:"Inoxtork",     serie:"IT-DE2-2019",  inst:"2019-08-15", estado:"Operativa",  horas_total:15600, horas_mes:260, componentes:["Resistencias calef.","Bomba recirculación","Filtros","Nivel"] },
  { id:"ACT-010", maq:"GR-BAST",  nombre:"Granallado Bastidor",               fab:"Wheelabrator", serie:"WB-GRB-2018",  inst:"2018-06-01", estado:"Operativa",  horas_total:22400, horas_mes:255, componentes:["Turbina","Motor rotación","Cadena bastidor","Criba"] },
  { id:"ACT-011", maq:"RO-5",     nombre:"Rotary 5",                          fab:"Tecnowey",     serie:"TW-RO5-2016",  inst:"2016-09-12", estado:"Inhabilitada",horas_total:31200, horas_mes:0,   componentes:["Motor","Bomba","Sellos","Rodamientos"] },
  { id:"ACT-012", maq:"RO-6",     nombre:"Rotary 6",                          fab:"Tecnowey",     serie:"TW-RO6-2016",  inst:"2016-09-12", estado:"Inhabilitada",horas_total:31180, horas_mes:0,   componentes:["Motor","Bomba","Sellos","Rodamientos"] },
];

// Mantenimiento preventivo
const PREVENTIVO = [
  { id:"MP-001", maq:"MN-01",   tarea:"Revisión sellos bomba principal",       freq:"Mensual",   prox:"2026-03-19", ult:"2026-02-19", est:"Vence hoy",   resp:"P. Ruiz",   tiempo_h:1.5, tipo:"Mecánico" },
  { id:"MP-002", maq:"GR-01",   tarea:"Revisión medios abrasivos — turbina",   freq:"Semanal",   prox:"2026-03-19", ult:"2026-03-12", est:"Vence hoy",   resp:"B. Mora",   tiempo_h:2.0, tipo:"Mecánico" },
  { id:"MP-003", maq:"GR-02",   tarea:"Limpieza criba separadora",             freq:"Semanal",   prox:"2026-03-19", ult:"2026-03-12", est:"Vence hoy",   resp:"B. Mora",   tiempo_h:1.0, tipo:"Mecánico" },
  { id:"MP-004", maq:"DC02",    tarea:"Limpieza filtros desaceite",             freq:"Quincenal", prox:"2026-03-21", ult:"2026-03-07", est:"Próximo",     resp:"T. Lara",   tiempo_h:0.5, tipo:"Proceso"  },
  { id:"MP-005", maq:"TWIN44",  tarea:"Revisión resistencias horno",           freq:"Mensual",   prox:"2026-04-01", ult:"2026-03-01", est:"Pendiente",   resp:"P. Ruiz",   tiempo_h:2.5, tipo:"Eléctrico"},
  { id:"MP-006", maq:"TWIN02",  tarea:"Revisión resistencias horno",           freq:"Mensual",   prox:"2026-04-01", ult:"2026-03-01", est:"Pendiente",   resp:"P. Ruiz",   tiempo_h:2.5, tipo:"Eléctrico"},
  { id:"MP-007", maq:"PRE-01",  tarea:"Cambio filtros calefacción",            freq:"Quincenal", prox:"2026-03-25", ult:"2026-03-11", est:"Pendiente",   resp:"T. Lara",   tiempo_h:0.5, tipo:"Proceso"  },
  { id:"MP-008", maq:"GR-BAST", tarea:"Engrase cadena de bastidor",            freq:"Semanal",   prox:"2026-03-22", ult:"2026-03-15", est:"Pendiente",   resp:"B. Mora",   tiempo_h:0.5, tipo:"Mecánico" },
  { id:"MP-009", maq:"PRE-02",  tarea:"Comprobación nivel y pH baño",          freq:"Diario",    prox:"2026-03-20", ult:"2026-03-19", est:"Pendiente",   resp:"Lab.",       tiempo_h:0.2, tipo:"Proceso"  },
  { id:"MP-010", maq:"MN-01",   tarea:"Calibración sonda temperatura",         freq:"Trimestral",prox:"2026-06-01", ult:"2026-03-01", est:"Pendiente",   resp:"Ext.",       tiempo_h:3.0, tipo:"Eléctrico"},
];

// Órdenes de trabajo correctivo
const CORRECTIVO = [
  { id:"OT-001", maq:"RO-6",   desc:"Ruido en rodamiento de canasta — vibración anormal",         prio:"Alta",  resp:"P. Ruiz",  est:"En Curso",   fecha:"2026-03-17", min_parada:180, causa:"Desgaste rodamiento 6205-2RS", accion:"Sustitución rodamiento", material:"Rod. 6205-2RS x2" },
  { id:"OT-002", maq:"DC02",   desc:"Pérdida de caudal en bomba de aceite MKR",                   prio:"Media", resp:"T. Lara",  est:"Pendiente",  fecha:"2026-03-18", min_parada:45,  causa:"", accion:"", material:"Sello mecánico 32mm" },
  { id:"OT-003", maq:"PRE-02", desc:"Válvula de presión con pérdida de estanqueidad",              prio:"Baja",  resp:"P. Ruiz",  est:"Pendiente",  fecha:"2026-03-19", min_parada:30,  causa:"", accion:"", material:"" },
  { id:"OT-004", maq:"TWIN44", desc:"Sensor temperatura horno — lectura inestable (desviación 8°C)",prio:"Alta", resp:"Ext.",     est:"Cerrada",    fecha:"2026-03-15", min_parada:120, causa:"Conector sensor oxidado", accion:"Sustitución sensor K-type", material:"Sensor termopar K" },
  { id:"OT-005", maq:"GR-01",  desc:"Criba separadora bloqueada — granalla fina acumulada",       prio:"Media", resp:"B. Mora",  est:"Cerrada",    fecha:"2026-03-14", min_parada:90,  causa:"Mantenimiento preventivo atrasado", accion:"Limpieza completa y ajuste", material:"" },
];

// Recambios
const RECAMBIOS = [
  { id:"REC-001", nombre:"Rodamiento 6205-2RS",      maquinas:["RO-5","RO-6"],           stock:4,  min:2,  precio:24.50,  prov:"Rodamientos Industrial",  plazo:3  },
  { id:"REC-002", nombre:"Sello mecánico 32mm",      maquinas:["MN-01","DC02"],          stock:1,  min:2,  precio:85.00,  prov:"Sealtek S.L.",            plazo:5  },
  { id:"REC-003", nombre:"Paleta abrasiva S330",     maquinas:["GR-01","GR-02"],         stock:0,  min:5,  precio:12.80,  prov:"Granalla Metálica S.A.",  plazo:2  },
  { id:"REC-004", nombre:"Filtro desaceite F-200",   maquinas:["DC02"],                  stock:2,  min:1,  precio:38.00,  prov:"Filtros Industriales",    plazo:7  },
  { id:"REC-005", nombre:"Sensor termopar K-type",   maquinas:["TWIN44","TWIN02"],       stock:3,  min:2,  precio:42.00,  prov:"RS Components",           plazo:2  },
  { id:"REC-006", nombre:"Correa transmisión B-52",  maquinas:["GR-BAST","GR-01"],      stock:5,  min:3,  precio:18.50,  prov:"Transmisiones Beltrán",   plazo:4  },
  { id:"REC-007", nombre:"Resistencia horno 2kW",    maquinas:["TWIN44","TWIN02"],       stock:0,  min:4,  precio:65.00,  prov:"Elco Resistencias",       plazo:10 },
  { id:"REC-008", nombre:"Válvula solenoide 1/2\"",  maquinas:["PRE-01","PRE-02"],      stock:6,  min:2,  precio:55.00,  prov:"Pneumax Ibérica",         plazo:3  },
];

// Datos históricos de averías por máquina (para MTBF/MTTR)
const HISTORICO_AVERIAS = [
  { maq:"TWIN44",  averias:3,  min_total:270, horas_op:720, disponib:93.8 },
  { maq:"TWIN02",  averias:5,  min_total:420, horas_op:700, disponib:89.0 },
  { maq:"MN-01",   averias:2,  min_total:180, horas_op:740, disponib:95.9 },
  { maq:"GR-01",   averias:4,  min_total:330, horas_op:720, disponib:92.4 },
  { maq:"GR-02",   averias:3,  min_total:210, horas_op:710, disponib:95.1 },
  { maq:"PRE-01",  averias:1,  min_total:60,  horas_op:750, disponib:98.7 },
  { maq:"PRE-02",  averias:2,  min_total:150, horas_op:740, disponib:96.6 },
  { maq:"DC02",    averias:4,  min_total:285, horas_op:680, disponib:93.0 },
  { maq:"GR-BAST", averias:2,  min_total:180, horas_op:600, disponib:94.8 },
  { maq:"DE02",    averias:1,  min_total:90,  horas_op:620, disponib:97.6 },
];

// Señales predictivas (PLC)
const SENALES_PLC = [
  { maq:"TWIN44",  param:"Corriente motor centrif.", valor:4.2, nominal:4.0, desv:5.0,  alerta:false, tendencia:"estable" },
  { maq:"TWIN02",  param:"Temperatura motor",        valor:78,  nominal:65,  desv:20.0, alerta:true,  tendencia:"↑ subiendo" },
  { maq:"GR-01",   param:"Vibración turbina",        valor:2.8, nominal:2.0, desv:40.0, alerta:true,  tendencia:"↑ subiendo" },
  { maq:"GR-02",   param:"Vibración turbina",        valor:1.9, nominal:2.0, desv:-5.0, alerta:false, tendencia:"estable" },
  { maq:"MN-01",   param:"Presión bomba",            valor:3.1, nominal:3.0, desv:3.3,  alerta:false, tendencia:"estable" },
  { maq:"DC02",    param:"Corriente bomba aceite",   valor:2.1, nominal:1.8, desv:16.7, alerta:true,  tendencia:"↑ subiendo" },
  { maq:"PRE-01",  param:"Temperatura baño",         valor:55,  nominal:55,  desv:0,    alerta:false, tendencia:"estable" },
  { maq:"PRE-02",  param:"Temperatura baño",         valor:56,  nominal:55,  desv:1.8,  alerta:false, tendencia:"estable" },
];

// ─── HELPERS ─────────────────────────────────────────────────────

function BdgPrio({ p }) {
  const cfg = { "Alta":{ k:"danger" }, "Media":{ k:"warning" }, "Baja":{ k:"secondary" } }[p] || { k:"secondary" };
  return <span style={{ ...ck(cfg.k), display:"inline-flex", padding:"2px 6px", borderRadius:4, fontSize:10, fontWeight:600, whiteSpace:"nowrap" }}>{p}</span>;
}

function BdgEst({ est }) {
  const l = (est||"").toLowerCase();
  let k = "secondary";
  if (/cerrada|completada|ok/.test(l))    k = "success";
  else if (/vence hoy|alta|urgente/.test(l)) k = "danger";
  else if (/próximo|en curso|media/.test(l)) k = "warning";
  else if (/pendiente/.test(l))           k = "info";
  return <span style={{ ...ck(k), display:"inline-flex", padding:"2px 6px", borderRadius:4, fontSize:10, fontWeight:600, whiteSpace:"nowrap" }}>{est}</span>;
}

// ─── TAB: DASHBOARD / KPIs ───────────────────────────────────────
function TabKPIs({ mVhoy }) {
  const avgMTBF = HISTORICO_AVERIAS.reduce((s,h) => s + (h.horas_op / (h.averias||1)), 0) / HISTORICO_AVERIAS.length;
  const avgMTTR = HISTORICO_AVERIAS.reduce((s,h) => s + (h.min_total / (h.averias||1)), 0) / HISTORICO_AVERIAS.length;
  const avgDisp = HISTORICO_AVERIAS.reduce((s,h) => s+h.disponib, 0) / HISTORICO_AVERIAS.length;
  const alertasPLC = SENALES_PLC.filter(s => s.alerta).length;
  const sinStock   = RECAMBIOS.filter(r => r.stock === 0).length;
  const otAbiertas = CORRECTIVO.filter(o => o.est !== "Cerrada").length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {mVhoy > 0 && <Al type="r">⚠ {mVhoy} tarea{mVhoy>1?"s":""} de mantenimiento preventivo vence{mVhoy>1?"n":""} hoy</Al>}
      {alertasPLC > 0 && <Al type="w">⚠ {alertasPLC} señal{alertasPLC>1?"es":""} predictiva{alertasPLC>1?"s":""} fuera de rango — revisar máquinas</Al>}
      {sinStock > 0 && <Al type="r">✕ {sinStock} recambio{sinStock>1?"s":""} sin stock — riesgo de parada no planificada</Al>}

      <KRow items={[
        { l:"MTBF medio (h)",     v:`${avgMTBF.toFixed(0)}h`,   c:"var(--color-text-success)" },
        { l:"MTTR medio (min)",   v:`${avgMTTR.toFixed(0)} min`, c:avgMTTR>60?"var(--color-text-danger)":"var(--color-text-warning)" },
        { l:"Disponibilidad",     v:`${avgDisp.toFixed(1)}%`,    c:avgDisp>=95?"var(--color-text-success)":"var(--color-text-warning)" },
        { l:"OTs abiertas",       v:otAbiertas,                  c:otAbiertas>0?"var(--color-text-warning)":undefined },
        { l:"Alertas PLC",        v:alertasPLC,                  c:alertasPLC>0?"var(--color-text-danger)":undefined },
        { l:"Recambios sin stock",v:sinStock,                    c:sinStock>0?"var(--color-text-danger)":undefined },
      ]}/>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {/* MTBF por máquina */}
        <Card title="MTBF por máquina (horas entre fallos)">
          <div style={{ padding:"10px 16px", display:"flex", flexDirection:"column", gap:6 }}>
            {[...HISTORICO_AVERIAS].sort((a,b) => (b.horas_op/b.averias) - (a.horas_op/a.averias)).map(h => {
              const mtbf = Math.round(h.horas_op / (h.averias||1));
              const pct  = Math.min((mtbf / 400) * 100, 100);
              return (
                <div key={h.maq} style={{ display:"grid", gridTemplateColumns:"65px 1fr 50px", gap:6, alignItems:"center" }}>
                  <span style={mo}>{h.maq}</span>
                  <div style={{ height:8, background:"var(--color-background-secondary)", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background: mtbf>=300?"#22c55e":mtbf>=150?"#f59e0b":"#ef4444", borderRadius:3 }}/>
                  </div>
                  <span style={{ ...mo, fontWeight:700, textAlign:"right", color:mtbf>=300?"var(--color-text-success)":mtbf>=150?"var(--color-text-warning)":"var(--color-text-danger)" }}>
                    {mtbf}h
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Disponibilidad por máquina */}
        <Card title="Disponibilidad por máquina (%)">
          <div style={{ padding:"10px 16px", display:"flex", flexDirection:"column", gap:6 }}>
            {[...HISTORICO_AVERIAS].sort((a,b) => b.disponib - a.disponib).map(h => (
              <div key={h.maq} style={{ display:"grid", gridTemplateColumns:"65px 1fr 52px", gap:6, alignItems:"center" }}>
                <span style={mo}>{h.maq}</span>
                <div style={{ height:8, background:"var(--color-background-secondary)", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${h.disponib}%`, background: h.disponib>=95?"#22c55e":h.disponib>=90?"#f59e0b":"#ef4444", borderRadius:3 }}/>
                </div>
                <span style={{ ...mo, fontWeight:700, textAlign:"right", color:h.disponib>=95?"var(--color-text-success)":h.disponib>=90?"var(--color-text-warning)":"var(--color-text-danger)" }}>
                  {h.disponib}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Señales predictivas */}
      <Card title="Señales predictivas — PLC en tiempo real">
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11.5 }}>
            <thead><tr>{["Máquina","Parámetro","Valor actual","Nominal","Desviación","Tendencia","Estado"].map((c,i)=>(
              <th key={i} style={{ textAlign:"left", padding:"6px 10px", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".04em", color:"var(--color-text-secondary)", borderBottom:"0.5px solid var(--color-border-tertiary)", background:"var(--color-background-secondary)", whiteSpace:"nowrap" }}>{c}</th>
            ))}</tr></thead>
            <tbody>
              {SENALES_PLC.map((s, i) => (
                <tr key={i} style={{ background: s.alerta ? "#fffbeb" : "" }}>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace", fontWeight:700 }}>{s.maq}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)" }}>{s.param}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace", fontWeight:700, color:s.alerta?"var(--color-text-danger)":"var(--color-text-success)" }}>{s.valor}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{s.nominal}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace", color:Math.abs(s.desv)>10?"var(--color-text-danger)":undefined, fontWeight:Math.abs(s.desv)>10?700:400 }}>
                    {s.desv > 0 ? "+" : ""}{s.desv.toFixed(1)}%
                  </td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontSize:11 }}>{s.tendencia}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
                    {s.alerta
                      ? <span style={{ fontSize:10, fontWeight:700, background:"#fffbeb", color:"#92400e", border:"0.5px solid #fde68a", padding:"2px 6px", borderRadius:4 }}>⚠ Alerta</span>
                      : <span style={{ fontSize:10, fontWeight:700, background:"#f0fdf4", color:"#166534", border:"0.5px solid #86efac", padding:"2px 6px", borderRadius:4 }}>✓ Normal</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── TAB: ACTIVOS ─────────────────────────────────────────────────
function TabActivos() {
  const [sel, setSel] = useState(null);
  const activo = ACTIVOS.find(a => a.id === sel);

  return (
    <div style={{ display:"flex", gap:12 }}>
      {/* Lista */}
      <div style={{ width:280, flexShrink:0, display:"flex", flexDirection:"column", gap:6 }}>
        {["Operativa","Inhabilitada"].map(grupo => (
          <div key={grupo}>
            <div style={{ fontSize:10, fontWeight:600, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:5, marginTop:grupo==="Inhabilitada"?10:0 }}>{grupo}</div>
            {ACTIVOS.filter(a => a.estado === grupo).map(a => {
              const activo2 = sel === a.id;
              const hist    = HISTORICO_AVERIAS.find(h => h.maq === a.maq);
              return (
                <div key={a.id} onClick={() => setSel(a.id)} style={{ padding:"9px 12px", borderRadius:8, cursor:"pointer", marginBottom:5,
                  border:`0.5px solid ${activo2?"var(--color-border-info)":"var(--color-border-tertiary)"}`,
                  background: activo2?"var(--color-background-info)":"var(--color-background-primary)",
                  opacity: grupo==="Inhabilitada" ? .6 : 1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2 }}>
                    <span style={{ fontFamily:"monospace", fontSize:11, fontWeight:700, color:activo2?"var(--color-text-info)":"var(--color-text-secondary)" }}>{a.maq}</span>
                    <span style={{ fontSize:10, padding:"1px 5px", borderRadius:3, fontWeight:600,
                      background:grupo==="Operativa"?"#f0fdf4":"#f3f4f6",
                      color:grupo==="Operativa"?"#166534":"#6b7280",
                      border:`0.5px solid ${grupo==="Operativa"?"#86efac":"#d1d5db"}` }}>
                      {grupo==="Operativa"?"✓ Activo":"⊘ Inhab."}
                    </span>
                  </div>
                  <div style={{ fontSize:11.5, fontWeight:500, marginBottom:2 }}>{a.fab} · {a.serie}</div>
                  <div style={{ fontSize:10.5, color:"var(--color-text-secondary)" }}>
                    {a.horas_total.toLocaleString()}h totales · {a.horas_mes}h/mes
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Detalle activo */}
      {activo ? (
        <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:10, padding:"14px 18px" }}>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:6 }}>{activo.nombre}</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:8, marginBottom:10 }}>
              {[
                ["Fabricante",     activo.fab],
                ["Nº serie",       activo.serie],
                ["F. instalación", activo.inst.split("-").reverse().join("/")],
                ["Horas totales",  `${activo.horas_total.toLocaleString()}h`],
                ["Horas este mes", `${activo.horas_mes}h`],
                ["Estado",         activo.estado],
              ].map(([k,v]) => (
                <div key={k} style={{ background:"var(--color-background-secondary)", borderRadius:7, padding:"7px 10px" }}>
                  <div style={{ fontSize:9.5, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".05em", marginBottom:2 }}>{k}</div>
                  <div style={{ fontSize:11.5, fontWeight:500 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Componentes principales */}
            <div style={{ fontSize:10.5, fontWeight:600, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".05em", marginBottom:6 }}>Componentes principales</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {activo.componentes.map(c => (
                <span key={c} style={{ fontSize:11, padding:"4px 10px", borderRadius:6, background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)" }}>{c}</span>
              ))}
            </div>
          </div>

          {/* Historial averías */}
          {(() => {
            const h = HISTORICO_AVERIAS.find(x => x.maq === activo.maq);
            if (!h) return null;
            const mtbf = Math.round(h.horas_op / (h.averias||1));
            const mttr = Math.round(h.min_total / (h.averias||1));
            return (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                {[
                  ["Averías (mes)", h.averias, h.averias>3?"var(--color-text-danger)":"var(--color-text-warning)"],
                  ["MTBF", `${mtbf}h`, mtbf>=300?"var(--color-text-success)":"var(--color-text-warning)"],
                  ["MTTR", `${mttr} min`, mttr>60?"var(--color-text-danger)":"var(--color-text-success)"],
                  ["Disponib.", `${h.disponib}%`, h.disponib>=95?"var(--color-text-success)":"var(--color-text-warning)"],
                ].map(([l,v,c]) => (
                  <div key={l} style={{ background:"var(--color-background-secondary)", borderRadius:8, padding:"10px 14px" }}>
                    <div style={{ fontSize:10, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".05em", marginBottom:3 }}>{l}</div>
                    <div style={{ fontSize:20, fontWeight:700, color:c }}>{v}</div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* OTs relacionadas */}
          <Card title="Historial de intervenciones">
            {CORRECTIVO.filter(o => o.maq === activo.maq).length > 0 ? (
              <Tbl cols={["OT","Descripción","Fecha","Duración","Estado"]}
                rows={CORRECTIVO.filter(o => o.maq === activo.maq).map(o => [
                  <span style={mo}>{o.id}</span>,
                  <span style={{ fontSize:11.5, display:"block", maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.desc}</span>,
                  <span style={{ fontSize:11 }}>{o.fecha.slice(8)}/{o.fecha.slice(5,7)}</span>,
                  <span style={{ ...mo, color:o.min_parada>120?"var(--color-text-danger)":undefined }}>{o.min_parada} min</span>,
                  <BdgEst est={o.est}/>,
                ])}
              />
            ) : (
              <div style={{ padding:20, textAlign:"center", fontSize:12, color:"var(--color-text-secondary)" }}>Sin intervenciones registradas este mes</div>
            )}
          </Card>
        </div>
      ) : (
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"var(--color-text-secondary)", fontSize:13 }}>
          ← Selecciona un activo
        </div>
      )}
    </div>
  );
}

// ─── TAB: PREVENTIVO ─────────────────────────────────────────────
function TabPreventivo({ mant, mVhoy }) {
  const [filtro, setFiltro] = useState("Todas");
  const TIPOS = ["Todas","Mecánico","Eléctrico","Proceso"];

  const vis = filtro === "Todas" ? PREVENTIVO : PREVENTIVO.filter(t => t.tipo === filtro);
  const venceHoy = PREVENTIVO.filter(t => t.est === "Vence hoy");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {mVhoy > 0 && <Al type="r">⚠ {mVhoy} tarea{mVhoy>1?"s":""} vence{mVhoy>1?"n":""} hoy — ejecutar antes del fin del turno</Al>}

      <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {TIPOS.map(t => (
            <button key={t} onClick={() => setFiltro(t)} style={{ padding:"3px 10px", borderRadius:5, cursor:"pointer", fontSize:11,
              border:`0.5px solid ${filtro===t?"var(--color-border-info)":"var(--color-border-tertiary)"}`,
              background:filtro===t?"var(--color-background-info)":"transparent",
              color:filtro===t?"var(--color-text-info)":"var(--color-text-secondary)",
              fontWeight:filtro===t?600:400 }}>
              {t}
            </button>
          ))}
        </div>
        <button style={{ ...ck("info"), padding:"5px 13px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:500 }}>
          + Nueva tarea
        </button>
      </div>

      <Card>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11.5 }}>
            <thead><tr>{["ID","Máquina","Tarea","Tipo","Freq.","Próxima","Ult. ejec.","Tiempo","Resp.","Estado"].map((c,i)=>(
              <th key={i} style={{ textAlign:"left", padding:"6px 10px", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".04em", color:"var(--color-text-secondary)", borderBottom:"0.5px solid var(--color-border-tertiary)", background:"var(--color-background-secondary)", whiteSpace:"nowrap" }}>{c}</th>
            ))}</tr></thead>
            <tbody>
              {vis.map((t, i) => (
                <tr key={i} style={{ background: t.est==="Vence hoy"?"#fef2f2":"" }}>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{t.id}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace", fontWeight:700 }}>{t.maq}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.tarea}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontSize:11, color:"var(--color-text-secondary)" }}>{t.tipo}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontSize:11 }}>{t.freq}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace", fontWeight:t.est==="Vence hoy"?700:400, color:t.est==="Vence hoy"?"var(--color-text-danger)":undefined }}>
                    {t.prox.slice(8)}/{t.prox.slice(5,7)}
                  </td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>
                    {t.ult.slice(8)}/{t.ult.slice(5,7)}
                  </td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{t.tiempo_h}h</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontSize:11 }}>{t.resp}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
                    <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                      <BdgEst est={t.est}/>
                      {t.est === "Vence hoy" && (
                        <button style={{ ...ck("success"), padding:"2px 8px", borderRadius:4, cursor:"pointer", fontSize:10, fontWeight:600 }}>
                          ✓ Ejecutar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── TAB: CORRECTIVO ─────────────────────────────────────────────
function TabCorrectivo() {
  const [sel, setSel]   = useState(null);
  const [modal, setModal] = useState(false);
  const [ots, setOts]   = useState(CORRECTIVO);

  const otSel   = ots.find(o => o.id === sel);
  const abiertas= ots.filter(o => o.est !== "Cerrada").length;

  return (
    <div style={{ display:"flex", gap:12 }}>
      {/* Lista */}
      <div style={{ width:280, flexShrink:0, display:"flex", flexDirection:"column", gap:6 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:11.5, fontWeight:600 }}>{abiertas} OT{abiertas!==1?"s":""} abiertas</span>
          <button onClick={() => setModal(true)} style={{ ...ck("danger"), padding:"4px 10px", borderRadius:5, cursor:"pointer", fontSize:11, fontWeight:600 }}>
            + Nueva OT
          </button>
        </div>

        {ots.map(o => {
          const activo2 = sel === o.id;
          const colPrio = { Alta:"#ef4444", Media:"#f59e0b", Baja:"#94a3b8" }[o.prio] || "#94a3b8";
          return (
            <div key={o.id} onClick={() => setSel(o.id)} style={{ padding:"10px 13px", borderRadius:9, cursor:"pointer",
              border:`0.5px solid ${activo2?"var(--color-border-info)":"var(--color-border-tertiary)"}`,
              borderLeft:`3px solid ${o.est==="Cerrada"?"#22c55e":colPrio}`,
              background: activo2?"var(--color-background-info)":"var(--color-background-primary)",
              opacity: o.est==="Cerrada"?.75:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                <span style={{ fontFamily:"monospace", fontSize:11, fontWeight:700, color:activo2?"var(--color-text-info)":"var(--color-text-secondary)" }}>{o.id}</span>
                <BdgEst est={o.est}/>
              </div>
              <div style={{ fontSize:11, fontWeight:500, marginBottom:2 }}>{o.maq}</div>
              <div style={{ fontSize:11.5, color:"var(--color-text-primary)", marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.desc}</div>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <BdgPrio p={o.prio}/>
                <span style={{ fontSize:10.5, color:"var(--color-text-secondary)" }}>{o.fecha.slice(8)}/{o.fecha.slice(5,7)} · {o.min_parada} min</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detalle OT */}
      {otSel ? (
        <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:10, padding:"14px 18px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:700, fontFamily:"monospace" }}>{otSel.id}</div>
                <div style={{ fontSize:11, color:"var(--color-text-secondary)", marginTop:2 }}>{otSel.maq} · {otSel.fecha.slice(8)}/{otSel.fecha.slice(5,7)}/{otSel.fecha.slice(0,4)}</div>
              </div>
              <div style={{ display:"flex", gap:6 }}><BdgPrio p={otSel.prio}/><BdgEst est={otSel.est}/></div>
            </div>
            <div style={{ fontSize:13, fontWeight:500, padding:"9px 12px", background:"var(--color-background-secondary)", borderRadius:7, marginBottom:10 }}>
              {otSel.desc}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:8 }}>
              {[
                ["Tiempo parada",  `${otSel.min_parada} min`],
                ["Responsable",    otSel.resp],
                ["Causa raíz",     otSel.causa||"Por determinar"],
                ["Acción tomada",  otSel.accion||"Pendiente"],
                ["Material usado", otSel.material||"—"],
              ].map(([k,v]) => (
                <div key={k} style={{ background:"var(--color-background-secondary)", borderRadius:7, padding:"7px 10px" }}>
                  <div style={{ fontSize:9.5, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".05em", marginBottom:2 }}>{k}</div>
                  <div style={{ fontSize:11.5, fontWeight:500 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {otSel.est !== "Cerrada" && (
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ ...ck("success"), flex:1, padding:"8px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600 }}>
                ✓ Cerrar OT — avería resuelta
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"var(--color-text-secondary)", fontSize:13 }}>
          ← Selecciona una orden de trabajo
        </div>
      )}

      {/* Modal nueva OT */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.3)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500 }}
          onClick={e => { if (e.target===e.currentTarget) setModal(false); }}>
          <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-secondary)", borderRadius:12, width:440, maxWidth:"96%", overflow:"hidden" }}>
            <div style={{ padding:"13px 18px", borderBottom:"0.5px solid var(--color-border-tertiary)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontWeight:600, fontSize:14 }}>Nueva orden de trabajo</span>
              <button onClick={() => setModal(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"var(--color-text-secondary)" }}>✕</button>
            </div>
            <div style={{ padding:18, display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <label style={{ fontSize:10.5, fontWeight:600, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".04em" }}>Máquina</label>
                  <select style={inp}>{MAQUINAS.filter(m=>m.est!=="Inhabilitada").map(m=><option key={m.id} value={m.id}>{m.id}</option>)}</select>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <label style={{ fontSize:10.5, fontWeight:600, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".04em" }}>Prioridad</label>
                  <select style={inp}><option>Alta</option><option>Media</option><option>Baja</option></select>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:10.5, fontWeight:600, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".04em" }}>Descripción de la avería *</label>
                <textarea rows={3} placeholder="Describe el problema observado…" style={{ ...inp, resize:"vertical", fontFamily:"inherit" }}/>
              </div>
            </div>
            <div style={{ padding:"12px 18px", borderTop:"0.5px solid var(--color-border-tertiary)", display:"flex", justifyContent:"flex-end", gap:8 }}>
              <button onClick={() => setModal(false)} style={{ border:"0.5px solid var(--color-border-secondary)", background:"transparent", color:"var(--color-text-primary)", padding:"5px 12px", borderRadius:6, cursor:"pointer", fontSize:12 }}>Cancelar</button>
              <button style={{ ...ck("danger"), padding:"5px 13px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600 }}>Crear OT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TAB: RECAMBIOS ───────────────────────────────────────────────
function TabRecambios() {
  const sinStock    = RECAMBIOS.filter(r => r.stock === 0);
  const stockBajo   = RECAMBIOS.filter(r => r.stock > 0 && r.stock < r.min);
  const costoTotal  = RECAMBIOS.reduce((s,r) => s + r.stock * r.precio, 0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {sinStock.length > 0 && <Al type="r">✕ Sin stock: {sinStock.map(r=>r.nombre).join(", ")} — pedido urgente</Al>}
      {stockBajo.length > 0 && <Al type="w">⚠ Stock bajo: {stockBajo.map(r=>r.nombre).join(", ")}</Al>}

      <KRow items={[
        { l:"Total referencias", v:RECAMBIOS.length },
        { l:"Sin stock",         v:sinStock.length,  c:sinStock.length>0?"var(--color-text-danger)":undefined },
        { l:"Stock bajo",        v:stockBajo.length, c:stockBajo.length>0?"var(--color-text-warning)":undefined },
        { l:"Valor inventario",  v:`${costoTotal.toFixed(0)} €` },
      ]}/>

      <Card>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11.5 }}>
            <thead><tr>{["ID","Artículo","Máquinas","Stock","Mínimo","Precio","Proveedor","Plazo (días)","Estado"].map((c,i)=>(
              <th key={i} style={{ textAlign:"left", padding:"6px 10px", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".04em", color:"var(--color-text-secondary)", borderBottom:"0.5px solid var(--color-border-tertiary)", background:"var(--color-background-secondary)", whiteSpace:"nowrap" }}>{c}</th>
            ))}</tr></thead>
            <tbody>
              {RECAMBIOS.map((r, i) => {
                const estadoStock = r.stock === 0 ? "Sin stock" : r.stock < r.min ? "Stock bajo" : "OK";
                return (
                  <tr key={i} style={{ background: r.stock === 0 ? "#fef2f2" : r.stock < r.min ? "#fffbeb" : "" }}>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{r.id}</td>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontWeight:500 }}>{r.nombre}</td>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontSize:11, color:"var(--color-text-secondary)" }}>{r.maquinas.join(", ")}</td>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace", fontWeight:700,
                      color: r.stock === 0 ? "var(--color-text-danger)" : r.stock < r.min ? "var(--color-text-warning)" : "var(--color-text-success)" }}>
                      {r.stock}
                    </td>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{r.min}</td>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{r.precio.toFixed(2)} €</td>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontSize:11 }}>{r.prov}</td>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{r.plazo}d</td>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
                      <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                        <span style={{ fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:4,
                          background: estadoStock==="OK"?"#f0fdf4":estadoStock==="Stock bajo"?"#fffbeb":"#fef2f2",
                          color:      estadoStock==="OK"?"#166534":estadoStock==="Stock bajo"?"#92400e":"#b91c1c",
                          border:     `0.5px solid ${estadoStock==="OK"?"#86efac":estadoStock==="Stock bajo"?"#fde68a":"#fca5a5"}` }}>
                          {estadoStock}
                        </span>
                        {r.stock < r.min && (
                          <button style={{ ...ck("info"), padding:"2px 8px", borderRadius:4, cursor:"pointer", fontSize:10, fontWeight:600 }}>Pedir</button>
                        )}
                      </div>
                    </td>
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

// ─── MÓDULO PRINCIPAL ─────────────────────────────────────────────
export default function Mantenimiento() {
  const { mant, mVhoy } = useContext(ERPContext);
  const [tab, setTab]   = useState("kpis");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Tabs
        items={[
          ["kpis",   "Dashboard"],
          ["activos","Activos"],
          ["prev",   "Preventivo"],
          ["corr",   "Correctivo"],
          ["rec",    "Recambios"],
        ]}
        cur={tab} onChange={setTab}
      />

      {tab==="kpis"   && <TabKPIs    mVhoy={mVhoy}/>}
      {tab==="activos"&& <TabActivos/>}
      {tab==="prev"   && <TabPreventivo mant={mant} mVhoy={mVhoy}/>}
      {tab==="corr"   && <TabCorrectivo/>}
      {tab==="rec"    && <TabRecambios/>}
    </div>
  );
}
