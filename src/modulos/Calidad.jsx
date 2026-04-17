// src/modulos/Calidad.jsx
import { useContext, useState } from "react";
import { ERPContext } from "../ERP";
import { CLIENTES, MAQUINAS, cn } from "../datos";
import { Bdg, Card, Tbl, Tabs, Al, KRow, ck } from "../ui";

// ─── ESTILOS ──────────────────────────────────────────────────────
const mo  = { fontFamily:"monospace", fontSize:11 };
const inp = { border:"0.5px solid var(--color-border-tertiary)", background:"var(--color-background-secondary)", color:"var(--color-text-primary)", padding:"7px 10px", borderRadius:6, fontSize:12, outline:"none", width:"100%", boxSizing:"border-box" };

// Estilos fijos para modales (no CSS vars — regla del proyecto)
const MI  = { border:"1.5px solid #d1d5db", borderRadius:8, padding:"9px 12px", fontSize:13, color:"#111827", background:"#fff", outline:"none", width:"100%", boxSizing:"border-box" };
const MIS = { ...MI, padding:"7px 10px", fontSize:12 };
const ML  = { fontSize:11, fontWeight:600, color:"#374151", textTransform:"uppercase", letterSpacing:".05em", marginBottom:4, display:"block" };
const MB  = { border:"none", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600, padding:"7px 16px" };
const MBP = { ...MB, background:"#2563eb", color:"#fff" };
const MBD = { ...MB, background:"#dc2626", color:"#fff" };
const MBG = { ...MB, background:"transparent", border:"1px solid #d1d5db", color:"#374151" };
const MBS = { ...MB, padding:"4px 10px", fontSize:11 };

// ─── COMPONENTES MODAL REUTILIZABLES ─────────────────────────────
function Campo({ label, required, children }){
  return <div style={{display:"flex",flexDirection:"column",gap:5}}><label style={ML}>{label}{required&&<span style={{color:"#ef4444",marginLeft:2}}>*</span>}</label>{children}</div>;
}
function R2({c}){ return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>{c}</div>; }
function R3({c}){ return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>{c}</div>; }
function Sep({label}){ return <div style={{display:"flex",alignItems:"center",gap:10,margin:"4px 0"}}><div style={{flex:1,height:1,background:"#f3f4f6"}}/><span style={{fontSize:11,fontWeight:600,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}}>{label}</span><div style={{flex:1,height:1,background:"#f3f4f6"}}/></div>; }

function Modal({ titulo, subtitulo, onClose, onGuardar, btnLabel="Guardar", btnStyle=MBP, ancho=560, children }){
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
          <button onClick={onClose} style={MBG}>Cancelar</button>
          <button onClick={onGuardar} style={btnStyle}>{btnLabel}</button>
        </div>
      </div>
    </div>
  );
}

function ModalConfirm({ texto, onClose, onConfirmar }){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:700}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:12,padding:"24px 28px",maxWidth:420,width:"90%",boxShadow:"0 20px 40px rgba(0,0,0,.2)"}}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:8,color:"#111827"}}>Confirmar eliminación</div>
        <div style={{fontSize:13,color:"#6b7280",marginBottom:20}}>{texto}</div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
          <button onClick={onClose} style={MBG}>Cancelar</button>
          <button onClick={onConfirmar} style={MBD}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

// ─── DATOS INICIALES ─────────────────────────────────────────────
const NCS_INIT = [
  { id:"NC-2026-001", f:"10/03", cli:58,  of:"OF-2598", maq:"TWIN44", proc:"Recubrimiento",
    tipo:"Reclamación cliente", origen:"Externo",
    desc:"Piezas dobladas en recepción — daño en manipulación", grav:"Mayor",
    est:"8D Abierto", resp:"J. García", op:"C. Font",
    causa_raiz:"Embalaje insuficiente para el peso del lote",
    accion_inm:"Segregación del lote y revisión 100%",
    accion_corr:"Rediseño embalaje + instrucción de trabajo",
    accion_prev:"Auditoría proceso embalaje trimestral",
    d1:"J. García, A. Martín", d2:"Piezas con deformación en zona roscada", d3:"Segregación inmediata 450 piezas",
    d4:"", d5:"", d6:"", d7:"", d8:"",
    kg_afectados:400, coste_est:1240 },
  { id:"NC-2026-002", f:"08/03", cli:102, of:"OF-2591", maq:"MN-01",  proc:"Recubrimiento",
    tipo:"Proceso interno", origen:"Interno",
    desc:"Espesor 18μm fuera de especificación (máx 15μm)", grav:"Menor",
    est:"Cerrada", resp:"M. Torres", op:"J. Pérez",
    causa_raiz:"Parámetro Vc incorrecto por confusión de receta",
    accion_inm:"Retención lote y remuestreo",
    accion_corr:"Bloqueo de cambio manual de receta sin autorización",
    accion_prev:"Verificación PLC obligatoria antes de arranque",
    d1:"M. Torres, J. Pérez", d2:"Espesor fuera de spec en 3 piezas de 20 muestreadas",
    d3:"Retención lote OF-2591", d4:"Confusión ref. receta TWIN44 vs MN-01",
    d5:"Control PLC bloqueante", d6:"Validado en producción 3 días", d7:"Formación operarios", d8:"Cerrada 15/03",
    kg_afectados:250, coste_est:380 },
  { id:"NC-2026-003", f:"12/03", cli:9,   of:"OF-2595", maq:"GR-01",  proc:"Granallado",
    tipo:"Laboratorio", origen:"Interno",
    desc:"Adherencia cross-cut Gt2 — especificación máx. Gt1", grav:"Mayor",
    est:"Abierta", resp:"A. Martín", op:"F. Cano",
    causa_raiz:"", accion_inm:"Muestras retenidas — laboratorio en análisis",
    accion_corr:"", accion_prev:"",
    d1:"",d2:"",d3:"",d4:"",d5:"",d6:"",d7:"",d8:"",
    kg_afectados:320, coste_est:0 },
  { id:"NC-2026-004", f:"13/03", cli:458, of:"OF-2604", maq:"DC02",   proc:"Desaceitado",
    tipo:"Proceso interno", origen:"Interno",
    desc:"Color no uniforme — manchas en zona central", grav:"Menor",
    est:"Abierta", resp:"P. Ramos", op:"D. Gil",
    causa_raiz:"", accion_inm:"Inspección 100% piezas lote afectado",
    accion_corr:"", accion_prev:"",
    d1:"",d2:"",d3:"",d4:"",d5:"",d6:"",d7:"",d8:"",
    kg_afectados:480, coste_est:0 },
];

const PLANES_INIT = [
  { id:"PC-001", ref:"CLIP MANETA RO", maquina:"TWIN44", proceso:"Recubrimiento", estado:"Activo", version:"v2", obs:"",
    controles:[
      { param:"Espesor recubrimiento", metodo:"Medidor magnético", freq:"Cada 2h",  min:10,   max:16,   unidad:"μm",    resp:"Operario" },
      { param:"Aspecto visual",        metodo:"Inspección visual",  freq:"100%",    min:null, max:null, unidad:"OK/NOK", resp:"Operario" },
      { param:"Adherencia cross-cut",  metodo:"ISO 2409",           freq:"1/turno", min:0,    max:1,    unidad:"Gt",     resp:"Lab." },
      { param:"Temperatura horno",     metodo:"PLC / termopar",     freq:"Continuo",min:190,  max:210,  unidad:"°C",     resp:"PLC" },
    ]},
  { id:"PC-002", ref:"306 CLIP D.T.", maquina:"MN-01", proceso:"Recubrimiento", estado:"Activo", version:"v1", obs:"",
    controles:[
      { param:"Espesor recubrimiento", metodo:"Medidor magnético", freq:"Cada 2h", min:10,   max:15,   unidad:"μm",    resp:"Operario" },
      { param:"Aspecto visual",        metodo:"Inspección visual",  freq:"100%",   min:null, max:null, unidad:"OK/NOK", resp:"Operario" },
      { param:"Resistencia corrosión", metodo:"NSS ISO 9227",       freq:"1/mes",  min:240,  max:null, unidad:"h",      resp:"Lab." },
    ]},
  { id:"PC-003", ref:"CASQ. SOLD. Ø22", maquina:"DC02", proceso:"Desaceitado", estado:"Activo", version:"v1", obs:"",
    controles:[
      { param:"Par de apriete",        metodo:"Torquímetro",  freq:"5 uds/lote", min:23,  max:27,   unidad:"Nm", resp:"Calidad" },
      { param:"Resistencia corrosión", metodo:"NSS ISO 9227", freq:"1/lote",     min:720, max:null, unidad:"h",  resp:"Lab." },
    ]},
];

const REGISTROS_CTRL = [
  { id:"RC-001", plan:"PC-001", fecha:"2026-03-19", hora:"08:00", param:"Espesor recubrimiento", valor:12.4, ok:true,  of:"OF-2601", op:"C. Font",  obs:"" },
  { id:"RC-002", plan:"PC-001", fecha:"2026-03-19", hora:"10:00", param:"Espesor recubrimiento", valor:11.8, ok:true,  of:"OF-2601", op:"C. Font",  obs:"" },
  { id:"RC-003", plan:"PC-001", fecha:"2026-03-19", hora:"08:15", param:"Temperatura horno",     valor:201,  ok:true,  of:"OF-2601", op:"PLC",      obs:"" },
  { id:"RC-004", plan:"PC-001", fecha:"2026-03-12", hora:"09:30", param:"Temperatura horno",     valor:215,  ok:false, of:"OF-2605", op:"PLC",      obs:"Desviación — NC generada" },
  { id:"RC-005", plan:"PC-002", fecha:"2026-03-19", hora:"07:50", param:"Espesor recubrimiento", valor:13.1, ok:true,  of:"OF-2602", op:"J. Pérez", obs:"" },
  { id:"RC-006", plan:"PC-003", fecha:"2026-03-18", hora:"14:30", param:"Par de apriete",        valor:24.8, ok:true,  of:"OF-2604", op:"Calidad",  obs:"" },
];

const PROVEEDORES_INIT = [
  { id:"PROV-001", nombre:"QuimiTech S.L.",        tipo:"Químicos",  cif:"B-08234512", contacto:"info@quimitech.es",   tel:"93 234 56 78", plazo:30, incidencias:1, plazo_ok:94, calidad_ok:98,  bloqueado:false, nivel:"A", obs:"Proveedor principal KL120" },
  { id:"PROV-002", nombre:"Granalla Metálica S.A.", tipo:"Granalla",  cif:"A-46123890", contacto:"ventas@granalla.es",  tel:"96 345 67 89", plazo:60, incidencias:0, plazo_ok:99, calidad_ok:100, bloqueado:false, nivel:"A", obs:"" },
  { id:"PROV-003", nombre:"Embalajes Ibérica",      tipo:"Embalaje",  cif:"B-28456712", contacto:"pedidos@embalajes.es",tel:"91 456 78 90", plazo:30, incidencias:2, plazo_ok:82, calidad_ok:91,  bloqueado:false, nivel:"B", obs:"Incidencia embalaje NC-2026-001" },
  { id:"PROV-004", nombre:"Filtros Industriales",   tipo:"Filtros",   cif:"B-41789012", contacto:"comercial@filtros.es",tel:"94 567 89 01", plazo:45, incidencias:3, plazo_ok:71, calidad_ok:88,  bloqueado:true,  nivel:"C", obs:"Bloqueado por reiteradas incidencias" },
  { id:"PROV-005", nombre:"Recambios Técnicos",     tipo:"Recambios", cif:"A-08901234", contacto:"info@recambios.es",   tel:"93 678 90 12", plazo:30, incidencias:0, plazo_ok:96, calidad_ok:99,  bloqueado:false, nivel:"A", obs:"" },
];

const AUDITORIAS_INIT = [
  { id:"AUD-2026-01", tipo:"Interna IATF 16949", fecha:"2026-04-15", resp:"J. García", alcance:"Línea TWIN completa",           est:"Planificada", hallazgos:0, obs:"Preparar check-list proceso",      acciones:"" },
  { id:"AUD-2026-02", tipo:"Cliente ITW",         fecha:"2026-05-20", resp:"M. Torres", alcance:"Proceso recubrimiento + lab.",   est:"Planificada", hallazgos:0, obs:"Confirmar agenda con cliente",    acciones:"" },
  { id:"AUD-2026-03", tipo:"Cert. IATF 16949",    fecha:"2026-09-10", resp:"A. Martín", alcance:"Sistema completo",               est:"Planificada", hallazgos:0, obs:"",                                acciones:"" },
  { id:"AUD-2025-04", tipo:"Interna ISO 9001",    fecha:"2025-10-15", resp:"J. García", alcance:"Gestión calidad + proveedores",  est:"Cerrada",     hallazgos:3, obs:"",                                acciones:"NC por falta doc. procedimientos. Corregido 15/11/2025" },
  { id:"AUD-2025-03", tipo:"Interna IATF 16949",  fecha:"2025-04-10", resp:"M. Torres", alcance:"Línea MN + laboratorio",         est:"Cerrada",     hallazgos:1, obs:"",                                acciones:"Hallazgo trazabilidad baños. Corregido con nuevo registro." },
];

// ─── HELPERS ─────────────────────────────────────────────────────
function BdgGrav({ g }){
  const k = g==="Crítica"?"danger":g==="Mayor"?"warning":"secondary";
  return <span style={{...ck(k),display:"inline-flex",padding:"2px 6px",borderRadius:4,fontSize:10,fontWeight:600,whiteSpace:"nowrap"}}>{g}</span>;
}
function BdgNivel({ n }){
  const col = n==="A"?"#f0fdf4,#166534,#86efac":n==="B"?"#fffbeb,#92400e,#fde68a":"#fef2f2,#b91c1c,#fca5a5";
  const [bg,tx,bd]=col.split(",");
  return <span style={{fontSize:11,fontWeight:700,background:bg,color:tx,border:`0.5px solid ${bd}`,padding:"2px 8px",borderRadius:4}}>Nivel {n}</span>;
}

// ─── TAB: DASHBOARD KPIs ─────────────────────────────────────────
function TabKPIs({ ncs }){
  const abiertas   = ncs.filter(n=>n.est!=="Cerrada").length;
  const criticas   = ncs.filter(n=>n.grav==="Mayor"||n.grav==="Crítica").length;
  const externas   = ncs.filter(n=>n.origen==="Externo").length;
  const costeTotal = ncs.reduce((s,n)=>s+(n.coste_est||0),0);
  const kgAfect    = ncs.reduce((s,n)=>s+(n.kg_afectados||0),0);
  const tasaCierre = ncs.length>0?Math.round(ncs.filter(n=>n.est==="Cerrada").length/ncs.length*100):100;

  const porTipo = {};
  ncs.forEach(n=>{ porTipo[n.tipo]=(porTipo[n.tipo]||0)+1; });
  const paretoData = Object.entries(porTipo).sort((a,b)=>b[1]-a[1]);
  const maxP = paretoData[0]?.[1]||1;

  const porMaq = {};
  ncs.forEach(n=>{ if(n.maq) porMaq[n.maq]=(porMaq[n.maq]||0)+1; });
  const maqData = Object.entries(porMaq).sort((a,b)=>b[1]-a[1]);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <KRow items={[
        {l:"NCs abiertas",      v:abiertas,  c:abiertas>2?"var(--color-text-danger)":"var(--color-text-warning)"},
        {l:"Gravedad Mayor/Crít.",v:criticas,  c:criticas>0?"var(--color-text-danger)":undefined},
        {l:"Externas (cliente)", v:externas,  c:externas>0?"var(--color-text-danger)":undefined},
        {l:"Tasa cierre",        v:`${tasaCierre}%`,c:tasaCierre>=80?"var(--color-text-success)":"var(--color-text-warning)"},
        {l:"Kg afectados",       v:kgAfect.toLocaleString()},
        {l:"Coste no calidad",   v:`${costeTotal.toLocaleString()} €`,c:costeTotal>1000?"var(--color-text-danger)":undefined},
      ]}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Card title="Pareto — NCs por tipo">
          <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:8}}>
            {paretoData.map(([tipo,n])=>(
              <div key={tipo} style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,alignItems:"center"}}>
                <div>
                  <div style={{fontSize:11.5,marginBottom:3}}>{tipo}</div>
                  <div style={{height:8,background:"var(--color-background-secondary)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(n/maxP)*100}%`,background:"#ef4444",borderRadius:3}}/>
                  </div>
                </div>
                <span style={{...mo,fontSize:13,fontWeight:700,color:"var(--color-text-danger)"}}>{n}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="NCs por máquina">
          <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:8}}>
            {maqData.map(([maq,n])=>(
              <div key={maq} style={{display:"grid",gridTemplateColumns:"80px 1fr 30px",gap:8,alignItems:"center"}}>
                <span style={mo}>{maq}</span>
                <div style={{height:8,background:"var(--color-background-secondary)",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${(n/(maqData[0]?.[1]||1))*100}%`,background:"#f59e0b",borderRadius:3}}/>
                </div>
                <span style={{...mo,fontWeight:700}}>{n}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card title="Evolución NCs — últimas 6 semanas">
        <div style={{padding:"12px 16px"}}>
          <svg viewBox="0 0 400 80" style={{width:"100%",height:80}}>
            {[{s:"S10",v:3},{s:"S11",v:5},{s:"S12",v:2},{s:"S13",v:4},{s:"S14",v:6},{s:"S15",v:4}].map((d,i,a)=>{
              const x=30+i*66, y=65-(d.v/8)*50;
              return(
                <g key={i}>
                  <circle cx={x} cy={y} r="3" fill="#ef4444"/>
                  <text x={x} y="78" textAnchor="middle" fontSize="9" fill="var(--color-text-secondary)">{d.s}</text>
                  <text x={x} y={y-6} textAnchor="middle" fontSize="9" fontWeight="600" fill="#ef4444">{d.v}</text>
                  {i>0&&<line x1={30+(i-1)*66} y1={65-(a[i-1].v/8)*50} x2={x} y2={y} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4"/>}
                </g>
              );
            })}
          </svg>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TAB: NO CONFORMIDADES — Rediseño completo
// Soporta: Incidencia simple + 8D completo
// Incluye: Ishikawa, 5 Porqués, acciones múltiples, generación PDF
// ═══════════════════════════════════════════════════════════════════

// ─── CONSTANTES ──────────────────────────────────────────────────
const PLANTAS     = ["Esparreguera","Vitoria"];
const TIPOS_NC    = ["Proceso interno","Reclamación cliente","Laboratorio","Proveedor","Manipulación"];
const GRAVS_NC    = ["Menor","Mayor","Crítica"];
const ESTADOS_NC  = ["Abierta","8D Abierto","En análisis","Cerrada"];
const ESTADOS_ACC = ["Abierto","Pendiente","Cerrado"];
const TIPOS_ACC   = ["Inmediata","Correctiva","Preventiva"];
const RAMAS_ISHIKAWA = ["Método","Mano de obra","Máquina","Material","Medición","Medio ambiente"];
const PRIO_GRAV = {
  Menor:   {bg:"#fffbeb",tx:"#92400e",bd:"#fde68a"},
  Mayor:   {bg:"#fef2f2",tx:"#b91c1c",bd:"#fca5a5"},
  Crítica: {bg:"#7f1d1d",tx:"#fff",   bd:"#b91c1c"},
};
const EST_ACC_STYLE = {
  Abierto:   {bg:"#fef2f2",tx:"#b91c1c",bd:"#fca5a5"},
  Pendiente: {bg:"#fffbeb",tx:"#92400e",bd:"#fde68a"},
  Cerrado:   {bg:"#f0fdf4",tx:"#166534",bd:"#86efac"},
};
const TIPO_ACC_STYLE = {
  Inmediata:   {bg:"#fff7ed",tx:"#c2410c",bd:"#fed7aa",icon:"⚡"},
  Correctiva:  {bg:"#eff6ff",tx:"#1d4ed8",bd:"#93c5fd",icon:"🔧"},
  Preventiva:  {bg:"#f0fdf4",tx:"#166534",bd:"#86efac",icon:"🛡"},
};

// Helpers UI internos
const SL = { fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:5 };
const FI = { border:"1.5px solid #d1d5db",borderRadius:8,padding:"8px 11px",fontSize:13,color:"#111827",background:"#fff",outline:"none",width:"100%",boxSizing:"border-box" };
const FIA = { ...FI, resize:"vertical", fontFamily:"inherit" };

function CampoNC({label,req,children}){ return <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={SL}>{label}{req&&<span style={{color:"#ef4444",marginLeft:2}}>*</span>}</label>{children}</div>; }
function G2NC({children}){ return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{children}</div>; }
function G3NC({children}){ return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>{children}</div>; }
function SepNC({label}){ return <div style={{display:"flex",alignItems:"center",gap:10,margin:"6px 0"}}><div style={{flex:1,height:1,background:"#f3f4f6"}}/><span style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".07em",whiteSpace:"nowrap"}}>{label}</span><div style={{flex:1,height:1,background:"#f3f4f6"}}/></div>; }

// ─── MODAL NC (alta / edición) ────────────────────────────────────
function ModalNC({ nc, ncs, onClose, onGuardar }) {
  const esNueva = !nc || !ncs.find(n=>n.id===nc.id);
  const [form, setForm] = useState(nc || {
    tipo_proceso: "Incidencia",
    grav:"Menor", est:"Abierta", tipo:"Proceso interno", origen:"Interno",
    cli:"", of:"", maq:"", proc:"", planta:"Esparreguera",
    desc:"", equipo:"", num_reclamacion:"", lote_cliente:"", albaran:"",
    resp:"", op:"", kg_afectados:0, coste_est:0,
    fotos:[],
    // Causa raíz
    fecha_causa:"", causa_raiz:"",
    // Ishikawa
    ishikawa:{ "Método":[], "Mano de obra":[], "Máquina":[], "Material":[], "Medición":[], "Medio ambiente":[] },
    // 5 Porqués
    cinco_porques:{ causa_origen:"", porques:["","","","",""], causa_raiz_final:"" },
    // Acciones
    acciones:[],
    // 8D
    d1:"",d2:"",d3:"",d4:"",d5:"",d6:"",d7:"",d8:"",
  });

  const [seccion, setSeccion] = useState("general");
  const ff = k => e => setForm(p=>({...p,[k]:e.target.type==="number"?parseFloat(e.target.value)||0:e.target.value}));

  // ── Fotos ──
  function addFoto(e){
    const f=e.target.files[0]; if(!f)return;
    const r=new FileReader();
    r.onload=ev=>setForm(p=>({...p,fotos:[...(p.fotos||[]),{url:ev.target.result,nombre:f.name}]}));
    r.readAsDataURL(f);
  }
  function removeFoto(i){ setForm(p=>({...p,fotos:p.fotos.filter((_,j)=>j!==i)})); }

  // ── Ishikawa ──
  function addCausaIsh(rama){
    setForm(p=>({...p,ishikawa:{...p.ishikawa,[rama]:[...(p.ishikawa[rama]||[]),""]}}));
  }
  function setCausaIsh(rama,idx,val){
    setForm(p=>({...p,ishikawa:{...p.ishikawa,[rama]:p.ishikawa[rama].map((c,i)=>i===idx?val:c)}}));
  }
  function removeCausaIsh(rama,idx){
    setForm(p=>({...p,ishikawa:{...p.ishikawa,[rama]:p.ishikawa[rama].filter((_,i)=>i!==idx)}}));
  }

  // ── 5 Porqués ──
  function setPorque(idx,val){
    setForm(p=>({...p,cinco_porques:{...p.cinco_porques,porques:p.cinco_porques.porques.map((q,i)=>i===idx?val:q)}}));
  }

  // ── Acciones ──
  function addAccion(tipo){
    const id=`ACC-${Date.now()}`;
    setForm(p=>({...p,acciones:[...(p.acciones||[]),{id,tipo,descripcion:"",responsable:"",fecha_prevista:"",estado:"Abierto"}]}));
  }
  function updateAccion(id,campo,val){
    setForm(p=>({...p,acciones:p.acciones.map(a=>a.id===id?{...a,[campo]:val}:a)}));
  }
  function removeAccion(id){ setForm(p=>({...p,acciones:p.acciones.filter(a=>a.id!==id)})); }

  // Todas las causas de Ishikawa (para selector 5 Porqués)
  const todasCausasIsh = RAMAS_ISHIKAWA.flatMap(r=>(form.ishikawa[r]||[]).filter(Boolean).map(c=>({rama:r,causa:c})));

  const SECCIONES = [
    {id:"general",label:"📋 General"},
    {id:"causa",  label:"🔍 Causa raíz"},
    {id:"acciones",label:"⚡ Acciones"},
    ...(form.tipo_proceso==="8D"?[{id:"8d",label:"📊 8D"}]:[]),
  ];

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,padding:16}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:14,width:720,maxWidth:"98%",maxHeight:"94vh",display:"flex",flexDirection:"column",boxShadow:"0 25px 60px rgba(0,0,0,.3)",overflow:"hidden"}}>

        {/* Header */}
        <div style={{padding:"14px 20px",borderBottom:"1px solid #f3f4f6",background:"#fafafa",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexShrink:0}}>
          <div>
            <div style={{fontWeight:700,fontSize:15,color:"#111827"}}>{esNueva?"Nueva No Conformidad":"Editar NC — "+nc?.id}</div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>Recubri<b>metal</b>Tech · Módulo de Calidad</div>
          </div>
          {/* Selector tipo proceso */}
          <div style={{display:"flex",gap:6,marginRight:32}}>
            {["Incidencia","8D"].map(t=>(
              <button key={t} onClick={()=>setForm(p=>({...p,tipo_proceso:t}))} style={{padding:"6px 16px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:700,border:`2px solid ${form.tipo_proceso===t?(t==="8D"?"#2563eb":"#6b7280"):"#e5e7eb"}`,background:form.tipo_proceso===t?(t==="8D"?"#2563eb":"#374151"):"#fff",color:form.tipo_proceso===t?"#fff":"#6b7280"}}>
                {t==="8D"?"📊 8D":"📋 Incidencia"}
              </button>
            ))}
          </div>
          <button onClick={onClose} style={{background:"#f3f4f6",border:"none",cursor:"pointer",width:30,height:30,borderRadius:"50%",fontSize:16,color:"#6b7280",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
        </div>

        {/* Sub-navegación secciones */}
        <div style={{display:"flex",gap:0,borderBottom:"1px solid #e5e7eb",background:"#f9fafb",flexShrink:0,overflowX:"auto"}}>
          {SECCIONES.map(s=>(
            <button key={s.id} onClick={()=>setSeccion(s.id)} style={{padding:"10px 18px",border:"none",borderBottom:`2px solid ${seccion===s.id?"#2563eb":"transparent"}`,background:"transparent",cursor:"pointer",fontSize:12,fontWeight:seccion===s.id?700:400,color:seccion===s.id?"#1d4ed8":"#6b7280",whiteSpace:"nowrap"}}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Cuerpo */}
        <div style={{flex:1,overflowY:"auto",padding:"18px 20px",display:"flex",flexDirection:"column",gap:14}}>

          {/* ── SECCIÓN GENERAL ── */}
          {seccion==="general"&&(<>
            <G3NC>
              <CampoNC label="Gravedad" req>
                <div style={{display:"flex",gap:6}}>
                  {GRAVS_NC.map(g=>{const s=PRIO_GRAV[g];return(
                    <button key={g} onClick={()=>setForm(p=>({...p,grav:g}))} style={{flex:1,padding:"8px 4px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:700,border:`2px solid ${form.grav===g?s.bd:"#e5e7eb"}`,background:form.grav===g?s.bg:"#fff",color:form.grav===g?s.tx:"#9ca3af"}}>{g}</button>
                  );})}
                </div>
              </CampoNC>
              <CampoNC label="Estado">
                <select value={form.est} onChange={ff("est")} style={FI}>{ESTADOS_NC.map(s=><option key={s}>{s}</option>)}</select>
              </CampoNC>
              <CampoNC label="Planta">
                <select value={form.planta} onChange={ff("planta")} style={FI}>{PLANTAS.map(p=><option key={p}>{p}</option>)}</select>
              </CampoNC>
            </G3NC>

            <SepNC label="Datos de la pieza / proceso"/>
            <G2NC>
              <CampoNC label="Cliente">
                <select value={form.cli} onChange={e=>setForm(p=>({...p,cli:parseInt(e.target.value)||e.target.value}))} style={FI}>
                  <option value="">— Seleccionar —</option>
                  {CLIENTES.map(c=><option key={c.id} value={c.id}>{c.n}</option>)}
                </select>
              </CampoNC>
              <CampoNC label="Máquina">
                <select value={form.maq} onChange={ff("maq")} style={FI}>
                  <option value="">— Seleccionar —</option>
                  {MAQUINAS.filter(m=>m.est!=="Inhabilitada").map(m=><option key={m.id}>{m.id}</option>)}
                </select>
              </CampoNC>
            </G2NC>
            <G3NC>
              <CampoNC label="OF"><input value={form.of} onChange={ff("of")} style={FI} placeholder="OF-2610"/></CampoNC>
              <CampoNC label="Proceso"><input value={form.proc} onChange={ff("proc")} style={FI} placeholder="Recubrimiento, Granallado…"/></CampoNC>
              <CampoNC label="Equipo implicado"><input value={form.equipo} onChange={ff("equipo")} style={FI} placeholder="pH-metro, balanza, mordaza…"/></CampoNC>
            </G3NC>

            <SepNC label="Referencia cliente"/>
            <G3NC>
              <CampoNC label="Nº Reclamación cliente"><input value={form.num_reclamacion} onChange={ff("num_reclamacion")} style={FI} placeholder="REC-2026-001"/></CampoNC>
              <CampoNC label="Lote de cliente"><input value={form.lote_cliente} onChange={ff("lote_cliente")} style={FI} placeholder="L-2026-044"/></CampoNC>
              <CampoNC label="Albarán"><input value={form.albaran} onChange={ff("albaran")} style={FI} placeholder="ALB-20260312-001"/></CampoNC>
            </G3NC>

            <SepNC label="Descripción del problema"/>
            <CampoNC label="Tipo de no conformidad">
              <select value={form.tipo} onChange={ff("tipo")} style={FI}>{TIPOS_NC.map(t=><option key={t}>{t}</option>)}</select>
            </CampoNC>
            <CampoNC label="Descripción del defecto" req>
              <textarea value={form.desc} onChange={ff("desc")} rows={3} style={FIA} placeholder="Describe detalladamente el defecto o incidencia detectada…"/>
            </CampoNC>
            <G3NC>
              <CampoNC label="Responsable"><input value={form.resp} onChange={ff("resp")} style={FI}/></CampoNC>
              <CampoNC label="Kg afectados"><input type="number" value={form.kg_afectados} onChange={ff("kg_afectados")} style={FI}/></CampoNC>
              <CampoNC label="Coste estimado (€)"><input type="number" value={form.coste_est} onChange={ff("coste_est")} style={FI}/></CampoNC>
            </G3NC>

            <SepNC label="Fotografías de los defectos"/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-start"}}>
              {(form.fotos||[]).map((f,i)=>(
                <div key={i} style={{position:"relative",width:100,height:100}}>
                  <img src={f.url} alt={f.nombre} style={{width:100,height:100,objectFit:"cover",borderRadius:8,border:"1px solid #e5e7eb"}}/>
                  <button onClick={()=>removeFoto(i)} style={{position:"absolute",top:3,right:3,background:"rgba(0,0,0,.55)",border:"none",color:"#fff",borderRadius:"50%",width:20,height:20,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                </div>
              ))}
              <label style={{width:100,height:100,border:"2px dashed #d1d5db",borderRadius:8,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#f9fafb",gap:4}}>
                <input type="file" accept="image/*" onChange={addFoto} style={{display:"none"}}/>
                <span style={{fontSize:24,color:"#9ca3af"}}>📷</span>
                <span style={{fontSize:10,color:"#9ca3af",textAlign:"center"}}>Añadir foto</span>
              </label>
            </div>
          </>)}

          {/* ── SECCIÓN CAUSA RAÍZ ── */}
          {seccion==="causa"&&(<>
            <G2NC>
              <CampoNC label="Fecha análisis causa raíz">
                <input type="date" value={form.fecha_causa} onChange={ff("fecha_causa")} style={FI}/>
              </CampoNC>
              <CampoNC label="Responsable análisis">
                <input value={form.resp} onChange={ff("resp")} style={FI}/>
              </CampoNC>
            </G2NC>
            <CampoNC label="Causa raíz identificada">
              <textarea value={form.causa_raiz} onChange={ff("causa_raiz")} rows={2} style={FIA} placeholder="Descripción de la causa raíz final…"/>
            </CampoNC>

            <SepNC label="Diagrama de Ishikawa — 6M"/>
            <div style={{background:"#f8fafc",border:"1px solid #e5e7eb",borderRadius:10,padding:"14px 16px"}}>
              <div style={{fontSize:11,color:"#6b7280",marginBottom:12}}>
                Registra las causas potenciales por categoría. Cada causa puede alimentar el análisis de los 5 porqués.
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {RAMAS_ISHIKAWA.map(rama=>{
                  const color = {Método:"#1d4ed8",  "Mano de obra":"#166534",  Máquina:"#92400e", Material:"#5b21b6", Medición:"#0e7490", "Medio ambiente":"#b45309"}[rama]||"#374151";
                  const bgCol = {Método:"#eff6ff",  "Mano de obra":"#f0fdf4",  Máquina:"#fffbeb", Material:"#faf5ff", Medición:"#ecfeff", "Medio ambiente":"#fff7ed"}[rama]||"#f9fafb";
                  return(
                    <div key={rama} style={{background:bgCol,border:`1px solid ${color}33`,borderRadius:8,padding:"10px 12px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                        <span style={{fontSize:11,fontWeight:700,color,textTransform:"uppercase",letterSpacing:".05em"}}>🔷 {rama}</span>
                        <button onClick={()=>addCausaIsh(rama)} style={{fontSize:10,padding:"2px 8px",borderRadius:4,border:`1px solid ${color}55`,background:"#fff",color,cursor:"pointer",fontWeight:600}}>+ Añadir</button>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:5}}>
                        {(form.ishikawa[rama]||[]).map((causa,idx)=>(
                          <div key={idx} style={{display:"flex",gap:5,alignItems:"center"}}>
                            <input value={causa} onChange={e=>setCausaIsh(rama,idx,e.target.value)} style={{...FI,fontSize:12,padding:"5px 8px",flex:1}} placeholder={`Causa ${idx+1}…`}/>
                            <button onClick={()=>removeCausaIsh(rama,idx)} style={{fontSize:11,padding:"4px 7px",borderRadius:4,border:"1px solid #fca5a5",background:"#fef2f2",color:"#b91c1c",cursor:"pointer"}}>✕</button>
                          </div>
                        ))}
                        {(form.ishikawa[rama]||[]).length===0&&<div style={{fontSize:11,color:"#9ca3af",fontStyle:"italic"}}>Sin causas añadidas</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <SepNC label="Análisis 5 Porqués"/>
            <div style={{background:"#f8fafc",border:"1px solid #e5e7eb",borderRadius:10,padding:"14px 16px"}}>
              {todasCausasIsh.length>0?(
                <CampoNC label="Causa de partida (de Ishikawa)">
                  <select value={form.cinco_porques.causa_origen} onChange={e=>setForm(p=>({...p,cinco_porques:{...p.cinco_porques,causa_origen:e.target.value}}))} style={FI}>
                    <option value="">— Selecciona una causa del Ishikawa —</option>
                    {todasCausasIsh.map((c,i)=><option key={i} value={c.causa}>[{c.rama}] {c.causa}</option>)}
                  </select>
                </CampoNC>
              ):(
                <div style={{padding:"10px 12px",background:"#fffbeb",border:"0.5px solid #fde68a",borderRadius:7,fontSize:12,color:"#92400e",marginBottom:10}}>
                  ⚠ Añade primero causas en el Ishikawa para alimentar los 5 porqués
                </div>
              )}

              {form.cinco_porques.causa_origen&&(
                <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:8}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:4}}>Causa: <span style={{color:"#1d4ed8"}}>{form.cinco_porques.causa_origen}</span></div>
                  {[0,1,2,3,4].map(i=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"32px 1fr",gap:10,alignItems:"flex-start"}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:"#2563eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0,marginTop:2}}>¿{i+1}</div>
                      <div style={{display:"flex",flexDirection:"column",gap:3}}>
                        <label style={{fontSize:10,color:"#6b7280",fontWeight:600}}>¿Por qué {i===0?"ocurre la causa?":i===1?"ocurre lo anterior?":i===2?"sucede eso?":i===3?"se da esa situación?":"se llega a ese punto?"}</label>
                        <input value={form.cinco_porques.porques[i]||""} onChange={e=>setPorque(i,e.target.value)} style={FI} placeholder={`Porque…`}/>
                        {i<4&&form.cinco_porques.porques[i]&&<div style={{fontSize:10,color:"#9ca3af",paddingLeft:4}}>↓ lleva a preguntarse…</div>}
                      </div>
                    </div>
                  ))}
                  {form.cinco_porques.porques.some(Boolean)&&(
                    <div style={{marginTop:6}}>
                      <label style={{...SL,color:"#166534"}}>Causa raíz final identificada</label>
                      <textarea value={form.cinco_porques.causa_raiz_final} onChange={e=>setForm(p=>({...p,cinco_porques:{...p.cinco_porques,causa_raiz_final:e.target.value}}))} rows={2} style={{...FIA,borderColor:"#86efac",background:"#f0fdf4"}} placeholder="Conclusión: la causa raíz es…"/>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>)}

          {/* ── SECCIÓN ACCIONES ── */}
          {seccion==="acciones"&&(<>
            <div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>
              Añade todas las acciones necesarias. Cada tipo puede tener múltiples acciones independientes.
            </div>

            {TIPOS_ACC.map(tipo=>{
              const s=TIPO_ACC_STYLE[tipo];
              const accionesTipo=(form.acciones||[]).filter(a=>a.tipo===tipo);
              return(
                <div key={tipo} style={{background:s.bg,border:`1.5px solid ${s.bd}`,borderRadius:10,padding:"12px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div>
                      <span style={{fontSize:13,fontWeight:700,color:s.tx}}>{s.icon} Acciones {tipo}s</span>
                      <span style={{fontSize:10,color:s.tx,opacity:.7,marginLeft:8}}>{accionesTipo.length} acción{accionesTipo.length!==1?"es":""}</span>
                    </div>
                    <button onClick={()=>addAccion(tipo)} style={{fontSize:11,padding:"5px 12px",borderRadius:6,border:`1.5px solid ${s.bd}`,background:"#fff",color:s.tx,cursor:"pointer",fontWeight:700}}>+ Nueva acción {tipo.toLowerCase()}</button>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {accionesTipo.map(acc=>(
                      <div key={acc.id} style={{background:"#fff",border:`1px solid ${s.bd}`,borderRadius:8,padding:"10px 12px"}}>
                        <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
                          <textarea value={acc.descripcion} onChange={e=>updateAccion(acc.id,"descripcion",e.target.value)} rows={2} style={{...FIA,fontSize:12,flex:1}} placeholder={`Descripción de la acción ${tipo.toLowerCase()}…`}/>
                          <button onClick={()=>removeAccion(acc.id)} style={{fontSize:11,padding:"5px 8px",borderRadius:5,border:"1px solid #fca5a5",background:"#fef2f2",color:"#b91c1c",cursor:"pointer",flexShrink:0}}>🗑</button>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                          <div style={{display:"flex",flexDirection:"column",gap:3}}>
                            <label style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em"}}>Responsable</label>
                            <input value={acc.responsable} onChange={e=>updateAccion(acc.id,"responsable",e.target.value)} style={{...FI,fontSize:12,padding:"5px 8px"}} placeholder="Nombre…"/>
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:3}}>
                            <label style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em"}}>Fecha prevista cierre</label>
                            <input type="date" value={acc.fecha_prevista} onChange={e=>updateAccion(acc.id,"fecha_prevista",e.target.value)} style={{...FI,fontSize:12,padding:"5px 8px"}}/>
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:3}}>
                            <label style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em"}}>Estado</label>
                            <select value={acc.estado} onChange={e=>updateAccion(acc.id,"estado",e.target.value)} style={{...FI,fontSize:12,padding:"5px 8px",background:EST_ACC_STYLE[acc.estado]?.bg,color:EST_ACC_STYLE[acc.estado]?.tx,borderColor:EST_ACC_STYLE[acc.estado]?.bd}}>
                              {ESTADOS_ACC.map(e=><option key={e}>{e}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                    {accionesTipo.length===0&&(
                      <div style={{textAlign:"center",padding:"14px",color:s.tx,opacity:.5,fontSize:12,fontStyle:"italic"}}>Sin acciones {tipo.toLowerCase()}s todavía — pulsa "+ Nueva acción"</div>
                    )}
                  </div>
                </div>
              );
            })}
          </>)}

          {/* ── SECCIÓN 8D ── */}
          {seccion==="8d"&&form.tipo_proceso==="8D"&&(<>
            <div style={{background:"#eff6ff",border:"0.5px solid #93c5fd",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#1d4ed8",marginBottom:4}}>
              Las disciplinas 8D complementan el análisis Ishikawa y 5 Porqués. Las acciones se gestionan en la pestaña Acciones.
            </div>
            {[["d1","D1","Equipo de trabajo interdisciplinar"],["d2","D2","Descripción detallada del problema"],["d3","D3","Acciones de contención inmediata"],["d4","D4","Identificación de causas raíz"],["d5","D5","Selección y verificación de acciones correctivas"],["d6","D6","Implementación y validación de acciones correctivas"],["d7","D7","Acciones preventivas para evitar recurrencia"],["d8","D8","Reconocimiento del equipo y cierre"]].map(([k,d,desc])=>(
              <div key={k}>
                <label style={{...SL,color:"#1d4ed8"}}>{d}: {desc}</label>
                <textarea value={form[k]||""} onChange={ff(k)} rows={2} style={{...FIA,borderColor:"#93c5fd"}} placeholder={`${d} — ${desc}…`}/>
              </div>
            ))}
          </>)}
        </div>

        {/* Footer */}
        <div style={{padding:"12px 20px",borderTop:"1px solid #f3f4f6",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fafafa",flexShrink:0}}>
          <div style={{fontSize:11,color:"#9ca3af"}}>
            {form.tipo_proceso==="8D"?"📊 Modo 8D completo":"📋 Incidencia simple"} · {form.planta}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={onClose} style={{background:"transparent",border:"1px solid #d1d5db",color:"#374151",padding:"7px 16px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>Cancelar</button>
            <button onClick={()=>onGuardar(form)} disabled={!form.desc?.trim()} style={{background:form.desc?.trim()?"#2563eb":"#9ca3af",color:"#fff",border:"none",padding:"7px 20px",borderRadius:7,cursor:form.desc?.trim()?"pointer":"not-allowed",fontSize:12,fontWeight:700}}>
              {esNueva?"Crear NC":"Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GENERADOR DE PDF ─────────────────────────────────────────────
function generarPDF(nc) {
  const todasCausasIsh = RAMAS_ISHIKAWA.flatMap(r=>(nc.ishikawa?.[r]||[]).filter(Boolean).map(c=>({rama:r,causa:c})));
  const accionesInm = (nc.acciones||[]).filter(a=>a.tipo==="Inmediata");
  const accionesCorr = (nc.acciones||[]).filter(a=>a.tipo==="Correctiva");
  const accionesPrev = (nc.acciones||[]).filter(a=>a.tipo==="Preventiva");

  const estilo_badge = (est) => {
    const c = EST_ACC_STYLE[est]||{};
    return `background:${c.bg};color:${c.tx};border:1px solid ${c.bd};padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;`;
  };

  const renderAcciones = (lista, titulo, color) => lista.length===0?"":`
    <div style="margin-bottom:16px;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${color};margin-bottom:8px;">${titulo}</div>
      ${lista.map((a,i)=>`
        <div style="border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;margin-bottom:6px;">
          <div style="font-size:12px;margin-bottom:6px;">${a.descripcion||"—"}</div>
          <div style="display:flex;gap:12px;font-size:11px;color:#6b7280;">
            <span>👤 ${a.responsable||"—"}</span>
            <span>📅 ${a.fecha_prevista||"—"}</span>
            <span style="${estilo_badge(a.estado)}">${a.estado}</span>
          </div>
        </div>
      `).join("")}
    </div>`;

  const html = `<!DOCTYPE html><html><head>
  <meta charset="UTF-8"/>
  <title>NC ${nc.id} — RecubrimetalTech</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#111827;padding:24px;max-width:820px;margin:0 auto;}
    .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #2563eb;padding-bottom:12px;margin-bottom:20px;}
    .logo{font-size:18px;font-weight:700;color:#111827;}
    .logo span{color:#2563eb;}
    .nc-id{font-size:22px;font-weight:700;color:#2563eb;font-family:monospace;}
    .badge-tipo{padding:4px 14px;border-radius:6px;font-size:12px;font-weight:700;display:inline-block;}
    .seccion{margin-bottom:20px;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;}
    .seccion-title{background:#f8fafc;padding:9px 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#374151;border-bottom:1px solid #e5e7eb;}
    .seccion-body{padding:14px;}
    .grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
    .grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
    .campo{margin-bottom:8px;}
    .campo label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;display:block;margin-bottom:3px;}
    .campo .val{font-size:12px;color:#111827;}
    .rama{background:#f8fafc;border:1px solid #e5e7eb;border-radius:7px;padding:8px 10px;margin-bottom:6px;}
    .rama-title{font-size:10px;font-weight:700;color:#374151;text-transform:uppercase;margin-bottom:5px;}
    .causa-item{font-size:11px;color:#374151;padding:3px 0;border-bottom:0.5px solid #f3f4f6;}
    .porq-row{display:grid;grid-template-columns:32px 1fr;gap:8px;margin-bottom:6px;align-items:flex-start;}
    .porq-num{width:28px;height:28px;border-radius:50%;background:#2563eb;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;}
    .fotos{display:flex;gap:8px;flex-wrap:wrap;}
    .foto-img{width:120px;height:90px;object-fit:cover;border-radius:7px;border:1px solid #e5e7eb;}
    .footer{margin-top:24px;border-top:1px solid #e5e7eb;padding-top:10px;font-size:10px;color:#9ca3af;display:flex;justify-content:space-between;}
    @media print{body{padding:0;}@page{margin:1.5cm;}}
  </style>
  </head><body>

  <div class="header">
    <div>
      <div class="logo">Recubri<span>metal</span>Tech</div>
      <div style="font-size:11px;color:#6b7280;margin-top:2px;">ERP IATF 16949 · Módulo de Calidad</div>
    </div>
    <div style="text-align:right;">
      <div class="nc-id">${nc.id||"NC-????"}</div>
      <div style="margin-top:4px;">
        <span class="badge-tipo" style="background:${nc.tipo_proceso==="8D"?"#2563eb":"#374151"};color:#fff;">${nc.tipo_proceso==="8D"?"📊 8D":"📋 Incidencia"}</span>
        <span style="margin-left:8px;font-size:11px;color:#6b7280;">Planta ${nc.planta||"—"}</span>
      </div>
      <div style="font-size:10px;color:#9ca3af;margin-top:4px;">Generado: ${new Date().toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"})} ${new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})}</div>
    </div>
  </div>

  <!-- DATOS GENERALES -->
  <div class="seccion">
    <div class="seccion-title">Datos generales</div>
    <div class="seccion-body">
      <div class="grid3">
        <div class="campo"><label>Fecha</label><div class="val">${nc.f||"—"}</div></div>
        <div class="campo"><label>Gravedad</label><div class="val" style="font-weight:700;color:${nc.grav==="Crítica"?"#b91c1c":nc.grav==="Mayor"?"#92400e":"#374151"}">${nc.grav||"—"}</div></div>
        <div class="campo"><label>Estado</label><div class="val">${nc.est||"—"}</div></div>
        <div class="campo"><label>Cliente</label><div class="val">${nc.cli?cn(nc.cli):"—"}</div></div>
        <div class="campo"><label>Máquina</label><div class="val">${nc.maq||"—"}</div></div>
        <div class="campo"><label>OF</label><div class="val">${nc.of||"—"}</div></div>
        <div class="campo"><label>Proceso</label><div class="val">${nc.proc||"—"}</div></div>
        <div class="campo"><label>Equipo implicado</label><div class="val">${nc.equipo||"—"}</div></div>
        <div class="campo"><label>Responsable</label><div class="val">${nc.resp||"—"}</div></div>
      </div>
      ${(nc.num_reclamacion||nc.lote_cliente||nc.albaran)?`
      <div class="grid3" style="margin-top:10px;padding-top:10px;border-top:1px solid #f3f4f6;">
        <div class="campo"><label>Nº Reclamación cliente</label><div class="val">${nc.num_reclamacion||"—"}</div></div>
        <div class="campo"><label>Lote cliente</label><div class="val">${nc.lote_cliente||"—"}</div></div>
        <div class="campo"><label>Albarán</label><div class="val">${nc.albaran||"—"}</div></div>
      </div>`:""}
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid #f3f4f6;">
        <div class="campo"><label>Descripción del defecto</label><div class="val" style="line-height:1.6;">${nc.desc||"—"}</div></div>
      </div>
      ${(nc.kg_afectados||nc.coste_est)?`<div class="grid2" style="margin-top:8px;"><div class="campo"><label>Kg afectados</label><div class="val">${nc.kg_afectados||0} kg</div></div><div class="campo"><label>Coste estimado</label><div class="val">${nc.coste_est||0} €</div></div></div>`:""}
    </div>
  </div>

  ${(nc.fotos||[]).length>0?`
  <div class="seccion">
    <div class="seccion-title">Fotografías del defecto</div>
    <div class="seccion-body"><div class="fotos">${(nc.fotos||[]).map(f=>`<img src="${f.url}" class="foto-img" alt="${f.nombre}"/>`).join("")}</div></div>
  </div>`:""}

  <!-- CAUSA RAÍZ -->
  <div class="seccion">
    <div class="seccion-title">Análisis de causa raíz</div>
    <div class="seccion-body">
      ${nc.fecha_causa?`<div class="campo" style="margin-bottom:10px;"><label>Fecha del análisis</label><div class="val">${nc.fecha_causa}</div></div>`:""}
      <div class="campo"><label>Causa raíz identificada</label><div class="val" style="line-height:1.6;font-weight:500;">${nc.causa_raiz||"Pendiente de análisis"}</div></div>

      ${todasCausasIsh.length>0?`
      <div style="margin-top:14px;">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#374151;margin-bottom:8px;">Diagrama de Ishikawa</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${RAMAS_ISHIKAWA.filter(r=>(nc.ishikawa?.[r]||[]).some(Boolean)).map(r=>`
            <div class="rama">
              <div class="rama-title">${r}</div>
              ${(nc.ishikawa[r]||[]).filter(Boolean).map(c=>`<div class="causa-item">· ${c}</div>`).join("")}
            </div>
          `).join("")}
        </div>
      </div>`:""}

      ${nc.cinco_porques?.causa_origen?`
      <div style="margin-top:14px;">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#374151;margin-bottom:8px;">Análisis 5 Porqués</div>
        <div style="padding:8px 12px;background:#eff6ff;border-radius:7px;font-size:12px;color:#1d4ed8;margin-bottom:10px;">
          Causa de partida: <strong>${nc.cinco_porques.causa_origen}</strong>
        </div>
        ${(nc.cinco_porques.porques||[]).filter(Boolean).map((q,i)=>`
          <div class="porq-row">
            <div class="porq-num">¿${i+1}</div>
            <div style="font-size:12px;color:#374151;padding-top:6px;">${q}</div>
          </div>
        `).join("")}
        ${nc.cinco_porques.causa_raiz_final?`
        <div style="margin-top:10px;padding:10px 12px;background:#f0fdf4;border:1px solid #86efac;border-radius:7px;">
          <div style="font-size:10px;font-weight:700;color:#166534;text-transform:uppercase;margin-bottom:4px;">Causa raíz final</div>
          <div style="font-size:12px;color:#166534;">${nc.cinco_porques.causa_raiz_final}</div>
        </div>`:""}
      </div>`:""}
    </div>
  </div>

  <!-- ACCIONES -->
  ${(nc.acciones||[]).length>0?`
  <div class="seccion">
    <div class="seccion-title">Plan de acciones</div>
    <div class="seccion-body">
      ${renderAcciones(accionesInm,"⚡ Acciones Inmediatas","#c2410c")}
      ${renderAcciones(accionesCorr,"🔧 Acciones Correctivas","#1d4ed8")}
      ${renderAcciones(accionesPrev,"🛡 Acciones Preventivas","#166534")}
    </div>
  </div>`:""}

  ${nc.tipo_proceso==="8D"&&(nc.d1||nc.d2||nc.d3||nc.d4||nc.d5||nc.d6||nc.d7||nc.d8)?`
  <div class="seccion">
    <div class="seccion-title">Informe 8D</div>
    <div class="seccion-body">
      ${[["d1","D1: Equipo de trabajo"],["d2","D2: Descripción del problema"],["d3","D3: Acciones de contención"],["d4","D4: Causas raíz"],["d5","D5: Acciones correctivas"],["d6","D6: Validación"],["d7","D7: Acciones preventivas"],["d8","D8: Cierre"]].filter(([k])=>nc[k]).map(([k,l])=>`
        <div class="campo" style="margin-bottom:10px;"><label>${l}</label><div class="val" style="line-height:1.6;">${nc[k]}</div></div>
      `).join("")}
    </div>
  </div>`:""}

  <div class="footer">
    <span>RecubrimetalTech ERP · IATF 16949</span>
    <span>NC ${nc.id||"—"} · ${nc.tipo_proceso||"Incidencia"} · Planta ${nc.planta||"—"}</span>
    <span>Documento generado automáticamente</span>
  </div>
  </body></html>`;

  const win = window.open("","_blank","width=900,height=700");
  win.document.write(html);
  win.document.close();
  setTimeout(()=>win.print(),600);
}

// ─── TAB NO CONFORMIDADES — PRINCIPAL ────────────────────────────
function TabNCs({ ncs, setNcs }){
  const [sel,       setSel]     = useState(null);
  const [modal,     setModal]   = useState(false);
  const [confirm,   setConfirm] = useState(false);
  const [filtGrav,  setFiltGrav]= useState("Todas");
  const [filtEst,   setFiltEst] = useState("Todas");
  const [filtTipo,  setFiltTipo]= useState("Todas"); // Incidencia | 8D
  const [busca,     setBusca]   = useState("");

  const ncSel = ncs.find(n=>n.id===sel);

  let vis = ncs;
  if(filtGrav!=="Todas")  vis=vis.filter(n=>n.grav===filtGrav);
  if(filtEst!=="Todas")   vis=vis.filter(n=>n.est===filtEst);
  if(filtTipo!=="Todas")  vis=vis.filter(n=>n.tipo_proceso===filtTipo);
  if(busca.trim())        vis=vis.filter(n=>n.id?.toLowerCase().includes(busca.toLowerCase())||n.desc?.toLowerCase().includes(busca.toLowerCase())||n.resp?.toLowerCase().includes(busca.toLowerCase())||n.num_reclamacion?.toLowerCase().includes(busca.toLowerCase()));

  function abrirNueva(){
    setModal({nc:null});
  }
  function abrirEditar(){ if(ncSel) setModal({nc:ncSel}); }

  function guardar(form){
    const esNueva = !ncs.find(n=>n.id===form.id);
    let regFinal = {...form};
    if(esNueva){
      regFinal.id = `NC-${new Date().getFullYear()}-${String(ncs.length+1).padStart(3,"0")}`;
      regFinal.f  = new Date().toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit"});
      setNcs(p=>[regFinal,...p]);
      setSel(regFinal.id);
    } else {
      setNcs(p=>p.map(n=>n.id===form.id?regFinal:n));
    }
    setModal(false);
  }

  function eliminar(){ setNcs(p=>p.filter(n=>n.id!==sel)); setSel(null); setConfirm(false); }

  // KPIs
  const abiertas  = ncs.filter(n=>n.est!=="Cerrada").length;
  const externas  = ncs.filter(n=>n.origen==="Externo"&&n.est!=="Cerrada").length;
  const coste     = ncs.reduce((s,n)=>s+(n.coste_est||0),0);
  const ochos_d   = ncs.filter(n=>n.tipo_proceso==="8D").length;
  const acc_pend  = ncs.flatMap(n=>n.acciones||[]).filter(a=>a.estado!=="Cerrado").length;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:10}}>
        {[
          {l:"Abiertas",     v:abiertas, c:abiertas>2?"#b91c1c":undefined},
          {l:"Externas",     v:externas, c:externas>0?"#b91c1c":undefined},
          {l:"8D activos",   v:ochos_d,  c:ochos_d>0?"#1d4ed8":undefined},
          {l:"Acciones pend.",v:acc_pend,c:acc_pend>0?"#92400e":undefined},
          {l:"Tasa cierre",  v:`${ncs.length?Math.round(ncs.filter(n=>n.est==="Cerrada").length/ncs.length*100):100}%`,c:"#166534"},
          {l:"Coste no cal.", v:`${coste.toLocaleString()}€`,c:coste>1000?"#b91c1c":undefined},
        ].map(k=>(
          <div key={k.l} style={{background:"#f8fafc",border:"0.5px solid #e2e8f0",borderRadius:10,padding:"11px 14px"}}>
            <div style={{fontSize:10,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".05em",fontWeight:500,marginBottom:4}}>{k.l}</div>
            <div style={{fontSize:20,fontWeight:700,color:k.c||"#111827"}}>{k.v}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:12}}>
        {/* Lista */}
        <div style={{width:300,flexShrink:0,display:"flex",flexDirection:"column",gap:7}}>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar NC, responsable, reclamación…" style={{border:"1px solid #e5e7eb",borderRadius:7,padding:"7px 10px",fontSize:12,color:"#111827",background:"#fff",outline:"none"}}/>

          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {["Todas","Incidencia","8D"].map(t=>(
              <button key={t} onClick={()=>setFiltTipo(t)} style={{padding:"3px 9px",borderRadius:4,cursor:"pointer",fontSize:10.5,border:`0.5px solid ${filtTipo===t?"#2563eb":"#e5e7eb"}`,background:filtTipo===t?"#eff6ff":"#f9fafb",color:filtTipo===t?"#1d4ed8":"#6b7280",fontWeight:filtTipo===t?700:400}}>{t}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {["Todas","Menor","Mayor","Crítica"].map(g=>(
              <button key={g} onClick={()=>setFiltGrav(g)} style={{padding:"3px 9px",borderRadius:4,cursor:"pointer",fontSize:10.5,border:`0.5px solid ${filtGrav===g?"#2563eb":"#e5e7eb"}`,background:filtGrav===g?"#eff6ff":"#f9fafb",color:filtGrav===g?"#1d4ed8":"#6b7280",fontWeight:filtGrav===g?700:400}}>{g}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {["Todas","Abierta","En análisis","8D Abierto","Cerrada"].map(e=>(
              <button key={e} onClick={()=>setFiltEst(e)} style={{padding:"3px 9px",borderRadius:4,cursor:"pointer",fontSize:10.5,border:`0.5px solid ${filtEst===e?"#2563eb":"#e5e7eb"}`,background:filtEst===e?"#eff6ff":"#f9fafb",color:filtEst===e?"#1d4ed8":"#6b7280",fontWeight:filtEst===e?700:400}}>{e}</button>
            ))}
          </div>

          <button onClick={abrirNueva} style={{background:"#dc2626",color:"#fff",border:"none",padding:"7px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:700}}>+ Nueva NC</button>

          <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:520,overflowY:"auto"}}>
            {vis.map(n=>{
              const act=sel===n.id;
              const isRed=n.grav==="Mayor"||n.grav==="Crítica";
              const accp=( n.acciones||[]).filter(a=>a.estado!=="Cerrado").length;
              return(
                <div key={n.id} onClick={()=>setSel(n.id)} style={{padding:"10px 12px",borderRadius:9,cursor:"pointer",border:`1.5px solid ${act?"#2563eb":isRed?"#fca5a5":"#e5e7eb"}`,borderLeft:`3px solid ${isRed?"#ef4444":"#f59e0b"}`,background:act?"#eff6ff":"#fff"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                    <div style={{display:"flex",gap:5,alignItems:"center"}}>
                      <span style={{fontFamily:"monospace",fontWeight:700,fontSize:11,color:act?"#1d4ed8":isRed?"#b91c1c":"#92400e"}}>{n.id}</span>
                      <span style={{fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:3,background:n.tipo_proceso==="8D"?"#2563eb":"#374151",color:"#fff"}}>{n.tipo_proceso==="8D"?"8D":"INC"}</span>
                    </div>
                    <span style={{fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:3,...(PRIO_GRAV[n.grav]||{})}}>{n.grav}</span>
                  </div>
                  <div style={{fontSize:12,fontWeight:500,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.desc?.slice(0,42)||"—"}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:10,color:"#9ca3af"}}>{n.f} · {n.maq||"—"} · {n.planta||""}</span>
                    {accp>0&&<span style={{fontSize:9,fontWeight:700,background:"#fffbeb",color:"#92400e",border:"0.5px solid #fde68a",padding:"1px 5px",borderRadius:3}}>{accp} acc. pend.</span>}
                  </div>
                </div>
              );
            })}
            {vis.length===0&&<div style={{textAlign:"center",padding:20,color:"#9ca3af",fontSize:12}}>Sin resultados</div>}
          </div>
        </div>

        {/* Panel detalle */}
        {ncSel?(
          <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:10}}>
            {/* Toolbar */}
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",flexWrap:"wrap"}}>
              <button onClick={abrirEditar} style={{fontSize:11,padding:"5px 12px",borderRadius:6,border:"0.5px solid #93c5fd",background:"#eff6ff",color:"#1d4ed8",cursor:"pointer",fontWeight:600}}>✏ Editar NC</button>
              <button onClick={()=>generarPDF(ncSel)} style={{fontSize:11,padding:"5px 12px",borderRadius:6,border:"0.5px solid #86efac",background:"#f0fdf4",color:"#166534",cursor:"pointer",fontWeight:600}}>📄 Generar PDF</button>
              <button onClick={()=>setConfirm(true)} style={{fontSize:11,padding:"5px 12px",borderRadius:6,border:"0.5px solid #fca5a5",background:"#fef2f2",color:"#b91c1c",cursor:"pointer",fontWeight:600}}>🗑 Eliminar</button>
            </div>

            {/* Cabecera NC */}
            <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"14px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:17,fontWeight:700,color:"#111827"}}>{ncSel.id}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:ncSel.tipo_proceso==="8D"?"#2563eb":"#374151",color:"#fff"}}>{ncSel.tipo_proceso==="8D"?"📊 8D":"📋 Incidencia"}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,...(PRIO_GRAV[ncSel.grav]||{})}}>{ncSel.grav}</span>
                  </div>
                  <div style={{fontSize:11,color:"#6b7280"}}>{ncSel.tipo} · {ncSel.proc||"—"} · {ncSel.maq||"—"} · {ncSel.planta||""}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:5,background:"#f1f5f9",color:"#374151",border:"0.5px solid #e2e8f0"}}>{ncSel.est}</span>
                  {ncSel.num_reclamacion&&<div style={{fontSize:10,color:"#9ca3af",marginTop:3}}>Rec. {ncSel.num_reclamacion}</div>}
                </div>
              </div>
              <div style={{fontSize:13,fontWeight:500,padding:"8px 12px",background:"#f8fafc",borderRadius:8,marginBottom:10,lineHeight:1.5}}>{ncSel.desc}</div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:8}}>
                {[
                  ["Cliente",    ncSel.cli?cn(ncSel.cli):"—"],
                  ["OF",         ncSel.of||"—"],
                  ["Equipo",     ncSel.equipo||"—"],
                  ["Lote cli.",  ncSel.lote_cliente||"—"],
                  ["Albarán",    ncSel.albaran||"—"],
                  ["Planta",     ncSel.planta||"—"],
                  ["Responsable",ncSel.resp||"—"],
                  ["Kg afect.",  ncSel.kg_afectados?`${ncSel.kg_afectados} kg`:"—"],
                  ["Coste est.", ncSel.coste_est?`${ncSel.coste_est} €`:"—"],
                ].map(([k,v])=>(
                  <div key={k} style={{background:"#f8fafc",borderRadius:6,padding:"6px 9px"}}>
                    <div style={{fontSize:9,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".05em",marginBottom:2}}>{k}</div>
                    <div style={{fontSize:11.5,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fotos */}
            {(ncSel.fotos||[]).length>0&&(
              <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 14px"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>📷 Fotografías</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {ncSel.fotos.map((f,i)=><img key={i} src={f.url} alt={f.nombre} style={{width:90,height:70,objectFit:"cover",borderRadius:7,border:"1px solid #e5e7eb"}}/>)}
                </div>
              </div>
            )}

            {/* Resumen causa raíz */}
            {(ncSel.causa_raiz||ncSel.cinco_porques?.causa_raiz_final)&&(
              <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 14px"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>🔍 Causa raíz</div>
                {ncSel.causa_raiz&&<div style={{fontSize:13,color:"#374151",marginBottom:6}}>{ncSel.causa_raiz}</div>}
                {ncSel.cinco_porques?.causa_raiz_final&&(
                  <div style={{padding:"8px 10px",background:"#f0fdf4",border:"0.5px solid #86efac",borderRadius:7,fontSize:12,color:"#166534"}}>
                    <span style={{fontWeight:700}}>5 Porqués → </span>{ncSel.cinco_porques.causa_raiz_final}
                  </div>
                )}
                {/* Ishikawa resumen */}
                {RAMAS_ISHIKAWA.some(r=>(ncSel.ishikawa?.[r]||[]).some(Boolean))&&(
                  <div style={{marginTop:8}}>
                    <div style={{fontSize:10,fontWeight:600,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".05em",marginBottom:5}}>Ishikawa</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {RAMAS_ISHIKAWA.filter(r=>(ncSel.ishikawa?.[r]||[]).some(Boolean)).map(r=>(
                        <div key={r} style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:"#f1f5f9",color:"#374151",border:"0.5px solid #e2e8f0"}}>
                          <b>{r}</b>: {(ncSel.ishikawa[r]||[]).filter(Boolean).length} causa{(ncSel.ishikawa[r]||[]).filter(Boolean).length!==1?"s":""}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Resumen acciones */}
            {(ncSel.acciones||[]).length>0&&(
              <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 14px"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>⚡ Acciones ({ncSel.acciones.length})</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {TIPOS_ACC.map(tipo=>{
                    const lista=(ncSel.acciones||[]).filter(a=>a.tipo===tipo);
                    if(!lista.length)return null;
                    const s=TIPO_ACC_STYLE[tipo];
                    return(
                      <div key={tipo}>
                        <div style={{fontSize:10,fontWeight:700,color:s.tx,marginBottom:4}}>{s.icon} {tipo}s ({lista.length})</div>
                        {lista.map(a=>(
                          <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 10px",background:s.bg,borderRadius:6,border:`0.5px solid ${s.bd}`,marginBottom:3}}>
                            <span style={{fontSize:12,color:"#374151",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginRight:10}}>{a.descripcion||"—"}</span>
                            <div style={{display:"flex",gap:6,flexShrink:0}}>
                              {a.responsable&&<span style={{fontSize:10,color:"#6b7280"}}>👤 {a.responsable}</span>}
                              <span style={{fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:3,...(EST_ACC_STYLE[a.estado]||{})}}>{a.estado}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ):(
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10,color:"#9ca3af",fontSize:13}}>
            <span style={{fontSize:40}}>📋</span>
            <span>← Selecciona una no conformidad</span>
          </div>
        )}
      </div>

      {/* Modal edición */}
      {modal&&<ModalNC nc={modal.nc} ncs={ncs} onClose={()=>setModal(false)} onGuardar={guardar}/>}

      {/* Confirmar eliminación */}
      {confirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:700}}>
          <div style={{background:"#fff",borderRadius:12,padding:"24px 28px",maxWidth:400,width:"90%",boxShadow:"0 20px 40px rgba(0,0,0,.2)"}}>
            <div style={{fontWeight:700,fontSize:15,marginBottom:8}}>Confirmar eliminación</div>
            <div style={{fontSize:13,color:"#6b7280",marginBottom:20}}>¿Eliminar la NC "{ncSel?.id}"? Esta acción no se puede deshacer.</div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
              <button onClick={()=>setConfirm(false)} style={{background:"transparent",border:"1px solid #d1d5db",color:"#374151",padding:"7px 16px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>Cancelar</button>
              <button onClick={eliminar} style={{background:"#dc2626",color:"#fff",border:"none",padding:"7px 16px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── TAB: PLANES DE CONTROL ───────────────────────────────────────
function TabPlanes(){
  const [planes,setPlanes] = useState(PLANES_INIT);
  const [sel,setSel]       = useState(null);
  const [modal,setModal]   = useState(null);
  const [confirm,setConfirm]=useState(false);
  const [form,setForm]     = useState({});

  const plan = planes.find(p=>p.id===sel);
  const regs = plan ? REGISTROS_CTRL.filter(r=>r.plan===plan.id) : [];
  const nokRegs = regs.filter(r=>!r.ok);

  function abrirNueva(){
    setForm({id:`PC-${String(planes.length+1).padStart(3,"0")}`,ref:"",maquina:MAQUINAS[0].id,proceso:"",estado:"Activo",version:"v1",obs:"",controles:[]});
    setModal("form");
  }
  function abrirEditar(){ if(plan){ setForm({...plan,controles:plan.controles.map(c=>({...c}))}); setModal("form"); }}
  function guardar(){
    if(!form.ref?.trim()) return;
    if(!planes.find(p=>p.id===form.id)){ setPlanes(p=>[...p,form]); setSel(form.id); }
    else { setPlanes(p=>p.map(p2=>p2.id===form.id?form:p2)); }
    setModal(null);
  }
  function eliminar(){ setPlanes(p=>p.filter(p2=>p2.id!==sel)); setSel(null); setConfirm(false); }
  function addCtrl(){ setForm(p=>({...p,controles:[...p.controles,{param:"",metodo:"",freq:"",min:"",max:"",unidad:"",resp:""}]})); }
  function delCtrl(i){ setForm(p=>({...p,controles:p.controles.filter((_,j)=>j!==i)})); }
  function ffC(i,k){ return e=>setForm(p=>({...p,controles:p.controles.map((c,j)=>j===i?{...c,[k]:e.target.value}:c)})); }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.value}));

  return(
    <div style={{display:"flex",gap:14}}>
      <div style={{width:270,flexShrink:0,display:"flex",flexDirection:"column",gap:6}}>
        <button onClick={abrirNueva} style={{...ck("info"),padding:"6px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600}}>+ Nuevo plan</button>
        {planes.map(p=>{
          const act=sel===p.id;
          const regsP=REGISTROS_CTRL.filter(r=>r.plan===p.id);
          const nokP=regsP.filter(r=>!r.ok).length;
          return(
            <div key={p.id} onClick={()=>setSel(p.id)} style={{padding:"10px 13px",borderRadius:9,cursor:"pointer",border:`0.5px solid ${act?"var(--color-border-info)":nokP>0?"var(--color-border-danger)":"var(--color-border-tertiary)"}`,background:act?"var(--color-background-info)":"var(--color-background-primary)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                <span style={{...mo,fontSize:10.5,fontWeight:600,color:act?"var(--color-text-info)":"var(--color-text-secondary)"}}>{p.id}</span>
                <Bdg t={p.estado}/>
              </div>
              <div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{p.ref}</div>
              <div style={{fontSize:10.5,color:"var(--color-text-secondary)",marginBottom:4}}>{p.maquina} · {p.proceso} · {p.version}</div>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                <span style={{fontSize:10.5,color:"var(--color-text-secondary)"}}>{p.controles.length} controles</span>
                {nokP>0&&<span style={{fontSize:10,fontWeight:700,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5",padding:"1px 5px",borderRadius:3}}>⚠ {nokP} NOK</span>}
              </div>
            </div>
          );
        })}
      </div>

      {plan ? (
        <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button onClick={abrirEditar} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏ Editar</button>
            <button onClick={()=>setConfirm(true)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑 Eliminar</button>
          </div>
          {nokRegs.length>0&&<Al type="r">⚠ {nokRegs.length} control{nokRegs.length>1?"es":""} fuera de tolerancia en registros recientes</Al>}
          <Card title={`${plan.id} — ${plan.ref}`} right={<span style={{fontSize:11,...mo}}>{plan.version} · {plan.maquina} · {plan.proceso}</span>}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
                <thead><tr>{["Parámetro","Método","Frecuencia","Mín.","Máx.","Unidad","Resp."].map((c,i)=>(
                  <th key={i} style={{textAlign:"left",padding:"6px 10px",fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",color:"var(--color-text-secondary)",borderBottom:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-secondary)",whiteSpace:"nowrap"}}>{c}</th>
                ))}</tr></thead>
                <tbody>
                  {plan.controles.map((c,i)=>(
                    <tr key={i}>
                      <td style={{padding:"7px 10px",borderBottom:"0.5px solid var(--color-border-tertiary)",fontWeight:500}}>{c.param}</td>
                      <td style={{padding:"7px 10px",borderBottom:"0.5px solid var(--color-border-tertiary)",fontSize:11,color:"var(--color-text-secondary)"}}>{c.metodo}</td>
                      <td style={{padding:"7px 10px",borderBottom:"0.5px solid var(--color-border-tertiary)",...mo}}>{c.freq}</td>
                      <td style={{padding:"7px 10px",borderBottom:"0.5px solid var(--color-border-tertiary)",...mo}}>{c.min??"-"}</td>
                      <td style={{padding:"7px 10px",borderBottom:"0.5px solid var(--color-border-tertiary)",...mo}}>{c.max??"-"}</td>
                      <td style={{padding:"7px 10px",borderBottom:"0.5px solid var(--color-border-tertiary)",...mo}}>{c.unidad}</td>
                      <td style={{padding:"7px 10px",borderBottom:"0.5px solid var(--color-border-tertiary)",fontSize:11}}>{c.resp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card title="Registros recientes de control">
            <Tbl cols={["ID","Fecha","Hora","Parámetro","Valor","OF","Operario","Resultado"]}
              rows={regs.map(r=>[
                <span style={mo}>{r.id}</span>,
                <span style={{fontSize:11}}>{r.fecha}</span>,
                <span style={mo}>{r.hora}</span>,
                <span style={{fontSize:11.5}}>{r.param}</span>,
                <span style={{...mo,fontWeight:700,color:r.ok?"var(--color-text-success)":"var(--color-text-danger)"}}>{r.valor}</span>,
                <span style={mo}>{r.of}</span>,
                <span style={{fontSize:11}}>{r.op}</span>,
                <span style={{fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4,background:r.ok?"#f0fdf4":"#fef2f2",color:r.ok?"#166534":"#b91c1c",border:`0.5px solid ${r.ok?"#86efac":"#fca5a5"}`}}>{r.ok?"✓ OK":"✕ NOK"}</span>,
              ])}
            />
          </Card>
        </div>
      ):(
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--color-text-secondary)",fontSize:13}}>← Selecciona un plan de control</div>
      )}

      {modal==="form"&&(
        <Modal titulo={!planes.find(p=>p.id===form.id)?"Nuevo plan de control":"Editar plan de control"} subtitulo={form.ref} onClose={()=>setModal(null)} onGuardar={guardar} ancho={680}>
          <R3 c={<>
            <Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
            <Campo label="Referencia pieza" required><input value={form.ref||""} onChange={ff("ref")} style={MI} placeholder="Ej. CLIP MANETA RO"/></Campo>
            <Campo label="Versión"><input value={form.version||""} onChange={ff("version")} style={MI} placeholder="v1"/></Campo>
          </>}/>
          <R3 c={<>
            <Campo label="Máquina"><select value={form.maquina||""} onChange={ff("maquina")} style={MI}>{MAQUINAS.filter(m=>m.est!=="Inhabilitada").map(m=><option key={m.id} value={m.id}>{m.id}</option>)}</select></Campo>
            <Campo label="Proceso"><input value={form.proceso||""} onChange={ff("proceso")} style={MI} placeholder="Recubrimiento / Granallado…"/></Campo>
            <Campo label="Estado"><select value={form.estado||""} onChange={ff("estado")} style={MI}>{["Activo","Obsoleto","Borrador"].map(s=><option key={s}>{s}</option>)}</select></Campo>
          </>}/>
          <Campo label="Observaciones"><input value={form.obs||""} onChange={ff("obs")} style={MI}/></Campo>
          <Sep label="Controles de proceso"/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {form.controles?.map((c,i)=>(
              <div key={i} style={{background:"#f8fafc",borderRadius:8,padding:"10px 12px",border:"0.5px solid #e5e7eb",display:"flex",flexDirection:"column",gap:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                  <span style={{fontSize:11,fontWeight:600,color:"#6b7280"}}>Control #{i+1}</span>
                  <button onClick={()=>delCtrl(i)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5",padding:"2px 7px"}}>✕</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 1fr",gap:8}}>
                  <Campo label="Parámetro"><input value={c.param} onChange={ffC(i,"param")} style={MIS}/></Campo>
                  <Campo label="Método"><input value={c.metodo} onChange={ffC(i,"metodo")} style={MIS}/></Campo>
                  <Campo label="Frecuencia"><input value={c.freq} onChange={ffC(i,"freq")} style={MIS}/></Campo>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 2fr",gap:8}}>
                  <Campo label="Mín."><input value={c.min??""} onChange={ffC(i,"min")} style={MIS} type="number"/></Campo>
                  <Campo label="Máx."><input value={c.max??""} onChange={ffC(i,"max")} style={MIS} type="number"/></Campo>
                  <Campo label="Unidad"><input value={c.unidad} onChange={ffC(i,"unidad")} style={MIS} placeholder="μm / °C / Gt…"/></Campo>
                  <Campo label="Responsable"><input value={c.resp} onChange={ffC(i,"resp")} style={MIS} placeholder="Operario / Lab. / PLC…"/></Campo>
                </div>
              </div>
            ))}
            <button onClick={addCtrl} style={{...MBP,alignSelf:"flex-start",fontSize:11}}>+ Añadir control</button>
          </div>
        </Modal>
      )}
      {confirm&&<ModalConfirm texto={`¿Eliminar el plan "${plan?.id} — ${plan?.ref}"?`} onClose={()=>setConfirm(false)} onConfirmar={eliminar}/>}
    </div>
  );
}

// ─── TAB: PROVEEDORES ─────────────────────────────────────────────
function TabProveedores(){
  const [provs,setProvs] = useState(PROVEEDORES_INIT);
  const [sel,setSel]     = useState(null);
  const [modal,setModal] = useState(null);
  const [confirm,setConfirm]=useState(false);
  const [form,setForm]   = useState({});
  const [busca,setBusca] = useState("");

  const prov = provs.find(p=>p.id===sel);
  const vis  = provs.filter(p=>!busca||p.nombre.toLowerCase().includes(busca.toLowerCase())||p.tipo.toLowerCase().includes(busca.toLowerCase()));

  function abrirNueva(){
    setForm({id:`PROV-${String(provs.length+1).padStart(3,"0")}`,nombre:"",tipo:"Químicos",cif:"",contacto:"",tel:"",plazo:30,incidencias:0,plazo_ok:100,calidad_ok:100,bloqueado:false,nivel:"A",obs:""});
    setModal("form");
  }
  function abrirEditar(){ if(prov){ setForm({...prov}); setModal("form"); }}
  function guardar(){
    if(!form.nombre?.trim()) return;
    if(!provs.find(p=>p.id===form.id)){ setProvs(p=>[...p,form]); setSel(form.id); }
    else { setProvs(p=>p.map(p2=>p2.id===form.id?form:p2)); }
    setModal(null);
  }
  function eliminar(){ setProvs(p=>p.filter(p2=>p2.id!==sel)); setSel(null); setConfirm(false); }
  function toggleBloqueo(){ setProvs(p=>p.map(p2=>p2.id===sel?{...p2,bloqueado:!p2.bloqueado}:p2)); }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.type==="number"?parseFloat(e.target.value)||0:e.target.type==="checkbox"?e.target.checked:e.target.value}));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <KRow items={[
        {l:"Proveedores activos",v:provs.filter(p=>!p.bloqueado).length},
        {l:"Bloqueados",         v:provs.filter(p=>p.bloqueado).length,  c:"var(--color-text-danger)"},
        {l:"Nivel A",            v:provs.filter(p=>p.nivel==="A").length, c:"var(--color-text-success)"},
        {l:"Nivel C",            v:provs.filter(p=>p.nivel==="C").length, c:"var(--color-text-danger)"},
      ]}/>
      {provs.filter(p=>p.bloqueado).length>0&&(
        <Al type="r">⚠ {provs.filter(p=>p.bloqueado).length} proveedor{provs.filter(p=>p.bloqueado).length>1?"es":""} bloqueado{provs.filter(p=>p.bloqueado).length>1?"s":""} — revisar antes de emitir pedidos</Al>
      )}

      <div style={{display:"flex",gap:14}}>
        {/* Lista lateral */}
        <div style={{width:260,flexShrink:0,display:"flex",flexDirection:"column",gap:6}}>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar proveedor…" style={{...inp,padding:"7px 10px"}}/>
          <button onClick={abrirNueva} style={{...ck("success"),padding:"6px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600}}>+ Nuevo proveedor</button>
          <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:500,overflowY:"auto"}}>
            {vis.map(p=>{
              const act=sel===p.id;
              return(
                <div key={p.id} onClick={()=>setSel(p.id)} style={{padding:"9px 12px",borderRadius:8,cursor:"pointer",border:`0.5px solid ${act?"var(--color-border-info)":p.bloqueado?"#fca5a5":"var(--color-border-tertiary)"}`,background:act?"var(--color-background-info)":p.bloqueado?"#fef2f2":"var(--color-background-primary)",opacity:p.bloqueado?0.8:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{...mo,fontSize:10,fontWeight:600,color:act?"var(--color-text-info)":"var(--color-text-secondary)"}}>{p.id}</span>
                    <BdgNivel n={p.nivel}/>
                  </div>
                  <div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{p.nombre}</div>
                  <div style={{fontSize:10.5,color:"var(--color-text-secondary)"}}>{p.tipo}{p.bloqueado&&<span style={{marginLeft:6,color:"#b91c1c",fontWeight:700}}>⊘ Bloqueado</span>}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detalle */}
        {prov ? (
          <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button onClick={toggleBloqueo} style={{...MBS,background:prov.bloqueado?"#f0fdf4":"#fff7ed",color:prov.bloqueado?"#166534":"#92400e",border:`0.5px solid ${prov.bloqueado?"#86efac":"#fde68a"}`}}>{prov.bloqueado?"✓ Desbloquear":"⊘ Bloquear"}</button>
              <button onClick={abrirEditar} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏ Editar</button>
              <button onClick={()=>setConfirm(true)} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑 Eliminar</button>
            </div>
            {prov.bloqueado&&<Al type="r">⊘ Este proveedor está bloqueado — no emitir pedidos</Al>}
            <Card title={prov.nombre} right={<BdgNivel n={prov.nivel}/>}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8,padding:"12px 16px"}}>
                {[["Tipo",prov.tipo],["CIF",prov.cif],["Contacto",prov.contacto],["Teléfono",prov.tel],["Plazo pago",`${prov.plazo} días`],["Incidencias",prov.incidencias]].map(([k,v])=>(
                  <div key={k} style={{background:"var(--color-background-secondary)",borderRadius:6,padding:"7px 10px"}}>
                    <div style={{fontSize:9.5,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:2}}>{k}</div>
                    <div style={{fontSize:12,fontWeight:500}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{padding:"0 16px 12px",display:"flex",flexDirection:"column",gap:8}}>
                {[["Cumplimiento plazo",prov.plazo_ok,90,75],["Calidad suministro",prov.calidad_ok,95,85]].map(([l,v,ok,warn])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:11,width:150,flexShrink:0}}>{l}</span>
                    <div style={{flex:1,height:8,background:"var(--color-background-secondary)",borderRadius:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${v}%`,background:v>=ok?"#22c55e":v>=warn?"#f59e0b":"#ef4444",borderRadius:4}}/>
                    </div>
                    <span style={{...mo,fontSize:12,fontWeight:700,width:36,textAlign:"right",color:v>=ok?"#166534":v>=warn?"#92400e":"#b91c1c"}}>{v}%</span>
                  </div>
                ))}
                {prov.obs&&<div style={{padding:"7px 10px",background:"var(--color-background-warning)",border:"0.5px solid var(--color-border-warning)",borderRadius:7,fontSize:11.5,color:"var(--color-text-warning)"}}>{prov.obs}</div>}
              </div>
            </Card>
          </div>
        ):(
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--color-text-secondary)",fontSize:13}}>← Selecciona un proveedor</div>
        )}
      </div>

      {modal==="form"&&(
        <Modal titulo={!provs.find(p=>p.id===form.id)?"Nuevo proveedor":"Editar proveedor"} subtitulo={form.nombre} onClose={()=>setModal(null)} onGuardar={guardar} ancho={600}>
          <R2 c={<>
            <Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
            <Campo label="Nombre" required><input value={form.nombre||""} onChange={ff("nombre")} style={MI}/></Campo>
          </>}/>
          <R3 c={<>
            <Campo label="Tipo"><select value={form.tipo||""} onChange={ff("tipo")} style={MI}>{["Químicos","Granalla","Embalaje","Filtros","Recambios","Servicios","Otros"].map(t=><option key={t}>{t}</option>)}</select></Campo>
            <Campo label="CIF"><input value={form.cif||""} onChange={ff("cif")} style={MI} placeholder="B-08234512"/></Campo>
            <Campo label="Nivel"><select value={form.nivel||""} onChange={ff("nivel")} style={MI}>{["A","B","C"].map(n=><option key={n}>{n}</option>)}</select></Campo>
          </>}/>
          <R2 c={<>
            <Campo label="Contacto / Email"><input value={form.contacto||""} onChange={ff("contacto")} style={MI}/></Campo>
            <Campo label="Teléfono"><input value={form.tel||""} onChange={ff("tel")} style={MI}/></Campo>
          </>}/>
          <R3 c={<>
            <Campo label="Plazo pago (días)"><input type="number" value={form.plazo||0} onChange={ff("plazo")} style={MI}/></Campo>
            <Campo label="Cumplim. plazo (%)"><input type="number" min={0} max={100} value={form.plazo_ok||0} onChange={ff("plazo_ok")} style={MI}/></Campo>
            <Campo label="Calidad OK (%)"><input type="number" min={0} max={100} value={form.calidad_ok||0} onChange={ff("calidad_ok")} style={MI}/></Campo>
          </>}/>
          <R2 c={<>
            <Campo label="Incidencias"><input type="number" min={0} value={form.incidencias||0} onChange={ff("incidencias")} style={MI}/></Campo>
            <Campo label="Estado">
              <div style={{display:"flex",alignItems:"center",gap:10,marginTop:8}}>
                <input type="checkbox" id="blq" checked={!!form.bloqueado} onChange={ff("bloqueado")} style={{width:16,height:16}}/>
                <label htmlFor="blq" style={{fontSize:12,color:"#374151",cursor:"pointer"}}>Proveedor bloqueado</label>
              </div>
            </Campo>
          </>}/>
          <Campo label="Observaciones"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}}/></Campo>
        </Modal>
      )}
      {confirm&&<ModalConfirm texto={`¿Eliminar el proveedor "${prov?.nombre}"?`} onClose={()=>setConfirm(false)} onConfirmar={eliminar}/>}
    </div>
  );
}

// ─── TAB: AUDITORÍAS ─────────────────────────────────────────────
function TabAuditorias(){
  const [auds,setAuds]   = useState(AUDITORIAS_INIT);
  const [sel,setSel]     = useState(null);
  const [modal,setModal] = useState(null);
  const [confirm,setConfirm]=useState(false);
  const [form,setForm]   = useState({});

  const aud  = auds.find(a=>a.id===sel);
  const prox = auds.filter(a=>a.est==="Planificada"||a.est==="En curso");
  const hist = auds.filter(a=>a.est==="Cerrada");

  function abrirNueva(){
    setForm({id:`AUD-${new Date().getFullYear()}-${String(auds.length+1).padStart(2,"0")}`,tipo:"Interna IATF 16949",fecha:"",resp:"",alcance:"",est:"Planificada",hallazgos:0,obs:"",acciones:""});
    setModal("form");
  }
  function abrirEditar(a){ setForm({...a}); setModal("form"); }
  function guardar(){
    if(!form.tipo||!form.fecha) return;
    if(!auds.find(a=>a.id===form.id)){ setAuds(p=>[form,...p]); setSel(form.id); }
    else { setAuds(p=>p.map(a=>a.id===form.id?form:a)); }
    setModal(null);
  }
  function eliminar(){ setAuds(p=>p.filter(a=>a.id!==sel)); setSel(null); setConfirm(false); }
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.type==="number"?parseInt(e.target.value)||0:e.target.value}));

  const rowAud=(a)=>[
    <span style={mo}>{a.id}</span>,
    <span style={{fontSize:11.5,fontWeight:500}}>{a.tipo}</span>,
    <span style={mo}>{a.fecha}</span>,
    <span style={{fontSize:11}}>{a.resp}</span>,
    <span style={{fontSize:11,color:"var(--color-text-secondary)",display:"block",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.alcance}</span>,
    a.est==="Cerrada"&&<span style={{...mo,fontWeight:a.hallazgos>0?700:400,color:a.hallazgos>2?"var(--color-text-danger)":a.hallazgos>0?"var(--color-text-warning)":"var(--color-text-success)"}}>{a.hallazgos}</span>,
    <Bdg t={a.est}/>,
    <div style={{display:"flex",gap:5}}>
      <button onClick={e=>{e.stopPropagation();abrirEditar(a);}} style={{...MBS,background:"#eff6ff",color:"#1d4ed8",border:"0.5px solid #93c5fd"}}>✏</button>
      <button onClick={e=>{e.stopPropagation();setSel(a.id);setConfirm(true);}} style={{...MBS,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>🗑</button>
    </div>
  ];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <KRow items={[
        {l:"Próximas auditorías",v:prox.length},
        {l:"Cerradas",           v:hist.length,c:"var(--color-text-success)"},
        {l:"Hallazgos totales",  v:auds.reduce((s,a)=>s+a.hallazgos,0),c:"var(--color-text-warning)"},
      ]}/>
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button onClick={abrirNueva} style={{...ck("info"),padding:"6px 14px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600}}>+ Nueva auditoría</button>
      </div>

      {aud&&aud.obs&&(
        <div style={{background:"var(--color-background-warning)",border:"0.5px solid var(--color-border-warning)",borderRadius:8,padding:"8px 14px",fontSize:12,color:"var(--color-text-warning)"}}>
          📝 <strong>{aud.id}</strong>: {aud.obs}
          {aud.acciones&&<div style={{marginTop:4,color:"var(--color-text-success)",fontWeight:500}}>✓ {aud.acciones}</div>}
        </div>
      )}

      <div style={{fontSize:11,fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:".06em"}}>Próximas</div>
      <Card>
        <Tbl cols={["ID","Tipo","Fecha","Responsable","Alcance","","Estado","Acciones"]}
          rows={prox.map(a=>rowAud(a))}
        />
        {prox.length===0&&<div style={{textAlign:"center",color:"var(--color-text-secondary)",fontSize:12,padding:20}}>Sin auditorías planificadas</div>}
      </Card>

      <div style={{fontSize:11,fontWeight:600,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:".06em"}}>Historial</div>
      <Card>
        <Tbl cols={["ID","Tipo","Fecha","Responsable","Alcance","Hallazgos","Estado","Acciones"]}
          rows={hist.map(a=>rowAud(a))}
        />
      </Card>

      {modal==="form"&&(
        <Modal titulo={!auds.find(a=>a.id===form.id)?"Nueva auditoría":"Editar auditoría"} subtitulo={form.tipo} onClose={()=>setModal(null)} onGuardar={guardar}>
          <R2 c={<>
            <Campo label="ID"><input value={form.id||""} onChange={ff("id")} style={MI}/></Campo>
            <Campo label="Estado"><select value={form.est||""} onChange={ff("est")} style={MI}>{["Planificada","En curso","Cerrada"].map(s=><option key={s}>{s}</option>)}</select></Campo>
          </>}/>
          <R2 c={<>
            <Campo label="Tipo de auditoría" required>
              <select value={form.tipo||""} onChange={ff("tipo")} style={MI}>{["Interna IATF 16949","Interna ISO 9001","Cliente","Cert. IATF 16949","Cert. ISO 9001","Proveedor"].map(t=><option key={t}>{t}</option>)}</select>
            </Campo>
            <Campo label="Fecha" required><input type="date" value={form.fecha||""} onChange={ff("fecha")} style={MI}/></Campo>
          </>}/>
          <R2 c={<>
            <Campo label="Responsable"><input value={form.resp||""} onChange={ff("resp")} style={MI}/></Campo>
            <Campo label="Hallazgos"><input type="number" min={0} value={form.hallazgos||0} onChange={ff("hallazgos")} style={MI}/></Campo>
          </>}/>
          <Campo label="Alcance"><input value={form.alcance||""} onChange={ff("alcance")} style={MI} placeholder="Líneas, procesos o sistema completo…"/></Campo>
          <Campo label="Observaciones / Preparación"><textarea value={form.obs||""} onChange={ff("obs")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}} placeholder="Notas previas, check-list, agenda…"/></Campo>
          <Campo label="Acciones tomadas (resultado)"><textarea value={form.acciones||""} onChange={ff("acciones")} rows={2} style={{...MI,resize:"vertical",fontFamily:"inherit"}} placeholder="Correcciones, cierre de hallazgos…"/></Campo>
        </Modal>
      )}
      {confirm&&<ModalConfirm texto={`¿Eliminar la auditoría "${aud?.id}"?`} onClose={()=>setConfirm(false)} onConfirmar={eliminar}/>}
    </div>
  );
}


// ─── TAB: CONTROLES DE PROCESO ───────────────────────────────────
function TabControles({ registros, bloqueadas, setBloqueadas }){
  const [filtTipo, setFiltTipo] = useState("Todos");
  const [filtRes,  setFiltRes]  = useState("Todos");
  const [fotoModal, setFotoModal] = useState(null);

  const ctrlProd = (registros||[]).filter(r=>r.par==="Zirblast"||r.par==="Sulfato de cobre"||r.par==="Pintura");
  const tipos    = [...new Set(ctrlProd.map(r=>r.par))];
  let vis = ctrlProd;
  if(filtTipo!=="Todos") vis = vis.filter(r=>r.par===filtTipo);
  if(filtRes==="OK")     vis = vis.filter(r=>r.ok);
  if(filtRes==="NOK")    vis = vis.filter(r=>!r.ok);

  const nOK  = ctrlProd.filter(r=>r.ok).length;
  const nNOK = ctrlProd.filter(r=>!r.ok).length;
  const bloqs = bloqueadas||[];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>

      {/* OFs bloqueadas — banner prominente */}
      {bloqs.length>0&&(
        <div style={{background:"#fef2f2",border:"1.5px solid #fca5a5",borderRadius:10,padding:"14px 16px"}}>
          <div style={{fontWeight:700,fontSize:13,color:"#b91c1c",marginBottom:10}}>🔒 {bloqs.length} OF{bloqs.length>1?"s":""} bloqueada{bloqs.length>1?"s":""} — pendiente{bloqs.length>1?"s":""} de revisión</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {bloqs.map((b,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",borderRadius:8,padding:"10px 12px",border:"0.5px solid #fca5a5"}}>
                <div>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                    <span style={{fontFamily:"monospace",fontWeight:700,fontSize:13,color:"#b91c1c"}}>OF-{b.ofId}</span>
                    <span style={{fontSize:10,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5",padding:"1px 6px",borderRadius:4,fontWeight:600}}>NOK {b.tipo}</span>
                    <span style={{fontSize:10,color:"#9ca3af"}}>{b.maqId} · {b.fecha}</span>
                  </div>
                  {b.obs&&<div style={{fontSize:11.5,color:"#374151",fontStyle:"italic"}}>"{b.obs}"</div>}
                </div>
                <button
                  onClick={()=>setBloqueadas(p=>p.filter((_,j)=>j!==i))}
                  style={{background:"#166534",color:"#fff",border:"none",padding:"6px 14px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:700,flexShrink:0,marginLeft:12}}>
                  ✓ Desbloquear OF
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:10}}>
        {[
          {l:"Total controles",  v:ctrlProd.length,                                                 bg:"#f8fafc",c:"#374151",bd:"#e2e8f0"},
          {l:"Conformes ✓",      v:nOK,   bg:"#f0fdf4",c:"#166534",bd:"#86efac"},
          {l:"No conformes ✕",   v:nNOK,  bg:"#fef2f2",c:"#b91c1c",bd:"#fca5a5"},
          {l:"Zirblast",         v:ctrlProd.filter(r=>r.par==="Zirblast").length,         bg:"#eff6ff",c:"#1d4ed8",bd:"#93c5fd"},
          {l:"Sulfato de cobre", v:ctrlProd.filter(r=>r.par==="Sulfato de cobre").length, bg:"#faf5ff",c:"#5b21b6",bd:"#c4b5fd"},
          {l:"Pintura",          v:ctrlProd.filter(r=>r.par==="Pintura").length,          bg:"#fff7ed",c:"#c2410c",bd:"#fed7aa"},
        ].map(k=>(
          <div key={k.l} style={{background:k.bg,border:`0.5px solid ${k.bd}`,borderRadius:10,padding:"11px 14px"}}>
            <div style={{fontSize:10,color:k.c,textTransform:"uppercase",letterSpacing:".05em",fontWeight:500,marginBottom:4}}>{k.l}</div>
            <div style={{fontSize:20,fontWeight:700,color:k.c}}>{k.v}</div>
          </div>
        ))}
      </div>

      {ctrlProd.length===0&&(
        <div style={{textAlign:"center",padding:40,color:"#9ca3af",fontSize:13,background:"#f9fafb",borderRadius:10,border:"1px dashed #e5e7eb"}}>
          <div style={{fontSize:28,marginBottom:8}}>📋</div>
          Sin registros de control aún.<br/>
          <span style={{fontSize:12}}>Los controles registrados por los operarios en la Vista Operario aparecerán aquí.</span>
        </div>
      )}

      {ctrlProd.length>0&&(<>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
          {["Todos",...tipos].map(t=>(
            <button key={t} onClick={()=>setFiltTipo(t)} style={{padding:"4px 10px",borderRadius:5,cursor:"pointer",fontSize:11,border:`0.5px solid ${filtTipo===t?"#93c5fd":"#e5e7eb"}`,background:filtTipo===t?"#eff6ff":"#f8fafc",color:filtTipo===t?"#1d4ed8":"#6b7280",fontWeight:filtTipo===t?600:400}}>{t}</button>
          ))}
          <div style={{width:1,height:16,background:"#e5e7eb",margin:"0 2px"}}/>
          {["Todos","OK","NOK"].map(r=>(
            <button key={r} onClick={()=>setFiltRes(r)} style={{padding:"4px 10px",borderRadius:5,cursor:"pointer",fontSize:11,border:`0.5px solid ${filtRes===r?(r==="NOK"?"#fca5a5":"#86efac"):"#e5e7eb"}`,background:filtRes===r?(r==="NOK"?"#fef2f2":"#f0fdf4"):"#f8fafc",color:filtRes===r?(r==="NOK"?"#b91c1c":"#166534"):"#6b7280",fontWeight:filtRes===r?600:400}}>{r}</button>
          ))}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {vis.map((r,i)=>(
            <div key={r.id||i} style={{background:r.ok?"#f0fdf4":"#fef2f2",border:`1px solid ${r.ok?"#86efac":"#fca5a5"}`,borderRadius:10,padding:"12px 14px",display:"grid",gridTemplateColumns:"auto 1fr auto",gap:12,alignItems:"start"}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:r.ok?"#22c55e":"#ef4444",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#fff",fontWeight:700,flexShrink:0}}>
                {r.ok?"✓":"✕"}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:3}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontWeight:700,fontSize:13,color:r.ok?"#166534":"#b91c1c"}}>{r.par}</span>
                  <span style={{fontFamily:"monospace",fontSize:11,background:"rgba(0,0,0,.06)",padding:"1px 6px",borderRadius:4,color:"#374151"}}>{r.maq}</span>
                  {r.of&&<span style={{fontFamily:"monospace",fontSize:11,color:"#6b7280"}}>{r.of}</span>}
                </div>
                {r.val&&r.val!=="OK"&&r.val!=="NOK"&&<div style={{fontSize:12,color:"#374151"}}>Valor: <strong>{r.val}</strong></div>}
                {r.cliente&&<div style={{fontSize:11,color:"#6b7280"}}>{r.cliente}</div>}
                {r.obs&&<div style={{fontSize:11.5,color:"#374151",fontStyle:"italic"}}>"{r.obs}"</div>}
                <div style={{fontSize:10,color:"#9ca3af"}}>{r.fecha||""}{r.ts?` · ${r.ts}`:""}</div>
              </div>
              <div style={{flexShrink:0}}>
                {r.fotoUrl?(
                  <img src={r.fotoUrl} alt="ctrl" onClick={()=>setFotoModal(r.fotoUrl)}
                    style={{width:64,height:64,objectFit:"cover",borderRadius:7,border:"1px solid #e5e7eb",cursor:"pointer"}}/>
                ):(
                  <div style={{width:64,height:64,borderRadius:7,border:"1px dashed #d1d5db",display:"flex",alignItems:"center",justifyContent:"center",color:"#d1d5db",fontSize:22}}>📷</div>
                )}
              </div>
            </div>
          ))}
          {vis.length===0&&<div style={{textAlign:"center",padding:20,color:"#9ca3af",fontSize:12}}>Sin registros con este filtro</div>}
        </div>
      </>)}

      {fotoModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:700}}
          onClick={()=>setFotoModal(null)}>
          <img src={fotoModal} alt="foto" style={{maxWidth:"90vw",maxHeight:"88vh",borderRadius:12}}/>
        </div>
      )}
    </div>
  );
}
// ═══════════════════════════════════════════════════════════════════
// TAB: RETRABAJOS
// ═══════════════════════════════════════════════════════════════════
const TIPOS_RETRABAJO   = ["Dimensional","Superficial","Pintura / acabado","Ensamblaje","Limpieza","Otro"];
const CAUSAS_RETRABAJO  = ["Error operario","Defecto material","Parámetro proceso","Utillaje","Máquina","Diseño","Proveedor","Otro"];
const ESTADOS_RT        = ["Pendiente","En proceso","Finalizado","Rechazado"];
const RESULTADOS_RT     = ["Conforme","No conforme","Pendiente verificación"];
const OPERARIOS_RT      = ["C. Font","J. Pérez","D. Gil","F. Cano","A. López","Sin asignar"];

const EST_RT = {
  "Pendiente": { bg:"#fffbeb", tx:"#92400e", bd:"#fde68a", icon:"⏳" },
  "En proceso":{ bg:"#eff6ff", tx:"#1d4ed8", bd:"#93c5fd", icon:"⚙"  },
  "Finalizado":{ bg:"#f0fdf4", tx:"#166534", bd:"#86efac", icon:"✓"  },
  "Rechazado": { bg:"#fef2f2", tx:"#b91c1c", bd:"#fca5a5", icon:"✕"  },
};
const RES_RT = {
  "Conforme":               { bg:"#f0fdf4", tx:"#166534", bd:"#86efac" },
  "No conforme":            { bg:"#fef2f2", tx:"#b91c1c", bd:"#fca5a5" },
  "Pendiente verificación": { bg:"#fffbeb", tx:"#92400e", bd:"#fde68a" },
};

const RETRABAJOS_INIT = [
  { id:"RT-2026-001", f:"10/03", planta:"Esparreguera", cli:58,  of:"OF-2598", maq:"TWIN44", tipo:"Superficial",      causa:"Parámetro proceso", desc:"Capa de recubrimiento fuera de tolerancia — repasar 320 piezas", kg_afectados:280, uds_afectadas:320, est:"Finalizado",  resultado:"Conforme",               operario:"C. Font",    resp:"J. García",  t_estimado:4, t_real:4.5, coste_mano_obra:180, coste_material:40,  obs:"Verificado espesor OK", fotos:[], historial:[{ts:Date.now()-7*86400000,accion:"Retrabajo creado",usuario:"J. García",estado:"Pendiente"},{ts:Date.now()-5*86400000,accion:"Finalizado — Conforme",usuario:"J. García",estado:"Finalizado"}] },
  { id:"RT-2026-002", f:"12/03", planta:"Esparreguera", cli:102, of:"OF-2591", maq:"MN-01",  tipo:"Dimensional",       causa:"Utillaje",          desc:"Rebaba en zona roscada — limpieza y verificación 100%",           kg_afectados:150, uds_afectadas:200, est:"En proceso",  resultado:"Pendiente verificación",  operario:"J. Pérez",   resp:"M. Torres", t_estimado:3, t_real:0,   coste_mano_obra:90,  coste_material:0,   obs:"",                      fotos:[], historial:[{ts:Date.now()-5*86400000,accion:"Retrabajo creado",usuario:"M. Torres",estado:"Pendiente"},{ts:Date.now()-4*86400000,accion:"Asignado a J. Pérez",usuario:"M. Torres",estado:"En proceso"}] },
  { id:"RT-2026-003", f:"14/03", planta:"Esparreguera", cli:9,   of:"OF-2595", maq:"GR-01",  tipo:"Pintura / acabado", causa:"Defecto material",  desc:"Manchas en acabado superficial — relacado parcial",               kg_afectados:320, uds_afectadas:450, est:"Pendiente",   resultado:"Pendiente verificación",  operario:"Sin asignar",resp:"A. Martín", t_estimado:6, t_real:0,   coste_mano_obra:0,   coste_material:120, obs:"Esperando cabina",      fotos:[], historial:[{ts:Date.now()-3*86400000,accion:"Retrabajo creado",usuario:"A. Martín",estado:"Pendiente"}] },
  { id:"RT-2026-004", f:"15/03", planta:"Esparreguera", cli:458, of:"OF-2604", maq:"DC02",   tipo:"Limpieza",          causa:"Error operario",    desc:"Contaminación por aceite — lavado y secado completo",              kg_afectados:480, uds_afectadas:600, est:"Rechazado",   resultado:"No conforme",             operario:"D. Gil",     resp:"P. Ramos",  t_estimado:2, t_real:2.5, coste_mano_obra:100, coste_material:30,  obs:"Piezas irrecuperables", fotos:[], historial:[{ts:Date.now()-6*86400000,accion:"Retrabajo creado",usuario:"P. Ramos",estado:"Pendiente"},{ts:Date.now()-4*86400000,accion:"Rechazado — irrecuperable",usuario:"P. Ramos",estado:"Rechazado"}] },
];

function ModalRetrabajo({ rt, rts, onClose, onGuardar }){
  const esNuevo=!rt||!rts.find(r=>r.id===rt.id);
  const [form,setForm]=useState(rt||{tipo:"Superficial",causa:"Parámetro proceso",est:"Pendiente",resultado:"Pendiente verificación",planta:"Esparreguera",cli:"",of:"",maq:"",desc:"",obs:"",kg_afectados:0,uds_afectadas:0,t_estimado:0,t_real:0,coste_mano_obra:0,coste_material:0,operario:"Sin asignar",resp:"",fotos:[]});
  const ff=k=>e=>setForm(p=>({...p,[k]:e.target.type==="number"?parseFloat(e.target.value)||0:e.target.value}));
  function addFoto(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setForm(p=>({...p,fotos:[...(p.fotos||[]),{url:ev.target.result,nombre:f.name}]}));r.readAsDataURL(f);}
  function removeFoto(i){setForm(p=>({...p,fotos:p.fotos.filter((_,j)=>j!==i)}));}
  const canSave=form.desc?.trim()&&form.of?.trim();
  const FI2={border:"1.5px solid #d1d5db",borderRadius:8,padding:"8px 11px",fontSize:13,color:"#111827",background:"#fff",outline:"none",width:"100%",boxSizing:"border-box"};
  const FIA2={...FI2,resize:"vertical",fontFamily:"inherit"};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,padding:16}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:14,width:680,maxWidth:"98%",maxHeight:"94vh",display:"flex",flexDirection:"column",boxShadow:"0 25px 60px rgba(0,0,0,.3)",overflow:"hidden"}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid #f3f4f6",background:"#fafafa",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexShrink:0}}>
          <div><div style={{fontWeight:700,fontSize:15,color:"#111827"}}>{esNuevo?"Nuevo Retrabajo":"Editar — "+rt?.id}</div><div style={{fontSize:12,color:"#6b7280",marginTop:2}}>RecubrimetalTech · Calidad · Retrabajos</div></div>
          <button onClick={onClose} style={{background:"#f3f4f6",border:"none",cursor:"pointer",width:30,height:30,borderRadius:"50%",fontSize:16,color:"#6b7280",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"18px 20px",display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
            <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>Tipo *</label><select value={form.tipo} onChange={ff("tipo")} style={FI2}>{TIPOS_RETRABAJO.map(t=><option key={t}>{t}</option>)}</select></div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>Causa</label><select value={form.causa} onChange={ff("causa")} style={FI2}>{CAUSAS_RETRABAJO.map(c=><option key={c}>{c}</option>)}</select></div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>Planta</label><select value={form.planta} onChange={ff("planta")} style={FI2}>{["Esparreguera","Vitoria"].map(p=><option key={p}>{p}</option>)}</select></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>Cliente</label><select value={form.cli} onChange={e=>setForm(p=>({...p,cli:parseInt(e.target.value)||e.target.value}))} style={FI2}><option value="">— Seleccionar —</option>{CLIENTES.map(c=><option key={c.id} value={c.id}>{c.n}</option>)}</select></div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>Máquina</label><select value={form.maq} onChange={ff("maq")} style={FI2}><option value="">— Seleccionar —</option>{MAQUINAS.filter(m=>m.est!=="Inhabilitada").map(m=><option key={m.id}>{m.id}</option>)}</select></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
            <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>OF *</label><input value={form.of} onChange={ff("of")} style={FI2} placeholder="OF-2610"/></div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>Kg afectados</label><input type="number" value={form.kg_afectados} onChange={ff("kg_afectados")} style={FI2}/></div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>Uds afectadas</label><input type="number" value={form.uds_afectadas} onChange={ff("uds_afectadas")} style={FI2}/></div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>Descripción del retrabajo *</label><textarea value={form.desc} onChange={ff("desc")} rows={3} style={FIA2} placeholder="Describe qué hay que retrabajar y cómo…"/></div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>Observaciones</label><textarea value={form.obs} onChange={ff("obs")} rows={2} style={FIA2} placeholder="Notas adicionales…"/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>Operario</label><select value={form.operario} onChange={ff("operario")} style={FI2}>{OPERARIOS_RT.map(o=><option key={o}>{o}</option>)}</select></div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>Responsable</label><input value={form.resp} onChange={ff("resp")} style={FI2} placeholder="Jefe de sección…"/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:14}}>
            <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>T. estimado (h)</label><input type="number" value={form.t_estimado} onChange={ff("t_estimado")} style={FI2} step="0.5"/></div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>T. real (h)</label><input type="number" value={form.t_real} onChange={ff("t_real")} style={FI2} step="0.5"/></div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>Coste M.O. (€)</label><input type="number" value={form.coste_mano_obra} onChange={ff("coste_mano_obra")} style={FI2}/></div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>Coste material (€)</label><input type="number" value={form.coste_material} onChange={ff("coste_material")} style={FI2}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>Estado</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{ESTADOS_RT.map(s=>{const st=EST_RT[s];return(<button key={s} onClick={()=>setForm(p=>({...p,est:s}))} style={{flex:1,padding:"7px 4px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:700,border:`2px solid ${form.est===s?st.bd:"#e5e7eb"}`,background:form.est===s?st.bg:"#fff",color:form.est===s?st.tx:"#9ca3af",whiteSpace:"nowrap"}}>{st.icon} {s}</button>);})}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:11,fontWeight:600,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,display:"block"}}>Resultado</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{RESULTADOS_RT.map(r=>{const rs=RES_RT[r];return(<button key={r} onClick={()=>setForm(p=>({...p,resultado:r}))} style={{flex:1,padding:"7px 4px",borderRadius:7,cursor:"pointer",fontSize:10,fontWeight:700,border:`2px solid ${form.resultado===r?rs.bd:"#e5e7eb"}`,background:form.resultado===r?rs.bg:"#fff",color:form.resultado===r?rs.tx:"#9ca3af"}}>{r}</button>);})}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-start"}}>
            {(form.fotos||[]).map((f,i)=>(<div key={i} style={{position:"relative",width:100,height:100}}><img src={f.url} alt={f.nombre} style={{width:100,height:100,objectFit:"cover",borderRadius:8,border:"1px solid #e5e7eb"}}/><button onClick={()=>removeFoto(i)} style={{position:"absolute",top:3,right:3,background:"rgba(0,0,0,.55)",border:"none",color:"#fff",borderRadius:"50%",width:20,height:20,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>))}
            <label style={{width:100,height:100,border:"2px dashed #d1d5db",borderRadius:8,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#f9fafb",gap:4}}><input type="file" accept="image/*" onChange={addFoto} style={{display:"none"}}/><span style={{fontSize:24,color:"#9ca3af"}}>📷</span><span style={{fontSize:10,color:"#9ca3af",textAlign:"center"}}>Añadir foto</span></label>
          </div>
        </div>
        <div style={{padding:"12px 20px",borderTop:"1px solid #f3f4f6",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fafafa",flexShrink:0}}>
          <div style={{fontSize:11,color:"#9ca3af"}}>{form.planta} · {form.tipo}</div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={onClose} style={{background:"transparent",border:"1px solid #d1d5db",color:"#374151",padding:"7px 16px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>Cancelar</button>
            <button onClick={()=>onGuardar(form)} disabled={!canSave} style={{background:canSave?"#2563eb":"#9ca3af",color:"#fff",border:"none",padding:"7px 20px",borderRadius:7,cursor:canSave?"pointer":"not-allowed",fontSize:12,fontWeight:700}}>{esNuevo?"Crear retrabajo":"Guardar cambios"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabRetrabajos(){
  const [rts,setRts]=useState(RETRABAJOS_INIT);
  const [sel,setSel]=useState(null);
  const [modal,setModal]=useState(false);
  const [confirm,setConfirm]=useState(false);
  const [filtEst,setFiltEst]=useState("Todos");
  const [filtTipo,setFiltTipo]=useState("Todos");
  const [busca,setBusca]=useState("");
  const [fotoModal,setFotoModal]=useState(null);
  const rtSel=rts.find(r=>r.id===sel);
  const pendientes=rts.filter(r=>r.est==="Pendiente").length;
  const costeTotal=rts.reduce((s,r)=>s+(r.coste_mano_obra||0)+(r.coste_material||0),0);
  const conformes=rts.filter(r=>r.resultado==="Conforme").length;
  const tasaConf=rts.length>0?Math.round((conformes/rts.length)*100):0;
  let vis=rts;
  if(filtEst!=="Todos")vis=vis.filter(r=>r.est===filtEst);
  if(filtTipo!=="Todos")vis=vis.filter(r=>r.tipo===filtTipo);
  if(busca.trim())vis=vis.filter(r=>r.id?.toLowerCase().includes(busca.toLowerCase())||r.desc?.toLowerCase().includes(busca.toLowerCase())||r.of?.toLowerCase().includes(busca.toLowerCase())||r.operario?.toLowerCase().includes(busca.toLowerCase()));
  function guardar(form){
    const esNuevo=!rts.find(r=>r.id===form.id);
    if(esNuevo){const ahora=new Date();const nuevo={...form,id:`RT-${ahora.getFullYear()}-${String(rts.length+1).padStart(3,"0")}`,f:ahora.toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit"}),historial:[{ts:ahora.getTime(),accion:"Retrabajo creado",usuario:form.resp||"Sistema",estado:"Pendiente"}]};setRts(p=>[nuevo,...p]);setSel(nuevo.id);}
    else{setRts(p=>p.map(r=>r.id===form.id?form:r));}
    setModal(false);
  }
  function eliminar(){setRts(p=>p.filter(r=>r.id!==sel));setSel(null);setConfirm(false);}
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:10}}>
        {[{l:"Pendientes",v:pendientes,c:pendientes>0?"#92400e":undefined},{l:"En proceso",v:rts.filter(r=>r.est==="En proceso").length,c:"#1d4ed8"},{l:"Finalizados",v:rts.filter(r=>r.est==="Finalizado").length,c:"#166534"},{l:"Rechazados",v:rts.filter(r=>r.est==="Rechazado").length,c:"#b91c1c"},{l:"Tasa conform.",v:`${tasaConf}%`,c:tasaConf>=80?"#166534":"#b91c1c"},{l:"Coste total",v:`${costeTotal.toLocaleString()} €`,c:costeTotal>500?"#b91c1c":undefined}].map(k=>(<div key={k.l} style={{background:"#f8fafc",border:"0.5px solid #e2e8f0",borderRadius:10,padding:"11px 14px"}}><div style={{fontSize:10,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".05em",fontWeight:500,marginBottom:4}}>{k.l}</div><div style={{fontSize:20,fontWeight:700,color:k.c||"#111827"}}>{k.v}</div></div>))}
      </div>
      {pendientes>0&&<div style={{background:"#fffbeb",border:"0.5px solid #fde68a",borderRadius:8,padding:"8px 14px",fontSize:12,color:"#92400e"}}>⏳ {pendientes} retrabajo{pendientes>1?"s":""} pendiente{pendientes>1?"s":""} de asignar operario</div>}
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar RT, OF, operario…" style={{border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-secondary)",color:"var(--color-text-primary)",padding:"7px 10px",borderRadius:6,fontSize:12,outline:"none",maxWidth:220}}/>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{["Todos",...ESTADOS_RT].map(e=>{const s=EST_RT[e]||{};return(<button key={e} onClick={()=>setFiltEst(e)} style={{padding:"4px 10px",borderRadius:5,cursor:"pointer",fontSize:11,border:`0.5px solid ${filtEst===e?(s.bd||"#93c5fd"):"#e5e7eb"}`,background:filtEst===e?(s.bg||"#eff6ff"):"#f9fafb",color:filtEst===e?(s.tx||"#1d4ed8"):"#6b7280",fontWeight:filtEst===e?600:400}}>{s.icon||""} {e}</button>);})}</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{["Todos",...TIPOS_RETRABAJO].map(t=>(<button key={t} onClick={()=>setFiltTipo(t)} style={{padding:"4px 10px",borderRadius:5,cursor:"pointer",fontSize:11,border:`0.5px solid ${filtTipo===t?"#a78bfa":"#e5e7eb"}`,background:filtTipo===t?"#faf5ff":"#f9fafb",color:filtTipo===t?"#5b21b6":"#6b7280",fontWeight:filtTipo===t?600:400}}>{t}</button>))}</div>
        <button onClick={()=>setModal({rt:null})} style={{marginLeft:"auto",background:"#2563eb",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600,padding:"7px 14px"}}>+ Nuevo retrabajo</button>
      </div>
      <div style={{display:"flex",gap:14}}>
        <div style={{width:300,flexShrink:0,display:"flex",flexDirection:"column",gap:5,maxHeight:600,overflowY:"auto"}}>
          {vis.map(r=>{const act=sel===r.id;const st=EST_RT[r.est]||EST_RT.Pendiente;return(<div key={r.id} onClick={()=>setSel(r.id)} style={{padding:"10px 12px",borderRadius:9,cursor:"pointer",border:`1.5px solid ${act?"#2563eb":st.bd}`,borderLeft:`3px solid ${st.tx}`,background:act?"#eff6ff":"#fff"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}><span style={{fontFamily:"monospace",fontWeight:700,fontSize:11,color:act?"#1d4ed8":st.tx}}>{r.id}</span><span style={{fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:3,background:st.bg,color:st.tx,border:`0.5px solid ${st.bd}`}}>{st.icon} {r.est}</span></div><div style={{fontSize:12,fontWeight:500,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.desc?.slice(0,45)||"—"}</div><div style={{fontSize:10,color:"#9ca3af",display:"flex",gap:5}}><span>{r.f}</span><span>·</span><span>{r.tipo}</span><span>·</span><span>{r.maq||"—"}</span></div>{(r.coste_mano_obra+r.coste_material)>0&&(<div style={{fontSize:10,color:"#6b7280",marginTop:2}}>💶 {(r.coste_mano_obra+r.coste_material).toLocaleString()} €</div>)}</div>);})}
          {vis.length===0&&<div style={{textAlign:"center",padding:20,color:"#9ca3af",fontSize:12}}>Sin resultados</div>}
        </div>
        {rtSel?(
          <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button onClick={()=>setModal({rt:rtSel})} style={{fontSize:11,padding:"5px 12px",borderRadius:6,border:"0.5px solid #93c5fd",background:"#eff6ff",color:"#1d4ed8",cursor:"pointer",fontWeight:600}}>✏ Editar</button>
              <button onClick={()=>setConfirm(true)} style={{fontSize:11,padding:"5px 12px",borderRadius:6,border:"0.5px solid #fca5a5",background:"#fef2f2",color:"#b91c1c",cursor:"pointer",fontWeight:600}}>🗑 Eliminar</button>
            </div>
            <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"14px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div><div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}><span style={{fontSize:17,fontWeight:700,color:"#111827"}}>{rtSel.id}</span>{(()=>{const st=EST_RT[rtSel.est]||EST_RT.Pendiente;const rs=RES_RT[rtSel.resultado]||{};return(<><span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:st.bg,color:st.tx,border:`0.5px solid ${st.bd}`}}>{st.icon} {rtSel.est}</span><span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:rs.bg,color:rs.tx,border:`0.5px solid ${rs.bd}`}}>{rtSel.resultado}</span></>);})()}</div><div style={{fontSize:11,color:"#6b7280"}}>{rtSel.tipo} · {rtSel.causa} · {rtSel.maq||"—"} · {rtSel.planta}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontFamily:"monospace",fontSize:12,fontWeight:700}}>{rtSel.of}</div><div style={{fontSize:10,color:"#9ca3af"}}>{rtSel.f}</div></div>
              </div>
              <div style={{fontSize:13,padding:"8px 12px",background:"#f8fafc",borderRadius:8,marginBottom:10,lineHeight:1.5}}>{rtSel.desc}</div>
              {rtSel.obs&&<div style={{fontSize:12,padding:"7px 10px",background:"#fffbeb",border:"0.5px solid #fde68a",borderRadius:7,color:"#92400e",marginBottom:10}}>{rtSel.obs}</div>}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:8}}>{[["Cliente",rtSel.cli?cn(rtSel.cli):"—"],["Operario",rtSel.operario||"—"],["Responsable",rtSel.resp||"—"],["Kg",rtSel.kg_afectados?`${rtSel.kg_afectados} kg`:"—"],["Uds",rtSel.uds_afectadas||"—"],["T.estim.",rtSel.t_estimado?`${rtSel.t_estimado}h`:"—"],["T.real",rtSel.t_real?`${rtSel.t_real}h`:"—"],["M.O.",rtSel.coste_mano_obra?`${rtSel.coste_mano_obra}€`:"—"],["Material",rtSel.coste_material?`${rtSel.coste_material}€`:"—"]].map(([k,v])=>(<div key={k} style={{background:"#f8fafc",borderRadius:6,padding:"6px 9px"}}><div style={{fontSize:9,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".05em",marginBottom:2}}>{k}</div><div style={{fontSize:11.5,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</div></div>))}</div>
            </div>
            {(rtSel.fotos||[]).length>0&&(<div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 14px"}}><div style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>📷 Fotografías</div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{rtSel.fotos.map((f,i)=>(<img key={i} src={f.url} alt={f.nombre} onClick={()=>setFotoModal(f.url)} style={{width:90,height:70,objectFit:"cover",borderRadius:7,border:"1px solid #e5e7eb",cursor:"pointer"}}/>))}</div></div>)}
            <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 14px"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>📋 Historial</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>{(rtSel.historial||[]).slice().reverse().map((h,i)=>{const st=EST_RT[h.estado]||EST_RT.Pendiente;return(<div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"6px 0",borderBottom:"0.5px solid #f3f4f6"}}><span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:3,background:st.bg,color:st.tx,border:`0.5px solid ${st.bd}`,flexShrink:0,marginTop:1}}>{st.icon} {h.estado}</span><div style={{flex:1}}><div style={{fontSize:12,color:"#374151"}}>{h.accion}</div><div style={{fontSize:10,color:"#9ca3af"}}>{h.usuario} · {new Date(h.ts).toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"})}</div></div></div>);})}
              </div>
            </div>
          </div>
        ):(
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10,color:"#9ca3af",fontSize:13,background:"#f9fafb",borderRadius:12,border:"1px dashed #e5e7eb"}}><span style={{fontSize:40}}>🔧</span><span>← Selecciona un retrabajo para ver el detalle</span></div>
        )}
      </div>
      {modal&&<ModalRetrabajo rt={modal.rt} rts={rts} onClose={()=>setModal(false)} onGuardar={guardar}/>}
      {confirm&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:700}}><div style={{background:"#fff",borderRadius:12,padding:"24px 28px",maxWidth:400,width:"90%",boxShadow:"0 20px 40px rgba(0,0,0,.2)"}}><div style={{fontWeight:700,fontSize:15,marginBottom:8}}>Confirmar eliminación</div><div style={{fontSize:13,color:"#6b7280",marginBottom:20}}>¿Eliminar el retrabajo "{rtSel?.id}"?</div><div style={{display:"flex",justifyContent:"flex-end",gap:10}}><button onClick={()=>setConfirm(false)} style={{background:"transparent",border:"1px solid #d1d5db",color:"#374151",padding:"7px 16px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>Cancelar</button><button onClick={eliminar} style={{background:"#dc2626",color:"#fff",border:"none",padding:"7px 16px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>Eliminar</button></div></div></div>}
      {fotoModal&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:700}} onClick={()=>setFotoModal(null)}><img src={fotoModal} alt="foto" style={{maxWidth:"90vw",maxHeight:"88vh",borderRadius:12}}/></div>)}
    </div>
  );
}
// ─── MÓDULO PRINCIPAL ─────────────────────────────────────────────
export default function Calidad(){
  const { ncs, setNcs, ctrl, bloqueadas, setBloqueadas } = useContext(ERPContext);

  // Combinar NCs del contexto (VistaOperario) con datos enriquecidos
  const ncsEnriq = ncs.map(n=>{
    const base = NCS_INIT.find(e=>e.id===n.id);
    return base ? {...n,...base} : {
      ...n, origen:n.origen||"Interno", of:"—", maq:n.maq||"—", proc:"—",
      kg_afectados:0, coste_est:0,
      causa_raiz:"", accion_inm:"", accion_corr:"", accion_prev:"",
      d1:"",d2:"",d3:"",d4:"",d5:"",d6:"",d7:"",d8:""
    };
  });

  function setNcsEnriq(fn){
    const updated = typeof fn==="function" ? fn(ncsEnriq) : fn;
    setNcs(updated);
  }

  const [tab,setTab] = useState("kpis");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <Tabs items={[["kpis","Dashboard"],["ncs","No Conformidades"],["retrabajos","🔧 Retrabajos"],["planes","Planes de control"],["prov","Proveedores"],["aud","Auditorías"],["ctrl","Controles"]]} cur={tab} onChange={setTab}/>
      {tab==="kpis"   && <TabKPIs    ncs={ncsEnriq}/>}
      {tab==="ncs"    && <TabNCs     ncs={ncsEnriq} setNcs={setNcsEnriq}/>}
      {tab==="planes" && <TabPlanes/>}
      {tab==="prov"   && <TabProveedores/>}
      {tab==="aud"    && <TabAuditorias/>}
      {tab==="retrabajos"  && <TabRetrabajos/>}
      {tab==="ctrl"   && <TabControles registros={ctrl} bloqueadas={bloqueadas} setBloqueadas={setBloqueadas}/>}
    </div>
  );
}
