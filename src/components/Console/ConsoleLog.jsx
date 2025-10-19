export default function ConsoleLog ({ answers }) {
	return (
		<div className="console__log">
			{
				answers.map((answer, index)=> (
					<div className="console__answer" key={index}>{ answer }</div>
				))
			}
		</div>
	);
}
