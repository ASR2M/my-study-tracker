let lessons = [], assignments = [];
let pomodoroInterval, timerInterval;
let pomodoroSeconds = 0;
let timerSeconds = 0;
let isDark = false;
let isFocus = false;
let isOnBreak = false;
let pomodoroLoops = 0;
let pomodoroTargetLoops = 0;

function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toTimeString().slice(0,5) + " (IST)";
}
setInterval(updateClock, 1000); updateClock();

document.getElementById("toggle-dark").onclick = () => {
  document.body.classList.toggle('dark');
  isDark = !isDark;
  document.getElementById("animal-img").src = "dog.png";
};

function addLesson(){
  const input = document.getElementById("lesson-input");
  if(input.value.trim()){ lessons.push(input.value.trim()); input.value=''; renderList();}
}
function addAssignment(){
  const input = document.getElementById("assignment-input");
  if(input.value.trim()){ assignments.push(input.value.trim()); input.value=''; renderList();}
}
function renderList(){
  document.getElementById("lesson-list").innerHTML = lessons.map((v,i)=>
    `<li>${v}<button onclick="deleteItem(lessons,${i})">➖</button></li>`).join('');
  document.getElementById("assignment-list").innerHTML = assignments.map((v,i)=>
    `<li>${v}<button onclick="deleteItem(assignments,${i})">➖</button></li>`).join('');
}
function deleteItem(list, index, id){
  const li = document.getElementById(id);
  const btn = li.querySelector('button');
  btn.classList.add('spin');
  li.classList.add('fade-out');
  setTimeout(()=>{ list.splice(index,1); renderList(); }, 400);
}

document.getElementById("focus-toggle").onclick = () => {
  const card = document.getElementById("pomodoro-card");
  isFocus = !isFocus;
  card.classList.toggle('focus-mode');
  document.getElementById("focus-toggle").textContent = isFocus ? "Exit Focus Mode" : "Enter Focus Mode";
};

function startPomodoro(){
  clearInterval(pomodoroInterval);
  let work = parseInt(document.getElementById("work-minutes").value);
  let brk = parseInt(document.getElementById("break-minutes").value);
  pomodoroTargetLoops = parseInt(document.getElementById("pomodoro-loops").value) || 1;
  pomodoroLoops = 0;
  if(work<=0||brk<=0) return;
  isOnBreak=false;
  pomodoroSeconds=work*60;
  updatePomodoroDisplay();
  pomodoroInterval=setInterval(()=>{
    pomodoroSeconds--;
    updatePomodoroDisplay();
    if(pomodoroSeconds<=0){
      if(isOnBreak){
        pomodoroLoops++;
        if(pomodoroLoops>=pomodoroTargetLoops){ clearInterval(pomodoroInterval); return;}
      }
      isOnBreak=!isOnBreak;
      pomodoroSeconds=(isOnBreak?brk:work)*60;
    }
  },1000);
}
function stopPomodoro(){ clearInterval(pomodoroInterval);}
function resetPomodoro(){
  clearInterval(pomodoroInterval);
  let work=parseInt(document.getElementById("work-minutes").value);
  pomodoroSeconds=work*60;
  updatePomodoroDisplay();
}
function updatePomodoroDisplay(){
  let m=Math.floor(pomodoroSeconds/60), s=pomodoroSeconds%60;
  document.getElementById("pomodoro-display").textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  let total=parseInt(document.getElementById("work-minutes").value)*60;
  let progress=total?(total-pomodoroSeconds)/total:0;
  document.getElementById("pomodoro-circle").style.strokeDashoffset=283-(283*progress);
}

function startSimpleTimer(){
  clearInterval(timerInterval);
  let min=parseInt(document.getElementById("timer-minutes").value);
  timerSeconds=min*60;
  updateSimpleDisplay();
  timerInterval=setInterval(()=>{
    timerSeconds--;
    updateSimpleDisplay();
    if(timerSeconds<=0) clearInterval(timerInterval);
  },1000);
}
function stopSimpleTimer(){ clearInterval(timerInterval);}
function resetSimpleTimer(){
  clearInterval(timerInterval);
  let min=parseInt(document.getElementById("timer-minutes").value);
  timerSeconds=min*60;
  updateSimpleDisplay();
}
function updateSimpleDisplay(){
  let m=Math.floor(timerSeconds/60), s=timerSeconds%60;
  document.getElementById("simple-timer").textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  let total=parseInt(document.getElementById("timer-minutes").value)*60;
  let progress=total?(total-timerSeconds)/total:0;
  document.getElementById("timer-circle").style.strokeDashoffset=283-(283*progress);
}

function sendFeedback(){
  alert("Feedback sent! Thank you 💌");
}
