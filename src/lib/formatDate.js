export function formatDate(timestamp) {
    const date = new Date(timestamp);
    
    const formattedDate = date.toLocaleString("ko-KR", {
        month: "2-digit",  // 월 (2자리)
        day: "2-digit",    // 일 (2자리)
        weekday: "short",   // 요일 (줄임말)
    });

    const formattedTime = date.toLocaleString("ko-KR", {
        hour: "2-digit",   // 시간 (2자리)
        minute: "2-digit", // 분 (2자리)
    });

    const formattedFullDate = date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const formattedTimeWithSeconds = date.toLocaleString("ko-KR", {
        hour: "2-digit",    // 시간 (2자리)
        minute: "2-digit",  // 분 (2자리)
        second: "2-digit",  // 초 (2자리)
    });

    return {
        date: formattedDate,  // 예: "12/16(월)"
        time: formattedTime,  // 예: "08:55"
        full: formattedFullDate,
        timeWithSeconds: formattedTimeWithSeconds
    };
}