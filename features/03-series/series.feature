Feature: 시리즈 페이지

  Background:
    Given "Solo Leveling" 시리즈 페이지에 접속한다

  Scenario: [TPS-060] 시리즈 페이지 기본 정보 노출
    Then 작품 제목이 노출된다
    And 회차 목록이 노출된다
    And 구독 버튼이 노출된다

  Scenario: [TPS-061] 첫 번째 에피소드 클릭 시 뷰어로 이동
    When 첫 번째 에피소드를 클릭한다
    Then 에피소드 뷰어로 이동된다
