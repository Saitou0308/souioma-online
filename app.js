import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getDatabase,
  ref,
  get,
  set,
  update,
  onValue
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


/* =========================
   Firebase
========================= */

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

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);


/* =========================
   プレイヤー用データ
========================= */

const characters = [
  ["探偵", "事件の真相を追うことを仕事にしている。"],
  ["医師", "人の命を救う仕事をしている。"],
  ["教師", "学校で生徒たちに知識を教えている。"],
  ["料理人", "料理を作ることを仕事にしている。"],
  ["警備員", "屋敷や施設の安全を守っている。"],
  ["記者", "事件や噂について取材している。"],
  ["研究者", "研究室で様々な研究をしている。"],
  ["弁護士", "法律について詳しい。"],
  ["芸術家", "絵や作品を作ることを仕事にしている。"],
  ["会社員", "普通の会社に勤めている。"],
  ["学生", "学校に通っている。"],
  ["旅行者", "各地を旅している。"]
];

const characterSettings = [
  "あなたは事件について以前から調べていた。",
  "あなたは事件当日に屋敷の中にいた。",
  "あなたは誰にも話していない秘密を持っている。",
  "あなたは被害者と以前から知り合いだった。",
  "あなたは事件の直前に怪しい人物を見かけた。",
  "あなたは事件について一部の情報を知っている。",
  "あなたは被害者と過去にトラブルになったことがある。",
  "あなたは事件当日の一部の記憶があいまいだ。",
  "あなたには事件を疑われる理由がある。",
  "あなたは事件に関係する物を持っている。",
  "あなたは事件直前に誰かと話をしていた。",
  "あなたは事件について人に話せない事情がある。"
];


/* =========================
   事件
========================= */

const cases = [
  {
    title: "消えた高価な時計",
    text: "屋敷で保管されていた高価な時計が消えた。事件が起きた時間、屋敷にはこのメンバーしかいなかった。"
  },
  {
    title: "密室の事件",
    text: "鍵のかかった部屋で事件が起きた。部屋の外から入った形跡は見つかっていない。"
  },
  {
    title: "消えた手紙",
    text: "重要な手紙が保管場所から消えていた。事件が起きた時間、屋敷にいたのはこのメンバーだけだった。"
  },
  {
    title: "壊された時計",
    text: "屋敷に置かれていた大切な時計が何者かによって壊されていた。"
  },
  {
    title: "なくなった記録",
    text: "事件に関係する重要な記録が一冊だけ消えていた。"
  },
  {
    title: "夜の物音",
    text: "深夜の屋敷で大きな物音が聞こえた。その後、ある人物の姿が見えなくなった。"
  },
  {
    title: "消えた鍵",
    text: "屋敷の重要な部屋を開ける鍵がなくなっていた。"
  },
  {
    title: "偽の証拠",
    text: "事件現場から証拠品が発見された。しかし、それが本物なのかは分からない。"
  }
];


/* =========================
   被害者設定
========================= */

const victimSettings = [
  "被害者は事件の前日に誰かと口論していた。",
  "被害者は事件当日に重要な人物と会う予定だった。",
  "被害者は誰かから秘密を知らされていた。",
  "被害者は事件直前に一人で屋敷を移動していた。",
  "被害者は最近、何かを隠していた。",
  "被害者は事件に関係する人物を疑っていた。",
  "被害者は重要な物を誰かに渡そうとしていた。",
  "被害者は事件について独自に調査していた。"
];


/* =========================
   暴露カード
========================= */

const exposureCards = [
  "事件の時間を妙に正確に覚えている。",
  "事件について隠したい理由がある。",
  "事件について嘘をついている。",
  "事件直前に現場の近くにいた。",
  "被害者と秘密の約束をしていた。",
  "誰かに見られたくない物を持っていた。",
  "被害者と以前にトラブルがあった。",
  "事件の場所について詳しすぎる。",
  "重要な時間帯の行動を説明できない。",
  "誰かと密かに連絡を取っていた。",
  "事件に関係する物を触っていた。",
  "被害者について詳しい情報を知っていた。",
  "事件前に誰かと口論していた。",
  "事件後に証拠を隠そうとした。",
  "怪しい場所に一人で向かっていた。",
  "知らないはずの情報を知っていた。",
  "事件当日に服装を変えていた。",
  "重要な人物から何かを受け取っていた。",
  "事件現場の近くで目撃されている。",
  "自分の行動について説明を避けた。",
  "被害者から何かを借りていた。",
  "事件前に屋敷から出ようとしていた。",
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
  "誰かと協力しているような行動をしていた。",
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


/* =========================
   エンディング
========================= */

const endings = [
  "事件の真相を巡り、屋敷にいた全員の疑いが交錯した。",
  "最後まで明らかにならなかった秘密が、事件の鍵を握っていた。",
  "一つの証言によって、事件の見え方は大きく変わった。",
  "全員の証言をつなぎ合わせることで、事件の真相に近づいた。",
  "事件の裏には、誰も予想していなかった事情が隠されていた。"
];


/* =========================
   状態
========================= */

let roomId = null;
let myId = null;
let myName = null;
let unsubscribeRoom = null;


/* =========================
   ユーティリティ
========================= */

function $(id) {
  return document.getElementById(id);
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function randomId() {
  return Math.random().toString(36).substring(2, 12);
}

function randomRoomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.add("hidden");
  });

  $(id).classList.remove("hidden");
}

function getPlayers(room) {
  return room.players || {};
}

function getPlayerArray(room) {
  return Object.entries(getPlayers(room)).map(([id, player]) => ({
    id,
    ...player
  }));
}


/* =========================
   ホーム
========================= */

$("createBtn").addEventListener("click", async () => {

  const name = $("nameInput").value.trim();

  if (!name) {
    $("homeMessage").textContent =
      "ニックネームを入力してください。";
    return;
  }

  myId = randomId();
  myName = name;
  roomId = randomRoomCode();

  const room = {
    hostId: myId,
    status: "lobby",

    players: {
      [myId]: {
        name: myName
      }
    }
  };

  try {

    await set(
      ref(db, `rooms/${roomId}`),
      room
    );

    enterLobby();

  } catch (error) {

    console.error(error);

    $("homeMessage").textContent =
      "部屋を作れませんでした。";
  }
});


$("joinBtn").addEventListener("click", async () => {

  const name = $("nameInput").value.trim();
  const code = $("roomInput").value.trim();

  if (!name) {
    $("homeMessage").textContent =
      "ニックネームを入力してください。";
    return;
  }

  if (!/^\d{6}$/.test(code)) {
    $("homeMessage").textContent =
      "6桁のルームコードを入力してください。";
    return;
  }

  try {

    const snapshot =
      await get(ref(db, `rooms/${code}`));

    if (!snapshot.exists()) {
      $("homeMessage").textContent =
        "そのルームは存在しません。";
      return;
    }

    const room = snapshot.val();

    if (room.status !== "lobby") {
      $("homeMessage").textContent =
        "このゲームはすでに始まっています。";
      return;
    }

    const players =
      getPlayerArray(room);

    if (players.length >= 6) {
      $("homeMessage").textContent =
        "このルームは満員です。";
      return;
    }

    myId = randomId();
    myName = name;
    roomId = code;

    await update(
      ref(db, `rooms/${roomId}/players/${myId}`),
      {
        name: myName
      }
    );

    enterLobby();

  } catch (error) {

    console.error(error);

    $("homeMessage").textContent =
      "参加できませんでした。";
  }
});


/* =========================
   ロビー
========================= */

function enterLobby() {

  showScreen("lobbyScreen");

  $("roomCode").textContent = roomId;

  if (unsubscribeRoom) {
    unsubscribeRoom();
  }

  unsubscribeRoom = onValue(
    ref(db, `rooms/${roomId}`),
    snapshot => {

      if (!snapshot.exists()) {
        $("lobbyMessage").textContent =
          "ルームが見つかりません。";
        return;
      }

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

  const players =
    getPlayerArray(room);

  $("playerList").innerHTML =
    players.map((player, index) => {

      const crown =
        player.id === room.hostId
          ? " 👑"
          : "";

      return `
        <div class="playerItem">
          ${index + 1}. ${player.name}${crown}
        </div>
      `;

    }).join("");

  if (
    room.hostId === myId &&
    players.length >= 3
  ) {

    $("startBtn").classList.remove("hidden");

  } else {

    $("startBtn").classList.add("hidden");
  }

  if (players.length < 3) {

    $("lobbyMessage").textContent =
      `あと${3 - players.length}人必要です。`;

  } else {

    $("lobbyMessage").textContent =
      `${players.length}人参加中。ゲームを開始できます。`;
  }
}


/* =========================
   ゲーム開始
========================= */

$("startBtn").addEventListener("click", async () => {

  const snapshot =
    await get(ref(db, `rooms/${roomId}`));

  if (!snapshot.exists()) return;

  const room =
    snapshot.val();

  if (room.hostId !== myId) return;

  const players =
    getPlayerArray(room);

  if (players.length < 3 || players.length > 6) {
    return;
  }

  const characterPool =
    shuffle(characters);

  const settingPool =
    shuffle(characterSettings);

  const playerData = {};

  players.forEach((player, index) => {

    playerData[player.id] = {

      name: player.name,

      character:
        characterPool[index][0],

      characterDescription:
        characterPool[index][1],

      secretSetting:
        settingPool[index],

      cards:
        shuffle(exposureCards).slice(0, 4)
    };
  });

  const selectedCase =
    cases[Math.floor(Math.random() * cases.length)];

  const selectedVictimSetting =
    victimSettings[
      Math.floor(Math.random() * victimSettings.length)
    ];

  const selectedEnding =
    endings[
      Math.floor(Math.random() * endings.length)
    ];

  /*
    3人 → 3ラウンド
    4～6人 → 2ラウンド
  */

  const maxRounds =
    players.length === 3
      ? 3
      : 2;

  /*
    最初は館の主人がターゲットを選ぶ
  */

  await update(
    ref(db, `rooms/${roomId}`),
    {

      status: "game",

      caseTitle:
        selectedCase.title,

      caseText:
        selectedCase.text,

      victimSetting:
        selectedVictimSetting,

      ending:
        selectedEnding,

      playerData,

      revealedCards: {},

      exposedThisRound: {},

      round: 1,

      maxRounds,

      selectorId:
        room.hostId,

      targetId: null,

      phase: "select",

      votes: {},

      result: null
    }
  );
});


/* =========================
   ゲーム画面
========================= */

function showGame(room) {

  showScreen("gameScreen");

  $("roundText").textContent =
    `ROUND ${room.round} / ${room.maxRounds}`;

  $("storyTitle").textContent =
    room.caseTitle || "事件";

  $("storyText").textContent =
    room.caseText || "";

  const action =
    $("actionArea");

  action.innerHTML = "";

  /*
    自分のキャラクター情報
  */

  const myData =
    room.playerData?.[myId];

  if (myData) {

    const info =
      document.createElement("div");

    info.className = "storyBox";

    info.innerHTML = `
      <div class="label">YOUR CHARACTER</div>

      <h3>🎭 ${myData.character}</h3>

      <p>${myData.characterDescription}</p>

      <p>
        <strong>あなたの設定：</strong><br>
        ${myData.secretSetting}
      </p>
    `;

    action.appendChild(info);
  }


  /* =====================
     被害者設定
  ===================== */

  if (room.phase === "victim") {

    $("turnText").textContent =
      "被害者設定";

    const victimBox =
      document.createElement("div");

    victimBox.className =
      "revealedCard";

    victimBox.innerHTML = `
      <h3>📜 被害者の設定</h3>
      <p>${room.victimSetting}</p>
    `;

    action.appendChild(victimBox);


    if (room.hostId === myId) {

      const button =
        document.createElement("button");

      button.className =
        "mainBtn";

      if (room.round < room.maxRounds) {

        button.textContent =
          "次のラウンドへ";

        button.onclick =
          nextRound;

      } else {

        button.textContent =
          "最終投票へ";

        button.onclick =
          startVote;
      }

      action.appendChild(button);

    } else {

      const message =
        document.createElement("p");

      message.className =
        "message";

      message.textContent =
        "館の主人が次へ進むのを待っています……";

      action.appendChild(message);
    }

    return;
  }


  /* =====================
     公開済みカード
  ===================== */

  if (
    room.phase === "revealed" ||
    room.phase === "select"
  ) {

    const revealed =
      room.revealedCards || {};

    const players =
      getPlayerArray(room);

    Object.entries(revealed).forEach(
      ([playerId, card]) => {

        const player =
          players.find(
            p => p.id === playerId
          );

        const box =
          document.createElement("div");

        box.className =
          "revealedCard";

        box.innerHTML = `
          <h3>🎴 ${player ? player.name : "プレイヤー"}</h3>
          <p>${card}</p>
        `;

        action.appendChild(box);
      }
    );
  }


  /* =====================
     全員暴露済み
  ===================== */

  const players =
    getPlayerArray(room);

  const exposed =
    room.exposedThisRound || {};

  const allExposed =
    players.length > 0 &&
    players.every(
      player => exposed[player.id] === true
    );

  /*
    万が一 phase が revealed のままでも、
    全員暴露済みなら被害者設定へ進める
  */

  if (
    allExposed &&
    room.phase !== "victim"
  ) {

    $("turnText").textContent =
      "暴露完了";

    const message =
      document.createElement("p");

    message.className =
      "message";

    message.textContent =
      room.hostId === myId
        ? "全員のカードが公開されました。"
        : "全員のカードが公開されました。";

    action.appendChild(message);


    if (room.hostId === myId) {

      const button =
        document.createElement("button");

      button.className =
        "mainBtn";

      button.textContent =
        "被害者設定を公開";

      button.onclick =
        async () => {

          await update(
            ref(db, `rooms/${roomId}`),
            {
              phase: "victim"
            }
          );
        };

      action.appendChild(button);
    }

    return;
  }


  /* =====================
     次のターゲット選択
  ===================== */

  if (room.phase === "revealed") {

    $("turnText").textContent =
      "次のターゲット";

    if (room.selectorId === myId) {

      const title =
        document.createElement("h3");

      title.textContent =
        "次に暴露する人を選んでください";

      action.appendChild(title);

      players.forEach(player => {

        if (player.id === myId) return;

        if (exposed[player.id]) return;

        const button =
          document.createElement("button");

        button.className =
          "mainBtn";

        button.textContent =
          `🎴 ${player.name}`;

        button.onclick =
          () => chooseNextTarget(
            player.id,
            room
          );

        action.appendChild(button);
      });

    } else {

      const selector =
        players.find(
          p => p.id === room.selectorId
        );

      const message =
        document.createElement("p");

      message.className =
        "message";

      message.textContent =
        `${selector ? selector.name : "プレイヤー"}が次のターゲットを選んでいます……`;

      action.appendChild(message);
    }

    return;
  }


  /* =====================
     最初のターゲット選択
  ===================== */

  if (room.phase === "select") {

    $("turnText").textContent =
      "ターゲット選択";

    if (room.selectorId !== myId) {

      const selector =
        players.find(
          p => p.id === room.selectorId
        );

      const message =
        document.createElement("p");

      message.className =
        "message";

      message.textContent =
        `${selector ? selector.name : "館の主人"}が暴露する人を選んでいます……`;

      action.appendChild(message);

      return;
    }

    const title =
      document.createElement("h3");

    title.textContent =
      "暴露する人を選んでください";

    action.appendChild(title);

    players.forEach(player => {

      /*
        自分自身は選べない
      */

      if (player.id === myId) return;

      if (exposed[player.id]) return;

      const button =
        document.createElement("button");

      button.className =
        "mainBtn";

      button.textContent =
        `🎴 ${player.name}`;

      button.onclick =
        () => revealPlayer(
          player.id,
          room
        );

      action.appendChild(button);
    });
  }
}


/* =========================
   暴露
========================= */

async function revealPlayer(playerId, room) {

  if (room.selectorId !== myId) {
    return;
  }

  const playerData =
    room.playerData?.[playerId];

  if (!playerData) {
    return;
  }

  const exposed =
    room.exposedThisRound || {};

  /*
    すでに暴露済みなら選べない
  */

  if (exposed[playerId]) {
    return;
  }

  /*
    このプレイヤーの4枚から、
    まだ公開されていないカードを選ぶ
  */

  const revealedCards =
    room.revealedCards || {};

  const alreadyRevealed =
    revealedCards[playerId];

  let availableCards =
    playerData.cards.filter(
      card => card !== alreadyRevealed
    );

  /*
    4枚全部から選ぶため、
    同じカード名が重複していても
    ランダムに選択
  */

  if (availableCards.length === 0) {
    availableCards =
      playerData.cards;
  }

  const selectedCard =
    availableCards[
      Math.floor(
        Math.random() * availableCards.length
      )
    ];


  const newRevealedCards = {
    ...revealedCards,

    [playerId]:
      selectedCard
  };


  const newExposed = {
    ...exposed,

    [playerId]:
      true
  };


  const players =
    getPlayerArray(room);


  const allExposed =
    players.every(
      player =>
        newExposed[player.id] === true
    );


  /*
    全員暴露済みなら、
    ここで即座に victim にする。
    これがラウンド2へ進めない問題の対策。
  */

  if (allExposed) {

    await update(
      ref(db, `rooms/${roomId}`),
      {

        revealedCards:
          newRevealedCards,

        exposedThisRound:
          newExposed,

        targetId:
          playerId,

        selectorId:
          room.hostId,

        phase:
          "victim"
      }
    );

    return;
  }


  /*
    まだ暴露されていない人がいる場合、
    今暴露された本人が次のターゲットを選ぶ。
  */

  await update(
    ref(db, `rooms/${roomId}`),
    {

      revealedCards:
        newRevealedCards,

      exposedThisRound:
        newExposed,

      targetId:
        playerId,

      selectorId:
        playerId,

      phase:
        "revealed"
    }
  );
}


/* =========================
   次のターゲット
========================= */

async function chooseNextTarget(
  targetId,
  room
) {

  if (room.selectorId !== myId) {
    return;
  }

  const exposed =
    room.exposedThisRound || {};

  if (exposed[targetId]) {
    return;
  }

  if (targetId === myId) {
    return;
  }

  await update(
    ref(db, `rooms/${roomId}`),
    {

      targetId,

      selectorId:
        myId,

      phase:
        "select"
    }
  );
}


/* =========================
   次のラウンド
========================= */

async function nextRound() {

  const snapshot =
    await get(
      ref(db, `rooms/${roomId}`)
    );

  if (!snapshot.exists()) {
    return;
  }

  const room =
    snapshot.val();

  if (room.hostId !== myId) {
    return;
  }

  if (room.round >= room.maxRounds) {
    return;
  }

  const nextRoundNumber =
    room.round + 1;

  await update(
    ref(db, `rooms/${roomId}`),
    {

      round:
        nextRoundNumber,

      revealedCards: {},

      exposedThisRound: {},

      targetId: null,

      /*
        各ラウンドの最初は
        館の主人がターゲットを選ぶ
      */

      selectorId:
        room.hostId,

      phase:
        "select"
    }
  );
}


/* =========================
   投票開始
========================= */

async function startVote() {

  const snapshot =
    await get(
      ref(db, `rooms/${roomId}`)
    );

  if (!snapshot.exists()) {
    return;
  }

  const room =
    snapshot.val();

  if (room.hostId !== myId) {
    return;
  }

  await update(
    ref(db, `rooms/${roomId}`),
    {

      status:
        "vote",

      votes: {}
    }
  );
}


/* =========================
   投票画面
========================= */

function showVote(room) {

  showScreen("voteScreen");

  const players =
    getPlayerArray(room);

  const voteList =
    $("voteList");

  voteList.innerHTML = "";

  const votes =
    room.votes || {};

  /*
    すでに自分が投票済みなら
    ボタンを押せないようにする
  */

  const alreadyVoted =
    votes[myId];

  players.forEach(player => {

    /*
      自分には投票できない
    */

    if (player.id === myId) {
      return;
    }

    const button =
      document.createElement("button");

    button.className =
      "mainBtn";

    button.textContent =
      `🗳️ ${player.name}`;

    if (alreadyVoted) {
      button.disabled = true;
    }

    button.onclick =
      async () => {

        const latest =
          await get(
            ref(db, `rooms/${roomId}`)
          );

        if (!latest.exists()) {
          return;
        }

        const current =
          latest.val();

        const currentVotes =
          current.votes || {};

        if (currentVotes[myId]) {
          return;
        }

        const newVotes = {
          ...currentVotes,

          [myId]:
            player.id
        };

        await update(
          ref(db, `rooms/${roomId}`),
          {
            votes:
              newVotes
          }
        );
      };

    voteList.appendChild(button);
  });


  const voteCount =
    Object.keys(votes).length;

  $("voteMessage").textContent =
    `${voteCount} / ${players.length} 人が投票済み`;


  /*
    全員投票済みなら結果へ
  */

  if (
    voteCount === players.length &&
    !room.result
  ) {

    calculateResult(room);
  }
}


/* =========================
   結果計算
========================= */

async function calculateResult(room) {

  const votes =
    room.votes || {};

  const voteTargets =
    Object.values(votes);

  if (voteTargets.length === 0) {
    return;
  }

  const counts = {};

  voteTargets.forEach(targetId => {

    counts[targetId] =
      (counts[targetId] || 0) + 1;
  });


  let highest =
    0;

  let winners = [];


  Object.entries(counts).forEach(
    ([playerId, count]) => {

      if (count > highest) {

        highest =
          count;

        winners =
          [playerId];

      } else if (count === highest) {

        winners.push(playerId);
      }
    }
  );


  const winnerNames =
    winners.map(
      id =>
        room.players?.[id]?.name ||
        "不明"
    );


  const result = {

    names:
      winnerNames,

    votes:
      counts
  };


  await update(
    ref(db, `rooms/${roomId}`),
    {

      status:
        "result",

      result
    }
  );
}


/* =========================
   結果画面
========================= */

function showResult(room) {

  showScreen("resultScreen");

  const result =
    room.result || {};

  const players =
    getPlayerArray(room);

  const winnerNames =
    result.names || [];

  const counts =
    result.votes || {};


  $("resultText").innerHTML = `

    <h3>最多票</h3>

    <p>
      ${winnerNames.join("、")}
    </p>

    <hr>

    <h3>投票結果</h3>

    ${players.map(player => `

      <p>
        ${player.name}：
        ${counts[player.id] || 0}票
      </p>

    `).join("")}

    <hr>

    <p>
      ${room.ending || ""}
    </p>
  `;
}


/* =========================
   ルームコードコピー
========================= */

$("copyBtn").addEventListener(
  "click",
  async () => {

    try {

      await navigator.clipboard.writeText(
        roomId
      );

      $("lobbyMessage").textContent =
        "ルームコードをコピーしました！";

    } catch {

      $("lobbyMessage").textContent =
        `ルームコード：${roomId}`;
    }
  }
);


/* =========================
   ホームへ戻る
========================= */

$("backHomeBtn").addEventListener(
  "click",
  () => {

    if (unsubscribeRoom) {

      unsubscribeRoom();

      unsubscribeRoom =
        null;
    }

    roomId = null;
    myId = null;
    myName = null;

    $("nameInput").value = "";
    $("roomInput").value = "";

    showScreen("homeScreen");
  }
);


/* =========================
   起動
========================= */

showScreen("homeScreen");
