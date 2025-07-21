export default function HomePage(){
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-[500px] h-[650px] backdrop-blur-xl shadow-xl rounded-lg flex flex-col justify-center items-center bg-red-900 p-4">
                <div className="w-full h-[15%] flex justify-center">
                    <h1 className='text-5xl font-bold text-green-400 font-mono italic mb-4'>Home Page</h1>
                </div>
                {/* Additional content can be added here */}
                <p className='text-white text-base mt-4'>Welcome to the Home Page!</p>
            </div>
        </div>
    );
}