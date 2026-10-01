"""Rank the pass 54 lineup batches (2x, --focus, seeds 81-85, four profiles) against the default party on the same seeds."""
import json, glob, os, statistics as st, math
ROOT = r'C:\Users\zyald\PycharmProjects\cr-build\tests\sim'
PROF = ['idleboost', 'light', 'casual', 'engaged']
def load(tag, seeds=range(81, 86)):
    out = {}
    for p in PROF:
        for s in seeds:
            f = os.path.join(ROOT, 'batch_out_' + tag, '%s_%d.json' % (p, s))
            if os.path.exists(f): out[(p, s)] = json.load(open(f))
    return out
def fmt(x):
    if x is None: return '-'
    for u, d in (('T', 1e12), ('B', 1e9), ('M', 1e6), ('K', 1e3)):
        if abs(x) >= d: return '%.2f%s' % (x / d, u)
    return '%.1f' % x
base = load('p54fx2')
names = {'A': 'hale,fitz,ash,sera', 'B': 'hale,ash,morrow,sera', 'C': 'hale,fitz,morrow,sera', 'D': 'hale,kit,ash,sera', 'E': 'hale,lark,ash,sera', 'F': 'hale,bram,ash,sera', 'G': 'hale,kit,lark,sera', 'H': 'hale,bram,lark,sera',
         'I': 'hale,fitz,kit,sera', 'J': 'hale,ash,kit,lark', 'K': 'bram,ash,kit,sera', 'L': 'hale,bram,morrow,sera', 'M': 'vex,morrow,ash,sera', 'N': 'hale,vex,lark,sera', 'O': 'hale,morrow,lark,sera', 'P': 'hale,morrow,kit,sera'}
def metrics(d):
    h = d.get('hourly') or [{}]
    ent = None
    for r in h:
        if r.get('zone') == 'The Endless Road': ent = r.get('h'); break
    return dict(power=h[-1].get('power'), wave=(d.get('endless') or {}).get('best') or 0, gold=d['final'].get('gold'), lv=d['final'].get('partyLv'), shat=d['final'].get('shatters'),
                defeats=d['final'].get('defeats'), endless=ent, asserts=1 if d.get('assertFail') else 0, s3=(d.get('firsts') or {}).get('shatter 3'), s6=(d.get('firsts') or {}).get('shatter 6'))
rows = []
for tag, runs in [('default', base)] + [(k, load('p54F_' + k)) for k in names]:
    ms = {k: metrics(v) for k, v in runs.items()}
    # paired log-ratio of power against the default party on the same (profile, seed)
    lr = [math.log(ms[k]['power'] / metrics(base[k])['power']) for k in ms if k in base and ms[k]['power'] and metrics(base[k])['power']]
    wr = [ms[k]['wave'] - metrics(base[k])['wave'] for k in ms if k in base]
    med = lambda key: st.median([m[key] for m in ms.values() if m[key] is not None]) if any(m[key] is not None for m in ms.values()) else None
    finals = sorted({','.join(v.get('partyActual') or []) for v in runs.values()})
    rows.append(dict(tag=tag, party=names.get(tag, 'hale,vex,morrow,sera (default)'), n=len(ms), asserts=sum(m['asserts'] for m in ms.values()), power=med('power'), wave=med('wave'), gold=med('gold'), lv=med('lv'),
                     shat=med('shat'), defeats=med('defeats'), endless=med('endless'), s6=med('s6'), xpower=math.exp(st.median(lr)) if lr else None, dwave=st.median(wr) if wr else None,
                     wins=sum(1 for x in lr if x > 0), finals=finals, byprof={p: st.median([m['power'] for (pp, s), m in ms.items() if pp == p and m['power']]) for p in PROF}))
rows.sort(key=lambda r: -(r['xpower'] or 0))
print('tag | party | n | asserts | power x default (paired median) | runs ahead | wave | d wave | power | gold | level | Shatters | S6 h | Endless h | defeats')
for r in rows:
    print(' | '.join([r['tag'], r['party'], str(r['n']), str(r['asserts']), '%.2f' % r['xpower'], '%d/%d' % (r['wins'], r['n']), fmt(r['wave']), '%+.0f' % r['dwave'], fmt(r['power']), fmt(r['gold']), fmt(r['lv']), fmt(r['shat']), fmt(r['s6']), fmt(r['endless']), fmt(r['defeats'])]))
print()
print('power at 96 h by profile (median of 5 seeds)')
for r in rows:
    print(r['tag'].ljust(8), ' '.join((p[:4] + ' ' + fmt(r['byprof'][p])).ljust(16) for p in PROF), '| final lineups:', ' ; '.join(r['finals'])[:120])
json.dump(rows, open(os.path.join(os.path.dirname(__file__), 'lineups.json'), 'w'), indent=1)
