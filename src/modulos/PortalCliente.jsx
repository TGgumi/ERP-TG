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
const NAV_PORTAL = [
  {id:"dashboard",  label:"Dashboard",        icon:"🏠"},
  {id:"ofs",        label:"Mis OFs",           icon:"🏭"},
  {id:"homs",       label:"Homologaciones",    icon:"🔬"},
  {id:"ofertas",    label:"Ofertas",           icon:"📄"},
  {id:"albaranes",  label:"Albaranes",         icon:"📦"},
  {id:"certificados",label:"Certificados",     icon:"🏅"},
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
    certificados:certs.filter(c=>c.estado==="pendiente").length,
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
        {seccion==="certificados"&&<PortalCertificados certs={certs}/>}
      </div>
    </div>
  );
}
