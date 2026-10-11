import type { Recording } from "@/types/recording";
import { supabase } from "@/lib/supabase";

export async function getRecordings(): Promise<Recording[]> {
    const { data, error } = await supabase
        .from('recordings')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        throw error
    }

    const recordingsWithUrls = await Promise.all(
        data.map(async (recording) => ({
            id: recording.id,
            title: recording.title,
            audioUrl: await getAudioUrl(recording.audio_path),
            duration: recording.duration,
            createdAt: new Date(recording.created_at),
        })),
    )

    return recordingsWithUrls
}

export async function saveRecording(blob: Blob, title: string, duration: number): Promise<Recording> {
    const id = crypto.randomUUID();
    const audioPath = `recordings/${id}.webm`;

    const { error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(audioPath, blob, {
            contentType: blob.type,
            upsert: false,
        })

    if (uploadError) {
        throw uploadError
    }

    const { error: insertError } = await supabase
        .from('recordings')
        .insert({
            id,
            title,
            duration,
            audio_path: audioPath,
        })

    if (insertError) {
        await supabase.storage
            .from('recordings')
            .remove([audioPath])

        throw insertError
    }

    const audioUrl = await getAudioUrl(audioPath);

    return {
        id,
        title,
        audioUrl,
        duration,
        createdAt: new Date(),
    }
}

async function getAudioUrl(path: string): Promise<string> {
    const { data, error } = await supabase.storage
        .from('recordings')
        .createSignedUrl(path, 60 * 60)

    if (error) {
        throw error;
    }

    return data.signedUrl;
}