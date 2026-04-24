import { useState, useContext } from "react";
import { ERPContext } from "../ERP";

// ─── DATOS DEMO PORTAL ─────────────────────────────────────────────
const CLIENTES_DEMO = [
  { id:1, email:"cliente@matz-erreka.com",  password:"demo123", nombre:"MATZ-ERREKA, S.COOP.",  contacto:"Jon Urteaga",  codigo:"554" },
  { id:2, email:"cliente@tubsa.com",        password:"demo123", nombre:"TUBSA AUTOMOCION",       contacto:"Ana Rodríguez",codigo:"102" },
  { id:3, email:"cliente@torgomsa.com",     password:"demo123", nombre:"TORGOMSA",               contacto:"Mikel García", codigo:"211" },
];

const ESTADOS_OF = {
  "material_recibido":     {label:"Material recibido",       color:"#6b7280",  bg:"#f3f4f6"},
  "pendiente_planif":      {label:"Pendiente planificación", color:"#b45309",  bg:"#fef3c7"},
  "planificado":           {label:"Planificado",             color:"#0891b2",  bg:"#e0f2fe"},
  "pretratamiento":        {label:"En pretratamiento",       color:"#7c3aed",  bg:"#ede9fe"},
  "granallado":            {label:"En granallado",           color:"#16a34a",  bg:"#dcfce7"},
  "recubrimiento":         {label:"En recubrimiento",        color:"#1d4ed8",  bg:"#dbeafe"},
  "horno":                 {label:"En horno",                color:"#ea580c",  bg:"#ffedd5"},
  "control_calidad":       {label:"Control de calidad",      color:"#dc2626",  bg:"#fee2e2"},
  "embalaje":              {label:"Preparando embalaje",     color:"#0891b2",  bg:"#e0f2fe"},
  "listo_recoger":         {label:"Listo para recoger",      color:"#16a34a",  bg:"#dcfce7"},
  "enviado":               {label:"Enviado",                 color:"#059669",  bg:"#d1fae5"},
  "finalizado":            {label:"Finalizado",              color:"#374151",  bg:"#f3f4f6"},
  "bloqueado_calidad":     {label:"Bloqueado por calidad",   color:"#b91c1c",  bg:"#fee2e2"},
};

const ESTADOS_HOM = {
  "pendiente_muestras":   {label:"Pendiente muestras",       color:"#9ca3af"},
  "muestra_recibida":     {label:"Muestra recibida",         color:"#0891b2"},
  "proceso_definido":     {label:"Proceso definido",         color:"#7c3aed"},
  "pruebas_curso":        {label:"Pruebas en curso",         color:"#ea580c"},
  "ensayo_pendiente":     {label:"Ensayo pendiente",         color:"#b45309"},
  "informe_enviado":      {label:"Informe enviado",          color:"#1d4ed8"},
  "pendiente_aprobacion": {label:"Pendiente aprobación",     color:"#d97706"},
  "homologado":           {label:"Homologado ✓",             color:"#16a34a"},
  "rechazado":            {label:"Rechazado",                color:"#dc2626"},
  "bloqueado":            {label:"Bloqueado",                color:"#b91c1c"},
};

const OFS_DEMO = {
  1: [
    {of:"48545",ref:"208322450110",desc:"BUSHING SPACER L110 M42",  kg:240, estado:"control_calidad",  entrega:"28/04/2026",planta:"Vitoria"},
    {of:"48312",ref:"208300110042",desc:"BOLT M12 DIN 931",         kg:185, estado:"recubrimiento",    entrega:"02/05/2026",planta:"Vitoria"},
    {of:"47891",ref:"208280040011",desc:"NUT M10",                  kg:95,  estado:"enviado",          entrega:"20/04/2026",planta:"Esparreguera"},
    {of:"47502",ref:"208241190085",desc:"WASHER 30x3",              kg:320, estado:"finalizado",       entrega:"12/04/2026",planta:"Esparreguera"},
  ],
  2: [
    {of:"48410",ref:"28825261 T44", desc:"TUBSA REF 261",           kg:1232,estado:"horno",            entrega:"30/04/2026",planta:"Vitoria"},
    {of:"48210",ref:"28825262 T02", desc:"TUBSA REF 262",           kg:310, estado:"planificado",      entrega:"05/05/2026",planta:"Vitoria"},
  ],
  3: [
    {of:"48300",ref:"TG-9020-A",    desc:"PIEZA TORGOM A",          kg:88,  estado:"pretratamiento",   entrega:"29/04/2026",planta:"Vitoria"},
  ],
};

const HOMS_DEMO = {
  1: [
    {id:"H-2026-004",ref:"208322450110",desc:"BUSHING SPACER L110 M42",norma:"P14A-WE-0218",estado:"homologado",    fasesPend:0,  fechaValid:"15/03/2026"},
    {id:"H-2026-011",ref:"208400220055",desc:"NEW PART REF 220055",   norma:"DIN 50979",    estado:"pruebas_curso",fasesPend:2,  fechaValid:"15/05/2026"},
    {id:"H-2025-089",ref:"208241190085",desc:"WASHER 30x3",           norma:"ISO 9227",     estado:"homologado",   fasesPend:0,  fechaValid:"02/11/2025"},
  ],
  2: [
    {id:"H-2026-002",ref:"28825261 T44",desc:"TUBSA REF 261",         norma:"IATF 16949",   estado:"informe_enviado",fasesPend:1,fechaValid:"10/05/2026"},
  ],
  3: [],
};

const OFERTAS_DEMO = {
  1: [
    {id:"OF-2026-014",fecha:"18/04/2026",ref:"208400220055",desc:"Nueva referencia NSS 1000h",importe:4250,estado:"pendiente_revision",validez:"30/06/2026"},
    {id:"OF-2026-008",fecha:"02/03/2026",ref:"208322450110",desc:"Ampliación proceso KL120+Negro",importe:3100,estado:"aceptada",validez:"31/12/2026"},
    {id:"OF-2025-041",fecha:"10/11/2025",ref:"208241190085",desc:"Proceso Zinc Lamelar inicial",importe:1850,estado:"caducada",validez:"10/02/2026"},
  ],
  2: [
    {id:"OF-2026-010",fecha:"08/04/2026",ref:"28825261 T44",desc:"Renovación tarifa 2026",importe:22800,estado:"enviada",validez:"31/12/2026"},
  ],
  3: [],
};

const ALBARANES_DEMO = {
  1: [
    {id:"ALB-E-0421",tipo:"entrada",fecha:"24/04/2026",ref:"208322450110",desc:"BUSHING SPACER",uds:1500,kg:240,estado:"recibido"},
    {id:"ALB-S-0398",tipo:"salida", fecha:"20/04/2026",ref:"208241190085",desc:"WASHER 30x3",   uds:3200,kg:320,estado:"entregado"},
    {id:"ALB-E-0389",tipo:"entrada",fecha:"15/04/2026",ref:"208300110042",desc:"BOLT M12",      uds:2000,kg:185,estado:"recibido"},
  ],
  2: [
    {id:"ALB-E-0419",tipo:"entrada",fecha:"22/04/2026",ref:"28825261 T44",desc:"TUBSA REF 261",uds:800, kg:1232,estado:"recibido"},
  ],
  3: [],
};

const CERTS_DEMO = {
  1: [
    {id:"CERT-2026-0312",fecha:"20/04/2026",ref:"208241190085",of:"47502",lote:"L-002",tipo:"Certificado Calidad",estado:"emitido"},
    {id:"CERT-2026-0289",fecha:"10/03/2026",ref:"208322450110",of:"47201",lote:"L-001",tipo:"Informe NSS",        estado:"emitido"},
    {id:"CERT-2026-0401",fecha:"24/04/2026",ref:"208322450110",of:"48545",lote:"L-003",tipo:"Certificado Calidad",estado:"pendiente"},
  ],
  2: [],
  3: [],
};

// ─── COMPONENTES UI DEL PORTAL ─────────────────────────────────────
function Badge({ estado, map }){
  const e = map[estado]||{label:estado,color:"#6b7280",bg:"#f3f4f6"};
  return(
    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,
      background:e.bg||e.color+"20",color:e.color,whiteSpace:"nowrap",border:`0.5px solid ${e.color}40`}}>
      {e.label}
    </span>
  );
}

function Card({ children, style={} }){
  return <div style={{background:"#fff",borderRadius:12,border:"0.5px solid #e5e7eb",padding:"16px 20px",...style}}>{children}</div>;
}

function SectionTitle({ icon, title, subtitle }){
  return(
    <div style={{marginBottom:16}}>
      <div style={{fontSize:18,fontWeight:700,color:"#111827"}}>{icon} {title}</div>
      {subtitle&&<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{subtitle}</div>}
    </div>
  );
}

// ─── SECCIONES DEL PORTAL ──────────────────────────────────────────
function PortalDashboard({ cliente, ofs, homs, ofertas, albaranes, certs }){
  const ofsActivas = ofs.filter(o=>!["finalizado","enviado"].includes(o.estado)).length;
  const homPend    = homs.filter(h=>h.estado!=="homologado"&&h.estado!=="rechazado").length;
  const ofertasPend= ofertas.filter(o=>o.estado==="enviada").length;
  const certPend   = certs.filter(c=>c.estado==="pendiente").length;
  const proxOf     = ofs.filter(o=>!["finalizado","enviado"].includes(o.estado)).sort((a,b)=>a.entrega.localeCompare(b.entrega))[0];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div>
        <div style={{fontSize:22,fontWeight:700,color:"#111827"}}>Bienvenido, {cliente.contacto}</div>
        <div style={{fontSize:13,color:"#6b7280",marginTop:2}}>{cliente.nombre} · Portal de cliente Torres Gumà</div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
        {[
          ["🏭","OFs activas",ofsActivas,"#1d4ed8","#dbeafe"],
          ["🔬","Homologaciones en curso",homPend,"#7c3aed","#ede9fe"],
          ["📄","Ofertas pendientes",ofertasPend,"#d97706","#fef3c7"],
          ["🏅","Certificados pendientes",certPend,"#dc2626","#fee2e2"],
        ].map(([ic,lbl,val,col,bg])=>(
          <Card key={lbl} style={{background:bg,border:`0.5px solid ${col}30`}}>
            <div style={{fontSize:24,marginBottom:4}}>{ic}</div>
            <div style={{fontSize:28,fontWeight:700,color:col}}>{val}</div>
            <div style={{fontSize:11,color:col,fontWeight:600}}>{lbl}</div>
          </Card>
        ))}
      </div>

      {/* Próxima entrega */}
      {proxOf&&(
        <Card style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",color:"#fff"}}>
          <div style={{fontSize:11,fontWeight:700,opacity:.8,textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>📦 Próxima entrega estimada</div>
          <div style={{fontSize:24,fontWeight:700}}>{proxOf.entrega}</div>
          <div style={{fontSize:13,opacity:.9,marginTop:4}}>{proxOf.ref} — {proxOf.desc}</div>
          <div style={{fontSize:11,opacity:.7,marginTop:2}}>OF {proxOf.of} · {proxOf.planta} · {proxOf.kg} kg</div>
        </Card>
      )}

      {/* Últimas OFs */}
      <Card>
        <div style={{fontSize:13,fontWeight:700,color:"#111827",marginBottom:12}}>Últimas órdenes de fabricación</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {ofs.slice(0,3).map(of=>(
            <div key={of.of} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:"#f9fafb",borderRadius:8,flexWrap:"wrap"}}>
              <span style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:"#1d4ed8"}}>OF-{of.of}</span>
              <span style={{fontSize:12,color:"#374151",flex:1}}>{of.desc}</span>
              <span style={{fontSize:11,color:"#6b7280"}}>{of.kg} kg · {of.planta}</span>
              <Badge estado={of.estado} map={ESTADOS_OF}/>
              <span style={{fontSize:11,color:"#374151",fontWeight:600}}>🗓 {of.entrega}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function PortalOFs({ ofs }){
  const PASOS = ["material_recibido","pendiente_planif","planificado","pretratamiento","granallado","recubrimiento","horno","control_calidad","embalaje","listo_recoger","enviado","finalizado"];
  const [sel,setSel] = useState(null);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <SectionTitle icon="🏭" title="Mis órdenes de fabricación" subtitle="Estado en tiempo real de tus pedidos en producción"/>
      {ofs.map(of=>{
        const pasoIdx = PASOS.indexOf(of.estado);
        return(
          <Card key={of.of}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,flexWrap:"wrap"}}>
              <span style={{fontFamily:"monospace",fontSize:14,fontWeight:700,color:"#1d4ed8"}}>OF-{of.of}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:"#111827"}}>{of.desc}</div>
                <div style={{fontSize:11,color:"#6b7280"}}>{of.ref} · {of.kg} kg · {of.planta}</div>
              </div>
              <Badge estado={of.estado} map={ESTADOS_OF}/>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:10,color:"#9ca3af"}}>Entrega estimada</div>
                <div style={{fontSize:13,fontWeight:700,color:"#111827"}}>{of.entrega}</div>
              </div>
            </div>

            {/* Timeline */}
            <div style={{overflowX:"auto",paddingBottom:4}}>
              <div style={{display:"flex",alignItems:"center",gap:0,minWidth:700}}>
                {PASOS.map((paso,i)=>{
                  const e = ESTADOS_OF[paso];
                  const done  = i < pasoIdx;
                  const active= i === pasoIdx;
                  const future= i > pasoIdx;
                  return(
                    <div key={paso} style={{display:"flex",alignItems:"center",flex:1}}>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,flex:0}}>
                        <div style={{width:16,height:16,borderRadius:"50%",flexShrink:0,
                          background:done?"#16a34a":active?e.color:"#e5e7eb",
                          border:active?`2px solid ${e.color}`:"2px solid transparent",
                          boxShadow:active?`0 0 0 3px ${e.color}40`:"none",
                          display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff"}}>
                          {done?"✓":""}
                        </div>
                        <div style={{fontSize:8,color:done?"#16a34a":active?e.color:"#9ca3af",fontWeight:active?700:400,
                          textAlign:"center",maxWidth:60,lineHeight:1.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                          {e?.label?.split(" ").slice(0,2).join(" ")}
                        </div>
                      </div>
                      {i<PASOS.length-1&&(
                        <div style={{flex:1,height:2,background:done?"#16a34a":"#e5e7eb",margin:"0 2px",marginBottom:14}}/>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function PortalHomologaciones({ homs }){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <SectionTitle icon="🔬" title="Estado de homologaciones" subtitle="Consulta el estado y fases de cada referencia en homologación"/>
      {homs.length===0&&<Card><div style={{textAlign:"center",color:"#9ca3af",padding:"30px 0"}}>Sin homologaciones activas</div></Card>}
      {homs.map(h=>(
        <Card key={h.id}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                <span style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:"#6b7280"}}>{h.id}</span>
                <Badge estado={h.estado} map={ESTADOS_HOM}/>
              </div>
              <div style={{fontSize:14,fontWeight:700,color:"#111827"}}>{h.desc}</div>
              <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{h.ref} · Norma: {h.norma}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:"#9ca3af"}}>Validación prevista</div>
              <div style={{fontSize:13,fontWeight:600,color:"#111827"}}>{h.fechaValid}</div>
              {h.fasesPend>0&&(
                <div style={{fontSize:11,color:"#d97706",marginTop:3,fontWeight:600}}>⚠ {h.fasesPend} fase{h.fasesPend>1?"s":""} pendiente{h.fasesPend>1?"s":""}</div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function PortalOfertas({ ofertas, setOfertas }){
  const EST_COL = {
    "pendiente_revision":{label:"Pendiente revisión", color:"#d97706",bg:"#fef3c7"},
    "enviada":           {label:"Enviada",             color:"#1d4ed8",bg:"#dbeafe"},
    "aceptada":          {label:"Aceptada ✓",          color:"#16a34a",bg:"#dcfce7"},
    "rechazada":         {label:"Rechazada",           color:"#dc2626",bg:"#fee2e2"},
    "caducada":          {label:"Caducada",            color:"#9ca3af",bg:"#f3f4f6"},
  };

  function accion(id, nuevoEst){
    setOfertas(p=>p.map(o=>o.id===id?{...o,estado:nuevoEst}:o));
  }

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <SectionTitle icon="📄" title="Mis ofertas" subtitle="Gestiona y responde a las ofertas de Torres Gumà"/>
      {ofertas.length===0&&<Card><div style={{textAlign:"center",color:"#9ca3af",padding:"30px 0"}}>Sin ofertas disponibles</div></Card>}
      {ofertas.map(o=>(
        <Card key={o.id}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                <span style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:"#6b7280"}}>{o.id}</span>
                <Badge estado={o.estado} map={EST_COL}/>
                <span style={{fontSize:11,color:"#9ca3af"}}>{o.fecha}</span>
              </div>
              <div style={{fontSize:14,fontWeight:700,color:"#111827"}}>{o.desc}</div>
              <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{o.ref}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:18,fontWeight:700,color:"#1d4ed8"}}>{o.importe.toLocaleString("es-ES")} €</div>
              <div style={{fontSize:10,color:"#9ca3af"}}>Válida hasta {o.validez}</div>
            </div>
          </div>
          {o.estado==="enviada"&&(
            <div style={{display:"flex",gap:8,marginTop:12,paddingTop:10,borderTop:"1px solid #f3f4f6"}}>
              <button onClick={()=>accion(o.id,"aceptada")}
                style={{flex:1,background:"#dcfce7",border:"1px solid #86efac",color:"#166534",borderRadius:7,padding:"8px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                ✓ Aceptar oferta
              </button>
              <button onClick={()=>accion(o.id,"rechazada")}
                style={{flex:1,background:"#fee2e2",border:"1px solid #fca5a5",color:"#b91c1c",borderRadius:7,padding:"8px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                ✕ Rechazar
              </button>
              <button style={{background:"#f1f5f9",border:"1px solid #e2e8f0",color:"#374151",borderRadius:7,padding:"8px 14px",fontSize:12,cursor:"pointer"}}>
                ↓ PDF
              </button>
            </div>
          )}
          {(o.estado==="aceptada"||o.estado==="rechazada")&&(
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:10,paddingTop:8,borderTop:"1px solid #f3f4f6"}}>
              <button style={{background:"#f1f5f9",border:"1px solid #e2e8f0",color:"#374151",borderRadius:7,padding:"7px 14px",fontSize:12,cursor:"pointer"}}>
                ↓ Descargar PDF
              </button>
            </div>
          )}
        </Card>
      ))}

      {/* Solicitar nueva oferta */}
      <PortalSolicitarOferta/>
    </div>
  );
}

function PortalSolicitarOferta(){
  const [open,setOpen] = useState(false);
  const [form,setForm] = useState({ref:"",desc:"",cantidad:"",peso:"",medidas:"",tratamiento:"",obs:""});
  const [enviado,setEnviado] = useState(false);
  const ff = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const sInp = {border:"1px solid #e5e7eb",borderRadius:6,padding:"6px 9px",fontSize:12,width:"100%",boxSizing:"border-box",outline:"none"};
  const sLbl = {fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:3};

  if(enviado) return(
    <Card style={{background:"#f0fdf4",border:"1px solid #86efac"}}>
      <div style={{textAlign:"center",padding:"12px 0"}}>
        <div style={{fontSize:32,marginBottom:8}}>✅</div>
        <div style={{fontSize:15,fontWeight:700,color:"#166534"}}>Solicitud enviada</div>
        <div style={{fontSize:12,color:"#166534",marginTop:4}}>El equipo de Torres Gumà recibirá tu solicitud y te enviaremos la oferta en breve.</div>
        <button onClick={()=>{setEnviado(false);setOpen(false);setForm({ref:"",desc:"",cantidad:"",peso:"",medidas:"",tratamiento:"",obs:""});}}
          style={{marginTop:12,background:"#16a34a",color:"#fff",border:"none",borderRadius:7,padding:"7px 18px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
          Nueva solicitud
        </button>
      </div>
    </Card>
  );

  return(
    <Card style={{border:"1.5px dashed #d1d5db"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:"#374151"}}>📝 Solicitar nueva oferta</div>
          <div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>Introduce los datos de la pieza o tratamiento y te enviamos un presupuesto</div>
        </div>
        <span style={{fontSize:18,color:"#6b7280"}}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["ref","Referencia"],["desc","Descripción pieza"],["cantidad","Cantidad (uds)"],["peso","Peso unitario (g)"],["medidas","Medidas (mm)"],["tratamiento","Tipo de tratamiento"]].map(([k,l])=>(
              <div key={k}><label style={sLbl}>{l}</label><input value={form[k]} onChange={ff(k)} style={sInp}/></div>
            ))}
          </div>
          <div>
            <label style={sLbl}>Observaciones / Requisitos especiales</label>
            <textarea value={form.obs} onChange={ff("obs")} rows={2}
              style={{...sInp,resize:"vertical",fontFamily:"inherit"}}/>
          </div>
          <button onClick={()=>setEnviado(true)} disabled={!form.ref||!form.tratamiento}
            style={{background:form.ref&&form.tratamiento?"#2563eb":"#94a3b8",color:"#fff",border:"none",borderRadius:7,padding:"9px",fontSize:12,fontWeight:700,cursor:form.ref&&form.tratamiento?"pointer":"not-allowed"}}>
            📤 Enviar solicitud de oferta
          </button>
        </div>
      )}
    </Card>
  );
}

function PortalAlbaranes({ albaranes }){
  const [tipo,setTipo] = useState("todos");
  const filtered = tipo==="todos"?albaranes:albaranes.filter(a=>a.tipo===tipo);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <SectionTitle icon="📦" title="Albaranes" subtitle="Consulta y descarga tus albaranes de entrada y salida"/>
      <div style={{display:"flex",gap:6}}>
        {[["todos","Todos"],["entrada","Entrada"],["salida","Salida"]].map(([v,l])=>(
          <button key={v} onClick={()=>setTipo(v)}
            style={{padding:"5px 14px",borderRadius:20,fontSize:11,fontWeight:tipo===v?700:400,cursor:"pointer",
              background:tipo===v?"#1e3a5f":"#f1f5f9",color:tipo===v?"#fff":"#374151",border:"none"}}>
            {l}
          </button>
        ))}
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{borderCollapse:"collapse",width:"100%",fontSize:12}}>
          <thead>
            <tr style={{background:"#f8fafc"}}>
              {["Nº Albarán","Tipo","Fecha","Referencia","Descripción","Uds","Kg","Estado",""].map(h=>(
                <th key={h} style={{padding:"10px 12px",textAlign:"left",borderBottom:"1px solid #e5e7eb",fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length===0&&(
              <tr><td colSpan={9} style={{padding:"24px",textAlign:"center",color:"#9ca3af"}}>Sin albaranes</td></tr>
            )}
            {filtered.map((a,i)=>(
              <tr key={a.id} style={{background:i%2===0?"#fff":"#fafafa",borderBottom:"0.5px solid #f1f5f9"}}>
                <td style={{padding:"9px 12px",fontFamily:"monospace",fontWeight:700,color:"#1d4ed8"}}>{a.id}</td>
                <td style={{padding:"9px 12px"}}>
                  <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10,
                    background:a.tipo==="entrada"?"#dbeafe":"#dcfce7",color:a.tipo==="entrada"?"#1d4ed8":"#166534"}}>
                    {a.tipo==="entrada"?"↓ Entrada":"↑ Salida"}
                  </span>
                </td>
                <td style={{padding:"9px 12px",color:"#6b7280"}}>{a.fecha}</td>
                <td style={{padding:"9px 12px",fontFamily:"monospace",fontSize:11}}>{a.ref}</td>
                <td style={{padding:"9px 12px",color:"#374151"}}>{a.desc}</td>
                <td style={{padding:"9px 12px",textAlign:"right"}}>{a.uds.toLocaleString()}</td>
                <td style={{padding:"9px 12px",textAlign:"right"}}>{a.kg} kg</td>
                <td style={{padding:"9px 12px"}}>
                  <span style={{fontSize:10,fontWeight:600,color:a.estado==="entregado"?"#166534":"#0891b2"}}>{a.estado}</span>
                </td>
                <td style={{padding:"9px 12px"}}>
                  <button style={{background:"#f1f5f9",border:"0.5px solid #e2e8f0",color:"#374151",borderRadius:5,padding:"3px 8px",fontSize:10,cursor:"pointer"}}>
                    ↓ PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function PortalCertificados({ certs }){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <SectionTitle icon="🏅" title="Certificados de calidad" subtitle="Descarga los certificados asociados a tus pedidos y lotes"/>
      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{borderCollapse:"collapse",width:"100%",fontSize:12}}>
          <thead>
            <tr style={{background:"#f8fafc"}}>
              {["Certificado","Fecha","Referencia","OF","Lote","Tipo","Estado",""].map(h=>(
                <th key={h} style={{padding:"10px 12px",textAlign:"left",borderBottom:"1px solid #e5e7eb",fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {certs.length===0&&(
              <tr><td colSpan={8} style={{padding:"24px",textAlign:"center",color:"#9ca3af"}}>Sin certificados disponibles</td></tr>
            )}
            {certs.map((c,i)=>(
              <tr key={c.id} style={{background:i%2===0?"#fff":"#fafafa",borderBottom:"0.5px solid #f1f5f9"}}>
                <td style={{padding:"9px 12px",fontFamily:"monospace",fontWeight:700,color:"#1d4ed8"}}>{c.id}</td>
                <td style={{padding:"9px 12px",color:"#6b7280"}}>{c.fecha}</td>
                <td style={{padding:"9px 12px",fontFamily:"monospace",fontSize:11}}>{c.ref}</td>
                <td style={{padding:"9px 12px",fontFamily:"monospace",fontSize:11}}>{c.of}</td>
                <td style={{padding:"9px 12px"}}>{c.lote}</td>
                <td style={{padding:"9px 12px",fontSize:11}}>{c.tipo}</td>
                <td style={{padding:"9px 12px"}}>
                  <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10,
                    background:c.estado==="emitido"?"#dcfce7":"#fef3c7",color:c.estado==="emitido"?"#166534":"#b45309"}}>
                    {c.estado==="emitido"?"✓ Emitido":"⏳ Pendiente"}
                  </span>
                </td>
                <td style={{padding:"9px 12px"}}>
                  {c.estado==="emitido"&&(
                    <button style={{background:"#f1f5f9",border:"0.5px solid #e2e8f0",color:"#374151",borderRadius:5,padding:"3px 8px",fontSize:10,cursor:"pointer"}}>
                      ↓ PDF
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}


// ─── CALCULADORA PORTAL ────────────────────────────────────────────
const NORMATIVAS_COMUNES = [
  {value:"",          label:"Sin normativa específica"},
  {value:"ISO 10683", label:"ISO 10683 — Zinc lamelar"},
  {value:"DIN 50979", label:"DIN 50979 — Zinc lamelar"},
  {value:"ISO 9227",  label:"ISO 9227 — Ensayo NSS"},
  {value:"IATF 16949",label:"IATF 16949 — Automoción"},
  {value:"Geomet",    label:"Geomet® (Zinc lamelar)"},
  {value:"Dacromet",  label:"Dacromet® (Zinc lamelar)"},
  {value:"Otra",      label:"Otra (especificar en notas)"},
];

function PortalCalculadora({ cliente }){
  const API_KEY = import.meta.env.VITE_ANTHROPIC_KEY;
  const [ancho,setAncho]   = useState("");
  const [alto,setAlto]     = useState("");
  const [largo,setLargo]   = useState("");
  const [peso,setPeso]     = useState("");
  const [nss,setNss]       = useState("");
  const [norma,setNorma]   = useState("");
  const [notas,setNotas]   = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError]   = useState("");
  const [result,setResult] = useState(null);
  const [solicitar,setSolicitar] = useState(false);
  const [solEnviada,setSolEnviada] = useState(false);

  async function calcular(){
    if(!peso||!ancho||!alto||!largo){ setError("Completa al menos peso y dimensiones."); return; }
    setLoading(true); setError(""); setResult(null);

    const prompt = `Eres el motor de cálculo de precios de Torres Gumà (tratamiento superficial, zinc lamelar, granallado).

Datos de la pieza del cliente:
- Dimensiones: ${ancho}mm x ${alto}mm x ${largo}mm
- Peso: ${peso} g
- Horas resistencia NSS requeridas: ${nss||"no especificado"}
- Normativa: ${norma||"ninguna"}
- Notas: ${notas||"ninguna"}

Calcula y recomienda:
1. El proceso más adecuado según normativa y NSS (zinc lamelar KL100/KL120, fosfatado, granallado, etc.)
2. Kg estimados por cesta según dimensiones y peso
3. Precio estimado en €/kg para diferentes volúmenes de lote
4. Si hay normativa específica, indica exactamente qué proceso cumple con ella

Responde SOLO JSON sin markdown:
{
  "proceso_recomendado": "descripción corta del proceso",
  "proceso_detalle": "explicación del por qué ese proceso",
  "cumple_normativa": true o false,
  "kg_por_cesta": número estimado,
  "superficie_cm2": número,
  "precios": [
    {"lote": "80-249 kg",  "precio_kg": número, "precio_ud": número},
    {"lote": "250-999 kg", "precio_kg": número, "precio_ud": número},
    {"lote": "1000+ kg",   "precio_kg": número, "precio_ud": número}
  ],
  "nss_alcanzable": número de horas NSS estimadas con el proceso,
  "observaciones": "texto corto con recomendaciones o advertencias"
}`;

    try{
      const resp = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:prompt}]})
      });
      const data = await resp.json();
      if(data.error) throw new Error(data.error.message);
      const txt = data.content?.find(b=>b.type==="text")?.text||"";
      setResult(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    }catch(e){ setError("Error al calcular: "+e.message); }
    finally{ setLoading(false); }
  }

  const sInp = {border:"1.5px solid #e5e7eb",borderRadius:8,padding:"9px 11px",fontSize:13,width:"100%",boxSizing:"border-box",outline:"none",color:"#111827",transition:"border-color .15s"};
  const sLbl = {fontSize:11,fontWeight:700,color:"#374151",display:"block",marginBottom:5};

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <SectionTitle icon="🧮" title="Calculadora de costes" subtitle="Introduce los datos de tu pieza y obtén una estimación de precio al momento"/>

      {/* Formulario */}
      <Card>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>

          {/* Dimensiones */}
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:20,height:20,background:"#1e3a5f",borderRadius:4,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700}}>1</span>
              Dimensiones y peso de la pieza
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
              {[["Ancho (mm)",ancho,setAncho],["Alto (mm)",alto,setAlto],["Largo (mm)",largo,setLargo],["Peso (g)",peso,setPeso]].map(([l,v,fn])=>(
                <div key={l}>
                  <label style={sLbl}>{l} *</label>
                  <input type="number" value={v} onChange={e=>fn(e.target.value)} style={sInp} placeholder="0"/>
                </div>
              ))}
            </div>
            {peso&&ancho&&alto&&largo&&(
              <div style={{marginTop:8,fontSize:11,color:"#6b7280",background:"#f8fafc",borderRadius:6,padding:"6px 10px"}}>
                📐 Volumen estimado: <strong>{((parseFloat(ancho)*parseFloat(alto)*parseFloat(largo))/1000).toFixed(1)} cm³</strong> ·
                Peso pieza: <strong>{(parseFloat(peso)/1000).toFixed(4)} kg</strong>
              </div>
            )}
          </div>

          {/* NSS + Normativa */}
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:20,height:20,background:"#1e3a5f",borderRadius:4,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700}}>2</span>
              Requisitos de resistencia y normativa
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <label style={sLbl}>Horas resistencia NSS (cámara niebla salina)</label>
                <div style={{position:"relative"}}>
                  <input type="number" value={nss} onChange={e=>setNss(e.target.value)}
                    style={{...sInp,paddingRight:40}} placeholder="ej. 480"/>
                  <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:11,color:"#9ca3af",pointerEvents:"none"}}>h</span>
                </div>
                {nss&&(
                  <div style={{marginTop:5,fontSize:10,color:parseInt(nss)>=1000?"#166534":parseInt(nss)>=500?"#0891b2":"#b45309",fontWeight:600}}>
                    {parseInt(nss)>=1000?"🟢 Alta resistencia":""}
                    {parseInt(nss)>=500&&parseInt(nss)<1000?"🔵 Resistencia media-alta":""}
                    {parseInt(nss)<500&&nss?"🟡 Resistencia estándar":""}
                  </div>
                )}
              </div>
              <div>
                <label style={sLbl}>Normativa aplicable</label>
                <select value={norma} onChange={e=>setNorma(e.target.value)} style={sInp}>
                  {NORMATIVAS_COMUNES.map(n=><option key={n.value} value={n.value}>{n.label}</option>)}
                </select>
                {norma&&norma!=="Otra"&&(
                  <div style={{marginTop:5,fontSize:10,color:"#1d4ed8",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>
                    ✦ El proceso se sugerirá según esta normativa
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:20,height:20,background:"#1e3a5f",borderRadius:4,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700}}>3</span>
              Información adicional (opcional)
            </div>
            <textarea value={notas} onChange={e=>setNotas(e.target.value)} rows={2}
              placeholder="Material, acabado especial, destino de la pieza, cantidad prevista anual..."
              style={{...sInp,resize:"vertical",fontFamily:"inherit"}}/>
          </div>

          {/* Botón */}
          {error&&<div style={{fontSize:12,color:"#dc2626",fontWeight:600}}>{error}</div>}
          <button onClick={calcular} disabled={loading||!peso||!ancho||!alto||!largo}
            style={{background:loading||!peso||!ancho||!alto||!largo?"#94a3b8":"#1e3a5f",
              color:"#fff",border:"none",borderRadius:8,padding:"12px",fontSize:13,fontWeight:700,
              cursor:loading||!peso||!ancho||!alto||!largo?"not-allowed":"pointer"}}>
            {loading?"⏳ Calculando precio...":"⚡ Calcular precio estimado"}
          </button>
        </div>
      </Card>

      {/* Resultado */}
      {result&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>

          {/* Proceso recomendado */}
          <Card style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",color:"#fff",border:"none"}}>
            <div style={{fontSize:11,fontWeight:700,opacity:.7,textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>
              ✦ Proceso recomendado{norma?` — cumple ${norma}`:""}
            </div>
            <div style={{fontSize:18,fontWeight:700,marginBottom:4}}>{result.proceso_recomendado}</div>
            <div style={{fontSize:12,opacity:.85,lineHeight:1.5}}>{result.proceso_detalle}</div>
            <div style={{display:"flex",gap:10,marginTop:10,flexWrap:"wrap"}}>
              {result.kg_por_cesta&&(
                <div style={{background:"rgba(255,255,255,.15)",borderRadius:6,padding:"6px 12px",fontSize:11}}>
                  📦 ~{result.kg_por_cesta} kg/cesta
                </div>
              )}
              {result.superficie_cm2&&(
                <div style={{background:"rgba(255,255,255,.15)",borderRadius:6,padding:"6px 12px",fontSize:11}}>
                  📐 ~{result.superficie_cm2} cm²
                </div>
              )}
              {result.nss_alcanzable&&(
                <div style={{background:"rgba(255,255,255,.15)",borderRadius:6,padding:"6px 12px",fontSize:11}}>
                  🧪 NSS estimado: ~{result.nss_alcanzable}h
                </div>
              )}
              {result.cumple_normativa&&norma&&(
                <div style={{background:"rgba(34,197,94,.3)",borderRadius:6,padding:"6px 12px",fontSize:11,fontWeight:700}}>
                  ✓ Cumple {norma}
                </div>
              )}
            </div>
          </Card>

          {/* Tabla precios */}
          {result.precios&&result.precios.length>0&&(
            <Card>
              <div style={{fontSize:13,fontWeight:700,color:"#111827",marginBottom:12}}>💶 Precios estimados</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
                {result.precios.map((p,i)=>(
                  <div key={i} style={{background:i===0?"#f8fafc":i===1?"#eff6ff":"#f0fdf4",borderRadius:10,padding:"14px 16px",border:`1px solid ${i===0?"#e5e7eb":i===1?"#bfdbfe":"#86efac"}`}}>
                    <div style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",marginBottom:6}}>{p.lote}</div>
                    <div style={{fontSize:22,fontWeight:700,color:i===0?"#374151":i===1?"#1d4ed8":"#166534"}}>
                      {Number(p.precio_kg).toFixed(4)} <span style={{fontSize:11}}>€/kg</span>
                    </div>
                    {p.precio_ud&&(
                      <div style={{fontSize:11,color:"#6b7280",marginTop:3}}>
                        ~{Number(p.precio_ud).toFixed(4)} €/ud
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{marginTop:10,fontSize:10,color:"#9ca3af",fontStyle:"italic"}}>
                * Precios orientativos. La oferta definitiva puede variar según condiciones de entrega, acabado y volumen anual.
              </div>
            </Card>
          )}

          {/* Observaciones */}
          {result.observaciones&&(
            <Card style={{background:"#fffbeb",border:"1px solid #fde68a"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#b45309",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4}}>💡 Observaciones</div>
              <div style={{fontSize:12,color:"#78350f",lineHeight:1.6}}>{result.observaciones}</div>
            </Card>
          )}

          {/* CTA solicitar oferta */}
          {!solEnviada?(
            <Card style={{border:"1.5px dashed #2563eb",background:"#eff6ff"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>¿Quieres una oferta formal?</div>
                  <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>Te enviamos una oferta detallada con condiciones y plazos en menos de 48h</div>
                </div>
                <button onClick={()=>{setSolEnviada(true);}}
                  style={{background:"#1e3a5f",color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
                  📤 Solicitar oferta
                </button>
              </div>
            </Card>
          ):(
            <Card style={{background:"#f0fdf4",border:"1px solid #86efac"}}>
              <div style={{textAlign:"center",padding:"8px 0"}}>
                <div style={{fontSize:20,marginBottom:6}}>✅</div>
                <div style={{fontSize:13,fontWeight:700,color:"#166534"}}>¡Solicitud enviada!</div>
                <div style={{fontSize:11,color:"#166534",marginTop:3}}>El equipo comercial de Torres Gumà te contactará en menos de 48h.</div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ─── LOGIN ─────────────────────────────────────────────────────────
function PortalLogin({ onLogin }){
  const [email,setEmail]     = useState("");
  const [password,setPassword] = useState("");
  const [error,setError]     = useState("");
  const [loading,setLoading] = useState(false);

  function login(){
    setLoading(true); setError("");
    setTimeout(()=>{
      const cli = CLIENTES_DEMO.find(c=>c.email===email&&c.password===password);
      if(cli) onLogin(cli);
      else setError("Email o contraseña incorrectos");
      setLoading(false);
    },600);
  }

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#1d4ed8 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:16,padding:"40px 36px",width:"100%",maxWidth:400,boxShadow:"0 25px 60px rgba(0,0,0,.4)"}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:28,fontWeight:900,color:"#1e3a5f",letterSpacing:"-1px"}}>Torres Gumà</div>
          <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>Portal de cliente</div>
          <div style={{width:40,height:3,background:"#2563eb",margin:"10px auto 0",borderRadius:2}}/>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:5}}>Correo electrónico</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="tu@empresa.com"
              style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px 12px",fontSize:13,outline:"none",boxSizing:"border-box",
                borderColor:error?"#fca5a5":"#e5e7eb"}}
              onKeyDown={e=>e.key==="Enter"&&login()}/>
          </div>
          <div>
            <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:5}}>Contraseña</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
              placeholder="••••••••"
              style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px 12px",fontSize:13,outline:"none",boxSizing:"border-box",
                borderColor:error?"#fca5a5":"#e5e7eb"}}
              onKeyDown={e=>e.key==="Enter"&&login()}/>
          </div>
          {error&&<div style={{fontSize:12,color:"#dc2626",fontWeight:600,textAlign:"center"}}>{error}</div>}
          <button onClick={login} disabled={loading||!email||!password}
            style={{background:loading||!email||!password?"#94a3b8":"#1e3a5f",color:"#fff",border:"none",borderRadius:8,padding:"12px",
              fontSize:13,fontWeight:700,cursor:loading||!email||!password?"not-allowed":"pointer",marginTop:4,transition:"background .15s"}}>
            {loading?"Verificando...":"Entrar →"}
          </button>
        </div>

        {/* Demo hint */}
        <div style={{marginTop:20,padding:"10px 12px",background:"#f8fafc",borderRadius:8,fontSize:11,color:"#6b7280",textAlign:"center",border:"0.5px solid #e2e8f0"}}>
          <div style={{fontWeight:700,marginBottom:3,color:"#374151"}}>🔑 Acceso demo</div>
          cliente@matz-erreka.com / demo123
        </div>
      </div>
    </div>
  );
}

// ─── PORTAL PRINCIPAL ──────────────────────────────────────────────

function PortalCalidad({ certs }){
  const [seccion,setSeccion] = useState("certs");
  const [reclamaciones,setReclamaciones] = useState([]);
  const [modal,setModal] = useState(false);
  const [form,setForm] = useState({of:"",ref:"",tipo:"No conformidad",desc:"",urgencia:"Normal"});
  const [enviada,setEnviada] = useState(false);
  const ff = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const sInp = {border:"1px solid #e5e7eb",borderRadius:6,padding:"7px 9px",fontSize:12,width:"100%",boxSizing:"border-box",outline:"none"};
  const sLbl = {fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:3};

  function enviarReclamacion(){
    if(!form.desc.trim()) return;
    const nueva = {
      id:`REC-${String(reclamaciones.length+1).padStart(3,"0")}`,
      fecha:new Date().toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"}),
      of:form.of, ref:form.ref, tipo:form.tipo,
      desc:form.desc, urgencia:form.urgencia,
      estado:"Recibida",
    };
    setReclamaciones(p=>[nueva,...p]);
    setForm({of:"",ref:"",tipo:"No conformidad",desc:"",urgencia:"Normal"});
    setModal(false);
    setEnviada(true);
    setTimeout(()=>setEnviada(false),3000);
  }

  const URGENCIA_COL = {
    "Normal": {bg:"#f3f4f6",tx:"#374151"},
    "Alta":   {bg:"#fef3c7",tx:"#b45309"},
    "Urgente":{bg:"#fee2e2",tx:"#b91c1c"},
  };
  const REC_EST = {
    "Recibida":   {label:"Recibida",   color:"#0891b2"},
    "En análisis":{label:"En análisis",color:"#7c3aed"},
    "Resuelta":   {label:"Resuelta ✓", color:"#16a34a"},
    "Cerrada":    {label:"Cerrada",    color:"#6b7280"},
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <SectionTitle icon="🏅" title="Departamento de Calidad" subtitle="Certificados de calidad y gestión de reclamaciones"/>
        <button onClick={()=>setModal(true)}
          style={{background:"#dc2626",color:"#fff",border:"none",borderRadius:8,padding:"9px 18px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
          🚨 Poner una reclamación
        </button>
      </div>

      {/* Aviso reclamación enviada */}
      {enviada&&(
        <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#166534",fontWeight:600}}>
          ✅ Reclamación enviada correctamente. El equipo de calidad la revisará en breve.
        </div>
      )}

      {/* Sub-tabs */}
      <div style={{display:"flex",gap:4,background:"#f1f5f9",borderRadius:8,padding:3,alignSelf:"flex-start"}}>
        {[["certs","🏅 Certificados"],["recs","🚨 Reclamaciones"]].map(([v,l])=>(
          <button key={v} onClick={()=>setSeccion(v)}
            style={{padding:"6px 14px",borderRadius:6,fontSize:12,fontWeight:seccion===v?700:400,cursor:"pointer",
              background:seccion===v?"#fff":"transparent",color:seccion===v?"#dc2626":"#6b7280",
              border:seccion===v?"1px solid #e2e8f0":"none",
              boxShadow:seccion===v?"0 1px 3px rgba(0,0,0,.08)":"none"}}>
            {l} {v==="recs"&&reclamaciones.length>0&&<span style={{fontSize:9,background:"#dc2626",color:"#fff",borderRadius:10,padding:"1px 5px",marginLeft:3}}>{reclamaciones.length}</span>}
          </button>
        ))}
      </div>

      {/* Certificados */}
      {seccion==="certs"&&(
        <Card style={{padding:0,overflow:"hidden"}}>
          <table style={{borderCollapse:"collapse",width:"100%",fontSize:12}}>
            <thead>
              <tr style={{background:"#f8fafc"}}>
                {["Certificado","Fecha","Referencia","OF","Lote","Tipo","Estado",""].map(h=>(
                  <th key={h} style={{padding:"10px 12px",textAlign:"left",borderBottom:"1px solid #e5e7eb",fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {certs.length===0&&(
                <tr><td colSpan={8} style={{padding:"24px",textAlign:"center",color:"#9ca3af"}}>Sin certificados disponibles</td></tr>
              )}
              {certs.map((c,i)=>(
                <tr key={c.id} style={{background:i%2===0?"#fff":"#fafafa",borderBottom:"0.5px solid #f1f5f9"}}>
                  <td style={{padding:"9px 12px",fontFamily:"monospace",fontWeight:700,color:"#1d4ed8"}}>{c.id}</td>
                  <td style={{padding:"9px 12px",color:"#6b7280"}}>{c.fecha}</td>
                  <td style={{padding:"9px 12px",fontFamily:"monospace",fontSize:11}}>{c.ref}</td>
                  <td style={{padding:"9px 12px",fontFamily:"monospace",fontSize:11}}>{c.of}</td>
                  <td style={{padding:"9px 12px"}}>{c.lote}</td>
                  <td style={{padding:"9px 12px",fontSize:11}}>{c.tipo}</td>
                  <td style={{padding:"9px 12px"}}>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10,
                      background:c.estado==="emitido"?"#dcfce7":"#fef3c7",color:c.estado==="emitido"?"#166534":"#b45309"}}>
                      {c.estado==="emitido"?"✓ Emitido":"⏳ Pendiente"}
                    </span>
                  </td>
                  <td style={{padding:"9px 12px"}}>
                    {c.estado==="emitido"&&(
                      <button style={{background:"#f1f5f9",border:"0.5px solid #e2e8f0",color:"#374151",borderRadius:5,padding:"3px 8px",fontSize:10,cursor:"pointer"}}>
                        ↓ PDF
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Reclamaciones */}
      {seccion==="recs"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {reclamaciones.length===0&&(
            <Card>
              <div style={{textAlign:"center",color:"#9ca3af",padding:"30px 0"}}>
                <div style={{fontSize:32,marginBottom:8}}>✅</div>
                <div style={{fontSize:13,fontWeight:600}}>Sin reclamaciones activas</div>
                <div style={{fontSize:11,marginTop:4}}>Si tienes alguna incidencia de calidad, usa el botón rojo para comunicarla.</div>
              </div>
            </Card>
          )}
          {reclamaciones.map(r=>{
            const u = URGENCIA_COL[r.urgencia]||URGENCIA_COL["Normal"];
            return(
              <Card key={r.id}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:5,flexWrap:"wrap"}}>
                      <span style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:"#6b7280"}}>{r.id}</span>
                      <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10,background:u.bg,color:u.tx}}>{r.urgencia}</span>
                      <span style={{fontSize:10,fontWeight:700,color:REC_EST[r.estado]?.color||"#6b7280"}}>{REC_EST[r.estado]?.label||r.estado}</span>
                      <span style={{fontSize:10,color:"#9ca3af"}}>{r.fecha}</span>
                    </div>
                    <div style={{fontSize:13,fontWeight:600,color:"#111827"}}>{r.tipo}</div>
                    {(r.of||r.ref)&&<div style={{fontSize:11,color:"#6b7280",marginTop:2}}>OF: {r.of||"—"} · Ref: {r.ref||"—"}</div>}
                    <div style={{fontSize:12,color:"#374151",marginTop:6,background:"#f8fafc",borderRadius:6,padding:"8px 10px",lineHeight:1.5}}>{r.desc}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal reclamación */}
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:700,padding:16}}
          onClick={e=>{if(e.target===e.currentTarget)setModal(false);}}>
          <div style={{background:"#fff",borderRadius:12,width:500,maxWidth:"98%",boxShadow:"0 25px 60px rgba(0,0,0,.3)",overflow:"hidden"}}>
            <div style={{background:"#dc2626",padding:"14px 20px",color:"#fff"}}>
              <div style={{fontSize:15,fontWeight:700}}>🚨 Poner una reclamación de calidad</div>
              <div style={{fontSize:11,opacity:.85,marginTop:2}}>Tu reclamación llegará directamente al departamento de calidad de Torres Gumà</div>
            </div>
            <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><label style={sLbl}>Nº OF (si aplica)</label><input value={form.of} onChange={ff("of")} style={sInp} placeholder="ej. 48545"/></div>
                <div><label style={sLbl}>Referencia</label><input value={form.ref} onChange={ff("ref")} style={sInp} placeholder="ej. 208322..."/></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <label style={sLbl}>Tipo de reclamación</label>
                  <select value={form.tipo} onChange={ff("tipo")} style={sInp}>
                    {["No conformidad","Defecto de recubrimiento","Espesor fuera de especificación","Resistencia corrosión insuficiente","Aspecto visual","Daño en pieza","Entrega incorrecta","Documentación incompleta","Otro"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={sLbl}>Urgencia</label>
                  <select value={form.urgencia} onChange={ff("urgencia")} style={sInp}>
                    {["Normal","Alta","Urgente"].map(u=><option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={sLbl}>Descripción de la incidencia *</label>
                <textarea value={form.desc} onChange={ff("desc")} rows={4}
                  placeholder="Describe con detalle qué ha ocurrido, cuándo lo has detectado, cuántas piezas están afectadas y cualquier otra información relevante..."
                  style={{...sInp,resize:"vertical",fontFamily:"inherit"}}/>
              </div>
            </div>
            <div style={{padding:"12px 20px",borderTop:"1px solid #f3f4f6",display:"flex",gap:10,justifyContent:"flex-end",background:"#fafafa"}}>
              <button onClick={()=>setModal(false)} style={{background:"transparent",border:"1px solid #d1d5db",color:"#374151",borderRadius:7,padding:"8px 16px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Cancelar</button>
              <button onClick={enviarReclamacion} disabled={!form.desc.trim()}
                style={{background:form.desc.trim()?"#dc2626":"#94a3b8",color:"#fff",border:"none",borderRadius:7,padding:"8px 20px",fontSize:12,fontWeight:700,cursor:form.desc.trim()?"pointer":"not-allowed"}}>
                🚨 Enviar reclamación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const NAV_PORTAL = [
  {id:"dashboard",  label:"Dashboard",        icon:"🏠"},
  {id:"ofs",        label:"Mis OFs",           icon:"🏭"},
  {id:"homs",       label:"Homologaciones",    icon:"🔬"},
  {id:"ofertas",    label:"Ofertas",           icon:"📄"},
  {id:"albaranes",  label:"Albaranes",         icon:"📦"},
  {id:"calidad",     label:"Calidad",           icon:"🏅"},
  {id:"calculadora",  label:"Calculadora",       icon:"🧮"},
];

export default function PortalCliente({ onSalir }){
  const [cliente,setCliente] = useState(null);
  const [seccion,setSeccion] = useState("dashboard");
  const [ofertas,setOfertas] = useState([]);

  function onLogin(cli){
    setCliente(cli);
    setOfertas(OFERTAS_DEMO[cli.id]||[]);
  }

  if(!cliente) return <PortalLogin onLogin={onLogin}/>;

  const ofs    = OFS_DEMO[cliente.id]   ||[];
  const homs   = HOMS_DEMO[cliente.id]  ||[];
  const albs   = ALBARANES_DEMO[cliente.id]||[];
  const certs  = CERTS_DEMO[cliente.id] ||[];

  const pendBadge = {
    ofertas:    ofertas.filter(o=>o.estado==="enviada").length,
    calidad:certs.filter(c=>c.estado==="pendiente").length,
    homs:       homs.filter(h=>h.estado!=="homologado"&&h.estado!=="rechazado").length,
  };

  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"system-ui,-apple-system,sans-serif",background:"#f8fafc"}}>

      {/* Sidebar */}
      <div style={{width:220,background:"#0f172a",display:"flex",flexDirection:"column",flexShrink:0}}>
        {/* Header */}
        <div style={{padding:"20px 16px",borderBottom:"0.5px solid rgba(255,255,255,.1)"}}>
          <div style={{fontSize:14,fontWeight:800,color:"#fff",letterSpacing:"-.3px"}}>Torres Gumà</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginTop:1}}>Portal de cliente</div>
        </div>

        {/* Cliente */}
        <div style={{padding:"12px 16px",borderBottom:"0.5px solid rgba(255,255,255,.08)",background:"rgba(255,255,255,.04)"}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:"#2563eb",color:"#fff",fontWeight:700,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6}}>
            {cliente.nombre[0]}
          </div>
          <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,.9)",lineHeight:1.3}}>{cliente.nombre}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginTop:1}}>Código: {cliente.codigo}</div>
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:"8px 0",overflowY:"auto"}}>
          {NAV_PORTAL.map(it=>{
            const act = seccion===it.id;
            const badge = pendBadge[it.id];
            return(
              <div key={it.id} onClick={()=>setSeccion(it.id)}
                style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",cursor:"pointer",
                  background:act?"rgba(37,99,235,.35)":"transparent",
                  borderLeft:`2px solid ${act?"#2563eb":"transparent"}`,
                  color:act?"#93c5fd":"rgba(255,255,255,.6)",
                  fontSize:12,fontWeight:act?700:400,transition:"all .12s"}}>
                <span style={{fontSize:14}}>{it.icon}</span>
                <span style={{flex:1}}>{it.label}</span>
                {badge>0&&<span style={{fontSize:9,fontWeight:700,background:"#dc2626",color:"#fff",borderRadius:10,padding:"1px 5px"}}>{badge}</span>}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{padding:"12px 16px",borderTop:"0.5px solid rgba(255,255,255,.08)"}}>
          <button onClick={()=>setCliente(null)}
            style={{width:"100%",background:"transparent",border:"0.5px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.5)",borderRadius:6,padding:"7px",fontSize:11,cursor:"pointer"}}>
            ↩ Cerrar sesión
          </button>
          {onSalir&&(
            <button onClick={onSalir}
              style={{width:"100%",background:"transparent",border:"none",color:"rgba(255,255,255,.3)",padding:"5px",fontSize:10,cursor:"pointer",marginTop:4}}>
              Volver al ERP interno
            </button>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div style={{flex:1,overflowY:"auto",padding:28}}>
        {seccion==="dashboard"   &&<PortalDashboard cliente={cliente} ofs={ofs} homs={homs} ofertas={ofertas} albaranes={albs} certs={certs}/>}
        {seccion==="ofs"         &&<PortalOFs ofs={ofs}/>}
        {seccion==="homs"        &&<PortalHomologaciones homs={homs}/>}
        {seccion==="ofertas"     &&<PortalOfertas ofertas={ofertas} setOfertas={setOfertas}/>}
        {seccion==="albaranes"   &&<PortalAlbaranes albaranes={albs}/>}
        {seccion==="calidad"&&<PortalCalidad certs={certs}/>}
        {seccion==="calculadora"&&<PortalCalculadora cliente={cliente}/>}
      </div>
    </div>
  );
}
