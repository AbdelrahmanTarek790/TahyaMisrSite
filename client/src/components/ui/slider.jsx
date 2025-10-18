export function Slider({ value = [0], min = 0, max = 100, step = 1, onValueChange, className = "" }) {
    const v = Array.isArray(value) ? value[0] : value
    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={v}
            onChange={(e) => onValueChange?.([Number(e.target.value)])}
            className={`w-full h-2 cursor-pointer accent-red-600 ${className}`}
        />
    )
}

export default Slider
