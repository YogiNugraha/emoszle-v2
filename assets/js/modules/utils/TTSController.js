export class TTSController {
    constructor(audioController) {
        this.audioController = audioController;
        this.synthesizer = window.speechSynthesis;
        this.indonesianVoice = null;
        this.isSpeaking = false;

        if (this.synthesizer) {
            this.synthesizer.onvoiceschanged = () => {
                const voices = this.synthesizer.getVoices();
                this.indonesianVoice = voices.find((v) => v.lang === "id-ID") || voices[0] || null;
            };
        }
    }

    speak(text) {
        if (!window.SpeechSynthesisUtterance || !text || this.isSpeaking) return;
        
        try {
            if (this.synthesizer.speaking) this.synthesizer.cancel();
        } catch (e) {}

        this.isSpeaking = true;
        
        if (this.audioController) {
            this.audioController.duckMusic();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        if (this.indonesianVoice) utterance.voice = this.indonesianVoice;
        
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 0.9;
        
        utterance.onend = () => {
            this.isSpeaking = false;
            if (this.audioController) {
                this.audioController.restoreMusic();
            }
        };

        try {
            this.synthesizer.speak(utterance);
        } catch (e) {
            this.isSpeaking = false;
            if (this.audioController) {
                this.audioController.restoreMusic();
            }
        }
    }
}
