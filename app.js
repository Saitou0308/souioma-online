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
const actionArea = $("actionArea");

const voteList = $("voteList");
const voteMessage = $("voteMessage");
const resultText = $("resultText");

let myId = crypto.randomUUID();
let myName = "";
let myRoom = "";
let isHost = false;
let roomListener = null;


/* =========================
   オリジナルゲームデータ
========================= */

const characters = [
  ["探偵", "観察力が鋭く、事件の細部まで気にする人物"],
  ["医学生", "医学知識があり、冷静に状況を判断する人物"],
  ["料理人", "食べ物や道具に詳しい人物"],
  ["学生", "普段は普通だが、妙に事件へ詳しい人物"],
  ["会社員", "時間や予定を細かく管理する人物"],
  ["芸術家", "独特な感性を持ち、周囲をよく観察している人物"],
  ["教師", "人の行動をよく見ている人物"],
  ["記者", "秘密や噂を集めるのが得意な人物"],
  ["技術者", "機械や電子機器に詳しい人物"],
  ["店員", "人の出入りをよく覚えている人物"],
  ["旅行者", "事件の日に偶然その場所へ来ていた人物"],
  ["警備員", "周囲の安全を確認する仕事をしている人物"]
];

const characterSettings = [
  "実は事件現場に秘密の用事があった。",
  "被害者から何かを頼まれていた。",
  "事件について誰にも言えない情報を知っている。",
  "事件の前日に被害者と口論していた。",
  "事件当日の行動を一部隠している。",
  "事件現場に行ったことを認めたくない理由がある。",
  "事件後に誰かと連絡を取っていた。",
  "被害者から借りた物を返していない。",
  "事件当時、一人で行動していた。",
  "事件について最初から妙に詳しかった。",
  "事件現場の鍵について知っている。",
  "被害者との関係を周囲に隠している。"
];

const cases = [
  {
    title: "消えた高価な時計",
    text: "屋敷で保管されていた高価な時計が消えた。事件が起きた時間、屋敷にはこのメンバーしかいなかった。"
  },
  {
    title: "謎の停電",
    text: "夜、屋敷全体が突然停電した。明かりが戻ったとき、重要な物が一つなくなっていた。"
  },
  {
    title: "割れた展示ケース",
    text: "貴重な展示品を入れていたケースが割られていた。しかし展示品だけが持ち去られていた。"
  },
  {
    title: "消えた鍵",
    text: "屋敷の重要な部屋を開ける鍵がなくなった。鍵を持つことができた人物は限られている。"
  },
  {
    title: "秘密の手紙",
    text: "被害者が隠していた重要な手紙が消えた。手紙を見た可能性がある人物がこの中にいる。"
  },
  {
    title: "なくなった宝石",
    text: "保管庫から宝石が一つなくなった。保管庫には傷跡があり、内部から開けられた可能性がある。"
  },
  {
    title: "消えた証拠品",
    text: "事件の証拠になる品物が突然消えた。誰かが意図的に隠した可能性がある。"
  },
  {
    title: "止まった時計",
    text: "屋敷の時計がある時刻で止まっていた。その時刻が事件の重要な手がかりになるらしい。"
  }
];

const victimSettings = [
  "被害者は事件直前、誰か一人と密かに話していた。",
  "被害者は事件の犯人を知っていた可能性がある。",
  "被害者は事件当日に重要な約束をしていた。",
  "被害者は誰かから脅迫を受けていた。",
  "被害者は事件の前日に秘密の場所へ行っていた。",
  "被害者は事件について調査していた。",
  "被害者はある人物を疑っていた。",
  "被害者は事件当日に重要な物を受け取っていた。"
];

const exposureCards = [
  "事件直前、現場の近くにいた。",
  "事件当日に被害者と話していた。",
  "事件現場の鍵を見たことがある。",
  "事件に使われた道具を知っている。",
  "事件の時間に一人だった。",
  "事件後すぐにその場を離れた。",
  "被害者の持ち物について詳しい。",
  "事件現場に入ったことを隠している。",
  "事件の時間を妙に正確に覚えている。",
  "事件直前に誰かと会っていた。",
  "被害者から何かを借りていた。",
  "事件後に荷物を確認していた。",
  "事件現場の構造をよく知っている。",
  "事件について誰にも話していないことがある。",
  "事件当日に予定を変更していた。",
  "事件後、誰かと連絡を取っていた。",
  "被害者と過去に揉めたことがある。",
  "事件現場に自分の痕跡が残っている。",
  "事件について聞かれると話題を変える。",
  "事件当日に不自然な行動をしていた。",
  "事件の証拠になりそうな物を持っていた。",
  "被害者の秘密を知っていた。",
  "事件前に現場を調べていた。",
  "事件後に何かを隠した。",
  "事件当日の行動に空白がある。",
  "被害者から重要な話を聞いていた。",
  "事件現場へ戻ったことがある。",
  "事件について別の人物と話していた。",
  "事件直前に怪しい物を持っていた。",
  "被害者に対して怒っていた。",
  "事件当日に秘密の用事があった。",
  "事件について最初から知っていたような反応をした。",
  "事件後に急いで帰ろうとした。",
  "事件現場の周辺にいた証拠がある。",
  "被害者から何かを隠していた。",
  "事件当日に誰かを尾行していた。",
  "事件に関係する場所へ行っていた。",
  "事件直後に誰かと二人きりだった。",
  "被害者の行動予定を知っていた。",
  "事件の証拠を見つけていた。",
  "事件について嘘をついている。",
  "事件前に誰かから物を受け取った。",
  "事件後に服装を変えた。",
  "事件現場の近くで目撃されている。",
  "被害者と秘密の約束をしていた。",
  "事件当日に財布や荷物を整理していた。",
  "事件について隠したい理由がある。",
  "事件前後の行動が不自然だった。"
];

const endings = [
  "犯人は意外な人物だった。証拠を積み重ねた結果、真相が明らかになった。",
  "犯人は最後まで疑われなかった人物だった。決定的な証拠が見つかった。",
  "事件には複数の秘密が絡んでいた。しかし最後には一つの真相へたどり着いた。",
  "全員の証言を整理すると、事件を起こせた人物は一人しかいなかった。",
  "最後の証拠によって、それまでの推理が大きく覆された。"
];


/* =========================
   共通
========================= */

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

function shuffle(array) {
  const a = [...array];

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}


/* =========================
   部屋作成
========================= */

createBtn.addEventListener("click", async () => {
  try {
    const name = nameInput.value.trim();

    if (!name) {
      alert("ニックネームを入力してください！");
      return;
    }

    let code = null;

    for (let i = 0; i < 10; i++) {
      const c = generateRoomCode();

      const snap = await get(
        ref(db, "rooms/" + c)
      );

      if (!snap.exists()) {
        code = c;
        break;
      }
    }

    if (!code) {
      alert("ルームを作れませんでした。");
      return;
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

    enterLobby();

  } catch (e) {
    console.error(e);
    alert("ルーム作成に失敗しました。");
  }
});


/* =========================
   参加
========================= */

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

    const snap = await get(
      ref(db, "rooms/" + code)
    );

    if (!snap.exists()) {
      alert("ルームがありません。");
      return;
    }

    const room = snap.val();

    if (room.status !== "lobby") {
      alert("ゲームはすでに始まっています。");
      return;
    }

    const players = room.players || {};

    if (Object.keys(players).length >= 6) {
      alert("満員です！");
      return;
    }

    myName = name;
    myRoom = code;
    isHost = false;

    await set(
      ref(db, "rooms/" + code + "/players/" + myId),
      {
        name: myName
      }
    );

    enterLobby();

  } catch (e) {
    console.error(e);
    alert("参加に失敗しました。");
  }
});


/* =========================
   ロビー
========================= */

function enterLobby() {
  showScreen(lobbyScreen);

  roomCodeElement.textContent = myRoom;

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

      const room = snapshot.val();

      renderPlayers(room.players || {});

      if (room.status === "game") {
        showGame(room);
      }

      if (room.status === "vote") {
        showVote(room);
      }

      if (room.status === "result") {
        showResult(room);
      }
    }
  );
}

function renderPlayers(players) {

  playerList.innerHTML = "";

  Object.entries(players).forEach(
    ([id, player], index) => {

      const div = document.createElement("div");

      div.className = "resultItem";

      div.textContent =
        (index === 0 ? "👑 " : "👤 ") +
        player.name +
        (id === myId ? "（あなた）" : "");

      playerList.appendChild(div);
    }
  );

  const count =
    Object.keys(players).length;

  if (isHost && count >= 3) {

    startBtn.classList.remove("hidden");

    lobbyMessage.textContent =
      count + "人参加中。ゲーム開始できます！";

  } else if (isHost) {

    startBtn.classList.add("hidden");

    lobbyMessage.textContent =
      "あと " +
      (3 - count) +
      "人必要です。";

  } else {

    startBtn.classList.add("hidden");

    lobbyMessage.textContent =
      "ホストがゲームを開始するまで待ってください。";
  }
}


/* =========================
   ゲーム開始
========================= */

startBtn.addEventListener("click", async () => {

  if (!isHost) return;

  try {

    const snap = await get(
      ref(db, "rooms/" + myRoom)
    );

    if (!snap.exists()) return;

    const room = snap.val();

    const playerIds =
      Object.keys(room.players || {});

    if (playerIds.length < 3) {
      alert("3人以上必要です！");
      return;
    }

    const selectedCase =
      cases[
        Math.floor(
          Math.random() * cases.length
        )
      ];

    const victimSetting =
      victimSettings[
        Math.floor(
          Math.random() * victimSettings.length
        )
      ];

    const ending =
      endings[
        Math.floor(
          Math.random() * endings.length
        )
      ];

    /*
     * キャラクターを重複なしで配る
     */
    const shuffledCharacters =
      shuffle(characters);

    const shuffledSettings =
      shuffle(characterSettings);

    const playerData = {};

    playerIds.forEach((id, index) => {

      playerData[id] = {

        character:
          shuffledCharacters[index][0],

        characterDescription:
          shuffledCharacters[index][1],

        secretSetting:
          shuffledSettings[index],

        /*
         * 暴露カード4枚。
         * 内容は本人にも表示しない。
         */
        cards:
          shuffle(exposureCards).slice(0, 4)
      };
    });


    /*
     * 館の主人
     * 最初はホスト
     */
    const hostId = room.hostId;

    /*
     * ホスト以外から最初の対象
     */
    const firstTarget =
      playerIds.find(
        id => id !== hostId
      );


    await update(
      ref(db, "rooms/" + myRoom),
      {

        status: "game",

        caseTitle:
          selectedCase.title,

        caseText:
          selectedCase.text,

        victimSetting:
          victimSetting,

        ending:
          ending,

        playerData:
          playerData,

        revealedCards: {},

        /*
         * 各ラウンドで暴露された人
         */
        exposedThisRound: {},

        round: 1,

        /*
         * 3人なら3ラウンド
         * 4～6人なら2ラウンド
         */
        maxRounds:
          playerIds.length === 3
            ? 3
            : 2,

        targetId:
          firstTarget,

        /*
         * 最初に対象を選ぶのは館の主人
         */
        selectorId:
          hostId,

        phase:
          "select",

        votes: {}
      }
    );

  } catch (e) {

    console.error(e);

    alert(
      "ゲーム開始に失敗しました。"
    );
  }
});


/* =========================
   ゲーム画面
========================= */

function showGame(room) {

  showScreen(gameScreen);

  const players =
    room.players || {};

  const target =
    players[room.targetId];

  roundText.textContent =
    "ROUND " +
    room.round +
    " / " +
    room.maxRounds;

  storyTitle.textContent =
    room.caseTitle;

  storyText.textContent =
    room.caseText;


  if (room.phase === "select") {

    turnText.textContent =
      "🎴 暴露する人を選ぶ";

  } else if (room.phase === "revealed") {

    turnText.textContent =
      "🎴 暴露カード公開";

  } else if (room.phase === "victim") {

    turnText.textContent =
      "🔎 被害者情報";

  } else {

    turnText.textContent = "";
  }


  actionArea.innerHTML = "";


  /* =====================
     被害者設定公開
  ===================== */

  if (room.phase === "victim") {

    const title =
      document.createElement("h2");

    title.textContent =
      "🔎 被害者の秘密";

    actionArea.appendChild(title);


    const box =
      document.createElement("div");

    box.className =
      "resultItem";

    box.textContent =
      room.victimSetting;

    actionArea.appendChild(box);


    if (isHost) {

      const button =
        document.createElement("button");

      button.className =
        "mainBtn";

      button.textContent =
        room.round >= room.maxRounds
          ? "🗳️ 最終投票へ"
          : "➡️ 次のラウンドへ";


      button.onclick =
        async () => {

          if (
            room.round >=
            room.maxRounds
          ) {

            await update(
              ref(db, "rooms/" + myRoom),
              {
                status: "vote"
              }
            );

          } else {

            const players =
              Object.keys(
                room.players || {}
              );

            const next =
              players.find(
                id =>
                  id !== room.hostId
              );

            await update(
              ref(db, "rooms/" + myRoom),
              {

                round:
                  room.round + 1,

                phase:
                  "select",

                exposedThisRound:
                  {},

                targetId:
                  next,

                selectorId:
                  room.hostId
              }
            );
          }
        };

      actionArea.appendChild(button);
    }

    return;
  }


  /* =====================
     公開済みカード
  ===================== */

  const revealedTitle =
    document.createElement("h3");

  revealedTitle.textContent =
    "公開された暴露カード";

  actionArea.appendChild(
    revealedTitle
  );


  const revealed =
    room.revealedCards || {};


  Object.values(revealed).forEach(
    data => {

      const box =
        document.createElement("div");

      box.className =
        "resultItem";

      box.innerHTML =
        "🎴 <strong>" +
        (players[data.playerId]?.name || "?") +
        "</strong><br>" +
        data.card;

      actionArea.appendChild(box);
    }
  );


  /* =====================
     カード公開済み
  ===================== */

  if (room.phase === "revealed") {

    const targetName =
      players[room.targetId]?.name ||
      "プレイヤー";


    const message =
      document.createElement("p");

    message.className =
      "message";

    message.textContent =
      "🎙️ " +
      targetName +
      "について通話で自由に推理してください。";

    actionArea.appendChild(message);


    /*
     * カードを公開された本人が
     * 次の人を選ぶ
     */
    if (myId === room.targetId) {

      const title =
        document.createElement("h3");

      title.textContent =
        "次に暴露する人を選ぶ";

      actionArea.appendChild(title);


      Object.entries(players).forEach(
        ([id, player]) => {

          if (
            id === myId ||
            room.exposedThisRound?.[id]
          ) {
            return;
          }


          const button =
            document.createElement("button");

          button.className =
            "voteBtn";

          button.textContent =
            "🎴 " + player.name;


          button.onclick =
            () => chooseNextTarget(
              id,
              room
            );


          actionArea.appendChild(button);
        }
      );
    }

    return;
  }


  /* =====================
     対象選択
  ===================== */

  if (room.phase === "select") {

    if (myId !== room.selectorId) {

      const message =
        document.createElement("p");

      message.className =
        "message";

      message.textContent =
        target
          ? "🎙️ " +
            players[room.selectorId]?.name +
            " が " +
            target.name +
            " を選択しています。"
          : "次の人を選択中……";

      actionArea.appendChild(message);

      return;
    }


    const title =
      document.createElement("h3");

    title.textContent =
      "🎭 暴露する人を選ぶ";

    actionArea.appendChild(title);


    Object.entries(players).forEach(
      ([id, player]) => {

        if (
          room.exposedThisRound?.[id]
        ) {
          return;
        }


        const button =
          document.createElement("button");

        button.className =
          "voteBtn";

        button.textContent =
          "👤 " + player.name;


        button.onclick =
          () => revealPlayer(id, room);


        actionArea.appendChild(button);
      }
    );
  }
}


/* =========================
   人物を選んでカード公開
========================= */

async function revealPlayer(
  playerId,
  room
) {

  if (myId !== room.selectorId) {
    return;
  }

  const data =
    room.playerData?.[playerId];

  if (!data || !data.cards?.length) {
    alert("カードがありません。");
    return;
  }


  /*
   * この人のまだ公開されていない
   * カードをランダムに1枚選ぶ
   */
  const used =
    Object.values(
      room.revealedCards || {}
    )
    .filter(
      x => x.playerId === playerId
    )
    .map(
      x => x.card
    );


  const remaining =
    data.cards.filter(
      card => !used.includes(card)
    );


  if (!remaining.length) {

    alert(
      "この人のカードはすべて公開済みです。"
    );

    return;
  }


  const card =
    remaining[
      Math.floor(
        Math.random() *
        remaining.length
      )
    ];


  const revealed =
    room.revealedCards || {};


  const revealId =
    playerId +
    "_" +
    Date.now();


  revealed[revealId] = {

    playerId:
      playerId,

    card:
      card
  };


  const exposed =
    room.exposedThisRound || {};


  exposed[playerId] = true;


  /*
   * 公開した人が次の人を選ぶ
   */
  await update(
    ref(db, "rooms/" + myRoom),
    {

      revealedCards:
        revealed,

      exposedThisRound:
        exposed,

      phase:
        "revealed",

      targetId:
        playerId,

      selectorId:
        playerId
    }
  );
}


/* =========================
   次の人を選択
========================= */

async function chooseNextTarget(
  targetId,
  room
) {

  if (myId !== room.targetId) {
    return;
  }


  const exposed =
    room.exposedThisRound || {};


  /*
   * ラウンド内で全員公開済み？
   */
  const playerIds =
    Object.keys(
      room.players || {}
    );


  const allExposed =
    playerIds.every(
      id => exposed[id]
    );


  if (allExposed) {

    await update(
      ref(db, "rooms/" + myRoom),
      {

        phase:
          "victim",

        targetId:
          null,

        selectorId:
          room.hostId
      }
    );

    return;
  }


  await update(
    ref(db, "rooms/" + myRoom),
    {

      targetId:
        targetId,

      selectorId:
        targetId,

      phase:
        "select"
    }
  );
}


/* =========================
   投票
========================= */

function showVote(room) {

  showScreen(voteScreen);

  voteList.innerHTML = "";

  voteMessage.textContent =
    "犯人だと思うプレイヤーに投票してください。";


  const players =
    room.players || {};


  Object.entries(players).forEach(
    ([id, player]) => {

      if (id === myId) return;


      const button =
        document.createElement("button");

      button.className =
        "voteBtn";

      button.textContent =
        "🗳️ " + player.name;


      if (
        room.votes?.[myId] === id
      ) {

        button.disabled = true;

        button.textContent +=
          " ✓";
      }


      button.onclick =
        () => submitVote(id);


      voteList.appendChild(button);
    }
  );
}


async function submitVote(targetId) {

  try {

    const snap =
      await get(
        ref(db, "rooms/" + myRoom)
      );

    if (!snap.exists()) return;

    const room =
      snap.val();

    const votes =
      room.votes || {};

    votes[myId] =
      targetId;


    await update(
      ref(db, "rooms/" + myRoom),
      {
        votes:
          votes
      }
    );


    voteMessage.textContent =
      "✅ 投票しました。";

    checkVotes();

  } catch (e) {

    console.error(e);

    alert("投票に失敗しました。");
  }
}


/* =========================
   全員投票確認
========================= */

async function checkVotes() {

  const snap =
    await get(
      ref(db, "rooms/" + myRoom)
    );

  if (!snap.exists()) return;

  const room =
    snap.val();


  const playerIds =
    Object.keys(
      room.players || {}
    );


  const votes =
    Object.keys(
      room.votes || {}
    );


  if (
    votes.length <
    playerIds.length
  ) {
    return;
  }


  const count = {};


  Object.values(
    room.votes || {}
  ).forEach(
    target => {

      count[target] =
        (count[target] || 0) + 1;
    }
  );


  let max = 0;

  Object.values(count)
    .forEach(
      value => {
        if (value > max) {
          max = value;
        }
      }
    );


  const winners =
    Object.entries(count)
      .filter(
        ([, value]) =>
          value === max
      )
      .map(
        ([id]) => id
      );


  await update(
    ref(db, "rooms/" + myRoom),
    {

      status:
        "result",

      votedIds:
        winners,

      maxVotes:
        max
    }
  );
}


/* =========================
   結果
========================= */

function showResult(room) {

  showScreen(resultScreen);

  const players =
    room.players || {};

  const votedIds =
    room.votedIds || [];


  let html =
    "<h3>🗳️ 投票結果</h3>";


  if (votedIds.length === 1) {

    const player =
      players[votedIds[0]];

    html +=
      `<div class="resultItem">
        最多票：
        <strong>${player?.name || "不明"}</strong><br>
        ${room.maxVotes}票
      </div>`;

  } else {

    html +=
      `<div class="resultItem">
        同率最多票！
      </div>`;


    votedIds.forEach(
      id => {

        html +=
          `<div class="resultItem">
            ${players[id]?.name || "不明"}
          </div>`;
      }
    );
  }


  html +=
    `<div class="resultItem">
      🎬 エンディング<br><br>
      ${room.ending || ""}
    </div>`;


  resultText.innerHTML =
    html;
}


/* =========================
   コピーボタン
========================= */

copyBtn.addEventListener(
  "click",
  async () => {

    try {

      await navigator.clipboard.writeText(
        myRoom
      );

      copyBtn.textContent =
        "✅ コピーしました！";

      setTimeout(
        () => {

          copyBtn.textContent =
            "📋 コードをコピー";

        },
        1500
      );

    } catch {

      alert(
        "ルームコード：" +
        myRoom
      );
    }
  }
);


/* =========================
   ホーム
========================= */

backHomeBtn.addEventListener(
  "click",
  () => {

    if (roomListener) {
      roomListener();
      roomListener = null;
    }

    myId =
      crypto.randomUUID();

    myName = "";
    myRoom = "";
    isHost = false;

    nameInput.value = "";
    roomInput.value = "";

    showScreen(homeScreen);
  }
);


/* =========================
   ルームコード入力
========================= */

roomInput.addEventListener(
  "input",
  () => {

    roomInput.value =
      roomInput.value
        .toUpperCase()
        .replace(
          /[^A-Z0-9]/g,
          ""
        );
  }
);


/* =========================
   Firebase接続確認
========================= */

onValue(
  ref(db, ".info/connected"),
  snapshot => {

    if (snapshot.val() === true) {

      homeMessage.textContent =
        "🟢 オンライン接続OK";

    } else {

      homeMessage.textContent =
        "🔴 接続中……";
    }
  }
);
