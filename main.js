
class LottoBall extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const number = this.getAttribute('number');
        const color = this.getColor(number);

        this.shadowRoot.innerHTML = `
            <style>
                .ball {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 24px;
                    font-weight: bold;
                    color: white;
                    background-color: ${color};
                    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
                }
            </style>
            <div class="ball">${number}</div>
        `;
    }

    getColor(number) {
        if (number <= 10) return '#fbc400'; // Yellow
        if (number <= 20) return '#69c8f2'; // Blue
        if (number <= 30) return '#ff7272'; // Red
        if (number <= 40) return '#aaa';     // Gray
        return '#b0d840';      // Green
    }
}

customElements.define('lotto-ball', LottoBall);

const lottoNumbersContainer = document.getElementById('lotto-numbers');
const generateBtn = document.getElementById('generate-btn');

generateBtn.addEventListener('click', () => {
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach(number => {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        lottoNumbersContainer.appendChild(lottoBall);
    });
});

const partnerForm = document.getElementById('partner-form');
const formStatus = document.getElementById('form-status');

partnerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = partnerForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    formStatus.classList.remove('error');
    formStatus.textContent = '문의가 전송 중입니다.';

    try {
        const response = await fetch(partnerForm.action, {
            method: partnerForm.method,
            body: new FormData(partnerForm),
            headers: { Accept: 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Formspree request failed');
        }

        partnerForm.reset();
        formStatus.textContent = '문의가 접수되었습니다.';
    } catch (error) {
        formStatus.classList.add('error');
        formStatus.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
    } finally {
        submitButton.disabled = false;
    }
});

