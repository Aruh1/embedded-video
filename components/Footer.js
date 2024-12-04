import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Coffee, Github, Icon } from "lucide-react";
import { mugTeabag } from "@lucide/lab";

const TooltipContent = React.memo(({ text }) => (
    <div
        className="absolute z-50 left-1/2 ml-5 top-1/2 -translate-y-1/2
        opacity-0 invisible group-hover:opacity-100 group-hover:visible
        transform -translate-x-2 group-hover:translate-x-0
        transition-all duration-300 ease-out"
    >
        <div className="relative bg-gray-800 rounded-md px-2 py-1">
            <span className="text-xs text-white whitespace-nowrap">{text}</span>
            <div
                className="absolute -left-1 top-1/2 -translate-y-1/2 
                border-t-[6px] border-r-[6px] border-b-[6px] 
                border-t-transparent border-r-gray-800 border-b-transparent"
            ></div>
        </div>
    </div>
));

TooltipContent.displayName = "TooltipContent";

export default function Footer() {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    // Optimize time update with useCallback
    const updateTime = useCallback(() => {
        setCurrentTime(new Date().toLocaleTimeString());
    }, []);

    useEffect(() => {
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [updateTime]);

    return (
        <footer className="fixed bottom-0 left-0 right-0 p-2 sm:p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 animate-fadeIn">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-gray-400 text-xs sm:text-sm gap-2 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-center sm:text-left animate-slideInLeft">
                    <span className="hover:text-gray-200 transition-colors duration-300">
                        © {new Date().getFullYear()} ‧ pololer@Yuramedia Link. All rights reserved.
                    </span>
                    <div className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-300">
                        <span>Powered by</span>
                        <a
                            href="https://vercel.com/"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="flex items-center"
                        >
                            <svg
                                className="h-3 sm:h-4 w-auto ml-1"
                                viewBox="0 0 283 64"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H85.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
                                    fill="currentColor"
                                />
                            </svg>
                        </a>
                    </div>
                    <a
                        href="https://status.pololer.web.id/"
                        target="_blank"
                        className="hover:text-gray-200 transition-colors duration-300"
                        rel="noopener noreferrer"
                    >
                        <Image
                            src="https://uptime.betterstack.com/status-badges/v1/monitor/1ogdv.svg"
                            alt="Uptime Status"
                            height={20}
                            width={65}
                            style={{ width: "auto", height: "auto" }}
                            priority
                        />
                    </a>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-6 animate-slideInRight">
                    <span
                        className="transition-all duration-300 transform flex items-center space-x-2"
                        suppressHydrationWarning
                    >
                        {currentTime}
                    </span>
                    <div className="group relative">
                        <a
                            href="https://ko-fi.com/pololer"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-400 transition-all duration-300 transform hover:scale-110 flex items-center space-x-2 hover:animate-bounce"
                            aria-label="Support on Ko-fi"
                        >
                            <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                        <TooltipContent text="Support on Ko-fi" />
                    </div>

                    <div className="group relative">
                        <a
                            href="https://trakteer.id/luminiatus"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-orange-400 transition-all duration-300 transform hover:scale-110 flex items-center space-x-2 hover:animate-bounce"
                            aria-label="Support on Trakteer"
                        >
                            <Icon iconNode={mugTeabag} className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                        <TooltipContent text="Dukung Saya di Trakteer" />
                    </div>

                    <div className="group relative">
                        <a
                            href="https://github.com/Aruh1/embedded-video"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-200 transition-all duration-300 transform hover:scale-110 flex items-center space-x-2 hover:animate-bounce"
                            aria-label="View source on GitHub"
                        >
                            <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                        <TooltipContent text="View on GitHub" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
