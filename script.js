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

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('results').style.display = 'block';
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

function saveRecentSearch(url) {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const urlObj = new URL(url);
    const hotelPath = urlObj.pathname.split('/')[2] || '호텔';
    const searchItem = {
        url: url,
        title: hotelPath.replace(/-/g, ' ').replace('.html', ''),
        timestamp: new Date().getTime()
    };
    
    recentSearches.unshift(searchItem);
    recentSearches = recentSearches.slice(0, 5); // 최근 5개만 저장
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}

function displayRecentSearches() {
    const recentList = document.getElementById('recent-list');
    if (!recentList) return;
    
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    recentList.innerHTML = '';
    
    recentSearches.forEach(item => {
        const div = document.createElement('div');
        div.className = 'recent-item';
        div.innerHTML = `
            <div class="recent-item-title">${item.title}</div>
            <div class="recent-item-url">${item.url}</div>
        `;
        div.onclick = () => {
            document.getElementById('url-input').value = item.url;
        };
        recentList.appendChild(div);
    });
}

function convertUrl() {
    showLoading();

    setTimeout
