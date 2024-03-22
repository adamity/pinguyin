const textArea = document.getElementById("pinyinArea");
if (localStorage.getItem('pinyin')) {
    textArea.value = localStorage.getItem('pinyin');
    countWords();
}

let timeOutId;
textArea.addEventListener("input", function () {
    clearTimeout(timeOutId); // Clear the timeout if user still typing
    timeOutId = setTimeout(convertInput, 500); // Set a timeout to execute conversion 500ms after user stops typing
});

function convertInput() {
    // Split the textarea value into words, convert each word, then rejoin back
    let words = textArea.value.split(' ');
    let pinyinArray = words.map(word => {
        let convertedPinyin = convertToPinyinTone(word); // Assume the function is already defined
        return convertedPinyin;
    });
    textArea.value = pinyinArray.join(' ');
    localStorage.setItem('pinyin', textArea.value);
    countWords();
}

function countWords() {
    let wordCount = textArea.value.length > 0 ? textArea.value.split(' ').length : 0;
    let charCount = textArea.value.length;
    document.getElementById("wordCounter").innerHTML = wordCount + " / " + charCount;
}

function convertToPinyinTone(pinyinNumbered) {
    const toneMap = {
        'a1': 'ā', 'a2': 'á', 'a3': 'ǎ', 'a4': 'à',
        'e1': 'ē', 'e2': 'é', 'e3': 'ě', 'e4': 'è',
        'i1': 'ī', 'i2': 'í', 'i3': 'ǐ', 'i4': 'ì',
        'o1': 'ō', 'o2': 'ó', 'o3': 'ǒ', 'o4': 'ò',
        'u1': 'ū', 'u2': 'ú', 'u3': 'ǔ', 'u4': 'ù',
        'v1': 'ǖ', 'v2': 'ǘ', 'v3': 'ǚ', 'v4': 'ǜ'
    };

    // Rule 1: Special case handling for "n", "ng", "r".
    pinyinNumbered = pinyinNumbered.replace(/(n|ng|r)([1-4])$/, "$2$1");

    // Rule 2: A tone number following "a", "e", "o" and in "iu", "ui" should be shifted
    pinyinNumbered = pinyinNumbered.replace(/(a|e|o|iu|ui)([1-4])/, "$1$2");

    // Rule 3: Tone number should be placed after first vowel for other cases
    pinyinNumbered = pinyinNumbered.replace(/([aeiou])([a-z]*)([1-4])/, "$1$3$2");

    // Convert to pinyin tone
    Object.keys(toneMap).forEach((k) => {
        const regex = new RegExp(k, 'g');
        pinyinNumbered = pinyinNumbered.replace(regex, toneMap[k]);
    });

    return pinyinNumbered;
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function downloadTxt() {
    let text = textArea.value;
    let filename = "pinyin"
    let random = Math.floor(Math.random() * 1000000000);
    filename += random.toString();
    filename += ".txt";
    let blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
}

function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}