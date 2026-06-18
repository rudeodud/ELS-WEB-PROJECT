/* ================================================================
   Quiz.js — OX 퀴즈 인터랙션 로직
   ================================================================

   ▶ 퀴즈 내용을 채우는 순서
   ─────────────────────────────────────────────────────────────────
   이 파일(Quiz.js)은 건드리지 않아도 됩니다.
   퀴즈 문제·정답·해설은 모두 Quiz.html 에서만 수정합니다.

   [STEP 1] Quiz.html 을 열고 각 .quiz-item 블록을 찾습니다.
            <!-- Q1 -->, <!-- Q2 --> ... 주석으로 구분되어 있습니다.

   [STEP 2] 문제 텍스트를 입력합니다.
            <span class="quiz-text">
              <span class="placeholder">[퀴즈 내용 채우기]</span>
            </span>
            → placeholder span 전체를 지우고 문제 문장을 적으면 됩니다.
            예) <span class="quiz-text">ELS는 예금자 보호법 대상이다.</span>

   [STEP 3] 정답을 설정합니다.
            <div class="quiz-item" data-answer="O">
            → data-answer 값을 "O" 또는 "X" 로 바꿉니다.
            예) data-answer="X"

   [STEP 4] 해설 레이블과 텍스트를 입력합니다.
            <div class="answer-label O">O 정답</div>
            → class 와 텍스트를 정답에 맞게 바꿉니다.
            정답이 X 라면: <div class="answer-label X">X 정답</div>

            <p><span class="placeholder">[해설 내용 채우기]</span></p>
            → placeholder span 전체를 지우고 해설 문장을 적으면 됩니다.
            예) <p>ELS는 증권사가 발행하는 상품으로, 예금자 보호법 적용 대상이 아닙니다.</p>

   ─────────────────────────────────────────────────────────────────
   ▶ 완성된 문항 예시 (Q1 이 X 정답인 경우)

   <div class="quiz-item" data-answer="X">        ← STEP 3: 정답
     <div class="quiz-question">
       <span class="quiz-num">1</span>
       <span class="quiz-text">                   ← STEP 2: 문제
         ELS는 은행이 발행하는 금융 상품이다.
       </span>
       <span class="quiz-toggle">▼</span>
     </div>
     <div class="quiz-buttons">
       <button class="btn-ox O">⭕ O</button>
       <button class="btn-ox X">❌ X</button>
     </div>
     <div class="quiz-answer">
       <div class="answer-label X">X 정답</div>  ← STEP 4: 레이블
       <p>ELS는 은행이 아닌 증권사가 발행합니다.</p> ← STEP 4: 해설
     </div>
   </div>
   ================================================================ */


// ── 1. 필요한 DOM 요소 가져오기 ──────────────────────────────────
// .quiz-item : 문제 하나를 감싸는 컨테이너 (Q1~Q6 전부)
const items      = document.querySelectorAll('.quiz-item');
const total      = items.length;  // 전체 문제 수 (자동 계산)

// 점수판 관련 요소
const scoreBoard = document.getElementById('score-board');  // 점수판 전체 박스
const scoreText  = document.getElementById('score-text');   // "3 / 6" 숫자 표시
const scoreMsg   = document.getElementById('score-msg');    // 결과 메시지
const btnRetry   = document.getElementById('btn-retry');    // 다시 풀기 버튼


// ── 2. 점수 추적 변수 ────────────────────────────────────────────
let answered = 0;  // 현재까지 답변한 문제 수
let correct  = 0;  // 현재까지 맞힌 문제 수


// ── 3. 각 문제에 이벤트 연결 ─────────────────────────────────────
items.forEach(item => {
  const question  = item.querySelector('.quiz-question');  // 클릭 가능한 문제 영역
  const buttons   = item.querySelectorAll('.btn-ox');      // O, X 버튼 두 개
  const answerBox = item.querySelector('.quiz-answer');    // 해설 박스


  // ── 3-1. 문제 클릭 시 펼치기 / 접기 ───────────────────────────
  // 문제 텍스트 영역을 클릭하면 open 클래스가 토글됩니다.
  // open 클래스가 붙으면 CSS에서 버튼 영역(.quiz-buttons)이 flex 로 표시됩니다.
  question.addEventListener('click', () => {
    item.classList.toggle('open');
  });


  // ── 3-2. O / X 버튼 클릭 시 정답 처리 ────────────────────────
  buttons.forEach(btn => {
    btn.addEventListener('click', e => {
      // 버튼 클릭이 문제 클릭(펼치기/접기)으로 전파되지 않도록 막음
      e.stopPropagation();

      // 이미 이 문제에 답변했으면 아무것도 하지 않음 (중복 클릭 방지)
      if (item.dataset.done) return;
      item.dataset.done = 'true';  // 답변 완료 표시

      // 클릭한 버튼이 O인지 X인지 판별
      const selected = btn.classList.contains('O') ? 'O' : 'X';

      // Quiz.html 의 data-answer 속성에서 정답 읽어오기
      const answer  = item.dataset.answer;

      // 정답 여부 판단
      const isRight = selected === answer;


      // ── 버튼 색상 처리 ──────────────────────────────────────
      // 정답 버튼 → 초록 테두리 (selected-correct)
      // 내가 틀리게 선택한 버튼 → 빨간 테두리 (selected-wrong)
      buttons.forEach(b => {
        const bVal = b.classList.contains('O') ? 'O' : 'X';
        if (bVal === answer)                   b.classList.add('selected-correct');
        else if (bVal === selected && !isRight) b.classList.add('selected-wrong');
        b.disabled = true;  // 답변 후 버튼 비활성화
      });


      // ── 해설 박스 표시 ──────────────────────────────────────
      // 맞으면 초록 배경(correct), 틀리면 빨간 배경(wrong)
      answerBox.style.display = 'block';
      answerBox.classList.add(isRight ? 'correct' : 'wrong');

      // 혹시 문제가 접혀 있었다면 강제로 펼치기
      item.classList.add('open');


      // ── 점수 집계 ───────────────────────────────────────────
      answered++;
      if (isRight) correct++;

      // 모든 문제를 풀었으면 점수판 표시
      if (answered === total) showScore();
    });
  });
});


// ── 4. 점수판 표시 함수 ──────────────────────────────────────────
// 전체 문제를 다 풀었을 때 호출됩니다.
function showScore() {
  // "맞힌 수 / 전체" 형식으로 표시
  scoreText.textContent = `${correct} / ${total}`;

  // 정답률에 따라 다른 메시지 출력
  const ratio = correct / total;
  if (ratio === 1)       scoreMsg.textContent = '완벽해요! ELS 전문가 탄생 🎉';
  else if (ratio >= 0.7) scoreMsg.textContent = '잘했어요! 조금만 더 공부하면 완벽해요 👍';
  else if (ratio >= 0.4) scoreMsg.textContent = '아직 헷갈리는 부분이 있네요. 다시 읽어봐요 📖';
  else                   scoreMsg.textContent = 'ELS 개념부터 다시 살펴봐요 💪';

  // 점수판을 화면에 보이게 하고 부드럽게 스크롤
  scoreBoard.classList.add('visible');
  scoreBoard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


// ── 5. 다시 풀기 버튼 ───────────────────────────────────────────
// 모든 문제 상태를 초기값으로 되돌립니다.
btnRetry.addEventListener('click', () => {
  items.forEach(item => {
    // 답변 완료 표시 제거 (다시 클릭 가능하게)
    delete item.dataset.done;

    // 문제 접기
    item.classList.remove('open');

    // 버튼 색상 초기화 및 활성화
    item.querySelectorAll('.btn-ox').forEach(b => {
      b.classList.remove('selected-correct', 'selected-wrong');
      b.disabled = false;
    });

    // 해설 박스 숨기기 및 색상 초기화
    const answerBox = item.querySelector('.quiz-answer');
    answerBox.style.display = 'none';
    answerBox.classList.remove('correct', 'wrong');
  });

  // 점수 변수 초기화
  answered = 0;
  correct  = 0;

  // 점수판 숨기기 및 맨 위로 스크롤
  scoreBoard.classList.remove('visible');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
