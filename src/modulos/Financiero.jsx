// src/modulos/Financiero.jsx
// Control Presupuestario 2025 — Torres Gumà S.L.
// Datos extraídos de CP2025_Torres_Guma.xlsx
import { useState } from "react";
import { FINANCIERO } from "../financiero_data";
import { Card, Tabs, KRow, Al, ck } from "../ui";

// ─── CONSTANTES ───────────────────────────────────────────────────

const MESES = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
const mo = { fontFamily:"monospace", fontSize:11 };

const fmt = (n) => {
  if (n === null || n === undefined) return "—";
  const abs = Math.abs(n);
  const s   = abs >= 1000
    ? abs.toLocaleString("es-ES", { minimumFractionDigits:0, maximumFractionDigits:0 })
    : abs.toLocaleString("es-ES", { minimumFractionDigits:2, maximumFractionDigits:2 });
  return n < 0 ? `(${s})` : s;
};

const fmtPct = (p) => {
  if (p === null || p === undefined) return "—";
  const sign = p > 0 ? "+" : "";
  return `${sign}${p.toFixed(1)}%`;
};

const colorPct = (p, invertir=false) => {
  if (p === null) return "var(--color-text-secondary)";
  const bueno = invertir ? p < 0 : p > 0;
  return bueno ? "var(--color-text-success)" : "var(--color-text-danger)";
};

// Filas a mostrar como separador visual (negrita + fondo)
const ES_RESULTADO = (cod, den) =>
  ["RESULTADO","CASH-FLOW","INGRESOS - GASTOS"].some(k => den.includes(k));

// ─── TABLA CONTROL PRESUPUESTARIO ────────────────────────────────

function TablaCuenta({ filas, vista }) {
  const [expand, setExpand] = useState({});
  const [mesActivo, setMesActivo] = useState(null);

  // Grupos colapsables: detectar filas hijas
  const grupos = {};
  let grpActual = null;
  filas.forEach(f => {
    if (f.tipo === "subtotal") { grpActual = f.cod; grupos[f.cod] = []; }
    else if (grpActual && f.tipo === "normal" && f.cod !== "") grupos[grpActual]?.push(f.cod);
    else if (f.tipo === "total" || f.tipo === "subtotal") grpActual = null;
  });

  // Qué padre tiene esta fila
  const padre = {};
  Object.entries(grupos).forEach(([p, hijos]) => hijos.forEach(h => padre[h] = p));

  return (
    <div>
      {/* Selector de mes */}
      <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:10 }}>
        <button onClick={() => setMesActivo(null)} style={{
          padding:"3px 9px", borderRadius:4, cursor:"pointer", fontSize:10.5,
          border:`0.5px solid ${mesActivo===null?"var(--color-border-info)":"var(--color-border-tertiary)"}`,
          background:mesActivo===null?"var(--color-background-info)":"transparent",
          color:mesActivo===null?"var(--color-text-info)":"var(--color-text-secondary)",
          fontWeight:mesActivo===null?600:400,
        }}>Resumen anual</button>
        {MESES.map(m => (
          <button key={m} onClick={() => setMesActivo(mesActivo===m?null:m)} style={{
            padding:"3px 9px", borderRadius:4, cursor:"pointer", fontSize:10.5,
            border:`0.5px solid ${mesActivo===m?"var(--color-border-info)":"var(--color-border-tertiary)"}`,
            background:mesActivo===m?"var(--color-background-info)":"transparent",
            color:mesActivo===m?"var(--color-text-info)":"var(--color-text-secondary)",
            fontWeight:mesActivo===m?600:400,
          }}>{m}</button>
        ))}
      </div>

      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11.5 }}>
          <thead>
            <tr style={{ background:"var(--color-background-secondary)" }}>
              <th style={{ padding:"7px 10px", textAlign:"left", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".04em", color:"var(--color-text-secondary)", borderBottom:"1px solid var(--color-border-tertiary)", minWidth:260, position:"sticky", left:0, background:"var(--color-background-secondary)", zIndex:2 }}>
                Denominación
              </th>
              {mesActivo === null ? (
                <>
                  <th style={{ ...thS, textAlign:"right" }}>PSP 2025</th>
                  <th style={{ ...thS, textAlign:"right" }}>Real 2025</th>
                  <th style={{ ...thS, textAlign:"right" }}>Dif. PSP</th>
                  <th style={{ ...thS, textAlign:"right" }}>% PSP</th>
                  <th style={{ ...thS, textAlign:"right", color:"var(--color-text-secondary)" }}>Acum. 2024</th>
                  <th style={{ ...thS, textAlign:"right" }}>Dif. 2024</th>
                </>
              ) : (
                <>
                  <th style={{ ...thS, textAlign:"right" }}>PSP mes</th>
                  <th style={{ ...thS, textAlign:"right" }}>{mesActivo}/R</th>
                  <th style={{ ...thS, textAlign:"right" }}>Dif.</th>
                  <th style={{ ...thS, textAlign:"right" }}>%</th>
                  <th style={{ ...thS, textAlign:"right", color:"var(--color-text-secondary)" }}>Acum. 2025</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => {
              const esRes     = ES_RESULTADO(f.cod, f.den);
              const esTotal   = f.tipo === "total" || esRes;
              const esSub     = f.tipo === "subtotal";
              const tieneHijos= grupos[f.cod]?.length > 0;
              const estaOculta= padre[f.cod] && !expand[padre[f.cod]];

              if (estaOculta) return null;

              // Calcular valores del mes si aplica
              const vMes    = mesActivo ? f.m[mesActivo] || 0 : null;
              const pspMes  = mesActivo
                ? (f.psp / 12)  // aproximación; en el Excel real vendría de P2025
                : null;
              const acum2025 = Object.values(f.m).reduce((s,v)=>s+v,0);

              // Costes: invertir color (menor = mejor)
              const esCosto = ["A","B","C","D","E","H","I","J"].includes(f.cod) ||
                              ["A","B","C","D","E","F","G","H","I","J"].some(p => padre[f.cod]===p);

              const bgRow = esRes
                ? "var(--color-background-secondary)"
                : esTotal
                ? "#f8fafc"
                : esSub
                ? "rgba(0,0,0,.015)"
                : "transparent";

              return (
                <tr key={i} style={{ background:bgRow, borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
                  {/* Denominación con expand */}
                  <td style={{ padding:"6px 10px", position:"sticky", left:0, background:bgRow, zIndex:1,
                    fontWeight: esRes?"800":esTotal?"700":esSub?"600":"400",
                    fontSize: esRes?12.5:esTotal?12:esSub?12:11.5,
                    borderLeft: esRes?"3px solid var(--color-border-info)":esSub?"3px solid var(--color-border-tertiary)":"3px solid transparent",
                    color: esRes?"var(--color-text-info)":"var(--color-text-primary)",
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, paddingLeft: padre[f.cod] ? 16 : 0 }}>
                      {tieneHijos && (
                        <span onClick={() => setExpand(p=>({...p,[f.cod]:!p[f.cod]}))}
                          style={{ cursor:"pointer", fontSize:11, color:"var(--color-text-secondary)",
                            display:"inline-block", transform:expand[f.cod]?"rotate(90deg)":"none", transition:"transform .15s" }}>
                          ›
                        </span>
                      )}
                      {f.cod && f.cod !== "**" && f.cod !== "*" && (
                        <span style={{ fontSize:10, fontFamily:"monospace", color:"var(--color-text-secondary)",
                          minWidth:20, flexShrink:0 }}>{f.cod}</span>
                      )}
                      <span>{f.den}</span>
                    </div>
                  </td>

                  {mesActivo === null ? (
                    <>
                      <td style={tdNum(esTotal,esRes)}>{fmt(f.psp)}</td>
                      <td style={tdNum(esTotal,esRes)}>{fmt(f.suma)}</td>
                      <td style={{ ...tdNum(esTotal,esRes), color:f.dif!==null?(esCosto?colorPct(-f.dif/1):colorPct(f.dif/1)):undefined }}>
                        {fmt(f.dif)}
                      </td>
                      <td style={{ ...tdNum(esTotal,esRes), color:f.pct!==null?colorPct(f.pct, esCosto):undefined }}>
                        {fmtPct(f.pct)}
                      </td>
                      <td style={{ ...tdNum(esTotal,esRes), color:"var(--color-text-secondary)" }}>
                        {fmt(f.a2024)}
                      </td>
                      <td style={tdNum(esTotal,esRes)}>
                        {fmt(f.suma - f.a2024)}
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={tdNum(esTotal,esRes)}>{fmt(pspMes)}</td>
                      <td style={tdNum(esTotal,esRes)}>{fmt(vMes)}</td>
                      <td style={{ ...tdNum(esTotal,esRes), color:vMes!==null?colorPct(vMes-pspMes,esCosto):undefined }}>
                        {fmt(vMes - pspMes)}
                      </td>
                      <td style={{ ...tdNum(esTotal,esRes), color:pspMes?(colorPct((vMes-pspMes)/pspMes*100,esCosto)):undefined }}>
                        {pspMes ? fmtPct((vMes-pspMes)/pspMes*100) : "—"}
                      </td>
                      <td style={{ ...tdNum(esTotal,esRes), color:"var(--color-text-secondary)" }}>
                        {fmt(acum2025)}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Estilos tabla
const thS = {
  padding:"7px 10px", fontSize:10, fontWeight:600, textTransform:"uppercase",
  letterSpacing:".04em", color:"var(--color-text-secondary)",
  borderBottom:"1px solid var(--color-border-tertiary)", whiteSpace:"nowrap",
};
const tdNum = (esTotal, esRes) => ({
  padding:"6px 10px", textAlign:"right", fontFamily:"monospace",
  fontWeight: esRes?"700":esTotal?"600":"400",
  fontSize: esRes?12:esTotal?11.5:11,
  whiteSpace:"nowrap",
});

// ─── TAB: EVOLUCIÓN MENSUAL ───────────────────────────────────────

function TabEvolucion({ planta }) {
  const filas = FINANCIERO[planta];

  // Extraer filas clave para gráficos
  const getRow = (den) => filas.find(f => f.den.includes(den));
  const ingresos  = getRow("TOTAL INGRESOS");
  const gastos    = getRow("TOTAL GASTOS");
  const resultado = getRow("RESULTADO");
  const ventas    = getRow("TOTAL VENTAS");

  const maxV = ingresos
    ? Math.max(...MESES.map(m => Math.abs(ingresos.m[m]||0)), 1)
    : 1;

  const NOMBRE = { T:"Consolidado", E:"Esparreguera", V:"Vitoria" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {/* KPIs clave */}
      {ingresos && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:10 }}>
          {[
            { l:"Total ingresos",   v:ingresos.suma,          psp:ingresos.psp,  inv:false },
            { l:"Total gastos",     v:gastos?.suma,            psp:gastos?.psp,   inv:true  },
            { l:"Resultado",        v:resultado?.suma,         psp:resultado?.psp,inv:false },
            { l:"Cash-Flow",        v:getRow("CASH-FLOW")?.suma,psp:getRow("CASH-FLOW")?.psp,inv:false },
          ].map(({ l, v, psp, inv }) => {
            const dif = v != null && psp != null ? v - psp : null;
            const pct = psp && psp !== 0 ? dif/psp*100 : null;
            return (
              <div key={l} style={{ background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:10, padding:"11px 14px" }}>
                <div style={{ fontSize:10, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".05em", fontWeight:500, marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:20, fontWeight:600, fontFamily:"monospace",
                  color: v != null && v < 0 ? "var(--color-text-danger)" : "var(--color-text-primary)" }}>
                  {v != null ? fmt(v) : "—"}
                </div>
                {pct != null && (
                  <div style={{ fontSize:10, marginTop:4, color:colorPct(pct, inv) }}>
                    {fmtPct(pct)} vs PSP
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Gráfico mensual ingresos vs gastos */}
      {ingresos && gastos && (
        <Card title={`Evolución mensual — ${NOMBRE[planta]}`}>
          <div style={{ padding:"12px 16px" }}>
            <div style={{ display:"flex", gap:8, marginBottom:8 }}>
              {[["#378ADD","Ingresos"],["#ef4444","Gastos"],["#22c55e","Resultado"]].map(([c,l])=>(
                <span key={l} style={{ fontSize:10.5, display:"flex", alignItems:"center", gap:4, color:"var(--color-text-secondary)" }}>
                  <span style={{ width:12, height:12, background:c, borderRadius:2, display:"inline-block" }}/>
                  {l}
                </span>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:120 }}>
              {MESES.map(m => {
                const ing = ingresos.m[m] || 0;
                const gas = gastos.m[m]   || 0;
                const res = ing - gas;
                const hi  = Math.round((ing/maxV)*100);
                const hg  = Math.round((gas/maxV)*100);
                const hr  = Math.round((Math.abs(res)/maxV)*50);
                return (
                  <div key={m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                    <div style={{ width:"100%", display:"flex", gap:1, alignItems:"flex-end", height:100 }}>
                      <div title={`Ingresos ${m}: ${fmt(ing)}`}
                        style={{ flex:1, height:`${hi}px`, background:"#378ADD", borderRadius:"2px 2px 0 0", opacity:.8, minHeight:1 }}/>
                      <div title={`Gastos ${m}: ${fmt(gas)}`}
                        style={{ flex:1, height:`${hg}px`, background:"#ef4444", borderRadius:"2px 2px 0 0", opacity:.8, minHeight:1 }}/>
                      <div title={`Resultado ${m}: ${fmt(res)}`}
                        style={{ flex:1, height:`${hr}px`, background:res>=0?"#22c55e":"#f59e0b", borderRadius:"2px 2px 0 0", opacity:.9, minHeight:1 }}/>
                    </div>
                    <span style={{ fontSize:8.5, color:"var(--color-text-secondary)" }}>{m}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Ventas mensuales vs presupuesto */}
      {ventas && (
        <Card title="Ventas reales vs presupuesto mensual">
          <div style={{ padding:"10px 16px" }}>
            <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:80 }}>
              {MESES.map(m => {
                const real = ventas.m[m] || 0;
                const pspM = ventas.psp / 12;
                const pct  = pspM > 0 ? real/pspM : 0;
                const h    = Math.round(Math.min(pct, 1.5) * 60);
                const ok   = real >= pspM;
                return (
                  <div key={m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                    <span style={{ fontSize:8, fontFamily:"monospace", color:ok?"var(--color-text-success)":"var(--color-text-danger)" }}>
                      {Math.round(pct*100)}%
                    </span>
                    <div style={{ width:"80%", height:`${h}px`, background:ok?"#22c55e":"#ef4444",
                      borderRadius:"2px 2px 0 0", opacity:.85, minHeight:2 }}/>
                    {/* Línea objetivo */}
                    <div style={{ width:"100%", height:1, background:"#94a3b8", marginTop:-1 }}/>
                    <span style={{ fontSize:8.5, color:"var(--color-text-secondary)" }}>{m}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize:10, color:"var(--color-text-secondary)", marginTop:6, textAlign:"right" }}>
              PSP anual: {fmt(ventas.psp)} € · Real acum.: {fmt(ventas.suma)} €
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── TAB: COMPARATIVA PLANTAS ─────────────────────────────────────

function TabComparativa() {
  const conceptos = [
    { den:"TOTAL VENTAS",    inv:false },
    { den:"TOTAL INGRESOS",  inv:false },
    { den:"TOTAL COMPRAS",   inv:true  },
    { den:"TOT. G.PERSONAL", inv:true  },
    { den:"TOT. GTS.EXTERNOS",inv:true },
    { den:"TOTAL GASTOS",    inv:true  },
    { den:"INGRESOS - GASTOS",inv:false},
    { den:"RESULTADO",       inv:false },
    { den:"CASH-FLOW",       inv:false },
  ];

  const getRow = (planta, den) => FINANCIERO[planta].find(f => f.den.includes(den));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Al type="b">Comparativa entre plantas Esparreguera y Vitoria — datos acumulados 2025</Al>

      <Card title="Cuenta de explotación — Esparreguera vs Vitoria">
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11.5 }}>
            <thead>
              <tr style={{ background:"var(--color-background-secondary)" }}>
                <th style={{ ...thS, textAlign:"left", position:"sticky", left:0, background:"var(--color-background-secondary)", minWidth:200 }}>Concepto</th>
                <th style={{ ...thS, textAlign:"right" }}>PSP Esp.</th>
                <th style={{ ...thS, textAlign:"right" }}>Real Esp.</th>
                <th style={{ ...thS, textAlign:"right" }}>% PSP</th>
                <th style={{ ...thS, textAlign:"right", borderLeft:"2px solid var(--color-border-tertiary)" }}>PSP Vit.</th>
                <th style={{ ...thS, textAlign:"right" }}>Real Vit.</th>
                <th style={{ ...thS, textAlign:"right" }}>% PSP</th>
                <th style={{ ...thS, textAlign:"right", borderLeft:"2px solid var(--color-border-tertiary)" }}>PSP Total</th>
                <th style={{ ...thS, textAlign:"right" }}>Real Total</th>
                <th style={{ ...thS, textAlign:"right" }}>% PSP</th>
              </tr>
            </thead>
            <tbody>
              {conceptos.map(({ den, inv }) => {
                const E = getRow("E", den);
                const V = getRow("V", den);
                const T = getRow("T", den);
                if (!E && !V && !T) return null;

                const pctE = E?.pct;
                const pctV = V?.pct;
                const pctT = T?.pct;
                const esRes = den.includes("RESULTADO") || den.includes("CASH") || den.includes("INGRESOS - G");

                return (
                  <tr key={den} style={{
                    background: esRes ? "var(--color-background-secondary)" : "transparent",
                    borderBottom:"0.5px solid var(--color-border-tertiary)",
                    fontWeight: esRes ? 700 : 400,
                  }}>
                    <td style={{ padding:"6px 10px", position:"sticky", left:0, background:esRes?"var(--color-background-secondary)":"var(--color-background-primary)", fontSize:11.5 }}>
                      {den.replace("TOT. ","").replace("  **","")}
                    </td>
                    <td style={{ padding:"6px 10px", textAlign:"right", fontFamily:"monospace", fontSize:11 }}>{fmt(E?.psp)}</td>
                    <td style={{ padding:"6px 10px", textAlign:"right", fontFamily:"monospace", fontWeight:600 }}>{fmt(E?.suma)}</td>
                    <td style={{ padding:"6px 10px", textAlign:"right", fontFamily:"monospace", color:pctE!=null?colorPct(pctE,inv):undefined }}>{fmtPct(pctE)}</td>
                    <td style={{ padding:"6px 10px", textAlign:"right", fontFamily:"monospace", fontSize:11, borderLeft:"2px solid var(--color-border-tertiary)" }}>{fmt(V?.psp)}</td>
                    <td style={{ padding:"6px 10px", textAlign:"right", fontFamily:"monospace", fontWeight:600 }}>{fmt(V?.suma)}</td>
                    <td style={{ padding:"6px 10px", textAlign:"right", fontFamily:"monospace", color:pctV!=null?colorPct(pctV,inv):undefined }}>{fmtPct(pctV)}</td>
                    <td style={{ padding:"6px 10px", textAlign:"right", fontFamily:"monospace", fontSize:11, borderLeft:"2px solid var(--color-border-tertiary)" }}>{fmt(T?.psp)}</td>
                    <td style={{ padding:"6px 10px", textAlign:"right", fontFamily:"monospace", fontWeight:700 }}>{fmt(T?.suma)}</td>
                    <td style={{ padding:"6px 10px", textAlign:"right", fontFamily:"monospace", color:pctT!=null?colorPct(pctT,inv):undefined }}>{fmtPct(pctT)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Peso de cada planta */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {["TOTAL VENTAS","TOTAL GASTOS"].map(den => {
          const E = getRow("E",den);
          const V = getRow("V",den);
          const total = (E?.suma||0) + (V?.suma||0);
          const pE = total > 0 ? (E?.suma||0)/total*100 : 0;
          const pV = 100 - pE;
          return (
            <Card key={den} title={`${den.replace("  **","")} — peso por planta`}>
              <div style={{ padding:"12px 16px" }}>
                <div style={{ height:16, borderRadius:8, overflow:"hidden", display:"flex", marginBottom:8 }}>
                  <div style={{ width:`${pE}%`, background:"#378ADD", transition:"width .4s" }}/>
                  <div style={{ flex:1, background:"#22c55e" }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
                  <span style={{ color:"#378ADD" }}>
                    <b>Esparreguera</b> {pE.toFixed(1)}% · {fmt(E?.suma)}
                  </span>
                  <span style={{ color:"#22c55e" }}>
                    <b>Vitoria</b> {pV.toFixed(1)}% · {fmt(V?.suma)}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── MÓDULO PRINCIPAL ─────────────────────────────────────────────

export default function Financiero() {
  const [tab, setTab] = useState("consolidado");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:700 }}>Control Presupuestario 2025</div>
          <div style={{ fontSize:11, color:"var(--color-text-secondary)", marginTop:2 }}>Torres Gumà S.L. · Datos a diciembre 2025</div>
        </div>
        <span style={{ fontSize:10, padding:"3px 10px", borderRadius:5,
          background:"var(--color-background-success)", color:"var(--color-text-success)",
          border:"0.5px solid var(--color-border-success)", fontWeight:600 }}>
          📊 CP2025_Torres_Guma.xlsx
        </span>
      </div>

      <Tabs
        items={[
          ["consolidado", "Consolidado"],
          ["esparreguera","Esparreguera"],
          ["vitoria",     "Vitoria"],
          ["evol_e",      "Evolución Esp."],
          ["evol_v",      "Evolución Vit."],
          ["comparativa", "Comparativa"],
        ]}
        cur={tab} onChange={setTab}
      />

      {tab==="consolidado"  && <TablaCuenta filas={FINANCIERO["T"]} vista="T"/>}
      {tab==="esparreguera" && <TablaCuenta filas={FINANCIERO["E"]} vista="E"/>}
      {tab==="vitoria"      && <TablaCuenta filas={FINANCIERO["V"]} vista="V"/>}
      {tab==="evol_e"       && <TabEvolucion planta="E"/>}
      {tab==="evol_v"       && <TabEvolucion planta="V"/>}
      {tab==="comparativa"  && <TabComparativa/>}
    </div>
  );
}
