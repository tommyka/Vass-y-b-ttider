import { Day } from "../types/Day";
import { Direction } from "../types/Direction";
import { useEffect, useState } from "preact/hooks";

const CACHE_KEY = "ferry_cache";

interface ICache {
  day?: Day;
  direction?: Direction;
}

interface ICacheData extends ICache {
  time: number;
}

const useSelectionCache = () => {
  return localCache;
};

export const setCacheData = (update: ICache) => {
  const newData = { ...localCache, ...update };

  localStorage.setItem(CACHE_KEY, JSON.stringify({ ...newData, time: new Date().getTime() }));

  localCache = localCache;
};

export const getCacheData = (): ICache => {
  const json = localStorage.getItem(CACHE_KEY);
  var timestamp = new Date().getTime();

  if (json !== null) {
    const cacheData = JSON.parse(json) as ICacheData;
    const timeDelta = timestamp - cacheData.time;
    if (timeDelta < 2 * 60 * 1000) {
      localCache = { day: cacheData.day, direction: cacheData.direction };
      return localCache;
    }
  }

  return { day: undefined, direction: undefined };
};

let localCache = getCacheData();

export default useSelectionCache;
