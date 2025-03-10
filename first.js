document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const score = document.getElementById('score');
    const resetBtn = document.getElementById('reset-btn');
    const gameModeSelect = document.getElementById('game-mode');
    
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let gameMode = 'ai';
    let scores = { X: 0, O: 0 };
    
    const winningConditions = [
        [0, 1, 2], 
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6], 
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8], 
        [2, 4, 6]
    ];
    

    initGame();
    
    function initGame() {
        gameMode = gameModeSelect.value;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        status.textContent = `Turn: Player ${currentPlayer}`;
        resetBtn.style.display = 'none';
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
        
        updateScore();
        
        if (gameMode === 'ai' && currentPlayer === 'O') {
            setTimeout(makeAIMove, 700);
        }
    }
    
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        makeMove(clickedCellIndex);
        
        if (gameMode === 'ai' && gameActive && currentPlayer === 'O') {
            setTimeout(makeAIMove, 700);
        }
    }
    
    function makeMove(index) {
        gameState[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        cells[index].classList.add(currentPlayer.toLowerCase());
        
        checkResult();
    }
    
    function makeAIMove() {
        if (!gameActive) return;
        
        let bestScore = -Infinity;
        let bestMove;
        
        for (let i = 0; i < 9; i++) {
            if (gameState[i] === '') {
                gameState[i] = 'O';
                let score = minimax(gameState, 0, false);
                gameState[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        if (bestMove !== undefined) {
            makeMove(bestMove);
        }
    }
    
    function minimax(board, depth, isMaximizing) {
        const result = checkWinner();
        if (result !== null) {
            return result === 'O' ? 10 - depth : result === 'X' ? depth - 10 : 0;
        }
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    
    function checkWinner() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                return gameState[a];
            }
        }
        
        if (!gameState.includes('')) {
            return 'tie';
        }
        
        return null;
    }
    
    function checkResult() {
        const result = checkWinner();
        
        if (result === 'X' || result === 'O') {
            status.textContent = `Player ${result} wins!`;
            gameActive = false;
            scores[result]++;
            updateScore();
            resetBtn.style.display = 'inline-block';
            return;
        }
        
        if (result === 'tie') {
            status.textContent = "It's a tie!";
            gameActive = false;
            resetBtn.style.display = 'inline-block';
            return;
        }
        

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Turn: Player ${currentPlayer}`;
    }
    
    function updateScore() {
        score.textContent = `Player X: ${scores.X}    Player O: ${scores.O}`;
    }
    
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetBtn.addEventListener('click', initGame);
    
    gameModeSelect.addEventListener('change', () => {
        initGame();
    });
});