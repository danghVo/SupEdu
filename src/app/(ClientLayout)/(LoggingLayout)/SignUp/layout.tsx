'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, useContext, createContext } from 'react';
import React from 'react';

import image from '~/assets/image';
import Link from 'next/link';

export const FormController = createContext({
    onBackward: () => {},
    onForward: () => {},
    formData: {},
    onChange: (args?: any) => {},
});

export default function Layout(props: {
    form1: React.ReactNode;
    form2: React.ReactNode;
    form3: React.ReactNode;
    params: any;
}) {
    const [formAnimation, setFormAnimation] = useState({
        initital: { opacity: 0, x: 0 },
        animate: { opacity: 1, x: 0 },
    });
    const [currentForm, setCurrentForm] = useState(0);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        age: 20,
        role: 'TEACHER',
    });

    const handleBackward = (formIndex?: number) => {
        if (currentForm > 0) {
            setCurrentForm(typeof formIndex === 'number' ? formIndex : (prev) => prev - 1);
            setFormAnimation({
                initital: { x: -100, opacity: 1 },
                animate: { x: 0, opacity: 1 },
            });
        }
    };

    const handleForward = (formIndex?: number) => {
        if (currentForm < 2) {
            setCurrentForm(typeof formIndex === 'number' ? formIndex : (prev) => prev + 1);
            setFormAnimation({
                initital: { x: 100, opacity: 1 },
                animate: { x: 0, opacity: 1 },
            });
        }
    };

    return (
        <div className="shadow-custom-3 flex overflow-hidden h-[80vh] w-[1200px] rounded-[50px] bg-[rgb( 225, 230, 220)]/[.1]">
            <Image src={image.signIn} className="w-[50%]" alt="background" />

            <FormController.Provider
                value={{
                    onBackward: handleBackward,
                    onForward: handleForward,
                    formData,
                    onChange: setFormData,
                }}
            >
                <div className="flex flex-col justify-center grow relative">
                    <div className="text-center flex justify-between w-full px-12 mb-[16px]">
                        <div className="text-[18px] font-semibold">Đăng ký</div>
                        <div>
                            Bạn đã có tài khoản?
                            <Link
                                href={'./SignIn'}
                                className="ml-[12px] text-[18px] font-semibold cursor-pointer underline"
                            >
                                Đăng nhập
                            </Link>
                        </div>
                    </div>
                    {[props.form1, props.form2, props.form3].map((form, index) => {
                        if (currentForm === index) {
                            return (
                                <motion.div
                                    key={index}
                                    initial={formAnimation.initital}
                                    animate={formAnimation.animate}
                                    className="w-full flex jutify-center flex-col items-center"
                                >
                                    {form}
                                </motion.div>
                            );
                        }
                    })}
                </div>
            </FormController.Provider>
        </div>
    );
}
