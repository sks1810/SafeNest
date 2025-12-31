import { useEffect, useRef, useState } from "react"
import Navbar from "./Components/Navbar"
import FloorPlan from "./Components/FloorPlan"
import StatusFeed from "./Components/StatusFeed"

function App() {

  const socketRef = useRef<null | WebSocket>(null)
  const [status, setStatus] = useState<Boolean>(true)

  useEffect(() => {
    socketRef.current = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)

    socketRef.current.onopen = () => {
      console.log('Socket connected!')
    }

    socketRef.current.onmessage = (event) => {
      if (status != event.data) {
        setStatus(event.data);
      }
    }

    socketRef.current.onerror = () => {
      alert("Something went wrong!")
    }

    socketRef.current.onclose = () => {
      console.log('Socket disconnected!')
    }

  }, [])

  return (
    <>
      <Navbar/>
      <div className="h-[80dvh] font-outfit flex space-evenly">
        <FloorPlan />
        <div>
          <StatusFeed
            childName="Leo"
            age={5}
            statusPrimary="Playing Safely"
            statusSecondary="Moderate Movement Detected"
            activity="Last slept: 9:30 PM – 7:00 AM"
            sleeping="N/A"
            anxietyLevel="Low (Heart rate stable)"
            alerts={[]}
          />
          <div className="flex flex-col justify-end p-3">
            <p className="text-8xl font-bold">The Subject</p>
            <p className="text-7xl font-semibold">you're are tracking is </p>
            {
              status ?
                <p className="text-7xl font-bold text-blue-400">Available within the range</p> :
                <p className="text-7xl font-bold text-red-500">Is out of range of tracking!</p>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default App

