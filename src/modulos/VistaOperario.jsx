// src/modulos/VistaOperario.jsx
import { useState, useMemo, useContext } from "react";
import { ERPContext } from "../ERP";

// ─── OFs RAW ─────────────────────────────────────────────────────
const OFS_RAW = [
  {of:"51571",  ref:"28825261 T44",       cliente:"TUBSA AUTOMOCION",     proceso:"FOSFATADO + GRANALLADO + 2xKL120 + 2xNEGRO GZ", kg:1232,fentrega:"2026-03-08",kgCesta:{"GR-02":100,"TWIN44":40,"PRE-02":100},nPed:"1571"},
  {of:"51571b", ref:"28825261 T44",       cliente:"TUBSA AUTOMOCION",     proceso:"FOSFATADO + GRANALLADO + 2xKL120 + 2xNEGRO GZ", kg:310, fentrega:"2026-03-08",kgCesta:{"GR-02":100,"TWIN44":40,"PRE-02":100},nPed:"1571"},
  {of:"51815",  ref:"28855252010-AC T44", cliente:"TUBSA AUTOMOCION",     proceso:"FOSFATADO + GRANALLADO + 2xKL120 + 2xNEGRO GZ", kg:664, fentrega:"2026-03-10",kgCesta:{"TWIN44":45,"PRE-02":100,"GR-02":100},nPed:"1815"},
  {of:"51816",  ref:"28825261 T44",       cliente:"TUBSA AUTOMOCION",     proceso:"FOSFATADO + GRANALLADO + 2xKL120 + 2xNEGRO GZ", kg:1232,fentrega:"2026-03-10",kgCesta:{"GR-02":100,"TWIN44":40,"PRE-02":100},nPed:"1816"},
  {of:"51817",  ref:"28855252010-AC T44", cliente:"TUBSA AUTOMOCION",     proceso:"FOSFATADO + GRANALLADO + 2xKL120 + 2xNEGRO GZ", kg:1660,fentrega:"2026-03-08",kgCesta:{"TWIN44":45,"PRE-02":100,"GR-02":100},nPed:"1817"},
  {of:"51720",  ref:"28855252-T44",       cliente:"TUBSA AUTOMOCION",     proceso:"FOSFATADO + 3xKL100 + 1xVH302",                 kg:87,  fentrega:"2026-03-08",kgCesta:{"PRE-02":30,"TWIN44":40},nPed:"1720"},
  {of:"51721",  ref:"3117500.44",         cliente:"ELAY LAN S.L.U.",      proceso:"FOSFATADO + 2xKL100 + 1xPLATA",                 kg:329, fentrega:"2026-03-15",kgCesta:{"TWIN44":80,"PRE-02":100},nPed:"1721"},
  {of:"51863",  ref:"151465002-64125 T44",cliente:"A.RAYMOND TECNIACERO", proceso:"FOSFATADO + GRANALLADO + 1xKL100 + 1xPLATA",   kg:478, fentrega:"2026-03-14",kgCesta:{"PRE-02":100,"TWIN44":80},nPed:"1863"},
  {of:"51863b", ref:"151465002-64125 T44",cliente:"A.RAYMOND TECNIACERO", proceso:"FOSFATADO + GRANALLADO + 1xKL100 + 1xPLATA",   kg:479, fentrega:"2026-03-14",kgCesta:{"PRE-02":100,"TWIN44":80},nPed:"1863"},
  {of:"51986",  ref:"8100484951",         cliente:"TSF-NAVARRA TEC.SOLD.",proceso:"FOSFATADO + 3xKL100 + 1xPLATA",                kg:203, fentrega:"2026-03-31",kgCesta:{"PRE-02":100,"TWIN02":60},nPed:"1986"},
  {of:"51988",  ref:"810G340869-T44",     cliente:"TSF-NAVARRA TEC.SOLD.",proceso:"FOSFATADO + GRANALLADO + 2xKL100 + 2xNEGRO GZ",kg:768, fentrega:"2026-03-21",kgCesta:{"PRE-02":100,"GR-02":100,"TWIN44":80},nPed:"1988"},
  {of:"51988b", ref:"810G340869-T44",     cliente:"TSF-NAVARRA TEC.SOLD.",proceso:"FOSFATADO + GRANALLADO + 2xKL100 + 2xNEGRO GZ",kg:384, fentrega:"2026-03-21",kgCesta:{"PRE-02":100,"GR-02":100,"TWIN44":80},nPed:"1988"},
  {of:"52004",  ref:"151465002 T44",      cliente:"A.RAYMOND TECNIACERO", proceso:"FOSFATADO + GRANALLADO + 1xKL100 + 1xPLATA",   kg:462, fentrega:"2026-03-23",kgCesta:{"PRE-02":100,"TWIN44":80},nPed:"2004"},
  {of:"52004b", ref:"151465002 T44",      cliente:"A.RAYMOND TECNIACERO", proceso:"FOSFATADO + GRANALLADO + 1xKL100 + 1xPLATA",   kg:1852,fentrega:"2026-03-23",kgCesta:{"PRE-02":100,"TWIN44":80},nPed:"2004"},
  {of:"51663",  ref:"3117100.44",         cliente:"ELAY LAN S.L.U.",      proceso:"FOSFATADO + GRANALLADO + 2xNEGRO GZ",           kg:90,  fentrega:"2026-03-12",kgCesta:{"TWIN02":80,"PRE-02":100,"GR-02":100},nPed:"1663"},
  {of:"51928",  ref:"3117100.44",         cliente:"ELAY LAN S.L.U.",      proceso:"FOSFATADO + GRANALLADO + 2xNEGRO GZ",           kg:1472,fentrega:"2026-03-17",kgCesta:{"TWIN02":80,"PRE-02":100,"GR-02":100},nPed:"1928"},
  {of:"51929",  ref:"28825261-GR T44",    cliente:"TUBSA AUTOMOCION",     proceso:"GRANALLADO + 1xKL120 + 2xPLATA",                kg:629, fentrega:"2026-03-08",kgCesta:{"GR-02":80,"TWIN44":60},nPed:"1929"},
  {of:"51930",  ref:"28825261-BC T44",    cliente:"TUBSA AUTOMOCION",     proceso:"FOSFATADO + 2xKL120 + 3xNEGRO GZ",             kg:439, fentrega:"2026-03-28",kgCesta:{"PRE-02":100,"TWIN44":80},nPed:"1930"},
  {of:"51796",  ref:"151465002-64125",    cliente:"A.RAYMOND TECNIACERO", proceso:"FOSFATADO + 2xKL100",                           kg:277, fentrega:"2026-03-12",kgCesta:{"PRE-02":60,"TWIN44":45},nPed:"1796"},
  // MN
  {of:"51601",  ref:"CLIP MANETA RO",     cliente:"ITW ESPAÑA",           proceso:"FOSFATADO + GRANALLADO + 2xNEGRO GZ",           kg:800, fentrega:"2026-03-22",kgCesta:{"MN-01":40,"PRE-01":100,"GR-01":100},nPed:"1601"},
  {of:"51602",  ref:"306 CLIP DT",        cliente:"SINARD S.A.",           proceso:"FOSFATADO + GRANALLADO + 2xNEGRO GZ",           kg:500, fentrega:"2026-03-25",kgCesta:{"MN-01":50,"PRE-01":100,"GR-01":100},nPed:"1602"},
  {of:"51603",  ref:"VRH-6T 210",         cliente:"SINARD S.A.",           proceso:"FOSFATADO + GRANALLADO + 1xVH302",             kg:320, fentrega:"2026-03-20",kgCesta:{"MN-01":60,"PRE-01":100},nPed:"1603"},
  {of:"51187",  ref:"CLIP",               cliente:"TORRES GUMA S.L.",      proceso:"FOSFATADO + GRANALLADO + 3xKL100",             kg:3000,fentrega:"2026-02-14",kgCesta:{"MN-01":30},nPed:"1187"},
  // Bastidor
  {of:"51198",  ref:"810G340869",         cliente:"TSF-NAVARRA TEC.SOLD.",proceso:"FOSFATADO + GRANALLADO + 2xKL100",             kg:360, fentrega:"2026-02-17",kgCesta:{"GR-BAST":2,"DE02":100,"MN Bastid":100},nPed:"1198"},
  {of:"51229",  ref:"810A620663",         cliente:"TSF-NAVARRA TEC.SOLD.",proceso:"FOSFATADO + GRANALLADO + 2xKL100",             kg:225, fentrega:"2026-02-18",kgCesta:{"GR-BAST":2,"DE02":100,"MN Bastid":100},nPed:"1229"},
  {of:"51927",  ref:"BAST-3xKL120",       cliente:"MATZ-ERREKA S.COOP.",  proceso:"FOSFATADO + GRANALLADO + 3xKL120 + 1xNEGRO GZ",kg:729, fentrega:"2026-03-17",kgCesta:{"MN Bastid":100,"GR-BAST":7},nPed:"1927"},
  {of:"51849",  ref:"BASTIDOR-01",        cliente:"PENDIENTE",             proceso:"FOSFATADO + GRANALLADO",                       kg:753, fentrega:"2026-03-24",kgCesta:{"MN Bastid":15,"GR-BAST":10},nPed:"1849"},
  // DC02
  {of:"51987",  ref:"8300179895",         cliente:"TSF-NAVARRA TEC.SOLD.",proceso:"FOSFATADO + DESACEITADO",                      kg:867, fentrega:"2026-03-21",kgCesta:{"DC02":160},nPed:"1987"},
  {of:"51987b", ref:"8300179895",         cliente:"TSF-NAVARRA TEC.SOLD.",proceso:"FOSFATADO + DESACEITADO",                      kg:2604,fentrega:"2026-03-21",kgCesta:{"DC02":160},nPed:"1987"},
];

// ─── MOTOR HORNOS ─────────────────────────────────────────────────
const HOY=new Date("2026-03-20");
const HMIN=34,HMAX=45;

// ─── CODE 39 ─────────────────────────────────────────────────────
const C39_MAP = {
  '0':'000110100','1':'100100001','2':'001100001','3':'101100000',
  '4':'000110001','5':'100110000','6':'001110000','7':'000100101',
  '8':'100100100','9':'001100100','A':'100001001','B':'001001001',
  'C':'101001000','D':'000011001','E':'100011000','F':'001011000',
  'G':'000001101','H':'100001100','I':'001001100','J':'000011100',
  'K':'100000011','L':'001000011','M':'101000010','N':'000010011',
  'O':'100010010','P':'001010010','Q':'000000111','R':'100000110',
  'S':'001000110','T':'000010110','U':'110000001','V':'011000001',
  'W':'111000000','X':'010010001','Y':'110010000','Z':'011010000',
  '-':'000100011','.':'100100010',' ':'011000010','$':'010101000',
  '/':'010100010','+':'010001010','%':'000101010','*':'010010100',
};
function Barcode39({text, height=40, narrow=1.5, wide=4, quiet=8}){
  const full='*'+text.toUpperCase()+'*';
  const invalid=[...full].find(c=>!C39_MAP[c]);
  if(invalid) return null;
  let x=quiet;
  const rects=[];
  [...full].forEach((ch,ci)=>{
    const pat=C39_MAP[ch];
    for(let i=0;i<9;i++){
      const w=pat[i]==='1'?wide:narrow;
      if(i%2===0) rects.push({x,w});
      x+=w;
    }
    if(ci<full.length-1) x+=narrow;
  });
  const totalW=x+quiet;
  return(
    <svg width={totalW} height={height+14} style={{display:"block",maxWidth:"100%"}}>
      {rects.map((r,i)=><rect key={i} x={r.x} y={0} width={r.w} height={height} fill="#000"/>)}
      <text x={totalW/2} y={height+11} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#374151" letterSpacing="1">{text}</text>
    </svg>
  );
}

const MPC={"MN-01":4.5,"TWIN44":4.5,"TWIN02":4.5,"PRE-02":5,"GR-02":5,"PRE-01":5,"GR-01":5,"DE02":20,"DB02":20,"GR-BAST":15,"MN Bastid":12,"DC02":5};

// Orden global del proceso — de izquierda a derecha
const RUTA_ORDEN = ["PRE-01","PRE-02","DC02","DE02","DB02","GR-01","GR-02","GR-BAST","MN-01","MN Bastid","TWIN44","TWIN02","MALLADO"];

// Devuelve true si la máquina maqId puede confirmar la OF
// (todas las máquinas anteriores en la ruta ya la han confirmado)
function puedeConfirmar(of_, maqId, confirmadas) {
  const maqsOf = Object.keys(of_.kgCesta || {});
  const idxActual = RUTA_ORDEN.indexOf(maqId);
  // Máquinas anteriores en la ruta que también procesan esta OF
  const anteriores = maqsOf.filter(m => RUTA_ORDEN.indexOf(m) < idxActual && RUTA_ORDEN.indexOf(m) >= 0);
  // Todas deben estar confirmadas (clave: "ofId:maqId")
  return anteriores.every(m => confirmadas.has(`${of_.of}:${m}`));
}
// Máquinas anteriores pendientes (para mostrar mensaje)
function maqsPendientes(of_, maqId, confirmadas) {
  const maqsOf = Object.keys(of_.kgCesta || {});
  const idxActual = RUTA_ORDEN.indexOf(maqId);
  return maqsOf.filter(m => RUTA_ORDEN.indexOf(m) < idxActual && RUTA_ORDEN.indexOf(m) >= 0 && !confirmadas.has(`${of_.of}:${m}`));
}

function fam(p){
  const t=p||"";
  if(/VH30/i.test(t))return"VH";
  if(/DELTA[\s-]?LUBE/i.test(t))return"DL";
  if(/KL1[02]0|DELTATONE/i.test(t)&&/NEGRO/i.test(t))return"BC+N";
  if(/KL1[02]0|DELTATONE/i.test(t)&&/PLATA/i.test(t))return"BC+P";
  if(/KL1[02]0|DELTATONE/i.test(t))return"BC";
  if(/NEGRO/i.test(t))return"NEG";
  return"OTR";
}
const FC={"BC":"#185FA5","BC+N":"#1f2937","BC+P":"#64748b","NEG":"#374151","VH":"#0F6E56","DL":"#6d28d9","OTR":"#78716c"};
function atr(fe){if(!fe)return 0;const d=new Date(fe);return d<HOY?Math.floor((HOY-d)/86400000):0;}
function sem(fe){if(!fe)return"g";const d=new Date(fe);if(d<HOY)return"r";return Math.floor((d-HOY)/86400000)<=3?"y":"v";}
function cic(o,m){const k=o.kgCesta[m];return(k&&k>0&&o.kg>0)?o.kg/k:0;}
const SC={r:{bg:"#fef2f2",bd:"#fca5a5",tx:"#b91c1c"},y:{bg:"#fefce8",bd:"#fde68a",tx:"#854d0e"},v:{bg:"#f0fdf4",bd:"#bbf7d0",tx:"#166534"},g:{bg:"#f9fafb",bd:"#e5e7eb",tx:"#6b7280"}};

function planificar(ofs,maq){
  let c=ofs.filter(o=>o.kg>0&&(o.kgCesta[maq]||0)>0).map(o=>({...o,fam:fam(o.proceso),ciclos:cic(o,maq),horno:0,orden:0}));
  if(!c.length)return[];
  const FAMS=["BC","BC+N","NEG","BC+P","VH","DL","OTR"];
  let hn=1,it=0;
  while(c.some(o=>o.horno===0)&&it<300){
    it++;const lib=c.filter(o=>o.horno===0);if(!lib.length)break;
    let bF=null,bS=null;
    for(const f of FAMS){
      const rows=lib.filter(o=>o.fam===f).sort((a,b)=>atr(b.fentrega)-atr(a.fentrega));
      if(!rows.length)continue;
      let tot=0,cnt=0;
      for(const r of rows){if(tot+r.ciclos<=HMAX){tot+=r.ciclos;cnt++;if(tot>=HMIN)break;}}
      if(f==="BC+N"&&tot<HMIN){for(const r of lib.filter(o=>o.fam==="NEG")){if(tot+r.ciclos<=HMAX){tot+=r.ciclos;cnt++;if(tot>=HMIN)break;}}}
      if(!cnt)continue;
      const sc={a:atr(rows[0].fentrega),fe:new Date(rows[0].fentrega).getTime()};
      if(!bF||sc.a>bS.a||(sc.a===bS.a&&sc.fe<bS.fe)){bF=f;bS=sc;}
    }
    if(!bF){lib.slice(0,1).forEach(o=>{o.horno=hn;o.orden=1;});hn++;continue;}
    const rows=lib.filter(o=>o.fam===bF).sort((a,b)=>atr(b.fentrega)-atr(a.fentrega));
    const sel=[],used=new Set();let tot=0;
    for(const r of rows){if(tot+r.ciclos<=HMAX){sel.push(r);used.add(r);tot+=r.ciclos;if(tot>=HMIN)break;}}
    if(bF==="BC+N"&&tot<HMIN){for(const r of lib.filter(o=>o.fam==="NEG"&&!used.has(o))){if(tot+r.ciclos<=HMAX){sel.push(r);used.add(r);tot+=r.ciclos;if(tot>=HMIN)break;}}}
    if(!sel.length){lib.filter(o=>o.fam===bF).slice(0,1).forEach(o=>{o.horno=hn;o.orden=1;});hn++;continue;}
    sel.sort((a,b)=>atr(b.fentrega)-atr(a.fentrega));sel.forEach((o,i)=>{o.horno=hn;o.orden=i+1;});hn++;
  }
  return c.sort((a,b)=>a.horno-b.horno||a.orden-b.orden);
}

// ─── MÁQUINAS ─────────────────────────────────────────────────────
const PLANTAS = ["Vitoria","Esparreguera"];
const PLANTA_COL = {
  "Vitoria":      {bg:"#1e3a5f",tx:"#fff",bd:"#3b82f6",light:"#eff6ff",lightTx:"#1d4ed8"},
  "Esparreguera": {bg:"#14532d",tx:"#fff",bd:"#22c55e",light:"#f0fdf4",lightTx:"#166534"},
};
const MAQUINAS_LIST=[
  // ── VITORIA ──────────────────────────────────────────────────────
  {id:"PRE-02",   linea:"TWIN",     tipo:"Pretratamiento",usaHornos:false, planta:"Vitoria"},
  {id:"GR-02",    linea:"TWIN",     tipo:"Granallado",    usaHornos:false, planta:"Vitoria"},
  {id:"TWIN44",   linea:"TWIN",     tipo:"Recubrimiento", usaHornos:true,  planta:"Vitoria"},
  {id:"TWIN02",   linea:"TWIN",     tipo:"Recubrimiento", usaHornos:true,  planta:"Vitoria"},
  {id:"DB02",     linea:"BASTIDOR", tipo:"Desengrasado",  usaHornos:false, planta:"Vitoria"},
  {id:"DE02",     linea:"DESENG.",  tipo:"Desengrasado",  usaHornos:false, planta:"Vitoria"},
  {id:"GR-BAST",  linea:"BASTIDOR", tipo:"Granallado",    usaHornos:false, planta:"Vitoria"},
  {id:"MN Bastid",linea:"BASTIDOR", tipo:"Recubrimiento", usaHornos:false, planta:"Vitoria"},
  {id:"DC02",     linea:"DESAC.",   tipo:"Desaceitado",   usaHornos:false, planta:"Vitoria"},
  {id:"MALLADO",  linea:"MALLADO",  tipo:"Mallado",       usaHornos:false, planta:"Vitoria"},
  // ── ESPARREGUERA ─────────────────────────────────────────────────
  {id:"PRE-01",   linea:"MN",       tipo:"Pretratamiento",usaHornos:false, planta:"Esparreguera"},
  {id:"GR-01",    linea:"MN",       tipo:"Granallado",    usaHornos:false, planta:"Esparreguera"},
  {id:"MN-01",    linea:"MN",       tipo:"Recubrimiento", usaHornos:true,  planta:"Esparreguera"},
];

const EC={"Produciendo":{bg:"#166534",bd:"#22c55e",tx:"#fff"},"Espera":{bg:"#1e40af",bd:"#60a5fa",tx:"#fff"},"Avería":{bg:"#991b1b",bd:"#ef4444",tx:"#fff"},"Parada":{bg:"#374151",bd:"#9ca3af",tx:"#fff"},"Ajuste":{bg:"#92400e",bd:"#f59e0b",tx:"#fff"},"Limpieza":{bg:"#5b21b6",bd:"#a78bfa",tx:"#fff"},"Mantenimiento":{bg:"#78350f",bd:"#fbbf24",tx:"#fff"}};
const LINEA_C={"TWIN":"#185FA5","MN":"#0F6E56","BASTIDOR":"#92400e","DESAC.":"#5b21b6","MALLADO":"#374151","DESENG.":"#0e7490"};

// ─── COMPONENTES ──────────────────────────────────────────────────
function FTag({f}){
  const c=FC[f]||"#888";
  return<span style={{display:"inline-flex",padding:"1px 5px",borderRadius:4,fontSize:9.5,fontWeight:700,background:c+"22",color:c,border:`0.5px solid ${c}55`}}>{f}</span>;
}

function OFRow({o,maq,onNC,onOK,onDeshacer,onDeshacerNC,operario,fichas,confirmadas,bloqueadas}){
  const s=SC[sem(o.fentrega)];
  const c=cic(o,maq);
  const a=atr(o.fentrega);
  const mpc=MPC[maq]||0;
  const conf=confirmadas.has(`${o.of}:${maq}`);
  const bloq=(bloqueadas||[]).find(b=>b.ofId===o.of);
  const puede=puedeConfirmar(o,maq,confirmadas);
  const pendientes=maqsPendientes(o,maq,confirmadas);

  return(
    <div style={{background:bloq?"#fef2f2":conf?"#f0fdf4":s.bg,border:`0.5px solid ${bloq?"#fca5a5":conf?"#86efac":s.bd}`,borderRadius:8,padding:"8px 10px",display:"grid",gridTemplateColumns:"22px 1fr auto",gap:8,alignItems:"start",opacity:conf?.75:1}}>
      <div style={{width:20,height:20,borderRadius:"50%",background:bloq?"#ef4444":conf?"#22c55e":!puede?"#f1f5f9":"rgba(0,0,0,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:bloq||conf?"white":s.tx,flexShrink:0,marginTop:2}}>
        {bloq?"🔒":conf?"✓":!puede?"⏳":o.orden||1}
      </div>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2,flexWrap:"wrap"}}>
          <span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:bloq?"#b91c1c":conf?"#166534":s.tx}}>OF-{o.of}</span>
          <FTag f={o.fam}/>
          {a>0&&<span style={{fontSize:9,fontWeight:700,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5",padding:"1px 5px",borderRadius:3}}>⚠ {a}d atraso</span>}
          {bloq&&<span style={{fontSize:9,fontWeight:700,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5",padding:"1px 5px",borderRadius:3}}>🔒 BLOQUEADA — NOK {bloq.tipo}</span>}
        </div>
        <div style={{fontSize:11,color:s.tx,opacity:.85,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:220}}>{o.cliente}</div>
        <div style={{fontSize:10.5,color:s.tx,opacity:.7,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:220}}>{o.proceso}</div>
        <div style={{fontSize:10,color:s.tx,opacity:.55,marginTop:1}}>ref: {o.ref}</div>
        {(()=>{const fot=(fichas||[]).find(f=>f.ref_cli===o.ref||f.desc===o.ref)?.foto;return fot?<img src={fot} alt={o.ref} style={{marginTop:5,width:48,height:48,objectFit:"cover",borderRadius:6,border:"1px solid #e2e8f0"}}/>:null;})()}
        {o.nPed&&o.cli!=null&&(
          <div style={{marginTop:6,background:"#fff",borderRadius:6,border:"1px solid #e2e8f0",padding:"5px 8px",display:"inline-block"}}>
            <Barcode39 text={`OF-${String(o.cli||"000").padStart(3,"0")}${o.nPed}`}/>
          </div>
        )}
        {/* Ruta de proceso */}
        <div style={{display:"flex",gap:3,marginTop:4,flexWrap:"wrap",alignItems:"center"}}>
          {RUTA_ORDEN.filter(m=>o.kgCesta[m]).map((m,i,arr)=>{
            const confM=confirmadas.has(`${o.of}:${m}`);
            const esActual=m===maq;
            return(
              <span key={m} style={{display:"flex",alignItems:"center",gap:3}}>
                <span style={{fontSize:9,fontWeight:esActual?700:500,padding:"1px 6px",borderRadius:4,
                  background:confM?"#f0fdf4":esActual?"#eff6ff":"#f1f5f9",
                  color:confM?"#166534":esActual?"#1d4ed8":"#9ca3af",
                  border:`0.5px solid ${confM?"#86efac":esActual?"#93c5fd":"#e2e8f0"}`}}>
                  {confM?"✓ ":""}{m}
                </span>
                {i<arr.filter(m2=>o.kgCesta[m2]).length-1&&<span style={{fontSize:8,color:"#d1d5db"}}>→</span>}
              </span>
            );
          })}
        </div>
        {!puede&&!conf&&!bloq&&pendientes.length>0&&(
          <div style={{fontSize:10,color:"#92400e",marginTop:3,background:"#fffbeb",border:"0.5px solid #fde68a",borderRadius:4,padding:"2px 7px",display:"inline-block"}}>
            ⏳ Pendiente: {pendientes.join(", ")}
          </div>
        )}
        {bloq&&<div style={{fontSize:10,color:"#b91c1c",marginTop:3,fontStyle:"italic"}}>Pendiente revisión en Calidad · {bloq.fecha}</div>}
      </div>
      <div style={{textAlign:"right",flexShrink:0}}>
        <div style={{fontFamily:"monospace",fontWeight:700,fontSize:14,color:bloq?"#b91c1c":conf?"#166534":s.tx}}>{o.kg.toLocaleString()} kg</div>
        <div style={{fontSize:10,color:s.tx,opacity:.8}}>{o.fentrega?.slice(5)}</div>
        <div style={{fontSize:10,color:s.tx,opacity:.6}}>{c.toFixed(1)} cic.{mpc>0?` · ${(c*mpc).toFixed(0)}min`:""}</div>
        {conf&&!bloq&&(
          <div style={{display:"flex",gap:4,marginTop:6,justifyContent:"flex-end"}}>
            <button onClick={()=>onDeshacer&&onDeshacer(o)} style={{fontSize:10,padding:"3px 9px",borderRadius:5,cursor:"pointer",background:"rgba(234,179,8,.15)",border:"0.5px solid rgba(234,179,8,.5)",color:"#854d0e",fontWeight:700}}>↩ Deshacer</button>
          </div>
        )}
        {!conf&&!bloq&&(
          <div style={{display:"flex",gap:4,marginTop:6,justifyContent:"flex-end"}}>
            {puede?(
              <>
                {(!operario||operario==="Sin asignar")?(
                  <span title="Asigna un operario antes de confirmar" style={{fontSize:10,padding:"3px 9px",borderRadius:5,background:"#f1f5f9",border:"0.5px solid #e2e8f0",color:"#9ca3af",cursor:"not-allowed",display:"inline-block"}}>✓ OK</span>
                ):(
                  <button onClick={()=>onOK(o)} style={{fontSize:10,padding:"3px 9px",borderRadius:5,cursor:"pointer",background:"rgba(34,197,94,.2)",border:"0.5px solid rgba(34,197,94,.5)",color:"#166534",fontWeight:700}}>✓ OK</button>
                )}
                <button onClick={()=>onNC(o)} style={{fontSize:10,padding:"3px 9px",borderRadius:5,cursor:"pointer",background:"rgba(239,68,68,.15)",border:"0.5px solid rgba(239,68,68,.4)",color:"#b91c1c",fontWeight:700}}>✕ NC</button>
              </>
            ):(
              <span style={{fontSize:10,color:"#9ca3af",padding:"3px 8px",background:"#f1f5f9",borderRadius:5,border:"0.5px solid #e2e8f0"}}>⏳ Esperando paso anterior</span>
            )}
          </div>
        )}
        {bloq&&(
          <div style={{display:"flex",gap:4,marginTop:6,justifyContent:"flex-end",alignItems:"center"}}>
            <span style={{fontSize:9,color:"#b91c1c",fontWeight:600}}>🔒 Revisión pendiente</span>
            <button onClick={()=>onDeshacerNC&&onDeshacerNC(o,bloq)} style={{fontSize:10,padding:"3px 9px",borderRadius:5,cursor:"pointer",background:"rgba(234,179,8,.15)",border:"0.5px solid rgba(234,179,8,.5)",color:"#854d0e",fontWeight:700}}>↩ Deshacer NC</button>
          </div>
        )}
      </div>
    </div>
  );
}

function HornoCard({maq,num,ofs_h,onNC,onOK,onDeshacer,onDeshacerNC,operario,fichas,confirmadas,bloqueadas}){
  const [open,setOpen]=useState(true);
  const tot=ofs_h.reduce((s,o)=>s+cic(o,maq),0);
  const ok=tot>=HMIN&&tot<=HMAX;
  const mpc=MPC[maq]||0;
  const hrs=mpc>0?(tot*mpc/60).toFixed(1):"—";
  const f0=ofs_h[0]?.fam||"OTR";
  const hasAtr=ofs_h.some(o=>atr(o.fentrega)>0);
  const allConf=ofs_h.every(o=>confirmadas.has(`${o.of}:${maq}`));
  return(
    <div style={{marginBottom:8}}>
      <div onClick={()=>setOpen(!open)} style={{background:allConf?"#dcfce7":"#dce6f1",borderRadius:7,padding:"7px 12px",display:"flex",alignItems:"center",gap:8,border:`0.5px solid ${allConf?"#86efac":"#b8cfe8"}`,cursor:"pointer",userSelect:"none"}}>
        <span style={{fontSize:11,color:allConf?"#166534":"#1e3a5f"}}>{open?"▼":"►"}</span>
        <span style={{fontSize:12,fontWeight:700,color:allConf?"#166534":"#1e3a5f"}}>HORNO {num}</span>
        <FTag f={f0}/>
        <span style={{fontSize:11,fontFamily:"monospace",fontWeight:600,color:ok?"#166534":"#b91c1c"}}>{tot.toFixed(1)} / {HMAX} cic.</span>
        <span style={{fontSize:11,color:"#374151"}}>· {hrs}h</span>
        {!ok&&<span style={{fontSize:9,padding:"2px 6px",borderRadius:3,fontWeight:600,background:"#fffbeb",color:"#92400e",border:"0.5px solid #fde68a"}}>{tot<HMIN?"BAJO MIN":"SUPERA MÁX"}</span>}
        {hasAtr&&<span style={{fontSize:9,padding:"2px 6px",borderRadius:3,fontWeight:600,background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5"}}>⚠ ATRASADA</span>}
        {allConf&&<span style={{fontSize:9,padding:"2px 6px",borderRadius:3,fontWeight:700,background:"#dcfce7",color:"#166534",border:"0.5px solid #86efac"}}>✓ COMPLETADO</span>}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
          <div style={{height:7,width:70,background:"#c8daea",borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${Math.min(tot/HMAX*100,100)}%`,background:ok?"#22c55e":tot<HMIN?"#f59e0b":"#ef4444",borderRadius:3}}/>
          </div>
          <span style={{fontSize:10,color:"#64748b",whiteSpace:"nowrap"}}>{ofs_h.length} OFs</span>
        </div>
      </div>
      {open&&(
        <div style={{paddingLeft:6,paddingTop:5,display:"flex",flexDirection:"column",gap:4}}>
          {ofs_h.map((o,i)=><OFRow key={`${o.of}-${i}`} o={o} maq={maq} onNC={onNC} onOK={onOK} onDeshacer={onDeshacer} onDeshacerNC={onDeshacerNC} operario={operario} fichas={fichas} confirmadas={confirmadas} bloqueadas={bloqueadas}/>)}
        </div>
      )}
    </div>
  );
}

function VistaMaquina({maq,plan,usaHornos,est,onCambiarEst,operario,onCambiarOperario,onNC,onOK,onDeshacer,onDeshacerNC,fichas,confirmadas,bloqueadas}){
  const col=EC[est]||EC["Espera"];
  const hornos={};
  if(usaHornos){plan.forEach(o=>{const h=o.horno||1;if(!hornos[h])hornos[h]=[];hornos[h].push(o);});}
  const tKg=plan.reduce((s,o)=>s+o.kg,0);
  const atrasadas=plan.filter(o=>atr(o.fentrega)>0).length;
  const nConf=plan.filter(o=>confirmadas.has(`${o.of}:${maq}`)).length;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:0,height:"100%"}}>
      {/* Header máquina */}
      <div style={{background:col.bg,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",flexShrink:0}}>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:col.tx}}>{maq}</div>
          <div style={{fontSize:11,color:col.tx,opacity:.8,marginTop:1}}>
            {plan.length} OFs · {tKg.toLocaleString()} kg
            {atrasadas>0&&<span style={{marginLeft:8,fontWeight:700}}>· ⚠ {atrasadas} atrasadas</span>}
          </div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
          {nConf>0&&<span style={{fontSize:11,color:col.tx,opacity:.9}}>✓ {nConf}/{plan.length} confirmadas</span>}
          <div style={{display:"flex",flexDirection:"column",gap:3,alignItems:"flex-end"}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:10,color:"rgba(255,255,255,.7)",fontWeight:600}}>👷 Operario:</span>
              <select value={operario||"Sin asignar"} onChange={e=>onCambiarOperario&&onCambiarOperario(maq,e.target.value)}
                style={{fontSize:11,fontWeight:700,background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.4)",color:"white",borderRadius:6,padding:"4px 8px",cursor:"pointer",outline:"none"}}>
                {OPERARIOS.map(op=><option key={op} value={op} style={{background:"#1f2937",color:"white"}}>{op}</option>)}
              </select>
            </div>
            <select value={est} onChange={e=>onCambiarEst(maq,e.target.value)}
              style={{fontSize:11,fontWeight:600,background:"rgba(0,0,0,.25)",border:"1px solid rgba(255,255,255,.35)",color:"white",borderRadius:6,padding:"5px 10px",cursor:"pointer",outline:"none"}}>
              {Object.keys(EC).map(s=><option key={s} value={s} style={{background:"#1f2937",color:"white"}}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px"}}>
        {plan.length===0?(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:200,color:"#9ca3af",gap:8}}>
            <span style={{fontSize:32}}>—</span>
            <span style={{fontSize:13}}>Sin OFs asignadas a esta máquina</span>
          </div>
        ):usaHornos?(
          // Vista con hornos (TWIN44, TWIN02, MN-01)
          Object.entries(hornos).map(([h,ofs_h])=>(
            <HornoCard key={h} maq={maq} num={+h} ofs_h={ofs_h} onNC={onNC} onOK={onOK} onDeshacer={onDeshacer} onDeshacerNC={onDeshacerNC} operario={operario} fichas={fichas} confirmadas={confirmadas} bloqueadas={bloqueadas}/>
          ))
        ):(
          // Vista sin hornos — lista directa
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {plan.map((o,i)=><OFRow key={`${o.of}-${i}`} o={o} maq={maq} onNC={onNC} onOK={onOK} onDeshacer={onDeshacer} onDeshacerNC={onDeshacerNC} operario={operario} fichas={fichas} confirmadas={confirmadas} bloqueadas={bloqueadas}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MODAL NC ─────────────────────────────────────────────────────
function ModalNC({maqId,of_,onClose,onGuardar}){
  const [tipo,setTipo]=useState("Proceso interno");
  const [grav,setGrav]=useState("Menor");
  const [desc,setDesc]=useState("");
  const s={border:"0.5px solid #d1d5db",background:"#f9fafb",color:"#111827",padding:"7px 10px",borderRadius:6,fontSize:12,outline:"none",width:"100%",boxSizing:"border-box"};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"white",borderRadius:12,width:440,maxWidth:"96%",overflow:"hidden",boxShadow:"0 20px 40px rgba(0,0,0,.25)"}}>
        <div style={{padding:"14px 18px",borderBottom:"0.5px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:600,fontSize:14}}>Registrar No Conformidad</div>
            <div style={{fontSize:11,color:"#6b7280",marginTop:1}}>{maqId} · OF-{of_?.of} · {of_?.ref}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"#9ca3af"}}>✕</button>
        </div>
        <div style={{padding:18,display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:10.5,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em"}}>Tipo</label>
              <select value={tipo} onChange={e=>setTipo(e.target.value)} style={s}><option>Proceso interno</option><option>Reclamación cliente</option><option>Laboratorio</option><option>Manipulación</option></select>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:10.5,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em"}}>Gravedad</label>
              <select value={grav} onChange={e=>setGrav(e.target.value)} style={s}><option>Menor</option><option>Mayor</option><option>Crítica</option></select>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <label style={{fontSize:10.5,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em"}}>Descripción del defecto *</label>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={3} placeholder="Describe el problema observado…" style={{...s,resize:"vertical",fontFamily:"inherit"}}/>
          </div>
          {grav==="Crítica"&&<div style={{padding:"9px 12px",background:"#fef2f2",color:"#b91c1c",borderRadius:7,border:"0.5px solid #fca5a5",borderLeft:"3px solid #ef4444",fontSize:11.5}}>⚠ NC Crítica — se notificará a dirección y Calidad automáticamente</div>}
        </div>
        <div style={{padding:"12px 18px",borderTop:"0.5px solid #e5e7eb",display:"flex",justifyContent:"flex-end",gap:8}}>
          <button onClick={onClose} style={{border:"0.5px solid #d1d5db",background:"transparent",color:"#111827",padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:12}}>Cancelar</button>
          <button onClick={()=>{if(desc.trim()){onGuardar({maqId,of_,tipo,grav,desc});onClose();}}} disabled={!desc.trim()}
            style={{background:"#fef2f2",color:"#b91c1c",border:"0.5px solid #fca5a5",padding:"5px 14px",borderRadius:6,cursor:desc.trim()?"pointer":"not-allowed",fontSize:12,fontWeight:600,opacity:desc.trim()?1:.4}}>
            ✕ Registrar NC
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── CONTROLES DE PROCESO POR MÁQUINA ────────────────────────────
const MAQUINAS_CTRL = {
  "PRE-01":"Zirblast","PRE-02":"Zirblast",
  "DC02":"Zirblast","DE02":"Zirblast","DB02":"Zirblast",
  "GR-01":"Sulfato de cobre","GR-02":"Sulfato de cobre","GR-BAST":"Sulfato de cobre",
  "TWIN44":"Pintura","TWIN02":"Pintura","MN-01":"Pintura","MN Bastid":"Pintura",
};

function FotoInput({label, url, nombre, onFile, onClear, obligatoria=false}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em"}}>
        {label}{obligatoria&&<span style={{color:"#ef4444",marginLeft:3}}>*</span>}
      </label>
      <label style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",border:"2px dashed #d1d5db",borderRadius:8,cursor:"pointer",background:"#f9fafb"}}>
        <input type="file" accept="image/*" capture="environment" onChange={onFile} style={{display:"none"}}/>
        <span style={{fontSize:20}}>📷</span>
        <div>
          <div style={{fontSize:12,fontWeight:600,color:"#374151"}}>{nombre||"Seleccionar o tomar foto"}</div>
          <div style={{fontSize:10.5,color:"#9ca3af",marginTop:1}}>Cámara o galería</div>
        </div>
        {url&&<span style={{marginLeft:"auto",fontSize:10,color:"#166534",fontWeight:600}}>✓ Cargada</span>}
      </label>
      {url&&(
        <div style={{position:"relative",display:"inline-block"}}>
          <img src={url} alt={label} style={{width:"100%",maxHeight:160,objectFit:"cover",borderRadius:8,border:"1px solid #e5e7eb"}}/>
          <button onClick={onClear} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,.5)",border:"none",color:"#fff",borderRadius:"50%",width:22,height:22,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
      )}
    </div>
  );
}

function ModalControl({maqId, of_, onClose, onGuardar}){
  const tipo = MAQUINAS_CTRL[maqId];
  const esPintura = tipo === "Pintura";

  // Estado común
  const [resultado, setResultado] = useState("OK");
  const [obs,       setObs]       = useState("");

  // Zirblast / Sulfato
  const [valor,      setValor]      = useState("");
  const [fotoUrl,    setFotoUrl]    = useState(null);
  const [fotoNombre, setFotoNombre] = useState("");

  // Pintura — 5 fotos piezas + 1 foto cinta adherencia
  const [fotosPiezas,  setFotosPiezas]  = useState([null,null,null,null,null]);
  const [nombresPiezas,setNombresPiezas]= useState(["","","","",""]);
  const [fotoCinta,    setFotoCinta]    = useState(null);
  const [nombreCinta,  setNombreCinta]  = useState("");

  function handleFoto(e){ const f=e.target.files[0]; if(!f)return; setFotoUrl(URL.createObjectURL(f)); setFotoNombre(f.name); }
  function handlePieza(i,e){ const f=e.target.files[0]; if(!f)return; const u=[...fotosPiezas]; const n=[...nombresPiezas]; u[i]=URL.createObjectURL(f); n[i]=f.name; setFotosPiezas(u); setNombresPiezas(n); }
  function handleCinta(e){ const f=e.target.files[0]; if(!f)return; setFotoCinta(URL.createObjectURL(f)); setNombreCinta(f.name); }

  function guardar(){
    if(esPintura){
      onGuardar({ resultado, obs, genNC,
        fotosPiezas, nombresPiezas, fotoCinta, nombreCinta,
        fotoUrl: fotosPiezas[0], fotoNombre: nombresPiezas[0],
        valor: "Control pintura",
      });
    } else {
      onGuardar({ resultado, valor, obs, fotoUrl, fotoNombre, genNC });
    }
  }

  const esNOK = resultado === "NOK";
  const genNC = esNOK; // genera NC automáticamente si es NOK
  // Pintura: validar que haya al menos 1 foto pieza y la foto cinta
  const canSave = esPintura
    ? fotosPiezas.some(f=>f) && fotoCinta
    : true;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,padding:16}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:14,width:esPintura?580:480,maxWidth:"98%",maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 25px 60px rgba(0,0,0,.3)",overflow:"hidden"}}>

        {/* Header */}
        <div style={{padding:"16px 20px",borderBottom:"1px solid #f3f4f6",background:"#fafafa",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexShrink:0}}>
          <div>
            <div style={{fontWeight:700,fontSize:15,color:"#111827"}}>
              {esPintura?"🎨 Control de pintura":"🧪 Control de proceso — "+tipo}
            </div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{maqId} · OF-{of_?.of||"—"} · {of_?.cliente||""}</div>
          </div>
          <button onClick={onClose} style={{background:"#f3f4f6",border:"none",cursor:"pointer",width:30,height:30,borderRadius:"50%",fontSize:16,color:"#6b7280",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
        </div>

        {/* Body */}
        <div style={{flex:1,overflowY:"auto",padding:"18px 20px",display:"flex",flexDirection:"column",gap:14}}>

          {/* Resultado OK/NOK */}
          <div>
            <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:8}}>Resultado *</label>
            <div style={{display:"flex",gap:10}}>
              {["OK","NOK"].map(r=>(
                <button key={r} onClick={()=>setResultado(r)} style={{
                  flex:1,padding:"13px",borderRadius:10,cursor:"pointer",fontSize:15,fontWeight:700,border:"2px solid",
                  borderColor:resultado===r?(r==="OK"?"#22c55e":"#ef4444"):"#e5e7eb",
                  background:resultado===r?(r==="OK"?"#f0fdf4":"#fef2f2"):"#fff",
                  color:resultado===r?(r==="OK"?"#166534":"#b91c1c"):"#9ca3af",
                }}>{r==="OK"?"✓ OK":"✕ NOK"}</button>
              ))}
            </div>
          </div>

          {/* ── PINTURA ── */}
          {esPintura&&(<>
            <div style={{background:"#eff6ff",border:"0.5px solid #93c5fd",borderRadius:8,padding:"8px 12px",fontSize:11.5,color:"#1d4ed8"}}>
              📸 Fotografía visual de <strong>5 piezas</strong> y test de adherencia con cinta (1 pieza)
            </div>

            {/* Fotos 5 piezas */}
            <div>
              <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:8}}>
                Fotos inspección visual (5 piezas) <span style={{color:"#ef4444"}}>*</span>
              </label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6}}>
                {[0,1,2,3,4].map(i=>(
                  <label key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer"}}>
                    <input type="file" accept="image/*" capture="environment" onChange={e=>handlePieza(i,e)} style={{display:"none"}}/>
                    {fotosPiezas[i]?(
                      <div style={{position:"relative",width:"100%"}}>
                        <img src={fotosPiezas[i]} alt={`P${i+1}`} style={{width:"100%",aspectRatio:"1",objectFit:"cover",borderRadius:7,border:"2px solid #22c55e"}}/>
                        <button onClick={e=>{e.preventDefault();const u=[...fotosPiezas];const n=[...nombresPiezas];u[i]=null;n[i]="";setFotosPiezas(u);setNombresPiezas(n);}}
                          style={{position:"absolute",top:2,right:2,background:"rgba(0,0,0,.5)",border:"none",color:"#fff",borderRadius:"50%",width:18,height:18,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                      </div>
                    ):(
                      <div style={{width:"100%",aspectRatio:"1",borderRadius:7,border:"2px dashed #d1d5db",background:"#f9fafb",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3}}>
                        <span style={{fontSize:18,color:"#d1d5db"}}>📷</span>
                        <span style={{fontSize:9,color:"#9ca3af",fontWeight:600}}>P{i+1}</span>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Foto cinta adherencia */}
            <FotoInput
              label="Foto cinta adherencia"
              url={fotoCinta} nombre={nombreCinta}
              onFile={handleCinta}
              onClear={()=>{setFotoCinta(null);setNombreCinta("");}}
              obligatoria={true}
            />
          </>)}

          {/* ── ZIRBLAST / SULFATO ── */}
          {!esPintura&&(<>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em"}}>
                {tipo==="Zirblast"?"Concentración / resultado (g/L)":"Resultado sulfato Cu (Gt / descripción)"}
              </label>
              <input value={valor} onChange={e=>setValor(e.target.value)}
                placeholder={tipo==="Zirblast"?"ej. 12.5 g/L":"ej. Gt0 — sin cobre visible"}
                style={{border:"1.5px solid #d1d5db",borderRadius:8,padding:"9px 12px",fontSize:13,color:"#111827",background:"#fff",outline:"none",width:"100%",boxSizing:"border-box"}}/>
            </div>
            <FotoInput
              label="Foto de la pieza"
              url={fotoUrl} nombre={fotoNombre}
              onFile={handleFoto}
              onClear={()=>{setFotoUrl(null);setFotoNombre("");}}
              obligatoria={true}
            />
          </>)}

          {/* Observaciones */}
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em"}}>Observaciones</label>
            <textarea value={obs} onChange={e=>setObs(e.target.value)} rows={2}
              placeholder={esPintura?"Aspecto, brillo, defectos observados...":"Aspecto, anomalías, condiciones del baño..."}
              style={{border:"1.5px solid #d1d5db",borderRadius:8,padding:"9px 12px",fontSize:13,color:"#111827",background:"#fff",outline:"none",width:"100%",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit"}}/>
          </div>

          {/* NOK → aviso automático */}
          {esNOK&&(
            <div style={{padding:"12px 14px",background:"#fef2f2",border:"1.5px solid #fca5a5",borderRadius:8,display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{fontSize:20,flexShrink:0}}>⚠</span>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#b91c1c"}}>La OF quedará bloqueada</div>
                <div style={{fontSize:11,color:"#b91c1c",opacity:.85,marginTop:2}}>Se generará una NC automáticamente y la OF no se confirmará hasta que Calidad la revise y desbloquee.</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{padding:"14px 20px",borderTop:"1px solid #f3f4f6",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,background:"#fafafa",flexShrink:0}}>
          {esPintura&&!canSave&&<span style={{fontSize:11,color:"#9ca3af"}}>📷 Adjunta mín. 1 foto de pieza y la foto de cinta</span>}
          {(!esPintura||canSave)&&<span/>}
          <div style={{display:"flex",gap:10}}>
            <button onClick={onClose} style={{background:"transparent",border:"1px solid #d1d5db",color:"#374151",padding:"7px 16px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>Cancelar</button>
            <button onClick={guardar} disabled={!canSave} style={{background:esNOK?"#dc2626":"#16a34a",color:"#fff",border:"none",padding:"7px 18px",borderRadius:7,cursor:canSave?"pointer":"not-allowed",fontSize:12,fontWeight:700,opacity:canSave?1:.45}}>
              {esNOK?"⚠ Registrar NOK":"✓ Confirmar OK"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── OPERARIOS ────────────────────────────────────────────────────
const OPERARIOS = [
  "J. García","M. Torres","A. Martín","P. Ramos","D. Gil",
  "C. Font","J. Pérez","F. Cano","R. Mas","L. Vega","Sin asignar"
];
const TURNOS_DEF = ["Mañana","Tarde","Noche"];
const TURNO_COL = {
  "Mañana":  {bg:"#fef9c3",tx:"#854d0e",bd:"#fde68a"},
  "Tarde":   {bg:"#dbeafe",tx:"#1d4ed8",bd:"#93c5fd"},
  "Noche":   {bg:"#ede9fe",tx:"#5b21b6",bd:"#c4b5fd"},
  "Vacaciones":{bg:"#dcfce7",tx:"#166534",bd:"#86efac"},
  "Festivo": {bg:"#fee2e2",tx:"#b91c1c",bd:"#fca5a5"},
  "Libre":   {bg:"#f1f5f9",tx:"#64748b",bd:"#e2e8f0"},
};


// ─── CALENDARIO DE TURNOS ─────────────────────────────────────────
const TURNO_ICONO = {"Mañana":"🌅","Tarde":"🌆","Noche":"🌙","Vacaciones":"🏖","Festivo":"🎉","Libre":"—"};

function CalendarioTurnos(){
  const HOY2 = new Date();
  const [modo,   setModo]   = useState("bisemanal"); // "bisemanal" | "mensual"
  const [semana, setSemana] = useState(0); // offset semanas desde hoy (bisemanal: 0 = semana actual + siguiente)
  const [mes,    setMes]    = useState(HOY2.getMonth());
  const [año,    setAño]    = useState(HOY2.getFullYear());
  const [turnos, setTurnos] = useState({});
  const [propuestas, setPropuestas] = useState([]);
  const [modalAsig, setModalAsig] = useState(null); // {op, semanas: 1|2|'ambas'}
  const [modalProp,  setModalProp]  = useState(false);
  const [formProp,   setFormProp]   = useState({de:"",a:"",fecha:"",motivo:""});

  const MESES   = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const DIAS_L  = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
  const DIAS_S  = ["L","M","X","J","V","S","D"];

  function setTurno(fecha, op, val){ setTurnos(p=>({...p,[`${fecha}:${op}`]:val})); }
  function asignarRapido(op, turno, semIdx, soloLaborables){
    // semIdx: 0=sem1, 1=sem2, 2=ambas
    const inicio = semIdx===1 ? 7 : 0;
    const fin    = semIdx===0 ? 7 : 14;
    const updates = {};
    for(let i=inicio; i<fin; i++){
      const d = dias14[i];
      if(soloLaborables && esFinde(d)) continue;
      updates[`${fechaStr(d)}:${op}`] = turno;
    }
    setTurnos(p=>({...p,...updates}));
    setModalAsig(null);
  }
  function getTurno(fecha, op){ return turnos[`${fecha}:${op}`]||""; }
  const fechaStr = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const esHoyD   = (d) => fechaStr(d)===fechaStr(HOY2);
  const esFinde  = (d) => d.getDay()===0||d.getDay()===6;

  // ── Calcular los 14 días bisemanal ──────────────────────────────
  function getLunes(offset=0){
    const d = new Date(HOY2);
    const dow = d.getDay()===0?6:d.getDay()-1;
    d.setDate(d.getDate()-dow + offset*7);
    return d;
  }
  const lunes14 = getLunes(semana*2);
  const dias14  = Array.from({length:14},(_,i)=>{ const d=new Date(lunes14); d.setDate(d.getDate()+i); return d; });
  const sem1Label = `${dias14[0].getDate()}/${dias14[0].getMonth()+1}`;
  const sem2Label = `${dias14[7].getDate()}/${dias14[7].getMonth()+1}`;

  // ── Calcular días del mes ────────────────────────────────────────
  const diasMes  = new Date(año, mes+1, 0).getDate();
  const prevMes  = () => { if(mes===0){setMes(11);setAño(a=>a-1);}else setMes(m=>m-1); };
  const nextMes  = () => { if(mes===11){setMes(0);setAño(a=>a+1);}else setMes(m=>m+1); };
  const diasArr  = Array.from({length:diasMes},(_,i)=>new Date(año,mes,i+1));

  const dias = modo==="bisemanal" ? dias14 : diasArr;

  // ── Renderizar tabla ─────────────────────────────────────────────
  function TablaGrilla(){
    return(
      <div style={{overflowX:"auto"}}>
        <table style={{borderCollapse:"collapse",fontSize:10,width:"100%"}}>
          <thead>
            <tr>
              <th style={{padding:"6px 10px",textAlign:"left",fontWeight:700,color:"#374151",background:"#f8fafc",borderBottom:"1px solid #e2e8f0",position:"sticky",left:0,zIndex:2,minWidth:100}}>
                Operario
              </th>
              {modo==="bisemanal"&&(
                <>
                  <th colSpan={7} style={{textAlign:"center",padding:"4px 8px",fontSize:10,fontWeight:700,background:"#eff6ff",color:"#1d4ed8",borderBottom:"1px solid #e2e8f0",borderRight:"2px solid #93c5fd"}}>
                    Semana {sem1Label} – {dias14[6].getDate()}/{dias14[6].getMonth()+1}
                  </th>
                  <th colSpan={7} style={{textAlign:"center",padding:"4px 8px",fontSize:10,fontWeight:700,background:"#f0fdf4",color:"#166534",borderBottom:"1px solid #e2e8f0"}}>
                    Semana {sem2Label} – {dias14[13].getDate()}/{dias14[13].getMonth()+1}
                  </th>
                </>
              )}
              {modo==="mensual"&&dias.map((d,i)=>(
                <th key={i} style={{padding:"3px 2px",textAlign:"center",minWidth:28,fontSize:9,
                  fontWeight:esFinde(d)?700:500,
                  color:esHoyD(d)?"#2563eb":esFinde(d)?"#94a3b8":"#374151",
                  background:esHoyD(d)?"#eff6ff":"#f8fafc",
                  borderBottom:"1px solid #e2e8f0"}}>
                  <div>{DIAS_S[(d.getDay()===0?7:d.getDay())-1]}</div>
                  <div style={{fontWeight:700}}>{d.getDate()}</div>
                </th>
              ))}
            </tr>
            {modo==="bisemanal"&&(
              <tr>
                <th style={{background:"#f8fafc",borderBottom:"1px solid #e2e8f0",position:"sticky",left:0,zIndex:2}}/>
                {dias14.map((d,i)=>(
                  <th key={i} style={{padding:"3px 2px",textAlign:"center",minWidth:38,fontSize:9,
                    fontWeight:esFinde(d)?700:500,
                    color:esHoyD(d)?"#2563eb":esFinde(d)?"#94a3b8":"#374151",
                    background:esHoyD(d)?"#eff6ff":esFinde(d)?"#f8fafc":i<7?"#eff6ff22":"#f0fdf422",
                    borderBottom:"1px solid #e2e8f0",
                    borderRight:i===6?"2px solid #93c5fd":undefined}}>
                    <div>{DIAS_L[(d.getDay()===0?7:d.getDay())-1]}</div>
                    <div style={{fontWeight:700}}>{d.getDate()}/{d.getMonth()+1}</div>
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {OPERARIOS.filter(op=>op!=="Sin asignar").map((op,ri)=>(
              <tr key={op} style={{background:ri%2===0?"#fff":"#fafafa"}}>
                <td style={{padding:"4px 8px",fontWeight:600,color:"#374151",whiteSpace:"nowrap",
                  position:"sticky",left:0,background:ri%2===0?"#fff":"#fafafa",zIndex:1,
                  borderBottom:"0.5px solid #f1f5f9"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:11}}>{op}</span>
                    {modo==="bisemanal"&&(
                      <button onClick={()=>setModalAsig({op})}
                        title={`Asignación rápida para ${op}`}
                        style={{fontSize:9,padding:"1px 5px",borderRadius:3,cursor:"pointer",background:"#eff6ff",border:"0.5px solid #93c5fd",color:"#1d4ed8",fontWeight:700,lineHeight:1.4}}>
                        ⚡
                      </button>
                    )}
                  </div>
                </td>
                {dias.map((d,i)=>{
                  const f=fechaStr(d);
                  const t=getTurno(f,op);
                  const c=t?TURNO_COL[t]:null;
                  return(
                    <td key={i} style={{padding:2,textAlign:"center",
                      borderBottom:"0.5px solid #f1f5f9",
                      borderRight:(modo==="bisemanal"&&i===6)?"2px solid #93c5fd":undefined,
                      background:esHoyD(d)?"#eff6ff44":esFinde(d)?"#f8fafc":"transparent"}}>
                      <select value={t} onChange={e=>setTurno(f,op,e.target.value)}
                        title={`${op} · ${d.getDate()}/${d.getMonth()+1}`}
                        style={{fontSize:modo==="bisemanal"?10:9,padding:"2px 1px",
                          border:`0.5px solid ${c?c.bd:"#e2e8f0"}`,borderRadius:3,
                          background:c?c.bg:"#fff",color:c?c.tx:"#9ca3af",
                          cursor:"pointer",width:"100%",textAlign:"center",outline:"none",
                          minWidth:modo==="bisemanal"?36:24}}>
                        <option value="">·</option>
                        {Object.keys(TURNO_COL).map(tv=>(
                          <option key={tv} value={tv}>{TURNO_ICONO[tv]} {modo==="bisemanal"?tv:tv.slice(0,3)}</option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14,padding:16,height:"100%",overflowY:"auto"}}>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:"#111827"}}>📅 Turnos y calendario</div>
          <div style={{fontSize:12,color:"#6b7280"}}>Asignación de turnos M/T/N, vacaciones y festivos</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {/* Toggle modo */}
          <div style={{display:"flex",background:"#f1f5f9",borderRadius:8,padding:3,gap:2}}>
            {[["bisemanal","⊞ Bisemanal"],["mensual","📅 Mensual"]].map(([v,l])=>(
              <button key={v} onClick={()=>setModo(v)}
                style={{fontSize:11,padding:"5px 12px",borderRadius:6,cursor:"pointer",fontWeight:modo===v?700:500,
                  background:modo===v?"#fff":"transparent",color:modo===v?"#1d4ed8":"#6b7280",
                  border:modo===v?"1px solid #e2e8f0":"none",boxShadow:modo===v?"0 1px 3px rgba(0,0,0,.08)":"none"}}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={()=>setModalProp(true)}
            style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:8,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
            + Proponer cambio
          </button>
        </div>
      </div>

      {/* Navegación */}
      {modo==="bisemanal"?(
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setSemana(s=>s-1)} style={{background:"#f1f5f9",border:"0.5px solid #e2e8f0",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:14}}>‹</button>
          <div style={{fontSize:13,fontWeight:700,color:"#111827",minWidth:200,textAlign:"center"}}>
            {semana===0?"Esta semana + siguiente":semana<0?`${Math.abs(semana)*2} semanas atrás`:`${semana*2} semanas adelante`}
            <div style={{fontSize:10,color:"#9ca3af",fontWeight:400,marginTop:1}}>{sem1Label} — {dias14[13].getDate()}/{dias14[13].getMonth()+1}/{dias14[13].getFullYear()}</div>
          </div>
          <button onClick={()=>setSemana(s=>s+1)} style={{background:"#f1f5f9",border:"0.5px solid #e2e8f0",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:14}}>›</button>
          {semana!==0&&<button onClick={()=>setSemana(0)} style={{fontSize:10,padding:"4px 10px",borderRadius:6,cursor:"pointer",background:"#eff6ff",border:"0.5px solid #93c5fd",color:"#1d4ed8",fontWeight:600}}>Hoy</button>}
        </div>
      ):(
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={prevMes} style={{background:"#f1f5f9",border:"0.5px solid #e2e8f0",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:14}}>‹</button>
          <div style={{fontSize:14,fontWeight:700,color:"#111827",minWidth:160,textAlign:"center"}}>{MESES[mes]} {año}</div>
          <button onClick={nextMes} style={{background:"#f1f5f9",border:"0.5px solid #e2e8f0",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:14}}>›</button>
        </div>
      )}

      {/* Leyenda */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {Object.entries(TURNO_COL).map(([t,c])=>(
          <span key={t} style={{fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:4,background:c.bg,color:c.tx,border:`0.5px solid ${c.bd}`}}>
            {TURNO_ICONO[t]} {t}
          </span>
        ))}
      </div>

      {/* Tabla */}
      <TablaGrilla/>

      {/* Propuestas */}
      {propuestas.length>0&&(
        <div>
          <div style={{fontSize:13,fontWeight:700,color:"#111827",marginBottom:8}}>📋 Propuestas de cambio</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {propuestas.map(p=>(
              <div key={p.id} style={{background:p.est==="Aprobada"?"#f0fdf4":p.est==="Rechazada"?"#fef2f2":"#fffbeb",border:`0.5px solid ${p.est==="Aprobada"?"#86efac":p.est==="Rechazada"?"#fca5a5":"#fde68a"}`,borderRadius:8,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:"#111827"}}>{p.de} ↔ {p.a} · <span style={{fontFamily:"monospace"}}>{p.fecha}</span></div>
                  <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{p.motivo}</div>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:p.est==="Aprobada"?"#dcfce7":p.est==="Rechazada"?"#fee2e2":"#fef9c3",color:p.est==="Aprobada"?"#166534":p.est==="Rechazada"?"#b91c1c":"#854d0e"}}>{p.est}</span>
                  {p.est==="Pendiente"&&(
                    <>
                      <button onClick={()=>setPropuestas(pr=>pr.map(x=>x.id===p.id?{...x,est:"Aprobada"}:x))} style={{fontSize:10,padding:"3px 8px",borderRadius:4,cursor:"pointer",background:"#dcfce7",border:"0.5px solid #86efac",color:"#166534",fontWeight:700}}>✓ Aprobar</button>
                      <button onClick={()=>setPropuestas(pr=>pr.map(x=>x.id===p.id?{...x,est:"Rechazada"}:x))} style={{fontSize:10,padding:"3px 8px",borderRadius:4,cursor:"pointer",background:"#fee2e2",border:"0.5px solid #fca5a5",color:"#b91c1c",fontWeight:700}}>✕ Rechazar</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal asignación rápida */}
      {modalAsig&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:700,padding:16}}
          onClick={e=>{if(e.target===e.currentTarget)setModalAsig(null);}}>
          <div style={{background:"#fff",borderRadius:12,width:400,maxWidth:"98%",padding:24,boxShadow:"0 25px 60px rgba(0,0,0,.3)"}}>
            <div style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:4}}>⚡ Asignación rápida</div>
            <div style={{fontSize:12,color:"#6b7280",marginBottom:20}}>Asigna turno a <strong>{modalAsig.op}</strong> para múltiples días</div>

            {(()=>{
              const [turnoSel, setTurnoSel] = [modalAsig.turno||"", (v)=>setModalAsig(p=>({...p,turno:v}))];
              const [semSel,   setSemSel]   = [modalAsig.sem??2,    (v)=>setModalAsig(p=>({...p,sem:v}))];
              const [soloLab,  setSoloLab]  = [modalAsig.lab??true,  (v)=>setModalAsig(p=>({...p,lab:v}))];
              const nDias = (()=>{
                const i=semSel===0?0:7, f=semSel===1?7:14;
                return dias14.slice(i,f).filter(d=>soloLab?!esFinde(d):true).length;
              })();
              return(
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {/* Turno */}
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>Turno</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {Object.entries(TURNO_COL).map(([t,c])=>(
                        <button key={t} onClick={()=>setTurnoSel(t)}
                          style={{fontSize:11,padding:"6px 12px",borderRadius:6,cursor:"pointer",fontWeight:turnoSel===t?700:500,
                            background:turnoSel===t?c.bg:"#f8fafc",color:turnoSel===t?c.tx:"#6b7280",
                            border:turnoSel===t?`1.5px solid ${c.bd}`:"1px solid #e2e8f0"}}>
                          {TURNO_ICONO[t]} {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Semanas */}
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>Aplicar a</div>
                    <div style={{display:"flex",gap:6}}>
                      {[[0,"Semana 1"],[1,"Semana 2"],[2,"Ambas semanas"]].map(([v,l])=>(
                        <button key={v} onClick={()=>setSemSel(v)}
                          style={{fontSize:11,padding:"6px 12px",borderRadius:6,cursor:"pointer",fontWeight:semSel===v?700:500,
                            background:semSel===v?"#2563eb":"#f8fafc",color:semSel===v?"#fff":"#6b7280",
                            border:semSel===v?"none":"1px solid #e2e8f0"}}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Solo laborables */}
                  <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none"}}>
                    <input type="checkbox" checked={soloLab} onChange={e=>setSoloLab(e.target.checked)}
                      style={{width:16,height:16,cursor:"pointer",accentColor:"#2563eb"}}/>
                    <span style={{fontSize:12,color:"#374151"}}>Solo días laborables (excluir sábados y domingos)</span>
                  </label>

                  {/* Preview */}
                  {turnoSel&&(
                    <div style={{background:TURNO_COL[turnoSel]?.bg,border:`1px solid ${TURNO_COL[turnoSel]?.bd}`,borderRadius:8,padding:"10px 14px",fontSize:12,color:TURNO_COL[turnoSel]?.tx,fontWeight:600}}>
                      {TURNO_ICONO[turnoSel]} Se asignará <strong>{turnoSel}</strong> a <strong>{nDias} días</strong> para {modalAsig.op}
                    </div>
                  )}

                  <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
                    <button onClick={()=>setModalAsig(null)} style={{background:"transparent",border:"1px solid #d1d5db",color:"#374151",padding:"7px 16px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>Cancelar</button>
                    <button onClick={()=>turnoSel&&asignarRapido(modalAsig.op,turnoSel,semSel,soloLab)}
                      disabled={!turnoSel}
                      style={{background:turnoSel?"#2563eb":"#94a3b8",color:"#fff",border:"none",padding:"7px 18px",borderRadius:7,cursor:turnoSel?"pointer":"not-allowed",fontSize:12,fontWeight:700}}>
                      ⚡ Asignar {nDias} días
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Modal propuesta */}
      {modalProp&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:700,padding:16}}
          onClick={e=>{if(e.target===e.currentTarget)setModalProp(false);}}>
          <div style={{background:"#fff",borderRadius:12,width:420,maxWidth:"98%",padding:24,boxShadow:"0 25px 60px rgba(0,0,0,.3)"}}>
            <div style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:16}}>🔄 Proponer cambio de turno</div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[["de","Operario A"],["a","Operario B"]].map(([k,lbl])=>(
                <div key={k}>
                  <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:4}}>{lbl}</label>
                  <select value={formProp[k]} onChange={e=>setFormProp(p=>({...p,[k]:e.target.value}))}
                    style={{width:"100%",padding:"8px 10px",border:"1.5px solid #d1d5db",borderRadius:7,fontSize:13,color:"#111827",outline:"none"}}>
                    <option value="">Selecciona operario...</option>
                    {OPERARIOS.filter(op=>op!=="Sin asignar").map(op=><option key={op}>{op}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:4}}>Fecha del cambio</label>
                <input type="date" value={formProp.fecha} onChange={e=>setFormProp(p=>({...p,fecha:e.target.value}))}
                  style={{width:"100%",padding:"8px 10px",border:"1.5px solid #d1d5db",borderRadius:7,fontSize:13,color:"#111827",outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:4}}>Motivo</label>
                <textarea value={formProp.motivo} onChange={e=>setFormProp(p=>({...p,motivo:e.target.value}))} rows={2}
                  placeholder="Motivo del cambio..."
                  style={{width:"100%",padding:"8px 10px",border:"1.5px solid #d1d5db",borderRadius:7,fontSize:13,color:"#111827",outline:"none",resize:"vertical",fontFamily:"inherit",boxSizing:"border-box"}}/>
              </div>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:18}}>
              <button onClick={()=>setModalProp(false)} style={{background:"transparent",border:"1px solid #d1d5db",color:"#374151",padding:"7px 16px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>Cancelar</button>
              <button onClick={()=>{
                if(!formProp.de||!formProp.a||!formProp.fecha)return;
                setPropuestas(p=>[...p,{id:Date.now(),de:formProp.de,a:formProp.a,fecha:formProp.fecha,motivo:formProp.motivo,est:"Pendiente"}]);
                setFormProp({de:"",a:"",fecha:"",motivo:""});
                setModalProp(false);
              }} style={{background:"#2563eb",color:"#fff",border:"none",padding:"7px 18px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:700}}>
                Enviar propuesta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ─── CONSTANTES BUZÓN ─────────────────────────────────────────────
const CATEGORIAS  = ["Seguridad","Maquinaria","Organización","Condiciones de trabajo","Proceso productivo","Comunicación","Otra"];
const TIPOS       = ["Queja","Mejora","Sugerencia"];
const PRIORIDADES = ["Baja","Media","Alta","Urgente"];
const PRIO_COL = {
  "Baja":    {bg:"#f1f5f9",tx:"#64748b",bd:"#e2e8f0"},
  "Media":   {bg:"#fef9c3",tx:"#854d0e",bd:"#fde68a"},
  "Alta":    {bg:"#ffedd5",tx:"#c2410c",bd:"#fed7aa"},
  "Urgente": {bg:"#fee2e2",tx:"#b91c1c",bd:"#fca5a5"},
};
const TIPO_COL = {
  "Queja":      {bg:"#fee2e2",tx:"#b91c1c",bd:"#fca5a5",ic:"🚨"},
  "Mejora":     {bg:"#dbeafe",tx:"#1d4ed8",bd:"#93c5fd",ic:"💡"},
  "Sugerencia": {bg:"#d1fae5",tx:"#065f46",bd:"#6ee7b7",ic:"✨"},
};

function BuzonMejoras(){
  const { mejoras, setMejoras } = useContext(ERPContext);
  const [modal, setModal] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [form, setForm] = useState({tipo:"Mejora",categoria:"Maquinaria",prio:"Media",texto:""});
  const [filtro, setFiltro] = useState("Todas");

  // Filtrar solo entradas del buzón operario (modulo="Operario")
  const entradas = mejoras.filter(m=>m.modulo==="Operario");

  const ff = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const pendientes = entradas.filter(e=>e.estado==="Pendiente").length;
  const revisando  = entradas.filter(e=>e.estado==="En análisis").length;
  const impl       = entradas.filter(e=>e.estado==="Implementado").length;

  const entradasFiltradas = filtro==="Todas" ? entradas : entradas.filter(e=>e.tipo===filtro||e.estado===filtro||e.prioridad===filtro);

  function enviar(){
    if(!form.texto.trim()) return;
    const nueva = {
      id:`BM-${String(mejoras.length+1).padStart(3,"0")}`,
      fecha: new Date().toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"}),
      autor:"Anónimo",
      modulo:"Operario",
      tipo:form.tipo,
      categoria:form.categoria,
      prioridad:form.prio,
      titulo:form.texto.slice(0,60)+(form.texto.length>60?"...":""),
      descripcion:form.texto,
      propuesta:"",
      estado:"Pendiente",
      responsable:"Sin asignar",
      comentarios:[],
    };
    setMejoras(p=>[nueva,...p]);
    setForm({tipo:"Mejora",categoria:"Maquinaria",prio:"Media",texto:""});
    setModal(false);
  }

  function setEst(id, est){ setMejoras(p=>p.map(e=>e.id===id?{...e,estado:est}:e)); }

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16,padding:16,height:"100%",overflowY:"auto"}}>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:"#111827"}}>💬 Buzón de quejas y mejoras</div>
          <div style={{fontSize:12,color:"#6b7280"}}>Transmite tu queja, mejora o sugerencia al equipo de gestión</div>
        </div>
        <button onClick={()=>setModal(true)}
          style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
          + Nueva entrada
        </button>
      </div>

      {/* KPIs */}
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {[["Pendientes",pendientes,"#fef9c3","#854d0e"],["Revisando",revisando,"#dbeafe","#1d4ed8"],["Implementadas",impl,"#d1fae5","#065f46"],["Total",entradas.length,"#f1f5f9","#374151"]].map(([lbl,n,bg,tx])=>(
          <div key={lbl} style={{background:bg,borderRadius:8,padding:"10px 18px",minWidth:100,textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:700,color:tx}}>{n}</div>
            <div style={{fontSize:10,color:tx,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {["Todas","Queja","Mejora","Sugerencia","Pendiente","Revisando","Implementada"].map(f=>(
          <button key={f} onClick={()=>setFiltro(f)}
            style={{fontSize:10,padding:"4px 10px",borderRadius:20,cursor:"pointer",fontWeight:filtro===f?700:500,
              background:filtro===f?"#2563eb":"#f1f5f9",color:filtro===f?"#fff":"#374151",
              border:filtro===f?"none":"0.5px solid #e2e8f0"}}>
            {f}
          </button>
        ))}
      </div>

      {/* Lista entradas */}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {entradasFiltradas.length===0&&(
          <div style={{textAlign:"center",color:"#9ca3af",padding:"40px 0",fontSize:13}}>No hay entradas con este filtro</div>
        )}
        {entradasFiltradas.map(e=>{
          const tc=TIPO_COL[e.tipo]||{};
          const pc=PRIO_COL[e.prio]||{};
          const estC=e.estado==="Implementado"?{bg:"#d1fae5",tx:"#065f46"}:e.estado==="En análisis"?{bg:"#dbeafe",tx:"#1d4ed8"}:{bg:"#fef9c3",tx:"#854d0e"};
          return(
            <div key={e.id} onClick={()=>setDetalle(e)}
              style={{background:"#fff",border:"0.5px solid #e2e8f0",borderRadius:10,padding:"12px 14px",cursor:"pointer",transition:"box-shadow .15s"}}
              onMouseEnter={el=>el.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.08)"}
              onMouseLeave={el=>el.currentTarget.style.boxShadow="none"}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4,background:tc.bg,color:tc.tx,border:`0.5px solid ${tc.bd}`}}>{tc.ic} {e.tipo}</span>
                <span style={{fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:4,background:pc.bg,color:pc.tx,border:`0.5px solid ${pc.bd}`}}>{e.prioridad}</span>
                <span style={{fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:4,background:estC.bg,color:estC.tx}}>{e.estado}</span>
                <span style={{fontSize:10,color:"#9ca3af",marginLeft:"auto"}}>{e.id} · {e.ts}</span>
              </div>
              <div style={{fontSize:12,color:"#374151",fontWeight:600,marginBottom:3}}>{e.categoria}</div>
              <div style={{fontSize:12,color:"#6b7280",lineHeight:1.5,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{e.texto}</div>
              <div style={{fontSize:10,color:"#9ca3af",marginTop:6}}>🔒 Anónimo{e.responsable&&e.responsable!=="Sin asignar"?` · 👤 Resp: ${e.responsable}`:""}</div>
            </div>
          );
        })}
      </div>

      {/* Modal nueva entrada */}
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:700,padding:16}}
          onClick={e=>{if(e.target===e.currentTarget)setModal(false);}}>
          <div style={{background:"#fff",borderRadius:12,width:480,maxWidth:"98%",maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 25px 60px rgba(0,0,0,.3)",overflow:"hidden"}}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid #f3f4f6",background:"#fafafa"}}>
              <div style={{fontSize:15,fontWeight:700,color:"#111827"}}>💬 Nueva entrada</div>
              <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>Tu mensaje llegará al equipo de gestión</div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"18px 20px",display:"flex",flexDirection:"column",gap:12}}>
              {/* Aviso anónimo */}
              <div style={{background:"#f0fdf4",border:"0.5px solid #86efac",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#166534",display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:16}}>🔒</span>
                <span><strong>Envío anónimo</strong> — Tu identidad no quedará registrada. Solo el contenido de tu mensaje llegará a Calidad.</span>
              </div>
              {/* Tipo + Categoría */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:4}}>Tipo *</label>
                  <select value={form.tipo} onChange={ff("tipo")}
                    style={{width:"100%",padding:"8px 10px",border:"1.5px solid #d1d5db",borderRadius:7,fontSize:13,color:"#111827",outline:"none"}}>
                    {TIPOS.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:4}}>Prioridad</label>
                  <select value={form.prio} onChange={ff("prio")}
                    style={{width:"100%",padding:"8px 10px",border:"1.5px solid #d1d5db",borderRadius:7,fontSize:13,color:"#111827",outline:"none"}}>
                    {PRIORIDADES.map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              {/* Categoría */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:4}}>Categoría</label>
                <select value={form.categoria} onChange={ff("categoria")}
                  style={{width:"100%",padding:"8px 10px",border:"1.5px solid #d1d5db",borderRadius:7,fontSize:13,color:"#111827",outline:"none"}}>
                  {CATEGORIAS.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              {/* Texto */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",display:"block",marginBottom:4}}>Descripción *</label>
                <textarea value={form.texto} onChange={ff("texto")} rows={4}
                  placeholder="Describe tu queja, mejora o sugerencia con el máximo detalle posible..."
                  style={{width:"100%",padding:"8px 10px",border:"1.5px solid #d1d5db",borderRadius:7,fontSize:13,color:"#111827",outline:"none",resize:"vertical",fontFamily:"inherit",boxSizing:"border-box"}}/>
              </div>
            </div>
            <div style={{padding:"14px 20px",borderTop:"1px solid #f3f4f6",display:"flex",justifyContent:"flex-end",gap:10,background:"#fafafa"}}>
              <button onClick={()=>setModal(false)} style={{background:"transparent",border:"1px solid #d1d5db",color:"#374151",padding:"7px 16px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>Cancelar</button>
              <button onClick={enviar} disabled={!form.texto.trim()}
                style={{background:"#2563eb",color:"#fff",border:"none",padding:"7px 18px",borderRadius:7,cursor:form.texto.trim()?"pointer":"not-allowed",fontSize:12,fontWeight:700,opacity:form.texto.trim()?1:.45}}>
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal detalle */}
      {detalle&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:700,padding:16}}
          onClick={e=>{if(e.target===e.currentTarget)setDetalle(null);}}>
          <div style={{background:"#fff",borderRadius:12,width:500,maxWidth:"98%",maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 25px 60px rgba(0,0,0,.3)",overflow:"hidden"}}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid #f3f4f6",background:"#fafafa",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:"#111827"}}>{TIPO_COL[detalle.tipo]?.ic} {detalle.tipo} · {detalle.id}</div>
                <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{detalle.ts} · 👷 {detalle.operario}</div>
              </div>
              <button onClick={()=>setDetalle(null)} style={{background:"#f3f4f6",border:"none",cursor:"pointer",width:30,height:30,borderRadius:"50%",fontSize:16,color:"#6b7280"}}>✕</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"18px 20px",display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[["Categoría",detalle.categoria],["Prioridad",detalle.prioridad],["Estado",detalle.estado]].map(([lbl,val])=>(
                  <div key={lbl} style={{background:"#f8fafc",borderRadius:6,padding:"6px 12px"}}>
                    <div style={{fontSize:9,fontWeight:700,color:"#9ca3af",textTransform:"uppercase"}}>{lbl}</div>
                    <div style={{fontSize:12,fontWeight:600,color:"#374151"}}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"#f8fafc",borderRadius:8,padding:"12px 14px",fontSize:13,color:"#374151",lineHeight:1.6}}>{detalle.texto}</div>
              {detalle.responsable&&detalle.responsable!=="Sin asignar"&&<div style={{fontSize:12,color:"#6b7280"}}>👤 Responsable asignado: <strong>{detalle.responsable}</strong></div>}
              {/* Cambiar estado */}
              <div>
                <div style={{fontSize:11,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>Actualizar estado</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {["Pendiente","En análisis","Implementado","Rechazado"].map(est=>(
                    <button key={est} onClick={()=>{setEst(detalle.id,est);setDetalle(d=>({...d,estado:est}));}}
                      style={{fontSize:11,padding:"5px 12px",borderRadius:6,cursor:"pointer",fontWeight:detalle.estado===est?700:500,
                        background:detalle.estado===est?"#2563eb":"#f1f5f9",color:detalle.estado===est?"#fff":"#374151",
                        border:detalle.estado===est?"none":"0.5px solid #e2e8f0"}}>
                      {est}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MÓDULO PRINCIPAL ─────────────────────────────────────────────
export default function VistaOperario(){
  const {ncs,setNcs,ctrl,setCtrl,bloqueadas,setBloqueadas,fichas,ofs}=useContext(ERPContext);
  const [maqActiva,setMaqActiva]=useState("TWIN44");
  const [ests,setEsts]=useState({"PRE-01":"Produciendo","PRE-02":"Produciendo","GR-01":"Produciendo","GR-02":"Espera","TWIN44":"Produciendo","TWIN02":"Ajuste","MN-01":"Produciendo","DC02":"Produciendo","DE02":"Espera","DB02":"Limpieza","GR-BAST":"Produciendo","MN Bastid":"Produciendo","MALLADO":"Espera"});
  const [mNC,setMNC]=useState(null);
  const [confirmadas,setConfirmadas]=useState(new Set()); // Set de "ofId:maqId"
  const [ncTurno,setNcTurno]=useState([]);
  const [pendCtrl,setPendCtrl]=useState(null); // {maqId, of_}
  const [operarios,setOperarios]=useState({}); // {maqId: nombre}
  const [vista,setVista]=useState('maquinas'); // 'maquinas' | 'turnos' | 'buzon'
  const [planta,setPlanta]=useState(null); // null = sin seleccionar

  const planes=useMemo(()=>{
    const r={};
    const allOfs = [...OFS_RAW, ...(ofs||[]).map(o=>({...o,kgCesta:{[o.maq]:o.kg}}))];  
    MAQUINAS_LIST.forEach(m=>{r[m.id]=planificar(allOfs,m.id);});
    return r;
  },[]);

  function cambEst(m,e){setEsts(p=>({...p,[m]:e}));}
  function cambOp(m,op){setOperarios(p=>({...p,[m]:op}));}
  function desconfirmarOF(of_, maqId){
    const key = `${of_.of}:${maqId}`;
    setConfirmadas(prev => { const s = new Set(prev); s.delete(key); return s; });
  }
  function deshacerNC(of_, bloq){
    // Quitar bloqueo
    setBloqueadas(p => p.filter(b => !(b.ofId === of_.of && b.maqId === bloq.maqId)));
    // Borrar NC asociada de Calidad (por ctrlId o por descripción de OF)
    if(bloq.ctrlId){
      setNcTurno(p => p.filter(n => n.id !== bloq.ctrlId && !n.id.includes('NC-T-'+(bloq.ctrlId))));
      setNcs(p => p.filter(n => !(n.ofBloqueada === of_.of && n.maq === bloq.maqId)));
    } else {
      setNcs(p => p.filter(n => !(n.ofBloqueada === of_.of && n.maq === bloq.maqId)));
      setNcTurno(p => p.filter(n => !(n.ofBloqueada === of_.of && n.maq === bloq.maqId)));
    }
  }
  function confirmarOF(of_, maqId){
    const key = `${of_.of}:${maqId}`;
    setConfirmadas(prev => { const s = new Set(prev); s.add(key); return s; });
    // Guardar operario en el registro del control
    const op = operarios[maqId] || 'Sin asignar';
    of_._operario = op;
  }
  function handleOK(o){
    if(MAQUINAS_CTRL[maqActiva]){ setPendCtrl({maqId:maqActiva,of_:o}); }
    else { confirmarOF(o, maqActiva); }
  }
  function guardarControl({resultado,valor,obs,fotoUrl,fotoNombre,fotosPiezas,nombresPiezas,fotoCinta,nombreCinta}){
    const {maqId,of_}=pendCtrl;
    const tipo=MAQUINAS_CTRL[maqId];
    const ahora=new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"});
    const rec={
      id:`CL-${String((ctrl||[]).length+1).padStart(3,"0")}`,
      ts:ahora,
      fecha:new Date().toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit"}),
      maq:maqId, of:`OF-${of_?.of||"—"}`, par:tipo,
      val:valor||resultado, ok:resultado==="OK",
      obs, fotoUrl, fotoNombre, fotosPiezas, nombresPiezas, fotoCinta, nombreCinta,
      cliente:of_?.cliente||"",
    };
    setCtrl(p=>[rec,...(p||[])]);
    if(resultado==="OK"){
      // Confirmar OF normalmente
      confirmarOF(of_, maqId);
    } else {
      // Bloquear OF — no confirmar, generar NC automáticamente
      setBloqueadas(p=>[...p,{
        ofId:of_.of, maqId, tipo, obs,
        fecha:new Date().toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit"}),
        ctrlId:rec.id,
      }]);
      const n={
        id:`NC-T-${String(ncTurno.length+1).padStart(3,"0")}`,
        f:new Date().toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit"}),
        cli:null, tipo:"Proceso interno", origen:"Interno",
        maq:maqId, desc:`Control ${tipo} NOK — OF-${of_?.of||"—"}. ${obs||"Sin observaciones"}`,
        grav:"Menor", est:"Abierta", resp:"Pendiente",
        ofBloqueada:of_.of,
      };
      setNcTurno(p=>[n,...p]); setNcs(p=>[n,...p]);
    }
    setPendCtrl(null);
  }
  function guardarNC({maqId,of_,tipo,grav,desc}){
    const n={id:`NC-T-${String(ncTurno.length+1).padStart(3,"0")}`,f:new Date().toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit"}),cli:null,tipo,origen:tipo==="Reclamación cliente"?"Externo":"Interno",maq:maqId,desc,grav,est:grav==="Mayor"||grav==="Crítica"?"8D Abierto":"Abierta",resp:"Pendiente"};
    setNcTurno(p=>[n,...p]);setNcs(p=>[n,...p]);
  }

  const maqsPlanta = planta ? MAQUINAS_LIST.filter(m=>m.planta===planta) : MAQUINAS_LIST;
  const maqInfo=maqsPlanta.find(m=>m.id===maqActiva)||maqsPlanta[0]||MAQUINAS_LIST[0];
  const planActual=planes[maqActiva]||[];
  const prod=Object.values(ests).filter(e=>e==="Produciendo").length;
  const avr=Object.values(ests).filter(e=>e==="Avería").length;

  // Agrupar máquinas por línea (filtradas por planta)
  const LINEAS={};
  maqsPlanta.forEach(m=>{if(!LINEAS[m.linea])LINEAS[m.linea]=[];LINEAS[m.linea].push(m);});

  // Pantalla selección de planta
  if(!planta) return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"calc(100vh - 130px)",gap:32,background:"#f8fafc",borderRadius:12,border:"0.5px solid #e2e8f0"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:8}}>🏭</div>
        <div style={{fontSize:22,fontWeight:700,color:"#111827",marginBottom:6}}>Vista Operario</div>
        <div style={{fontSize:14,color:"#6b7280"}}>Selecciona tu planta para continuar</div>
      </div>
      <div style={{display:"flex",gap:20,flexWrap:"wrap",justifyContent:"center"}}>
        {PLANTAS.map(p=>{
          const c=PLANTA_COL[p];
          const nMaq=MAQUINAS_LIST.filter(m=>m.planta===p).length;
          return(
            <button key={p} onClick={()=>{setPlanta(p);setMaqActiva(MAQUINAS_LIST.find(m=>m.planta===p)?.id||"TWIN44");}}
              style={{background:c.bg,color:c.tx,border:`2px solid ${c.bd}`,borderRadius:16,padding:"32px 48px",cursor:"pointer",textAlign:"center",transition:"transform .15s",minWidth:220}}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
              <div style={{fontSize:36,marginBottom:10}}>{p==="Vitoria"?"🏙":"🌿"}</div>
              <div style={{fontSize:20,fontWeight:700,marginBottom:4}}>{p}</div>
              <div style={{fontSize:12,opacity:.8}}>{nMaq} máquinas</div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)",minHeight:500,gap:0,border:"0.5px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
      {/* Pestañas */}
      <div style={{display:"flex",borderBottom:"1px solid #e2e8f0",background:"#f8fafc",flexShrink:0}}>
        {[["maquinas","⚙ Máquinas"],["turnos","📅 Turnos"],["buzon","💬 Buzón"]].map(([v,lbl])=>(
          <button key={v} onClick={()=>setVista(v)}
            style={{padding:"10px 20px",fontSize:12,fontWeight:vista===v?700:500,cursor:"pointer",background:"transparent",border:"none",borderBottom:vista===v?"2px solid #2563eb":"2px solid transparent",color:vista===v?"#2563eb":"#6b7280",transition:"all .15s"}}>
            {lbl}
          </button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8,paddingRight:12}}>
          {planta&&(
            <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:PLANTA_COL[planta].light,color:PLANTA_COL[planta].lightTx,border:`1px solid ${PLANTA_COL[planta].bd}`}}>
              {planta==="Vitoria"?"🏙":"🌿"} {planta}
            </span>
          )}
          <button onClick={()=>setPlanta(null)} style={{fontSize:10,padding:"3px 10px",borderRadius:20,cursor:"pointer",background:"#f1f5f9",border:"0.5px solid #e2e8f0",color:"#6b7280",fontWeight:600}}>
            Cambiar planta
          </button>
        </div>
      </div>

      {vista==="turnos"?<CalendarioTurnos/>:vista==="buzon"?<BuzonMejoras/>:
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

      {/* ── SIDEBAR MÁQUINAS ── */}
      <div style={{width:170,minWidth:170,background:"#f8fafc",borderRight:"0.5px solid #e2e8f0",display:"flex",flexDirection:"column",overflowY:"auto",flexShrink:0}}>
        {/* KPIs rápidos */}
        <div style={{padding:"10px 12px",borderBottom:"0.5px solid #e2e8f0",display:"flex",gap:6}}>
          <div style={{flex:1,textAlign:"center",background:"#f0fdf4",borderRadius:6,padding:"5px 4px"}}>
            <div style={{fontSize:16,fontWeight:700,color:"#166534"}}>{prod}</div>
            <div style={{fontSize:9,color:"#166534",textTransform:"uppercase",letterSpacing:".04em"}}>Prod.</div>
          </div>
          <div style={{flex:1,textAlign:"center",background:avr>0?"#fef2f2":"#f9fafb",borderRadius:6,padding:"5px 4px"}}>
            <div style={{fontSize:16,fontWeight:700,color:avr>0?"#b91c1c":"#9ca3af"}}>{avr}</div>
            <div style={{fontSize:9,color:avr>0?"#b91c1c":"#9ca3af",textTransform:"uppercase",letterSpacing:".04em"}}>Averías</div>
          </div>
          <div style={{flex:1,textAlign:"center",background:ncTurno.length>0?"#fef2f2":"#f9fafb",borderRadius:6,padding:"5px 4px"}}>
            <div style={{fontSize:16,fontWeight:700,color:ncTurno.length>0?"#b91c1c":"#9ca3af"}}>{ncTurno.length}</div>
            <div style={{fontSize:9,color:ncTurno.length>0?"#b91c1c":"#9ca3af",textTransform:"uppercase",letterSpacing:".04em"}}>NCs</div>
          </div>
          {bloqueadas.length>0&&(
          <div style={{flex:1,textAlign:"center",background:"#fef2f2",borderRadius:6,padding:"5px 4px"}}>
            <div style={{fontSize:16,fontWeight:700,color:"#b91c1c"}}>{bloqueadas.length}</div>
            <div style={{fontSize:9,color:"#b91c1c",textTransform:"uppercase",letterSpacing:".04em"}}>🔒 Bloq.</div>
          </div>
          )}
        </div>

        {/* Lista máquinas agrupadas por línea */}
        <nav style={{flex:1,padding:"6px 0"}}>
          {Object.entries(LINEAS).map(([linea,maquinas])=>(
            <div key={linea}>
              <div style={{padding:"8px 12px 3px",fontSize:9.5,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:LINEA_C[linea]||"#6b7280"}}>
                {linea}
              </div>
              {maquinas.map(m=>{
                const activo=maqActiva===m.id;
                const col=EC[ests[m.id]]||EC["Espera"];
                const nOFs=planes[m.id]?.length||0;
                const nConf=planes[m.id]?.filter(o=>confirmadas.has(`${o.of}:${m.id}`)).length||0;
                const atrM=planes[m.id]?.some(o=>atr(o.fentrega)>0);
                return(
                  <div key={m.id} onClick={()=>setMaqActiva(m.id)}
                    style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",cursor:"pointer",borderLeft:`3px solid ${activo?col.bd:"transparent"}`,background:activo?"white":"transparent",transition:"all .1s"}}>
                    {/* Dot estado */}
                    <div style={{width:8,height:8,borderRadius:"50%",background:col.bd,flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:activo?700:500,color:activo?"#111827":"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.id}</div>
                      <div style={{fontSize:9.5,color:"#9ca3af"}}>{m.tipo}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      {atrM&&<div style={{fontSize:9,color:"#b91c1c",fontWeight:700}}>⚠</div>}
                      <div style={{fontSize:9.5,color:nConf===nOFs&&nOFs>0?"#166534":"#9ca3af",fontFamily:"monospace"}}>{nConf}/{nOFs}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{padding:"8px 12px",borderTop:"0.5px solid #e2e8f0",fontSize:10,color:"#9ca3af"}}>
          {confirmadas.size} confirmaciones
        </div>
      </div>

      {/* ── PANEL MÁQUINA ACTIVA ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <VistaMaquina
          fichas={fichas||[]}
          maq={maqActiva}
          plan={planActual}
          usaHornos={maqInfo.usaHornos}
          est={ests[maqActiva]||"Espera"}
          onCambiarEst={cambEst}
          onNC={o=>setMNC({maqId:maqActiva,of_:o})}
          onOK={handleOK}
          operario={operarios[maqActiva]||'Sin asignar'}
          onCambiarOperario={cambOp}
          onDeshacer={o=>desconfirmarOF(o,maqActiva)}
          onDeshacerNC={(o,bloq)=>deshacerNC(o,bloq)}
          confirmadas={confirmadas}
          bloqueadas={bloqueadas}
        />
      </div>

      {/* Modal NC */}
      {mNC&&<ModalNC maqId={mNC.maqId} of_={mNC.of_} onClose={()=>setMNC(null)} onGuardar={guardarNC}/>}
      {/* Modal Control proceso */}
      {pendCtrl&&<ModalControl maqId={pendCtrl.maqId} of_={pendCtrl.of_} onClose={()=>setPendCtrl(null)} onGuardar={guardarControl}/>}
      </div>}
    </div>
  );
}
