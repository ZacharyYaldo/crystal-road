// The requested party of a simulator run, in one canonical form shared by bot.js, batch.js, bounded.js and validate38.js.
// canonParty(undefined) is the explicit default value 'default' (the flag was not given: production decides the party).
// canonParty('Fitz, hale') is the ordered id list ['fitz','hale'] (front first): trimmed, lower case, order kept.
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
// A lineup is judged against facts the run records independently of the party code: the roster (who was recruited) and the recruit hours.
// The requested heroes that were recruited must stand at the front in the requested order, at the end of the run and at every recorded change.
// The run's own partyAvailable is checked against the same facts; it is never the source of truth.
const idOf=name=>String(name).trim().toLowerCase();
function recruitedIds(result){return (result.roster||[]).map(h=>idOf(h.name));}
function recruitHours(result){const m={},rec=result.recruits||{};for(const h of result.roster||[]){const t=rec[h.name];m[idOf(h.name)]=(t==null?0:Number(t));}return m;} /* a hero with no recruit record started the run */
function expectedFront(requested,ids){return requested.filter(id=>ids.includes(id));}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function lineupProblems(result,cap){const why=[],c=result.config||{},q=c.party;cap=cap||4;
  if(q===undefined){why.push('config.party missing');return why;}
  if(!same(result.partyRequested,q)||!same((result.model||{}).party,q))why.push('party in the result or the model differs from config.party');
  if(!Array.isArray(result.partyActual)||!Array.isArray(result.partyAvailable)||!Array.isArray(result.partyChanges)){why.push('party lineup not recorded');return why;}
  if(!Array.isArray(result.roster)||!result.roster.length){why.push('no roster recorded to judge the lineup against');return why;}
  const ids=recruitedIds(result);if(result.partyActual.length>cap)why.push('final party above the party size');if(result.partyActual.some(id=>!ids.includes(id)))why.push('final party holds a hero who was never recruited: '+result.partyActual.filter(id=>!ids.includes(id)).join(','));
  if(q===DEFAULT){if(result.partyAvailable.length||result.partyChanges.length)why.push('default party run records lineup changes');return why;}
  if(!Array.isArray(q)){why.push('config.party is neither the default nor a list');return why;}
  for(const w of partyProblems(q,q,cap))why.push('recorded request: '+w);
  const front=expectedFront(q,ids).slice(0,cap);
  if(!same(result.partyActual.slice(0,front.length),front))why.push('party lineup does not follow the request: recruited '+JSON.stringify(front)+' but the final party is '+JSON.stringify(result.partyActual));
  if(!same(result.partyAvailable,front))why.push('partyAvailable '+JSON.stringify(result.partyAvailable)+' is not the recruited part of the request '+JSON.stringify(front));
  const hrs=recruitHours(result);let last=-1;for(const x of result.partyChanges){if(!x||typeof x.h!=='number'||!Array.isArray(x.party)||!Array.isArray(x.available)){why.push('malformed lineup change');continue;}if(x.h<last)why.push('lineup changes out of time order');last=x.h;
    const must=q.filter(id=>id in hrs&&hrs[id]<x.h-0.011).slice(0,cap),may=q.filter(id=>id in hrs&&hrs[id]<=x.h+0.011).slice(0,cap);
    if(!same(expectedFront(q,x.available),x.available)||x.available.some(id=>!may.includes(id))||must.some(id=>!x.available.includes(id)))why.push('lineup change at '+x.h+' h: available '+JSON.stringify(x.available)+' does not match the recruit hours (recruited by then: '+JSON.stringify(must)+')');
    if(!same(x.party.slice(0,x.available.length),x.available)||x.party.length>cap||x.party.some(id=>!(id in hrs)||hrs[id]>x.h+0.011))why.push('lineup change at '+x.h+' h breaks the request or fields an unrecruited hero: '+JSON.stringify(x.party));}
  return why;}
module.exports={DEFAULT,canonParty,partyKey,partyProblems,recruitedIds,recruitHours,expectedFront,lineupProblems};
