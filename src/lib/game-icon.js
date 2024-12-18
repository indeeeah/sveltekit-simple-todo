export const getSportsEmoticon = (sport) => {
    let emoticon;
    switch (sport) {
        case "Soccer":
            emoticon = "⚽";  // 축구
            break;
        case "Basketball":
            emoticon = "🏀";  // 농구
            break;
        case "Tennis":
            emoticon = "🎾";  // 테니스
            break;
        case "Baseball":
            emoticon = "⚾";  // 야구
            break;
        case "Golf":
            emoticon = "🏌️‍♂️";  // 골프
            break;
        case "Rugby":
            emoticon = "🏉";  // 럭비
            break;
        case "Cricket":
            emoticon = "🏏";  // 크리켓
            break;
        case "Hockey":
            emoticon = "🏒";  // 아이스하키
            break;
        case "Boxing":
            emoticon = "🥊";  // 복싱
            break;
        case "Football":
            emoticon = "🏈";  // 미식축구
            break;
        case "Volleyball":
            emoticon = "🏐";  // 배구
            break;
        case "Cycling":
            emoticon = "🚴‍♂️";  // 사이클링
            break;
        default:
            emoticon = "🏅";  // 기본 이모티콘 (모든 스포츠가 아닌 경우)
            break;
    }
    return emoticon;
}

export const getEventIcon = (eventCode) => {
    switch (eventCode) {
        case 1024: // Attack home
        case 2048: // Attack Away
            return "⚔️"; // 공격
        case 1025: // Corner home
        case 2049: // Corner Away
            return "⚽️"; // 코너킥
        case 1026: // Dangerous attack Home
        case 2050: // Dangerous attack Away
            return "🚨"; // 위험한 공격
        case 1027: // Dangerous free kick Home
        case 2051: // Dangerous free kick Away
            return "🆘"; // 위험한 자유킥
        case 1028: // Free kick Home
        case 2052: // Free kick Away
            return "⚡️"; // 자유킥
        case 1029: // Goal Home
        case 2053: // Goal Away
            return "🏆"; // 골
        case 1030: // Cancel goal Home
        case 2054: // Cancel goal Away
            return "❌"; // 골 취소
        case 1031: // Penalty Home
        case 2055: // Penalty Away
            return "🎯"; // 페널티
        case 1032: // Red card Home
        case 2056: // Red card Away
            return "🟥"; // 레드 카드
        case 1034: // Yellow card Home
        case 2058: // Yellow card Away
            return "🟨"; // 옐로우 카드
        case 1039: // Shot on target Home
        case 2063: // Shot on target Away
            return "🎯"; // 정확한 슛
        case 1040: // Shot off target Home
        case 2064: // Shot off target Away
            return "❌"; // 빗나간 슛
        case 1041: // Shot woodwork Home
        case 2065: // Shot woodwork Away
            return "🪵"; // 나무맞은 슛
        case 1042: // Foul Home
        case 2066: // Foul Away
            return "⚠️"; // 파울
        case 1043: // Offside Home
        case 2067: // Offside Away
            return "🚫"; // 오프사이드
        case 1044: // Kickoff Home
        case 2068: // Kickoff Away
            return "🏁"; // 킥오프
        case 1045: // Yellow/red card Home
        case 2069: // Yellow/red card Away
            return "🟨🟥"; // 옐로우/레드 카드
        case 1046: // Cancel yellow/red card Home
        case 2070: // Cancel yellow/red card Away
            return "❌🟨🟥"; // 옐로우/레드 카드 취소
        case 1047: // Cancel red card Home
        case 2071: // Cancel red card Away
            return "❌🟥"; // 레드 카드 취소
        case 1048: // Cancel yellow card Home
        case 2072: // Cancel yellow card Away
            return "❌🟨"; // 옐로우 카드 취소
        case 1049: // Cancel penalty Home
        case 2073: // Cancel penalty Away
            return "❌🎯"; // 페널티 취소
        case 1050: // Cancel corner Home
        case 2074: // Cancel corner Away
            return "❌⚽️"; // 코너킥 취소
        case 1051: // Safe Home
        case 2075: // Safe Away
            return "🛡️"; // 안전
        case 1052: // Danger Home
        case 2076: // Danger Away
            return "⚠️"; // 위험
        case 1053: // Goal kick Home
        case 2077: // Goal kick Away
            return "⚽️🦶"; // 골킥
        case 1054: // Throw in Home
        case 2078: // Throw in Away
            return "↩️"; // 스로인
        case 1055: // Substitution Home
        case 2079: // Substitution Away
            return "🔄"; // 교체
        case 1058: // Shot blocked Home
        case 2082: // Shot blocked Away
            return "🛑"; // 슛 차단
        case 1059: // Retake penalty Home
        case 2083: // Retake penalty Away
            return "🔁🎯"; // 페널티 재시도
        case 1060: // Missed penalty Home
        case 2084: // Missed penalty Away
            return "❌🎯"; // 페널티 실패
        case 1062: // Possible Penalty Home
        case 2086: // Possible Penalty Away
            return "🔮🎯"; // 가능성 있는 페널티
        case 1064: // Breakaway Home
        case 2088: // Breakaway Away
            return "🏃‍♂️💨"; // 브레이크어웨이
        case 1065: // Goal confirmation Home
        case 2089: // Goal confirmation Away
            return "✅🏆"; // 골 확인
        case 1066: // Possible corner Home
        case 2090: // Possible corner Away
            return "🔮⚽️"; // 가능성 있는 코너
        case 1067: // No corner Home
        case 2091: // No corner Away
            return "❌⚽️"; // 코너 없음
        case 1068: // Yellow card confirmed Home
        case 2092: // Yellow card confirmed Away
            return "✔️🟨"; // 옐로우 카드 확인
        case 1069: // Yellow/red card confirmed Home
        case 2093: // Yellow/red card confirmed Away
            return "✔️🟨🟥"; // 옐로우/레드 카드 확인
        case 1070: // Red card confirmed Home
        case 2094: // Red card confirmed Away
            return "✔️🟥"; // 레드 카드 확인
        case 1071: // Possible free kick Home
        case 2095: // Possible free kick Away
            return "🔮⚡️"; // 가능성 있는 자유킥
        case 1072: // Penalty Shootout Home Team’s turn
        case 2096: // Penalty Shootout Away Team’s turn
            return "⚽️🏆"; // 페널티 슈팅
        case 1073: // Possible throw-in Home
        case 2097: // Possible Throw in Away
            return "🔮↩️"; // 가능성 있는 스로인
        case 1074: // Safe - ball position Home
        case 2098: // Safe - ball position Away
            return "🛡️⚽️"; // 안전 - 공 위치
        case 1075: // Attack - ball position Home
        case 2099: // Attack - ball position Away
            return "⚔️⚽️"; // 공격 - 공 위치
        case 1076: // Danger - ball position Home
        case 2100: // Danger - ball position Away
            return "🚨⚽️"; // 위험 - 공 위치
        case 1077: // Breakaway - ball position Home
        case 2101: // Breakaway - ball position Away
            return "🏃‍♂️💨⚽️"; // 브레이크어웨이 - 공 위치
        case 1078: // Expected goal Home
        case 2102: // Expected goal Away
            return "📊⚽️"; // 예상 골
        case 1079: // Expected goal update Home
        case 2103: // Expected goal update Away
            return "📊⚽️🔄"; // 예상 골 업데이트
        case 1080: // Player injured Home
        case 2104: // Player injured Away
            return "🚑"; // 선수 부상
        case 1081: // RB's XG Home
        case 2105: // RB's XG Away
            return "📊⚽️"; // 예상 골 (RB)
        case 1082: // RB's XG's update Home
        case 2106: // RB's XG's update Away
            return "📊⚽️🔄"; // 예상 골 업데이트 (RB)
        default:
            return ""; // 알 수 없는 이벤트
    }
};