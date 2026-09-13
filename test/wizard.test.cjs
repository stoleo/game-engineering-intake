const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = n => fs.readFileSync(path.join(__dirname, '..', n), 'utf8');
function setup(saved, failSave = false) {
  const elements = {};
  const ctx = vm.createContext({localStorage:{getItem:()=>saved,setItem:()=>{if(failSave)throw Error('quota')}},document:{getElementById:id=>elements[id]||={style:{},textContent:'',innerHTML:''}},navigator:{clipboard:{writeText:async()=>{throw Error('denied')}}},confirm:()=>true,console});
  vm.runInContext(read('wizard-data.js')+'\n'+read('prompt-data.js')+'\n'+read('wizard-app.js'),ctx);
  return {run:c=>vm.runInContext(c,ctx),elements};
}
test('defaults are Big wins and plan only',()=>{const {run}=setup();assert.equal(run('state.answers.threshold'),'Big wins');assert.equal(run('readiness().score'),0);assert.match(run('buildIntake()'),/no implementation authorized/)});
test('Unknown never inflates completeness, section status or meter',()=>{const {run,elements}=setup();run('STEPS.forEach(s=>(s.fields||[]).forEach(f=>state.answers[f[0]]="Unknown"));saveState()');assert.equal(run('readiness().score'),0);assert.equal(run('stepFilled(STEPS[1])'),false);assert.equal(elements.meter.style.width,'0%')});
test('known key field counts; whitespace and unknown variants do not',()=>{const {run}=setup();run('state.answers.name="Game";state.answers.pitch=" unknown ";state.answers.player=" "');assert.equal(run('readiness().score'),10)});
test('mark empty preserves existing answers',()=>{const {run}=setup();run('state.step=1;state.answers.name="Existing";markSectionUnknown()');assert.equal(run('state.answers.name'),'Existing');assert.equal(run('state.answers.pitch'),'Unknown')});
test('select Unknown stays visible',()=>{const {run}=setup();run('state.answers.buildState="Unknown"');assert.match(run('renderField(STEPS[1].fields.find(f=>f[0]==="buildState"))'),/<option selected>Unknown/)});
test('text enters both packets and image omissions are honest',async()=>{const {run}=setup();await run('ingestFiles([{name:"notes.md",size:8,text:async()=>"EVIDENCE"},{name:"shot.png",size:99}])');assert.match(run('buildIntake()'),/EVIDENCE/);assert.match(run('buildFullPacket()'),/EVIDENCE/);assert.match(run('buildIntake()'),/shot.png[\s\S]*Contents NOT included/)});
test('truncation is explicit and bounded',async()=>{const {run}=setup();await run('ingestFiles([{name:"long.txt",size:80001,text:async()=>"a".repeat(80001)}])');assert.equal(run('state.files[0].text.length'),80000);assert.match(run('buildIntake()'),/TRUNCATED.*80001/)});
test('oversized text is not read',async()=>{const {run}=setup();await run('ingestFiles([{name:"big.txt",size:3000000,text:()=>{throw Error("must not read")}}])');assert.match(run('state.files[0].note'),/exceeds 2 MiB/)});
test('binary, encoding errors and failed reads stay omitted',async()=>{const {run}=setup();await run('ingestFiles(["%PDF","PKarchive","a\\u0000b","\\ufffd"].map((s,i)=>({name:i+".txt",size:10,text:async()=>s})).concat([{name:"fail.txt",size:1,text:async()=>{throw Error("read")}}]))');assert.equal(run('state.files.every(f=>f.kind==="omitted" && /NOT included/.test(f.note))'),true)});
test('legacy attachments do not falsely claim inclusion',()=>{const {run}=setup(JSON.stringify({answers:{},files:[{name:'old.png',kind:'image',note:'Image attached locally.'},{name:'old.txt',kind:'text',text:'old text'}]}));assert.doesNotMatch(run('buildIntake()'),/Image attached locally/);assert.match(run('buildIntake()'),/completeness is unknown/);assert.match(run('buildIntake()'),/old text/)});
test('malformed saved state recovers and valid answers survive',()=>{for(const s of ['{','null','[]','{"answers":{"name":4},"files":{}}'])assert.equal(setup(s).run('readiness().score'),0);const {run}=setup('{"answers":{"name":"Kept"},"step":999,"files":[null]}');assert.equal(run('state.answers.name'),'Kept');assert.equal(run('state.step'),run('STEPS.length-1'))});
test('storage failure warns and export still works',()=>{const {run,elements}=setup(null,true);run('state.answers.name="Unsaved";saveState()');assert.match(elements.storageStatus.textContent,/export/);assert.match(run('buildIntake()'),/Unsaved/)});
test('user text and filenames are escaped in HTML',()=>{const {run,elements}=setup();run('state.files.push({name:"<img src=x>",kind:"omitted"});renderFiles();state.answers.name="<script>"');assert.doesNotMatch(elements.fileList.innerHTML,/<img/);assert.match(run('renderField(STEPS[1].fields[0])'),/&lt;script&gt;/)});
test('clipboard failure offers recovery',async()=>{const {run,elements}=setup();await run('copyFull()');assert.match(elements.copyStatus.textContent,/Copy unavailable/)});
test('remove file updates export and reset restores defaults',()=>{const {run}=setup();run('state.files.push({name:"test.txt",kind:"text",text:"REMOVE_ME"});removeFile(0)');assert.doesNotMatch(run('buildIntake()'),/REMOVE_ME/);run('state.answers.threshold="Fine polish";resetAll()');assert.equal(run('state.answers.threshold'),'Big wins')});
test('offline packet embeds exact protocol without fetch',()=>{const {run}=setup();assert.equal(run('partB()'),read('PROMPT.md'));assert.doesNotMatch(read('wizard-app.js'),/fetch\(/)});
test('all planning controls export and action quotas are removed',()=>{const {run}=setup();for(const key of ['threshold','worthwhile','assessmentBudget','implementationScope','implementationBudget','maxActions']){run(`state.answers.${key}="CUSTOM_${key}"`);assert.match(run('buildIntake()'),new RegExp('CUSTOM_'+key))}assert.doesNotMatch(read('PROMPT.md'),/3-7 items|bottleneck, 3 actions/)});
