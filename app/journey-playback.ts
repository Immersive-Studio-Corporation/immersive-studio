import type { AudioStatus, JourneyAudio } from './journey-music.ts';
import type { AudioScene } from './journey-tracks.ts';
import type { JourneyAudioFrame } from './journey-audio-frame.ts';

/** Sound is enabled at full volume, starting with the visible intro or project.
 * Resume runs inside normal visitor gestures when autoplay is restricted.
 */
export class JourneyPlayback {
  private enabled = true;
  private project: AudioScene | null = null;
  private frameRevision = 0;
  private ready = false;
  private unlocking = false;
  private hidden = false;
  private disposed = false;
  private attempt = 0;
  private player: Pick<
    JourneyAudio,
    'unlock' | 'select' | 'setPosition' | 'setHidden' | 'dispose'
  >;
  private status: (status: AudioStatus) => void;

  constructor(
    player: Pick<
      JourneyAudio,
      'unlock' | 'select' | 'setPosition' | 'setHidden' | 'dispose'
    >,
    status: (status: AudioStatus) => void,
  ) {
    this.player = player;
    this.status = status;
  }

  setFrame(frame: JourneyAudioFrame) {
    if (this.disposed) return;
    // World music has its own clock. Wheel position never seeks the recording.
    // The short intro alone may use its one-shot visual cue on first activation.
    this.player.setPosition(
      frame.id,
      frame.id === 'intro' ? frame.seconds : 0,
      false,
    );
    const replay = frame.revision !== this.frameRevision;
    this.frameRevision = frame.revision;
    if (replay) {
      void this.player.select(null);
      this.project = frame.id;
      this.sync();
    } else this.setProject(frame.id);
  }

  setProject(project: AudioScene | null) {
    if (this.disposed || this.project === project) return;
    this.project = project;
    this.sync();
  }

  setEnabled(enabled: boolean) {
    if (this.disposed) return;
    this.enabled = enabled;
    if (!enabled) {
      ++this.attempt;
      this.unlocking = false;
      void this.player.select(null);
    } else if (this.ready) this.sync();
    else this.resume(true);
  }

  interact() {
    // A normal gesture unlocks the latest visible scene at its latest position.
    this.resume(true);
  }

  setHidden(hidden: boolean) {
    this.hidden = hidden;
    void this.player.setHidden(hidden);
    if (!hidden) this.sync();
  }

  private sync() {
    if (this.disposed) return;
    if (!this.enabled || !this.project) {
      void this.player.select(null);
      return;
    }
    if (this.hidden) return;
    if (this.ready) void this.player.select(this.project);
    else this.resume(false);
  }

  private resume(gesture: boolean) {
    if (this.disposed || this.hidden || !this.enabled || this.ready) return;
    if (this.unlocking && !gesture) return;
    this.unlocking = true;
    const attempt = ++this.attempt;
    if (this.project) this.status('blocked');
    try {
      void this.player
        .unlock()
        .then(() => {
          if (this.disposed || attempt !== this.attempt) return;
          this.unlocking = false;
          this.ready = true;
          if (this.enabled && !this.hidden && this.project)
            void this.player.select(this.project);
        })
        .catch((error: unknown) => {
          if (this.disposed || attempt !== this.attempt) return;
          this.unlocking = false;
          this.status(
            error instanceof Error && error.name === 'NotAllowedError'
              ? 'blocked'
              : 'error',
          );
        });
    } catch {
      this.unlocking = false;
      this.status('error');
    }
  }

  dispose() {
    this.disposed = true;
    ++this.attempt;
    this.player.dispose();
  }
}
