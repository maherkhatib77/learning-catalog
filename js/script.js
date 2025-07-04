document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.solution-card').forEach(card => {
        const subject = card.getAttribute('data-subject');
        const imageDiv = card.querySelector('.card-image');

        let imagePath = '';
        switch (subject) {
            case 'מתמטיקה':
                imagePath = 'assets/images/math.png';
                break;
            case 'מדעים':
                imagePath = 'assets/images/science.png';
                break;
            case 'שפה עברית':
                imagePath = 'assets/images/hebrew.png';
                break;
            case 'אנגלית':
                imagePath = 'assets/images/english.png';
                break;
            case 'היסטוריה':
                imagePath = 'assets/images/history.png';
                break;
            case 'חינוך מיוחד':
                imagePath = 'assets/images/special-edu.png';
                break;
            default:
                imagePath = 'assets/images/default.png'; // אם יש
        }

        imageDiv.innerHTML = `<img src="${imagePath}" alt="${subject}" style="width: 100%; height: 100%; object-fit: cover;">`;
    });
});
