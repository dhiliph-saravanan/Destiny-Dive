import React, { useState, useRef, useEffect } from "react";
import "../CSS/Chatbot.css";

const sanitizeText = (text) => {
  if (!text) return "";
  return text.replace(/[\x00-\x1F\x7F]/g, '').replace(/\ufffd/g, '');
};

const ChatMessage = ({ message, addReaction, deleteMessage, sendMessage, isStreaming }) => {
  const { id, text, type, timestamp, reaction, suggestions } = message;
  const isBot = type === "bot";
  const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`ddcb-message-wrapper ${isBot ? 'ddcb-bot-wrapper' : 'ddcb-user-wrapper'}`}>
      {isBot && <div className="ddcb-avatar ddcb-bot-avatar">🤖</div>}
      <div className={`ddcb-message ${isBot ? 'ddcb-bot-message' : 'ddcb-user-message'}`}>
        <div className="ddcb-message-content">
          {sanitizeText(text)}
          {isBot && isStreaming && <span className="ddcb-blinking-cursor">|</span>}
        </div>
        {suggestions && suggestions.length > 0 && (
          <div className="ddcb-suggestions">
            {suggestions.map((sug, i) => (
              <button key={i} className="ddcb-suggestion-btn" onClick={() => sendMessage(sug)}>
                {sanitizeText(sug)}
              </button>
            ))}
          </div>
        )}
        <div className="ddcb-message-footer">
          <span className="ddcb-timestamp">{formattedTime}</span>
          <div className="ddcb-message-actions">
            {type === "user" && (
              <button className="ddcb-delete-button" onClick={() => deleteMessage(id)}>
                🗑️
              </button>
            )}
            <button
              className={`ddcb-reaction-button ${reaction ? 'ddcb-selected' : ''}`}
              onClick={() => addReaction(id, reaction ? null : '👍')}
            >
              {reaction || '👍'}
            </button>
          </div>
        </div>
      </div>
      {!isBot && <div className="ddcb-avatar ddcb-user-avatar">👤</div>}
    </div>
  );
};

const ChatHeader = ({ toggleChatbot, minimizeChatbot, clearChat }) => {
  return (
    <div className="ddcb-chatbot-header">
      <h2>🚀 Career Buddy</h2>
      <div className="ddcb-header-buttons">
        <button className="ddcb-clear-button" onClick={clearChat}>🗑️</button>
        <button className="ddcb-minimize-button" onClick={minimizeChatbot}>−</button>
        <button className="ddcb-close-button" onClick={toggleChatbot}>×</button>
      </div>
    </div>
  );
};

const ChatInput = ({ input, setInput, sendMessage, isLoading, isListening, startVoiceInput, stopVoiceInput }) => {
  return (
    <div className="ddcb-input-box">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
        placeholder="Ask away! 🌟"
        disabled={isLoading}
        className="ddcb-chat-input"
      />
      <button
        className={`ddcb-voice-btn ${isListening ? 'ddcb-active' : ''}`}
        onClick={isListening ? stopVoiceInput : startVoiceInput}
      >
        🎙️
      </button>
      <button onClick={sendMessage} disabled={isLoading} className="ddcb-send-button">
        ➤
      </button>
    </div>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const chatBoxRef = useRef(null);
  const abortControllerRef = useRef(null);
  const userId = "user123";
  const messageIds = useRef(new Set());

  useEffect(() => {
    if (chatBoxRef.current && !isMinimized) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) fetchHistory();
  }, [isOpen, isMinimized]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const toggleChatbot = () => setIsOpen(false);
  const minimizeChatbot = () => setIsMinimized(!isMinimized);

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:5044/get_chat_history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();
      messageIds.current.clear();
      const historyMessages = data.history.map((msg) => {
        const id = new Date().getTime() + Math.random();
        messageIds.current.add(id);
        return {
          id,
          text: sanitizeText(msg.content),
          type: msg.role,
          timestamp: new Date(),
          reaction: null,
          suggestions: msg.role === "assistant" ? [] : null,
        };
      });
      if (historyMessages.length === 0) {
        const welcomeId = new Date().getTime();
        messageIds.current.add(welcomeId);
        const welcomeMessage = {
          id: welcomeId,
          text: "Hey! I'm your Career Buddy, ready to guide you! 🚀 What's up?",
          type: "bot",
          timestamp: new Date(),
          reaction: null,
          suggestions: ["📚 Top colleges?", "🎯 Best course?", "🚀 Career tips?"],
        };
        setMessages([welcomeMessage]);
      } else {
        setMessages(historyMessages);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      const errorId = new Date().getTime();
      messageIds.current.add(errorId);
      setMessages((prev) => [
        ...prev,
        { id: errorId, text: "Oops, history didn’t load! 😅", type: "bot", timestamp: new Date(), reaction: null, suggestions: [] },
      ]);
    }
  };

  const clearChat = async () => {
    try {
      await fetch("http://localhost:5044/clear_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      messageIds.current.clear();
      setMessages([]);
      fetchHistory();
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const sendMessage = async (msg = input) => {
    if (!msg.trim()) return;
    const userMessageId = new Date().getTime();
    if (messageIds.current.has(userMessageId)) return;
    messageIds.current.add(userMessageId);
    const newMessage = { id: userMessageId, text: sanitizeText(msg), type: "user", timestamp: new Date(), reaction: null };
    setMessages((prev) => {
      // Ensure user message is added only if not already present
      const userMessageExists = prev.some((msg) => msg.id === userMessageId);
      if (!userMessageExists) {
        return [...prev, newMessage];
      }
      return prev;
    });
    setInput("");
    setIsLoading(true);
    setIsStreaming(true);

    const botMessageId = new Date().getTime() + 1;
    messageIds.current.add(botMessageId);
    setMessages((prev) => [
      ...prev,
      { id: botMessageId, text: "", type: "bot", timestamp: new Date(), reaction: null, suggestions: [] }
    ]);

    try {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const response = await fetch("http://localhost:5044/chatbot_stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, user_id: userId }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.token) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === botMessageId ? { ...m, text: m.text + data.token } : m
                  )
                );
              }
              if (data.suggestions && data.done) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === botMessageId ? { ...m, suggestions: data.suggestions } : m
                  )
                );
                setIsLoading(false);
                setIsStreaming(false);
              }
            } catch (e) {
              console.error("JSON parse error:", e);
            }
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log("Fetch aborted");
      } else {
        console.error("Fetch Error:", error.message);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMessageId
              ? { ...m, text: m.text + ` Error: ${error.message}`, suggestions: [] }
              : m
          )
        );
      }
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const addReaction = (messageId, reaction) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, reaction } : msg))
    );
  };

  const deleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    messageIds.current.delete(messageId);
  };

  const startVoiceInput = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Voice input isn’t supported here!");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = sanitizeText(event.results[0][0].transcript);
      setInput(transcript);
      sendMessage(transcript);
    };
    recognition.onerror = (event) => console.error("Voice input error:", event.error);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const stopVoiceInput = () => setIsListening(false);

  return (
    <>
      <button className="ddcb-chatbot-button" onClick={() => setIsOpen(true)}>
        💬
        <span className="ddcb-chatbot-tooltip">Chat with Career Buddy</span>
      </button>

      {isOpen && (
        <div className={`ddcb-chatbot-window ${isMinimized ? 'ddcb-minimized' : ''}`}>
          <ChatHeader toggleChatbot={toggleChatbot} minimizeChatbot={minimizeChatbot} clearChat={clearChat} />
          {!isMinimized && (
            <>
              <div className="ddcb-chat-box" ref={chatBoxRef}>
                {messages.map((msg) => (
                  <ChatMessage 
                    key={msg.id} 
                    message={msg} 
                    addReaction={addReaction} 
                    deleteMessage={deleteMessage} 
                    sendMessage={sendMessage}
                    isStreaming={msg.type === "bot" && msg.id === messages[messages.length - 1]?.id && isStreaming}
                  />
                ))}
                {isLoading && !isStreaming && (
                  <div className="ddcb-typing-indicator">
                    <span className="ddcb-dot"></span>
                    <span className="ddcb-dot"></span>
                    <span className="ddcb-dot"></span>
                  </div>
                )}
              </div>
              <ChatInput
                input={input}
                setInput={setInput}
                sendMessage={sendMessage}
                isLoading={isLoading}
                isListening={isListening}
                startVoiceInput={startVoiceInput}
                stopVoiceInput={stopVoiceInput}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;