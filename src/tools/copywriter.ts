import Anthropic from "@anthropic-ai/sdk";

export const tools: Anthropic.Tool[] = [
  {
    name: "generate_copy",
    description:
      "마케팅 카피를 생성한다. 제품/서비스 정보와 타겟 채널을 받아 적합한 카피를 반환한다.",
    input_schema: {
      type: "object" as const,
      properties: {
        product: { type: "string", description: "제품 또는 서비스 이름" },
        description: { type: "string", description: "제품/서비스 설명" },
        channel: {
          type: "string",
          enum: ["instagram", "twitter", "email", "blog", "ad"],
          description: "게시 채널",
        },
        tone: {
          type: "string",
          enum: ["friendly", "professional", "urgent", "inspirational"],
          description: "톤 (기본값: friendly)",
        },
      },
      required: ["product", "description", "channel"],
    },
  },
  {
    name: "format_for_channel",
    description:
      "작성된 카피를 특정 채널 형식(해시태그, 글자수 제한 등)에 맞게 포맷한다.",
    input_schema: {
      type: "object" as const,
      properties: {
        copy: { type: "string", description: "원본 카피 텍스트" },
        channel: {
          type: "string",
          enum: ["instagram", "twitter", "email", "blog", "ad"],
          description: "대상 채널",
        },
        add_hashtags: {
          type: "boolean",
          description: "해시태그 추가 여부",
        },
      },
      required: ["copy", "channel"],
    },
  },
];

interface GenerateCopyInput {
  product: string;
  description: string;
  channel: string;
  tone?: string;
}

interface FormatForChannelInput {
  copy: string;
  channel: string;
  add_hashtags?: boolean;
}

const charLimits: Record<string, number> = {
  instagram: 2200,
  twitter: 280,
  email: 500,
  blog: 2000,
  ad: 150,
};

export function executeTool(name: string, input: unknown): string {
  if (name === "generate_copy") {
    const { product, description, channel, tone = "friendly" } =
      input as GenerateCopyInput;
    return JSON.stringify({
      product,
      description,
      channel,
      tone,
      char_limit: charLimits[channel],
    });
  }

  if (name === "format_for_channel") {
    const { copy, channel, add_hashtags = false } =
      input as FormatForChannelInput;
    return JSON.stringify({
      copy,
      channel,
      char_limit: charLimits[channel],
      add_hashtags,
    });
  }

  return JSON.stringify({ error: `Unknown tool: ${name}` });
}
