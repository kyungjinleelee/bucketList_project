document.addEventListener('DOMContentLoaded', () => {
    loadBuckets();
    document.getElementById('addBucket').addEventListener('click', addBucketToList);

    // 배경음악 재생 관련 코드 추가
    var playButton = document.getElementById('playButton');
    var bgm = document.getElementById('bgm');

    playButton.addEventListener('click', function() {
        if (bgm.paused) {
            bgm.play();
            playButton.textContent = 'Pause Music'; // 옵션: 버튼 텍스트를 'Pause Music'으로 변경
        } else {
            bgm.pause();
            playButton.textContent = 'Play Music';  // 옵션: 버튼 텍스트를 'Play Music'으로 변경
        }
    });
    // 배경음악 재생 관련 코드 종료
});

function addBucketToList() {
    const content = document.getElementById('newBucketContent').value.trim(); // 공백 제거
    if (content) {
        const bucketList = localStorage.getItem('buckets') ? JSON.parse(localStorage.getItem('buckets')) : [];
        const newBucket = {id: Date.now(), content: content};
        bucketList.push(newBucket);
        localStorage.setItem('buckets', JSON.stringify(bucketList));
        document.getElementById('newBucketContent').value = ''; // 입력창 초기화
        renderBucket();

        // 달성 상태 확인 및 로컬 스토리지에 저장된 경우 클래스 추가
        if (localStorage.getItem(content)) {
            document.querySelector(`[data-id="${newBucket.id}"]`).classList.add('done');
        }
    }
}

function loadBuckets() {
    renderBucket();
}

function renderBucket() {
    const bucketList = localStorage.getItem('buckets') ? JSON.parse(localStorage.getItem('buckets')) : [];
    const bucketListContainer = document.querySelector('.flex-row.wrap');
    bucketListContainer.innerHTML = ''; // 기존 목록 초기화
    bucketList.forEach(bucket => {
        const bucketDiv = document.createElement('div');
        bucketDiv.classList.add('bucket', 'bucket-item');
        if (localStorage.getItem(bucket.content)) {
            bucketDiv.classList.add('done');
        }
        const randomImgNumber = Math.floor(Math.random() * 6) + 1;
        bucketDiv.classList.add(`img${randomImgNumber}-t5`);
        bucketDiv.setAttribute('data-id', bucket.id); // 달성 상태 토글을 위한 id 할당
        bucketDiv.innerHTML = `
            <p>${bucket.content}</p>
            <div class="delete-btn" onclick="deleteBucket(${bucket.id})">
                <img src="assets/images/Delete.png" alt="Delete"/>
            </div>
        `;
        bucketListContainer.appendChild(bucketDiv);

        // 아이템 클릭 이벤트 리스너 추가
        bucketDiv.addEventListener('click', function() {
            if (!bucketDiv.classList.contains('done')) {
                alert('달성을 축하합니다!');
                bucketDiv.classList.add('done');
                localStorage.setItem(bucket.content, 'done');
            } else {
                bucketDiv.classList.remove('done');
                localStorage.removeItem(bucket.content);
            }
        });
    });
}

function deleteBucket(id) {
    let bucketList = localStorage.getItem('buckets') ? JSON.parse(localStorage.getItem('buckets')) : [];
    bucketList = bucketList.filter(bucket => bucket.id !== id);
    localStorage.setItem('buckets', JSON.stringify(bucketList));
    renderBucket();
}
