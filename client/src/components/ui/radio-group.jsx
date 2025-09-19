import * as React from "react"
import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef(({ className, value, onValueChange, children, ...props }, ref) => {
    return (
        <div className={cn("grid gap-2", className)} ref={ref} role="radiogroup" {...props}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        checked: child.props.value === value,
                        onCheckedChange: () => onValueChange?.(child.props.value),
                    })
                }
                return child
            })}
        </div>
    )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef(({ className, checked, onCheckedChange, value, id, ...props }, ref) => {
    return (
        <input
            ref={ref}
            type="radio"
            className={cn(
                "h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            checked={checked}
            onChange={() => onCheckedChange?.()}
            value={value}
            id={id}
            {...props}
        />
    )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
