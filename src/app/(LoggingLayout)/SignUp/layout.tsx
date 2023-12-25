'use client';
import Image from 'next/image';

import image from '~/assets/image';

export default function Layout(props: { form1: React.ReactNode; form2: React.ReactNode; form3: React.ReactNode }) {
    return (
        <div className="shadow-custom-3 flex overflow-hidden h-[80vh] w-[1000px] rounded-[50px] bg-[rgb( 225, 230, 220)]/[.1]">
            <Image src={image.signIn} className="w-[50%]" alt="background" />
            <div className="grow flex items-center justify-center flex-col">
                {/* {props.form1} */}
                {/* {props.form2} */}
                {props.form3}
            </div>
        </div>
    );
}
