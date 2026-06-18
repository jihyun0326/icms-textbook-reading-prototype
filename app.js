/* ICMS 교과서 읽기 — AI 콘텐츠 등록 프로토타입 */

// ===== 목록 더미 데이터 =====
const LIST_ROWS = [
  { code: "KOR20260612091001", title: "사랑이 뭔데요", course: "초등", grade: "5학년", term: "1학기", reg: "26.06.12. / 박지현", expose: "Y" },
  { code: "KOR20260611154233", title: "맛있는 소리",   course: "초등", grade: "5학년", term: "1학기", reg: "26.06.11. / 박지현", expose: "Y" },
  { code: "KOR20260610133010", title: "책 읽는 소년",  course: "초등", grade: "6학년", term: "2학기", reg: "26.06.10. / 김소희", expose: "Y" },
  { code: "KOR20260609101580", title: "봉운이의 부탁", course: "초등", grade: "4학년", term: "1학기", reg: "26.06.09. / 김소희", expose: "N" },
  { code: "KOR20260608170422", title: "별 헤는 밤",    course: "초등", grade: "6학년", term: "1학기", reg: "26.06.08. / 박지현", expose: "Y" },
  { code: "KOR20260607140915", title: "강아지똥",      course: "초등", grade: "3학년", term: "2학기", reg: "26.06.07. / 김소희", expose: "Y" },
];

// ===== AI 생성 결과 더미 (스토리보드 CASE 3 기준) =====
const SAMPLE_BODY = "옛날 어느 마을에 마음씨 착한 소녀가 살았습니다. /// 소녀는 매일 아침 들판으로 나가 꽃을 돌보았어요. 어느 날, 길을 잃은 작은 새를 발견한 소녀는 흔쾌히 새를 돌보아 주었습니다. /// 시간이 흘러 건강을 되찾은 새는 소녀에게 보답으로 신비한 씨앗 하나를 건네주었어요...";
const SAMPLE_INTRO = "마음씨 착한 소녀와 작은 새의 따뜻한 우정 이야기! 소녀의 선한 마음이 어떤 놀라운 보답으로 돌아오는지 함께 읽어볼까요?";
const SAMPLE_PARAGRAPHS = [
  { title: "1. 소녀와 들판", summary: "마음씨 착한 소녀가 매일 들판의 꽃을 돌보며 지내는 평화로운 일상을 소개한다." },
  { title: "2. 길 잃은 새", summary: "길을 잃은 작은 새를 발견한 소녀가 흔쾌히 새를 돌보아 주는 장면." },
];
const SAMPLE_QUIZZES = [
  { q: "소녀가 매일 들판에서 한 일은 무엇인가요?", opts: ["꽃을 돌보았다", "새를 잡았다", "씨앗을 심었다", "잠을 잤다"], ans: 0 },
  { q: "소녀가 길을 잃은 새를 발견하고 한 행동은?", opts: ["모른 척했다", "흔쾌히 돌보아 주었다", "쫓아냈다", "새장에 가두었다"], ans: 1 },
  { q: "건강을 되찾은 새가 소녀에게 준 보답은?", opts: ["황금 알", "신비한 씨앗", "노래", "깃털"], ans: 1 },
];

let formMode = "register"; // register | edit

// ===== 화면 전환 =====
function go(view) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-" + view).classList.add("active");
  window.scrollTo(0, 0);
}

// ===== 목록 렌더 =====
function renderList() {
  const body = document.getElementById("list-body");
  body.innerHTML = LIST_ROWS.map(r => `
    <tr>
      <td><input type="checkbox" /></td>
      <td class="code"><a href="javascript:void(0)" onclick="openDetail('${r.code}','${r.title}')">${r.code}</a></td>
      <td>${r.title}</td>
      <td>-</td>
      <td>${r.course}</td>
      <td>${r.grade}</td>
      <td>${r.term}</td>
      <td>${r.reg}</td>
      <td class="${r.expose === 'Y' ? 'expose-y' : 'expose-n'}">${r.expose}</td>
      <td><span class="trash" onclick="toast('삭제 확인 팝업 (프로토타입)')">🗑</span></td>
    </tr>`).join("");
}

// ===== 등록 화면 진입 (빈 폼 = CASE 1) =====
function openRegister() {
  formMode = "register";
  document.getElementById("form-breadcrumb").innerHTML = "CMS &gt; 국어 &gt; 교과서 읽기 &gt; 등록";
  document.getElementById("btn-submit").textContent = "등록하기";
  document.getElementById("f-school").value = "";
  document.getElementById("f-cgrade").value = "";
  document.getElementById("f-term").value = "";
  document.getElementById("f-toc").value = "";
  document.getElementById("f-toc").disabled = false;
  document.getElementById("f-round").value = "";
  document.getElementById("f-round").disabled = false;
  document.getElementById("f-title").value = "";
  document.getElementById("f-grade").value = "초등학교 5학년";
  document.getElementById("f-body").value = "";
  document.getElementById("f-quizcount").value = "";
  document.getElementById("f-intro").value = "";
  document.getElementById("paragraphs").innerHTML = "";
  document.getElementById("quizzes").innerHTML = "";
  hideTocResult();
  updateCount();
  updateSubmitState();
  go("form");
}

// ===== 수정 화면 진입 (프리필 = CASE 3 데이터) =====
function openEdit() {
  formMode = "edit";
  document.getElementById("form-breadcrumb").innerHTML = "CMS &gt; 국어 &gt; 교과서 읽기 &gt; 수정";
  document.getElementById("btn-submit").textContent = "수정하기";
  document.getElementById("f-school").value = "초등";
  document.getElementById("f-cgrade").value = "5학년";
  document.getElementById("f-term").value = "1학기";
  document.getElementById("f-toc").value = "TCK00000000006540022";
  document.getElementById("f-toc").disabled = false;
  document.getElementById("f-round").value = "KOR20260612091001";
  document.getElementById("f-round").disabled = true; // 회차코드 = 저장 경로 키 → 수정 불가
  document.getElementById("f-title").value = "사랑이 뭔데요";
  document.getElementById("f-grade").value = "초등학교 5학년";
  document.getElementById("f-body").value = SAMPLE_BODY;
  document.getElementById("f-quizcount").value = "3";
  hideTocResult();
  fillOutput();
  updateCount();
  updateSubmitState();
  go("form");
}

// ===== 목차 검증 (기존 iCMS 방식: 실패 시 [목차코드]+사유, 복수 건 확장) =====
// 데모: 유효 목차코드에 "0654" 포함 시 통과, 그 외 실패
function validateToc() {
  const raw = document.getElementById("f-toc").value.trim();
  if (!raw) { toast("목차코드를 입력해주세요."); return; }
  const codes = raw.split(/[\s,]+/).filter(Boolean);
  const fails = codes.filter(c => !c.includes("0654"));
  const box = document.getElementById("toc-result");
  if (fails.length === 0) {
    box.innerHTML = `<div class="ok">✓ 유효한 목차코드입니다.</div>`;
  } else {
    box.innerHTML = `<div class="res-title">목차 검증 결과</div>` +
      fails.map(c => `<div class="fail-item"><span class="fail-code">[${escapeHtml(c)}]</span><span class="fail-reason">과목이 일치 하지 않는 목차입니다.</span></div>`).join("");
  }
  box.style.display = "block";
}
function hideTocResult() {
  const box = document.getElementById("toc-result");
  if (box) { box.style.display = "none"; box.innerHTML = ""; }
}
function clearToc() {
  document.getElementById("f-toc").value = "";
  hideTocResult();
}

// ===== 등록/수정 버튼 활성화 (AI 출력 생성 전에는 비활성) =====
function updateSubmitState() {
  const hasOutput =
    document.getElementById("paragraphs").children.length > 0 &&
    document.getElementById("quizzes").children.length > 0;
  document.getElementById("btn-submit").disabled = !hasOutput;
}

// ===== 글자수 =====
function updateCount() {
  document.getElementById("f-count").textContent = document.getElementById("f-body").value.length;
}

// ===== AI 출력 채우기 =====
function fillOutput() {
  document.getElementById("f-intro").value = SAMPLE_INTRO;
  document.getElementById("paragraphs").innerHTML = "";
  SAMPLE_PARAGRAPHS.forEach(p => addParagraph(p.title, p.summary));
  document.getElementById("quizzes").innerHTML = "";
  const n = Math.max(1, parseInt(document.getElementById("f-quizcount").value) || SAMPLE_QUIZZES.length);
  if (!document.getElementById("f-quizcount").value.trim()) {
    document.getElementById("f-quizcount").value = n; // 빈 값이면 생성 개수로 채움
  }
  for (let i = 0; i < n; i++) {
    const q = SAMPLE_QUIZZES[i % SAMPLE_QUIZZES.length];
    addQuiz(q.q, q.opts, q.ans, i + 1);
  }
  updateSubmitState();
}

// ===== 문단 추가 =====
function addParagraph(title = "", summary = "") {
  const wrap = document.getElementById("paragraphs");
  const div = document.createElement("div");
  div.className = "item-card";
  div.innerHTML = `
    <span class="del-x" onclick="removeItem(this)">×</span>
    <div class="field" style="margin-bottom:10px">
      <input type="text" class="title-input" placeholder="소제목 (예: 1. 소녀와 들판)" value="${escapeAttr(title)}" />
    </div>
    <div class="field" style="margin-bottom:0">
      <textarea rows="2" placeholder="문단 요약">${escapeHtml(summary)}</textarea>
    </div>`;
  wrap.appendChild(div);
  updateSubmitState();
}

function removeItem(el) {
  el.closest(".item-card").remove();
  updateSubmitState();
}

// ===== 퀴즈 추가 =====
function addQuiz(q = "", opts = ["", ""], ans = 0, num = null) {
  const wrap = document.getElementById("quizzes");
  const index = num || (wrap.children.length + 1);
  const div = document.createElement("div");
  div.className = "item-card";
  const gname = "ans-" + Date.now() + "-" + Math.floor(performance.now());
  div.innerHTML = `
    <span class="del-x" onclick="removeItem(this)">×</span>
    <div class="quiz-row">
      <div class="quiz-main">
        <div class="field" style="margin-bottom:10px">
          <input type="text" class="title-input" placeholder="Q${index}. 문항을 입력하세요" value="${escapeAttr(q ? 'Q' + index + '. ' + q : '')}" />
        </div>
        <div class="opts"></div>
        <button class="opt-add" onclick="addOption(this)">+ 보기 추가</button>
      </div>
      <div class="ans-badge">정답 : <span class="ans-num">①</span></div>
    </div>`;
  wrap.appendChild(div);
  const optsBox = div.querySelector(".opts");
  opts.forEach((o, i) => optsBox.appendChild(buildOption(gname, o, i === ans)));
  syncAnsBadge(div);
  updateSubmitState();
}

const CIRCLE = ["①","②","③","④","⑤","⑥","⑦","⑧"];

function buildOption(gname, text = "", checked = false) {
  const row = document.createElement("div");
  row.className = "opt";
  row.innerHTML = `
    <input type="radio" name="${gname}" ${checked ? "checked" : ""} onchange="syncAnsBadge(this.closest('.item-card'))" />
    <input type="text" placeholder="보기" value="${escapeAttr(text)}" />
    <span class="opt-del" onclick="removeOption(this)">✕</span>`;
  return row;
}

function addOption(btn) {
  const card = btn.closest(".item-card");
  const optsBox = card.querySelector(".opts");
  const gname = optsBox.querySelector("input[type=radio]").name;
  optsBox.appendChild(buildOption(gname));
  renumberOptions(card);
}

function removeOption(span) {
  const card = span.closest(".item-card");
  const optsBox = card.querySelector(".opts");
  if (optsBox.children.length <= 2) { toast("보기는 최소 2개가 필요합니다."); return; }
  const wasChecked = span.closest(".opt").querySelector("input[type=radio]").checked;
  span.closest(".opt").remove();
  if (wasChecked) { // 정답 보기 삭제 → 첫 보기로 초기화
    optsBox.querySelector("input[type=radio]").checked = true;
  }
  renumberOptions(card);
  syncAnsBadge(card);
}

function renumberOptions(card) {
  card.querySelectorAll(".opt input[type=text]").forEach((inp, i) => {
    inp.placeholder = "보기 " + CIRCLE[i];
  });
}

function syncAnsBadge(card) {
  const radios = [...card.querySelectorAll(".opt input[type=radio]")];
  const idx = radios.findIndex(r => r.checked);
  card.querySelector(".ans-num").textContent = CIRCLE[idx >= 0 ? idx : 0];
}

// ===== AI 콘텐츠 자동 생성 (CASE 2 → CASE 3) =====
function generateAI() {
  const title = document.getElementById("f-title").value.trim();
  const body = document.getElementById("f-body").value.trim();
  if (!title || !body) {
    toast("교과서 제목과 본문을 먼저 입력해주세요.");
    return;
  }
  document.getElementById("overlay").classList.add("show");
  setTimeout(() => {
    document.getElementById("overlay").classList.remove("show");
    fillOutput();
    toast("AI 콘텐츠 생성이 완료되었습니다.");
  }, 1800);
}

// ===== 등록/수정 제출 =====
function submitForm() {
  const required = [
    ["f-school", "수업과정(학교급)"], ["f-cgrade", "수업과정(학년)"], ["f-term", "수업과정(학기)"],
    ["f-round", "회차코드"], ["f-toc", "목차코드"],
    ["f-title", "교과서 제목"], ["f-body", "교과서 본문"],
    ["f-quizcount", "퀴즈 갯수"], ["f-intro", "인트로"],
  ];
  for (const [id, label] of required) {
    if (!document.getElementById(id).value.trim()) { toast(label + "을(를) 입력해주세요."); return; }
  }
  if (document.getElementById("paragraphs").children.length < 1) { toast("문단을 1개 이상 추가해주세요."); return; }
  if (document.getElementById("quizzes").children.length < 1) { toast("퀴즈를 1개 이상 추가해주세요."); return; }

  if (formMode === "edit") {
    toast("수정이 완료되었습니다.");
    setTimeout(() => go("detail"), 700);
  } else {
    toast("등록이 완료되었습니다.");
    setTimeout(() => go("list"), 700);
  }
}

function cancelForm() {
  go(formMode === "edit" ? "detail" : "list");
}

// ===== 상세 진입 =====
function openDetail(code, title) {
  document.getElementById("d-code").textContent = code;
  document.getElementById("d-title").textContent = "「" + title + "」";
  go("detail");
}

// ===== 토스트 =====
let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

// ===== util =====
function escapeHtml(s) { return (s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function escapeAttr(s) { return escapeHtml(s).replace(/"/g,"&quot;"); }

// ===== 해시 기반 딥링크 (#list / #register / #detail / #edit) =====
function applyHash() {
  const h = (location.hash || "").replace("#", "");
  if (h === "register") openRegister();
  else if (h === "edit") openEdit();
  else if (h === "detail") openDetail("KOR20260612091001", "사랑이 뭔데요");
  else go("list");
}
window.addEventListener("hashchange", applyHash);

// init
renderList();
applyHash();
