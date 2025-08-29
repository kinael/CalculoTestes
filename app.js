/* ============ UTILS GERAIS ============ */
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];
const uuid = () => (crypto?.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(16).slice(2)}`);

function showView(id){
  $$(".view").forEach(v => v.classList.remove("active"));
  $(`#view-${id}`).classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
}

/* --------- Geradores de formulário com RÓTULOS --------- */
function makeNumberScaleWithLabels(name, labels, min, max, required=true){
  const frag = document.createDocumentFragment();
  for(let i=1;i<=labels.length;i++){
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML = `
      <div class="n">${i}.</div>
      <div class="q">${labels[i-1]}</div>
      <div class="scale" role="group" aria-label="Escala ${name} item ${i}"></div>
    `;
    const scale = $(".scale", row);
    for(let v=min; v<=max; v++){
      const id = `${name}-${i}-${v}`;
      const label = document.createElement("label");
      label.setAttribute("for", id);
      label.innerHTML = `<input type="radio" name="${name}-${i}" id="${id}" value="${v}" ${required?'required':''}/> ${v}`;
      scale.appendChild(label);
    }
    frag.appendChild(row);
  }
  return frag;
}

function makeBinaryWithLabels(name, labels){
  const frag = document.createDocumentFragment();
  for(let i=1;i<=labels.length;i++){
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML = `
      <div class="n">${i}.</div>
      <div class="q">${labels[i-1]}</div>
      <div class="binary" role="group" aria-label="Sim/Não item ${i}">
        <label><input type="radio" name="${name}-${i}" value="1" required/> Sim</label>
        <label><input type="radio" name="${name}-${i}" value="0" required/> Não</label>
      </div>
    `;
    frag.appendChild(row);
  }
  return frag;
}

/* --------- Leitura dos valores --------- */
function readScale(name, nItems){
  const values = [];
  for(let i=1;i<=nItems;i++){
    const el = document.querySelector(`input[name="${name}-${i}"]:checked`);
    if(!el) return null;
    values.push(Number(el.value));
  }
  return values;
}

function mean(arr){ return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0; }
function m2(val, d=2){ return Number(val.toFixed(d)); }

function classifyRange(val, [lowMax, midMin, midMax, highMin, veryHighMin]){
  if(val <= lowMax) return "Baixo";
  if(val >= veryHighMin) return "Muito Alto";
  if(val >= highMin) return "Alto";
  if(val >= midMin && val <= midMax) return "Médio";
  return "—";
}

function fmtDate(ts){
  const d = new Date(ts);
  return d.toLocaleString('pt-BR', {dateStyle:'short', timeStyle:'short'});
}

/* ============ TEXTOS DAS QUESTÕES ============ */
/* SRQ-20 */
const SRQ_ITEMS = [
  "Você tem dores de cabeça frequentes?",
  "Tem falta de apetite?",
  "Dorme mal?",
  "Assusta-se com facilidade?",
  "Tem tremores nas mãos?",
  "Sente-se nervoso(a), tenso(a) ou preocupado(a)?",
  "Tem má digestão?",
  "Tem dificuldades de pensar com clareza?",
  "Tem se sentido triste ultimamente?",
  "Tem chorado mais do que costume?",
  "Encontra dificuldades para realizar com satisfação suas atividades diárias?",
  "Tem dificuldades para tomar decisões?",
  "Tem dificuldades no serviço (seu trabalho é penoso, causa-lhe sofrimento?)",
  "Tem dificuldade de desempenhar um papel útil em sua vida?",
  "Tem perdido o interesse pelas coisas?",
  "Você se sente uma pessoa inútil, sem préstimo?",
  "Tem tido ideia de acabar com a vida?",
  "Sente-se cansado(a) o tempo todo?",
  "Você se cansa com facilidade?",
  "Tem sensações desagradáveis no estômago?"
];

/* MHC-SF */
const MHC_ITEMS = [
  "Feliz",
  "Interessado(a) na vida",
  "Satisfeito(a) com a vida",
  "Que tem uma contribuição importante para a sociedade",
  "Que pertence a uma comunidade (como um grupo social ou a sua vizinhança)",
  "Que a nossa sociedade é um bom lugar ou está se tornando um lugar melhor para todas as pessoas",
  "Que as pessoas são essencialmente boas",
  "Que a forma como a nossa sociedade funciona faz sentido para você",
  "Que gosta da maior parte das características da sua personalidade",
  "Que é competente na gestão das responsabilidades do dia-a-dia",
  "Que tem relações agradáveis e de confiança com os outros",
  "Que teve experiências que o(a) desafiaram e permitiram crescer e tornar-se uma pessoa melhor",
  "Que tem confiança para pensar ou expressar as suas opiniões e ideias",
  "Que a sua vida tem um sentido ou direção"
];

/* EST (25) */
const EST_ITEMS = [
  "Com o espírito de colaboração dos meus colegas de trabalho.",
  "Com o modo como meu chefe organiza o trabalho do meu setor.",
  "Com o número de vezes que já fui promovido nesta empresa.",
  "Com as garantias que a empresa oferece a quem é promovido.",
  "Com o meu salário comparado com o quanto eu trabalho.",
  "Com o tipo de amizade que meus colegas demonstram por mim.",
  "Com o grau de interesse que minhas tarefas me despertam.",
  "Com o meu salário comparado à minha capacidade profissional.",
  "Com o interesse do meu chefe pelo meu trabalho.",
  "Com a maneira como esta empresa realiza promoções de seu pessoal.",
  "Com a capacidade de meu trabalho absorver-me.",
  "Com o meu salário comparado ao custo de vida.",
  "Com a oportunidade de fazer o tipo de trabalho que faço.",
  "Com a maneira como me relaciono com os meus colegas de trabalho.",
  "Com a quantia que eu recebo desta empresa ao final de cada mês.",
  "Com as oportunidades de ser promovido nesta empresa.",
  "Com a quantidade de amigos que eu tenho entre meus colegas de trabalho.",
  "Com as preocupações exigidas pelo meu trabalho.",
  "Com o entendimento entre mim e meu chefe.",
  "Com o tempo que eu tenho de esperar para receber uma promoção nesta empresa.",
  "Com o meu salário comparado aos meus esforços no trabalho.",
  "Com a maneira como meu chefe me trata.",
  "Com a variedade de tarefas que realizo.",
  "Com a confiança que eu posso ter em meus colegas de trabalho.",
  "Com a capacidade profissional do meu chefe."
];

/* PERMA (23) – textos alinhados aos itens do PERMA-Profiler em PT-BR */
const PERMA_ITEMS = [
  "Em geral, com que frequência você sente que está fazendo progresso na conquista dos seus objetivos?",
  "Com que frequência você fica profundamente envolvido(a) na atividade que está realizando?",
  "Em geral, com que frequência você se sente positivo(a)/alegre?",
  "Em geral, com que frequência você se sente ansioso(a)?",
  "Com que frequência você conquista objetivos importantes que estabeleceu para si mesmo(a)?",
  "Em geral, como você diria que é a sua saúde física?",
  "Em geral, o quanto você leva uma vida significativa e com propósito?",
  "Quanto você recebe ajuda e apoio de outras pessoas quando precisa?",
  "Em geral, o quanto você acha que o que faz na sua vida é relevante e vale a pena?",
  "Em geral, quanto você se sente engajado(a) e interessado(a) nas coisas?",
  "O quanto você se sente solitário(a) na sua vida diária?",
  "O quanto você está satisfeito(a) com a sua saúde física atual?",
  "Em geral, com que frequência você se sente positivo(a)?",
  "Em geral, com que frequência você se sente com raiva?",
  "Em geral, com que frequência você é capaz de lidar com suas responsabilidades?",
  "Em geral, com que frequência você se sente triste?",
  "Com que frequência você perde a noção do tempo enquanto faz algo que gosta?",
  "Em comparação com outras pessoas de mesma idade e sexo que você, como está a sua saúde?",
  "Geralmente, o quanto você sente que sua vida tem direção e sentido?",
  "Quão satisfeito(a) você está com seus relacionamentos pessoais?",
  "Em geral, quão confiantes e positivas são as suas relações com outras pessoas?",
  "Em geral, o quanto você se sente contente?",
  "Considerando todas as coisas juntas, quão feliz você diria que está?"
];

/* UWES (17) */
const UWES_ITEMS = [
  "Em meu trabalho, sinto-me repleto(a) de energia.",
  "Eu acho que o trabalho que realizo é cheio de significado e propósito.",
  "O “tempo voa” quando estou trabalhando.",
  "No trabalho, sinto-me com força e vigor (vitalidade).",
  "Estou entusiasmado(a) com meu trabalho.",
  "Quando estou trabalhando, esqueço tudo o que se passa ao meu redor.",
  "Meu trabalho me inspira.",
  "Quando me levanto pela manhã, tenho vontade de ir trabalhar.",
  "Sinto-me feliz quando trabalho intensamente.",
  "Estou orgulhoso(a) com o trabalho que realizo.",
  "Sinto-me envolvido(a) com o trabalho que faço.",
  "Posso continuar trabalhando durante longos períodos de tempo.",
  "Para mim, meu trabalho é desafiador.",
  "“Deixo-me levar” pelo meu trabalho.",
  "Em meu trabalho, sou uma pessoa mentalmente resiliente.",
  "É difícil desligar-me do trabalho.",
  "No trabalho, sou persistente mesmo quando as coisas não vão bem."
];

/* ============ LOCALSTORAGE (HISTÓRICO) ============ */
const LS_KEYS = {
  srq: 'hist_srq20',
  mhc: 'hist_mhc',
  est: 'hist_est',
  perma: 'hist_perma',
  uwes: 'hist_uwes',
};

function loadHist(key){
  try{ return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch{ return []; }
}
function saveHist(key, arr){
  localStorage.setItem(key, JSON.stringify(arr));
}
function addHist(key, rec){
  const arr = loadHist(key);
  arr.unshift(rec);
  saveHist(key, arr);
}
function delHist(key, id){
  const arr = loadHist(key).filter(r => r.id !== id);
  saveHist(key, arr);
}

/* Render genérico de histórico como tabela */
function renderHistory(containerId, key){
  const el = $(`#${containerId}`);
  const items = loadHist(key);
  if(!items.length){
    el.innerHTML = `<p class="empty">Sem registros ainda.</p>`;
    return;
  }
  const rows = items.map(r => `
    <tr>
      <td><b>${r.name || '—'}</b><br/><small>${fmtDate(r.ts)}</small></td>
      <td>${r.resultHTML}</td>
      <td class="actions">
        <button class="btn ghost btn-del" data-key="${key}" data-id="${r.id}">🗑 Apagar</button>
      </td>
    </tr>
  `).join('');
  el.innerHTML = `
    <table class="table">
      <thead><tr><th>Paciente / Data</th><th>Resultado</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
  el.querySelectorAll('.btn-del').forEach(b=>{
    b.addEventListener('click', ()=>{
      delHist(b.dataset.key, b.dataset.id);
      renderHistory(containerId, key);
    });
  });
}

/* ============ NAVEGAÇÃO ============ */
$$('[data-open]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    showView(btn.dataset.open);
    if(btn.dataset.open==='srq20') renderHistory('hist-srq20', LS_KEYS.srq);
    if(btn.dataset.open==='mhc')   renderHistory('hist-mhc', LS_KEYS.mhc);
    if(btn.dataset.open==='est')   renderHistory('hist-est', LS_KEYS.est);
    if(btn.dataset.open==='perma') renderHistory('hist-perma', LS_KEYS.perma);
    if(btn.dataset.open==='uwes')  renderHistory('hist-uwes', LS_KEYS.uwes);
  });
});
$$('.back').forEach(btn=>{
  btn.addEventListener('click',()=>showView('menu'));
});

/* ============ SRQ-20 ============ */
(function initSRQ(){
  const form = $("#form-srq20");
  form.appendChild(makeBinaryWithLabels("srq", SRQ_ITEMS));

  $("#reset-srq20").addEventListener("click", ()=> { $("#out-srq20").innerHTML = ""; });

  $("#calc-srq20").addEventListener("click", ()=>{
    const vals = readScale("srq", SRQ_ITEMS.length);
    if(!vals){ alert("Responda todos os itens."); return; }
    const sim = vals.filter(v=>v===1).length;
    const temSofrimento = sim >= 7;

    const clsHTML = temSofrimento
      ? `<span class="badge err">Sofrimento mental</span>`
      : `<span class="badge ok">Sem indicação de sofrimento</span>`;

    const outHTML = `
      <h3>Resultado</h3>
      <p class="kv"><b>Total de “Sim”:</b> ${sim} / ${SRQ_ITEMS.length}</p>
      <p>${clsHTML}</p>
    `;
    $("#out-srq20").innerHTML = outHTML;

    const name = $("#name-srq20").value.trim();
    if(name){
      addHist(LS_KEYS.srq, { id:uuid(), ts:Date.now(), name, resultHTML: outHTML });
      renderHistory('hist-srq20', LS_KEYS.srq);
    }
  });

  renderHistory('hist-srq20', LS_KEYS.srq);
})();

/* ============ MHC-SF (cortes 6–7 e 1–2) ============ */
(function initMHC(){
  const form = $("#form-mhc");
  form.appendChild(makeNumberScaleWithLabels("mhc", MHC_ITEMS, 1, 7));

  $("#reset-mhc").addEventListener("click", ()=> { $("#out-mhc").innerHTML = ""; });

  $("#calc-mhc").addEventListener("click", ()=>{
    const vals = readScale("mhc", MHC_ITEMS.length);
    if(!vals){ alert("Responda todos os itens."); return; }

    const hedonic = vals.slice(0,3);
    const eudaimonic = vals.slice(3,14);

    const hedonicHigh = hedonic.some(v => v >= 6);
    const euHighCount = eudaimonic.filter(v => v >= 6).length;

    const hedonicLow = hedonic.some(v => v <= 2);
    const euLowCount = eudaimonic.filter(v => v <= 2).length;

    let classe = "Saúde Mental Moderada";
    if(hedonicHigh && euHighCount >= 6) classe = "Florescimento";
    else if(hedonicLow && euLowCount >= 6) classe = "Definhamento";

    const badgeCls = classe==='Florescimento' ? 'ok' : (classe==='Definhamento' ? 'err' : 'warn');

    const outHTML = `
      <h3>Resultado</h3>
      <p class="kv"><b>Itens 1–3 altos (6–7):</b> ${hedonicHigh ? "Sim" : "Não"}</p>
      <p class="kv"><b>Itens 4–14 altos (6–7):</b> ${euHighCount} de 11</p>
      <p class="kv"><b>Itens 1–3 baixos (1–2):</b> ${hedonicLow ? "Sim" : "Não"}</p>
      <p class="kv"><b>Itens 4–14 baixos (1–2):</b> ${euLowCount} de 11</p>
      <p>Classificação: <span class="badge ${badgeCls}">${classe}</span></p>
    `;
    $("#out-mhc").innerHTML = outHTML;

    const name = $("#name-mhc").value.trim();
    if(name){
      addHist(LS_KEYS.mhc, { id:uuid(), ts:Date.now(), name, resultHTML: outHTML });
      renderHistory('hist-mhc', LS_KEYS.mhc);
    }
  });

  renderHistory('hist-mhc', LS_KEYS.mhc);
})();

/* ============ EST ============ */
(function initEST(){
  const form = $("#form-est");
  form.appendChild(makeNumberScaleWithLabels("est", EST_ITEMS, 1, 7));

  $("#reset-est").addEventListener("click", ()=> { $("#out-est").innerHTML = ""; });

  const dims = {
    "Colegas de Trabalho": [1,6,14,17,24],
    "Salário": [5,8,12,15,21],
    "Liderança Imediata": [2,9,19,22,25],
    "Natureza do Trabalho": [7,11,13,18,23],
    "Promoções": [3,4,10,16,20],
  };

  function interpret(meanVal){
    if(meanVal <= 3.9) return {label:"Insatisfação", cls:"err"};
    if(meanVal >= 5.0) return {label:"Satisfação", cls:"ok"};
    if(meanVal >= 4.0 && meanVal <= 4.9) return {label:"Indiferença", cls:"warn"};
    return {label:"—", cls:""};
  }

  $("#calc-est").addEventListener("click", ()=>{
    const vals = readScale("est", EST_ITEMS.length);
    if(!vals){ alert("Responda todos os itens."); return; }

    let htmlList = ``;
    const dimMeans = [];
    for(const [nome, idxs] of Object.entries(dims)){
      const scores = idxs.map(i => vals[i-1]);
      const m = m2(mean(scores));
      dimMeans.push(m);
      const it = interpret(m);
      htmlList += `<li class="kv"><b>${nome}:</b> ${m} <span class="badge ${it.cls}">${it.label}</span></li>`;
    }
    const geral = m2(mean(dimMeans));
    const outHTML = `
      <h3>Resultados por Dimensão</h3>
      <div class="kv">Quanto maior a média (1–7), maior o grau de contentamento.</div>
      <ul>${htmlList}</ul>
      <p class="kv"><b>Média global (média das dimensões):</b> ${geral}</p>
    `;
    $("#out-est").innerHTML = outHTML;

    const name = $("#name-est").value.trim();
    if(name){
      addHist(LS_KEYS.est, { id:uuid(), ts:Date.now(), name, resultHTML: outHTML });
      renderHistory('hist-est', LS_KEYS.est);
    }
  });

  renderHistory('hist-est', LS_KEYS.est);
})();

/* ============ PERMA ============ */
(function initPERMA(){
  const form = $("#form-perma");
  form.appendChild(makeNumberScaleWithLabels("perma", PERMA_ITEMS, 1, 10));

  $("#reset-perma").addEventListener("click", ()=> { $("#out-perma").innerHTML = ""; });

  const sets = {
    P: [3,13,22],
    E: [2,10,17],
    R: [8,20,21],
    M: [7,9,19],
    A: [1,5,15],
    "PERMA Geral": [1,2,3,5,7,8,9,10,13,15,17,19,20,21,22,23],
    "Emoções Negativas": [4,14,16],
    "Saúde Física": [6,12,18],
    "Solidão": [11],
  };

  $("#calc-perma").addEventListener("click", ()=>{
    const vals = readScale("perma", PERMA_ITEMS.length);
    if(!vals){ alert("Responda todos os itens."); return; }

    let list = ``;
    for(const [nome, idxs] of Object.entries(sets)){
      const scores = idxs.map(i => vals[i-1]);
      const m = m2(mean(scores));
      list += `<li class="kv"><b>${nome}:</b> ${m}</li>`;
    }
    const outHTML = `<h3>Resultados</h3><ul>${list}</ul>`;
    $("#out-perma").innerHTML = outHTML;

    const name = $("#name-perma").value.trim();
    if(name){
      addHist(LS_KEYS.perma, { id:uuid(), ts:Date.now(), name, resultHTML: outHTML });
      renderHistory('hist-perma', LS_KEYS.perma);
    }
  });

  renderHistory('hist-perma', LS_KEYS.perma);
})();

/* ============ UWES ============ */
(function initUWES(){
  const form = $("#form-uwes");
  form.appendChild(makeNumberScaleWithLabels("uwes", UWES_ITEMS, 0, 6));

  $("#reset-uwes").addEventListener("click", ()=> { $("#out-uwes").innerHTML = ""; });

  const VIGOR = [1,4,8,12,15,17];
  const DEDIC = [2,5,7,10,13];
  const ABSOR = [3,6,9,11,14,16];

  const RANGES = {
    vigor:        [1.93, 1.94, 3.06, 3.07, 4.67],
    dedicacao:    [3.20, 3.21, 4.80, 4.81, 5.61],
    absorcao:     [3.00, 3.01, 4.90, 4.91, 5.80],
    total:        [2.75, 2.76, 4.40, 4.41, 5.36],
  };

  $("#calc-uwes").addEventListener("click", ()=>{
    const vals = readScale("uwes", UWES_ITEMS.length);
    if(!vals){ alert("Responda todos os itens."); return; }

    const mV = m2(mean(VIGOR.map(i=>vals[i-1])));
    const mD = m2(mean(DEDIC.map(i=>vals[i-1])));
    const mA = m2(mean(ABSOR.map(i=>vals[i-1])));
    const mT = m2(mean(vals));

    const clsV = classifyRange(mV, RANGES.vigor);
    const clsD = classifyRange(mD, RANGES.dedicacao);
    const clsA = classifyRange(mA, RANGES.absorcao);
    const clsT = classifyRange(mT, RANGES.total);

    const outHTML = `
      <h3>Resultados</h3>
      <ul>
        <li class="kv"><b>Vigor:</b> ${mV} <span class="badge ${clsV==='Baixo'?'err':(clsV==='Médio'?'warn':'ok')}">(${clsV})</span></li>
        <li class="kv"><b>Dedicação:</b> ${mD} <span class="badge ${clsD==='Baixo'?'err':(clsD==='Médio'?'warn':'ok')}">(${clsD})</span></li>
        <li class="kv"><b>Absorção:</b> ${mA} <span class="badge ${clsA==='Baixo'?'err':(clsA==='Médio'?'warn':'ok')}">(${clsA})</span></li>
        <li class="kv"><b>Escore Total:</b> ${mT} <span class="badge ${clsT==='Baixo'?'err':(clsT==='Médio'?'warn':'ok')}">(${clsT})</span></li>
      </ul>
      <p class="small">Interpretação geral: quanto maior a média, maior o engajamento.</p>
    `;
    $("#out-uwes").innerHTML = outHTML;

    const name = $("#name-uwes").value.trim();
    if(name){
      addHist(LS_KEYS.uwes, { id:uuid(), ts:Date.now(), name, resultHTML: outHTML });
      renderHistory('hist-uwes', LS_KEYS.uwes);
    }
  });

  renderHistory('hist-uwes', LS_KEYS.uwes);
})();

/* ============ START ============ */
showView('menu');
