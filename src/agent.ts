import Anthropic from "@anthropic-ai/sdk";
import { tools, executeTool } from "./tools/copywriter.js";

const client = new Anthropic();

const SYSTEM_PROMPT = `당신은 마케팅 전문 AI 에이전트입니다.

역할:
- 마케팅 카피 작성 및 채널별 포맷 최적화
- 독자 중심 콘텐츠 — 브랜드가 아닌 독자의 문제와 이익에 집중
- 명확하고 간결한 문장, 행동을 유도하는 CTA 포함

원칙:
- 사실에 기반하지 않은 과장 표현 금지
- 경쟁사 비방 금지
- 과대광고 금지
- 채널별 글자수 제한 준수

도구를 활용해 사용자의 마케팅 요청을 처리하세요.`;

export async function runAgent(userMessage: string): Promise<void> {
  console.log(`\n사용자: ${userMessage}\n`);

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  while (true) {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools,
      messages,
    });

    for (const block of response.content) {
      if (block.type === "text") {
        process.stdout.write(block.text);
      }
    }

    if (response.stop_reason === "end_turn") {
      break;
    }

    if (response.stop_reason === "tool_use") {
      messages.push({ role: "assistant", content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of response.content) {
        if (block.type === "tool_use") {
          const result = executeTool(block.name, block.input);
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result,
          });
        }
      }

      messages.push({ role: "user", content: toolResults });
      continue;
    }

    break;
  }

  console.log("\n");
}
