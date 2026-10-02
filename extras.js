// Extensiones personalizadas para Gastos Igna
// Todo lo precargado funciona como valor inicial: la usuaria puede editarlo desde la app.

expenseCats['Bencina']=['Bencina'];
expenseCats['Gym']=['Mensualidad','Matrícula','Otros gym'];
expenseCats['Yoga']=['Mensualidad','Clase suelta','Implementos','Otros yoga'];
expenseCats['Plan móvil']=['Plan mensual','Equipo','Otros teléfono'];
expenseCats['Psicólogo']=['Sesión','Otros psicología'];
expenseCats['Doctor']=['Consulta médica','Especialista','Urgencia'];
expenseCats['Exámenes médicos']=['Laboratorio','Imagenología','Otros exámenes'];

if (expenseCats['Transporte']) expenseCats['Transporte']=expenseCats['Transporte'].filter(x=>x!=='Bencina');
if (expenseCats['Deporte']) expenseCats['Deporte']=expenseCats['Deporte'].filter(x=>!['Gym','Yoga'].includes(x));
if (expenseCats['Salud']) expenseCats['Salud']=expenseCats['Salud'].filter(x=>!['Consulta','Exámenes','Terapia'].includes(x));

// Agrega una sola vez los nuevos pagos mensuales sugeridos. Después pueden editarse o borrarse.
const migrationKey='gastosIgna-personal-v4';
if(!localStorage.getItem(migrationKey)){
  const defaults=[
    {id:'c-yoga',name:'Yoga',kind:'gasto',amount:40000,day:'',category:'Yoga',accountId:'',note:'Monto inicial editable',installmentCurrent:'',installmentTotal:''},
    {id:'c-psicologo',name:'Psicólogo',kind:'gasto',amount:40000,day:'',category:'Psicólogo',accountId:'',note:'Monto inicial editable',installmentCurrent:'',installmentTotal:''}
  ];
  defaults.forEach(d=>{
    const exists=state.commitments.some(c=>c.id===d.id || c.name.toLowerCase()===d.name.toLowerCase());
    if(!exists) state.commitments.push(d);
  });
  localStorage.setItem(migrationKey,'1');
  localStorage.setItem('gastosIgnaV2',JSON.stringify(state));
}

// Accesos rápidos para gastos frecuentes.
const quick=document.querySelector('.quick');
if(quick){
  [
    ['Bencina','⛽','Bencina'],
    ['Gym','🏋️','Gym'],
    ['Yoga','🧘','Yoga'],
    ['Psicólogo','🧠','Psicólogo']
  ].forEach(([cat,icon,label])=>{
    if(![...quick.querySelectorAll('b')].some(b=>b.textContent===label)){
      const btn=document.createElement('button');
      btn.className='qbtn';
      btn.innerHTML=`<span>${icon}</span><b>${label}</b>`;
      btn.onclick=()=>quickMove(cat);
      quick.appendChild(btn);
    }
  });
}

// Deja explícito que montos y fechas se pueden cambiar.
const paymentsNotice=document.querySelector('#payments .notice');
if(paymentsNotice){
  paymentsNotice.innerHTML='Aquí van arriendos, dividendo, luz, internet, cuotas, yoga, psicólogo y otros pagos. <b>Todos los montos y fechas son editables</b>: toca “Editar” cuando cambien.';
}

// El resumen del departamento lee los valores editables de Pagos, no números fijos del HTML.
function refreshPropertyCard(){
  const section=[...document.querySelectorAll('.section')].find(s=>s.querySelector('h2')?.textContent.trim()==='Departamento arrendado');
  if(!section)return;
  const rent=state.commitments.find(c=>c.id==='c-arr-depto')||{amount:0,day:''};
  const mortgage=state.commitments.find(c=>c.id==='c-dividendo')||{amount:0,day:''};
  const boxes=section.querySelectorAll('.property .box');
  if(boxes[0]){
    const label=boxes[0].querySelector('.tiny');
    const value=boxes[0].querySelector('.amt');
    if(label) label.textContent=`Arriendo recibido${rent.day?' · día '+rent.day:''}`;
    if(value) value.textContent='+'+money(rent.amount);
  }
  if(boxes[1]){
    const label=boxes[1].querySelector('.tiny');
    const value=boxes[1].querySelector('.amt');
    if(label) label.textContent=`Dividendo${mortgage.day?' · día '+mortgage.day:''}`;
    if(value) value.textContent='−'+money(mortgage.amount);
  }
  const diff=(+rent.amount||0)-(+mortgage.amount||0);
  const notice=section.querySelector('.notice');
  if(notice) notice.innerHTML=`Diferencia base del departamento: <b>${diff>=0?'+':''}${money(diff)}/mes</b>. Estos valores se editan desde <b>Pagos</b>.`;
  const hint=section.querySelector('.sectionTitle .tiny');
  if(hint) hint.textContent='flujo mensual · editable';
}

const coreRenderHome=renderHome;
renderHome=function(){
  coreRenderHome();
  refreshPropertyCard();
};

fillAccountSelects();
renderAll();
