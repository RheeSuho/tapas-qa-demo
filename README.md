# Tapas QA Automation — Demo

Playwright + TypeScript 기반 E2E 테스트 자동화 데모 레포지토리입니다.  
실제 운영 중인 시스템([tapas-qa](https://github.com/RheeSuho/tapas-qa))의 핵심 패턴을 공개 가능한 형태로 정리했습니다.

**실제 운영 지표 (2026.06 기준)**
- 자동화 TC: PC Web 251개 + MWeb 294개 = **545개**
- 전체 실행: **30분 이내** (PC Web + MWeb)
- 수동 검증 대비: **약 35배 단축**
- 현재 실패: **0건** (Prod + QA 4개 환경)

---

## 구조

```
tapas-qa-demo/
├── features/              # Gherkin 시나리오 (TC 문서 = 실행 코드)
│   ├── 01-navigation/     # GNB 탭 이동
│   ├── 02-search/         # 검색 흐름
│   └── 03-series/         # 시리즈 페이지
├── steps/                 # Step 구현체 (TypeScript)
├── pages/                 # Page Object Model
│   └── GnbPage.ts
├── data/
│   └── testData.ts        # 테스트 데이터 상수
├── auth.setup.ts          # 로그인 세션 관리
├── playwright.config.ts
└── .github/workflows/
    └── regression.yml     # CI/CD (평일 매일 자동 실행)
```

---

## 핵심 설계 결정

### 1. TC 문서 = 실행 코드 (playwright-bdd)

Google Sheets에 작성된 TC를 Gherkin `.feature` 파일로 변환합니다.  
TC 문서를 수정하면 자동으로 코드가 수정되어 이중 관리가 없습니다.

```gherkin
# features/02-search/search.feature
Scenario: [TPS-042] 키워드 검색 결과 노출
  Given 홈 화면에 접속한다
  When 검색창에 "Solo Leveling"을 입력한다
  Then 검색 결과 페이지로 이동된다
  And 검색 결과 목록이 노출된다
```

### 2. 세션 재사용 — 매 TC마다 로그인 없음

`auth.setup.ts`가 최초 1회 로그인 후 세션을 `.auth/user.json`에 저장합니다.  
이후 모든 TC는 이 파일을 로드해 이미 로그인된 상태로 시작합니다.

- 로컬: 24시간 세션 재사용 (만료 시 자동 재로그인)
- CI: `AUTH_STATE_B64` GitHub Secret으로 주입

```typescript
// CI: restore session from base64-encoded secret
if (process.env.AUTH_STATE_B64) {
  const decoded = Buffer.from(process.env.AUTH_STATE_B64, 'base64').toString('utf-8');
  writeFileSync('.auth/user.json', decoded);
  return;
}
```

### 3. 의미 기반 Locator — 녹화 방식 미사용

XPath·좌표 녹화 대신 요소의 역할과 이름으로 탐색합니다.  
UI 레이아웃이 바뀌어도 locator를 수정할 필요가 없습니다.

```typescript
// ✅ 역할·이름 기반 — 버튼 위치가 바뀌어도 동작
await page.getByRole('button', { name: /^log ?in$/i }).last().click();
await page.getByPlaceholder('Search').fill(keyword);

// ❌ XPath 녹화 방식 — UI 변경 시 깨짐
// await page.locator('//*[@id="app"]/div[2]/header/div/button[1]').click();
```

### 4. 거짓 통과 방지 — C수준 Assertion

단순히 "페이지가 뜨는지"가 아닌 실제 요소 노출까지 검증합니다.

```typescript
// ✅ URL 패턴 + 실제 DOM 요소 확인
Then('Comics 홈 화면으로 이동된다', async ({ page }) => {
  await expect(page).toHaveURL(/\/menu\/2/);
});
Then('작품 목록이 노출된다', async ({ page }) => {
  await expect(page.locator('a[href*="/series/"]').first()).toBeVisible();
});

// ❌ 약한 검증 — 빈 페이지여도 통과
// await expect(page.locator('body')).toBeVisible();
```

---

## 실행 방법

```bash
# 의존성 설치
npm install
npx playwright install chromium

# 환경변수 설정
cp .env.example .env
# .env 파일에 USER_EMAIL, USER_PASSWORD 입력

# 첫 실행 (로그인 세션 생성)
npm run test:setup

# 전체 테스트 실행
npm run test:bdd

# 브라우저 화면 보면서 실행
npm run test:bdd:headed

# Allure 리포트 확인
npm run report
```

---

## CI/CD

GitHub Actions로 평일 매일 오전 9시(KST) 자동 실행됩니다.

```
코드 push / 스케줄 트리거
        ↓
GitHub Actions — Playwright 실행
        ↓
Allure 리포트 → GitHub Pages 자동 배포
        ↓
Slack 결과 알림 (실패 시 Jira 버튼 자동 생성)
```

세션 관리: `AUTH_STATE_B64` Secret에 base64 인코딩된 `user.json`을 저장.  
약 5일 주기로 갱신 필요 (로컬에서 `cat .auth/user.json | base64 | tr -d '\n'`).

---

## 기술 스택

| 분류 | 도구 |
|------|------|
| 자동화 엔진 | Playwright, TypeScript |
| BDD 프레임워크 | playwright-bdd, Gherkin |
| CI/CD | GitHub Actions |
| 리포팅 | Allure, GitHub Pages |
| 알림 / 이슈 | Slack Webhook, Jira REST API |
| 스크립팅 | Python (TC 변환), Node.js |

---

문의: ruben.lee@dktechin.com
