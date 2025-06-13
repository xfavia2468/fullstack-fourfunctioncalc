interface Props {
	className?: string;
	span?: number;
	text: string;
	onClick: () => void;
}

function Button({ span = 1, className, text, onClick }: Props) {
	return (
		<button
			style={{ gridRow: `span ${span}` }}
			className={className}
			onClick={onClick}
		>
			{text}
		</button>
	);
}

export default Button;
