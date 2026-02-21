// ZenAiOS Medical Calculators - Complete Implementation

const CALCS = {
  current: 'grace',
  
  // GRACE Score (ACS Risk) - Complete
  grace: {
    title: 'Scor GRACE (ACS)',
    fields: [
      { id: 'g_age', label: 'Vârstă (ani)', type: 'number', min: 18, max: 120 },
      { id: 'g_hr', label: 'Frecvență cardiacă (bpm)', type: 'number', min: 30, max: 200 },
      { id: 'g_sbp', label: 'Tensiune sistolică (mmHg)', type: 'number', min: 60, max: 250 },
      { id: 'g_cr', label: 'Creatinină (mg/dL)', type: 'number', step: 0.1, min: 0.5, max: 15 },
      { id: 'g_killip', label: 'Clasa Killip', type: 'select', options: [
        { value: 0, text: 'I - Fără insuficiență cardiacă' },
        { value: 1, text: 'II - Ronchi, creștere VCI' },
        { value: 2, text: 'III - Edem pulmonar acut' },
        { value: 3, text: 'IV - Șoc cardiogen' }
      ]},
      { id: 'g_arrest', label: 'Stop cardiac la prezentare', type: 'select', options: [
        { value: 0, text: 'Nu' },
        { value: 1, text: 'Da' }
      ]},
      { id: 'g_st', label: 'Deviație ST', type: 'select', options: [
        { value: 0, text: 'Nu' },
        { value: 1, text: 'Da' }
      ]},
      { id: 'g_trop', label: 'Troponină crescută', type: 'select', options: [
        { value: 0, text: 'Nu' },
        { value: 1, text: 'Da' }
      ]}
    ],
    calculate() {
      const age = parseInt(document.getElementById('g_age').value) || 0;
      const hr = parseInt(document.getElementById('g_hr').value) || 0;
      const sbp = parseInt(document.getElementById('g_sbp').value) || 0;
      const cr = parseFloat(document.getElementById('g_cr').value) || 0;
      const killip = parseInt(document.getElementById('g_killip').value) || 0;
      const arrest = parseInt(document.getElementById('g_arrest').value) || 0;
      const st = parseInt(document.getElementById('g_st').value) || 0;
      const trop = parseInt(document.getElementById('g_trop').value) || 0;

      // GRACE Score formula (simplified validated version)
      let score = 0;
      
      // Age points
      if (age <= 39) score += 0;
      else if (age <= 49) score += 5;
      else if (age <= 59) score += 10;
      else if (age <= 69) score += 19;
      else if (age <= 79) score += 28;
      else if (age <= 89) score += 37;
      else score += 46;

      // Heart rate
      if (hr <= 49) score += 0;
      else if (hr <= 69) score += 3;
      else if (hr <= 89) score += 6;
      else if (hr <= 109) score += 8;
      else if (hr <= 149) score += 13;
      else score += 18;

      // Systolic BP
      if (sbp <= 79) score += 28;
      else if (sbp <= 99) score += 20;
      else if (sbp <= 119) score += 12;
      else if (sbp <= 139) score += 5;
      else if (sbp <= 159) score += 0;
      else if (sbp <= 199) score += 3;
      else score += 6;

      // Creatinine
      if (cr <= 0.39) score += 1;
      else if (cr <= 0.79) score += 4;
      else if (cr <= 1.19) score += 7;
      else if (cr <= 1.59) score += 10;
      else if (cr <= 1.99) score += 13;
      else if (cr <= 3.99) score += 21;
      else score += 28;

      // Killip class
      score += killip * 15; // I=0, II=15, III=30, IV=45

      // Other factors
      if (arrest) score += 43;
      if (st) score += 18;
      if (trop) score += 16;

      // Risk interpretation
      let risk, color, advice;
      if (score <= 88) {
        risk = 'Risc SCĂZUT';
        color = '#10B981';
        advice = 'Mortality < 3% at 6 months';
      } else if (score <= 118) {
        risk = 'Risc INTERMEDIAR';
        color = '#F59E0B';
        advice = 'Mortality 3-8% at 6 months';
      } else {
        risk = 'Risc CRESCUT';
        color = '#EF4444';
        advice = 'Mortality > 8% at 6 months';
      }

      return { score, risk, color, advice };
    }
  },

  // CHA2DS2-VASc Score
  cha2ds2: {
    title: 'CHA₂DS₂-VASc (Stroke Risk in AF)',
    fields: [
      { id: 'c_chf', label: 'Insuficiență cardiacă congestivă', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 'c_htn', label: 'Hipertensiune arterială', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 'c_age', label: 'Vârstă', type: 'select', options: [
        { value: 0, text: '< 65 ani' },
        { value: 1, text: '65-74 ani' },
        { value: 2, text: '≥ 75 ani' }
      ]},
      { id: 'c_dm', label: 'Diabet zaharat', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 'c_stroke', label: 'Accident vascular cerebral/TIA', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 2, text: 'Da (2 puncte)' }] },
      { id: 'c_vasc', label: 'Boală vasculară (infarct MI, AOM)', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 'c_sex', label: 'Sex feminin', type: 'select', options: [{ value: 0, text: 'Masculin' }, { value: 1, text: 'Feminin' }] }
    ],
    calculate() {
      const chf = parseInt(document.getElementById('c_chf').value) || 0;
      const htn = parseInt(document.getElementById('c_htn').value) || 0;
      const age = parseInt(document.getElementById('c_age').value) || 0;
      const dm = parseInt(document.getElementById('c_dm').value) || 0;
      const stroke = parseInt(document.getElementById('c_stroke').value) || 0;
      const vasc = parseInt(document.getElementById('c_vasc').value) || 0;
      const sex = parseInt(document.getElementById('c_sex').value) || 0;

      // Sex only counts if age > 65
      const sexPoints = (age >= 1 && sex === 1) ? 1 : 0;
      const score = chf + htn + age + dm + stroke + vasc + sexPoints;

      let risk, color, advice;
      if (score === 0) {
        risk = 'Risc SCĂZUT';
        color = '#10B981';
        advice = 'Fără anticoagulant';
      } else if (score === 1) {
        risk = 'Risc MODERAT';
        color = '#F59E0B';
        advice = 'Consideră anticoagulant (NOAC preferat)';
      } else {
        risk = 'Risc CRESCUT';
        color = '#EF4444';
        advice = 'Anticoagulant obligatoriu (NOAC)';
      }

      // Annual stroke risk
      const strokeRisk = ['0%', '1.3%', '2.2%', '3.2%', '4.0%', '6.7%', '9.8%', '9.6%', '6.7%'][Math.min(score, 8)] || '>10%';

      return { score, risk, color, advice: `${advice} · Risc AVC/an: ${strokeRisk}` };
    }
  },

  // HAS-BLED Score
  hasbled: {
    title: 'HAS-BLED (Bleeding Risk)',
    fields: [
      { id: 'h_htn', label: 'HTN necontrolată (>160 mmHg)', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 'h_renal', label: 'Disfuncție renală (dializă, Cr >2.3)', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 'h_liver', label: 'Disfuncție hepatică (ciroză, bilirubină >2)', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 'h_stroke', label: 'Istoric AVC', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 'h_bleed', label: 'Istoric sângerare majoră', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 'h_inr', label: 'INR labil (timp terapeutic <60%)', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 'h_age', label: 'Vârstă > 65 ani', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 'h_drugs', label: 'Aspiră/NSAID', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 'h_alc', label: 'Alcool (>8 unități/săptămână)', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] }
    ],
    calculate() {
      let score = 0;
      ['h_htn', 'h_renal', 'h_liver', 'h_stroke', 'h_bleed', 'h_inr', 'h_age', 'h_drugs', 'h_alc'].forEach(id => {
        score += parseInt(document.getElementById(id).value) || 0;
      });

      let risk, color, advice;
      if (score <= 2) {
        risk = 'Risc SCĂZUT';
        color = '#10B981';
        advice = 'Sângerare 1-2% pe an';
      } else if (score === 3) {
        risk = 'Risc MODERAT';
        color = '#F59E0B';
        advice = 'Monitorizare atentă';
      } else {
        risk = 'Risc CRESCUT';
        color = '#EF4444';
        advice = 'Revizuiește strategia · Sângerare ~9% pe an';
      }

      return { score, risk, color, advice };
    }
  },

  // TIMI Score
  timi: {
    title: 'TIMI Score (CAD)',
    fields: [
      { id: 't_age', label: 'Vârstă ≥ 65 ani', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 't_risk', label: '≥ 3 factori risc CAD', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 't_cad', label: 'Istoric CAD susținut', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 't_aspirin', label: 'Aspirină în ultimele 7 zile', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 't_angina', label: 'Angină severă ≥ 2 episoade/24h', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 't_st', label: 'Deviație ST ≥ 0.5mm', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] },
      { id: 't_trop', label: 'Markeri cardiaci pozitivi', type: 'select', options: [{ value: 0, text: 'Nu' }, { value: 1, text: 'Da' }] }
    ],
    calculate() {
      let score = 0;
      ['t_age', 't_risk', 't_cad', 't_aspirin', 't_angina', 't_st', 't_trop'].forEach(id => {
        score += parseInt(document.getElementById(id).value) || 0;
      });

      let risk, color, advice;
      if (score <= 2) {
        risk = 'Risc SCĂZUT';
        color = '#10B981';
        advice = 'Evenimente 4.7% la 14 zile';
      } else if (score <= 4) {
        risk = 'Risc INTERMEDIAR';
        color = '#F59E0B';
        advice = 'Evenimente 10-16% la 14 zile';
      } else {
        risk = 'Risc CRESCUT';
        color = '#EF4444';
        advice = 'Evenimente > 20% la 14 zile';
      }

      return { score, risk, color, advice };
    }
  },

  // eGFR (CKD-EPI)
  egfr: {
    title: 'eGFR (CKD-EPI)',
    fields: [
      { id: 'e_cr', label: 'Creatinină (mg/dL)', type: 'number', step: 0.01, min: 0.3, max: 15 },
      { id: 'e_age', label: 'Vârstă (ani)', type: 'number', min: 18, max: 120 },
      { id: 'e_sex', label: 'Sex', type: 'select', options: [{ value: 'f', text: 'Feminin' }, { value: 'm', text: 'Masculin' }] },
      { id: 'e_race', label: 'Rasă', type: 'select', options: [{ value: 0, text: 'Altă rasă' }, { value: 1, text: 'Afro-american' }] }
    ],
    calculate() {
      const cr = parseFloat(document.getElementById('e_cr').value) || 0;
      const age = parseInt(document.getElementById('e_age').value) || 0;
      const sex = document.getElementById('e_sex').value || 'f';
      const race = parseInt(document.getElementById('e_race').value) || 0;

      // CKD-EPI formula
      const kappa = sex === 'f' ? 0.739 : 0.9;
      const alpha = sex === 'f' ? -0.329 : -0.411;
      const femaleFactor = sex === 'f' ? 1.018 : 1;
      const raceFactor = race === 1 ? 1.159 : 1;

      const minTerm = Math.min(cr / kappa, 1);
      const maxTerm = Math.max(cr / kappa, 1);

      const egfr = 141 * Math.pow(minTerm, alpha) * Math.pow(maxTerm, -1.209) * Math.pow(0.993, age) * femaleFactor * raceFactor;

      let stage, color, advice;
      if (egfr >= 90) {
        stage = 'G1 (Normal) ≥90';
        color = '#10B981';
        advice = 'Rinichi normal sau crescut';
      } else if (egfr >= 60) {
        stage = 'G2 (Scăzut ușor) 60-89';
        color = '#22C55E';
        advice = 'Monitorizare periodică';
      } else if (egfr >= 45) {
        stage = 'G3a (Scăzut moderat) 45-59';
        color = '#F59E0B';
        advice = 'Evaluare nefrologică';
      } else if (egfr >= 30) {
        stage = 'G3b (Scăzut sever) 30-44';
        color = '#F97316';
        advice = 'Urmărire nefrologică';
      } else if (egfr >= 15) {
        stage = 'G4 (Scăzut grav) 15-29';
        color = '#EF4444';
        advice = 'Pregătire dializă';
      } else {
        stage = 'G5 (Insuficiență renală) <15';
        color = '#DC2626';
        advice = 'Dializă necesară';
      }

      return { score: Math.round(egfr), risk: stage, color, advice };
    }
  },

  // CrCl (Cockcroft-Gault)
  crcl: {
    title: 'Clearance Creatinină (Cockcroft-Gault)',
    fields: [
      { id: 'cg_cr', label: 'Creatinină (mg/dL)', type: 'number', step: 0.01, min: 0.3, max: 15 },
      { id: 'cg_age', label: 'Vârstă (ani)', type: 'number', min: 18, max: 120 },
      { id: 'cg_weight', label: 'Greutate (kg)', type: 'number', min: 30, max: 200 },
      { id: 'cg_sex', label: 'Sex', type: 'select', options: [{ value: 'f', text: 'Feminin' }, { value: 'm', text: 'Masculin' }] }
    ],
    calculate() {
      const cr = parseFloat(document.getElementById('cg_cr').value) || 1;
      const age = parseInt(document.getElementById('cg_age').value) || 0;
      const weight = parseFloat(document.getElementById('cg_weight').value) || 0;
      const sex = document.getElementById('cg_sex').value || 'f';

      const crcl = ((140 - age) * weight) / (72 * cr) * (sex === 'f' ? 0.85 : 1);

      let risk, color, advice;
      if (crcl >= 90) {
        risk = 'Normal / G1';
        color = '#10B981';
      } else if (crcl >= 60) {
        risk = 'Scăzut ușor / G2';
        color = '#22C55E';
      } else if (crcl >= 30) {
        risk = 'Scăzut moderat / G3';
        color = '#F59E0B';
      } else if (crcl >= 15) {
        risk = 'Scăzut sever / G4';
        color = '#F97316';
      } else {
        risk = 'Insuficiență renală / G5';
        color = '#EF4444';
      }

      return { score: Math.round(crcl), risk, color, advice: 'Ajustare doză medicamente' };
    }
  },

  // BMI
  bmi: {
    title: 'BMI (Indice Masă Corporală)',
    fields: [
      { id: 'b_weight', label: 'Greutate (kg)', type: 'number', min: 30, max: 300 },
      { id: 'b_height', label: 'Înălțime (cm)', type: 'number', min: 100, max: 250 }
    ],
    calculate() {
      const weight = parseFloat(document.getElementById('b_weight').value) || 0;
      const height = parseFloat(document.getElementById('b_height').value) || 1;

      const bmi = weight / Math.pow(height / 100, 2);
      const score = Math.round(bmi * 10) / 10;

      let risk, color, advice;
      if (bmi < 18.5) {
        risk = 'Subponderal';
        color = '#3B82F6';
        advice = '< 18.5';
      } else if (bmi < 25) {
        risk = 'Normal';
        color = '#10B981';
        advice = '18.5 - 24.9';
      } else if (bmi < 30) {
        risk = 'Supraponderal';
        color = '#F59E0B';
        advice = '25 - 29.9';
      } else if (bmi < 35) {
        risk = 'Obezitate Gr I';
        color = '#F97316';
        advice = '30 - 34.9';
      } else if (bmi < 40) {
        risk = 'Obezitate Gr II';
        color = '#EF4444';
        advice = '35 - 39.9';
      } else {
        risk = 'Obezitate Gr III';
        color = '#DC2626';
        advice = '≥ 40';
      }

      return { score, risk, color, advice };
    }
  }
};

// UI Functions
function showCalc(type) {
  CALCS.current = type;
  const calc = CALCS[type];
  
  // Update button states
  document.querySelectorAll('#calcButtons button').forEach(b => {
    b.classList.remove('on');
    b.classList.add('off');
  });
  const activeBtn = document.getElementById('btn-' + type);
  if (activeBtn) {
    activeBtn.classList.remove('off');
    activeBtn.classList.add('on');
  }

  // Generate form
  let html = `<div style="display:flex;flex-direction:column;gap:12px">`;
  calc.fields.forEach(field => {
    html += `<div class="calc-field">
      <label>${field.label}</label>
      ${field.type === 'select' 
        ? `<select id="${field.id}">${field.options.map(o => `<option value="${o.value}">${o.text}</option>`).join('')}</select>`
        : `<input type="${field.type}" id="${field.id}" ${field.step ? `step="${field.step}"` : ''} ${field.min !== undefined ? `min="${field.min}"` : ''} ${field.max !== undefined ? `max="${field.max}"` : ''} placeholder="${field.label}">`
      }
    </div>`;
  });
  
  html += `
    <div class="calc-result" id="calcResult" style="display:none">
      <div class="cr-val" id="resultVal">--</div>
      <div class="cr-lbl" id="resultLbl"></div>
      <div id="resultAdvice" style="font-size:12px;margin-top:8px;color:var(--ink3)"></div>
    </div>
    <button class="calc-run" onclick="runCurrentCalc()">Calculează</button>
  </div>`;

  document.getElementById('calcForm').innerHTML = html;
}

function runCurrentCalc() {
  const calc = CALCS[CALCS.current];
  const result = calc.calculate();
  
  const resultBox = document.getElementById('calcResult');
  resultBox.style.display = 'block';
  resultBox.style.borderColor = result.color;
  resultBox.style.background = result.color + '15'; // 15 hex = ~8% opacity

  document.getElementById('resultVal').textContent = result.score;
  document.getElementById('resultVal').style.color = result.color;
  document.getElementById('resultLbl').textContent = result.risk;
  document.getElementById('resultLbl').style.color = result.color;
  document.getElementById('resultLbl').style.fontWeight = '700';
  document.getElementById('resultAdvice').textContent = result.advice;
}

// Exports for global access
window.CALCS = CALCS;
window.showCalc = showCalc;
window.runCurrentCalc = runCurrentCalc;
