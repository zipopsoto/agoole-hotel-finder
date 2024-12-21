const cidList = [
    { name: "구글맵", cid: "1833981" },
    { name: "국민카드", cid: "1917614" },
    { name: "신한카드", cid: "1829968" }
];

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function convertUrl() {
    const inputUrl = getUrlParameter('url');
    const resultsDiv = document.getElementById('results');
    const errorDiv = document.getElementById('error-message');
    resultsDiv.innerHTML = '';
    errorDiv.innerHTML = '';

    if (!inputUrl) {
        errorDiv.textContent = 'URL을 입력해주세요.';
        return;
    }

    try {
        const urlObj = new URL(inputUrl);
        const params = new URLSearchParams(urlObj.search);

        if (!params.has('cid')) {
            errorDiv.textContent = '입력하신 링크는 아고다 호텔이 아닌 것 같아요.';
            return;
        }

        cidList.forEach(item => {
            params.set('cid', item.cid);
            const newUrl = `${urlObj.origin}${urlObj.pathname}?${params.toString()}`;
            
            if (isMobile()) {
                const link = document.createElement('a');
                link.href = newUrl;
                link.textContent = `${item.name} 통해 바로가기`;
                link.className = 'result-link';
                link.target = '_blank';
                resultsDiv.appendChild(link);
            } else {
                const button = document.createElement('button');
                button.textContent = `${item.name} 링크 복사`;
                button.className = 'result-button';
                button.onclick = function() {
                    navigator.clipboard.writeText(newUrl).then(() => {
                        alert('링크가 클립보드에 복사되었습니다.');
                    });
                };
                resultsDiv.appendChild(button);
            }
        });
    } catch (error) {
        errorDiv.textContent = '올바른 URL을 입력해주세요.';
    }
}

window.onload = convertUrl;
