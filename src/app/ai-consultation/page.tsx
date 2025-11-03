"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, Mic, Globe, Volume2, VolumeX, ImagePlus, Camera, X } from "lucide-react"; 

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string; 
  timestamp: Date;
}

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'ha', name: 'Hausa' },
  { code: 'ig', name: 'Igbo' },
  { code: 'pcm', name: 'Pidgin' },
];

const GOOGLE_TRANSLATE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY || '';
if (!GOOGLE_TRANSLATE_API_KEY) {
  console.warn('Google Translate API key is not set. Translation will fallback to original text.');
}

export default function KushAIConsultation() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "🌿 Yo! I’m KushAI — your mellow guide. What’s on your mind today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [interim, setInterim] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(languages[0]);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const CONFIDENCE_THRESHOLD = 0.7;

  // Initialize Speech Recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = selectedLang.code;
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const confidence = result[0].confidence || 0;
          const transcript = result[0].transcript;
          if (result.isFinal) {
            if (confidence > CONFIDENCE_THRESHOLD) {
              finalTranscript += transcript;
            }
          } else {
            interimTranscript += transcript;
          }
        }
        if (finalTranscript) {
          setInput((prev) => prev + finalTranscript);
          setInterim('');
        }
        if (interimTranscript) {
          setInterim(interimTranscript);
        }
      };
      recognition.onend = () => {
        setIsListening(false);
        setInterim('');
      };
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setInterim('');
      };
      recognitionRef.current = recognition;
    }
  }, [selectedLang.code, CONFIDENCE_THRESHOLD]);

  // Speech Synthesis setup
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      synth.onvoiceschanged = () => {};
      synth.onend = () => setIsSpeaking(false);
      synth.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };
    }
  }, []);

  // Cleanup utterance on unmount
  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle gallery select via event listener
  const handleGallerySelect = useCallback((e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
    // Reset input value to allow re-selection of same file
    target.value = '';
  }, []);

  // Attach gallery listener
  useEffect(() => {
    const input = fileInputRef.current;
    if (!input) return;

    input.addEventListener('change', handleGallerySelect);
    return () => {
      input.removeEventListener('change', handleGallerySelect);
    };
  }, [handleGallerySelect]);

  // Handle camera capture via event listener
  const handleCameraCapture = useCallback((e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
    // Reset input value
    target.value = '';
  }, []);

  // Attach camera listener
  useEffect(() => {
    const input = cameraInputRef.current;
    if (!input) return;

    input.addEventListener('change', handleCameraCapture);
    return () => {
      input.removeEventListener('change', handleCameraCapture);
    };
  }, [handleCameraCapture]);

  // Clear image
  const clearImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }, []);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update recognition lang
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLang.code;
    }
  }, [selectedLang]);

  const getVoiceForLang = useCallback((lang: string): SpeechSynthesisVoice | null => {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    return voices.find(voice => voice.lang.startsWith(lang)) || voices.find(voice => voice.lang.startsWith('en')) || null;
  }, []);

  const speak = useCallback((text: string, lang: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    const voice = getVoiceForLang(lang);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utteranceRef.current = utterance;
    synth.speak(utterance);
    setIsSpeaking(true);
  }, [ttsEnabled, getVoiceForLang]);

  const toggleTts = useCallback(() => {
    setTtsEnabled((prev) => !prev);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [ttsEnabled, isSpeaking]);

  const addMessage = useCallback((role: Message["role"], content: string, image?: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      image,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  const translate = useCallback(async (text: string, from: string, to: string): Promise<string> => {
    if (!GOOGLE_TRANSLATE_API_KEY) {
      return text;
    }
    try {
      const response = await fetch('https://translation.googleapis.com/language/translate/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: from || 'auto',
          target: to,
          format: 'text',
        }),
      });
      if (!response.ok) throw new Error(`Translation API error: ${response.status}`);
      const data = await response.json();
      return data.data.translations[0].translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }, []);

  const toggleVoiceInput = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInput('');
      setInterim('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  }, [isListening]);

  const sendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const userContent = (input + interim).trim();
      if ((!userContent && !selectedImage) || isLoading) return;

      const userImageBase64 = selectedImage ? await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedImage);
      }) : undefined;

      setInput("");
      setInterim("");
      addMessage("user", userContent, userImageBase64);
      setSelectedImage(null);
      setImagePreview(null);
      setIsLoading(true);

      let toSend = userContent;
      if (selectedLang.code !== 'en' && userContent) {
        toSend = await translate(userContent, 'auto', 'en');
      }

      try {
        const body: any = { message: toSend };
        if (userImageBase64) {
          body.image = userImageBase64;
        }

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No readable stream");
        }

        const decoder = new TextDecoder();
        const aiMessage = addMessage("assistant", "");
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          setMessages((prev) =>
            prev.map((msg, idx) =>
              idx === prev.length - 1 ? { ...msg, content: fullContent } : msg
            )
          );
        }

        let finalResponse = fullContent;
        if (selectedLang.code !== 'en') {
          finalResponse = await translate(fullContent, 'en', selectedLang.code);
        }

        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1 ? { ...msg, content: finalResponse } : msg
          )
        );

        speak(finalResponse, selectedLang.code);
      } catch (error) {
        console.error("Chat error:", error);
        let errorMsg = "Sorry, something went wrong. Let's try that again? 🌿";
        if (selectedLang.code !== 'en') {
          errorMsg = await translate(errorMsg, 'en', selectedLang.code);
        }
        const errorMessage = addMessage("assistant", errorMsg);
        setMessages((prev) => {
          const withoutEmpty = prev.slice(0, -1);
          return [...withoutEmpty, errorMessage];
        });
        speak(errorMsg, selectedLang.code);
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [input, interim, isLoading, selectedLang, addMessage, translate, speak, selectedImage]
  );

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "🌿 Fresh start! What’s on your mind now?",
        timestamp: new Date(),
      },
    ]);
    setInput("");
    setInterim("");
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    inputRef.current?.focus();
    if (ttsEnabled) {
      speak("Fresh start! What’s on your mind now?", selectedLang.code);
    }
  }, [ttsEnabled, selectedLang.code, speak]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const currentInput = input + interim;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-black to-zinc-900 text-white flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Subtle background animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.3),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.3),transparent_50%)]"></div>
      </div>

      <div className="max-w-md sm:max-w-2xl w-full bg-zinc-800/60 backdrop-blur-xl rounded-3xl shadow-2xl p-4 sm:p-6 border border-zinc-600/50 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-base sm:text-lg">🍃</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-green-400">KushAI Consultation</h1>
              <p className="text-zinc-400 text-xs sm:text-sm">Your chill AI companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTts}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors flex items-center justify-center ${
                ttsEnabled
                  ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                  : 'bg-zinc-700/70 hover:bg-zinc-600/70 text-zinc-400'
              }`}
              aria-label={ttsEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
              title={ttsEnabled ? "Disable TTS" : "Enable TTS"}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <select
              value={selectedLang.code}
              onChange={(e) => setSelectedLang(languages.find(l => l.code === e.target.value) || languages[0])}
              className="bg-zinc-700/70 text-white rounded-xl px-3 py-1.5 sm:py-2 text-sm outline-none border border-zinc-600/50 focus:border-green-500/50"
              aria-label="Select language"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <button
              onClick={clearChat}
              className="text-zinc-400 hover:text-white transition-colors px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm hover:bg-zinc-700/50"
              aria-label="Clear chat"
            >
              Clear
            </button>
          </div>
        </div>

        {/* TTS Status Indicator */}
        {isSpeaking && (
          <div className="flex items-center justify-center mb-2 gap-2 text-sm text-green-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Speaking...</span>
          </div>
        )}

        {/* Messages Container */}
        <div
          className="h-[50vh] sm:h-[60vh] overflow-y-auto mb-4 sm:mb-6 space-y-3 sm:space-y-4 pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-900"
          aria-live="polite"
          role="log"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "assistant" ? "flex-row" : "flex-row-reverse"} gap-2 sm:gap-3`}
            >
              {msg.role === "assistant" && (
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <span className="text-xs sm:text-sm">🍃</span>
                  </div>
                  <button
                    onClick={() => speak(msg.content, selectedLang.code)}
                    className="p-1 rounded-full bg-green-500/30 hover:bg-green-500/50 transition-colors text-green-300"
                    aria-label="Replay message"
                    title="Replay"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 sm:p-4 rounded-2xl ${msg.role === "assistant"
                  ? "bg-gradient-to-r from-green-800/40 to-emerald-900/40 border border-green-500/20"
                  : "bg-zinc-700/60 border border-zinc-600/30"
                } shadow-md`}
              >
                {msg.image && (
                  <div className="mb-2">
                    <img
                      src={msg.image}
                      alt="Uploaded image"
                      className="w-full max-w-xs rounded-lg object-cover"
                    />
                  </div>
                )}
                <p className="whitespace-pre-wrap text-sm sm:text-base">{msg.content}</p>
                <span className="text-xs text-zinc-500 mt-1 sm:mt-2 block">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              {msg.role === "user" && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs sm:text-sm">👤</span>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-row gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 animate-pulse">
                <span className="text-xs sm:text-sm">🍃</span>
              </div>
              <div className="bg-gradient-to-r from-green-800/40 to-emerald-900/40 border border-green-500/20 p-3 sm:p-4 rounded-2xl shadow-md flex items-center">
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 animate-spin mr-2" />
                <span className="text-green-300 text-sm sm:text-base">KushAI is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="flex flex-col sm:flex-row gap-2 sm:gap-3" role="search">
          <div className="flex flex-1 gap-1 sm:gap-2">
            {/* Image Preview */}
            {imagePreview && (
              <div className="relative flex-1 bg-zinc-700/50 rounded-2xl overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-24 object-cover" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full text-white hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {/* Text Input */}
            <div className="flex flex-1 gap-1 sm:gap-2 relative">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-zinc-700/70 backdrop-blur-sm rounded-2xl px-3 sm:px-5 py-2 sm:py-3 outline-none text-white placeholder-zinc-400 border border-zinc-600/50 focus:border-green-500/50 transition-colors text-sm sm:text-base pr-12"
                placeholder={`Share your thoughts in ${selectedLang.name}... 🌿`}
                value={currentInput}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                aria-label="Type your message"
                autoComplete="off"
              />
              {interim && !imagePreview && (
                <div className="absolute inset-0 pointer-events-none flex items-center pl-3 sm:pl-5 text-zinc-500 text-sm italic">
                  {interim}
                </div>
              )}
              <button
                type="button"
                onClick={toggleVoiceInput}
                disabled={isLoading}
                className={`p-2 sm:p-3 rounded-2xl transition-colors flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-zinc-700/70 hover:bg-zinc-600/70 text-zinc-400 hover:text-white'
                } disabled:opacity-50`}
                aria-label={isListening ? "Stop voice input" : "Start voice input"}
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            {/* Gallery Upload Button */}
            <label className="flex items-center justify-center p-2 sm:p-3 bg-zinc-700/70 hover:bg-zinc-600/70 rounded-2xl text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50" htmlFor="gallery-upload">
              <ImagePlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <input
                id="gallery-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isLoading}
              />
            </label>
            {/* Camera Capture Button */}
            <label className="flex items-center justify-center p-2 sm:p-3 bg-zinc-700/70 hover:bg-zinc-600/70 rounded-2xl text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50" htmlFor="camera-capture">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              <input
                id="camera-capture"
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                disabled={isLoading}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading || (!currentInput.trim() && !selectedImage)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-2xl px-4 sm:px-6 py-2 sm:py-3 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:from-gray-500 disabled:to-gray-600 min-w-[44px] sm:min-w-0"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </form>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #18181b;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #52525b;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}