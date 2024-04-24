import { FaChevronDown } from "react-icons/fa6"
import { HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

type ButtonVariant = "default" | "outline" | "iconOnly" | "dropDownOnly"

const variants = {
	default:
		"hover:bg-white/10  rounded-[3px] h-5 px-1.5 flex items-center justify-center text-white/80 hover:text-white",
	outline:
		"border border-[rgb(81,81,81)]  hover:border-[rgb(91,91,91)] bg-[rgb(38,38,38)] hover:bg-[rgb(50,50,50)]  rounded-[4px]  h-5 flex gap-x-1 px-0.5 pl-1 items-center text-white/80 hover:text-white",
	iconOnly:
		"h-5 flex items-center justify-center bg-[rgb(85,85,85)] hover:bg-[rgb(97,97,97)] px-1 text-white/70 hover:text-white",
	dropDownOnly:
		"h-5 w-5 flex items-center justify-center  border border-[rgb(81,81,81)]  hover:border-[rgb(91,91,91)] bg-[rgb(38,38,38)] hover:bg-[rgb(50,50,50)]  rounded-[4px]  text-white/80 hover:text-white",
}

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
	icon?: React.ReactElement
	text?: string
	variant?: ButtonVariant
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ icon, text, className, variant = "default", ...rest }: ButtonProps, ref) => {
		return (
			<button ref={ref} {...rest} className={cn(variants[variant], className)}>
				{variant === "outline" ? (
					<>
						{icon && icon}
						{text && (
							<div className="flex-1 text-[0.7rem] !min-w-0 truncate text-shadow">{text}</div>
						)}
						<FaChevronDown size={8} />
					</>
				) : variant === "iconOnly" ? (
					<>{icon && icon}</>
				) : variant === "dropDownOnly" ? (
					<>
						<FaChevronDown size={8} />
					</>
				) : (
					<>{text && <span className="text-[0.7rem] text-shadow">{text}</span>}</>
				)}
			</button>
		)
	}
)

Button.displayName = "MyButton"
