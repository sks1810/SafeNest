type StatusFeedProps = {
    childName: string;
    age: number;
    statusPrimary: string;
    statusSecondary: string;
    activity: string;
    sleeping: string;
    anxietyLevel: string;
    alerts: string[];
  };
  
  export default function StatusFeed({
    childName,
    age,
    statusPrimary,
    statusSecondary,
    activity,
    sleeping,
    anxietyLevel,
    alerts,
  }: StatusFeedProps)
  {
    return (
      <div className="w-[340px] bg-white rounded-lg shadow-lg p-5">
        {/* Header */}
        <h2 className="text-lg font-semibold mb-4">Status Feed</h2>
  
        {/* Content */}
        <div className="space-y-2 text-sm text-gray-800">
          <p>
            <span className="font-semibold">Child Name:</span>{" "}
            {childName} ({age} yrs old)
          </p>
  
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {statusPrimary}
          </p>
  
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {statusSecondary}
          </p>
  
          <p>
            <span className="font-semibold">Activity:</span>{" "}
            {activity}
          </p>
  
          <p>
            <span className="font-semibold">Sleeping:</span>{" "}
            {sleeping}
          </p>
  
          <p>
            <span className="font-semibold">Anxiety Level:</span>{" "}
            {anxietyLevel}
          </p>
  
          <p>
            <span className="font-semibold">Alerts:</span>{" "}
            {alerts.length === 0 ? "None" : alerts.join(", ")}
          </p>
        </div>
  
        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700 transition">
            Set Geofence
          </button>
  
          <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md text-sm hover:bg-gray-300 transition">
            Profile Settings
          </button>
        </div>
      </div>
    );
  }
  