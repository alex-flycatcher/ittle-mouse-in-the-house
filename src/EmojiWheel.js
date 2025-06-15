import React, { useState, useEffect, useRef } from "react";
import "./EmojiWheel.css";

const emojis = [
    { emoji: "😊", word: "happy", used: false },
    { emoji: "😢", word: "sad", used: false },
    { emoji: "😨", word: "scared", used: false },
    { emoji: "😠", word: "angry", used: false },
    { emoji: "🥱", word: "tired", used: false },
    { emoji: "😲", word: "surprised", used: false },
    { emoji: "🤩", word: "excited", used: false },
    { emoji: "😟", word: "worried", used: false },
];
const ding = process.env.PUBLIC_URL + "/sounds/ding.mp3";
function EmojiWheel() {
    const [remainingEmojis, setRemainingEmojis] = useState([...emojis]);
    const [collectedCards, setCollectedCards] = useState([]);
    // const [highlightIndex, setHighlightIndex] = useState(-1);
    const [centerEmoji, setCenterEmoji] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [buttonContent, setButtonContent] = useState("Spin");
    const [showWord, setShowWord] = useState(false);

    const oneRoundCountRef = useRef(8);
    const spinInterval = useRef(null);
    const spinCount = useRef(0);

    const startSpinning = () => {
        if (remainingEmojis.filter((e) => !e.used).length === 0) {
            clearInterval(spinInterval.current);
            // Restart game
            setCollectedCards([]);
            setRemainingEmojis([...emojis]);
            setButtonContent("Spin");
            setCenterEmoji(null);
            setShowWord(false);
            return;
        }

        setIsSpinning(true);
        setButtonContent("Spinning...");
        setShowWord(false);

        spinCount.current = 0;
        const remainElength = remainingEmojis.length - collectedCards.length;
        const newRoundCount =
            remainElength * 2 + Math.floor(Math.random() * remainElength);
        oneRoundCountRef.current = newRoundCount;
        console.log("calculated value: " + oneRoundCountRef.current);
        
        // Get available emojis
        const availableEmojis = remainingEmojis.filter((e) => !e.used);
        let currentIdx = 0;
        const updateInterval = () => {
            clearInterval(spinInterval.current);
            spinInterval.current = setInterval(() => {
                // Move to next emoji
                currentIdx = (currentIdx + 1) % availableEmojis.length;
                // setHighlightIndex(currentIdx);
                const currentEmoji = availableEmojis[currentIdx];
                setCenterEmoji(currentEmoji.emoji);
                setButtonContent(currentEmoji.emoji);

                // Gradually slow down
                spinCount.current++;
                let dingSound = new Audio(ding);
                dingSound.play();
                updateInterval(); // 速度变化时重建

                if (spinCount.current > newRoundCount || remainElength === 1) {
                    stopSpinning(currentEmoji);
                }
            }, getSpinSpeed());
        };
        updateInterval();
    };

    const getSpinSpeed = () => {
        console.log("speed value: " + oneRoundCountRef.current);
        if (spinCount.current > oneRoundCountRef.current - 1) return 700;
        if (spinCount.current > oneRoundCountRef.current - 3) return 200;
        if (spinCount.current > oneRoundCountRef.current - 5) return 100;
        return 50;
    };

    const stopSpinning = (selectedEmoji) => {
        clearInterval(spinInterval.current);
        // clearTimeout(spinInterval.current); // 注意这里是 clearTimeout
        setIsSpinning(false);
        setButtonContent("Reveal");
        setCenterEmoji(selectedEmoji.emoji);
    };

    const revealWord = () => {
        const selected = remainingEmojis.find((e) => e.emoji === centerEmoji);
        if (selected) {
            // Add to collected cards
            setCollectedCards([...collectedCards, selected]);

            // Mark as used
            const updated = remainingEmojis.map((e) =>
                e.emoji === centerEmoji ? { ...e, used: true } : e
            );
            setRemainingEmojis(updated);

            // Show word
            setShowWord(true);

            // Update button
            if (updated.filter((e) => !e.used).length === 0) {
                setButtonContent("Restart");
            } else {
                setButtonContent("Spin");
            }
        }
    };

    const handleButtonClick = () => {
        if (isSpinning) return;

        if (buttonContent === "Reveal") {
            revealWord();
        } else {
            startSpinning();
        }
    };

    useEffect(() => {
        return () => {
            if (spinInterval.current) clearInterval(spinInterval.current);
        };
    }, []);

    return (
        <div className="emoji-wheel-container">
            <h1>Emoji Wheel Game</h1>

            <div className="wheel-container">
                {/* Left cards column */}
                <div className="cards-column left-column">
                    {collectedCards.slice(0, 4).map((card, index) => (
                        <div key={`left-${index}`} className="emoji-card">
                            <span className="card-emoji">{card.emoji}</span>
                            <span className="card-word">{card.word}</span>
                        </div>
                    ))}
                </div>

                {/* Wheel area */}
                <div className="wheel-area">
                    <div className="wheel">
                        {/* Center display */}
                        <div className="center-display">
                            {centerEmoji && (
                                <>
                                    <div className="center-emoji">
                                        {centerEmoji}
                                    </div>
                                    {showWord && (
                                        <div className="center-word">
                                            {
                                                remainingEmojis.find(
                                                    (e) =>
                                                        e.emoji === centerEmoji
                                                )?.word
                                            }
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Fixed emojis around the wheel */}
                        {remainingEmojis.map((emojiObj, index) => (
                            <div
                                key={index}
                                className={`wheel-emoji ${
                                    emojiObj.used ? "used" : ""
                                } ${
                                    remainingEmojis.findIndex(
                                        (e) =>
                                            !e.used && e.emoji === centerEmoji
                                    ) === index
                                        ? "highlight"
                                        : ""
                                }`}
                                style={{
                                    transform: `rotate(${
                                        index * (360 / emojis.length)
                                    }deg) translate(180px) rotate(-${
                                        index * (360 / emojis.length)
                                    }deg)`,
                                }}
                            >
                                {emojiObj.emoji}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right cards column */}
                <div className="cards-column right-column">
                    {collectedCards.slice(4).map((card, index) => (
                        <div key={`right-${index}`} className="emoji-card">
                            <span className="card-emoji">{card.emoji}</span>
                            <span className="card-word">{card.word}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="spin-button"
                onClick={handleButtonClick}
                disabled={isSpinning}
            >
                {buttonContent}
            </button>
        </div>
    );
}

export default EmojiWheel;
