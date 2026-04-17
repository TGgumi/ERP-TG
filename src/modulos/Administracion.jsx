// src/modulos/Administracion.jsx
import { useState } from "react";
import { CLIENTES, cn } from "../datos";
import { Bdg, Card, Tbl, Tabs, Al, KRow, ck } from "../ui";

// ─── DATOS ───────────────────────────────────────────────────────

const mo  = { fontFamily:"monospace", fontSize:11 };
const inp = { border:"0.5px solid var(--color-border-tertiary)", background:"var(--color-background-secondary)", color:"var(--color-text-primary)", padding:"7px 10px", borderRadius:6, fontSize:12, outline:"none", width:"100%", boxSizing:"border-box" };

const fmt = (n) => n.toLocaleString("es-ES", { minimumFractionDigits:2, maximumFractionDigits:2 }) + " €";

const FACTURAS = [
  { id:"FAC-202603-004", cli:58,  importe:18420.60, base:15225.29, iva:3195.31, emision:"2026-03-15", vencim:"2026-04-15", estado:"Pendiente cobro", alb:"ALB-20260315-001", ofs:["OF-2580","OF-2581"], pagada:false },
  { id:"FAC-202603-003", cli:458, importe:21340.00, base:17636.36, iva:3703.64, emision:"2026-03-10", vencim:"2026-04-10", estado:"Pendiente cobro", alb:"ALB-20260310-003", ofs:["OF-2570","OF-2571","OF-2572"], pagada:false },
  { id:"FAC-202603-002", cli:87,  importe:8920.40,  base:7372.40,  iva:1548.00, emision:"2026-03-05", vencim:"2026-04-05", estado:"Cobrada",        alb:"ALB-20260305-002", ofs:["OF-2565"], pagada:true  },
  { id:"FAC-202603-001", cli:102, importe:12450.80, base:10289.92, iva:2160.88, emision:"2026-03-01", vencim:"2026-04-01", estado:"Pendiente cobro", alb:"ALB-20260301-001", ofs:["OF-2550","OF-2551"], pagada:false },
  { id:"FAC-202602-015", cli:9,   importe:15680.20, base:12958.84, iva:2721.36, emision:"2026-02-28", vencim:"2026-03-30", estado:"Vencida",         alb:"ALB-20260228-005", ofs:["OF-2540","OF-2541"], pagada:false },
  { id:"FAC-202602-014", cli:125, importe:9340.50,  base:7719.01,  iva:1621.49, emision:"2026-02-20", vencim:"2026-03-22", estado:"Cobrada",         alb:"ALB-20260220-004", ofs:["OF-2530"], pagada:true  },
  { id:"FAC-202602-013", cli:542, importe:4210.80,  base:3479.17,  iva:731.63,  emision:"2026-02-15", vencim:"2026-03-17", estado:"Cobrada",         alb:"ALB-20260215-003", ofs:["OF-2520"], pagada:true  },
  { id:"FAC-202601-008", cli:109, importe:3840.00,  base:3173.55,  iva:666.45,  emision:"2026-01-20", vencim:"2026-02-20", estado:"Cobrada",         alb:"ALB-20260120-002", ofs:["OF-2500"], pagada:true  },
];

const PEDIDOS_VENTA = [
  { id:"PED-2026-042", cli:58,  ref:"CLIP MANETA RO",        kg:2400, precio_kg:4.85, importe:11640.00, fecha:"2026-03-18", entrega:"2026-04-05", estado:"En producción", of:"OF-2601" },
  { id:"PED-2026-041", cli:102, ref:"306 CLIP D.T.",          kg:1800, precio_kg:3.92, importe:7056.00,  fecha:"2026-03-15", entrega:"2026-04-01", estado:"En producción", of:"OF-2602" },
  { id:"PED-2026-040", cli:9,   ref:"5x16",                   kg:3200, precio_kg:4.12, importe:13184.00, fecha:"2026-03-14", entrega:"2026-03-28", estado:"Pendiente",    of:null      },
  { id:"PED-2026-039", cli:458, ref:"CASQ. SOLD. Ø22",        kg:5600, precio_kg:3.81, importe:21336.00, fecha:"2026-03-12", entrega:"2026-03-26", estado:"Control final", of:"OF-2604" },
  { id:"PED-2026-038", cli:87,  ref:"GRAPA",                   kg:980,  precio_kg:5.20, importe:5096.00,  fecha:"2026-03-10", entrega:"2026-03-24", estado:"Completado",   of:"OF-2605" },
  { id:"PED-2026-037", cli:125, ref:"TENPLATU IRAOTU T44",     kg:1400, precio_kg:6.10, importe:8540.00,  fecha:"2026-03-08", entrega:"2026-03-22", estado:"Completado",   of:"OF-2606" },
];

const COBROS_PAGOS = [
  // Cobros
  { id:"MOV-001", tipo:"Cobro",  fecha:"2026-03-14", concepto:"Cobro FAC-202603-002", entidad:cn(87),  importe:8920.40,  cuenta:"ES12 0049 1234", metodo:"Transferencia", estado:"Realizado" },
  { id:"MOV-002", tipo:"Cobro",  fecha:"2026-03-10", concepto:"Cobro FAC-202602-014", entidad:cn(125), importe:9340.50,  cuenta:"ES12 0049 1234", metodo:"Transferencia", estado:"Realizado" },
  { id:"MOV-003", tipo:"Cobro",  fecha:"2026-03-08", concepto:"Cobro FAC-202602-013", entidad:cn(542), importe:4210.80,  cuenta:"ES12 0049 1234", metodo:"Recibo",        estado:"Realizado" },
  { id:"MOV-004", tipo:"Cobro",  fecha:"2026-03-30", concepto:"Cobro FAC-202602-015", entidad:cn(9),   importe:15680.20, cuenta:"ES12 0049 1234", metodo:"Transferencia", estado:"Pendiente" },
  { id:"MOV-005", tipo:"Cobro",  fecha:"2026-04-01", concepto:"Cobro FAC-202603-001", entidad:cn(102), importe:12450.80, cuenta:"ES12 0049 1234", metodo:"Transferencia", estado:"Pendiente" },
  // Pagos
  { id:"MOV-006", tipo:"Pago",   fecha:"2026-03-20", concepto:"Pago QuimiTech — Fosfato Fe",     entidad:"QuimiTech S.L.",        importe:3420.00, cuenta:"ES98 2100 4567", metodo:"Transferencia", estado:"Pendiente" },
  { id:"MOV-007", tipo:"Pago",   fecha:"2026-03-22", concepto:"Pago Granalla Metálica S.A.",      entidad:"Granalla Metálica S.A.", importe:1850.00, cuenta:"ES45 0075 8901", metodo:"Transferencia", estado:"Pendiente" },
  { id:"MOV-008", tipo:"Pago",   fecha:"2026-03-15", concepto:"Pago Embalajes Ibérica",           entidad:"Embalajes Ibérica",      importe:680.00,  cuenta:"ES21 0182 3456", metodo:"Recibo",        estado:"Realizado" },
  { id:"MOV-009", tipo:"Pago",   fecha:"2026-04-05", concepto:"Pago alquiler nave Esparreguera",  entidad:"Inmobiliaria Llobregat", importe:4200.00, cuenta:"ES67 0049 7890", metodo:"Transferencia", estado:"Pendiente" },
];

const PROVEEDORES_ADM = [
  { id:"PRV-001", nombre:"QuimiTech S.L.",         tipo:"Químicos",  cif:"B-08234512", plazo_pago:30, riesgo:8500,  riesgo_vivo:3420,  estado:"Activo"   },
  { id:"PRV-002", nombre:"Granalla Metálica S.A.",  tipo:"Granalla",  cif:"A-46123890", plazo_pago:60, riesgo:5000,  riesgo_vivo:1850,  estado:"Activo"   },
  { id:"PRV-003", nombre:"Embalajes Ibérica",        tipo:"Embalaje",  cif:"B-28456712", plazo_pago:30, riesgo:2000,  riesgo_vivo:0,     estado:"Activo"   },
  { id:"PRV-004", nombre:"Filtros Industriales",     tipo:"Filtros",   cif:"B-41789012", plazo_pago:45, riesgo:3000,  riesgo_vivo:1200,  estado:"Bloqueado"},
  { id:"PRV-005", nombre:"Inmobiliaria Llobregat",   tipo:"Alquiler",  cif:"A-08901234", plazo_pago:30, riesgo:50000, riesgo_vivo:4200,  estado:"Activo"   },
];

const MARGENES = [
  { cli:58,  ref:"CLIP MANETA RO",     proceso:"BC+Negro", kg:2400, precio_venta:4.85, coste_proceso:2.10, coste_quimico:0.42, coste_energia:0.31, coste_mo:0.55, coste_total:3.38, margen:1.47, margen_pct:30.3 },
  { cli:102, ref:"306 CLIP D.T.",      proceso:"BC+Negro", kg:1800, precio_venta:3.92, coste_proceso:1.85, coste_quimico:0.38, coste_energia:0.28, coste_mo:0.50, coste_total:3.01, margen:0.91, margen_pct:23.2 },
  { cli:9,   ref:"5x16",              proceso:"BC+Negro", kg:3200, precio_venta:4.12, coste_proceso:1.90, coste_quimico:0.40, coste_energia:0.29, coste_mo:0.52, coste_total:3.11, margen:1.01, margen_pct:24.5 },
  { cli:458, ref:"CASQ. SOLD. Ø22",   proceso:"Desaceit.", kg:5600, precio_venta:3.81, coste_proceso:1.40, coste_quimico:0.28, coste_energia:0.18, coste_mo:0.45, coste_total:2.31, margen:1.50, margen_pct:39.4 },
  { cli:87,  ref:"GRAPA",             proceso:"BC+Plata", kg:980,  precio_venta:5.20, coste_proceso:2.40, coste_quimico:0.55, coste_energia:0.38, coste_mo:0.60, coste_total:3.93, margen:1.27, margen_pct:24.4 },
  { cli:125, ref:"TENPLATU IRAOTU",   proceso:"BC+Plata", kg:1400, precio_venta:6.10, coste_proceso:2.65, coste_quimico:0.58, coste_energia:0.40, coste_mo:0.62, coste_total:4.25, margen:1.85, margen_pct:30.3 },
];

const CLIENTES_ADM = CLIENTES.map(c => ({
  ...c,
  cif:     `B-${c.id.toString().padStart(8,"0")}`,
  dir:     "Polígono Industrial — Vitoria-Gasteiz",
  contacto:"gerencia@empresa.com",
  plazo:   30 + (c.id % 3) * 15,
  limite:  50000 + c.f * 0.3,
  riesgo_vivo: c.f * 0.18,
  vencidas: c.id === 9 ? 15680.20 : 0,
}));

// ─── HELPERS ─────────────────────────────────────────────────────

function EstadoFac({ est }) {
  const cfg = {
    "Cobrada":        { k:"success" },
    "Pendiente cobro":{ k:"info"    },
    "Vencida":        { k:"danger"  },
    "En curso":       { k:"warning" },
  }[est] || { k:"secondary" };
  return <span style={{ ...ck(cfg.k), display:"inline-flex", padding:"2px 6px", borderRadius:4, fontSize:10, fontWeight:600, whiteSpace:"nowrap" }}>{est}</span>;
}

function EstadoPed({ est }) {
  const cfg = {
    "Completado":    { k:"success" },
    "En producción": { k:"info"    },
    "Control final": { k:"warning" },
    "Pendiente":     { k:"secondary"},
  }[est] || { k:"secondary" };
  return <span style={{ ...ck(cfg.k), display:"inline-flex", padding:"2px 6px", borderRadius:4, fontSize:10, fontWeight:600, whiteSpace:"nowrap" }}>{est}</span>;
}

// ─── TAB: DASHBOARD ───────────────────────────────────────────────
function TabDashboard() {
  const facturadoMes  = FACTURAS.filter(f => f.emision.startsWith("2026-03")).reduce((s,f) => s+f.importe, 0);
  const pendCobro     = FACTURAS.filter(f => f.estado==="Pendiente cobro").reduce((s,f) => s+f.importe, 0);
  const vencidas      = FACTURAS.filter(f => f.estado==="Vencida").reduce((s,f) => s+f.importe, 0);
  const cobradoMes    = FACTURAS.filter(f => f.pagada).reduce((s,f) => s+f.importe, 0);
  const pendPagos     = COBROS_PAGOS.filter(m => m.tipo==="Pago" && m.estado==="Pendiente").reduce((s,m) => s+m.importe, 0);
  const saldoPrev     = pendCobro - pendPagos;

  const mensual = [
    { m:"Oct'25", v:142800 }, { m:"Nov'25", v:168400 }, { m:"Dic'25", v:134200 },
    { m:"Ene'26", v:157300 }, { m:"Feb'26", v:189600 }, { m:"Mar'26", v:facturadoMes },
  ];
  const maxV = Math.max(...mensual.map(d => d.v));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {vencidas > 0 && <Al type="r">⚠ {fmt(vencidas)} en facturas vencidas — reclamo urgente a clientes</Al>}
      <Al type="b">✓ Facturación electrónica FacturaE 3.2.X — conforme Ley Crea y Crece 2026</Al>

      <KRow items={[
        { l:"Facturado mar'26",  v:fmt(facturadoMes),  c:"var(--color-text-success)" },
        { l:"Cobrado mar'26",    v:fmt(cobradoMes) },
        { l:"Pendiente cobro",   v:fmt(pendCobro),     c:"var(--color-text-info)" },
        { l:"Facturas vencidas", v:fmt(vencidas),      c:vencidas>0?"var(--color-text-danger)":undefined },
        { l:"Pagos pendientes",  v:fmt(pendPagos),     c:"var(--color-text-warning)" },
        { l:"Saldo previsto",    v:fmt(saldoPrev),     c:saldoPrev>0?"var(--color-text-success)":"var(--color-text-danger)" },
      ]}/>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:12 }}>
        {/* Gráfico facturación mensual */}
        <Card title="Facturación mensual (€)">
          <div style={{ padding:"12px 16px" }}>
            <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:100 }}>
              {mensual.map((d, i) => {
                const h = Math.round((d.v / maxV) * 80);
                const esHoy = i === mensual.length - 1;
                return (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <span style={{ fontSize:9, fontFamily:"monospace", color:esHoy?"var(--color-text-info)":"var(--color-text-secondary)" }}>
                      {Math.round(d.v/1000)}k
                    </span>
                    <div style={{ width:"100%", height:h, background:esHoy?"var(--color-background-info)":"var(--color-background-secondary)",
                      border:`1px solid ${esHoy?"var(--color-border-info)":"var(--color-border-tertiary)"}`, borderRadius:"3px 3px 0 0" }}/>
                    <span style={{ fontSize:9, color:"var(--color-text-secondary)", whiteSpace:"nowrap" }}>{d.m}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Vencimientos próximos */}
        <Card title="Próximos cobros">
          <div style={{ padding:"8px 14px", display:"flex", flexDirection:"column", gap:6 }}>
            {FACTURAS.filter(f => !f.pagada).sort((a,b) => a.vencim.localeCompare(b.vencim)).slice(0,4).map(f => (
              <div key={f.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"6px 0", borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:600 }}>{cn(f.cli).slice(0,18)}</div>
                  <div style={{ fontSize:10, color:"var(--color-text-secondary)", fontFamily:"monospace" }}>{f.vencim.slice(8)}/{f.vencim.slice(5,7)}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:12, fontWeight:700, fontFamily:"monospace" }}>{fmt(f.importe)}</div>
                  <EstadoFac est={f.estado}/>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Márgenes por cliente */}
      <Card title="Margen por referencia — mes actual">
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11.5 }}>
            <thead><tr>{["Cliente","Referencia","Proceso","Kg","€/kg venta","Coste total","Margen €/kg","Margen %"].map((c,i)=>(
              <th key={i} style={{ textAlign:"left", padding:"6px 10px", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".04em", color:"var(--color-text-secondary)", borderBottom:"0.5px solid var(--color-border-tertiary)", background:"var(--color-background-secondary)", whiteSpace:"nowrap" }}>{c}</th>
            ))}</tr></thead>
            <tbody>
              {MARGENES.map((m, i) => (
                <tr key={i}>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontSize:11 }}>{cn(m.cli)}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontWeight:500 }}>{m.ref}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontSize:11, color:"var(--color-text-secondary)" }}>{m.proceso}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{m.kg.toLocaleString()}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace", fontWeight:600 }}>{m.precio_venta.toFixed(2)} €</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{m.coste_total.toFixed(2)} €</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace", fontWeight:700,
                    color: m.margen >= 1.5 ? "var(--color-text-success)" : m.margen >= 0.8 ? "var(--color-text-warning)" : "var(--color-text-danger)" }}>
                    {m.margen.toFixed(2)} €
                  </td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:50, height:6, background:"var(--color-background-secondary)", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${m.margen_pct}%`, borderRadius:3,
                          background: m.margen_pct >= 30 ? "#22c55e" : m.margen_pct >= 20 ? "#f59e0b" : "#ef4444" }}/>
                      </div>
                      <span style={{ fontFamily:"monospace", fontSize:11, fontWeight:700,
                        color: m.margen_pct >= 30 ? "var(--color-text-success)" : m.margen_pct >= 20 ? "var(--color-text-warning)" : "var(--color-text-danger)" }}>
                        {m.margen_pct.toFixed(1)}%
                      </span>
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

// ─── TAB: FACTURAS ────────────────────────────────────────────────
function TabFacturas() {
  const [filtro, setFiltro] = useState("Todas");
  const [sel, setSel]       = useState(null);
  const [modal, setModal]   = useState(false);

  const FILTROS = ["Todas","Pendiente cobro","Cobrada","Vencida"];
  const vis = filtro === "Todas" ? FACTURAS : FACTURAS.filter(f => f.estado === filtro);
  const facSel = FACTURAS.find(f => f.id === sel);

  const vencidas = FACTURAS.filter(f => f.estado === "Vencida");

  return (
    <div style={{ display:"flex", gap:12 }}>
      {/* Lista */}
      <div style={{ width:300, flexShrink:0, display:"flex", flexDirection:"column", gap:8 }}>
        {vencidas.length > 0 && <Al type="r">⚠ {vencidas.length} factura{vencidas.length>1?"s":""} vencida{vencidas.length>1?"s":""}</Al>}

        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {FILTROS.map(f => (
            <button key={f} onClick={() => setFiltro(f)} style={{ padding:"3px 9px", borderRadius:4, cursor:"pointer", fontSize:10.5,
              border:`0.5px solid ${filtro===f?"var(--color-border-info)":"var(--color-border-tertiary)"}`,
              background:filtro===f?"var(--color-background-info)":"transparent",
              color:filtro===f?"var(--color-text-info)":"var(--color-text-secondary)",
              fontWeight:filtro===f?600:400 }}>
              {f}
            </button>
          ))}
        </div>

        <button onClick={() => setModal(true)} style={{ ...ck("success"), padding:"6px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600 }}>
          + Nueva factura
        </button>

        <div style={{ display:"flex", flexDirection:"column", gap:5, maxHeight:500, overflowY:"auto" }}>
          {vis.map(f => {
            const activo = sel === f.id;
            const esVen  = f.estado === "Vencida";
            return (
              <div key={f.id} onClick={() => setSel(f.id)} style={{ padding:"10px 13px", borderRadius:9, cursor:"pointer",
                border:`0.5px solid ${activo?"var(--color-border-info)":esVen?"#fca5a5":"var(--color-border-tertiary)"}`,
                borderLeft:`3px solid ${esVen?"#ef4444":f.pagada?"#22c55e":"#60a5fa"}`,
                background: activo?"var(--color-background-info)":"var(--color-background-primary)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                  <span style={{ fontFamily:"monospace", fontSize:11, fontWeight:700, color:activo?"var(--color-text-info)":"var(--color-text-secondary)" }}>{f.id}</span>
                  <EstadoFac est={f.estado}/>
                </div>
                <div style={{ fontSize:12, fontWeight:600, marginBottom:2 }}>{cn(f.cli)}</div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
                  <span style={{ color:"var(--color-text-secondary)" }}>Vence: {f.vencim.slice(8)}/{f.vencim.slice(5,7)}</span>
                  <span style={{ fontFamily:"monospace", fontWeight:700 }}>{fmt(f.importe)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalle factura */}
      {facSel ? (
        <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:10, padding:"14px 18px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <div style={{ fontSize:16, fontWeight:700, fontFamily:"monospace" }}>{facSel.id}</div>
                <div style={{ fontSize:12, fontWeight:600, marginTop:2 }}>{cn(facSel.cli)}</div>
              </div>
              <EstadoFac est={facSel.estado}/>
            </div>

            {/* Importes */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:12 }}>
              {[
                ["Base imponible", fmt(facSel.base)],
                ["IVA (21%)",      fmt(facSel.iva)],
                ["Total factura",  fmt(facSel.importe)],
              ].map(([k,v]) => (
                <div key={k} style={{ background:"var(--color-background-secondary)", borderRadius:8, padding:"10px 12px" }}>
                  <div style={{ fontSize:10, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".05em", marginBottom:3 }}>{k}</div>
                  <div style={{ fontSize:16, fontWeight:700, fontFamily:"monospace" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Datos */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:8 }}>
              {[
                ["Emisión",     facSel.emision.split("-").reverse().join("/")],
                ["Vencimiento", facSel.vencim.split("-").reverse().join("/")],
                ["Albarán",     facSel.alb],
                ["OFs",         facSel.ofs.join(", ")],
              ].map(([k,v]) => (
                <div key={k} style={{ background:"var(--color-background-secondary)", borderRadius:6, padding:"7px 10px" }}>
                  <div style={{ fontSize:9.5, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".05em", marginBottom:2 }}>{k}</div>
                  <div style={{ fontSize:11.5, fontWeight:500, fontFamily:"monospace" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:"flex", gap:8 }}>
            <button style={{ ...ck("info"), flex:1, padding:"8px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600 }}>
              ↓ Descargar FacturaE
            </button>
            {!facSel.pagada && (
              <button style={{ ...ck("success"), flex:1, padding:"8px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600 }}>
                ✓ Marcar como cobrada
              </button>
            )}
            <button style={{ ...ck("secondary"), flex:1, padding:"8px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600 }}>
              ✉ Enviar por email
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"var(--color-text-secondary)", fontSize:13 }}>
          ← Selecciona una factura
        </div>
      )}

      {/* Modal nueva factura placeholder */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.3)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500 }}
          onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-secondary)", borderRadius:12, width:420, maxWidth:"96%", overflow:"hidden" }}>
            <div style={{ padding:"13px 18px", borderBottom:"0.5px solid var(--color-border-tertiary)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontWeight:600, fontSize:14 }}>Nueva factura</span>
              <button onClick={() => setModal(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"var(--color-text-secondary)" }}>✕</button>
            </div>
            <div style={{ padding:18, display:"flex", flexDirection:"column", gap:10 }}>
              <Al type="b">Las facturas se generan automáticamente desde albaranes cerrados. Selecciona el albarán a facturar.</Al>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:10.5, fontWeight:600, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".04em" }}>Cliente</label>
                <select style={inp}>{CLIENTES.map(c => <option key={c.id}>{c.n}</option>)}</select>
              </div>
            </div>
            <div style={{ padding:"12px 18px", borderTop:"0.5px solid var(--color-border-tertiary)", display:"flex", justifyContent:"flex-end", gap:8 }}>
              <button onClick={() => setModal(false)} style={{ border:"0.5px solid var(--color-border-secondary)", background:"transparent", color:"var(--color-text-primary)", padding:"5px 12px", borderRadius:6, cursor:"pointer", fontSize:12 }}>Cancelar</button>
              <button style={{ ...ck("success"), padding:"5px 13px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600 }}>Generar factura</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TAB: PEDIDOS DE VENTA ────────────────────────────────────────
function TabPedidos() {
  const total    = PEDIDOS_VENTA.reduce((s,p) => s+p.importe, 0);
  const enProd   = PEDIDOS_VENTA.filter(p => p.estado === "En producción").length;
  const completos= PEDIDOS_VENTA.filter(p => p.estado === "Completado").length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <KRow items={[
        { l:"Total pedidos",    v:PEDIDOS_VENTA.length },
        { l:"En producción",    v:enProd,                c:"var(--color-text-info)" },
        { l:"Completados",      v:completos,             c:"var(--color-text-success)" },
        { l:"Importe total",    v:fmt(total),            c:"var(--color-text-success)" },
      ]}/>

      <Card>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11.5 }}>
            <thead><tr>{["Pedido","Cliente","Referencia","Kg","€/kg","Importe","F. Pedido","F. Entrega","OF","Estado"].map((c,i)=>(
              <th key={i} style={{ textAlign:"left", padding:"6px 10px", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".04em", color:"var(--color-text-secondary)", borderBottom:"0.5px solid var(--color-border-tertiary)", background:"var(--color-background-secondary)", whiteSpace:"nowrap" }}>{c}</th>
            ))}</tr></thead>
            <tbody>
              {PEDIDOS_VENTA.map((p, i) => (
                <tr key={i}>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace", fontWeight:700 }}>{p.id}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontSize:11, maxWidth:80, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{cn(p.cli)}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontWeight:500 }}>{p.ref}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{p.kg.toLocaleString()}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{p.precio_kg.toFixed(2)} €</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace", fontWeight:600 }}>{fmt(p.importe)}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontSize:11 }}>{p.fecha.slice(8)}/{p.fecha.slice(5,7)}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontSize:11 }}>{p.entrega.slice(8)}/{p.entrega.slice(5,7)}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{p.of || "—"}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)" }}><EstadoPed est={p.estado}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── TAB: COBROS Y PAGOS ─────────────────────────────────────────
function TabCobros() {
  const [filtTipo, setFiltTipo] = useState("Todos");

  const cobros  = COBROS_PAGOS.filter(m => m.tipo === "Cobro");
  const pagos   = COBROS_PAGOS.filter(m => m.tipo === "Pago");
  const pendCob = cobros.filter(m => m.estado === "Pendiente").reduce((s,m) => s+m.importe, 0);
  const pendPag = pagos.filter(m  => m.estado === "Pendiente").reduce((s,m) => s+m.importe, 0);

  const vis = filtTipo === "Todos" ? COBROS_PAGOS
    : COBROS_PAGOS.filter(m => m.tipo === filtTipo);

  // Tesorería prevista — próximos 30 días
  const tesoreria = [
    { fecha:"Hoy",     cobros:0,        pagos:5270,   saldo:24580 },
    { fecha:"22/03",   cobros:0,        pagos:1850,   saldo:22730 },
    { fecha:"30/03",   cobros:15680.20, pagos:0,      saldo:38410 },
    { fecha:"01/04",   cobros:12450.80, pagos:4200,   saldo:46661 },
    { fecha:"05/04",   cobros:0,        pagos:0,      saldo:46661 },
    { fecha:"10/04",   cobros:21340.00, pagos:0,      saldo:68001 },
    { fecha:"15/04",   cobros:18420.60, pagos:0,      saldo:86421 },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <KRow items={[
        { l:"Cobros pendientes",  v:fmt(pendCob), c:"var(--color-text-success)" },
        { l:"Pagos pendientes",   v:fmt(pendPag), c:"var(--color-text-danger)"  },
        { l:"Saldo neto previsto",v:fmt(pendCob - pendPag), c:(pendCob-pendPag)>0?"var(--color-text-success)":"var(--color-text-danger)" },
      ]}/>

      {/* Tesorería */}
      <Card title="Previsión de tesorería — próximos 30 días">
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11.5 }}>
            <thead><tr>{["Fecha","Cobros previstos","Pagos previstos","Saldo acumulado"].map((c,i)=>(
              <th key={i} style={{ textAlign:"left", padding:"6px 10px", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".04em", color:"var(--color-text-secondary)", borderBottom:"0.5px solid var(--color-border-tertiary)", background:"var(--color-background-secondary)", whiteSpace:"nowrap" }}>{c}</th>
            ))}</tr></thead>
            <tbody>
              {tesoreria.map((t, i) => (
                <tr key={i} style={{ background: i===0?"var(--color-background-secondary)":"" }}>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontWeight:i===0?700:400 }}>{t.fecha}</td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace", color:t.cobros>0?"var(--color-text-success)":"var(--color-text-secondary)" }}>
                    {t.cobros > 0 ? `+${fmt(t.cobros)}` : "—"}
                  </td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace", color:t.pagos>0?"var(--color-text-danger)":"var(--color-text-secondary)" }}>
                    {t.pagos > 0 ? `-${fmt(t.pagos)}` : "—"}
                  </td>
                  <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace", fontWeight:700, color:"var(--color-text-success)" }}>
                    {fmt(t.saldo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Movimientos */}
      <div style={{ display:"flex", gap:6 }}>
        {["Todos","Cobro","Pago"].map(t => (
          <button key={t} onClick={() => setFiltTipo(t)} style={{ padding:"4px 12px", borderRadius:5, cursor:"pointer", fontSize:11.5,
            border:`0.5px solid ${filtTipo===t?"var(--color-border-info)":"var(--color-border-tertiary)"}`,
            background:filtTipo===t?"var(--color-background-info)":"transparent",
            color:filtTipo===t?"var(--color-text-info)":"var(--color-text-secondary)",
            fontWeight:filtTipo===t?600:400 }}>
            {t}
          </button>
        ))}
      </div>

      <Card>
        <Tbl cols={["ID","Tipo","Fecha","Concepto","Entidad","Importe","Método","Estado"]}
          rows={vis.map(m => [
            <span style={mo}>{m.id}</span>,
            <span style={{ fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:4,
              background: m.tipo==="Cobro"?"#f0fdf4":"#fef2f2",
              color:      m.tipo==="Cobro"?"#166534":"#b91c1c",
              border:     `0.5px solid ${m.tipo==="Cobro"?"#86efac":"#fca5a5"}` }}>
              {m.tipo==="Cobro"?"+":"-"} {m.tipo}
            </span>,
            <span style={{ fontSize:11 }}>{m.fecha.slice(8)}/{m.fecha.slice(5,7)}</span>,
            <span style={{ fontSize:11, maxWidth:140, display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.concepto}</span>,
            <span style={{ fontSize:11 }}>{m.entidad.slice(0,20)}</span>,
            <span style={{ fontFamily:"monospace", fontWeight:700, color:m.tipo==="Cobro"?"var(--color-text-success)":"var(--color-text-danger)" }}>
              {m.tipo==="Cobro"?"+":"-"}{fmt(m.importe)}
            </span>,
            <span style={{ fontSize:11, color:"var(--color-text-secondary)" }}>{m.metodo}</span>,
            <Bdg t={m.estado}/>,
          ])}
        />
      </Card>
    </div>
  );
}

// ─── TAB: CLIENTES Y RIESGO ───────────────────────────────────────
function TabClientes() {
  const conRiesgo = CLIENTES_ADM.filter(c => c.vencidas > 0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {conRiesgo.length > 0 && (
        <Al type="r">⚠ {conRiesgo.length} cliente{conRiesgo.length>1?"s":""} con facturas vencidas — revisar riesgo y considerar bloqueo de pedido</Al>
      )}

      <Card title="Ficha de clientes — riesgo comercial">
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11.5 }}>
            <thead><tr>{["Cliente","CIF","Sector","Plazo (días)","Límite crédito","Riesgo vivo","Vencido","Estado"].map((c,i)=>(
              <th key={i} style={{ textAlign:"left", padding:"6px 10px", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".04em", color:"var(--color-text-secondary)", borderBottom:"0.5px solid var(--color-border-tertiary)", background:"var(--color-background-secondary)", whiteSpace:"nowrap" }}>{c}</th>
            ))}</tr></thead>
            <tbody>
              {CLIENTES_ADM.map((c, i) => {
                const pct     = c.limite > 0 ? Math.round(c.riesgo_vivo / c.limite * 100) : 0;
                const alertRiesgo = pct > 80;
                return (
                  <tr key={i} style={{ background: c.vencidas > 0 ? "#fef9c3" : "" }}>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontWeight:600 }}>{c.n.slice(0,22)}</td>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace", fontSize:10.5 }}>{c.cif}</td>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontSize:11, color:"var(--color-text-secondary)" }}>{c.s}</td>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{c.plazo}d</td>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace" }}>{fmt(c.limite)}</td>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <div style={{ width:50, height:6, background:"var(--color-background-secondary)", borderRadius:3, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${Math.min(pct,100)}%`, background: alertRiesgo?"#ef4444":"#60a5fa", borderRadius:3 }}/>
                        </div>
                        <span style={{ fontFamily:"monospace", fontSize:11 }}>{fmt(c.riesgo_vivo)}</span>
                      </div>
                    </td>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", fontFamily:"monospace",
                      fontWeight: c.vencidas > 0 ? 700 : 400,
                      color:      c.vencidas > 0 ? "var(--color-text-danger)" : "var(--color-text-secondary)" }}>
                      {c.vencidas > 0 ? fmt(c.vencidas) : "—"}
                    </td>
                    <td style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
                      {c.vencidas > 0
                        ? <span style={{ fontSize:10, fontWeight:700, background:"#fef9c3", color:"#854d0e", border:"0.5px solid #fde68a", padding:"2px 6px", borderRadius:4 }}>⚠ Vencido</span>
                        : <span style={{ fontSize:10, fontWeight:600, background:"#f0fdf4", color:"#166534", border:"0.5px solid #86efac", padding:"2px 6px", borderRadius:4 }}>✓ OK</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Proveedores */}
      <div style={{ fontSize:11, fontWeight:600, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".06em", marginTop:4 }}>
        Proveedores
      </div>
      <Card>
        <Tbl cols={["ID","Nombre","Tipo","CIF","Plazo","Riesgo límite","Riesgo vivo","Estado"]}
          rows={PROVEEDORES_ADM.map(p => [
            <span style={mo}>{p.id}</span>,
            <span style={{ fontWeight:500 }}>{p.nombre}</span>,
            <span style={{ fontSize:11, color:"var(--color-text-secondary)" }}>{p.tipo}</span>,
            <span style={{ fontFamily:"monospace", fontSize:10.5 }}>{p.cif}</span>,
            <span style={mo}>{p.plazo_pago}d</span>,
            <span style={mo}>{fmt(p.riesgo)}</span>,
            <span style={{ fontFamily:"monospace", fontWeight:p.riesgo_vivo>0?600:400 }}>{p.riesgo_vivo>0?fmt(p.riesgo_vivo):"—"}</span>,
            p.estado==="Bloqueado"
              ? <span style={{ fontSize:10, fontWeight:700, background:"#fef2f2", color:"#b91c1c", border:"0.5px solid #fca5a5", padding:"2px 6px", borderRadius:4 }}>⊘ Bloqueado</span>
              : <span style={{ fontSize:10, fontWeight:600, background:"#f0fdf4", color:"#166534", border:"0.5px solid #86efac", padding:"2px 6px", borderRadius:4 }}>✓ Activo</span>,
          ])}
        />
      </Card>
    </div>
  );
}

// ─── TAB: MÁRGENES ────────────────────────────────────────────────
function TabMargenes() {
  const totalKg      = MARGENES.reduce((s,m) => s+m.kg, 0);
  const margenMedio  = MARGENES.reduce((s,m) => s+m.margen_pct, 0) / MARGENES.length;
  const mejorMarg    = [...MARGENES].sort((a,b) => b.margen_pct - a.margen_pct)[0];
  const peorMarg     = [...MARGENES].sort((a,b) => a.margen_pct - b.margen_pct)[0];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <KRow items={[
        { l:"Margen medio",    v:`${margenMedio.toFixed(1)}%`, c:margenMedio>=25?"var(--color-text-success)":"var(--color-text-warning)" },
        { l:"Mejor margen",    v:`${mejorMarg.margen_pct.toFixed(1)}%`, c:"var(--color-text-success)" },
        { l:"Peor margen",     v:`${peorMarg.margen_pct.toFixed(1)}%`, c:peorMarg.margen_pct<20?"var(--color-text-danger)":"var(--color-text-warning)" },
        { l:"Kg analizados",   v:totalKg.toLocaleString() },
      ]}/>

      {/* Desglose de costes */}
      <Card title="Desglose de costes por referencia (€/kg)">
        <div style={{ padding:"12px 16px" }}>
          {MARGENES.map((m, i) => (
            <div key={i} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, fontWeight:600 }}>{m.ref} <span style={{ fontSize:10.5, color:"var(--color-text-secondary)", fontWeight:400 }}>({cn(m.cli)})</span></span>
                <span style={{ fontSize:11, fontFamily:"monospace", fontWeight:700,
                  color: m.margen_pct >= 30 ? "var(--color-text-success)" : m.margen_pct >= 20 ? "var(--color-text-warning)" : "var(--color-text-danger)" }}>
                  Margen: {m.margen_pct.toFixed(1)}%
                </span>
              </div>
              {/* Barra apilada */}
              <div style={{ display:"flex", height:16, borderRadius:4, overflow:"hidden", marginBottom:4 }}>
                {[
                  { label:"Proceso",  v:m.coste_proceso,  color:"#60a5fa" },
                  { label:"Químico",  v:m.coste_quimico,  color:"#a78bfa" },
                  { label:"Energía",  v:m.coste_energia,  color:"#f59e0b" },
                  { label:"M.O.",     v:m.coste_mo,       color:"#34d399" },
                  { label:"Margen",   v:m.margen,         color:"#22c55e" },
                ].map(({ label, v, color }) => (
                  <div key={label} title={`${label}: ${v.toFixed(2)} €/kg`}
                    style={{ width:`${(v / m.precio_venta) * 100}%`, background:color, transition:"width .3s" }}/>
                ))}
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {[
                  { label:"Proceso",  v:m.coste_proceso,  color:"#60a5fa" },
                  { label:"Químico",  v:m.coste_quimico,  color:"#a78bfa" },
                  { label:"Energía",  v:m.coste_energia,  color:"#f59e0b" },
                  { label:"M.O.",     v:m.coste_mo,       color:"#34d399" },
                  { label:"Margen",   v:m.margen,         color:"#22c55e" },
                ].map(({ label, v, color }) => (
                  <span key={label} style={{ fontSize:10, display:"flex", alignItems:"center", gap:3, color:"var(--color-text-secondary)" }}>
                    <span style={{ width:8, height:8, borderRadius:2, background:color, display:"inline-block" }}/>
                    {label}: <b style={{ color:"var(--color-text-primary)" }}>{v.toFixed(2)}</b>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── MÓDULO PRINCIPAL ─────────────────────────────────────────────
export default function Administracion() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Tabs
        items={[
          ["dashboard", "Dashboard"],
          ["facturas",  "Facturas"],
          ["pedidos",   "Pedidos venta"],
          ["cobros",    "Cobros y pagos"],
          ["clientes",  "Clientes / Prov."],
          ["margenes",  "Márgenes"],
        ]}
        cur={tab} onChange={setTab}
      />

      {tab==="dashboard" && <TabDashboard/>}
      {tab==="facturas"  && <TabFacturas/>}
      {tab==="pedidos"   && <TabPedidos/>}
      {tab==="cobros"    && <TabCobros/>}
      {tab==="clientes"  && <TabClientes/>}
      {tab==="margenes"  && <TabMargenes/>}
    </div>
  );
}
