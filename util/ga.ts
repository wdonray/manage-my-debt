type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};


export const TrackPageLoaded = () => {
  window.gtag('config', process.env.GOOGLE_ANALYTICS);
};

export const TrackEvent = ({ action, category, label, value }: GTagEvent) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};