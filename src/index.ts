import "dotenv/config";
import { runAgent } from "./agent.js";

const prompt = process.argv[2] ?? "인스타그램용 카피를 하나 만들어줘. 제품은 '새벽 배송 신선 식품 서비스'야.";

runAgent(prompt).catch(console.error);
