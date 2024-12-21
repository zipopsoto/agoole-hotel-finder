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
    recentSearches = recentSearches.slice(0, 5);
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

// Initialize
if (document.getElementById('search-form')) {
    document.getElementById('search-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const urlInput = document.getElementById('url-input');
        const validation = validateUrl(urlInput.value);
        
        if (!validation.isValid) {
            alert(validation.message);
            return;
        }
        
        saveRecentSearch(urlInput.value);
        window.location.href = `results.html?url=${encodeURIComponent(urlInput.value)}`;
    });
    
    displayRecentSearches();
}

// Results page
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

            cidList.forEach(item => {
                params.set('cid', item.cid);
                const newUrl = `${urlObj.origin}${urlObj.pathname}?${params.toString()}`;
                
                if (isMobile()) {
                    const link = document.createElement('a');
                    link.href = newUrl;
                    link.textContent = `${item.name}을 통해 가격 확인`;
                    link.className = 'result-link';
                    link.target = '_blank';
                    resultsDiv.appendChild(link);
                } else {
                    const button = document.createElement('button');
                    button.textContent = `${item.name}을 통해 가격 확인`;
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
        
        hideLoading();
    }, 1000);
}
