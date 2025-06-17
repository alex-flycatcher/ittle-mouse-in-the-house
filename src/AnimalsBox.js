import React, { useState } from 'react';
import './AnimalsBox.css'; // We'll put the CSS in a separate file

const AnimalsBox = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="root" onClick={handleClick}>
      <div>
        <div className={`sc-bdVaJa hCqOlD ${isOpen ? 'open' : ''}`}>
          <div className="sc-bwzfXH biqWkE">
            <div className="sc-htpNat kGQype">
              <div className="sc-bxivhb sc-dnqmqq ZEDDw">
                <div className={`sc-left ekMwXW ${isOpen ? 'open' : ''}`}></div>
                <div className={`sc-gZMcBi fujrhZ ${isOpen ? 'open' : ''}`}></div>
                <div className={`sc-gqjmRU jRAgJu ${isOpen ? 'open' : ''}`}></div>
                <div className={`sc-VigVT gpuqLL ${isOpen ? 'open' : ''}`}></div>
              </div>
              <div className="sc-bxivhb sc-ifAKCX kLAltZ"></div>
              <div className="sc-bxivhb sc-EHOje gvPWuP"></div>
              <div className="sc-bxivhb sc-bZQynM ldKBkL"></div>
              <div className="sc-bxivhb sc-gzVnrw fFMyeM"></div>
              <div className="sc-bxivhb sc-htoDjs crPZsS"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalsBox;