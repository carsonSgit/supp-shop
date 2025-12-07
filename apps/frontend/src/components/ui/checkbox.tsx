import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "../../lib/utils"

const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => (
        <div className="relative flex items-center justify-center w-4 h-4">
            <input
                type="checkbox"
                ref={ref}
                className={cn(
                    "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-background checked:bg-primary checked:border-primary cursor-pointer",
                    className
                )}
                {...props}
            />
            <Check className="absolute h-3 w-3 text-primary-foreground opacity-0 pointer-events-none peer-checked:opacity-100" />
        </div>
    )
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
