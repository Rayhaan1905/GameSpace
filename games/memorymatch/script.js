document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const timeDisplay = document.getElementById('time');
    const scoreDisplay = document.getElementById('score');
    const resetBtn = document.getElementById('reset-btn');
    const difficultySelect = document.getElementById('difficulty');
    
    let cards = [];
    let flippedCards = [];
    let moves = 0;
    let matches = 0;
    let totalPairs = 0;
    let timer = null;
    let seconds = 0;
    let gameActive = false;
    
    // Emoji sets for different difficulties
    const emojiSets = {
        easy: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
        medium: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
        hard: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦']
    };
    
    // Initialize the game
    function initGame() {
        // Clear existing game
        clearInterval(timer);
        gameBoard.innerHTML = '';
        flippedCards = [];
        moves = 0;
        matches = 0;
        seconds = 0;
        gameActive = true;
        
        movesDisplay.textContent = moves;
        timeDisplay.textContent = seconds;
        scoreDisplay.textContent = matches;
        
        // Set difficulty
        const difficulty = difficultySelect.value;
        let emojis = [];
        
        switch(difficulty) {
            case 'easy':
                emojis = emojiSets.easy.slice(0, 8);
                gameBoard.className = 'game-board easy';
                totalPairs = 8;
                break;
            case 'medium':
                emojis = emojiSets.medium.slice(0, 12);
                gameBoard.className = 'game-board medium';
                totalPairs = 12;
                break;
            case 'hard':
                emojis = emojiSets.hard.slice(0, 18);
                gameBoard.className = 'game-board hard';
                totalPairs = 18;
                break;
        }
        
        // Create card pairs
        cards = [...emojis, ...emojis];
        shuffleArray(cards);
        
        // Create card elements
        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.dataset.emoji = emoji;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
        
        // Start timer
        timer = setInterval(updateTimer, 1000);
    }
    
    // Shuffle array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    // Flip card
    function flipCard() {
        if (!gameActive || this.classList.contains('flipped') || flippedCards.length >= 2) {
            return;
        }
        
        this.classList.add('flipped');
        this.textContent = this.dataset.emoji;
        flippedCards.push(this);
        
        // Add flip animation
        this.style.animation = 'flipInY 0.5s';
        
        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            
            if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
                // Match found
                flippedCards.forEach(card => {
                    card.classList.add('matched');
                    card.style.animation = 'tada 1s';
                });
                
                matches++;
                scoreDisplay.textContent = matches;
                flippedCards = [];
                
                // Check for win
                if (matches === totalPairs) {
                    gameActive = false;
                    clearInterval(timer);
                    setTimeout(() => {
                        createConfetti();
                        alert(`You won in ${moves} moves and ${seconds} seconds!`);
                    }, 500);
                }
            } else {
                // No match
                setTimeout(() => {
                    flippedCards.forEach(card => {
                        card.classList.remove('flipped');
                        card.textContent = '';
                        card.style.animation = 'flipOutY 0.5s';
                    });
                    flippedCards = [];
                }, 1000);
            }
        }
    }
    
    // Update timer
    function updateTimer() {
        seconds++;
        timeDisplay.textContent = seconds;
    }
    
    // Create confetti effect
    function createConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = -10 + 'px';
            confetti.style.opacity = '1';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            document.body.appendChild(confetti);
            
            // Animate confetti
            const animation = confetti.animate([
                { top: -10 + 'px', opacity: 1 },
                { top: window.innerHeight + 'px', opacity: 0 }
            ], {
                duration: 2000 + Math.random() * 3000,
                easing: 'cubic-bezier(0.1, 0.8, 0.9, 1)'
            });
            
            animation.onfinish = () => confetti.remove();
        }
    }
    
    // Event listeners
    resetBtn.addEventListener('click', initGame);
    difficultySelect.addEventListener('change', initGame);
    
    // Start the game
    initGame();
});