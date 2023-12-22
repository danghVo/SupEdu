'use client';

import SimpleBarReact from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

export default function Landing() {
    return (
        <SimpleBarReact style={{ maxHeight: '100vh' }} classNames={{ track: 'simplebar-track mr-2' }} forceVisible="y">
            <div id="section-1" className="h-[100vh] max-h-[700px] relative flex flex-col items-center justify-center ">
                <div className="absolute  top-[0px] right-[50px] w-[500px] h-[500px] background-circle-2 rounded-full blur-2xl"></div>
                <div className="absolute  top-[150px] left-[50px] w-[500px] h-[500px] background-circle-1 rounded-full blur-2xl"></div>
                <div className="z-10">
                    <div className="relative shadow-custom-1 rounded-full py-8 px-16">
                        <h1 className="text-center text-8xl font-black">Welcome To SupEdu</h1>
                    </div>
                    <h1 className="text-center mt-10 text-[28px] cursor-pointer font-medium">Bắt Đầu</h1>
                </div>
            </div>
            <div id="section-2" className="h-[100vh] max-h-[700px]"></div>
            <div id="section-3" className="h-[100vh] max-h-[700px]"></div>
            <div id="section-4" className="h-[100vh] max-h-[700px]"></div>
        </SimpleBarReact>
    );
}
