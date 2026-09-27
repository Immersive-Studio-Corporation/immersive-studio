export type NativeTrack = { title: string; artist: string; src: string | null };
// User-supplied recordings, archived with provenance in the marketing library.
// A null source keeps an unavailable recording silent, without a fallback.
export const nativeTracks = {
  heritage: {
    title: 'Hedwig’s Theme',
    artist: 'John Williams',
    src: '/audio/balanced-20260921/heritage.mp3',
  },
  onepiece: {
    title: 'One Piece',
    artist: 'One Piece',
    src: '/audio/balanced-20260921/onepiece.mp3',
  },
  teen: {
    title: 'Teen Wolf Main Title (Soundtrack Edit)',
    artist: 'Dino Meneghin',
    src: '/audio/balanced-20260921/teen.mp3',
  },
  nations: {
    title: 'Avatar: The Last Airbender — Theme',
    artist: 'Jeremy Zuckerman',
    src: '/audio/balanced-20260921/nations.mp3',
  },
  percy: {
    title: 'Percy Jackson: Sea of Monsters — Main Titles',
    artist: 'Andrew Lockington',
    src: '/audio/balanced-20260921/percy.mp3',
  },
  avengers: {
    title: 'Avengers',
    artist: 'Avengers',
    src: '/audio/balanced-20260921/avengers.mp3',
  },
  walkingdead: {
    title: 'The Walking Dead — Theme',
    artist: 'Bear McCreary',
    src: '/audio/balanced-20260921/walkingdead.mp3',
  },
  narnia: {
    title: 'Narnia',
    artist: 'Narnia',
    src: '/audio/balanced-20260921/narnia.mp3',
  },
} satisfies Record<string, NativeTrack>;
export type MusicProject = keyof typeof nativeTracks;
export type AudioScene = MusicProject | 'intro';
export const introTrack: NativeTrack = {
  title: 'Immersive Studio',
  artist: 'Immersive Studio',
  src: '/audio/balanced-20260921/intro.mp3',
};
export const isMusicProject = (id: string): id is MusicProject =>
  Object.hasOwn(nativeTracks, id);
export const isAudioScene = (id: string): id is AudioScene =>
  id === 'intro' || isMusicProject(id);
export const nativeTrackFor = (id: string) =>
  id === 'intro' ? introTrack : isMusicProject(id) ? nativeTracks[id] : null;
