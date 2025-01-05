import React, { useState, useEffect, useRef } from "react";
import "./AIAccessibility.css";

const AIAccessibility = () => {
  const [mode, setMode] = useState(null);
  const [content, setContent] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("en-US");
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // API Configuration
  const API_KEY = "AIzaSyCKhpM1JaW7YZlOyauvRLkBHobJqCUouwU";
  const TEXT_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
  const VISION_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent?key=${API_KEY}`;

  // Constants for video validation
  const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
  const SUPPORTED_FORMATS = ["video/mp4", "video/webm", "video/quicktime"];

  useEffect(() => {
    if (mode === "speech") {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices.length ? availableVoices : []);
      };

      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, [mode]);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const processWithAI = async (text) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(TEXT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Enhance this text: ${text}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("AI text processing failed");
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (err) {
      console.error("AI Processing Error:", err);
      return text;
    } finally {
      setIsLoading(false);
    }
  };

  const extractFrameFromVideo = async (videoFile) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.onloadeddata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.95
        );
      };

      video.onerror = reject;
      video.src = URL.createObjectURL(videoFile);
      video.load();
    });
  };

  const processVideoWithAI = async (videoFile) => {
    try {
      if (!SUPPORTED_FORMATS.includes(videoFile.type)) {
        setError("Unsupported video format. Please use MP4, WebM, or MOV.");
        return;
      }

      if (videoFile.size > MAX_VIDEO_SIZE) {
        setError("Video file is too large. Maximum size is 20MB.");
        return;
      }

      setIsProcessing(true);
      setError(null);

      const frameBlob = await extractFrameFromVideo(videoFile);
      const frameBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(frameBlob);
      });

      const response = await fetch(VISION_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Please analyze this video frame and describe what you see in detail:",
                },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: frameBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Video processing failed");
      }

      const data = await response.json();
      setContent(data.candidates[0].content.parts[0].text);
    } catch (err) {
      console.error("Video Processing Error:", err);
      setError("Failed to process video");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextToSpeech = async () => {
    if (!content.trim()) {
      setError("Please enter some text to convert to speech.");
      return;
    }

    try {
      const enhancedText = await processWithAI(content);
      const speech = new SpeechSynthesisUtterance(enhancedText);

      const selectedVoiceObj =
        voices.find((voice) => voice.lang === selectedVoice) || voices[0];

      if (selectedVoiceObj) {
        speech.voice = selectedVoiceObj;
      }

      speech.rate = 1;
      speech.pitch = 1;

      speech.onstart = () => setIsSpeaking(true);
      speech.onend = () => setIsSpeaking(false);
      speech.onerror = () => {
        setIsSpeaking(false);
        setError("Speech synthesis error");
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(speech);
    } catch (err) {
      console.error("Speech Error:", err);
      setError("Failed to convert text to speech");
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file.");
        return;
      }

      if (file.size > MAX_VIDEO_SIZE) {
        setError("Video file size should be less than 20MB.");
        return;
      }

      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setError(null);
      setContent("");
    }
  };

  const handleProcessVideo = async () => {
    if (!videoFile) {
      setError("Please upload a video first.");
      return;
    }
    await processVideoWithAI(videoFile);
  };

  const stopTextToSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleVoiceChange = (e) => {
    setSelectedVoice(e.target.value);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const startSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = selectedVoice;

    recognition.onstart = () => {
      setIsRecording(true);
      setError(null);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      const enhancedTranscript = await processWithAI(transcript);
      setContent(enhancedTranscript);
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      setError(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  if (!mode) {
    return (
      <div className="access-container">
        <div className="access-card mode-selection">
          <div className="access-header">
            <h1 className="access-title">Choose Mode</h1>
            <p className="access-subtitle">
              Select your preferred conversion mode
            </p>
          </div>
          <div className="access-content">
            <div className="mode-buttons">
              <button
                className="access-button mode-button"
                onClick={() => setMode("speech")}
              >
                Text to Speech
              </button>
              {/* <button
                className="access-button mode-button"
                onClick={() => setMode("video")}
              >
                Video to Text
              </button> */}
              <button
                className="access-button mode-button"
                onClick={() => setMode("audio")}
              >
                Speech to Text
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="access-container">
      <div className="access-card">
        <div className="access-header">
          <h1 className="access-title">
            {mode === "speech"
              ? "AI-Powered Text to Speech"
              : mode === "video"
              ? "Video to Text Converter"
              : "Speech to Text Converter"}
          </h1>
          <p className="access-subtitle">Powered by Google's Gemini AI</p>
        </div>

        <div className="access-content">
          {mode === "speech" ? (
            <div className="access-input-group">
              <textarea
                className="access-textarea"
                placeholder="Enter your text here... AI will enhance it for natural speech"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSpeaking}
              />

              {/* <select
                className="access-voice-select"
                value={selectedVoice}
                onChange={handleVoiceChange}
                disabled={isSpeaking}
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.lang}>
                    {`${voice.name} (${voice.lang})`}
                  </option>
                ))}
              </select> */}
            </div>
          ) : mode === "video" ? (
            <div className="access-video-container">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleVideoUpload}
                accept="video/*"
                className="access-file-input"
              />

              <div
                className="access-video-upload-area"
                onClick={triggerFileInput}
              >
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    className="access-video-preview"
                    controls
                  />
                ) : (
                  <div className="access-upload-placeholder">
                    <i className="upload-icon">📁</i>
                    <p>Click to upload video or drag and drop</p>
                    <p className="upload-hint">
                      Supported formats: MP4, WebM, MOV (max 20MB)
                    </p>
                  </div>
                )}
              </div>

              <textarea
                className="access-textarea"
                value={content}
                readOnly
                placeholder="Video analysis will appear here..."
              />
            </div>
          ) : (
            <div className="access-audio-container">
              <textarea
                className="access-textarea"
                value={content}
                readOnly
                placeholder="Speech recognition results will appear here..."
              />

              {/* <select
                className="access-voice-select"
                value={selectedVoice}
                onChange={handleVoiceChange}
                disabled={isRecording}
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.lang}>
                    {`${voice.name} (${voice.lang})`}
                  </option>
                ))}
              </select> */}
            </div>
          )}

          {error && (
            <div className="access-error">
              <p>{error}</p>
            </div>
          )}

          <div className="access-controls">
            {mode === "speech" ? (
              <>
                <button
                  className={`access-button ${
                    isSpeaking || isLoading ? "access-button-disabled" : ""
                  }`}
                  onClick={handleTextToSpeech}
                  disabled={isSpeaking || isLoading}
                >
                  {isLoading
                    ? "Enhancing text..."
                    : isSpeaking
                    ? "Speaking..."
                    : "Convert to Speech"}
                </button>

                {isSpeaking && (
                  <button
                    className="access-button access-button-stop"
                    onClick={stopTextToSpeech}
                  >
                    Stop Speaking
                  </button>
                )}
              </>
            ) : mode === "video" ? (
              <button
                className={`access-button ${
                  isProcessing ? "access-button-disabled" : ""
                }`}
                onClick={handleProcessVideo}
                disabled={isProcessing || !videoFile}
              >
                {isProcessing ? "Processing Video..." : "Analyze Video"}
              </button>
            ) : (
              <button
                className={`access-button ${
                  isRecording ? "access-button-disabled" : ""
                }`}
                onClick={startSpeechRecognition}
                disabled={isRecording}
              >
                {isRecording ? "Listening..." : "Start Speech Recognition"}
              </button>
            )}
          </div>

          <div className="access-footer">
            <button
              className="access-button access-button-back"
              onClick={() => setMode(null)}
            >
              Back to Mode Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAccessibility;
