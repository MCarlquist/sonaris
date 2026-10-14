import { Chord } from 'musictheoryjs';

export interface ChordEstimate {
    chord: string;
    start: number;
    end: number;
    score: number;
}


interface EssentiaVector<T> {
    size(): number;
    get(index: number): T;
    delete?: () => void;
}

interface EssentiaResult {
    chords_progression: EssentiaVector<string>;
    chords_strength: EssentiaVector<number>;
}

interface EssentiaInstance {
    arrayToVector(samples: Float32Array): EssentiaVector<number>;

    TonalExtractor(
        signal: EssentiaVector<number>,
        frameSize?: number,
        hopSize?: number,
        tuningFrequency?: number,
    ): EssentiaResult;

    shutdown?: () => void;
    delete?: () => void;
}

let essentialPromise: Promise<EssentiaInstance> | undefined;

async function getEssentia(): Promise<EssentiaInstance> {
    if (!essentialPromise) {
        essentialPromise = (async () => {
            const [core, wasmPackage] = await Promise.all([
                import('essentia.js/dist/essentia.js-core.es.js'),
                import('essentia.js/dist/essentia-wasm.es.js'),
            ]);

            return new core.default(wasmPackage.EssentiaWASM) as EssentiaInstance;
        })();
    }

    return essentialPromise;
}

function parseChord(symbol: string): string | null {
    const cleaned = symbol.trim();
    if (!cleaned || cleaned === 'N' || cleaned === 'X') {
        return null;
    }

    try {
        // MusicTheoryJS validates the chord symbol.
        return Chord.from(cleaned).toString();
    } catch {
        // Unknown symbols should not crash the whole analysis.
        return null;
    }
}

export async function analyzeAudioBuffer(
    audioBuffer: AudioBuffer,
): Promise<ChordEstimate[]> {
    const essentia = await getEssentia();

    // Mix stereo down to mono for this first prototype.
    const samples = new Float32Array(audioBuffer.length);
    const left = audioBuffer.getChannelData(0);

    if (audioBuffer.numberOfChannels === 1) {
        samples.set(left);
    } else {
        const right = audioBuffer.getChannelData(1);

        for (let i = 0; i < samples.length; i++) {
            samples[i] = (left[i] + right[i]) / 2;
        }
    }

    const sampleRate = audioBuffer.sampleRate;
    const hopSize = 2048;
    const secondsPerFrame = hopSize / sampleRate;
    const signal = essentia.arrayToVector(samples);

    try {
        const result = essentia.TonalExtractor(signal, 4096, hopSize, 440);
        const estimates: Array<ChordEstimate & { frameCount: number }> = [];
        const parsedChords = new Map<string, string | null>();

        try {
            const chordCount = result.chords_progression.size();
            const strengthCount = result.chords_strength.size();

            for (let index = 0; index < chordCount; index++) {
                const symbol = result.chords_progression.get(index);
                let chord = parsedChords.get(symbol);

                if (chord === undefined) {
                    chord = parseChord(symbol);
                    parsedChords.set(symbol, chord);
                }
                if (!chord) continue;

                const score = index < strengthCount
                    ? result.chords_strength.get(index)
                    : 0;
                const start = index * secondsPerFrame;
                const end = Math.min(audioBuffer.duration, start + secondsPerFrame);
                const previous = estimates[estimates.length - 1];

                if (previous?.chord === chord && Math.abs(previous.end - start) < secondsPerFrame) {
                    previous.score = (previous.score * previous.frameCount + score) / (previous.frameCount + 1);
                    previous.frameCount++;
                    previous.end = end;
                } else {
                    estimates.push({ chord, start, end, score, frameCount: 1 });
                }
            }
        } finally {
            result.chords_progression.delete?.();
            result.chords_strength.delete?.();
        }

        return estimates.map(({ frameCount: _frameCount, ...estimate }) => estimate);
    } finally {
        signal.delete?.();
    }
}


export async function analyzeRecordingUrl(
    audioUrl: string,
): Promise<ChordEstimate[]> {
    const response = await fetch(audioUrl);
    
    if (!response.ok) {
        throw new Error(`Could not load recording: ${response.status}`);
    }

    const audioData = await response.arrayBuffer();
    const audioContext = new AudioContext();
    

    try {
        const audioBuffer = await audioContext.decodeAudioData(audioData);
        return await analyzeAudioBuffer(audioBuffer);
    } finally {
        await audioContext.close();
    }
}