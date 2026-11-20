import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup } from "@/components/ui/message"
import { HugeiconsIcon, Stethoscope02Icon } from "@/lib/ds/icons"

import type { Block } from "./types"

const messages = [
  {
    from: "user" as const,
    time: "9:41 AM",
    text: "I've had a mild sore throat for two days. Should I book a visit?",
  },
  {
    from: "assistant" as const,
    time: "9:41 AM",
    text: "Sorry you're feeling unwell. Most sore throats ease within a week. Do you have a fever above 38°C, trouble swallowing, or swollen glands?",
  },
  {
    from: "user" as const,
    time: "9:42 AM",
    text: "No fever. It's just scratchy, mostly in the morning.",
  },
  {
    from: "assistant" as const,
    time: "9:42 AM",
    text: "That sounds manageable at home for now. Warm drinks, rest and throat lozenges can help. If it lasts more than a week or you develop a fever, I can book you a virtual visit.",
  },
]

const suggestions = ["Book a virtual visit", "What can I take for it?", "When should I worry?"]

export function ChatThreadBlock() {
  return (
    <section className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Care assistant</CardTitle>
            <CardDescription>Answers are general guidance, not a diagnosis.</CardDescription>
            <CardAction>
              <Badge variant="secondary">Online</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <MessageGroup className="gap-5">
              {messages.map((message, i) =>
                message.from === "user" ? (
                  <Message key={i} align="end">
                    <MessageContent>
                      <Bubble align="end">
                        <BubbleContent>{message.text}</BubbleContent>
                      </Bubble>
                      <MessageFooter>{message.time}</MessageFooter>
                    </MessageContent>
                  </Message>
                ) : (
                  <Message key={i}>
                    <MessageAvatar>
                      <Avatar>
                        <AvatarFallback>
                          <HugeiconsIcon icon={Stethoscope02Icon} className="size-4" />
                        </AvatarFallback>
                      </Avatar>
                    </MessageAvatar>
                    <MessageContent>
                      <Bubble variant="muted">
                        <BubbleContent>{message.text}</BubbleContent>
                      </Bubble>
                      <MessageFooter>Assistant · {message.time}</MessageFooter>
                    </MessageContent>
                  </Message>
                )
              )}
            </MessageGroup>
          </CardContent>
          <CardFooter className="flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <Button key={suggestion} variant="outline" size="sm">
                {suggestion}
              </Button>
            ))}
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

export const block: Block = {
  id: "chat-thread",
  name: "Chat thread",
  category: "AI",
  description: "Conversation between a patient and the care assistant with timestamps and suggested replies.",
  render: () => <ChatThreadBlock />,
}
