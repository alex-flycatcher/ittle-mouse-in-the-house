import React, { useState, useEffect, useRef } from "react";
// import "./App.css";
import "./AnimalsGame.css";

// 音效文件需要放在public/sounds目录下
const soundFiles = {
  bgMusic: process.env.PUBLIC_URL + "/sounds/bg-music.mp3",
  hover: process.env.PUBLIC_URL + "/sounds/hover.mp3",
  click: process.env.PUBLIC_URL + "/sounds/click.mp3",
  win: process.env.PUBLIC_URL + "/sounds/win.mp3"
};

function AnimalGame() {
    const [numHouses, setNumHouses] = useState(5);
    const [houses, setHouses] = useState([]);
    const [mouseHouseId, setMouseHouseId] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [showColorLabels, setShowColorLabels] = useState(false);
    const displayItems = ["🐸", "🐒", "🐊", "🦓", "🐘", "🦒", "🐎", "🦩", "🐬", "🐋", "🐼"];

    const audioRefs = {
        bgMusic: useRef(null),
        hover: useRef(null),
        click: useRef(null),
        win: useRef(null),
    };

    const colors = [
        "red",
        "blue",
        "green",
        "yellow",
        "purple",
        "orange",
        "pink",
        "brown",
    ];

    // 初始化音效
    useEffect(() => {
        Object.keys(audioRefs).forEach((key) => {
            audioRefs[key].current = new Audio(soundFiles[key]);
            // audioRefs[key].current.volume = volume;
        });
        audioRefs.bgMusic.current.volume = volume * 0;
        audioRefs.hover.current.volume = volume;
        audioRefs.click.current.volume = volume;
        audioRefs.win.current.volume = volume;
    }, []);

    // 音量变化时更新所有音效
    useEffect(() => {
        // Object.keys(audioRefs).forEach(key => {
        //   if (audioRefs[key].current) {
        //     audioRefs[key].current.volume = volume;
        //   }
        // });
        if (audioRefs.bgMusic.current) {
            audioRefs.bgMusic.current.volume = volume * 0.01;
        }
        if (audioRefs.hover.current) audioRefs.hover.current.volume = volume;
        if (audioRefs.click.current) audioRefs.click.current.volume = volume;
        if (audioRefs.win.current) audioRefs.win.current.volume = volume;
    }, [volume]);

    const initializeHouses = () => {
        const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
        const shuffledItems = [...displayItems].sort(() => Math.random() - 0.5);
        const newHouses = [];

        for (let i = 1; i <= numHouses; i++) {
            newHouses.push({
                id: i,
                color: shuffledColors[i % shuffledColors.length],
                clicked: false,
                displayedItem: shuffledItems[i % shuffledItems.length],
            });
        }

        // 随机打乱房子顺序
        return newHouses.sort(() => Math.random() - 0.5);
    };

    const startGame = () => {
        const newHouses = initializeHouses();
        const randomHouseId =
            newHouses[Math.floor(Math.random() * numHouses)].id;

        setHouses(newHouses);
        setMouseHouseId(randomHouseId);
        setGameStarted(true);
        setGameOver(false);

        // 播放背景音乐
        audioRefs.bgMusic.current.loop = true;
        audioRefs.bgMusic.current.play();
    };

    const handleClickHouse = (id) => {
        if (!gameStarted || gameOver) return;

        // 播放点击音效
        audioRefs.click.current.currentTime = 0;
        audioRefs.click.current.play();

        const updatedHouses = houses.map((house) => {
            if (house.id === id) {
                return {
                    ...house,
                    clicked: true,
                    displayedItem:
                        id === mouseHouseId ? "🐭" : house.displayedItem,
                };
            }
            return house;
        });
        setHouses(updatedHouses);

        if (id === mouseHouseId) {
            setGameOver(true);
            // 停止背景音乐，播放胜利音效
            // audioRefs.bgMusic.current.pause();
            audioRefs.win.current.play();
        }
    };

    const handleHouseHover = () => {
        audioRefs.hover.current.currentTime = 0;
        audioRefs.hover.current.play();
    };

    return (
        <div className="App">
            <h1>Little Mouse in the House 🏠🐭</h1>
            <p>Click a house to find the mouse!</p>

            <div className="controls">
                <div className="control-group">
                    <label>
                        Number of houses:
                        <select
                            value={numHouses}
                            onChange={(e) =>
                                setNumHouses(parseInt(e.target.value))
                            }
                            disabled={gameStarted && !gameOver}
                        >
                            {[3, 4, 5, 6, 7, 8].map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="control-group">
                    <label>
                        Volume:
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={(e) =>
                                setVolume(parseFloat(e.target.value))
                            }
                        />
                        {Math.round(volume * 100)}%
                    </label>
                </div>

                {/* Add checkbox control */}
                <div className="control-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={showColorLabels}
                            onChange={() =>
                                setShowColorLabels(!showColorLabels)
                            }
                        />
                        Show color labels
                    </label>
                </div>
            </div>

            {!gameStarted ? (
                <button onClick={startGame}>Start Game</button>
            ) : (
                <button onClick={startGame}>Restart</button>
            )}

            <div className="houses">
                {houses.map((house) => (
                    <div key={house.id} className="house-container">
                        <div
                            className={`house ${house.color} ${
                                house.clicked ? "clicked" : ""
                            }`}
                            onClick={() => handleClickHouse(house.id)}
                            onMouseEnter={handleHouseHover}
                        >
                            {house.clicked && house.displayedItem}
                        </div>
                        {showColorLabels && (
                            <div className="house-color-label">
                                {house.color}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {gameOver && <p className="result">You found the mouse! 🎉</p>}
            {/* <div style={{ marginTop: "20px" }}>By Alex For Dan❤️</div> */}

            {/* 隐藏的音频元素 */}
            <audio ref={audioRefs.bgMusic} loop />
            <audio ref={audioRefs.hover} />
            <audio ref={audioRefs.click} />
            <audio ref={audioRefs.win} />
        </div>
    );
}

export default AnimalGame;
