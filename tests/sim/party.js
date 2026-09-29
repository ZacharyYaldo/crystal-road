// The requested party of a simulator run, in one canonical form shared by bot.js, batch.js, bounded.js and validate38.js.
// canonParty(undefined) is the explicit default value 'default' (the flag was not given: production decides the party).
// canonParty('Osric, aldric') is the ordered id list ['osric','aldric'] (front first): trimmed, lower case, order kept.
// Validation compares the canonical value exactly (partyKey), never a normalised or sorted form.
'use strict';
const DEFAULT='default';
function canonParty(v){
  if(v===undefined||v===null||v===false)return DEFAULT;
  if(v===DEFAULT)return DEFAULT;
  if(v===true)throw new Error('--party needs a comma separated list of hero ids');
  const ids=(Array.isArray(v)?v:String(v).split(',')).map(s=>String(s).trim().toLowerCase()).filter(Boolean);
  if(!ids.length)throw new Error('--party is empty');
  return ids;
}
function partyKey(v){return JSON.stringify(v===undefined?'(absent)':v);}
// problems with a requested list, checked before a run starts: known = the hero ids of the game, cap = the legal party size
function partyProblems(ids,known,cap){const why=[];if(ids===DEFAULT)return why;const bad=ids.filter(id=>!known.includes(id)),dup=ids.filter((id,i)=>ids.indexOf(id)!==i);
  if(bad.length)why.push('unknown '+[...new Set(bad)].join(','));if(dup.length)why.push('duplicate '+[...new Set(dup)].join(','));if(ids.length>cap)why.push('too many: '+ids.length+' heroes requested, the party holds '+cap);return why;}
// a lineup obeys a request when the requested heroes that were available stand at the front in the requested order
function lineupOk(requested,available,lineup){if(requested===DEFAULT)return true;if(!Array.isArray(requested)||!Array.isArray(available)||!Array.isArray(lineup))return false;
  if(available.some(id=>!requested.includes(id)))return false;const inOrder=requested.filter(id=>available.includes(id));if(JSON.stringify(inOrder)!==JSON.stringify(available))return false;
  return JSON.stringify(lineup.slice(0,available.length))===JSON.stringify(available);}
module.exports={DEFAULT,canonParty,partyKey,partyProblems,lineupOk};
