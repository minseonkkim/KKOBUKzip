import { useState, useEffect } from "react";

const usePriorityLoading = (priority: number) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, priority * 1000);

    return () => clearTimeout(timer);
  }, [priority]);

  return shouldLoad;
}

export default usePriorityLoading;