// src/modulos/Gerencia.jsx
import { useContext, useState } from "react";
import { PanelMejoras, MisMejoras } from "../ERP";
import { ERPContext } from "../ERP";
import { CLIENTES, HOMS, MAQUINAS, oc, cn } from "../datos";
import { Bdg, Card, KRow, Tbl, Tabs, Al, ck } from "../ui";
import Financiero from "./Financiero";

// ─── DATOS FINANCIEROS Y OPERATIVOS ──────────────────────────────

const mo = { fontFamily:"monospace", fontSize:11 };
const fmt = (n) => n >= 1000
  ? (n/1000).toFixed(0) + "k€"
  : n.toLocaleString("es-ES", { minimumFractionDigits:0 }) + " €";
const fmtFull = (n) => n.toLocaleString("es-ES", { minimumFractionDigits:2 }) + " €";

const FACTURACION_MENSUAL = [
  { m:"Abr'25", v:138400, obj:145000 },
  { m:"May'25", v:152800, obj:145000 },
  { m:"Jun'25", v:144200, obj:145000 },
  { m:"Jul'25", v:128600, obj:145000 },
  { m:"Ago'25", v:118900, obj:145000 },
  { m:"Sep'25", v:148700, obj:155000 },
  { m:"Oct'25", v:142300, obj:155000 },
  { m:"Nov'25", v:168400, obj:155000 },
  { m:"Dic'25", v:134200, obj:155000 },
  { m:"Ene'26", v:157300, obj:165000 },
  { m:"Feb'26", v:189600, obj:165000 },
  { m:"Mar'26", v:203100, obj:180000 },
];

const KG_MENSUAL = [
  { m:"Oct'25", v:82400  }, { m:"Nov'25", v:91200  }, { m:"Dic'25", v:74800  },
  { m:"Ene'26", v:85600  }, { m:"Feb'26", v:98400  }, { m:"Mar'26", v:61200  },
];

const OEE_HIST = [
  { m:"Oct'25", v:76.2 }, { m:"Nov'25", v:78.4 }, { m:"Dic'25", v:72.1 },
  { m:"Ene'26", v:79.3 }, { m:"Feb'26", v:81.2 }, { m:"Mar'26", v:79.8 },
];

const NC_HIST = [
  { m:"Oct'25", v:8  }, { m:"Nov'25", v:6  }, { m:"Dic'25", v:11 },
  { m:"Ene'26", v:7  }, { m:"Feb'26", v:5  }, { m:"Mar'26", v:4  },
];

const CLIENTES_TOP = [
  { cli:58,  fac_mes:38420, fac_año:312400, kg_mes:7840,  homs:4, pend:12450.80, margen_pct:30.3, tend:"↑" },
  { cli:458, fac_mes:31840, fac_año:267800, kg_mes:6420,  homs:2, pend:21340.00, margen_pct:39.4, tend:"→" },
  { cli:87,  fac_mes:24680, fac_año:276500, kg_mes:4980,  homs:1, pend:8920.40,  margen_pct:24.4, tend:"↑" },
  { cli:9,   fac_mes:22140, fac_año:184200, kg_mes:3780,  homs:3, pend:15680.20, margen_pct:24.5, tend:"↓" },
  { cli:125, fac_mes:18640, fac_año:203100, kg_mes:2840,  homs:2, pend:9340.50,  margen_pct:30.3, tend:"↑" },
  { cli:102, fac_mes:14280, fac_año:156300, kg_mes:2480,  homs:2, pend:12450.80, margen_pct:23.2, tend:"→" },
];

// ─── MINI GRÁFICO SVG ─────────────────────────────────────────────

function LineChart({ datos, h=70, colorLine="#378ADD", colorArea=null, showObj=false, objColor="#94a3b8" }) {
  const vals = datos.map(d => d.v);
  const objs = datos.map(d => d.obj || 0);
  const maxV = Math.max(...vals, ...objs, 1);
  const W = 300, H = h;
  const px = (i) => 20 + i * ((W-40) / (datos.length-1));
  const py = (v) => H - 10 - (v / maxV) * (H - 20);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:H }}>
      {/* Objetivo */}
      {showObj && datos.map((d,i) => i > 0 && (
        <line key={i} x1={px(i-1)} y1={py(objs[i-1])} x2={px(i)} y2={py(objs[i])}
          stroke={objColor} strokeWidth="1" strokeDasharray="4 2" opacity=".6"/>
      ))}
      {/* Área */}
      {colorArea && (
        <path d={`M${px(0)},${py(vals[0])} ${vals.map((v,i)=>`L${px(i)},${py(v)}`).join(" ")} L${px(vals.length-1)},${H} L${px(0)},${H} Z`}
          fill={colorArea} opacity=".15"/>
      )}
      {/* Línea */}
      {vals.map((v,i) => i > 0 && (
        <line key={i} x1={px(i-1)} y1={py(vals[i-1])} x2={px(i)} y2={py(v)}
          stroke={colorLine} strokeWidth="2"/>
      ))}
      {/* Puntos */}
      {vals.map((v,i) => (
        <circle key={i} cx={px(i)} cy={py(v)} r={i===vals.length-1?4:2.5}
          fill={i===vals.length-1?colorLine:"white"} stroke={colorLine} strokeWidth="1.5"/>
      ))}
      {/* Etiquetas eje X */}
      {datos.map((d,i) => (i===0||i===datos.length-1||i===Math.floor(datos.length/2)) && (
        <text key={i} x={px(i)} y={H-1} textAnchor="middle" fontSize="7.5" fill="var(--color-text-secondary)">{d.m}</text>
      ))}
    </svg>
  );
}

function BarChart({ datos, h=60, color="#378ADD" }) {
  const maxV = Math.max(...datos.map(d=>d.v), 1);
  return (
    <svg viewBox={`0 0 300 ${h}`} style={{ width:"100%", height:h }}>
      {datos.map((d,i) => {
        const bh = Math.round((d.v/maxV)*(h-16));
        const x  = 10 + i*(280/datos.length);
        const w  = 280/datos.length - 4;
        const esUlt = i === datos.length-1;
        return (
          <g key={i}>
            <rect x={x} y={h-10-bh} width={w} height={bh} rx="2"
              fill={esUlt?"var(--color-background-info)":color}
              stroke={esUlt?"var(--color-border-info)":color}
              strokeWidth={esUlt?1.5:0} opacity={esUlt?1:.7}/>
            {esUlt && <text x={x+w/2} y={h-12-bh} textAnchor="middle" fontSize="7.5" fontWeight="600" fill="var(--color-text-info)">{Math.round(d.v/1000)}k</text>}
            <text x={x+w/2} y={h-1} textAnchor="middle" fontSize="7" fill="var(--color-text-secondary)">{d.m.slice(0,3)}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── TAB: RESUMEN EJECUTIVO ───────────────────────────────────────

function TabResumen({ ofs, ncs, mVhoy }) {
  const ncsAb   = ncs.filter(n => n.est !== "Cerrada").length;
  const oAc     = ofs.filter(o => ["En Curso","Control Final","Expedición"].includes(o.est)).length;
  const tKg     = MAQUINAS.filter(m=>m.est==="Operativa").reduce((s,m)=>s+m.kg,0);
  const avgOEE  = (MAQUINAS.filter(m=>m.oee>0).reduce((s,m)=>s+m.oee,0)/MAQUINAS.filter(m=>m.oee>0).length).toFixed(1);
  const facMes  = FACTURACION_MENSUAL[FACTURACION_MENSUAL.length-1].v;
  const facAnt  = FACTURACION_MENSUAL[FACTURACION_MENSUAL.length-2].v;
  const varFac  = ((facMes-facAnt)/facAnt*100).toFixed(1);
  const facAño  = FACTURACION_MENSUAL.slice(-12).reduce((s,d)=>s+d.v,0);
  const pendCob = 58311.60;
  const margenMedio = 28.7;

  // Alertas críticas para dirección
  const alertas = [];
  if (ncsAb > 2)  alertas.push({ tipo:"r", msg:`${ncsAb} NCs abiertas en calidad` });
  if (mVhoy > 0)  alertas.push({ tipo:"w", msg:`${mVhoy} tareas preventivo vencen hoy` });
  if (MAQUINAS.find(m=>m.est==="Inhabilitada")) alertas.push({ tipo:"w", msg:"RO-5 y RO-6 inhabilitadas" });
  if (pendCob > 50000) alertas.push({ tipo:"w", msg:`${fmtFull(pendCob)} pendiente de cobro` });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Alertas */}
      {alertas.map((a,i) => <Al key={i} type={a.tipo}>⚠ {a.msg}</Al>)}

      {/* KPIs principales */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10 }}>
        {[
          { l:"Facturación mar",   v:fmt(facMes),     s:`${varFac>0?"+":""}${varFac}% vs feb`,        c:varFac>0?"var(--color-text-success)":"var(--color-text-danger)" },
          { l:"Facturación año",   v:fmt(facAño),     s:"últ. 12 meses",                              c:"var(--color-text-success)" },
          { l:"Kg procesados",     v:tKg.toLocaleString(), s:"turno actual" },
          { l:"OEE planta",        v:`${avgOEE}%`,    s:avgOEE>=80?"↑ vs mes ant.":"↓ vs mes ant.",   c:avgOEE>=80?"var(--color-text-success)":"var(--color-text-warning)" },
          { l:"OFs activas",       v:oAc,             s:"en curso + CF" },
          { l:"Margen medio",      v:`${margenMedio}%`,s:"€/kg neto estimado",                        c:margenMedio>=25?"var(--color-text-success)":"var(--color-text-warning)" },
          { l:"NCs abiertas",      v:ncsAb,           s:"calidad",                                    c:ncsAb>2?"var(--color-text-danger)":undefined },
          { l:"Cobro pendiente",   v:fmt(pendCob),    s:"facturas emitidas",                          c:"var(--color-text-warning)" },
        ].map(({ l,v,s,c }) => (
          <div key={l} style={{ background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:10, padding:"11px 14px" }}>
            <div style={{ fontSize:10, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".05em", fontWeight:500, marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:22, fontWeight:600, color:c||"var(--color-text-primary)", lineHeight:1 }}>{v}</div>
            {s && <div style={{ fontSize:10, color:"var(--color-text-secondary)", marginTop:4 }}>{s}</div>}
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card title="Facturación mensual vs objetivo (k€)">
          <div style={{ padding:"10px 16px 6px" }}>
            <LineChart datos={FACTURACION_MENSUAL} h={80} colorLine="#378ADD" colorArea="#378ADD" showObj={true}/>
            <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:4 }}>
              <span style={{ fontSize:10, color:"var(--color-text-secondary)", display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ width:16, height:2, background:"#378ADD", display:"inline-block", borderRadius:1 }}/>Real
              </span>
              <span style={{ fontSize:10, color:"var(--color-text-secondary)", display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ width:16, height:2, background:"#94a3b8", display:"inline-block", borderRadius:1, borderTop:"1px dashed" }}/>Objetivo
              </span>
            </div>
          </div>
        </Card>

        <Card title="Kg procesados — últimos 6 meses">
          <div style={{ padding:"10px 16px 6px" }}>
            <BarChart datos={KG_MENSUAL} h={80} color="#60a5fa"/>
          </div>
        </Card>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card title="OEE planta — evolución">
          <div style={{ padding:"10px 16px 6px" }}>
            <LineChart datos={OEE_HIST} h={70} colorLine="#22c55e" colorArea="#22c55e"/>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10.5, marginTop:4, color:"var(--color-text-secondary)" }}>
              <span>Mín: {Math.min(...OEE_HIST.map(d=>d.v))}%</span>
              <span>Máx: {Math.max(...OEE_HIST.map(d=>d.v))}%</span>
              <span>Actual: <b style={{ color:"var(--color-text-success)" }}>{OEE_HIST[OEE_HIST.length-1].v}%</b></span>
            </div>
          </div>
        </Card>

        <Card title="NCs registradas — evolución">
          <div style={{ padding:"10px 16px 6px" }}>
            <LineChart datos={NC_HIST} h={70} colorLine="#ef4444" colorArea="#ef4444"/>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10.5, marginTop:4, color:"var(--color-text-secondary)" }}>
              <span>Mín: {Math.min(...NC_HIST.map(d=>d.v))}</span>
              <span>Máx: {Math.max(...NC_HIST.map(d=>d.v))}</span>
              <span>Actual: <b style={{ color:"var(--color-text-success)" }}>{NC_HIST[NC_HIST.length-1].v} ↓</b></span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── TAB: CLIENTES ────────────────────────────────────────────────

function TabClientes() {
  const maxFac = Math.max(...CLIENTES_TOP.map(c=>c.fac_mes));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <KRow items={[
        { l:"Clientes activos",  v:CLIENTES.filter(c=>c.ok).length },
        { l:"Facturación mes",   v:fmt(CLIENTES_TOP.reduce((s,c)=>s+c.fac_mes,0)), c:"var(--color-text-success)" },
        { l:"Pendiente cobro",   v:fmt(CLIENTES_TOP.reduce((s,c)=>s+c.pend,0)),    c:"var(--color-text-warning)" },
        { l:"Margen medio",      v:"28.7%",                                         c:"var(--color-text-success)" },
      ]}/>

      {/* Ranking visual */}
      <Card title="Ranking de clientes — facturación mensual">
        <div style={{ padding:"12px 18px", display:"flex", flexDirection:"column", gap:10 }}>
          {CLIENTES_TOP.map((c, i) => (
            <div key={c.cli} style={{ display:"grid", gridTemplateColumns:"24px 1fr auto", gap:10, alignItems:"center" }}>
              <div style={{ width:22, height:22, borderRadius:"50%",
                background: i===0?"#f59e0b":i===1?"#94a3b8":i===2?"#cd7c2f":"var(--color-background-secondary)",
                color: i<3?"white":"var(--color-text-secondary)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>
                {i+1}
              </div>
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                  <span style={{ fontSize:12, fontWeight:600 }}>{cn(c.cli)}</span>
                  <span style={{ fontSize:11, fontFamily:"monospace", fontWeight:700 }}>{fmt(c.fac_mes)}</span>
                </div>
                <div style={{ height:6, background:"var(--color-background-secondary)", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(c.fac_mes/maxFac)*100}%`,
                    background:i===0?"#f59e0b":i===1?"#94a3b8":i===2?"#cd7c2f":"#60a5fa",
                    borderRadius:3 }}/>
                </div>
                <div style={{ display:"flex", gap:10, marginTop:3, fontSize:10, color:"var(--color-text-secondary)" }}>
                  <span>{c.kg_mes.toLocaleString()} kg</span>
                  <span>·</span>
                  <span>Margen: <b style={{ color:c.margen_pct>=30?"var(--color-text-success)":"var(--color-text-warning)" }}>{c.margen_pct}%</b></span>
                  <span>·</span>
                  <span>Tend: <b style={{ color:c.tend==="↑"?"var(--color-text-success)":c.tend==="↓"?"var(--color-text-danger)":undefined }}>{c.tend}</b></span>
                </div>
              </div>
              <div style={{ textAlign:"right", fontSize:10.5, color:"var(--color-text-secondary)", flexShrink:0 }}>
                {c.pend > 0 && <div style={{ color:"var(--color-text-warning)", fontWeight:600 }}>Pend: {fmt(c.pend)}</div>}
                <div>{HOMS.filter(h=>h.cli===c.cli&&h.est==="Activa").length} hom.</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tabla completa */}
      <Card title="Detalle clientes">
        <Tbl cols={["Cliente","Sector","Fac. mes","Fac. año","Kg mes","Homs.","Pend. cobro","Margen","Tend."]}
          rows={CLIENTES_TOP.map(c => [
            <b style={{ fontSize:11.5 }}>{cn(c.cli).slice(0,20)}</b>,
            <span style={{ fontSize:11, color:"var(--color-text-secondary)" }}>{CLIENTES.find(x=>x.id===c.cli)?.s}</span>,
            <span style={mo}>{fmt(c.fac_mes)}</span>,
            <span style={mo}>{fmt(c.fac_año)}</span>,
            <span style={mo}>{c.kg_mes.toLocaleString()}</span>,
            <span style={mo}>{c.homs}</span>,
            <span style={{ ...mo, color:c.pend>15000?"var(--color-text-danger)":c.pend>8000?"var(--color-text-warning)":undefined, fontWeight:c.pend>10000?700:400 }}>{fmt(c.pend)}</span>,
            <span style={{ ...mo, color:c.margen_pct>=30?"var(--color-text-success)":"var(--color-text-warning)", fontWeight:600 }}>{c.margen_pct}%</span>,
            <span style={{ fontSize:14, color:c.tend==="↑"?"var(--color-text-success)":c.tend==="↓"?"var(--color-text-danger)":"var(--color-text-secondary)" }}>{c.tend}</span>,
          ])}
        />
      </Card>
    </div>
  );
}

// ─── TAB: PRODUCCIÓN EJECUTIVA ────────────────────────────────────

function TabProduccion({ ofs }) {
  const avgOEE  = (MAQUINAS.filter(m=>m.oee>0).reduce((s,m)=>s+m.oee,0)/MAQUINAS.filter(m=>m.oee>0).length).toFixed(1);
  const tKg     = MAQUINAS.filter(m=>m.est==="Operativa").reduce((s,m)=>s+m.kg,0);
  const oAc     = ofs.filter(o=>["En Curso","Control Final"].includes(o.est)).length;
  const inhab   = MAQUINAS.filter(m=>m.est==="Inhabilitada");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <KRow items={[
        { l:"OEE planta",       v:`${avgOEE}%`,           c:avgOEE>=80?"var(--color-text-success)":"var(--color-text-warning)" },
        { l:"Kg turno actual",  v:tKg.toLocaleString() },
        { l:"OFs activas",      v:oAc },
        { l:"Máquinas inhab.",  v:inhab.length,            c:inhab.length>0?"var(--color-text-danger)":undefined },
      ]}/>

      {inhab.length > 0 && (
        <Al type="w">⚠ {inhab.map(m=>m.id).join(", ")} inhabilitadas — capacidad productiva reducida</Al>
      )}

      {/* OEE por máquina con estado */}
      <Card title="Estado planta — OEE y disponibilidad">
        <div style={{ padding:"10px 16px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:8 }}>
            {MAQUINAS.filter(m=>m.est!=="Inhabilitada").map(m => (
              <div key={m.id} style={{ background:"var(--color-background-secondary)", borderRadius:8, padding:"10px 12px",
                border:`0.5px solid ${m.oee>=80?"var(--color-border-success)":m.oee>=65?"var(--color-border-warning)":"var(--color-border-danger)"}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                  <div>
                    <span style={{ fontFamily:"monospace", fontWeight:700, fontSize:12 }}>{m.id}</span>
                    <div style={{ fontSize:10, color:"var(--color-text-secondary)" }}>{m.tipo}</div>
                  </div>
                  <span style={{ fontSize:16, fontWeight:700, color:m.oee>=80?"var(--color-text-success)":m.oee>=65?"var(--color-text-warning)":"var(--color-text-danger)" }}>
                    {m.oee}%
                  </span>
                </div>
                <div style={{ height:5, background:"var(--color-background-primary)", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${m.oee}%`, background:m.oee>=80?"#22c55e":m.oee>=65?"#f59e0b":"#ef4444", borderRadius:3 }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:5, fontSize:10, color:"var(--color-text-secondary)" }}>
                  <span>{m.kg.toLocaleString()} kg</span>
                  <span>{m.op}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Kg por línea */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card title="Producción por línea (Kg turno)">
          <div style={{ padding:"10px 16px", display:"flex", flexDirection:"column", gap:8 }}>
            {[
              { linea:"TWIN",     maquinas:["TWIN44","TWIN02"] },
              { linea:"MN",       maquinas:["MN-01"] },
              { linea:"BASTIDOR", maquinas:["MN Bastid","GR-BAST"] },
              { linea:"DESENG.",  maquinas:["DE02","DB02","DC02"] },
            ].map(({ linea, maquinas }) => {
              const kg = MAQUINAS.filter(m=>maquinas.includes(m.id)).reduce((s,m)=>s+m.kg,0);
              const pct = Math.round((kg/tKg)*100) || 0;
              return (
                <div key={linea} style={{ display:"grid", gridTemplateColumns:"80px 1fr 60px", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:11, fontWeight:600 }}>{linea}</span>
                  <div style={{ height:8, background:"var(--color-background-secondary)", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:"#60a5fa", borderRadius:3 }}/>
                  </div>
                  <span style={{ fontFamily:"monospace", fontSize:11, textAlign:"right" }}>{kg.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Evolución OEE mensual">
          <div style={{ padding:"10px 16px 6px" }}>
            <LineChart datos={OEE_HIST} h={80} colorLine="#22c55e" colorArea="#22c55e"/>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── TAB: CALIDAD EJECUTIVA ───────────────────────────────────────

function TabCalidad({ ncs }) {
  const ncsAb    = ncs.filter(n => n.est !== "Cerrada").length;
  const externas = ncs.filter(n => n.est !== "Cerrada" && n.tipo === "Reclamación cliente").length;
  const tasa     = ncs.length > 0 ? Math.round(ncs.filter(n=>n.est==="Cerrada").length/ncs.length*100) : 100;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <KRow items={[
        { l:"NCs abiertas",      v:ncsAb,       c:ncsAb>2?"var(--color-text-danger)":"var(--color-text-warning)" },
        { l:"Externas (cliente)",v:externas,     c:externas>0?"var(--color-text-danger)":undefined },
        { l:"Tasa de cierre",    v:`${tasa}%`,   c:tasa>=80?"var(--color-text-success)":"var(--color-text-warning)" },
        { l:"NSS en curso",      v:2 },
      ]}/>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card title="Evolución NCs mensuales">
          <div style={{ padding:"10px 16px 6px" }}>
            <LineChart datos={NC_HIST} h={80} colorLine="#ef4444" colorArea="#ef4444"/>
          </div>
        </Card>

        <Card title="Distribución por gravedad">
          <div style={{ padding:"12px 16px", display:"flex", flexDirection:"column", gap:8 }}>
            {[
              { g:"Crítica", n:0,  color:"#7f1d1d" },
              { g:"Mayor",   n:ncs.filter(n=>n.grav==="Mayor").length,  color:"#ef4444" },
              { g:"Menor",   n:ncs.filter(n=>n.grav==="Menor").length,  color:"#f59e0b" },
            ].map(({ g, n, color }) => (
              <div key={g} style={{ display:"grid", gridTemplateColumns:"70px 1fr 30px", gap:8, alignItems:"center" }}>
                <span style={{ fontSize:11.5 }}>{g}</span>
                <div style={{ height:10, background:"var(--color-background-secondary)", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${n>0?(n/ncs.length)*100:0}%`, background:color, borderRadius:3 }}/>
                </div>
                <span style={{ fontFamily:"monospace", fontWeight:700, fontSize:13, color, textAlign:"right" }}>{n}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="NCs abiertas — resumen ejecutivo">
        <Tbl cols={["ID","Fecha","Cliente","Descripción","Gravedad","Responsable","Estado"]}
          rows={ncs.filter(n=>n.est!=="Cerrada").map(n=>[
            <span style={mo}>{n.id}</span>,
            <span style={{ fontSize:11 }}>{n.f}</span>,
            <span style={{ fontSize:11 }}>{cn(n.cli)}</span>,
            <span style={{ fontSize:11.5, display:"block", maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{n.desc}</span>,
            <span style={{ fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:4,
              background:n.grav==="Mayor"?"#fef2f2":"#fffbeb",
              color:n.grav==="Mayor"?"#b91c1c":"#92400e",
              border:`0.5px solid ${n.grav==="Mayor"?"#fca5a5":"#fde68a"}` }}>{n.grav}</span>,
            <span style={{ fontSize:11 }}>{n.resp}</span>,
            <Bdg t={n.est}/>,
          ])}
        />
      </Card>
    </div>
  );
}

// ─── TAB: FINANCIERO EJECUTIVO ────────────────────────────────────

function TabFinanciero() {
  const facAño   = FACTURACION_MENSUAL.slice(-12).reduce((s,d)=>s+d.v,0);
  const facAñoAnt= 1680000;
  const varAño   = ((facAño-facAñoAnt)/facAñoAnt*100).toFixed(1);
  const facMes   = FACTURACION_MENSUAL[FACTURACION_MENSUAL.length-1].v;
  const objMes   = FACTURACION_MENSUAL[FACTURACION_MENSUAL.length-1].obj;
  const cumplMes = Math.round(facMes/objMes*100);

  const RESUMEN_ANUAL = [
    { concepto:"Facturación bruta",    v:facAño,    tipo:"ingreso" },
    { concepto:"Coste materiales",     v:facAño*0.18, tipo:"coste" },
    { concepto:"Coste energía",        v:facAño*0.08, tipo:"coste" },
    { concepto:"Coste mano de obra",   v:facAño*0.24, tipo:"coste" },
    { concepto:"Gastos generales",     v:facAño*0.12, tipo:"coste" },
    { concepto:"EBITDA estimado",      v:facAño*0.38, tipo:"resultado" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <KRow items={[
        { l:"Facturación año",     v:fmt(facAño),     s:`${varAño>0?"+":""}${varAño}% vs año ant.`, c:"var(--color-text-success)" },
        { l:"Facturación mes",     v:fmt(facMes),     s:`obj: ${fmt(objMes)}` },
        { l:"Cumpl. objetivo mes", v:`${cumplMes}%`,  c:cumplMes>=100?"var(--color-text-success)":cumplMes>=85?"var(--color-text-warning)":"var(--color-text-danger)" },
        { l:"Margen EBITDA est.",  v:"38%",           c:"var(--color-text-success)" },
      ]}/>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card title="Facturación mensual — real vs objetivo">
          <div style={{ padding:"10px 16px 6px" }}>
            <LineChart datos={FACTURACION_MENSUAL.slice(-6)} h={90} colorLine="#378ADD" colorArea="#378ADD" showObj={true}/>
          </div>
        </Card>

        {/* Cuenta de resultados simplificada */}
        <Card title="Cuenta de resultados — estimado año">
          <div style={{ padding:"10px 16px", display:"flex", flexDirection:"column", gap:6 }}>
            {RESUMEN_ANUAL.map((r, i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"6px 0",
                borderBottom: i < RESUMEN_ANUAL.length-1 ? "0.5px solid var(--color-border-tertiary)" : "1.5px solid var(--color-border-secondary)",
                fontWeight: r.tipo==="resultado" ? 700 : 400,
                background: r.tipo==="resultado" ? "var(--color-background-secondary)" : "transparent",
                borderRadius: r.tipo==="resultado" ? 6 : 0,
                padding: r.tipo==="resultado" ? "8px 10px" : "6px 0",
                marginBottom: r.tipo==="resultado" ? -6 : 0,
              }}>
                <span style={{ fontSize:12, color:r.tipo==="coste"?"var(--color-text-secondary)":r.tipo==="resultado"?"var(--color-text-success)":undefined }}>
                  {r.tipo==="coste"?"— ":""}{r.concepto}
                </span>
                <span style={{ fontFamily:"monospace", fontSize:12,
                  color:r.tipo==="resultado"?"var(--color-text-success)":r.tipo==="coste"?"var(--color-text-danger)":undefined }}>
                  {r.tipo==="coste"?"-":""}{fmtFull(r.v)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Cumplimiento por mes */}
      <Card title="Cumplimiento objetivo mensual (%)">
        <div style={{ padding:"10px 16px" }}>
          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
            {FACTURACION_MENSUAL.map((d, i) => {
              const pct = Math.round(d.v/d.obj*100);
              return (
                <div key={i} style={{ flex:"1 0 60px", textAlign:"center" }}>
                  <div style={{ height:50, display:"flex", alignItems:"flex-end", justifyContent:"center", marginBottom:4 }}>
                    <div style={{ width:"60%", height:`${Math.min(pct,120)/120*50}px`,
                      background: pct>=100?"#22c55e":pct>=85?"#f59e0b":"#ef4444",
                      borderRadius:"3px 3px 0 0", minHeight:2 }}/>
                  </div>
                  <div style={{ fontSize:9, fontWeight:700,
                    color:pct>=100?"var(--color-text-success)":pct>=85?"var(--color-text-warning)":"var(--color-text-danger)" }}>
                    {pct}%
                  </div>
                  <div style={{ fontSize:8, color:"var(--color-text-secondary)" }}>{d.m.slice(0,3)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── MÓDULO PRINCIPAL ─────────────────────────────────────────────
export default function Gerencia() {
  const { ofs, ncs, mVhoy, mejoras, setMejoras } = useContext(ERPContext);
  const [tab, setTab] = useState("resumen");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Tabs
        items={[
          ["resumen",    "Resumen ejecutivo"],
          ["clientes",   "Clientes"],
          ["produccion", "Producción"],
          ["calidad",    "Calidad"],
          ["financiero", "Financiero"],
          ["cp2025",     "Control Presupuestario"],
          ["mejoras",    "💡 Mejoras"],
          ["mis_mejoras","Mis reportes"],
        ]}
        cur={tab} onChange={setTab}
      />

      {tab==="resumen"    && <TabResumen    ofs={ofs} ncs={ncs} mVhoy={mVhoy}/>}
      {tab==="clientes"   && <TabClientes/>}
      {tab==="produccion" && <TabProduccion ofs={ofs}/>}
      {tab==="calidad"    && <TabCalidad    ncs={ncs}/>}
      {tab==="financiero" && <TabFinanciero/>}
      {tab==="cp2025"     && <Financiero/>}
      {tab==="mejoras"    && <PanelMejoras mejoras={mejoras} setMejoras={setMejoras}/>}
      {tab==="mis_mejoras" && <MisMejoras mejoras={mejoras}/>}
    </div>
  );
}
