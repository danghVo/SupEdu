export default function Loading() {
    return (
        <div className={`flex flex-col items-center gap-[64px] relative`}>
            {[...Array(5)].map((item, index) => (
                <div className="w-[70%] bg-white shadow-custom-2 flex flex-col items-between rounded-[16px] h-[300px] gap-[16px] py-[12px] px-[16px]">
                    <div className=" rounded-[16px] w-full h-[40px] bg-slate-400 relative overflow-hidden">
                        <div className="h-full translate-x-[-100%] w-[300px] bg-gradient-to-r from-transparent to-slate-300 relative animate-loading"></div>
                    </div>
                    <div className=" rounded-[32px] w-full h-[200px] bg-slate-400 overflow-hidden">
                        <div className="h-full translate-x-[-100%] w-[300px] bg-gradient-to-r from-transparent to-slate-300 relative animate-loading"></div>
                    </div>
                    <div className=" rounded-[16px] w-full h-[40px] bg-slate-400 overflow-hidden">
                        <div className="h-full translate-x-[-100%] w-[300px] bg-gradient-to-r from-transparent to-slate-300 relative animate-loading"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
