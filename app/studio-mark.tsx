export function StudioMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={'studio-mark ' + className}
      viewBox="0 0 500 690"
      fill="none"
      aria-hidden="true"
    >
      <g className="mark-cube-motion">
        <g className="mark-cube">
          <path d="M120 59 214 0 308 59 214 118Z" fill="#E4BDFF" />
          <path d="M120 59 214 118 214 227 120 168Z" fill="#9B4CF2" />
          <path d="M214 118 308 59 308 168 214 227Z" fill="#6327B0" />
        </g>
      </g>
      <g className="mark-i-motion">
        <path
          className="mark-i"
          d="M0 276 97 219 97 665 0 605Z"
          fill="#873CE0"
        />
      </g>
      <g className="mark-s-motion">
        <path
          className="mark-s"
          d="M338.9 218.9 483.6 301.8 404.3 349.2 339.4 313.1 252.3 366.7 462 485.6 462 562.4 289.9 661.8 131.3 571.6 131.3 548 190.6 514.5 292 570.1 361 527.9 153 409.9 152.4 331.7Z"
          fill="#542092"
        />
      </g>
    </svg>
  );
}
