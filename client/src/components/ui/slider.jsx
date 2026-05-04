export function Slider({ value = [0], min = 0, max = 100, step = 1, onValueChange, className = "" }) {
    const v = Array.isArray(value) ? value[0] : value
    const percentage = ((v - min) / (max - min)) * 100

    return (
        <div className={`relative w-full h-6 flex items-center ${className}`} dir="rtl">
            {/* Custom Track */}
            <div className="absolute w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-l from-egypt-red to-egypt-gold transition-all duration-300 absolute right-0"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            {/* Hidden Native Range for functionality */}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={v}
                onChange={(e) => onValueChange?.([Number(e.target.value)])}
                className="absolute w-full h-1.5 opacity-0 cursor-pointer z-10"
            />

            {/* Custom Thumb */}
            <div
                className="absolute w-5 h-5 bg-white border-2 border-egypt-red rounded-full shadow-lg pointer-events-none transition-all duration-150 z-0"
                style={{
                    right: `calc(${percentage}% - 10px)`,
                    boxShadow: "0 0 10px rgba(179, 29, 29, 0.2)",
                }}
            >
                <div className="absolute inset-1 bg-egypt-red/10 rounded-full"></div>
            </div>
        </div>
    )
}

export default Slider
