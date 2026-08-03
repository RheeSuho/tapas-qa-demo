Feature: GNB 네비게이션

  Background:
    Given 홈 화면에 접속한다

  Scenario: [TPS-010] GNB > Comics 탭 클릭
    When GNB에서 "Comics" 탭을 클릭한다
    Then Comics 홈 화면으로 이동된다
    And 작품 목록이 노출된다

  Scenario: [TPS-011] GNB > Novels 탭 클릭
    When GNB에서 "Novels" 탭을 클릭한다
    Then Novels 홈 화면으로 이동된다
    And 작품 목록이 노출된다

  Scenario: [TPS-012] 로고 클릭 시 홈으로 복귀
    When GNB에서 "Comics" 탭을 클릭한다
    And Tapas 로고를 클릭한다
    Then 홈 화면으로 이동된다
