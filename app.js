import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  update,
  onValue,
  get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7QnIPDh9ZDJ13MonUCizwmAnac_RmTUk",
  authDomain: "souioma-online.firebaseapp.com",
  databaseURL: "https://souioma-online-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "souioma-online",
  storageBucket: "souioma-online.firebasestorage.app",
  messagingSenderId: "68674058440",
  appId: "1:68674058440:web:1dc2b0d720773abbb60dfd",
  measurementId: "G-GQWV21S7FF"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ==============================
// AI Worker
// ==============================

const AI_WORKER_URL =
  "https://souioma-ai.genta-saitou0308.workers.dev/";

// ==============================
// キャラクター
// ==============================

const ages = [
  19, 21, 23, 25, 28, 31,
  34, 37, 41, 46, 52, 61
];

const jobs = [
  "大学生",
  "教師",
  "料理人",
  "探偵",
  "医師",
  "会社員",
  "警察官",
  "画家",
  "時計職人",
  "記者",
  "弁護士",
  "古物商"
];

const personalities = [
  "明るく社交的",
  "疑り深く慎重",
  "短気で負けず嫌い",
  "温厚で人当たりがいい",
  "無口で冷静",
  "好奇心旺盛",
  "几帳面で神経質",
  "お調子者",
  "自信家でプライドが高い",
  "臆病だが観察力が鋭い",
  "自由奔放",
  "誰にでも親切"
];

const hobbies = [
  "古い映画を見ること",
  "料理",
  "釣り",
  "写真撮影",
  "読書",
  "ゲーム",
  "旅行",
  "骨董品集め",
  "音楽鑑賞",
  "スポーツ",
  "占い",
  "散歩"
];

// ==============================
// 事件
// ==============================

const cases = [
  {
    title: "消えた王家の指輪",
    story:
      "山奥の洋館で開かれた晩餐会の最中、代々受け継がれてきた王家の指輪が書斎から消えた。書斎に入ることができたのは、その夜に館にいた人物だけだった。"
  },
  {
    title: "深夜の殺人事件",
    story:
      "深夜0時過ぎ、館の主人が自室で倒れているのが発見された。部屋は内側から鍵がかかっていたが、窓だけがわずかに開いていた。"
  },
  {
    title: "消えた遺産",
    story:
      "莫大な遺産を残した資産家が突然姿を消した。遺産の行方を知っていると思われる人物たちは、全員その夜に館に集まっていた。"
  },
  {
    title: "地下室の秘密",
    story:
      "洋館の地下室から、館の主人が隠していた重要な書類がなくなった。事件当日の夜、何人もの人物が地下室付近で目撃されている。"
  },
  {
    title: "消えた宝石",
    story:
      "パーティーの最中、展示されていた巨大な宝石が忽然と消えた。警報は一度も鳴っておらず、犯人は内部の事情に詳しい人物だと思われた。"
  },
  {
    title: "最後の晩餐",
    story:
      "館で開かれた最後の晩餐。その翌朝、主人が倒れているのが発見された。食卓には人数分の料理と、ひとつだけ手をつけられていないグラスが残されていた。"
  },
  {
    title: "破られた遺言状",
    story:
      "莫大な財産をめぐる争いの中、館の主人が書いた遺言状が何者かによって破られた。事件当夜、全員に主人と会う理由があった。"
  },
  {
    title: "時計塔の事件",
    story:
      "午前0時、館の時計塔が突然止まった。その直後、館の主人が何者かに襲われているのが発見された。時計塔には誰かが入った痕跡が残っていた。"
  }
];

// ==============================
// 暴露カード
// ==============================

const exposureCards = [
  "事件当日の深夜、あなたは地下室に向かっていた。",
  "あなたは被害者の部屋の鍵を持っていた。",
  "事件直前、あなたは被害者と口論していた。",
  "あなたの服から見覚えのない血痕が見つかった。",
  "あなたは事件の直後、一人で館の外へ出ようとしていた。",
  "あなたのポケットから小型のナイフが見つかった。",
  "あなたは被害者から多額のお金を借りていた。",
  "あなたは事件当日の行動について嘘をついていた。",
  "あなたは事件現場に残された手袋と同じ種類の手袋を持っていた。",
  "あなたは被害者の秘密を知っていた。",
  "あなたは事件直後に何かを隠しているところを目撃された。",
  "あなたの部屋から被害者の写真が見つかった。",
  "あなたは事件の少し前に時計塔へ向かっていた。",
  "あなたは被害者の遺言について詳しく知っていた。",
  "あなたは事件当夜、誰にも言わず館の中を移動していた。",
  "あなたのバッグから古い鍵が見つかった。",
  "あなたは被害者から脅されていた。",
  "事件後、あなたは妙に落ち着いていた。",
  "あなたは被害者が倒れていた場所について、誰よりも詳しかった。",
  "あなたは事件直前に誰かと密かに話していた。",
  "あなたは被害者の持ち物を一つ持ち帰ろうとしていた。",
  "あなたは事件の時刻を妙に正確に知っていた。",
  "あなたは事件現場に残された紙片に触れていた。",
  "あなたは被害者が亡くなる直前に会話していた人物だった。",
  "あなたの靴には地下室と同じ泥がついていた。",
  "あなたは事件の夜、誰にも見られない場所で何かをしていた。",
  "あなたは被害者から重要な手紙を受け取っていた。",
  "あなたは事件直後に手を洗っていた。",
  "あなたは館の構造を詳しく知っていた。",
  "あなたは事件の翌朝、何かを探していた。"
];

// ==============================
// 状態
// ==============================

let roomId = "";
let myId = crypto.randomUUID();
let myName = "";
let unsubscribeRoom = null;

// ==============================
// DOM
// ==============================

const homeScreen = document.getElementById("homeScreen");
const lobbyScreen = document.getElementById("lobbyScreen");
const gameScreen = document.getElementById("gameScreen");
const voteScreen = document.getElementById("voteScreen");
const resultScreen = document.getElementById("resultScreen");

const nameInput = document.getElementById("nameInput");
const roomInput = document.getElementById("roomInput");

const createBtn = document.getElementById("createBtn");
const joinBtn = document.getElementById("joinBtn");
const copyBtn = document.getElementById("copyBtn");
const startBtn = document.getElementById("startBtn");

const roomCodeElement = document.getElementById("roomCode");
const playerList = document.getElementById("playerList");

const homeMessage = document.getElementById("homeMessage");
const lobbyMessage = document.getElementById("lobbyMessage");

const roundText = document.getElementById("roundText");
const turnText = document.getElementById("turnText");
const storyTitle = document.getElementById("storyTitle");
const storyText = document.getElementById("storyText");
const actionArea = document.getElementById("actionArea");

const voteList = document.getElementById("voteList");
const voteMessage = document.getElementById("voteMessage");

const resultText = document.getElementById("resultText");
const backHomeBtn = document.getElementById("backHomeBtn");

// ==============================
// 共通
// ==============================

function showScreen(screen) {
  [
    homeScreen,
    lobbyScreen,
    gameScreen,
    voteScreen,
    resultScreen
  ].forEach(s => s.classList.add("hidden"));

  screen.classList.remove("hidden");
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomCode() {
  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// ==============================
// 部屋作成
// ==============================

createBtn.addEventListener("click", async () => {
  myName = nameInput.value.trim();

  if (!myName) {
    homeMessage.textContent =
      "ニックネームを入力してください。";
    return;
  }

  roomId = randomCode();

  const player = {
    name: myName,
    joinedAt: Date.now()
  };

  const roomData = {
    hostId: myId,

    players: {
      [myId]: player
    },

    status: "lobby",

    game: null
  };

  await set(
    ref(db, `rooms/${roomId}`),
    roomData
  );

  enterLobby();
  listenRoom();
});

// ==============================
// 部屋参加
// ==============================

joinBtn.addEventListener("click", async () => {
  myName = nameInput.value.trim();
  roomId = roomInput.value.trim().toUpperCase();

  if (!myName) {
    homeMessage.textContent =
      "ニックネームを入力してください。";
    return;
  }

  if (!roomId) {
    homeMessage.textContent =
      "ルームコードを入力してください。";
    return;
  }

  const roomRef =
    ref(db, `rooms/${roomId}`);

  const snapshot =
    await get(roomRef);

  if (!snapshot.exists()) {
    homeMessage.textContent =
      "そのルームは存在しません。";
    return;
  }

  const room = snapshot.val();
  const players = room.players || {};

  if (Object.keys(players).length >= 6) {
    homeMessage.textContent =
      "この部屋は満員です。";
    return;
  }

  await update(
    ref(db, `rooms/${roomId}/players/${myId}`),
    {
      name: myName,
      joinedAt: Date.now()
    }
  );

  enterLobby();
  listenRoom();
});

// ==============================
// ロビー
// ==============================

function enterLobby() {
  showScreen(lobbyScreen);
  roomCodeElement.textContent = roomId;
}

function listenRoom() {
  if (unsubscribeRoom) {
    unsubscribeRoom();
  }

  const roomRef =
    ref(db, `rooms/${roomId}`);

  unsubscribeRoom =
    onValue(roomRef, snapshot => {
      if (!snapshot.exists()) {
        return;
      }

      const room = snapshot.val();

      if (room.status === "lobby") {
        renderLobby(room);
        return;
      }

      if (room.status === "playing") {
        showScreen(gameScreen);
        renderGame(room);
        return;
      }

      if (room.status === "vote") {
        showScreen(voteScreen);
        renderVote(room);
        return;
      }

      if (room.status === "result") {
        showScreen(resultScreen);
        renderResult(room);
      }
    });
}

function renderLobby(room) {
  const players = room.players || {};
  const ids = Object.keys(players);

  playerList.innerHTML = "";

  ids.forEach(id => {
    const div =
      document.createElement("div");

    div.className = "playerItem";

    const hostText =
      id === room.hostId
        ? " 👑 館の主人"
        : "";

    div.textContent =
      players[id].name + hostText;

    playerList.appendChild(div);
  });

  if (
    myId === room.hostId &&
    ids.length >= 3
  ) {
    startBtn.classList.remove("hidden");

    lobbyMessage.textContent =
      `${ids.length}人参加中。ゲームを開始できます。`;
  } else {
    startBtn.classList.add("hidden");

    lobbyMessage.textContent =
      `現在 ${ids.length}人。3～6人でゲーム開始できます。`;
  }
}

// ==============================
// ゲーム開始
// ==============================

startBtn.addEventListener("click", async () => {
  const roomSnapshot =
    await get(ref(db, `rooms/${roomId}`));

  if (!roomSnapshot.exists()) {
    return;
  }

  const room = roomSnapshot.val();
  const players = room.players || {};
  const ids = Object.keys(players);

  if (room.hostId !== myId) {
    return;
  }

  if (ids.length < 3 || ids.length > 6) {
    return;
  }

  const maxRounds =
    ids.length === 3
      ? 3
      : 2;

  const selectedCase =
    randomItem(cases);

  const publicCharacters = {};

  ids.forEach(id => {
    publicCharacters[id] = {
      name: players[id].name,
      age: randomItem(ages),
      job: randomItem(jobs),
      personality: randomItem(personalities),
      hobby: randomItem(hobbies)
    };
  });

  const cards = {};

  ids.forEach(id => {
    cards[id] =
      shuffle(exposureCards).slice(0, 4);
  });

  const game = {
    round: 1,
    maxRounds,

    case: selectedCase,

    characters: publicCharacters,

    cards,

    revealedCards: {},

    exposedThisRound: {},

    selectorId: room.hostId,

    phase: "select",

    votes: {},

    // AI関連
    aiStatus: "waiting",

    finalSuspectId: null,

    finalEnding: null
  };

  await update(
    ref(db, `rooms/${roomId}`),
    {
      status: "playing",
      game
    }
  );
});

// ==============================
// ゲーム画面
// ==============================

function renderGame(room) {
  const game = room.game;

  roundText.textContent =
    `ROUND ${game.round} / ${game.maxRounds}`;

  storyTitle.textContent =
    game.case.title;

  storyText.textContent =
    game.case.story;

  turnText.textContent =
    "👑 館の主人が暴露する人を選びます";

  actionArea.innerHTML = "";

  // ==============================
  // キャラクター一覧
  // ==============================

  const characterBox =
    document.createElement("div");

  characterBox.className = "storyBox";

  characterBox.innerHTML =
    `<div class="label">CHARACTERS</div>
     <h2>👥 登場人物</h2>`;

  Object.entries(game.characters)
    .forEach(([id, character]) => {

      const div =
        document.createElement("div");

      div.className =
        "revealedCard";

      div.innerHTML = `
        <h3>${escapeHtml(character.name)}</h3>

        <p>
          <strong>${character.age}歳</strong><br>
          職業：${escapeHtml(character.job)}<br>
          性格：${escapeHtml(character.personality)}<br>
          趣味：${escapeHtml(character.hobby)}
        </p>
      `;

      characterBox.appendChild(div);
    });

  actionArea.appendChild(characterBox);

  // ==============================
  // 公開されたカード
  // ==============================

  const revealed =
    game.revealedCards || {};

  Object.entries(revealed)
    .forEach(([id, cards]) => {

      const character =
        game.characters[id];

      if (!character) {
        return;
      }

      cards.forEach(card => {

        const div =
          document.createElement("div");

        div.className =
          "revealedCard";

        div.innerHTML = `
          <h3>
            🎴 ${escapeHtml(character.name)}の暴露
          </h3>

          <p>
            ${escapeHtml(card)}
          </p>
        `;

        actionArea.appendChild(div);
      });
    });

  // ==============================
  // ホストの選択
  // ==============================

  if (
    myId === room.hostId &&
    game.phase === "select"
  ) {

    const title =
      document.createElement("h3");

    title.textContent =
      "次に暴露する人を選択";

    actionArea.appendChild(title);

    Object.entries(game.characters)
      .forEach(([id, character]) => {

        if (game.exposedThisRound?.[id]) {
          return;
        }

        const button =
          document.createElement("button");

        button.className =
          "mainBtn";

        button.textContent =
          `🎴 ${character.name}を暴露`;

        button.addEventListener(
          "click",
          () => revealPlayer(id)
        );

        actionArea.appendChild(button);
      });

  } else {

    const wait =
      document.createElement("p");

    wait.className = "message";

    if (game.phase === "select") {

      wait.textContent =
        "👑 館の主人が次に暴露する人を選んでいます……";

    } else {

      wait.textContent =
        "Discordで自由に質問・追及・弁明してください。";
    }

    actionArea.appendChild(wait);
  }

  // ==============================
  // 全員暴露済み
  // ==============================

  const playerCount =
    Object.keys(game.characters).length;

  const exposedCount =
    Object.keys(
      game.exposedThisRound || {}
    ).length;

  if (
    exposedCount >= playerCount &&
    myId === room.hostId
  ) {

    const nextButton =
      document.createElement("button");

    nextButton.className =
      "mainBtn";

    if (game.round < game.maxRounds) {

      nextButton.textContent =
        "➡️ 次のラウンドへ";

      nextButton.addEventListener(
        "click",
        nextRound
      );

    } else {

      nextButton.textContent =
        "🗳️ 最終投票へ";

      nextButton.addEventListener(
        "click",
        startVote
      );
    }

    actionArea.appendChild(nextButton);
  }
}

// ==============================
// 暴露
// ==============================

async function revealPlayer(targetId) {

  const snapshot =
    await get(ref(db, `rooms/${roomId}`));

  if (!snapshot.exists()) {
    return;
  }

  const room = snapshot.val();
  const game = room.game;

  if (room.hostId !== myId) {
    return;
  }

  if (game.exposedThisRound?.[targetId]) {
    return;
  }

  const targetCards =
    game.cards[targetId] || [];

  if (targetCards.length === 0) {
    return;
  }

  const alreadyRevealed =
    game.revealedCards?.[targetId] || [];

  const available =
    targetCards.filter(
      card => !alreadyRevealed.includes(card)
    );

  if (available.length === 0) {
    return;
  }

  const card =
    randomItem(available);

  const newRevealed = {
    ...(game.revealedCards || {})
  };

  newRevealed[targetId] = [
    ...(newRevealed[targetId] || []),
    card
  ];

  const newExposed = {
    ...(game.exposedThisRound || {}),
    [targetId]: true
  };

  await update(
    ref(db, `rooms/${roomId}/game`),
    {
      revealedCards: newRevealed,
      exposedThisRound: newExposed,
      selectorId: room.hostId,
      phase: "select"
    }
  );
}

// ==============================
// 次のラウンド
// ==============================

async function nextRound() {

  const snapshot =
    await get(ref(db, `rooms/${roomId}`));

  if (!snapshot.exists()) {
    return;
  }

  const room = snapshot.val();

  if (room.hostId !== myId) {
    return;
  }

  const game = room.game;

  await update(
    ref(db, `rooms/${roomId}/game`),
    {
      round: game.round + 1,
      exposedThisRound: {},
      selectorId: room.hostId,
      phase: "select"
    }
  );
}

// ==============================
// 投票開始
// ==============================

async function startVote() {

  const snapshot =
    await get(ref(db, `rooms/${roomId}`));

  if (!snapshot.exists()) {
    return;
  }

  const room = snapshot.val();

  if (room.hostId !== myId) {
    return;
  }

  await update(
    ref(db, `rooms/${roomId}`),
    {
      status: "vote"
    }
  );
}

// ==============================
// 投票画面
// ==============================

function renderVote(room) {

  voteList.innerHTML = "";

  const players =
    room.players || {};

  const existingVote =
    room.game?.votes?.[myId];

  if (existingVote) {

    voteMessage.textContent =
      "投票済みです。ほかのプレイヤーの投票を待っています……";

    return;
  }

  voteMessage.textContent =
    "Discordで話し合って、犯人だと思う人に投票してください。";

  Object.entries(players)
    .forEach(([id, player]) => {

      if (id === myId) {
        return;
      }

      const button =
        document.createElement("button");

      button.className =
        "mainBtn";

      button.textContent =
        `🔎 ${player.name}に投票`;

      button.addEventListener(
        "click",
        () => castVote(id)
      );

      voteList.appendChild(button);
    });
}

// ==============================
// 投票
// ==============================

async function castVote(targetId) {

  const snapshot =
    await get(ref(db, `rooms/${roomId}`));

  if (!snapshot.exists()) {
    return;
  }

  const room = snapshot.val();

  if (room.game?.votes?.[myId]) {
    return;
  }

  await update(
    ref(db, `rooms/${roomId}/game/votes`),
    {
      [myId]: targetId
    }
  );

  await checkAllVotes();
}

// ==============================
// 全員投票確認
// ==============================

async function checkAllVotes() {

  const snapshot =
    await get(ref(db, `rooms/${roomId}`));

  if (!snapshot.exists()) {
    return;
  }

  const room = snapshot.val();

  const players =
    room.players || {};

  const votes =
    room.game?.votes || {};

  const playerCount =
    Object.keys(players).length;

  const voteCount =
    Object.keys(votes).length;

  if (voteCount >= playerCount) {

    await update(
      ref(db, `rooms/${roomId}`),
      {
        status: "result"
      }
    );
  }
}

// ==============================
// AI用データ作成
// ==============================

function calculateVoteCounts(votes) {

  const counts = {};

  Object.values(votes || {})
    .forEach(targetId => {

      counts[targetId] =
        (counts[targetId] || 0) + 1;
    });

  return counts;
}

function getHighestVotedIds(voteCounts) {

  const entries =
    Object.entries(voteCounts);

  if (entries.length === 0) {
    return [];
  }

  const highest =
    Math.max(
      ...entries.map(([, count]) => count)
    );

  return entries
    .filter(([, count]) => count === highest)
    .map(([id]) => id);
}

// ==============================
// 結果画面
// ==============================

function renderResult(room) {

  const players =
    room.players || {};

  const game =
    room.game || {};

  const votes =
    game.votes || {};

  const counts =
    calculateVoteCounts(votes);

  const suspectIds =
    getHighestVotedIds(counts);

  if (suspectIds.length === 0) {

    resultText.innerHTML =
      "<p>投票結果がありません。</p>";

    return;
  }

  const highest =
    Math.max(
      ...Object.values(counts)
    );

  const suspectNames =
    suspectIds.map(
      id => players[id]?.name || "不明"
    );

  // ==============================
  // AI生成済み
  // ==============================

  if (game.finalEnding) {

    resultText.innerHTML = `
      <div class="storyBox">
        <h2>🗳️ 投票結果</h2>

        <p>
          最も票を集めた人物：
          <strong>
            ${suspectNames
              .map(escapeHtml)
              .join("、")}
          </strong>
        </p>

        <p>
          得票数：${highest}票
        </p>
      </div>

      <div class="storyBox">
        <h2>🎬 事件の真相</h2>

        <div class="aiEnding">
          ${escapeHtml(game.finalEnding)
            .replace(/\n/g, "<br>")}
        </div>
      </div>
    `;

    return;
  }

  // ==============================
  // AI生成中
  // ==============================

  let statusMessage =
    "🤖 AIが事件の真相を作っています……";

  if (game.aiStatus === "error") {
    statusMessage =
      "⚠️ AIによる真相生成に失敗しました。";
  }

  resultText.innerHTML = `
    <div class="storyBox">
      <h2>🗳️ 投票結果</h2>

      <p>
        最も票を集めた人物：
        <strong>
          ${suspectNames
            .map(escapeHtml)
            .join("、")}
        </strong>
      </p>

      <p>
        得票数：${highest}票
      </p>
    </div>

    <div class="storyBox">
      <h2>🎬 事件の真相</h2>

      <p>
        この時点では、ゲーム開始時から決められた
        「真犯人」は存在しません。
      </p>

      <p>
        投票で選ばれた人物をもとに、
        公開された情報からAIが事件の真相を作ります。
      </p>

      <p>
        ${statusMessage}
      </p>
    </div>
  `;

  // ホストだけAI生成を開始
  if (
    myId === room.hostId &&
    game.aiStatus !== "generating" &&
    game.aiStatus !== "done"
  ) {

    generateAIEnding(
      room,
      suspectIds,
      counts
    );
  }
}

// ==============================
// AIエンディング生成
// ==============================

async function generateAIEnding(
  room,
  suspectIds,
  voteCounts
) {

  // 二重生成防止
  const currentSnapshot =
    await get(ref(db, `rooms/${roomId}`));

  if (!currentSnapshot.exists()) {
    return;
  }

  const currentRoom =
    currentSnapshot.val();

  const currentGame =
    currentRoom.game || {};

  if (
    currentGame.aiStatus === "generating" ||
    currentGame.finalEnding
  ) {
    return;
  }

  await update(
    ref(db, `rooms/${roomId}/game`),
    {
      aiStatus: "generating"
    }
  );

  try {

    const selectedSuspects =
      suspectIds.map(id => ({
        id,

        name:
          room.players?.[id]?.name ||
          "不明",

        character:
          room.game?.characters?.[id] ||
          null
      }));

    const payload = {

      case:
        room.game?.case || null,

      characters:
        room.game?.characters || {},

      revealedCards:
        room.game?.revealedCards || {},

      votes:
        room.game?.votes || {},

      voteCounts,

      selectedSuspects
    };

    const response =
      await fetch(
        AI_WORKER_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(payload)
        }
      );

    if (!response.ok) {

      throw new Error(
        `AI Worker error: ${response.status}`
      );
    }

    const data =
      await response.json();

    if (
      !data.success ||
      !data.ending
    ) {

      throw new Error(
        data.error ||
        "AIから真相が返ってきませんでした。"
      );
    }

    await update(
      ref(db, `rooms/${roomId}/game`),
      {
        finalEnding: data.ending,
        finalSuspectId:
          suspectIds.length === 1
            ? suspectIds[0]
            : null,
        aiStatus: "done",
        aiError: null
      }
    );

  } catch (error) {

    console.error(
      "AI ending error:",
      error
    );

    await update(
      ref(db, `rooms/${roomId}/game`),
      {
        aiStatus: "error",
        aiError:
          error?.message ||
          "AI生成に失敗しました。"
      }
    );
  }
}

// ==============================
// ホームへ
// ==============================

backHomeBtn.addEventListener(
  "click",
  () => {
    location.reload();
  }
);

// ==============================
// ルームコードコピー
// ==============================

copyBtn.addEventListener(
  "click",
  async () => {

    try {

      await navigator.clipboard.writeText(
        roomId
      );

      copyBtn.textContent =
        "✅ コピーしました！";

      setTimeout(() => {

        copyBtn.textContent =
          "📋 コードをコピー";

      }, 1500);

    } catch {

      lobbyMessage.textContent =
        `ルームコード：${roomId}`;
    }
  }
);

// ==============================
// XSS対策
// ==============================

function escapeHtml(text) {

  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
