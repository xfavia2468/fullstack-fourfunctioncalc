import "./App.css";
import Calculator from "./components/Calculator.tsx";

function App() {
	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<Calculator />
			</div>
		</>
	);
}

export default App;
