export default function Landing() {
    return (
        <div id="section-1" className="h-[100vh] max-h-[700px] relative flex flex-col items-center justify-center">
            <div className="absolute  top-[0px] right-[50px] w-[500px] h-[500px] background-circle-2 rounded-full blur-2xl"></div>
            <div className="absolute  top-[150px] left-[50px] w-[500px] h-[500px] background-circle-1 rounded-full blur-2xl"></div>
            <div className="z-10">
                <div className="relative shadow-custom-1 rounded-full py-8 px-16">
                    <h1 className="text-center text-8xl font-black">Welcome To SupEdu</h1>
                </div>
            </div>
        </div>
    );
}
