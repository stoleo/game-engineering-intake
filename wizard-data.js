const STEPS = [
  { id: "start", title: "How this works", kind: "start" },
  { id: "identity", title: "Identity", fields: [
    ["name","Game name","text","The current name, even if working title.", true],
    ["pitch","One-sentence pitch as it exists today","textarea","Not the dream version. What can someone play or see now?", true],
    ["genre","Genre / subgenre","text","Be specific.", false],
    ["comps","Closest real comparables","textarea","2-4 live games, not vibes."],
    ["platforms","Platform(s)","text","Xbox, PC, mobile, etc."],
    ["session","Session pattern","textarea","Typical session length, sessions per week, solo / co-op / live."],
    ["buildState","Build state","select","concept|prototype|vertical slice|alpha|beta|live"],
    ["version","Build date / version","text",""]
  ]},
  { id: "intent", title: "Intent", fields: [
    ["player","Target player","textarea","Who actually plays this.", true],
    ["fantasy","Core fantasy","textarea","The feeling they came for.", true],
    ["pillar1","Pillar 1","text","A choice, not a compliment.", true],
    ["pillar2","Pillar 2","text","", true],
    ["pillar3","Pillar 3","text","", true],
    ["worseAt","Willing to be worse at","textarea","Name the tradeoff."],
    ["goal1","Product goal 1","text",""],
    ["goal2","Product goal 2","text",""],
    ["goal3","Product goal 3","text",""],
    ["dod","Definition of done","textarea",""]
  ]},
  { id: "constraints", title: "Constraints", fields: [
    ["team","Team size and roles","textarea",""],
    ["skills","Skills have vs need","textarea",""],
    ["timebox","Time box","text",""],
    ["locks","Budget / engine / platform lock","textarea",""],
    ["biz","Business model","text",""],
    ["cows","Sacred cows","textarea",""],
    ["cuts","Hard cuts already made","textarea",""],
    ["legal","Legal / brand / store / cert","textarea",""]
  ]},
  { id: "machine", title: "Current machine", fields: [
    ["coreLoop","Core loop in verbs","textarea","Player does X -> game responds Y -> player gets Z -> wants X again because", true, true],
    ["sessionLoop","Session loop","textarea","How a session starts, peaks, ends."],
    ["metaLoop","Meta / return loop","textarea","Why they open it tomorrow."],
    ["onboarding","Onboarding path","textarea","First launch to first I get it moment.", true],
    ["ttf","Time-to-fun","text",""],
    ["progress","Progression","textarea",""],
    ["economy","Economy / rewards","textarea",""],
    ["fail","Fail state / recovery","textarea",""],
    ["social","Multiplayer / social","textarea",""]
  ]},
  { id: "first", title: "First session", fields: [
    ["m01","Minute 0-1","textarea","Cold player. No designer in the room.", true],
    ["m15","Minute 1-5","textarea","", true],
    ["restFirst","Rest of first session","textarea",""],
    ["canDo","Reliably can do by the end","textarea",""],
    ["stuck","Where they get stuck","textarea","", true],
    ["bored","Where they get bored","textarea",""],
    ["thinks","What they think the game is about","textarea",""]
  ]},
  { id: "repeat", title: "Repeat sessions", fields: [
    ["session2","Second session","textarea",""],
    ["week1","Week 1","textarea",""],
    ["week4","Week 4","textarea",""],
    ["repeatFirst","Becomes repetitive first","textarea",""],
    ["ignored","Players ignore","textarea",""]
  ]},
  { id: "behaviour", title: "Player behaviour", fields: [
    ["observed","Observed behaviours","textarea","Only what you have seen. Otherwise Unknown.", true, true],
    ["quotes","Direct quotes","textarea",""],
    ["dropoff","Drop-off points","textarea",""],
    ["workarounds","Workarounds","textarea",""],
    ["praised","Praised unprompted","textarea",""],
    ["neverMention","Never mentioned","textarea",""],
    ["metrics","Metrics","textarea",""],
    ["footage","Footage / build notes","textarea",""]
  ]},
  { id: "problems", title: "Known problems", fields: [
    ["agreed","Agreed problems","textarea","", true],
    ["suspected","Suspected problems","textarea",""],
    ["tried","Fixes already tried","textarea",""],
    ["fights","Unresolved arguments","textarea",""]
  ]},
  { id: "production", title: "Production truth", fields: [
    ["playable","Actually playable today","textarea","", true],
    ["greybox","Greybox / placeholder","textarea",""],
    ["deckOnly","Only in the deck","textarea",""],
    ["contentGap","Content vs loop assumption","textarea",""],
    ["techRisk","Tech risks","textarea",""]
  ]},
  { id: "planning", title: "Planning bounds", fields: [
    ["threshold","Improvement threshold","select","Blockers only|Big wins|Meaningful refinement|Fine polish"],
    ["worthwhile","Minimum worthwhile outcome","textarea","What noticeable player or development result would justify the work?"],
    ["assessmentBudget","Assessment budget","text","Time, compute and spend cap. Unspecified means one focused read-only pass."],
    ["implementationScope","Implementation authorization and scope","textarea","Plan only by default. Record existing chat authorization; this form does not grant permission."],
    ["implementationBudget","Separate implementation budget","text","Time, compute, spend; include an explicit polish cap if selecting Fine polish."],
    ["maxActions","Maximum qualifying actions","text","Optional ceiling, never a quota. Zero qualifying actions is valid."],
    ["capacity","Capacity 2 / 4 / 12 weeks","textarea",""],
    ["sizeS","S means","text",""],
    ["sizeM","M means","text",""],
    ["sizeL","L means","text",""],
    ["sizeXL","XL means","text",""],
    ["unanswered","Unanswered question","textarea","", true]
  ]},
  { id: "files", title: "Files & notes", kind: "files" },
  { id: "generate", title: "Generate prompt", kind: "generate" }
];
