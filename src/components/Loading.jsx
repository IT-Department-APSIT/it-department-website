'use client';

import { useState, useEffect } from 'react';

export default function Loading() {
    const [isLoading, setIsLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Wait for the document to be fully loaded
        const handleLoad = () => {
            // Small delay for smooth transition
            setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => {
                    setIsLoading(false);
                }, 600); // Match the CSS fade-out duration
            }, 300);
        };

        // If document is already loaded
        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
            // Fallback: hide after 3 seconds max
            const fallback = setTimeout(handleLoad, 3000);
            return () => {
                window.removeEventListener('load', handleLoad);
                clearTimeout(fallback);
            };
        }
    }, []);

    if (!isLoading) return null;

    return (
        <div className={`loading-screen ${fadeOut ? 'loading-screen-fadeout' : ''}`}>
            <div className="loading-content">
                <div className="loading-logo">
                    <img
                        src="/logo.jpg"
                        alt="APSIT IT Department"
                        width={120}
                        height={120}
                    />
                </div>
                <div className="loading-bar-container">
                    <div className="loading-bar" />
                </div>
            </div>
        </div>
    );
}
