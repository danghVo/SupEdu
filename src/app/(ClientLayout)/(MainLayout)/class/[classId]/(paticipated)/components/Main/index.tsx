'use client';

import { motion } from 'framer-motion';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { classDetailSections } from '~/constant';
import SimpleBarReact from 'simplebar-react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faGear, faPen } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Input from '~/components/Input';
import Button from '~/components/Button';

export default function Main({ classId, children }: { classId: string; children: React.ReactNode }) {
    const pathName = usePathname();
    const [currentSection, setCurrentSection] = useState(
        classDetailSections.find((classDetailSection) => classDetailSection.path === pathName.split('/')[3]) ||
            classDetailSections[0],
    );
    const [sectionAnimation, setSectionAnimation] = useState({ x: 0 });
    const [editClassName, setEditClassName] = useState(false);
    const [className, setClassName] = useState('Lớp A');
    const router = useRouter();

    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const pathSection = pathName.split('/')[3];
        const currentClassSection = classDetailSections.find(
            (classDetailSection) => classDetailSection.path === pathSection,
        );

        if (currentClassSection) {
            setCurrentSection(currentClassSection);
        }
    }, [pathName]);

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

    const handleSubmitClassName = () => {
        // submit change class name

        setEditClassName(false);
    };

    return (
        <SimpleBarReact
            style={{ maxHeight: '100vh' }}
            classNames={{ track: 'simplebar-track mr-2' }}
            forceVisible="y"
            className="grow relative z-[800]"
        >
            <div className="min-h-screen flex-col flex p-[32px] pt-[32px]" ref={wrapperRef}>
                <div className="flex justify-between items-center mb-[28px]">
                    <div className="font-bold flex items-center justify-between text-[32px]">
                        {editClassName ? (
                            <>
                                <Input classNameWrapper="w-[200px]" value={className} onChange={setClassName} />
                                <div onClick={handleSubmitClassName} className="text-[24px] ml-[16px] cursor-pointer">
                                    <FontAwesomeIcon icon={faCheck} />
                                </div>
                            </>
                        ) : (
                            <>
                                <span>Lớp A</span>
                                <div
                                    onClick={() => {
                                        setEditClassName(true);
                                    }}
                                    className="text-[24px] ml-[16px] cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faPen} />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="mr-[64px]">
                        <Button className="rounded-lg bg-red-700 text-white w-[100px]" theme="" handleClick={() => {}}>
                            Thoát
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-[32px] mb-[12px] ml-[8px]">
                    {classDetailSections.map((section, index) => (
                        <Link
                            key={index}
                            href={`/class/${classId}/` + section.path}
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
