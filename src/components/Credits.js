// src/components/Credits.js

const Credits = (props) => {
	let creditsView = () => {
    const { credits } = props;
    return credits.map((credits) => {
      let date = credits.date.slice(0,10);
      return <li key={credits.id}>{credits.amount} {credits.description} {date}</li>
    }) 
  }
  return (
    <div>
      <h1>Credits</h1>
      {creditsView()}
      <form onSubmit={props.addCredit}>
        <input type="text" name="description" />
        <input type="number" name="amount" />
        <button type="submit">Add Credits</button>
      </form>
    </div>
  )
}

export default Credits;