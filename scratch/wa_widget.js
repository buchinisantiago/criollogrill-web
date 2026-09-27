// --- WHATSAPP WIDGET ---
document.addEventListener('DOMContentLoaded', () => {
    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .wa-widget {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        .wa-button {
            width: 60px;
            height: 60px;
            background-color: #25D366;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
        }
        .wa-button:hover {
            transform: scale(1.1);
        }
        .wa-chat-box {
            width: 320px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.2);
            overflow: hidden;
            margin-bottom: 20px;
            display: none;
            flex-direction: column;
            transform-origin: bottom right;
            animation: wa-pop 0.3s ease forwards;
        }
        @keyframes wa-pop {
            0% { opacity: 0; transform: scale(0.5); }
            100% { opacity: 1; transform: scale(1); }
        }
        .wa-chat-box.active {
            display: flex;
        }
        .wa-header {
            background-color: #075E54;
            color: white;
            padding: 15px;
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
        }
        .wa-avatar img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: contain;
            background: #fff;
            padding: 2px;
        }
        .wa-header-info {
            display: flex;
            flex-direction: column;
        }
        .wa-header-info strong {
            font-size: 1rem;
            font-weight: 600;
        }
        .wa-header-info span {
            font-size: 0.8rem;
            opacity: 0.8;
        }
        .wa-close {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0.7;
        }
        .wa-close:hover { opacity: 1; }
        .wa-body {
            padding: 20px;
            background-color: #e5ddd5;
            background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
            height: 180px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }
        .wa-message {
            background: #fff;
            padding: 12px 15px;
            border-radius: 0 12px 12px 12px;
            font-size: 0.95rem;
            color: #303030;
            max-width: 85%;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            position: relative;
            margin-top: auto;
        }
        .wa-message::before {
            content: '';
            position: absolute;
            top: 0;
            left: -8px;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 8px 8px 0;
            border-color: transparent #fff transparent transparent;
        }
        .wa-footer {
            padding: 10px;
            background: #f0f0f0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .wa-footer input {
            flex: 1;
            border: none;
            padding: 12px 15px;
            border-radius: 20px;
            outline: none;
            font-size: 0.95rem;
            color: #333;
        }
        .wa-footer button {
            background: #008f68;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: background 0.2s;
        }
        .wa-footer button:hover { background: #007a58; }
        
        @media (max-width: 768px) {
            .wa-widget { bottom: 20px; right: 20px; }
        }
    `;
    document.head.appendChild(style);

    // Inject HTML
    const widget = document.createElement('div');
    widget.className = 'wa-widget';
    widget.id = 'wa-widget';
    
    // Check lang for greeting
    const currentLang = localStorage.getItem('criollo_lang') || 'en';
    let greeting = "Hola ¿cómo estás? ¿te puedo ayudar?";
    if (currentLang === 'en') greeting = "Hi, how are you? How can I help you?";
    if (currentLang === 'dk') greeting = "Hej, hvordan har du det? Kan jeg hjælpe dig?";

    widget.innerHTML = `
        <div class="wa-chat-box" id="wa-chat-box">
            <div class="wa-header">
                <div class="wa-avatar">
                    <img src="img/Criollo 2.png" alt="Criollo Grill">
                </div>
                <div class="wa-header-info">
                    <strong>Criollo Grill</strong>
                    <span>Online</span>
                </div>
                <button class="wa-close" id="wa-close">&times;</button>
            </div>
            <div class="wa-body">
                <div class="wa-message">${greeting}</div>
            </div>
            <div class="wa-footer">
                <input type="text" id="wa-input" placeholder="Escribe un mensaje..." autocomplete="off">
                <button id="wa-send">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                </button>
            </div>
        </div>
        <div class="wa-button" id="wa-button">
            <svg viewBox="0 0 24 24" width="35" height="35" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.117-2.877-6.977-1.858-1.859-4.332-2.881-6.973-2.882-5.441 0-9.867 4.42-9.871 9.864-.001 1.77.464 3.498 1.348 5.048l-.995 3.637 3.733-.979zm11.233-7.666c-.301-.15-1.782-.879-2.056-.979-.275-.1-.475-.15-.675.15-.2.3-.775.979-.95 1.179-.175.2-.35.225-.65.075-.3-.15-1.266-.467-2.41-1.485-.89-.793-1.49-1.773-1.665-2.073-.175-.3-.019-.462.13-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5s.05-.375-.025-.525C10.944 8.784 10.319 7.24 10.057 6.6c-.256-.615-.514-.532-.705-.542-.182-.01-.39-.01-.599-.01-.208 0-.547.078-.833.39-.286.313-1.094 1.07-1.094 2.61s1.119 3.025 1.275 3.235c.156.21 2.201 3.364 5.333 4.717.745.322 1.327.514 1.78.658.748.238 1.43.204 1.97.124.6-.09 1.782-.729 2.03-1.432.249-.703.249-1.305.174-1.432-.075-.127-.275-.202-.575-.352z"/>
            </svg>
        </div>
    `;
    document.body.appendChild(widget);

    // Logic
    const waBtn = document.getElementById('wa-button');
    const waChat = document.getElementById('wa-chat-box');
    const waClose = document.getElementById('wa-close');
    const waSend = document.getElementById('wa-send');
    const waInput = document.getElementById('wa-input');

    waBtn.addEventListener('click', () => {
        waChat.classList.toggle('active');
        if (waChat.classList.contains('active')) {
            setTimeout(() => waInput.focus(), 300);
        }
    });

    waClose.addEventListener('click', () => {
        waChat.classList.remove('active');
        sessionStorage.setItem('wa_closed', 'true');
    });

    const sendMsg = () => {
        let text = waInput.value.trim();
        if(!text) return;
        const url = 'https://wa.me/4551999400?text=' + encodeURIComponent(text);
        if (typeof window.gtagSendEventBlank === 'function') {
            window.gtagSendEventBlank(url);
        } else {
            window.open(url, '_blank');
        }
        waInput.value = '';
        waChat.classList.remove('active');
    };

    waSend.addEventListener('click', sendMsg);
    waInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') sendMsg();
    });

    // Auto open after 6 seconds
    setTimeout(() => {
        if(!waChat.classList.contains('active') && !sessionStorage.getItem('wa_closed')) {
            waChat.classList.add('active');
        }
    }, 6000);
});
