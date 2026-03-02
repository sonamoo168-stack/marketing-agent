# Marketing Agent

Anthropic Claude API를 활용한 마케팅 카피 생성 AI 에이전트.

## 기능

- 채널별 마케팅 카피 생성 (Instagram, Twitter, Email, Blog, Ad)
- 채널 형식에 맞는 포맷 자동 적용 (글자수 제한, 해시태그 등)
- 톤 설정 지원 (friendly, professional, urgent, inspirational)

## 시작하기

### 요구사항

- Node.js v18 이상
- Anthropic API 키

### 설치

```bash
npm install
```

### 환경 변수 설정

`.env` 파일을 생성하고 API 키를 입력합니다.

```
ANTHROPIC_API_KEY=your_api_key_here
```

### 실행

```bash
# 기본 예시 실행
npm run dev

# 직접 프롬프트 입력
npm run dev "인스타그램용 카피를 만들어줘. 제품은 '오가닉 스킨케어 브랜드'야."
```

## 프로젝트 구조

```
src/
├── index.ts          # 진입점
├── agent.ts          # Claude 에이전트 루프
└── tools/
    └── copywriter.ts # 카피 생성/포맷 도구 정의
```

## 기술 스택

- TypeScript
- Anthropic SDK (`@anthropic-ai/sdk`)
- tsx (개발 실행)
