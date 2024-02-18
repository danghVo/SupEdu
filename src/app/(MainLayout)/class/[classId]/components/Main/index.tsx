'use client';

import { motion } from 'framer-motion';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { classDetailSections } from '~/constant';
import SimpleBarReact from 'simplebar-react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';

export default function Main({ children }: { children: React.ReactNode }) {
    const pathName = usePathname();
    const [currentSection, setCurrentSection] = useState(
        classDetailSections.find(
            (classDetailSection) => classDetailSection.path === pathName.replace('/class/0/', '').split('/')[0],
        ) || classDetailSections[0],
    );
    const [sectionAnimation, setSectionAnimation] = useState({ x: 0 });

    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const handleChangeSection = (event: MouseEvent, section: string) => {
        if (wrapperRef.current) {
            const prevAnimationElement = wrapperRef.current.querySelector('#section-animation');
            if (prevAnimationElement) {
                const prevX = prevAnimationElement.getBoundingClientRect().left;
                const targetElement = event.target as HTMLDivElement;

                setCurrentSection(
                    classDetailSections.find((classDetailSeciton) => classDetailSeciton.name === section)!,
                );
                setSectionAnimation({ x: prevX - targetElement.getBoundingClientRect().left });
            }
        }
    };

    return (
        <SimpleBarReact
            style={{ maxHeight: '100vh' }}
            classNames={{ track: 'simplebar-track mr-2' }}
            forceVisible="y"
            className="grow relative z-[800]"
        >
            <div className="min-h-screen flex-col flex p-[32px] pt-[32px]" ref={wrapperRef}>
                <div className="font-bold flex items-center text-[32px] mb-[28px]">Lớp A</div>
                <div className="flex items-center gap-[32px] mb-[12px] ml-[8px]">
                    {classDetailSections.map((section, index) => (
                        <Link
                            key={index}
                            href={'/class/0/' + section.path}
                            onClick={(event) => handleChangeSection(event, section.name)}
                            className={`text-[18px] font-semibold cursor-pointer px-[12px] py-[8px] relative ${
                                section.name === currentSection.name ? 'text-white' : ''
                            }`}
                        >
                            {currentSection.name === section.name && (
                                <motion.div
                                    id="section-animation"
                                    initial={sectionAnimation}
                                    animate={{ x: 0 }}
                                    className="bg-[var(--text-color)] absolute top-0 left-0 h-full w-full rounded-full"
                                ></motion.div>
                            )}
                            <span className="relative z-20">{section.name}</span>
                        </Link>
                    ))}
                </div>

                <div className="grow mt-[28px] relative">{children}</div>
            </div>
        </SimpleBarReact>
    );
}
