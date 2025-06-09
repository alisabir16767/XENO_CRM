'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CopyCheck, ClipboardCopy } from 'lucide-react';
import { generateAIMessage } from '@/services/aiService';

export default function GenerateMessages() {
  const [topic, setTopic] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [typedMessages, setTypedMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setMessages([]);
    setTypedMessages([]);
    setCopiedIndex(null);
  
    try {
      const results = await generateAIMessage(topic);
      setMessages(results);
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to generate messages. Try again later.'
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (messages.length === 0) return;

    let current = 0;

    const typeNextMessage = () => {
      if (current >= messages.length) return;

      const message = messages[current];
      let typed = '';
      let i = 0;

      const typing = setInterval(() => {
        typed += message[i++];
        setTypedMessages((prev) => {
          const updated = [...prev];
          updated[current] = typed;
          return updated;
        });

        if (i >= message.length) {
          clearInterval(typing);
          current++;
          setTimeout(typeNextMessage, 300); 
        }
      }, 30);
    };

    setTypedMessages(Array(messages.length).fill(''));
    typeNextMessage();
  }, [messages]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6 px-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-xl font-semibold">AI Campaign Message Generator</h2>
          <Textarea
            placeholder="Enter your campaign goal, e.g. 'Bring back inactive users'"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button onClick={handleGenerate} disabled={loading || !topic.trim()}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Generate Messages
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {typedMessages.length > 0 && (
        <Card>
          <CardContent className="pt-4 space-y-2">
            <h3 className="text-lg font-medium">Suggestions</h3>
            <ul className="space-y-3">
              {typedMessages.map((msg, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm bg-muted"
                >
                  <span className="w-[85%] break-words font-mono">
                    {msg}
                    <span className="animate-pulse">|</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(messages[i], i)}
                    disabled={!messages[i]}
                  >
                    {copiedIndex === i ? (
                      <CopyCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <ClipboardCopy className="h-4 w-4" />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
