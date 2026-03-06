# SSG Revert Point

If the SSG / ISR implementation causes issues and needs to be reverted, use this commit:

```
Commit SHA:  00af08e
Branch:      main
Message:     feat(admin): sidebar submenu fix, global search, docs page
```

## How to revert

```bash
# Option 1 — hard reset (discards SSG commits entirely)
git reset --hard 00af08e

# Option 2 — revert (creates a new commit undoing the changes, safer for shared branches)
git revert HEAD~<N>  # where N = number of SSG commits to undo
```

## What was in this commit

- Sidebar single-temp-submenu behavior
- Global search bar (Cmd+K) in AdminTopBar
- Static admin search index (`lib/admin-search-index.ts`)
- Full-page documentation at `/protected/docs`
- Documentation link in sidebar nav
- Get Started button on dashboard
- Dashboard section reorder: Quick Actions → Content → Services
