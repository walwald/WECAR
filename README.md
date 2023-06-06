# 📍WECAR - backend

c2c 공간 대여 중계 플랫폼 Airbnb를 모델링하여, c2c 차량 대여 중계 플랫폼 WECAR 웹사이트 제작<br>

> *짧은 프로젝트 기간동안 개발에 집중해야 하므로 디자인/기획 부분만 클론했습니다.<br>
개발은 초기 세팅부터 전부 직접 구현했으며, 아래 데모 영상에서 보이는 부분은 모두 백앤드와 연결하여 실제 사용할 수 있는 서비스 수준으로 개발한 것입니다.*
<br>

## 1. 프로젝트 기간 & 인원
* 프로젝트 기간: 3주 (2023.05.12 ~ 2023.06.02)   
* 개발 인원:  
  `Frontend`: 김영운 <br>
  `Backend`: 장다희 <br>
* [프론트엔드 Github 저장소](https://github.com/KIMYOUNGWOON/44-3rd-wecar.git)
* 모델링한 사이트: [Airbnb](https://www.airbnb.co.kr/)
<br>

## 2. 사용 기술

* **Backend** <br>
TypeScript 4.7 <br>
NestJS v9<br>
JWT <br>
TypeOrm 0.3<br>
MySql 5.7<br>
Rest <br>
Prettier <br>
Docker <br>
AWS <br>
<br>

* **협업** <br>
Git & Git hub <br>
Trello <br>
Postman <br>
Slack <br>
Notion <br>
<br>


 ## 3. [ERD](https://dbdiagram.io/d/645ca847dca9fb07c4e4dd14)
 일반 user, host, 차량 모델, 등록 차량(host car), 예약, 결제를 중점적으로 ERD를 설계하였습니다. <br><br>
 ![WECAR](https://github.com/walwald/WECAR/assets/120387100/5bddd524-366a-4fc4-9a58-f32210aec9be)

<br>
<br>
 
 ## 4. 핵심 기능
  WECAR 서비스의 핵심은 차량 대여 중계입니다.<br>
  호스트는 자신의 차량을 등록하여 예약을 받고, 일반 유저는 대여할 차량을 선택해 예약하고 결제합니다.<br>
  admin 기능으로는 호스트 유저가 차량 등록 시 활용할 수 있도록 차량 브랜드, 모델, 옵션 등을 등록하는 기능이 있습니다. <br><br>
  
  1. 회원가입/로그인
  - 일반 유저와 호스트를 구별하여 회원가입/로그인 되도록 구현했습니다.
  - 사용자 정보에 있어 공통된 property는 BaseUser로 작성하여 호스트와 일반 유저가 extends 하도록 했습니다. 📌[코드 확인](https://github.com/walwald/WECAR/blob/61706973829c77ffc0211e8d130e1977f282bbb9/src/users/entities/base-user.entity.ts#L5)
  - 비밀번호 암호화, 로그인 시 비밀번호 확인과 같은 기본적인 기능을 BaseUser의 메서드로 작성하여, 추후 다른 유형의 유저가 추가되더라도 코드의 중복 없이 사용가능하도록 하였습니다. 📌[코드 확인](https://github.com/walwald/WECAR/blob/61706973829c77ffc0211e8d130e1977f282bbb9/src/users/entities/base-user.entity.ts#L33)

  2. Token Refresh 📌코드 확인 - [user](https://github.com/walwald/WECAR/blob/61706973829c77ffc0211e8d130e1977f282bbb9/src/users/users.controller.ts#L28), [host](https://github.com/walwald/WECAR/blob/61706973829c77ffc0211e8d130e1977f282bbb9/src/hosts/hosts.controller.ts#L28)
  - 보안 강화를 위하여 access token의 만료시간을 상대적으로 짧게 설정하여 access token 만료 시 refresh token으로 인증하여 새 token을 발급받도록 구현했습니다.

  3. 차량/옵션 등록 📌코드 확인 - [모델 등록](https://github.com/walwald/WECAR/blob/61706973829c77ffc0211e8d130e1977f282bbb9/src/cars/cars.controller.ts#L34), [옵션 등록](https://github.com/walwald/WECAR/blob/61706973829c77ffc0211e8d130e1977f282bbb9/src/cars/cars.controller.ts#L49)
  - WECAR의 페이지 관리자가 사용하는 차량 모델 신규 등록, 차량 옵션 선택지 등록 기능을 구현했습니다.

  6. 호스트 차량 등록
  7. 호스트 차량 리스트 (필터/검색)
  8. 호스트 차량 상세 정보
  9. 예약
  10. 결제
  11. 상태 업데이트 scheduler
  12. log 기록 subscriber
    
  <details>
  <summary> 핵심 기능 설명 펼치기 </summary>
  <div markdown="1">

    
  </div>
  </details>
  
  [Postman](https://documenter.getpostman.com/view/26388948/2s93eeQUpz): 프로젝트 진행 시 Postman의 Documentation을 활용하여 프론트엔드와 소통하였습니다. <br>
 client가 사용한 모든 API를 Postman에서 확인할 수 있습니다.<br><br>
<br>

 ## 5. 핵심 트러블 슈팅
 
 <br>
 
 ## 6. 그 외 트러블 슈팅

<br>

 ## 7. 느낀점/회고
 > 3차 프로젝트 회고록: https://walwaldev.tistory.com
 <br>
 
 ## Reference

- 이 프로젝트는 [Airbnb](https://www.airbnb.co.kr/) 사이트를 참조하여 학습목적으로 만들었습니다.
- 실무수준의 프로젝트이지만 학습용으로 만들었기 때문에 이 코드를 활용하여 이득을 취하거나 무단 배포할 경우 법적으로 문제될 수 있습니다.
- 이 프로젝트에서 사용하고 있는 사진 대부분은 위코드에서 구매한 것이므로 해당 프로젝트 외부인이 사용할 수 없습니다.
