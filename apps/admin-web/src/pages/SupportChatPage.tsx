import { useState, useRef, useEffect } from 'react';
import { useApiQuery, useApiMutation } from '@/hooks';
import { supportChatService, ChatMessage } from '@/services/support-chat.service';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Send, User as UserIcon, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export function SupportChatPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, refetch } = useApiQuery(['chat', 'messages'], () =>
    supportChatService.getMessages(1, 50),
    { refetchInterval: 5000 }
  );

  const sendMutation = useApiMutation(
    (content: string) => supportChatService.sendMessage(content),
    {
      onSuccess: () => {
        setMessage('');
        refetch();
      },
    }
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMutation.isPending) return;
    sendMutation.mutate(message.trim());
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data]);

  const messages = [...(data?.data || [])].reverse();

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] bg-[var(--gf-cream)] gf-scope">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gf-cream)] gf-scope pb-8 pt-5 sm:px-6 sm:pt-5">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="text-start space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Support Chat</h1>
          <p className="text-xs sm:text-sm text-[var(--fg-2)] font-semibold mt-0.5">Direct communication with administration</p>
        </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-paper)] rounded-2xl h-[calc(100vh-200px)]">
        <CardHeader className="border-b-2 border-[var(--gf-green-deep)] py-4 bg-[var(--gf-green-50)]/40">
          <CardTitle className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>
            <MessageCircle className="h-4 w-4 text-[var(--gf-green)]" />
            Support Channel
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[var(--fg-2)] opacity-50">
                <MessageCircle className="h-12 w-12 mb-2 text-[var(--gf-green)]" />
                <p className="font-semibold">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg: ChatMessage) => {
                const isOwn = msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex w-full gap-3",
                      isOwn ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isOwn && (
                      <div className="h-8 w-8 rounded-full bg-[var(--gf-green-50)] flex items-center justify-center border-2 border-[var(--gf-green-deep)]">
                        <UserIcon className="h-4 w-4 text-[var(--gf-green)]" />
                      </div>
                    )}
                    <div className={cn(
                      "flex flex-col max-w-[70%]",
                      isOwn ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "px-4 py-2.5 rounded-2xl text-sm shadow-sm font-semibold",
                        isOwn 
                          ? "bg-[var(--gf-green)] text-white rounded-tr-none border-2 border-[var(--gf-green-deep)]" 
                          : "bg-[var(--gf-green-50)] text-[var(--gf-green-deep)] rounded-tl-none border-2 border-[var(--gf-green-deep)]"
                      )}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-[var(--fg-3)] font-medium mt-1 px-1">
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form 
            onSubmit={handleSend}
            className="p-4 border-t-2 border-[var(--gf-green-deep)] bg-[var(--gf-green-50)]/40 flex gap-2"
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-[var(--gf-paper)] border-2 border-[var(--line)] focus-visible:ring-[var(--gf-green)] focus-visible:border-[var(--gf-green-deep)] font-semibold text-[var(--gf-green-deep)]"
              disabled={sendMutation.isPending}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!message.trim() || sendMutation.isPending}
              className="rounded-full shrink-0 bg-[var(--gf-green)] text-white border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--gf-green-deep)] active:translate-y-[1px] active:shadow-[0_0_0_0_var(--gf-green-deep)] font-extrabold"
            >
              {sendMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
