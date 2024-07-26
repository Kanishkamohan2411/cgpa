import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ percent1, heading, symbol, display1 }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashOffset = circumference - (percent1 / 100) * circumference;

    return (
        <div className='progressbar'>
            <div className="skill">
                <div className="outer">
                    <div className="inner">
                        <div className="number">
                            <h4>{display1}{symbol}</h4>
                            <p>{heading}</p>
                        </div>
                    </div>
                </div>
                <div className='circle'>
                    <svg className='progress_chart' xmlns="http://www.w3.org/2000/svg" width="160px" height="160px">
                        <defs>
                            <linearGradient id="GradientColor">
                                <stop offset="0%" stopColor="#00134d" />
                                <stop offset="100%" stopColor="#002699" />
                            </linearGradient>
                        </defs>
                        <circle className="bg" cx="80" cy="80" r={radius} />
                        <circle className="progress" cx="80" cy="80" r={radius} style={{ strokeDashoffset: strokeDashOffset }} />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default ProgressBar;
