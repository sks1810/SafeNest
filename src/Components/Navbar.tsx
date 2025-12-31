function Navbar({ username }:{
    username?:string
}){
    return <div className=" flex justify-between text-xl p-3 font-outfit ">
        <div className="font-bold">
            <p>SafeNet</p>
        </div>
        {
            username &&
            <div>
                <p>Hello <span className="font-semibold">{username}</span>!</p>
            </div>
        }
        <div></div>
    </div>
}

export default Navbar