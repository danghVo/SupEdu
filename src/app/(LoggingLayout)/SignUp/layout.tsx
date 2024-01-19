'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, useContext, createContext } from 'react';
import React from 'react';

import image from '~/assets/image';

export const FormController = createContext({ onBackward: () => {}, onForward: () => {} });

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
    const [currentForm, setCurrentForm] = useState(1);

    const handleBackward = () => {
        if (currentForm > 0) {
            setCurrentForm((prev) => prev - 1);
            setFormAnimation({
                initital: { x: -100, opacity: 1 },
                animate: { x: 0, opacity: 1 },
            });
        }
    };

    const handleForward = () => {
        if (currentForm < 2) {
            setCurrentForm((prev) => prev + 1);
            setFormAnimation({
                initital: { x: 100, opacity: 1 },
                animate: { x: 0, opacity: 1 },
            });
        }
    };

    return (
        <div className="shadow-custom-3 flex overflow-hidden h-[80vh] w-[1000px] rounded-[50px] bg-[rgb( 225, 230, 220)]/[.1]">
            <Image src={image.signIn} className="w-[50%]" alt="background" />
            <FormController.Provider value={{ onBackward: handleBackward, onForward: handleForward }}>
                {[props.form1, props.form2, props.form3].map((form, index) => {
                    if (currentForm === index) {
                        return (
                            <div key={index} className="grow flex items-center justify-center flex-col">
                                <motion.div
                                    initial={formAnimation.initital}
                                    animate={formAnimation.animate}
                                    className="w-full flex jutify-center flex-col items-center"
                                >
                                    {form}
                                </motion.div>
                            </div>
                        );
                    }
                })}
            </FormController.Provider>
        </div>
    );
}
