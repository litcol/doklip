document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 가져오기
    const hangulInput = document.getElementById('hangul-input');
    const numberInput = document.getElementById('number-input');
    const toNumBtn = document.getElementById('to-number-btn');
    const toHanBtn = document.getElementById('to-hangul-btn');

    // 변환 맵 정의
    const CHOSEONG = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const JUNGSEONG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
    const JONGSEONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

    const CODE_CHO = { 'ㄱ': '11', 'ㄲ': '15', 'ㄴ': '12', 'ㄷ': '13', 'ㄸ': '26', 'ㄹ': '14', 'ㅁ': '15', 'ㅂ': '16', 'ㅃ': '27', 'ㅅ': '17', 'ㅆ': '28', 'ㅇ': '18', 'ㅈ': '19', 'ㅉ': '29', 'ㅊ': '20', 'ㅋ': '21', 'ㅌ': '22', 'ㅍ': '23', 'ㅎ': '24' };
    const CODE_JUNG = { 'ㅏ': '30', 'ㅐ': '34', 'ㅑ': '31', 'ㅒ': '35', 'ㅓ': '32', 'ㅔ': '36', 'ㅕ': '33', 'ㅖ': '37', 'ㅗ': '38', 'ㅘ': '42', 'ㅙ': '43', 'ㅚ': '44', 'ㅛ': '39', 'ㅜ': '40', 'ㅝ': '46', 'ㅞ': '47', 'ㅟ': '48', 'ㅠ': '41', 'ㅡ': '45', 'ㅢ': '49', 'ㅣ': '45' }; // 원본 이미지에서 ㅡ와 ㅣ가 모두 45로 되어있어 그대로 반영
    const CODE_JONG = { '': '', 'ㄱ': '0011', 'ㄲ': '0019', 'ㄳ': '', 'ㄴ': '0012', 'ㄵ': '', 'ㄶ': '', 'ㄷ': '0013', 'ㄹ': '0014', 'ㄺ': '0031', 'ㄻ': '0032', 'ㄼ': '0033', 'ㄽ': '', 'ㄾ': '', 'ㄿ': '', 'ㅀ': '0034', 'ㅁ': '0015', 'ㅂ': '0016', 'ㅄ': '0035', 'ㅅ': '0017', 'ㅆ': '0026', 'ㅇ': '0018', 'ㅈ': '0020', 'ㅊ': '0022', 'ㅋ': '0021', 'ㅌ': '0022', 'ㅍ': '0023', 'ㅎ': '0024' }; // 표에 없는 종성은 빈 값으로 처리

    // 숫자 코드를 문자로 변환하기 위한 역방향 맵
    const REV_CODE_CHO = Object.fromEntries(Object.entries(CODE_CHO).map(([k, v]) => [v, k]));
    const REV_CODE_JUNG = Object.fromEntries(Object.entries(CODE_JUNG).map(([k, v]) => [v, k]));
    const REV_CODE_JONG = Object.fromEntries(Object.entries(CODE_JONG).map(([k, v]) => [v, k]));

    // 한글 -> 숫자 변환 함수
    function convertToNumber() {
        const text = hangulInput.value;
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charCode = char.charCodeAt(0);

            if (charCode >= 0xAC00 && charCode <= 0xD7A3) { // 한글 음절 범위
                const sylCode = charCode - 0xAC00;
                const jongseongIndex = sylCode % 28;
                const jungseongIndex = ((sylCode - jongseongIndex) / 28) % 21;
                const choseongIndex = Math.floor(((sylCode - jongseongIndex) / 28) / 21);

                const cho = CHOSEONG[choseongIndex];
                const jung = JUNGSEONG[jungseongIndex];
                const jong = JONGSEONG[jongseongIndex];
                
                result += (CODE_CHO[cho] || '') + (CODE_JUNG[jung] || '') + (CODE_JONG[jong] || '');
            } else {
                result += char; // 한글이 아니면 그대로 추가
            }
        }
        numberInput.value = result;
    }

    // 숫자 -> 한글 변환 함수
    function convertToHangul() {
        let code = numberInput.value.replace(/\s/g, '');
        let result = '';
        
        while (code.length > 0) {
            // 초성 (2자리)
            const choCode = code.substring(0, 2);
            if (!REV_CODE_CHO[choCode]) { result += code; break; } // 유효하지 않으면 종료
            const cho = REV_CODE_CHO[choCode];
            code = code.substring(2);

            // 중성 (2자리)
            const jungCode = code.substring(0, 2);
            if (!REV_CODE_JUNG[jungCode]) { result += cho; continue; } // 유효하지 않으면 현재까지 변환된것만 반영
            const jung = REV_CODE_JUNG[jungCode];
            code = code.substring(2);

            // 종성 (4자리, '00'으로 시작)
            let jong = '';
            if (code.startsWith('00')) {
                const jongCode = code.substring(0, 4);
                if (REV_CODE_JONG[jongCode]) {
                    jong = REV_CODE_JONG[jongCode];
                    code = code.substring(4);
                }
            }

            // 한글 조합
            const choseongIndex = CHOSEONG.indexOf(cho);
            const jungseongIndex = JUNGSEONG.indexOf(jung);
            const jongseongIndex = JONGSEONG.indexOf(jong);

            if (choseongIndex !== -1 && jungseongIndex !== -1) {
                 const combinedCode = 0xAC00 + (choseongIndex * 21 * 28) + (jungseongIndex * 28) + jongseongIndex;
                 result += String.fromCharCode(combinedCode);
            } else {
                 result += cho + jung + jong; // 조합 실패 시 분해된 채로 추가
            }
        }
        hangulInput.value = result;
    }

    // 버튼 클릭 이벤트 리스너
    toNumBtn.addEventListener('click', convertToNumber);
    toHanBtn.addEventListener('click', convertToHangul);
});