# POSiT! – post your idea

30초 만에 사장님과 게스트를 연결하는 아이디어 메모 & 채택 쿠폰 서비스


## 📌 Overview

POSiT은 게스트의 짧은 메모를 통해 사장님의 고민을 해결하고, 채택 시 쿠폰 보상으로 이어지는 선순환 구조의 서비스입니다.

- 30초 메모 작성
- 사장님 채택
- 자동 쿠폰 발행
- 재방문 유도
  

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

### Deployment

- Vercel


## ✨ Features

### 👤 Guest

- 위치 기반 매장 탐색
- 사장님 고민 확인
- 자유 메모 작성 (이미지 첨부 가능)
- 채택 시 쿠폰 자동 지급
- 쿠폰 사용 및 바코드 확인

### 🧑‍💼 Owner

- 고민 등록
- 메모 수신함 관리
- 아이디어 채택 / 거절
- 쿠폰 자동 발행 설정
  

## 📁 Project Structure

```bash
src/
├─ api/                # API 요청 모듈
├─ assets/             # 이미지 / 아이콘 / Lottie
├─ components/         # 공통 UI 컴포넌트
├─ hooks/              # Custom Hooks
├─ layout/             # 공통 레이아웃 (하단바 등)
├─ pages/
│   ├─ Guest/          # 게스트 화면
│   │   ├─ Main/       # 메인
│   │   ├─ My/         # 내 계정
│   │   ├─ Posit/      # POSiT 작성
│   │   ├─ Store/      # 가게 상세
│   │   └─ Coupon/     # 쿠폰
│   ├─ Owner/          # 사장님 화면
│   │   ├─ Home/       # 메인
│   │   ├─ My/         # 내 계정
│   │   ├─ Posit/      # POSiT 관리
│   │   ├─ Registration/ # 가게 등록
│   │   └─ Coupon/     # 쿠폰 관리
│   ├─ Login/          # 로그인
│   ├─ Onboarding/     # 온보딩
│   ├─ SignUp/         # 회원가입
│   └─ Splash/         # 스플래시
├─ styles/             # 글로벌 스타일
├─ routes/             # 라우팅 설정
├─ types/              # TypeScript 타입 정의
└─ utils/              # 공통 유틸 함수
```



## 🚀 Live Demo

👉 [https://kuit-6th-posit.vercel.app/](https://6thposit.vercel.app/)

<img width="357" height="357" alt="219QY" src="https://github.com/user-attachments/assets/9ec56320-4b7b-450f-9014-bf50c5b7e2f2" />





