import { useState, useRef } from "react";
import { Mic, Square, Loader2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { publicEnv } from "@/lib/env";

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  onRecordingComplete?: (audioUrl: string) => void;
  className?: string;
}

const VoiceRecorder = ({ onTranscription, onRecordingComplete, className = "" }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        
        if (onRecordingComplete) {
          const audioUrl = URL.createObjectURL(blob);
          onRecordingComplete(audioUrl);
        }

        // Transcribe the audio
        await transcribeAudio(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone"
      });
    } catch (error) {
      console.error("Recording error:", error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const transcribeAudio = async (blob: Blob) => {
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');

      const response = await fetch(`${publicEnv.supabaseUrl}/functions/v1/transcribe-voice`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${publicEnv.supabasePublishableKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const { transcription } = await response.json();
      onTranscription(transcription);

      toast({
        title: "Transcription complete",
        description: "Your voice has been converted to text"
      });
    } catch (error) {
      console.error("Transcription error:", error);
      toast({
        title: "Transcription failed",
        description: "Please try again or type manually",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isProcessing) {
    return (
      <Button variant="outline" disabled className={`gap-2 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        Transcribing...
      </Button>
    );
  }

  if (isRecording) {
    return (
      <Button 
        variant="destructive" 
        onClick={stopRecording}
        className={`gap-2 ${className}`}
      >
        <Square className="w-4 h-4" />
        Stop ({formatTime(recordingTime)})
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      onClick={startRecording}
      className={`gap-2 ${className}`}
    >
      <Mic className="w-4 h-4" />
      Record Voice
    </Button>
  );
};

export default VoiceRecorder;
