// src/datos.js — datos compartidos entre todos los módulos

export const CLIENTES = [
  {id:9,  n:"CELO S.A.",            s:"Tornillería",   f:184200, ok:true},
  {id:58, n:"ITW ESPAÑA S.L.U.",    s:"Fijación Met.", f:312400, ok:true},
  {id:87, n:"A.RAYMOND TECNIACERO", s:"Fijación Auto", f:276500, ok:true},
  {id:102,n:"SINARD S.A.",          s:"Estampación",   f:156300, ok:true},
  {id:125,n:"ELAY LAN S.L.U.",      s:"Comp. Auto",    f:203100, ok:true},
  {id:458,n:"TSF-NAVARRA TEC. SOLD.",s:"Soldadura",    f:267800, ok:true},
  {id:542,n:"CEFA CELULOSA FABRIL", s:"Industrial",    f:91400,  ok:true},
  {id:109,n:"SONIASA CORTE FINO",   s:"Automoción",    f:67400,  ok:true},
];

export const HOMS = [
  {id:1, cli:102,maq:"MN-01", cod:"00.11.2.00.0.102.0013",ref:"0001302750",  desc:"306 CLIP D.T.",       kg:50, vb:30,tb:7,  vc:220,tc:20,g:1,top:"Negro",   fase:"4DT",est:"Activa"},
  {id:2, cli:458,maq:"DC02",  cod:"00.20.0.00.1.458.0004",ref:"8100484951",  desc:"Casq. Sold. Ø22",     kg:160,vb:0, tb:1,  vc:0,  tc:0, g:0,top:"Deltalube",fase:"6AC",est:"Activa"},
  {id:3, cli:458,maq:"DC02",  cod:"00.20.0.00.1.458.0005",ref:"8300179895",  desc:"Casquillo Ø32xØ14.2", kg:160,vb:1, tb:0,  vc:0,  tc:0, g:0,top:"Deltalube",fase:"3PT",est:"Activa"},
  {id:4, cli:58, maq:"MN-01", cod:"00.11.1.22.0.058.0604",ref:"22824108110", desc:"CLIP MANETA RO",      kg:40, vb:30,tb:7,  vc:270,tc:20,g:1,top:"Negro",   fase:"4DT",est:"Activa"},
  {id:5, cli:58, maq:"RO-5",  cod:"00.11.1.22.0.058.0604b",ref:"22824108110b",desc:"CLIP MANETA (RO-5)", kg:19, vb:36,tb:12, vc:270,tc:15,g:1,top:"Negro",   fase:"4DT",est:"Activa"},
  {id:6, cli:87, maq:"PRE-01",cod:"00.11.2.00.0.087.0318",ref:"219229001-18418",desc:"GRAPA",            kg:45, vb:10,tb:16, vc:0,  tc:0, g:0,top:"Plata",   fase:"3PT",est:"Activa"},
  {id:7, cli:102,maq:"MN-01", cod:"00.43.6.00.0.102.0381",ref:"2011302050",  desc:"VRH-6T 210 CLIP DT",  kg:60, vb:30,tb:7,  vc:220,tc:20,g:1,top:"VH",      fase:"4DT",est:"Activa"},
  {id:8, cli:125,maq:"GR-02", cod:"00.25.D.22.0.125.0019",ref:"3117100.45 T44",desc:"TENPLATU ETA IRAOTU",kg:80,vb:10,tb:0.08,vc:0, tc:0, g:0,top:"Plata",   fase:"3PT",est:"Activa"},
  {id:9, cli:125,maq:"TWIN44",cod:"00.25.D.22.0.125.0019b",ref:"3117100.45b",desc:"TENPLATU IRAOTU T44", kg:80, vb:25,tb:20, vc:150,tc:60,g:1,top:"Plata",   fase:"4DT",est:"Activa"},
  {id:10,cli:9,  maq:"GR-01", cod:"00.25.6.00.0.009.0163",ref:"46359L12720FT",desc:"FT7x20",             kg:80, vb:7, tb:0.1,vc:0,  tc:0, g:0,top:"Negro",   fase:"3PT",est:"Activa"},
  {id:11,cli:9,  maq:"MN-01", cod:"00.25.C.00.0.009.0117",ref:"9L23414ESC",  desc:"0x0",                 kg:80, vb:40,tb:12, vc:280,tc:20,g:2,top:"Negro",   fase:"4DT",est:"Activa"},
  {id:12,cli:58, maq:"MN-01", cod:"00.11.6.22.0.058.0445",ref:"21286109800", desc:"TRT M6-2",            kg:80, vb:30,tb:7,  vc:290,tc:20,g:2,top:"VH",      fase:"4DT",est:"Activa"},
  {id:13,cli:9,  maq:"TWIN44",cod:"00.25.6.22.0.009.0101",ref:"63700150",    desc:"5x16",                kg:80, vb:25,tb:20, vc:180,tc:60,g:1,top:"Negro",   fase:"4DT",est:"Activa"},
  {id:14,cli:542,maq:"MN-01", cod:"00.11.6.00.0.542.0001",ref:"8360018-1J",  desc:"KLAMMER",             kg:30, vb:40,tb:12, vc:240,tc:20,g:1,top:"Negro",   fase:"4DT",est:"Pendiente"},
  {id:15,cli:58, maq:"RO-5",  cod:"00.11.6.81.0.058.0470",ref:"21293328200", desc:"TRE 5 DOB",           kg:30, vb:36,tb:7,  vc:260,tc:20,g:1,top:"Negro",   fase:"4DT",est:"Inactiva"},
];

export const MAQUINAS = [
  {id:"PRE-01",  n:"Pregrease 01",            tipo:"Pretratamiento", linea:"DINAMICO", modo:"HORNO", mpc:5.0,  est:"Operativa",    oee:84.4,disp:95.2,rend:89.1,cal:99.4,kg:890, op:"A. Martí"},
  {id:"PRE-02",  n:"Pregrease 02",            tipo:"Pretratamiento", linea:"DINAMICO", modo:"HORNO", mpc:5.0,  est:"Operativa",    oee:82.1,disp:93.0,rend:88.5,cal:99.2,kg:820, op:"L. Vega"},
  {id:"GR-01",   n:"Granallado 01",           tipo:"Granallado",     linea:"DINAMICO", modo:"HORNO", mpc:5.0,  est:"Operativa",    oee:87.9,disp:96.8,rend:91.2,cal:99.7,kg:1480,op:"F. Cano"},
  {id:"GR-02",   n:"Granallado 02",           tipo:"Granallado",     linea:"DINAMICO", modo:"HORNO", mpc:5.0,  est:"Operativa",    oee:82.0,disp:93.4,rend:88.3,cal:99.5,kg:1120,op:"R. Mas"},
  {id:"TWIN44",  n:"Twin 44",                 tipo:"Recubrimiento",  linea:"DINAMICO", modo:"HORNO", mpc:4.5,  est:"Operativa",    oee:75.5,disp:89.7,rend:85.0,cal:99.0,kg:980, op:"C. Font"},
  {id:"TWIN02",  n:"Twin 02",                 tipo:"Recubrimiento",  linea:"DINAMICO", modo:"HORNO", mpc:4.5,  est:"Operativa",    oee:71.2,disp:87.3,rend:83.1,cal:98.8,kg:740, op:"M. Abad"},
  {id:"MN-01",   n:"Máq. Neumática 01",       tipo:"Recubrimiento",  linea:"DINAMICO", modo:"HORNO", mpc:4.5,  est:"Operativa",    oee:79.8,disp:92.1,rend:87.4,cal:99.1,kg:1240,op:"J. Pérez"},
  {id:"RO-5",    n:"Rotary 5",                tipo:"Recubrimiento",  linea:"DINAMICO", modo:"FIFO",  mpc:3.0,  est:"Inhabilitada", oee:0,   disp:0,   rend:0,   cal:0,   kg:0,   op:"—"},
  {id:"RO-6",    n:"Rotary 6",                tipo:"Recubrimiento",  linea:"DINAMICO", modo:"FIFO",  mpc:3.0,  est:"Inhabilitada", oee:0,   disp:0,   rend:0,   cal:0,   kg:0,   op:"—"},
  {id:"DC02",    n:"Desaceitadora 02",         tipo:"Desaceitado",    linea:"DINAMICO", modo:"FIFO",  mpc:5.0,  est:"Operativa",    oee:69.5,disp:85.2,rend:83.1,cal:98.1,kg:640, op:"D. Gil"},
  {id:"DE02",    n:"Desengrasadora Est. 02",   tipo:"Desengrasado",   linea:"ESTATICO", modo:"FIFO",  mpc:20.0, est:"Operativa",    oee:77.3,disp:90.1,rend:86.2,cal:99.3,kg:380, op:"P. Ruiz"},
  {id:"DB02",    n:"Desengrasadora Bast. 02",  tipo:"Desengrasado",   linea:"ESTATICO", modo:"FIFO",  mpc:20.0, est:"Operativa",    oee:74.8,disp:88.6,rend:84.9,cal:99.1,kg:290, op:"T. Lara"},
  {id:"GR-BAST", n:"Granallado Bastidor",      tipo:"Granallado",     linea:"ESTATICO", modo:"HORNO", mpc:15.0, est:"Operativa",    oee:80.2,disp:91.5,rend:87.8,cal:99.6,kg:510, op:"B. Mora"},
  {id:"MN Bastid",n:"MN Bastidor",             tipo:"Recubrimiento",  linea:"ESTATICO", modo:"HORNO", mpc:12.0, est:"Operativa",    oee:76.4,disp:89.3,rend:85.7,cal:99.4,kg:440, op:"N. Pons"},
  {id:"MALLADO", n:"Mallado",                  tipo:"Mallado",        linea:"ESTATICO", modo:"FIFO",  mpc:0,    est:"Operativa",    oee:0,   disp:0,   rend:0,   cal:0,   kg:120, op:"V. Soler"},
];

export const OFS_INIT = [
  {id:"OF-2601",hid:4, cli:58, maq:"MN-01", kg:400,top:"Negro",   est:"En Curso",    prio:"Normal", fe:"14/03",lote:"L-001",alb:null},
  {id:"OF-2602",hid:1, cli:102,maq:"MN-01", kg:250,top:"Negro",   est:"Pendiente",   prio:"Normal", fe:"15/03",lote:"L-001",alb:null},
  {id:"OF-2603",hid:13,cli:9,  maq:"TWIN44",kg:320,top:"Negro",   est:"Pendiente",   prio:"Urgente",fe:"14/03",lote:"L-002",alb:null},
  {id:"OF-2604",hid:2, cli:458,maq:"DC02",  kg:480,top:"Deltalube",est:"Control Final",prio:"Normal",fe:"14/03",lote:"L-003",alb:null},
  {id:"OF-2605",hid:6, cli:87, maq:"PRE-01",kg:180,top:"Plata",   est:"Completada",  prio:"Normal", fe:"12/03",lote:"L-001",alb:"ALB-20260312-001"},
  {id:"OF-2606",hid:9, cli:125,maq:"TWIN44",kg:240,top:"Plata",   est:"Expedición",  prio:"Normal", fe:"15/03",lote:"L-002",alb:null},
  {id:"OF-2607",hid:12,cli:58, maq:"MN-01", kg:108,top:"VH",      est:"Pendiente",   prio:"Normal", fe:"17/03",lote:"L-004",alb:null},
];

export const NCS_INIT = [
  {id:"NC-2026-001",f:"10/03",cli:58, tipo:"Reclamación",    desc:"Piezas dobladas en recepción",grav:"Mayor",est:"8D Abierto",resp:"J. García"},
  {id:"NC-2026-002",f:"08/03",cli:102,tipo:"Proceso Interno",desc:"Espesor 18μm fuera spec",      grav:"Menor",est:"Cerrada",   resp:"M. Torres"},
  {id:"NC-2026-003",f:"12/03",cli:9,  tipo:"Laboratorio",    desc:"Adherencia cross-cut Gt2",     grav:"Mayor",est:"Abierta",   resp:"A. Martín"},
  {id:"NC-2026-004",f:"13/03",cli:458,tipo:"Proceso Interno",desc:"Color no uniforme DC02",       grav:"Menor",est:"Abierta",   resp:"P. Ramos"},
];

export const MANT_INIT = [
  {id:"MP-001",maq:"MN-01", tarea:"Revisión sellos bomba",       freq:"Mensual",   prox:"14/03",est:"Vence hoy"},
  {id:"MP-002",maq:"RO-5",  tarea:"Lubricación rodamientos",     freq:"Semanal",   prox:"14/03",est:"Vence hoy"},
  {id:"MP-003",maq:"DC02",  tarea:"Limpieza filtros desaceite",  freq:"Quincenal", prox:"15/03",est:"Próximo"},
  {id:"MP-004",maq:"GR-01", tarea:"Revisión medios abrasivos",   freq:"Semanal",   prox:"14/03",est:"Vence hoy"},
];

export const CTRL_INIT = [
  {id:"CL-001",ts:"08:15",maq:"MN-01",  par:"pH baño inmersión",       val:8.2, min:7.5, max:9.0, ok:true},
  {id:"CL-002",ts:"08:20",maq:"DC02",   par:"Residuo seco (g/L)",       val:245, min:220, max:280, ok:true},
  {id:"CL-003",ts:"08:25",maq:"GR-02",  par:"Fosfato Cu granallado",    val:3.8, min:3.0, max:5.0, ok:true},
  {id:"CL-004",ts:"08:30",maq:"PRE-01", par:"Zirblast desengrasado",    val:12.5,min:10,  max:15,  ok:true},
  {id:"CL-005",ts:"16:45",maq:"RO-6",   par:"Adherencia cross-cut",     val:2,   min:0,   max:1,   ok:false},
];

export const TC = { Negro:"#2C2C2A", Plata:"#B4B2A9", VH:"#185FA5", Deltalube:"#0F6E56" };

// Helpers
export const cn = (id) => {
  const c = CLIENTES.find(x => x.id === id);
  return c ? (c.n.length > 22 ? c.n.slice(0,22)+"…" : c.n) : `CLI-${id}`;
};
export const oc = (v) => v >= 80 ? "#22c55e" : v >= 65 ? "#f59e0b" : "#ef4444";
