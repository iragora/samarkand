'use client';
import { useState } from 'react';

export default function ChatPage() {
  const [character, setCharacter] = useState('Деев');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: 'assistant',
      content:
        'Привет! Ты в эшелоне 1923 года, идущем из Казани в Самарканд. Выбери, с кем говорить: с Деевом, комиссаром Белой, фельдшером Бугом или Загрейкой.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    const newUserMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newUserMessage],
          character,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.content },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Ошибка: ${data.error || 'Не удалось получить ответ'}`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Что-то пошло не так, попробуй ещё раз.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '40px auto',
        fontFamily: 'sans-serif',
        padding: '0 16px',
      }}
    >
      <h1>Эшелон на Самарканд</h1>
      <div style={{ marginBottom: '16px' }}>
        <span style={{ marginRight: '8px' }}>Говорю с:</span>
        {['Деев', 'Белая', 'Буг', 'Загрейка'].map((name) => (
          <button
            key={name}
            onClick={() => setCharacter(name)}
            style={{
              marginRight: '8px',
              marginBottom: '8px',
              padding: '6px 16px',
              border: '1px solid #ccc',
              borderRadius: '20px',
              background: character === name ? '#007bff' : '#fff',
              color: character === name ? '#fff' : '#333',
              cursor: 'pointer',
            }}
          >
            {name}
          </button>
        ))}
      </div>

      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '20px',
          height: '450px',
          overflowY: 'auto',
          marginBottom: '16px',
          background: '#fafafa',
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '14px' }}>
            <strong>{m.role === 'user' ? 'Ты:' : `${character}:`}</strong>
            <p style={{ whiteSpace: 'pre-line', margin: '4px 0 0 0' }}>
              {m.content}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Напиши герою..."
          style={{
            flex: 1,
            padding: '10px 12px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '16px',
          }}
        />
        <button
          onClick={send}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            background: isLoading ? '#999' : '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          {isLoading ? 'Думаю...' : 'Отправить'}
        </button>
      </div>
    </div>
  );
}
