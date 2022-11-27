import { useState } from 'react'
// import { useAutoAnimate } from '@formkit/auto-animate/react'

const App = function() {
  const [items, setItems] = useState([0, 1, 2])
  // const [parent, enableAnimations] = useAutoAnimate(/* optional config */)
  const add = () => setItems([...items, items.length])
  return (<>
    <div ref={parent}>
      {items.map(
        (item) => <p key={item}>{ item }</p>
      )}
    </div>
    <button onClick={add}>Add number</button>
    {/* <button onClick={() => enableAnimations(false)}>Disable</button> */}
  </>)
}

export default App
