# 정처기 글 이전 주소

이전 주소와 목적지는 `lib/post-redirects.ts`에서 관리한다. `next.config.ts`가
각 슬러그의 `/blog/`, `/ko/blog/`, `/en/blog/` 경로에 HTTP 301을 적용한다.
현재 영어판 목적지가 없으므로 영어 경로도 같은 한국어 후속 콘텐츠로 이동한다.
정확히 등록된 글 주소만 대상으로 하며 일반 블로그와 언어 선택 경로는 유지한다.

## 삭제 이력과 대응 범위

2025-11-19의 `6a17050f61ef6c9886eea17417b81a1e14c35c74`
(`정처기 감자에 있는 페이지 삭제`)에서 삭제된 한국어 글 51개를 원문과 대조했다.
기존 3개와 합쳐 54개 슬러그, 언어별 경로를 포함해 162개 규칙이다.
당시 공개 주소의 `network-tranmission-method` 오타도 리디렉션 출발지에 보존한다.

삭제 직전 원문은 다음 명령으로 확인할 수 있다.

```sh
git show '6a17050^:contents/<slug>/ko.mdx'
```

## 여러 글로 분리되거나 목록 역할을 하던 글

단일 후속 글이 있으면 그 글로 이동한다. 여러 주제로 나뉜 원문은 아래 기준으로
대표 글 또는 해당 주제를 모두 안내하는 목록에 연결했다. 아래 목적지는
`https://jeongcheogi.edugamja.com` 기준 경로다.

| 이전 슬러그 | 목적지 | 선정 근거 |
| --- | --- | --- |
| `authentication-for-exam` | `/theory/security-newtech` | 원문은 접근 통제·3A·인증 기술의 소개와 링크 모음이다. 새 목록의 보안기능 영역에서 세 글을 모두 안내한다. |
| `types-of-security-attack` | `/theory/security-newtech` | 원문은 네트워크 공격과 DoS의 비교 및 링크 모음이다. 새 목록의 공격 유형 영역에서 양쪽 후속 글을 안내한다. |
| `interface-implementation-for-exam` | `/theory/sw-dev` | 원문은 통신 기술·데이터 형식·웹 서비스·보안의 안내 글이다. 새 목록에서 네 주제의 후속 글을 모두 찾을 수 있다. |
| `gof-design-behavioral-pattern-1` ~ `5`, `gof-design-creational-pattern-for-exam`, `gof-design-structural-pattern-for-exam`, `gof-design-structural-pattern-2` | `/theory/sw-design/design-pattern-cheatsheet` | 원문의 패턴별 설명이 개별 글로 분리되었다. 새 요약 글은 23개 패턴의 핵심 설명과 각 상세 글 링크를 제공한다. |
| `gof-design-pattern-cheat-sheet` | `/theory/sw-design/design-pattern-cheatsheet` | 같은 암기법·분류·상세 글 안내를 이어받은 글이다. |
| `sql-for-exam` | `/coding/sql` | 원문의 INSERT·UPDATE·DELETE·DDL·DCL·SELECT·서브쿼리 예제가 여러 글로 분리되었다. 해당 문법과 문제를 안내하는 SQL 목록으로 연결한다. |
| `dos-attack` | `/theory/security-newtech/dos-attack-types` | 원문의 주요 내용인 LAND·Smurf·Teardrop·Ping of Death·SYN/UDP Flooding 설명을 이어받았다. DoS/DDoS/DRDoS 비교는 별도 글로 분리되었다. |
| `db-normalization-for-exam` | `/theory/db/db-normalization` | 정규화·반정규화 본문을 이어받았다. 함수 종속성은 별도 글로 분리되었다. |
| `subnet-mask-for-exam` | `/theory/network-os/subnet-mask` | 서브넷 마스크와 네트워크·브로드캐스트 주소 계산 본문을 이어받았다. CIDR·블록 크기·서브넷팅은 별도 글로 분리되었다. |
| `uml-diagram-4-1-view` | `/theory/sw-design/uml-diagram` | 원문 전반부인 UML 설명을 이어받았고, 본문에서 분리된 4+1 뷰 모델 글을 직접 안내한다. |

## 2026-09-07 검증 결과

- 삭제된 한국어 슬러그 51개가 모두 매핑에 포함되어 있다.
- Next.js가 읽은 실제 설정으로 162개 경로의 301과 목적지를 검증했다.
  일반 블로그·태그 등 비대상 경로 8개와 쿼리 전달도 확인했다.
- 로컬 Next.js 서버의 실제 HTTP 요청 165건도 통과했다. 이전 글 162개 경로의
  301, 한국어·영어 `/blog` 자동 이동, 기존 오타 주소의 쿼리 전달을 확인했다.
- 중복을 제외한 목적지 45개 모두 공개 GET 응답이 200이고, canonical이 자기
  주소다. 메타 태그·응답 헤더에 noindex가 없고 robots.txt도 Googlebot 크롤링을 허용한다.
- 공개 사이트맵에는 45개 중 44개가 포함되어 있다. `/coding/sql` 목록은 누락되어
  정처기 감자 사이트맵에 추가가 필요하다. 원문의 전체 SQL 문법을 안내하는
  목적지이므로, 사이트맵 포함 여부만 맞추려고 일부 문법 글로 목적지를 바꾸지 않았다.
- 재확인 결과 SQL 하위 글도 사이트맵에서 빠져 있어
  [JCG-3487](https://linear.app/kimjaahyun/issue/JCG-3487/sql-카테고리와-하위-글의-사이트맵-누락-보완)에서 별도로 추적한다.
- `yarn tsc --noEmit --incremental false` 통과. 위 리디렉션은 로컬 서버 검증이며,
  실제 출발지의 변경 응답은 배포 후 다시 확인해야 한다.

## 배포 후 확인

- 이전 주소의 첫 응답이 301이고 `Location`이 지정한 새 주소인지 확인한다.
- 새 주소가 200, 자기 자신을 가리키는 canonical, 색인 허용 상태인지 확인한다.
- 새 사이트맵에 목적지가 있고, 기존 블로그 사이트맵에는 이전 글이 없는지 확인한다.
- Search Console에서 이전·새 URL의 마지막 크롤링과 Google 선택 표준 URL을 비교한다.

이 변경은 누락된 이전 경로를 복구한다. 새 사이트의 모든 미색인 원인이 이 누락이라는
뜻은 아니며, Google이 재크롤링한 뒤 실제 색인 상태를 별도로 확인해야 한다.
