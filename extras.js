// Categorías adicionales personalizadas para Gastos Igna
expenseCats['Bencina']=['Bencina'];
expenseCats['Gym']=['Mensualidad','Matrícula','Otros gym'];
expenseCats['Yoga']=['Mensualidad','Clase suelta','Implementos','Otros yoga'];
expenseCats['Plan móvil']=['Plan mensual','Equipo','Otros teléfono'];
expenseCats['Psicólogo']=['Sesión','Otros psicología'];
expenseCats['Doctor']=['Consulta médica','Especialista','Urgencia'];
expenseCats['Exámenes médicos']=['Laboratorio','Imagenología','Otros exámenes'];

// Evita duplicar Bencina/Gym/Yoga dentro de categorías más generales.
if (expenseCats['Transporte']) expenseCats['Transporte']=expenseCats['Transporte'].filter(x=>x!=='Bencina');
if (expenseCats['Deporte']) expenseCats['Deporte']=expenseCats['Deporte'].filter(x=>!['Gym','Yoga'].includes(x));
if (expenseCats['Salud']) expenseCats['Salud']=expenseCats['Salud'].filter(x=>!['Consulta','Exámenes','Terapia'].includes(x));

// Accesos rápidos para los gastos frecuentes.
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

// Refresca selects y vistas con las nuevas categorías.
fillAccountSelects();
renderAll();
