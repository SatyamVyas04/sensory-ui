# sensory-ui Sound Files

Place your `.mp3` audio files here, matching the paths below exactly.
All files are served by Next.js as static assets — no configuration needed.

## Expected file tree

```
public/sounds/
  activation/
    primary.mp3       ← main click / confirm action
    subtle.mp3        ← secondary / soft tap
    confirm.mp3       ← form submit / success action
    error.mp3         ← destructive / failure
  navigation/
    forward.mp3       ← move forward / next step
    backward.mp3      ← go back / previous step
    switch.mp3        ← tab / view switch
    scroll.mp3        ← scroll snap / page jump
  notifications/
    passive.mp3       ← low-priority informational
    important.mp3     ← high-priority alert
    success.mp3       ← operation succeeded
    warning.mp3       ← caution / warning state
  system/
    open.mp3          ← dialog / menu / dropdown opens
    close.mp3         ← dialog / menu / dropdown closes
    expand.mp3        ← accordion / section expands
    collapse.mp3      ← accordion / section collapses
    focus.mp3         ← focus ring / keyboard navigation lands
  hero/
    complete.mp3      ← major milestone (onboarding done, etc.)
    milestone.mp3     ← step completion in a long flow
  custom/             ← your own files; never touched by sensory-ui
```

## Where to get free UI sounds

| Source                                                   | Notes                                                                  |
| -------------------------------------------------------- | ---------------------------------------------------------------------- |
| [Freesound.org](https://freesound.org)                   | Search "UI click", "interface", "notification" — filter by CC0 licence |
| [Mixkit](https://mixkit.co/free-sound-effects/ui/)       | Ready-made UI pack, free for commercial use                            |
| [Zapsplat](https://www.zapsplat.com)                     | Free with account; huge UI/UX category                                 |
| [UI Sounds by Kenney](https://kenney.nl/assets/ui-audio) | CC0, compact pack, good for defaults                                   |

## Tips

- Keep files **short**: 50–300 ms for activation/system, up to 1 s for hero sounds.
- Keep files **quiet at source**: the engine applies its own volume multiplier (0.35 by default).
- **MP3 at 128 kbps** is plenty — the files are tiny and decoded into memory.
- Name them exactly as shown — the registry in `components/ui/sensory-ui/registry.ts` maps
  every SoundRole to these exact paths.
