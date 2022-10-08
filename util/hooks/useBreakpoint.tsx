import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

interface BreakPoint {
  value: string
  lowerBound: number
  upperBound: number
  width?: number
}

export enum SIZE {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = 'xxl'
}

const BreakPoints: BreakPoint[] = [ 
  { value: SIZE.XS, lowerBound: -1, upperBound: 576 },
  { value: SIZE.SM, lowerBound: 576, upperBound: 768 },
  { value: SIZE.MD, lowerBound: 768, upperBound: 992 },
  { value: SIZE.LG, lowerBound: 992, upperBound: 1200 },
  { value: SIZE.XL, lowerBound: 1200, upperBound: 1400 },
  { value: SIZE.XXL, lowerBound: 1400, upperBound: 9999 },
];

const useBreakpoint = () => {
  const [breakPoint, setBreakPoint] = useState(BreakPoints[0]);
	
  const resolveBreakpoint = useCallback((width: number) => {
    let value = BreakPoints[0];

    BreakPoints.forEach((b) => {
      if (width >= b.lowerBound && width < b.upperBound) {
        value = { ...b, width };
      }
    });
    
    return value;
  }, []);

  useEffect(() => {
    const calcInnerWidth = debounce(function () {
      setBreakPoint(resolveBreakpoint(window.innerWidth));
    }, 200);

    calcInnerWidth();
    window.addEventListener('resize', calcInnerWidth);
    return () => window.removeEventListener('resize', calcInnerWidth);
  }, [resolveBreakpoint]);
	
  return breakPoint;
};

export default useBreakpoint;