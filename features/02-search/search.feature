Feature: 검색

  Scenario: [TPS-042] 키워드 검색 결과 노출
    Given 홈 화면에 접속한다
    When 검색창에 "Solo Leveling"을 입력한다
    Then 검색 결과 페이지로 이동된다
    And 검색 결과 목록이 노출된다

  Scenario: [TPS-043] 검색 후 작품 클릭 시 시리즈 페이지 이동
    Given 홈 화면에 접속한다
    When 검색창에 "Solo Leveling"을 입력한다
    And 검색 결과에서 첫 번째 작품을 클릭한다
    Then 시리즈 페이지로 이동된다
