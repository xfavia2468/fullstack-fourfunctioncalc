interface Props {
	className?: string;
	span?: number;
	text: string;
	onClick: () => void;
	disabled?: boolean;
}

function Button({
	span = 1,
	className,
	text,
	onClick,
	disabled = false,
}: Props) {
	return (
		<button
			style={{ gridRow: `span ${span}` }}
			className={className}
			onClick={onClick}
			disabled={disabled}
		>
			{text}
		</button>
	);
}

export default Button;
