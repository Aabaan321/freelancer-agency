import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

const QUICK_REPLIES = [
  "What's your pricing?",
  "How long does a website take?",
  "What do you build?",
  "Are spots available?",
  "I want to book a call",
];

const GREETING = "Hi! 👋 I'm the AI assistant for Luxe Studio. Ask me anything about our services, pricing, process, or availability — I'm here to help!";

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: GREETING, time: getTime() }]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    if (messages.length >= 20) {
      setMessages(prev => [...prev, { role: 'assistant', content: "For more help, please book a free call with our team → Visit our Contact page!", time: getTime() }]);
      return;
    }
    setShowQuickReplies(false);
    const userMsg = { role: 'user', content: text.trim(), time: getTime() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = newMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "Sorry, I'm having a moment. Please try again or contact us directly at hello@luxestudio.com", time: getTime() }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having a moment. Please try again or contact us directly at hello@luxestudio.com", time: getTime() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button className="chat-btn" onClick={() => setOpen(!open)} aria-label="Chat with AI assistant" title="Chat with our AI assistant">
        {open ? <X size={26} /> : <Sparkles size={26} />}
        {!open && <span className="pulse-ring" />}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-panel"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="chat-logo"><Sparkles size={18} /></div>
              <div className="info">
                <h4>Luxe Studio <span style={{ fontWeight: 400, fontSize: '12px', color: '#9A9AB0' }}>AI Assistant</span></h4>
                <span><span className="online-dot" /> Online now</span>
              </div>
              <button className="close-chat" onClick={() => setOpen(false)}><X size={20} /></button>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.role === 'user' ? 'user' : 'ai'}`}>
                  {msg.role === 'assistant' && <div className="msg-avatar">✦</div>}
                  <div>
                    <div className="msg-bubble">{msg.content}</div>
                    <div className="msg-time">{msg.time}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chat-msg ai">
                  <div className="msg-avatar">✦</div>
                  <div className="msg-bubble">
                    <div className="typing-indicator"><span /><span /><span /></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {showQuickReplies && messages.length <= 1 && (
              <div className="quick-replies">
                {QUICK_REPLIES.map((q, i) => (
                  <button key={i} className="quick-reply-btn" onClick={() => sendMessage(q)}>{q}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="chat-input-area">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 500))}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button className="chat-send-btn" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
