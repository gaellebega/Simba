import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, X, Send, Zap, Brain } from 'lucide-react';
import { useSimba } from '../context/SimbaContext';
import { useLanguage } from '../context/LanguageContext';
import { askAI } from '../services/groqService';
import { formatPrice } from '../utils/helpers';

function ProductMiniCard({ product, branchStock }) {
  return (
    <Link to={`/product/${product.id}`} className="ai-product-card">
      <img src={product.image} alt={product.name} />
      <div className="ai-product-card-body">
        <span className="ai-product-card-name">{product.name}</span>
        <span className="ai-product-card-price">{formatPrice(product.price)} RWF</span>
        {branchStock !== undefined && (
          <span className="ai-product-card-stock">{branchStock} left</span>
        )}
      </div>
    </Link>
  );
}

function ChatMessage({ msg, selectedBranch }) {
  return (
    <div className={`ai-msg ai-msg-${msg.role}`}>
      {msg.role === 'assistant' && (
        <div className="ai-msg-avatar">🦁</div>
      )}
      <div className="ai-msg-bubble">
        <p>{msg.content}</p>
        {msg.matched && msg.matched.length > 0 && (
          <div className="ai-products-row">
            {msg.matched.map((p) => (
              <ProductMiniCard
                key={p.id}
                product={p}
                branchStock={selectedBranch ? p._branchStock : undefined}
              />
            ))}
          </div>
        )}
        {msg.source && (
          <span className="ai-msg-source" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {msg.source === 'groq'
              ? <><Zap size={10} /> Groq AI</>
              : <><Brain size={10} /> Ollama</>}
          </span>
        )}
      </div>
    </div>
  );
}

export default function AIChatWidget() {
  const { store, selectedBranch } = useSimba();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('aiGreeting'), matched: [] },
  ]);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
    }
  }, [open, messages]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages
      .filter((m) => m.role !== 'assistant' || !m.matched)
      .map((m) => ({ role: m.role, content: m.content }));

    const result = await askAI(text, store?.products || [], selectedBranch, history);

    if (result.ok) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.reply,
          matched: result.matched || [],
          source: result.source,
        },
      ]);
    } else {
      const errMsg = result.error === 'NO_KEY' || result.error?.includes('VITE_GROQ')
        ? t('aiSearchNoKey')
        : t('aiSearchError');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: errMsg, matched: [] },
      ]);
    }

    setLoading(false);
  }

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        className={`ai-fab${open ? ' ai-fab-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={t('aiSearchTitle')}
        title={t('aiSearchTitle')}
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="ai-panel">
          {/* Header */}
          <div className="ai-panel-header">
            <div className="ai-panel-title">
              <Bot size={20} style={{ color: 'var(--primary)' }} />
              <div>
                <strong>{t('aiSearchTitle')}</strong>
                <small>Groq llama-3.3-70b · Ollama fallback</small>
              </div>
            </div>
            <button type="button" className="ai-panel-close" onClick={() => setOpen(false)}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="ai-messages">
            {messages.map((msg, i) => (
              <ChatMessage key={i} msg={msg} selectedBranch={selectedBranch} />
            ))}
            {loading && (
              <div className="ai-msg ai-msg-assistant">
                <div className="ai-msg-avatar">🦁</div>
                <div className="ai-msg-bubble ai-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form className="ai-input-row" onSubmit={handleSend}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('aiSearchPlaceholder')}
              className="ai-input"
              disabled={loading}
            />
            <button
              type="submit"
              className="ai-send-btn"
              disabled={loading || !input.trim()}
              aria-label={t('aiSearchSend')}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
