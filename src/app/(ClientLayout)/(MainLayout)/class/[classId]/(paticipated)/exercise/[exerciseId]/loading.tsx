export default function Loading() {
    return (
        <div className="flex items-start gap-[32px] relative">
            <div className="w-[70%] bg-white shadow-custom-2 flex flex-col items-between rounded-[16px] h-[300px] gap-[16px] py-[12px] px-[16px]">
                <div className=" rounded-[16px] w-full h-[40px] bg-slate-400 relative overflow-hidden">
                    <div className="h-full w-[300px] translate-x-[-100%] bg-gradient-to-r from-transparent to-slate-300 relative animate-loading"></div>
                </div>
                <div className=" rounded-[32px] w-full h-[200px] bg-slate-400 overflow-hidden">
                    <div className="h-full w-[300px] translate-x-[-100%] bg-gradient-to-r from-transparent to-slate-300 relative animate-loading"></div>
                </div>
                <div className=" rounded-[16px] w-full h-[40px] bg-slate-400 overflow-hidden">
                    <div className="h-full w-[300px] translate-x-[-100%] bg-gradient-to-r from-transparent to-slate-300 relative animate-loading"></div>
                </div>
            </div>
            <div className="grow h-[300px] bg-white rounded-2xl px-[16px] py-[16px] shadow-custom-1 flex flex-col gap-[16px]">
                <div className="h-[36px] bg-slate-400 relative rounded-[16px] overflow-hidden">
                    <div className="h-full w-[100px] translate-x-[-100%] bg-gradient-to-r from-transparent to-slate-300 relative animate-loading"></div>
                </div>
                <div className="h-[200px] bg-slate-400 relative rounded-[16px] overflow-hidden">
                    <div className="h-full w-[100px] translate-x-[-100%] bg-gradient-to-r from-transparent to-slate-300 relative animate-loading"></div>
                </div>
                <div className="h-[40px] bg-slate-400 relative rounded-[16px] overflow-hidden">
                    <div className="h-full w-[100px] translate-x-[-100%] bg-gradient-to-r from-transparent to-slate-300 relative animate-loading"></div>
                </div>
            </div>
        </div>
    );
}
