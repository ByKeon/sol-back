export const isMobilen = () => window.matchMedia('(max-width: 767px)').matches;
export const isTablet = () => window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches;
