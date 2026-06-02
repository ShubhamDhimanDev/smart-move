import { useEffect, useMemo, useRef, useState } from 'react';

type Partner = {
    id: number;
    name: string;
    image: string | null;
    universities_link: string | null;
};

type Props = {
    partners: Partner[];
    intervalMs?: number;
};

export default function UniversityPartnersCarousel({ partners, intervalMs = 3000 }: Props) {
    const [index, setIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(6);
    const [slideWidth, setSlideWidth] = useState(0);
    const [animate, setAnimate] = useState(true);
    const timerRef = useRef<number | null>(null);
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);

    function getVisibleCount(width: number) {
        if (width >= 1600) return 10;
        if (width >= 1280) return 8;
        if (width >= 1024) return 6;
        if (width >= 768) return 4;
        return 2;
    }

    useEffect(() => {
        const handleResize = () => {
            const vw = Math.max(0, viewportRef.current?.clientWidth ?? window.innerWidth);
            const vc = getVisibleCount(window.innerWidth);
            setVisibleCount(vc);
            setSlideWidth(vw / vc);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const stop = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const start = () => {
        if (timerRef.current) return;
        if (!partners || partners.length === 0) return;

        timerRef.current = window.setInterval(() => {
            setIndex((i) => i + 1);
        }, intervalMs);
    };

    useEffect(() => {
        // restart autoplay when partners or visibleCount changes
        stop();
        start();

        return () => stop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [partners, visibleCount, intervalMs]);

    if (!partners || partners.length === 0) return null;

    const clonesCount = visibleCount;
    const isContinuous = partners.length > visibleCount;

    const displaySlides = useMemo(() => {
        if (!isContinuous) return partners;

        const prefix = partners.slice(-clonesCount);
        const suffix = partners.slice(0, clonesCount);

        return [...prefix, ...partners, ...suffix];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [partners, clonesCount, isContinuous]);

    const maxIndex = Math.max(0, (displaySlides.length - visibleCount));

    useEffect(() => {
        // When partners or visibleCount change, reset index to first real slide (cloned offset)
        if (isContinuous) {
            setAnimate(false);
            setIndex(clonesCount);
            // re-enable animation after DOM updates
            requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
        } else {
            setAnimate(false);
            setIndex(0);
            requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [partners.length, visibleCount]);

    // When a transition finishes, if we're on a clone slide, jump to the corresponding real slide without animation
    useEffect(() => {
        const tr = trackRef.current;
        if (!tr || !isContinuous) return;

        const onTransitionEnd = () => {
            const realFirst = clonesCount;
            const realLast = clonesCount + partners.length - 1;

            if (index > realLast || index < realFirst) {
                const offset = index - clonesCount;
                const normalized = ((offset % partners.length) + partners.length) % partners.length;
                const newIndex = clonesCount + normalized;

                setAnimate(false);
                setIndex(newIndex);

                // Re-enable animation on the next frame
                requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
            }
        };

        tr.addEventListener('transitionend', onTransitionEnd);
        return () => tr.removeEventListener('transitionend', onTransitionEnd);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, isContinuous, clonesCount, partners.length]);

    return (
        <section className="py-12 bg-transparent">
            <div className="container mx-auto max-w-7xl px-6 lg:px-10">
                <div className="mb-6 text-center">
                    <h3 className="font-label text-secondary-container font-bold tracking-[0.2em] mb-4 text-xs uppercase">Our University Partners</h3>
                    <h2 className='text-white font-headline font-bold text-[clamp(2rem,4vw,3rem)] tracking-tight mb-4'>Connecting Students with <span className="text-gradient-gold">World-Class Universities</span></h2>
                </div>

                <div ref={viewportRef} className="overflow-hidden relative" onMouseEnter={stop} onMouseLeave={start}>
                    {displaySlides.length === 0 ? null : partners.length <= visibleCount ? (
                        <div className="flex items-center justify-center gap-8 py-6">
                            {partners.map((p) => (
                                <div key={p.id} className="flex items-center justify-center px-4">
                                    {p.universities_link ? (
                                        <a href={p.universities_link} target="_blank" rel="noopener noreferrer" className="block w-full text-center">
                                            {p.image ? (
                                                <div className="mx-auto bg-white rounded-xl px-5 py-3 flex items-center justify-center h-20">
                                                    <img src={p.image} alt={p.name} className="max-h-12 md:max-h-14 object-contain" />
                                                </div>
                                            ) : (
                                                <span className="text-white/60">{p.name}</span>
                                            )}
                                        </a>
                                    ) : (
                                        <div className="w-full text-center">
                                            {p.image ? (
                                                <div className="mx-auto bg-white rounded-xl px-5 py-3 flex items-center justify-center h-20">
                                                    <img src={p.image} alt={p.name} className="max-h-12 md:max-h-14 object-contain" />
                                                </div>
                                            ) : (
                                                <span className="text-white/60">{p.name}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* controls */}
                            <button
                                type="button"
                                aria-label="Previous"
                                onClick={() => setIndex((i) => i - 1)}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button
                                type="button"
                                aria-label="Next"
                                onClick={() => setIndex((i) => i + 1)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>

                            <div
                                ref={trackRef}
                                className={`${animate ? 'transition-transform duration-700 ease-in-out' : 'transition-none'} flex`}
                                style={{ width: `${displaySlides.length * slideWidth}px`, transform: `translateX(-${index * slideWidth}px)` }}
                            >
                                {displaySlides.map((p, idx) => (
                                    <div key={`${p.id}-${idx}`} className="flex-shrink-0 flex items-center justify-center px-3" style={{ width: `${slideWidth}px` }}>
                                        {p.universities_link ? (
                                            <a href={p.universities_link} target="_blank" rel="noopener noreferrer" className="block w-full">
                                                {p.image ? (
                                                    <div className="bg-white rounded-xl px-5 py-3 flex items-center justify-center h-20">
                                                        <img src={p.image} alt={p.name} className="max-h-12 md:max-h-14 object-contain" />
                                                    </div>
                                                ) : (
                                                    <span className="text-white/60">{p.name}</span>
                                                )}
                                            </a>
                                        ) : (
                                            <div className="w-full">
                                                {p.image ? (
                                                    <div className="bg-white rounded-xl px-5 py-3 flex items-center justify-center h-20">
                                                        <img src={p.image} alt={p.name} className="max-h-12 md:max-h-14 object-contain" />
                                                    </div>
                                                ) : (
                                                    <span className="text-white/60">{p.name}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
