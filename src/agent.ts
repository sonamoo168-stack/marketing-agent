import Anthropic from "@anthropic-ai/sdk";
import { generateCopy, formatForChannel } from "./tools/copywriter.js";

const client = new Anthropic();

const SYSTEM_PROMPT = `당신은 마케팅 전문 AI 에이전트입니다.

역할:
- 마케팅 카피 작성 및 채널별 포맷 최적화
- 독자 중심 콘텐츠 — 브랜드가 아닌 독자의 문제와 이익에 집중
- 명확하고 간결한 문장, 행동을 유도하는 CTA 포함

원칙:
- 사실에 기반하지 않은 과장 표현 금지
- 경쟁사 비방 금지
- "세계 최고", "100% 보장" 같은 과대광고 금지
- 채널별 글자수 제한 준수

도구를 활용해 사용자의 마케팅 요청을 처리하세요.`;

export async function runAgent(userMessage: string): Promise<void> {
  console.log(`\n사용자: ${userMessage}\n`);

  const runner = client.beta.messages.toolRunner({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    tools: [generateCopy, formatForChannel],
    messages: [{ role: "user", content: userMessage }],
  });

  for await (const message of runner) {
    for (const block of message.content) {
      if (block.type === "text" && block.text) {
        process.stdout.write(block.text);
      }
    }
  }

  console.log("\n");
}
