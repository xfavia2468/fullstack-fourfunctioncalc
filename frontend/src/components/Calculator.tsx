import "../styles/Calculator.css";
import Button from "./Button.tsx";
import { useState } from "react";

function Calculator() {
	const buttons = [
		{ text: "√", onClick: () => wrapExpression("sqrt") },
		{ text: "+/-", onClick: () => negateRecent() },
		{ text: "M", onClick: () => toMemory() },
		{ text: "C", onClick: () => clearAll() },

		{ text: "MR/C", onClick: () => memoryRecallClear() },
		{ text: "M-", onClick: () => addSubFromMemory(-1) },
		{ text: "M+", onClick: () => addSubFromMemory(1) },
		{ text: "÷", onClick: () => appendToExpression("/") },

		{ text: "7", onClick: () => appendToExpression("7") },
		{ text: "8", onClick: () => appendToExpression("8") },
		{ text: "9", onClick: () => appendToExpression("9") },
		{ text: "x", onClick: () => appendToExpression("*") },

		{ text: "4", onClick: () => appendToExpression("4") },
		{ text: "5", onClick: () => appendToExpression("5") },
		{ text: "6", onClick: () => appendToExpression("6") },
		{ text: "-", onClick: () => appendToExpression("-") },

		{ text: "1", onClick: () => appendToExpression("1") },
		{ text: "2", onClick: () => appendToExpression("2") },
		{ text: "3", onClick: () => appendToExpression("3") },
		{ text: "+", onClick: () => appendToExpression("+") },

		{ text: "0", onClick: () => appendToExpression("0") },
		{ text: ".", onClick: () => appendToExpression(".") },
		{
			text: "=",
			onClick: () => {
				if (!isCalculating) callCalculateApi();
			},
		},
	];

	const callCalculateApi = () => {
		if (isCalculating) return;
		if (!expression) return;
		if (expression.includes("error")) return;

		setCalculating(true);

		fetch("api/submit", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ input: expression }),
		})
			.then((response) => response.json())
			.then((data) => {
				setExpression(() => {
					const result = String(data.result);
					updateDisplay(result);
					console.log(data);
					return result;
				});
			})
			.catch((err) => {
				console.error("Error:", err);
				setDisplay("Error");
			})
			.finally(() => {
				setCalculating(false);
			});
	};

	const appendToExpression = (inp: string) => {
		setExpression((prevExpression) => {
			let newExpression = prevExpression + inp;
			if (expression == "0" && !"-+/*".includes(inp)) newExpression = inp;
			updateDisplay(newExpression);
			return newExpression;
		});
	};

	const wrapExpression = (inp: string) => {
		setExpression((prevExpression) => {
			const newExpression = inp + "(" + prevExpression + ")";
			updateDisplay(newExpression);
			return newExpression;
		});
	};

	const clearAll = () => {
		setExpression(() => {
			updateDisplay("0");
			return "0";
		});
	};

	const toMemory = () => {
		setMemory(display);
	};

	const memoryRecallClear = () => {
		if (parseFloat(display) == parseFloat(memory)) {
			setMemory(() => {
				updateDisplay("0");
				setExpression("0");
				return "0";
			});
		} else {
			setExpression(() => {
				updateDisplay(memory);
				return memory;
			});
		}
	};

	const addSubFromMemory = (sign: number) => {
		setExpression((prevExpression) => {
			const newExpr = (
				parseFloat(prevExpression) +
				parseFloat(memory) * sign
			).toString();
			updateDisplay(newExpr);
			return newExpr;
		});
	};

	const negateRecent = () => {
		const pattern = /(-?\d+)$/;
		const matches = expression.match(pattern);

		if (matches) {
			const last = matches[1];
			const negated = (-1 * parseInt(last)).toString();
			const result = expression.replace(pattern, negated);
			setExpression(() => {
				updateDisplay(result);
				return result;
			});
		}
	};

	const updateDisplay = (update: string) => {
		setDisplay(update);
	};

	const [display, setDisplay] = useState("0");
	const [expression, setExpression] = useState("0");
	const [memory, setMemory] = useState("0");
	const [isCalculating, setCalculating] = useState(false);

	return (
		<div id="calculator-body">
			<div id="calculator-screen">{display}</div>
			<div id="calculator-buttons">
				{buttons.map((btn, index) => {
					const blackButtons = [0, 1, 2, 4, 5, 6, 7, 11, 15, 19];
					const whiteButtons = [8, 9, 10, 12, 13, 14, 16, 17, 18, 20, 21, 22];

					let className = "calculator-button";

					if (index == 3) className += "Red";
					else if (blackButtons.includes(index)) className += "Black";
					else if (whiteButtons.includes(index)) className += "White";

					return (
						<Button
							span={index == 19 ? 2 : 1}
							key={btn.text}
							className={className}
							text={btn.text}
							onClick={btn.onClick}
							disabled={btn.text === "=" && isCalculating}
						/>
					);
				})}
			</div>
		</div>
	);
}

export default Calculator;
