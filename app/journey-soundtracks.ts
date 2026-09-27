/** Official label/artist uploads played through YouTube's visible player. */
export const officialSoundtracks = {
  heritage: {
    title: 'Hedwig’s Theme',
    artist: 'John Williams',
    videoId: 'pMHCp0sg7gg',
    publisher: 'WaterTower Music',
    edition: 'Harry Potter · Return to Hogwarts',
  },
  percy: {
    title: 'Sea of Monsters — Main Titles',
    artist: 'Andrew Lockington',
    videoId: 'FNOhYl1q0Zs',
    publisher: 'Sony Classical',
    edition: 'Percy Jackson · film de 2013',
  },
  teen: {
    title: 'Teen Wolf Main Title (Soundtrack Edit)',
    artist: 'Dino Meneghin',
    videoId: 'oZ0M8Wo3ikg',
    publisher: 'Sony Music Masterworks',
    edition: 'Teen Wolf · série originale',
  },
  nations: {
    title: 'Avatar: The Last Airbender',
    artist: 'Jeremy Zuckerman',
    videoId: 'zMrMDvW5MaM',
    publisher: 'Universal Music Group / Nickelodeon',
    edition: 'Book 1: Water · série animée',
  },
  avengers: {
    title: 'The Avengers',
    artist: 'Alan Silvestri',
    videoId: 'XNCQZ0wxphY',
    publisher: 'Marvel Music',
    edition: 'The Avengers · film de 2012',
  },
  last: {
    title: 'The Last of Us — Main Theme',
    artist: 'Gustavo Santaolalla',
    videoId: 'Pt1pOY3_W64',
    publisher: 'Sony Soundtracks',
    edition: 'The Last of Us · jeu vidéo',
  },
} as const;

export function soundtrackFor(id: string) {
  return Object.hasOwn(officialSoundtracks, id)
    ? officialSoundtracks[id as keyof typeof officialSoundtracks]
    : null;
}
export function soundtrackEmbed(videoId: string, origin: string) {
  const params = new URLSearchParams({
    autoplay: '1',
    playsinline: '1',
    controls: '1',
    rel: '0',
    loop: '1',
    playlist: videoId,
    origin,
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
}
