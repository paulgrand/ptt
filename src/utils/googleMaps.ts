// utils/googleMaps.ts
let isLoading = false;
let isLoaded = false;
const callbacks: (() => void)[] = [];

export function loadGoogleMapsScript(callback: () => void) {
  // If already loaded, call callback immediately
  if (isLoaded && window.google) {
    callback();
    return;
  }

  // Add to callback queue if currently loading
  if (isLoading) {
    callbacks.push(callback);
    return;
  }

  // Start loading
  isLoading = true;
  callbacks.push(callback);

  // Create script element
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
  script.async = true;
  script.defer = true;

  script.onload = () => {
    isLoaded = true;
    isLoading = false;
    callbacks.forEach(cb => cb());
    callbacks.length = 0;
  };

  document.head.appendChild(script);
}

export function isGoogleMapsLoaded() {
  return isLoaded && window.google;
}
