// Validate a candidate 13x13 grid pattern and test whether it fills from the bank.
//   node scripts/check-grid.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const __dirname = dirname(fileURLToPath(import.meta.url));
const BANK_DIR = join(__dirname, '..', 'src', 'data', 'bank');
const SIZE = 13, MAX_RUN = 9;

// Candidate patterns ('#'=block). Edit these and re-run.
const PATTERNS = {
  base: [
    '#.....#.....#',
    '.#.#.#.#.#.#.',
    '...#.....#...',
    '.#.#.#.#.#.#.',
    '..#.......#..',
    '.#.#.#.#.#.#.',
    '#.....#.....#',
    '.#.#.#.#.#.#.',
    '..#.......#..',
    '.#.#.#.#.#.#.',
    '...#.....#...',
    '.#.#.#.#.#.#.',
    '#.....#.....#',
  ],
};

function mulberry32(seed){let a=seed>>>0;return function(){a|=0;a=(a+0x6d2b79f5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
function shuffle(arr,rng){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const range=(n)=>Array.from({length:n},(_,i)=>i);
function toBlack(rows){return rows.map(r=>r.split('').map(ch=>ch==='#'));}
function symmetric(b){for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++)if(b[r][c]!==b[SIZE-1-r][SIZE-1-c])return false;return true;}
function lineRuns(b,isRow,idx){const runs=[];let len=0;for(let k=0;k<=SIZE;k++){const w=k<SIZE&&!(isRow?b[idx][k]:b[k][idx]);if(w)len++;else{if(len)runs.push(len);len=0;}}return runs;}
function runsOk(b){for(let r=0;r<SIZE;r++)for(const L of lineRuns(b,true,r))if(L===2||L>MAX_RUN)return false;for(let c=0;c<SIZE;c++)for(const L of lineRuns(b,false,c))if(L===2||L>MAX_RUN)return false;return true;}
function slots(b){const s=[];for(let r=0;r<SIZE;r++){let c=0;while(c<SIZE){if(b[r][c]){c++;continue;}const st=c;while(c<SIZE&&!b[r][c])c++;if(c-st>=3)s.push({dir:'across',r,c:st,len:c-st,cells:range(c-st).map(i=>[r,st+i])});}}for(let c=0;c<SIZE;c++){let r=0;while(r<SIZE){if(b[r][c]){r++;continue;}const st=r;while(r<SIZE&&!b[r][c])r++;if(r-st>=3)s.push({dir:'down',r:st,c,len:r-st,cells:range(r-st).map(i=>[st+i,c])});}}return s;}
function cover(b,sl){const cov=Array.from({length:SIZE},()=>Array(SIZE).fill(false));for(const s of sl)for(const[r,c]of s.cells)cov[r][c]=true;for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++)if(!b[r][c]&&!cov[r][c])return false;return true;}
function connected(b){const w=[];for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++)if(!b[r][c])w.push([r,c]);const seen=new Set();const key=(r,c)=>r*SIZE+c;const st=[w[0]];seen.add(key(...w[0]));while(st.length){const[r,c]=st.pop();for(const[dr,dc]of[[1,0],[-1,0],[0,1],[0,-1]]){const nr=r+dr,nc=c+dc;if(nr<0||nc<0||nr>=SIZE||nc>=SIZE||b[nr][nc]||seen.has(key(nr,nc)))continue;seen.add(key(nr,nc));st.push([nr,nc]);}}return seen.size===w.length;}

function loadBank(){const files=readdirSync(BANK_DIR).filter(f=>/^part-[a-z]\.json$/.test(f));const byLen=new Map();for(const f of files)for(const e of JSON.parse(readFileSync(join(BANK_DIR,f),'utf8'))){const a=e.answer.toUpperCase().replace(/[^A-Z]/g,'');if(!byLen.has(a.length))byLen.set(a.length,[]);byLen.get(a.length).push(a);}return byLen;}
function tryFill(sl,byLen,rng){const letters=Array.from({length:SIZE},()=>Array(SIZE).fill(null));const used=new Set();const order=sl.slice();let bt=0;
 function cands(slot){const pool=byLen.get(slot.len)||[];const out=[];for(const w of pool){if(used.has(w))continue;let ok=true;for(let i=0;i<slot.len;i++){const[r,c]=slot.cells[i];if(letters[r][c]&&letters[r][c]!==w[i]){ok=false;break;}}if(ok)out.push(w);}return out;}
 function solve(idx){if(bt>200000)return false;if(idx>=order.length)return true;let best=idx,bc=null,bn=1e9;for(let k=idx;k<order.length;k++){const c=cands(order[k]);if(c.length<bn){bn=c.length;best=k;bc=c;if(!c.length)break;}}[order[idx],order[best]]=[order[best],order[idx]];const slot=order[idx];const cs=(best===idx&&bc)?bc:cands(slot);if(!cs.length){bt++;return false;}for(const w of shuffle(cs,rng)){const set=[];for(let i=0;i<slot.len;i++){const[r,c]=slot.cells[i];if(!letters[r][c]){letters[r][c]=w[i];set.push([r,c]);}}used.add(w);if(solve(idx+1))return true;for(const[r,c]of set)letters[r][c]=null;used.delete(w);bt++;}return false;}
 return solve(0)?{bt}:null;}

const byLen=loadBank();
for(const[name,rows]of Object.entries(PATTERNS)){
  const b=toBlack(rows);
  const sl=slots(b);
  const lens={};for(const s of sl)lens[s.len]=(lens[s.len]||0)+1;
  console.log(`\n[${name}] symmetric=${symmetric(b)} runsOk=${runsOk(b)} cover=${cover(b,sl)} connected=${connected(b)} entries=${sl.length} lenDist=${JSON.stringify(lens)} black=${b.flat().filter(Boolean).length}`);
  if(symmetric(b)&&runsOk(b)&&cover(b,sl)&&connected(b)){
    let ok=0;for(let s=1;s<=20;s++)if(tryFill(sl,byLen,mulberry32(s*97)))ok++;
    console.log(`  fill success: ${ok}/20 seeds`);
  }
}
