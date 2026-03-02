import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

export const generateCopy = betaZodTool({
  name: "generate_copy",
  description: "마케팅 카피를 생성한다. 제품/서비스 정보와 타겟 채널을 받아 적합한 카피를 반환한다.",
  inputSchema: z.object({
    product: z.string().describe("제품 또는 서비스 이름"),
    description: z.string().describe("제품/서비스 설명"),
    channel: z.enum(["instagram", "twitter", "email", "blog", "ad"]).describe("게시 채널"),
    tone: z.enum(["friendly", "professional", "urgent", "inspirational"]).optional().describe("톤"),
  }),
  run: async ({ product, description, channel, tone = "friendly" }) => {
    const limits: Record<string, number> = {
      instagram: 2200,
      twitter: 280,
      email: 500,
      blog: 2000,
      ad: 150,
    };
    return JSON.stringify({
      channel,
      tone,
      product,
      description,
      char_limit: limits[channel],
      instruction: `위 정보를 바탕으로 ${channel}용 ${tone} 톤의 마케팅 카피를 ${limits[channel]}자 이내로 작성해주세요.`,
    });
  },
});

export const formatForChannel = betaZodTool({
  name: "format_for_channel",
  description: "작성된 카피를 특정 채널 형식(해시태그, 이모지, 글자수 제한 등)에 맞게 포맷한다.",
  inputSchema: z.object({
    copy: z.string().describe("원본 카피 텍스트"),
    channel: z.enum(["instagram", "twitter", "email", "blog", "ad"]).describe("대상 채널"),
    add_hashtags: z.boolean().optional().describe("해시태그 추가 여부"),
  }),
  run: async ({ copy, channel, add_hashtags = false }) => {
    return JSON.stringify({
      original: copy,
      channel,
      add_hashtags,
      instruction: `위 카피를 ${channel} 형식에 맞게 정리해주세요. ${add_hashtags ? "관련 해시태그 3~5개를 추가하세요." : ""}`,
    });
  },
});
