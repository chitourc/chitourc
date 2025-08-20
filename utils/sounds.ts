const soundUrls = {
  click: 'https://archive.org/download/mouse-click-sound-effect/mouse-click-sound-effect.mp3',
  correct: 'https://archive.org/download/duolingo-correct-sound-effect/Duolingo%20Correct%20Sound%20Effect.mp3',
  incorrect: 'https://archive.org/download/sound_67d4e77989005/sound_67d4e77989005.mp3',
  complete: 'https://archive.org/download/level-complete-sound-effect/level-complete-sound-effect.mp3',
};

type SoundName = keyof typeof soundUrls;

// Use a Record for better type safety
const audioCache: Record<SoundName, HTMLAudioElement> = {} as any;

const preloadSounds = () => {
    (Object.keys(soundUrls) as SoundName[]).forEach(key => {
        if (!audioCache[key]) {
            const audio = new Audio(soundUrls[key]);
            audio.preload = 'auto';
            audioCache[key] = audio;
        }
    });
};

export const playSound = (name: SoundName) => {
    const audio = audioCache[name];
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.error(`Error playing sound '${name}':`, e.message || e));
    } else {
        console.error(`Sound "${name}" not found or not preloaded.`);
    }
};

// Preload all sounds when this module is first imported.
preloadSounds();