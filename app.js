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

const $ = id => document.getElementById(id);

const homeScreen = $("homeScreen");
const lobbyScreen = $("lobbyScreen");
const gameScreen = $("gameScreen");
const voteScreen = $("voteScreen");
const resultScreen = $("resultScreen");

const nameInput = $("nameInput");
const roomInput = $("roomInput");

const createBtn = $("createBtn");
const joinBtn = $("joinBtn");
const startBtn = $("startBtn");
const copyBtn = $("copyBtn");
const backHomeBtn = $("backHomeBtn");

const roomCodeElement = $("roomCode");
const playerList = $("playerList");
const lobbyMessage = $("lobbyMessage");
const homeMessage = $("homeMessage");

const roundText = $("roundText");
const turnText = $("turnText");
const storyTitle = $("storyTitle");
const storyText = $("storyText");
const secretText = $("secretText");
const actionArea = $("actionArea");

const voteList = $("voteList");
const voteMessage = $("voteMessage");
const resultText = $("resultText");

let myId = crypto.randomUUID();
let myName = "";
let myRoom = "";
let isHost = false;
let roomListener = null;
let currentRoom = null;

const cases = [
  {
    title: "消えた5000円",
    text: "放課後の教室から5000円が消えた。事件が起きた時間に教室にいたのは、このメンバーだけだった。",
    secrets: [
      "事件の直前に教室へ戻った。",
      "お金が入った封筒の場所を知っていた。",
      "最近お金に困っていた。",
      "事件の時間に教室の近くを通った。",
      "事件後に誰かと話していた。",
      "封筒を一度触ったことがある。"
    ]
  },
  {
    title: "消えたゲーム機",
    text: "部屋に置いてあったゲーム機がなくなった。全員が自分は取っていないと言っている。",
    secrets: [
      "ゲーム機を最後に見た。",
      "ゲーム機の置き場所を知っていた。",
      "事件前日にゲーム機を使った。",
      "事件の時間に部屋の鍵を持っていた。",
      "ゲーム機について誰かと話していた。",
      "事件後に部屋へ戻った。"
    ]
  },
  {
    title: "割れた窓",
    text: "学校の窓ガラスが割れていた。先生が来たとき、現場には複数の生徒がいた。",
    secrets: [
      "割れる直前に大きな音を聞いた。",
      "窓の近くにボールを置いていた。",
      "事件後に急いでその場を離れた。",
      "割れた窓の近くに何かを落とした。",
      "事件直前に窓を見ていた。",
      "誰かが走っているのを見た。"
    ]
  },
  {
    title: "なくなったプレゼント",
    text: "誕生日会のために用意していたプレゼントが突然なくなった。犯人はこの中にいる。",
    secrets: [
      "プレゼントの中身を知っていた。",
      "プレゼントを一度持ったことがある。",
      "事件の直前に一人になった。",
      "プレゼントを隠せそうな場所を知っている。",
      "誰かからプレゼントについて聞かれた。",
      "事件後に部屋を出た。"
    ]
  }
];

function showScreen(screen) {
  [
    homeScreen,
    lobbyScreen,
    gameScreen,
    voteScreen,
    resultScreen
  ].forEach(x => x.classList.add("hidden"));

  screen.classList.remove("hidden");
}

function errorMessage(error) {
  console.error(error);

  const message =
    error?.message ||
    String(error);

  alert("エラーが発生しました。\n\n" + message);

  homeMessage.textContent =
    "❌ " + message;
}

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars[
      Math.floor(Math.random() * chars.length)
    ];
  }

  return code;
}

/* 部屋を作る */

createBtn.addEventListener("click", async () => {
  try {
    const name = nameInput.value.trim();

    if (!name) {
      alert("ニックネームを入力してください！");
      return;
    }

    createBtn.disabled = true;
    homeMessage.textContent = "部屋を作成中……";

    let code = null;

    for (let i = 0; i < 10; i++) {
      const candidate = generateRoomCode();

      const snapshot = await get(
        ref(db, "rooms/" + candidate)
      );

      if (!snapshot.exists()) {
        code = candidate;
        break;
      }
    }

    if (!code) {
      throw new Error("空いているルームコードを作れませんでした。");
    }

    myName = name;
    myRoom = code;
    isHost = true;

    await set(
      ref(db, "rooms/" + code),
      {
        status: "lobby",
        hostId: myId,
        createdAt: Date.now(),
        players: {
          [myId]: {
            name: myName
          }
        }
      }
    );

    homeMessage.textContent = "";

    enterLobby();

  } catch (error) {
    errorMessage(error);
  } finally {
    createBtn.disabled = false;
  }
});

/* 部屋に参加 */

joinBtn.addEventListener("click", async () => {
  try {
    const name = nameInput.value.trim();
    const code = roomInput.value.trim().toUpperCase();

    if (!name) {
      alert("ニックネームを入力してください！");
      return;
    }

    if (code.length !== 6) {
      alert("6文字のルームコードを入力してください！");
      return;
    }

    joinBtn.disabled = true;

    const snapshot = await get(
      ref(db, "rooms/" + code)
    );

    if (!snapshot.exists()) {
      alert("そのルームは存在しません！");
      return;
    }

    const room = snapshot.val();

    if (room.status !== "lobby") {
      alert("このゲームはすでに始まっています！");
      return;
    }

    const players = room.players || {};

    if (Object.keys(players).length >= 6) {
      alert("このルームは満員です！");
      return;
    }

    myName = name;
    myRoom = code;
    isHost = false;

    await set(
      ref(
        db,
        "rooms/" + code + "/players/" + myId
      ),
      {
        name: myName
      }
    );

    enterLobby();

  } catch (error) {
    errorMessage(error);
  } finally {
    joinBtn.disabled = false;
  }
});

/* ロビー */

function enterLobby() {
  roomCodeElement.textContent = myRoom;

  showScreen(lobbyScreen);

  if (roomListener) {
    roomListener();
  }

  roomListener = onValue(
    ref(db, "rooms/" + myRoom),
    snapshot => {
      if (!snapshot.exists()) {
        alert("ルームがなくなりました。");
        showScreen(homeScreen);
        return;
      }

      currentRoom = snapshot.val();

      renderPlayers(
        currentRoom.players || {}
      );

      if (currentRoom.status === "game") {
        showGame(currentRoom);
      }

      if (currentRoom.status === "vote") {
        showVote(currentRoom);
      }

      if (currentRoom.status === "result") {
        showResult(currentRoom);
      }
    }
  );
}

/* プレイヤー表示 */

function renderPlayers(players) {
  playerList.innerHTML = "";

  const list = Object.entries(players);

  list.forEach(([id, player], index) => {
    const div = document.createElement("div");

    div.className = "player";

    if (index === 0) {
      div.classList.add("host");
      div.textContent = "👑 ";
    } else {
      div.textContent = "👤 ";
    }

    div.textContent += player.name;

    if (id === myId) {
      div.textContent += "（あなた）";
    }

    playerList.appendChild(div);
  });

  if (isHost) {
    if (list.length >= 3) {
      startBtn.classList.remove("hidden");

      lobbyMessage.textContent =
        list.length + "人参加中。ゲームを開始できます！";
    } else {
      startBtn.classList.add("hidden");

      lobbyMessage.textContent =
        "あと " +
        (3 - list.length) +
        "人必要です。";
    }
  } else {
    startBtn.classList.add("hidden");

    lobbyMessage.textContent =
      "ホストがゲームを開始するまで待ってください。";
  }
}

/* ゲーム開始 */

startBtn.addEventListener("click", async () => {
  try {
    if (!isHost) return;

    const snapshot = await get(
      ref(db, "rooms/" + myRoom)
    );

    if (!snapshot.exists()) return;

    const room = snapshot.val();

    const players =
      Object.keys(room.players || {});

    if (players.length < 3) {
      alert("3人以上必要です！");
      return;
    }

    const selectedCase =
      cases[
        Math.floor(
          Math.random() * cases.length
        )
      ];

    const culpritId =
      players[
        Math.floor(
          Math.random() * players.length
        )
      ];

    const secrets = {};

    players.forEach((id, index) => {
      secrets[id] =
        selectedCase.secrets[
          index % selectedCase.secrets.length
        ];
    });

    await update(
      ref(db, "rooms/" + myRoom),
      {
        status: "game",
        caseTitle: selectedCase.title,
        caseText: selectedCase.text,
        secrets: secrets,
        culpritId: culpritId,
        round: 1,
        turnIndex: 0,
        statements: {},
        votes: {}
      }
    );

  } catch (error) {
    errorMessage(error);
  }
});

/* ゲーム画面 */

function showGame(room) {
  showScreen(gameScreen);

  const players =
    Object.entries(room.players || {});

  const index =
    room.turnIndex || 0;

  const current =
    players[index];

  roundText.textContent =
    "ROUND " + (room.round || 1);

  turnText.textContent =
    current
      ? "🎤 " + current[1].name + " の番"
      : "";

  storyTitle.textContent =
    room.caseTitle || "事件";

  storyText.textContent =
    room.caseText || "";

  secretText.textContent =
    room.secrets?.[myId] ||
    "秘密情報がありません。";

  actionArea.innerHTML = "";

  if (!current) return;

  if (current[0] !== myId) {
    const p = document.createElement("p");

    p.className = "message";

    p.textContent =
      current[1].name +
      " が発言しています。";

    actionArea.appendChild(p);

    return;
  }

  const title = document.createElement("h3");

  title.textContent =
    "あなたの発言";

  actionArea.appendChild(title);

  const input =
    document.createElement("input");

  input.placeholder =
    "自分の秘密をもとに発言しよう";

  input.id = "statementInput";

  actionArea.appendChild(input);

  const button =
    document.createElement("button");

  button.className = "mainBtn";

  button.textContent =
    "💬 発言する";

  button.addEventListener(
    "click",
    async () => {

      const text =
        input.value.trim();

      if (!text) {
        alert("発言を入力してください！");
        return;
      }

      const statements =
        room.statements || {};

      statements[myId] = {
        name: myName,
        text: text
      };

      await update(
        ref(db, "rooms/" + myRoom),
        {
          statements: statements
        }
      );

      await nextTurn(room);
    }
  );

  actionArea.appendChild(button);

  const listTitle =
    document.createElement("h3");

  listTitle.textContent =
    "これまでの発言";

  actionArea.appendChild(listTitle);

  Object.values(
    room.statements || {}
  ).forEach(statement => {

    const div =
      document.createElement("div");

    div.className =
      "resultItem";

    div.textContent =
      "💬 " +
      statement.name +
      "「" +
      statement.text +
      "」";

    actionArea.appendChild(div);
  });
}

/* 次のターン */

async function nextTurn(room) {
  const players =
    Object.keys(room.players || {});

  let nextIndex =
    (room.turnIndex || 0) + 1;

  let nextRound =
    room.round || 1;

  if (nextIndex >= players.length) {
    nextIndex = 0;
    nextRound++;
  }

  if (nextRound > 2) {
    await update(
      ref(db, "rooms/" + myRoom),
      {
        status: "vote"
      }
    );

    return;
  }

  await update(
    ref(db, "rooms/" + myRoom),
    {
      turnIndex: nextIndex,
      round: nextRound
    }
  );
}

/* 投票 */

function showVote(room) {
  showScreen(voteScreen);

  voteList.innerHTML = "";

  voteMessage.textContent =
    "一番怪しいと思う人に投票してください。";

  const players =
    Object.entries(room.players || {});

  const alreadyVoted =
    room.votes?.[myId];

  players.forEach(([id, player]) => {

    if (id === myId) return;

    const button =
      document.createElement("button");

    button.className = "voteBtn";

    button.textContent =
      "🗳️ " + player.name;

    if (alreadyVoted === id) {
      button.classList.add("selected");
    }

    button.addEventListener(
      "click",
      () => submitVote(id)
    );

    voteList.appendChild(button);
  });
}

/* 投票送信 */

async function submitVote(targetId) {
  try {
    const snapshot = await get(
      ref(db, "rooms/" + myRoom)
    );

    if (!snapshot.exists()) return;

    const room = snapshot.val();

    const votes =
      room.votes || {};

    votes[myId] = targetId;

    await update(
      ref(db, "rooms/" + myRoom),
      {
        votes: votes
      }
    );

    voteMessage.textContent =
      "✅ 投票しました。";

    checkAllVotes();

  } catch (error) {
    errorMessage(error);
  }
}

/* 全員投票確認 */

async function checkAllVotes() {
  const snapshot = await get(
    ref(db, "rooms/" + myRoom)
  );

  if (!snapshot.exists()) return;

  const room = snapshot.val();

  const players =
    Object.keys(room.players || {});

  const votes =
    Object.keys(room.votes || {});

  if (votes.length < players.length) {
    return;
  }

  const count = {};

  Object.values(room.votes || {}).forEach(
    target => {
      count[target] =
        (count[target] || 0) + 1;
    }
  );

  let mostVoted = null;
  let max = -1;

  Object.entries(count).forEach(
    ([id, num]) => {
      if (num > max) {
        max = num;
        mostVoted = id;
      }
    }
  );

  await update(
    ref(db, "rooms/" + myRoom),
    {
      status: "result",
      votedId: mostVoted,
      voteCount: max
    }
  );
}

/* 結果 */

function showResult(room) {
  showScreen(resultScreen);

  const culprit =
    room.players?.[room.culpritId];

  const voted =
    room.players?.[room.votedId];

  if (!culprit) return;

  let html = "";

  html +=
    `<div class="resultItem">
      🎭 犯人は <strong>${culprit.name}</strong> でした！
    </div>`;

  if (voted) {

    if (room.votedId === room.culpritId) {

      html +=
        `<div class="resultItem success">
          🎉 正解！犯人を当てました！
        </div>`;

    } else {

      html +=
        `<div class="resultItem failure">
          ❌ 投票されたのは ${voted.name} でした。
        </div>`;

    }

  }

  html +=
    `<div class="resultItem">
      投票数：${room.voteCount || 0}
    </div>`;

  resultText.innerHTML = html;
}

/* コードコピー */

copyBtn.addEventListener(
  "click",
  async () => {

    try {

      await navigator.clipboard.writeText(
        myRoom
      );

      copyBtn.textContent =
        "✅ コピーしました！";

      setTimeout(() => {
        copyBtn.textContent =
          "📋 コードをコピー";
      }, 1500);

    } catch {

      alert(
        "ルームコード：" +
        myRoom
      );

    }
  }
);

/* ホーム */

backHomeBtn.addEventListener(
  "click",
  () => {

    if (roomListener) {
      roomListener();
      roomListener = null;
    }

    myId = crypto.randomUUID();
    myName = "";
    myRoom = "";
    isHost = false;

    nameInput.value = "";
    roomInput.value = "";

    showScreen(homeScreen);
  }
);

/* コード入力 */

roomInput.addEventListener(
  "input",
  () => {

    roomInput.value =
      roomInput.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");

  }
);

/* Firebase接続状態 */

onValue(
  ref(db, ".info/connected"),
  snapshot => {

    if (snapshot.val() === true) {

      homeMessage.textContent =
        "🟢 Firebase接続OK";

    } else {

      homeMessage.textContent =
        "🔴 Firebaseに接続できていません";

    }

  },
  error => {

    console.error(error);

    homeMessage.textContent =
      "🔴 Firebase接続エラー";

  }
);