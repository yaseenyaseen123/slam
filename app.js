// Global audio control functions
window.isPlaying = false;
window.audioElement = null;
window.audioBtn = null;

window.toggleAudio = function() {
    if (!window.audioElement) window.audioElement = document.getElementById('backgroundAudio');
    if (!window.audioBtn) window.audioBtn = document.getElementById('audioControlBtn');
    
    const siteData = JSON.parse(localStorage.getItem('siteData') || '{}');
    
    console.log('تم الضغط على زر الصوت');
    console.log('الرابط الحالي:', window.audioElement.src);
    
    if (!window.audioElement.src || window.audioElement.src === window.location.href) {
        const savedAudioUrl = siteData.basic?.backgroundAudio;
        console.log('الرابط المحفوظ:', savedAudioUrl);
        
        if (savedAudioUrl) {
            let audioUrl = savedAudioUrl;
            const vocarooMatch = audioUrl.match(/voca\.ro\/([a-zA-Z0-9]+)/);
            if (vocarooMatch) {
                audioUrl = `https://media1.vocaroo.com/mp3/${vocarooMatch[1]}.mp3`;
                console.log('تم التحويل إلى:', audioUrl);
            }
            
            window.audioElement.src = audioUrl;
            window.audioElement.load();
            console.log('تم تحميل الصوت من:', audioUrl);
        } else {
            alert('لم يتم تحديد ملف صوتي.\n\nالخطوات:\n1. افتح لوحة التحكم (admin.html)\n2. اذهب لتبويب "المعلومات الأساسية"\n3. في حقل "موسيقى الخلفية" الصق الرابط\n4. اضغط "حفظ التغييرات"\n5. حدّث هذه الصفحة');
            return;
        }
    }
    
    if (window.isPlaying) {
        window.audioElement.pause();
        window.audioBtn.textContent = '🔇';
        window.audioBtn.classList.remove('playing');
        window.isPlaying = false;
        console.log('تم إيقاف الصوت');
    } else {
        console.log('محاولة تشغيل الصوت...');
        window.audioElement.play().then(() => {
            window.audioBtn.textContent = '🔊';
            window.audioBtn.classList.add('playing');
            window.isPlaying = true;
            console.log('✅ تم تشغيل الصوت بنجاح!');
        }).catch(error => {
            console.error('❌ خطأ في تشغيل الصوت:', error);
            alert('تعذر تشغيل الصوت:\n' + error.message);
        });
    }
};

window.closePopup = function() {
    const popup = document.getElementById('welcomePopup');
    popup.classList.remove('active');
    
    const siteData = JSON.parse(localStorage.getItem('siteData') || '{}');
    const audioElement = document.getElementById('backgroundAudio');
    
    if (siteData.basic && siteData.basic.backgroundAudio && audioElement.src) {
        setTimeout(() => {
            window.toggleAudio();
        }, 500);
    }
};

window.clearCacheAndReload = function() {
    if (confirm('سيتم حذف الكاش وتحديث الصفحة. هل تريد المتابعة؟')) {
        localStorage.clear();
        
        if ('caches' in window) {
            caches.keys().then(function(names) {
                for (let name of names) {
                    caches.delete(name);
                }
            });
        }
        
        window.location.reload(true);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('welcomePopup');
    popup.classList.add('active');
    
    window.audioElement = document.getElementById('backgroundAudio');
    window.audioBtn = document.getElementById('audioControlBtn');
    
    const siteData = JSON.parse(localStorage.getItem('siteData') || '{}');
    
    if (siteData.basic) {
        // Update profile image
        if (siteData.basic.profileImage) {
            const profileImg = document.querySelector('.profile-img');
            if (profileImg) profileImg.src = siteData.basic.profileImage;
        }
        
        // Update background image
        if (siteData.basic.backgroundImage) {
            const style = document.createElement('style');
            style.textContent = `
                body::before {
                    background-image: url('${siteData.basic.backgroundImage}') !important;
                }
                .popup-content::before {
                    background-image: url('${siteData.basic.backgroundImage}') !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Update background audio
        if (siteData.basic.backgroundAudio) {
            let audioUrl = siteData.basic.backgroundAudio;
            
            const vocarooMatch = audioUrl.match(/voca\.ro\/([a-zA-Z0-9]+)/);
            if (vocarooMatch) {
                audioUrl = `https://media1.vocaroo.com/mp3/${vocarooMatch[1]}.mp3`;
            }
            
            console.log('تحميل الصوت من:', audioUrl);
            window.audioElement.src = audioUrl;
            window.audioElement.load();
            window.audioBtn.style.display = 'flex';
            
            window.audioElement.addEventListener('error', function(e) {
                console.error('خطأ في تحميل الملف الصوتي:', e);
                window.audioBtn.style.display = 'none';
            });
            
            window.audioElement.addEventListener('loadeddata', function() {
                console.log('✅ تم تحميل الملف الصوتي بنجاح!');
            });
        } else {
            window.audioBtn.style.display = 'none';
        }
    }
});
