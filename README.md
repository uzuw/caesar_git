# Daniel Caesar shuffle badge

A tiny serverless function that returns an SVG "now playing" card,
randomly picking a Daniel Caesar track on every request.

## Deploy (Vercel, free)

1. Create a free account at https://vercel.com (sign in with GitHub — takes ~1 min).
2. Push this folder to a new GitHub repo (or use `vercel` CLI directly, see below).
3. From the Vercel dashboard: **Add New Project** → import that repo → **Deploy**.
   No config needed, Vercel auto-detects the `api/card.js` function.
4. Once deployed you'll get a URL like:
   `https://your-project-name.vercel.app/api/card`

### CLI alternative (no GitHub repo needed)
```
npm i -g vercel
cd daniel-caesar-badge
vercel deploy --prod
```
Follow the prompts (login, confirm project name). It'll print your live URL.

## Embed in your GitHub README

```markdown
![Now playing](https://your-project-name.vercel.app/api/card)
```

## Notes on the "reload" behavior

GitHub doesn't fetch README images fresh on every visitor — it proxies
them through its own image cache (Camo), which holds a cached copy for
a while before re-fetching. So the track will change periodically
rather than on literally every single page view. This is a GitHub-side
caching layer and can't be fully bypassed for static README images.

## Customizing the track list

Edit the `TRACKS` array in `api/card.js` — add, remove, or reorder
tracks/albums freely.
