const cidList = [
    // [검색 카테고리]
    { name: "구글지도1", cid: "1833981", avgPrice: 12 },
    { name: "구글지도2", cid: "1917614", avgPrice: 24 },
    { name: "구글지도3", cid: "1829968", avgPrice: 36 },
    { name: "구글 검색1", cid: "1908612" },
    { name: "구글 검색2", cid: "1922868" },
    { name: "구글 검색3", cid: "1922887" },
    { name: "네이버 검색1", cid: "1891504" },
    // [카드사 카테고리]
    { name: "국민카드", cid: "1563295" },
    { name: "우리카드", cid: "1654104" },
    { name: "우리(마스터)", cid: "1932810" },
    { name: "BC카드", cid: "1748498" },
    { name: "신한(마스터)", cid: "1917257" },
    { name: "신한카드", cid: "1760133", avgPrice: 38 },
    { name: "토스", cid: "1917334", avgPrice: 29 },
    { name: "하나", cid: "1729471" },
    { name: "카카오페이", cid: "1845109" },
    { name: "마스터카드", cid: "1889572" },
    { name: "유니온페이", cid: "1801110" },
    { name: "비자", cid: "1889319" },
    // [항공사 카테고리]
    { name: "대한항공(적립)", cid: "1904827" },
    { name: "아시아나항공(적립)", cid: "1806212" },
    { name: "에어서울", cid: "1800120", avgPrice: 32 }
];

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function showLoading() {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.style.display = 'block';
}

function hideLoading() {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.style.display = 'none';
}

function validateUrl(url) {
    try {
        const urlObj = new URL(url);
        if (!urlObj.hostname.includes('agoda.com')) {
            return { isValid: false, message: '아고다 호텔 링크가 아닙니다.' };
        }
        const params = new URLSearchParams(urlObj.search);
        if (!params.has('cid')) {
            return { isValid: false, message: '올바른 아고다 호텔 링크가 아닙니다.' };
        }
        return { isValid: true };
    } catch (error) {
        return { isValid: false, message: '올바른 URL 형식이 아닙니다.' };
    }
}

function getHotelTitle(url) {
    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const hotelName = pathParts[2] || '호텔';
        return hotelName.replace(/-/g, ' ').replace('.html', '');
    } catch (error) {
        return '알 수 없는 호텔';
    }
}

function saveRecentSearch(url) {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const searchItem = { url: url, title: getHotelTitle(url), timestamp: new Date().getTime() };
    recentSearches = recentSearches.filter(item => item.url !== url);
    recentSearches.unshift(searchItem);
    recentSearches = recentSearches.slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}

function displayRecentSearches() {
    const recentList = document.getElementById('recent-list');
    if (!recentList) return;
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    recentList.innerHTML = '';
    recentSearches.forEach(item => {
        const button = document.createElement('button');
        button.className = 'recent-item';
        button.innerHTML = `${item.title}`;
        button.onclick = () => {
            window.location.href = `results.html?url=${encodeURIComponent(item.url)}`;
        };
        recentList.appendChild(button);
    });
}

if (document.getElementById('search-form')) {
    document.getElementById('search-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const urlInput = document.getElementById('url-input');
        const validation = validateUrl(urlInput.value);
        if (!validation.isValid) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = validation.message;
            const existingError = document.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            document.querySelector('.search-container').appendChild(errorDiv);
            return;
        }
        saveRecentSearch(urlInput.value);
        window.location.href = `results.html?url=${encodeURIComponent(urlInput.value)}`;
    });
    displayRecentSearches();
}

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        faqItem.classList.toggle('active');
    });
});

if (document.getElementById('results')) {
    convertUrl();
}

function convertUrl() {
    showLoading();
    setTimeout(() => {
        const inputUrl = getUrlParameter('url');
        const resultsDiv = document.getElementById('results');
        const errorDiv = document.getElementById('error-message');
        resultsDiv.innerHTML = '';
        errorDiv.innerHTML = '';

        if (!inputUrl) {
            errorDiv.textContent = 'URL을 입력해주세요.';
            hideLoading();
            return;
        }

        try {
            const urlObj = new URL(inputUrl);
            const params = new URLSearchParams(urlObj.search);
            if (!params.has('cid')) {
                errorDiv.textContent = '입력하신 링크는 아고다 호텔이 아닌 것 같아요.';
                hideLoading();
                return;
            }

            cidList.forEach(category => {
                const button = document.createElement('a');
                button.href = `${inputUrl}&cid=${category.cid}`;
                button.target = '_blank';
                button.className = 'result-link';
                button.textContent = `${category.name} 경유 바로가기`;
                resultsDiv.appendChild(button);
            });

            hideLoading();
        } catch (error) {
            errorDiv.textContent = '유효하지 않은 URL입니다.';
            hideLoading();
        }
    }, 1000);
}
