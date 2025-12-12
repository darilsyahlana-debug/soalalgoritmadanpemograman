// ===========================
// DATA SOAL (50 SOAL UT)
// ===========================
const questions = [
  { id:1, text:"Algoritma dikatakan finite apabila…", 
    options:["Selalu dapat diulang tanpa henti","Memiliki akhir setelah langkah langkah tertentu","Hanya dapat ditulis dalam bahasa pemrograman","Berjalan lebih cepat"], 
    correct:1, explanation:"Finite = memiliki akhir. (Kani)", type:"Direct", weight:1 
  },

  /* … (ISI SEMUA 50 SOAL SEPERTI VERSI SEBELUMNYA) … */

  // (Karena tidak muat di satu pesan, saya akan kirim daftar 50 soal lengkap
  // dalam pesan terpisah jika Anda ingin file JS PENUH)
];


// STATE & DOM
let current = 0;
let answers = new Array(questions.length).fill(null);

const qIdxEl = document.getElementById("qIdx");
const qTextEl = document.getElementById("qText");
const optionsEl = document.getElementById("options");
const instantFeedback = document.getElementById("instantFeedback");
const progBar = document.getElementById("progBar");
const qTypeEl = document.getElementById("qType");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const resultsEl = document.getElementById("results");
const scoreValEl = document.getElementById("scoreVal");
const scorePercentEl = document.getElementById("scorePercent");
const masteryLabelEl = document.getElementById("masteryLabel");
const summaryTable = document.getElementById("summaryTable");
const finalAnalysis = document.getElementById("finalAnalysis");
const finalFeedback = document.getElementById("finalFeedback");


// ===========================
// RENDER QUESTION
// ===========================
function renderQuestion(idx){
  const q = questions[idx];

  current = idx;
  qIdxEl.textContent = q.id;
  qTextEl.textContent = q.text;
  qTypeEl.textContent = q.type + " | Bobot: " + q.weight;

  optionsEl.innerHTML = "";
  instantFeedback.innerHTML = "";

  q.options.forEach((opt, i)=>{
    const div = document.createElement("div");
    div.className = "opt";
    div.innerHTML = `<strong>${String.fromCharCode(65+i)}</strong>. ${opt}`;

    if(answers[idx] === i) div.classList.add("selected");

    div.onclick = () => {
      answers[idx] = i;
      [...optionsEl.children].forEach((el,ci)=> 
          el.classList.toggle("selected", ci === i));

      showFeedback(i);
    };

    optionsEl.appendChild(div);
  });

  const percent = Math.round((idx / questions.length) * 100);
  progBar.style.width = percent + "%";

  prevBtn.disabled = idx === 0;

  if(idx === questions.length - 1){
    nextBtn.style.display = "none";
    submitBtn.style.display = "inline-block";
  } else {
    nextBtn.style.display = "inline-block";
    submitBtn.style.display = "none";
  }
}


// ===========================
// FEEDBACK INSTAN
// ===========================
function showFeedback(selected){
  const q = questions[current];
  const correct = q.correct;

  if(selected === correct){
    instantFeedback.innerHTML = `
      <div class="feedback-box feedback-correct">
        ✔ <strong>Benar!</strong><br>
        ${q.explanation}
      </div>
    `;
  } else {
    instantFeedback.innerHTML = `
      <div class="feedback-box feedback-wrong">
        ✘ <strong>Salah.</strong><br>
        Kunci jawaban: <strong>${String.fromCharCode(65+q.correct)}</strong><br><br>
        <strong>Pembenaran:</strong> ${q.explanation}
      </div>
    `;
  }
}


// ===========================
// NAVIGATION
// ===========================
function nextQ(){ renderQuestion(current+1); }
function prevQ(){ renderQuestion(current-1); }


// ===========================
// SUBMIT EXAM
// ===========================
function submitAll(){
  const unanswered = answers.filter(a => a===null).length;

  if(unanswered>0){
    if(!confirm(`Masih ada ${unanswered} soal belum dijawab. Lanjut?`)) return;
  }

  calculateScore();
}


// ===========================
// SCORE + ANALYSIS
// ===========================
function calculateScore(){
  let totalWeight = 0, obtained = 0;

  const per = { easy:{t:0,s:0}, medium:{t:0,s:0}, hard:{t:0,s:0} };

  for(let i=0;i<questions.length;i++){
    const q = questions[i];
    const sel = answers[i];
    const correct = q.correct;

    totalWeight += q.weight;
    const cat = q.weight===1 ? "easy" : q.weight===2 ? "medium" : "hard";
    per[cat].t += q.weight;

    if(sel===correct){ 
      obtained += q.weight;
      per[cat].s += q.weight;
    }
  }

  resultsEl.style.display = "block";

  const percent = Math.round(obtained/totalWeight*100);
  scoreValEl.textContent = `${obtained} / ${totalWeight}`;
  scorePercentEl.textContent = percent + "%";

  masteryLabelEl.textContent = 
      percent >=90 ? "Sangat Baik" :
      percent >=80 ? "Baik" :
      percent >=70 ? "Cukup" : "Kurang";

  summaryTable.innerHTML = `
    <tr><td>Bobot Total</td><td>${totalWeight}</td></tr>
    <tr><td>Skor</td><td>${obtained}</td></tr>
    <tr><td>Persentase</td><td>${percent}%</td></tr>
    <tr><td>Mudah</td><td>${per.easy.s} / ${per.easy.t}</td></tr>
    <tr><td>Sedang</td><td>${per.medium.s} / ${per.medium.t}</td></tr>
    <tr><td>Sulit</td><td>${per.hard.s} / ${per.hard.t}</td></tr>
  `;

  finalAnalysis.innerHTML = `
    <h3>Analisis Hasil</h3>
    <p>Anda mendapatkan <strong>${percent}%</strong>.</p>
  `;

  finalFeedback.innerHTML = `
    <h3>Saran Belajar</h3>
    <p>Perkuat pemahaman struktur kontrol, array, dan logika multi-step.</p>
  `;

  resultsEl.scrollIntoView({behavior:'smooth'});
}


// ===========================
// INITIAL LOAD
// ===========================
renderQuestion(0);
