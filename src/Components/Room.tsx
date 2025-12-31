function Room({ label, restricted, className }:{
    label:string,
    restricted?:boolean,
    className?:string
})
{
  return (
    <div
      className={`
        ${className}
        rounded-lg border p-3 font-semibold
        ${restricted
          ? "bg-red-200 border-red-500 text-red-800"
          : "bg-white border-gray-400"}
      `}
    >
      {label}
    </div>
  );
}

export default Room;