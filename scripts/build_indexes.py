from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
for name in ('projects','artefacts','sections'):
    names=sorted(p.stem for p in (root/'content'/name).glob('*.json'))
    (root/'data'/f'{name}-index.json').write_text(json.dumps(names,indent=2)+'\n')
