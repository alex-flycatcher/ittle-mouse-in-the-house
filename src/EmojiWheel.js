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

    const spinInterval = useRef(null);
    const spinCount = useRef(0);

    // const startSpinning = () => {
    //   if (remainingEmojis.length === 0) {
    //     // Restart game
    //     setCollectedCards([]);
    //     setRemainingEmojis([...emojis]);
    //     setButtonContent('Spin');
    //     setCenterEmoji(null);
    //     setShowWord(false);
    //     return;
    //   }

    //   setIsSpinning(true);
    //   setButtonContent('Spinning...');
    //   setShowWord(false);
    //   spinCount.current = 0;

    //   // Get available emojis
    //   const availableEmojis = remainingEmojis.filter(e => !e.used);
    //   let currentIdx = 0;

    //   spinInterval.current = setInterval(() => {
    //     // Move to next emoji
    //     currentIdx = (currentIdx + 1) % availableEmojis.length;
    //     // setHighlightIndex(currentIdx);
    //     const currentEmoji = availableEmojis[currentIdx];
    //     setCenterEmoji(currentEmoji.emoji);
    //     setButtonContent(currentEmoji.emoji);

    //     // Gradually slow down
    //     spinCount.current++;
    //     if (spinCount.current > 30) {
    //       if (spinCount.current > 40) {
    //         stopSpinning(currentEmoji);
    //       }
    //     }
    //   }, getSpinSpeed());
    // };

    // const getSpinSpeed = () => {
    //   if (spinCount.current < 20) return 100;
    //   if (spinCount.current < 30) return 500;
    //   if (spinCount.current < 38) return 700;
    //   return 1000;
    // };

    // const startSpinning = () => {
    //     // let speed = 100;
    //     // let spinCount = 0;
    //     let currentIdx = 0;

    //     if (remainingEmojis.length === 0) {
    //         // Restart game
    //         setCollectedCards([]);
    //         setRemainingEmojis([...emojis]);
    //         setButtonContent("Spin");
    //         setCenterEmoji(null);
    //         setShowWord(false);
    //         return;
    //     }

    //     setIsSpinning(true);
    //     setButtonContent("Spinning...");
    //     setShowWord(false);
    //     spinCount.current = 0;

    //     // Get available emojis
    //     const availableEmojis = remainingEmojis.filter((e) => !e.used);

    //     const spinStep = () => {
    //         // 更新高亮逻辑
    //         currentIdx = (currentIdx + 1) % availableEmojis.length;
    //         // setHighlightIndex(currentIdx);
    //         const currentEmoji = availableEmojis[currentIdx];
    //         setCenterEmoji(currentEmoji.emoji);
    //         setButtonContent(currentEmoji.emoji);

    //         // 动态调整速度
    //         spinCount.current++;
    //         // if (spinCount > 10) speed = 150;
    //         // if (spinCount > 20) speed = 200;
    //         // if (spinCount > 30) speed = 250;
    //         if (spinCount.current > 30) {
    //             if (spinCount.current > 40) {
    //                 stopSpinning(currentEmoji);
    //             }
    //         }
    //         // 停止条件
    //         if (spinCount <= 40) {
    //             spinInterval.current = setTimeout(spinStep, getSpinSpeed()); // 递归调用
    //         } else {
    //             stopSpinning(currentEmoji);
    //         }
    //     };

    //     spinStep(); // 启动
    // };
    // const getSpinSpeed = () => {
    //     if (spinCount.current < 20) return 100;
    //     if (spinCount.current < 30) return 500;
    //     if (spinCount.current < 38) return 700;
    //     return 1000;
    // };

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
              let oneRoundCount = remainingEmojis.length - collectedCards.length;
              if (spinCount.current > oneRoundCount*3 || oneRoundCount===1) {
                  stopSpinning(currentEmoji);
              }
          }, getSpinSpeed());
        }
        updateInterval();
    };

    const getSpinSpeed = () => {
        let oneRoundCount = remainingEmojis.length - collectedCards.length;
        if (spinCount.current < oneRoundCount*2) return 50;
        if (spinCount.current < oneRoundCount*2.5) return 100;
        if (spinCount.current < oneRoundCount*2.8) return 200;
        return 700;
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
