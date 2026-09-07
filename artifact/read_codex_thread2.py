import json

path = r'C:/Users/jesse/.codex/sessions/2026/09/03/rollout-2026-09-03T21-08-35-01a069f5-dc21-7dd1-b45d-945d699e8d77.jsonl'
turns = []
with open(path, encoding='utf-8') as f:
    for line in f:
        try:
            d = json.loads(line)
        except Exception:
            continue
        if d.get('type') != 'response_item':
            continue
        p = d.get('payload', {})
        if p.get('type') == 'message':
            role = p.get('role')
            texts = [c.get('text', '') for c in p.get('content', []) if isinstance(c, dict)]
            turns.append((role, ' '.join(texts)))

print('TOTAL TURNS:', len(turns))
for i, (role, text) in enumerate(turns):
    if i < 46:
        continue
    print(f'== [{i}] {role.upper()} ==')
    print(text[:900])
    print()
