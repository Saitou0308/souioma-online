import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getDatabase,
  ref,
  get,
  set,
  update,
  onValue
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


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


// =========================
// データ
// =========================

const characters = [
  ["探偵", "事件の真相を追う人物"],
  ["医師", "人々の健康を守る人物"],
  ["教師", "知識を教える人物"],
  ["料理人", "料理を仕事にする人物"],
  ["警備員", "建物を守る人物"],
  ["記者", "情報を集める人物"],
  ["研究者", "研究に没頭する人物"],
  ["弁護士", "法律に詳しい人物"],
  ["芸術家", "作品を作る人物"],
  ["会社員", "普通の会社員"],
  ["学生", "学校に通う人物"],
  ["旅行者", "各地を旅している人物"]
];

const characterSettings = [
  "あなたは昔からこの事件について調べている。",
  "あなたは事件当日に重要な場所にいた。",
  "あなたは誰にも言っていない秘密を抱えている。",
  "あなたは被害者と以前から知り合いだった。",
  "あなたは事件直前に怪しい人物を見かけた。",
  "あなたは事件について一部だけ真実を知っている。",
  "あなたは被害者とトラブルになったことがある。",
  "あなたは事件当日の記憶が一部あいまいだ。",
  "あなたは自分が疑われる理由を知っている。",
  "あなたは事件に関係する物を持っている。",
  "あなたは事件の直前に誰かと話をしていた。",
  "あなたは事件について誰にも話せない事情がある。"
];

const cases = [
  [
    "消えた宝石",
    "館で大切な宝石が突然なくなった。全員が館の中にいた。"
  ],
  [
    "密室の事件",
    "鍵のかかった部屋で事件が起きた。外から入った形跡はない。"
  ],
  [
    "消えた手紙",
    "重要な手紙が保管場所から消えていた。"
  ],
  [
    "壊れた時計",
    "館にある大切な時計が何者かによって壊されていた。"
  ],
  [
    "なくなった記録",
    "事件に関係する記録が一冊だけ消えていた。"
  ],
  [
    "夜の物音",
    "深夜、館の中で大きな物音が聞こえた。"
  ],
  [
    "消えた鍵",
    "館の重要な鍵がなくなっていた。"
  ],
  [
    "偽の証拠",
    "事件現場から、本物とは思えない証拠が発見された。"
  ]
];

const victimSettings = [
  "被害者は事件の前日に誰かと口論していた。",
  "被害者は事件当日に重要な人物と会う予定だった。",
  "被害者は誰かから秘密を知らされていた。",
  "被害者は事件直前に一人で館を移動していた。",
  "被害者は最近、何かを隠していた。",
  "被害者は事件に関係する人物を疑っていた。",
  "被害者は重要な物を誰かに渡そうとしていた。",
  "被害者は事件について独自に調査していた。"
];

const exposureCards = [
  "事件当日に不自然な行動をしていた。",
  "事件直前に現場の近くにいた。",
  "被害者と秘密の約束をしていた。",
  "誰かに見られたくない物を持っていた。",
  "事件について嘘をついていた。",
  "事件後に突然姿を消そうとした。",
  "被害者と以前に大きなトラブルがあった。",
  "事件の場所について詳しすぎる。",
  "重要な時間帯の行動を説明できない。",
  "誰かと密かに連絡を取っていた。",
  "事件に関係する物を触っていた。",
  "被害者について詳しい情報を知っていた。",
  "事件前に誰かと口論していた。",
  "事件後に証拠を隠そうとした。",
  "怪しい場所に一人で向かっていた。",
  "事件について知らないはずの情報を知っていた。",
  "事件当日に服装を変えていた。",
  "重要な人物から何かを受け取っていた。",
  "事件現場の近くで目撃されている。",
  "自分の行動について説明を避けた。",
  "被害者から何かを借りていた。",
  "事件前に館から出ようとしていた。",
  "誰かの証言と行動が一致しない。",
  "事件について妙に落ち着いていた。",
  "重要な証拠について知っていた。",
  "事件直後に誰かへ連絡していた。",
  "被害者の持ち物を調べていた。",
  "事件前に怪しい場所を訪れていた。",
  "誰かに秘密を隠していた。",
  "事件後に証拠を移動させた。",
  "事件当日の予定を偽っていた。",
  "被害者と金銭的な関係があった。",
  "事件について複数の話をしている。",
  "事件前後で態度が変わっていた。",
  "誰かと共犯のような行動をしていた。",
  "事件現場に残された物と関係がある。",
  "事件当日の記憶を曖昧にしている。",
  "重要な場所への行き方を知っている。",
  "事件後に不自然な言い訳をした。",
  "被害者から秘密を知らされていた。",
  "事件について調べた形跡がある。",
  "事件直前に誰かと二人きりだった。",
  "証拠になりそうな物を捨てていた。",
  "事件後に急いで帰ろうとしていた。",
  "事件について誰かをかばっている。",
  "被害者と最後に話した人物の一人だった。",
  "事件に関する秘密を握っている。",
  "自分だけが知っている情報がある。"
];

const endings = [
  "事件の真相は、最後まで誰にも分からなかった。",
  "意外な人物の行動が事件の鍵になっていた。",
  "一つの証言が、事件の流れを大きく変えた。",
  "全員の証言をつなぎ合わせることで真実が見えてきた。",
  "事件の裏には、誰も予想していなかった事情があった。"
];


// =========================
// 状態
// =========================

let roomId = null;
let myId = null;
let myName = null;
let unsubscribe = null;


// =========================
// 共通
// =========================

const $ = id => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.add("hidden");
  });

  $(id).classList.remove("hidden");
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function createId() {
  return Math.random().toString(36).substring(2, 10);
}

function createRoomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getPlayers(room) {
  return room?.players || {};
}

function playerArray(room) {
  return Object.entries(getPlayers(room)).map(([id, player]) => ({
    id,
    ...player
  }));
}


// =========================
// ホーム
// =========================

$("createBtn").addEventListener("click", async () => {

  const name = $("nameInput").value.trim();

  if (!name) {
    $("homeMessage").textContent = "ニックネームを入力してください。";
    return;
  }

  myId = createId();
  myName = name;
  roomId = createRoomCode();

  const room = {
    hostId: myId,
    status: "lobby",

    players: {
      [myId]: {
        name: myName,
        joined: true
      }
    }
  };

  await set(ref(db, `rooms/${roomId}`), room);

  enterLobby();
});


$("joinBtn").addEventListener("click", async () => {

  const name = $("nameInput").value.trim();
  const code = $("roomInput").value.trim();

  if (!name) {
    $("homeMessage").textContent = "ニックネームを入力してください。";
    return;
  }

  if (!/^\d{6}$/.test(code)) {
    $("homeMessage").textContent = "6桁のルームコードを入力してください。";
    return;
  }

  const snapshot = await get(ref(db, `rooms/${code}`));

  if (!snapshot.exists()) {
    $("homeMessage").textContent = "その部屋はありません。";
    return;
  }

  const room = snapshot.val();

  if (room.status !== "lobby") {
    $("homeMessage").textContent = "このゲームはすでに始まっています。";
    return;
  }

  const count = Object.keys(room.players || {}).length;

  if (count >= 6) {
    $("homeMessage").textContent = "この部屋は満員です。";
    return;
  }

  myId = createId();
  myName = name;
  roomId = code;

  await update(ref(db, `rooms/${roomId}/players/${myId}`), {
    name: myName,
    joined: true
  });

  enterLobby();
});


// =========================
// ロビー
// =========================

function enterLobby() {

  showScreen("lobbyScreen");

  $("roomCode").textContent = roomId;

  if (unsubscribe) {
    unsubscribe();
  }

  unsubscribe = onValue(
    ref(db, `rooms/${roomId}`),
    snapshot => {

      if (!snapshot.exists()) return;

      const room = snapshot.val();

      if (room.status === "game") {
        showGame(room);
        return;
      }

      if (room.status === "vote") {
        showVote(room);
        return;
      }

      if (room.status === "result") {
        showResult(room);
        return;
      }

      renderLobby(room);
    }
  );
}


function renderLobby(room) {

  const players = playerArray(room);

  $("playerList").innerHTML = players.map((player, index) => {

    const host = player.id === room.hostId ? " 👑" : "";

    return `
      <div class="playerItem">
        ${index + 1}. ${player.name}${host}
      </div>
    `;

  }).join("");

  if (room.hostId === myId && players.length >= 3) {
    $("startBtn").classList.remove("hidden");
  } else {
    $("startBtn").classList.add("hidden");
  }

  $("lobbyMessage").textContent =
    players.length < 3
      ? `あと${3 - players.length}人必要です。`
      : `${players.length}人参加中。ゲームを開始できます。`;
}


// =========================
// ゲーム開始
// =========================

$("startBtn").addEventListener("click", async () => {

  const snapshot = await get(ref(db, `rooms/${roomId}`));

  if (!snapshot.exists()) return;

  const room = snapshot.val();

  if (room.hostId !== myId) return;

  const players = playerArray(room);

  if (players.length < 3 || players.length > 6) {
    return;
  }

  const characterPool = shuffle(characters);
  const settingPool = shuffle(characterSettings);

  const playerData = {};

  players.forEach((player, index) => {

    playerData[player.id] = {
      name: player.name,

      character: characterPool[index][0],
      characterDescription: characterPool[index][1],

      secretSetting: settingPool[index],

      cards: shuffle(exposureCards).slice(0, 4)
    };

  });

  const selectedCase =
    cases[Math.floor(Math.random() * cases.length)];

  const victimSetting =
    victimSettings[Math.floor(Math.random() * victimSettings.length)];

  const ending =
    endings[Math.floor(Math.random() * endings.length)];

  await update(ref(db, `rooms/${roomId}`), {

    status: "game",

    caseTitle: selectedCase[0],
    caseText: selectedCase[1],

    victimSetting,
    ending,

    playerData,

    revealedCards: {},
    exposedThisRound: {},

    round: 1,

    maxRounds: players.length === 3 ? 3 : 2,

    targetId: null,
    selectorId: room.hostId,

    phase: "select",

    votes: {}
  });

});


// =========================
// ゲーム画面
// =========================

function showGame(room) {

  showScreen("gameScreen");

  $("roundText").textContent =
    `ROUND ${room.round} / ${room.maxRounds}`;

  $("storyTitle").textContent =
    room.caseTitle || "事件";

  $("storyText").textContent =
    room.caseText || "";

  const action = $("actionArea");

  action.innerHTML = "";

  const players = playerArray(room);

  // -------------------------
  // 被害者設定公開
  // -------------------------

  if (room.phase === "victim") {

    $("turnText").textContent = "事件の新情報";

    action.innerHTML = `
      <div class="revealedCard">
        <h3>📜 被害者の設定</h3>
        <p>${room.victimSetting}</p>
      </div>
    `;

    if (room.hostId === myId) {

      const button = document.createElement("button");

      button.className = "mainBtn";

      if (room.round < room.maxRounds) {
        button.textContent = "次のラウンドへ";
        button.onclick = nextRound;
      } else {
        button.textContent = "最終投票へ";
        button.onclick = startVote;
      }

      action.appendChild(button);

    } else {

      action.innerHTML += `
        <p class="message">
          館の主人が次へ進めるのを待っています……
        </p>
      `;
    }

    return;
  }


  // -------------------------
  // 暴露カード公開後
  // -------------------------

  if (room.phase === "revealed") {

    $("turnText").textContent = "暴露カード公開";

    const revealed = room.revealedCards || {};

    const cards = Object.entries(revealed);

    action.innerHTML = cards.map(([playerId, card]) => {

      const player = players.find(p => p.id === playerId);

      return `
        <div class="revealedCard">
          <strong>${player ? player.name : "プレイヤー"}</strong>
          <p>🎴 ${card}</p>
        </div>
      `;

    }).join("");

    const exposed =
      room.exposedThisRound || {};

    const everyoneExposed =
      players.every(player => exposed[player.id]);

    if (everyoneExposed) {

      if (room.hostId === myId) {

        const button = document.createElement("button");

        button.className = "mainBtn";
        button.textContent = "被害者設定を公開";

        button.onclick = async () => {

          await update(
            ref(db, `rooms/${roomId}`),
            {
              phase: "victim"
            }
          );

        };

        action.appendChild(button);

      } else {

        action.innerHTML += `
          <p class="message">
            全員のカードが公開されました。
          </p>
        `;
      }

      return;
    }


    // 公開された本人が次のターゲットを選ぶ

    if (room.selectorId === myId) {

      action.innerHTML += `
        <h3>次に暴露する相手を選んでください</h3>
      `;

      players.forEach(player => {

        if (player.id === myId) return;
        if (exposed[player.id]) return;

        const button = document.createElement("button");

        button.textContent = player.name;
        button.className = "mainBtn";

        button.onclick = () => {
          chooseNextTarget(player.id, room);
        };

        action.appendChild(button);
      });

    } else {

      const selector =
        players.find(p => p.id === room.selectorId);

      action.innerHTML += `
        <p class="message">
          ${selector ? selector.name : "プレイヤー"}が
          次のターゲットを選んでいます……
        </p>
      `;
    }

    return;
  }


  // -------------------------
  // ターゲット選択
  // -------------------------

  if (room.phase === "select") {

    $("turnText").textContent = "暴露する相手を選択";

    if (room.selectorId !== myId) {

      const selector =
        players.find(p => p.id === room.selectorId);

      action.innerHTML = `
        <p class="message">
          ${selector ? selector.name : "館の主人"}が
          暴露する相手を選んでいます……
        </p>
      `;

      return;
    }

    action.innerHTML = `
      <h3>暴露する相手を選んでください</h3>
    `;

    const exposed =
      room.exposedThisRound || {};

    players.forEach(player => {

      if (player.id === myId) return;
      if (exposed[player.id]) return;

      const button = document.createElement("button");

      button.className = "mainBtn";
      button.textContent = `🎴 ${player.name}`;

      button.onclick = () => {
        revealPlayer(player.id, room);
      };

      action.appendChild(button);

    });

  }
}


// =========================
// カードを公開
// =========================

async function revealPlayer(playerId, room) {

  if (room.selectorId !== myId) return;

  const player =
    room.playerData?.[playerId];

  if (!player) return;

  const already =
    Object.values(room.revealedCards || {})
      .filter(card => player.cards.includes(card));

  const remaining =
    player.cards.filter(card => !already.includes(card));

  if (remaining.length === 0) return;

  const card =
    remaining[Math.floor(Math.random() * remaining.length)];

  const revealed = {
    ...(room.revealedCards || {}),
    [playerId]: card
  };

  const exposed = {
    ...(room.exposedThisRound || {}),
    [playerId]: true
  };

  const players = playerArray(room);

  const allExposed =
    players.every(p => exposed[p.id]);

  await update(
    ref(db, `rooms/${roomId}`),
    {
      revealedCards: revealed,
      exposedThisRound: exposed,

      targetId: playerId,

      selectorId: playerId,

      phase: allExposed
        ? "victim"
        : "revealed"
    }
  );
}


// =========================
// 次のターゲット
// =========================

async function chooseNextTarget(targetId, room) {

  if (room.selectorId !== myId) return;

  const exposed =
    room.exposedThisRound || {};

  const players =
    playerArray(room);

  if (exposed[targetId]) return;

  await update(
    ref(db, `rooms/${roomId}`),
    {
      targetId,
      selectorId: targetId,
      phase: "select"
    }
  );
}


// =========================
// 次ラウンド
// =========================

async function nextRound() {

  const snapshot =
    await get(ref(db, `rooms/${roomId}`));

  if (!snapshot.exists()) return;

  const room = snapshot.val();

  if (room.hostId !== myId) return;

  const nextRoundNumber =
    room.round + 1;

  await update(
    ref(db, `rooms/${roomId}`),
    {
      round: nextRoundNumber,

      revealedCards: {},
      exposedThisRound: {},

      targetId: null,

      selectorId: room.hostId,

      phase: "select"
    }
  );
}


// =========================
// 投票
// =========================

async function startVote() {

  const snapshot =
    await get(ref(db, `rooms/${roomId}`));

  if (!snapshot.exists()) return;

  const room = snapshot.val();

  if (room.hostId !== myId) return;

  await update(
    ref(db, `rooms/${roomId}`),
    {
      status: "vote",
      votes: {}
    }
  );
}


function showVote(room) {

  showScreen("voteScreen");

  const players =
    playerArray(room);

  const list =
    $("voteList");

  list.innerHTML = "";

  players.forEach(player => {

    if (player.id === myId) return;

    const button =
      document.createElement("button");

    button.className = "mainBtn";
    button.textContent = `🗳️ ${player.name}`;

    button.onclick = async () => {

      const snapshot =
        await get(ref(db, `rooms/${roomId}`));

      if (!snapshot.exists()) return;

      const current =
        snapshot.val();

      const votes = {
        ...(current.votes || {}),
        [myId]: player.id
      };

      await update(
        ref(db, `rooms/${roomId}`),
        {
          votes
        }
      );
    };

    list.appendChild(button);
  });

  const votes =
    Object.keys(room.votes || {});

  $("voteMessage").textContent =
    `${votes.length} / ${players.length} 人が投票済み`;

  if (votes.length === players.length) {
    calculateResult(room);
  }
}


// =========================
// 結果
// =========================

async function calculateResult(room) {

  const votes =
    Object.values(room.votes || {});

  const counts = {};

  votes.forEach(id => {
    counts[id] = (counts[id] || 0) + 1;
  });

  let max = 0;
  let winners = [];

  Object.entries(counts).forEach(([id, count]) => {

    if (count > max) {
      max = count;
      winners = [id];
    } else if (count === max) {
      winners.push(id);
    }

  });

  const names =
    winners.map(id =>
      room.players[id]?.name || "不明"
    );

  await update(
    ref(db, `rooms/${roomId}`),
    {
      status: "result",

      result: {
        names,
        votes: counts
      }
    }
  );
}


function showResult(room) {

  showScreen("resultScreen");

  const result =
    room.result || {};

  const names =
    result.names || [];

  const votes =
    result.votes || {};

  const players =
    playerArray(room);

  $("resultText").innerHTML = `
    <h3>最多票</h3>

    <p>
      ${names.join("、")}
    </p>

    <hr>

    <h3>投票結果</h3>

    ${players.map(player => `
      <p>
        ${player.name}：
        ${votes[player.id] || 0}票
      </p>
    `).join("")}

    <hr>

    <p>${room.ending || ""}</p>
  `;
}


// =========================
// コードコピー
// =========================

$("copyBtn").addEventListener("click", async () => {

  try {

    await navigator.clipboard.writeText(roomId);

    $("lobbyMessage").textContent =
      "ルームコードをコピーしました！";

  } catch {

    $("lobbyMessage").textContent =
      `ルームコード：${roomId}`;

  }
});


// =========================
// ホームへ
// =========================

$("backHomeBtn").addEventListener("click", () => {

  roomId = null;
  myId = null;
  myName = null;

  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }

  showScreen("homeScreen");
});


// =========================
// 初期状態
// =========================

showScreen("homeScreen");
