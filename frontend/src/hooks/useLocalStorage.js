import { useState, useEffect } from "react";

/** Custom hook for managing local storage and updating state accordingly.
 *
 * 
 * @param {String} key The key used to store the value in local storage.
 * @param {String} initialValue The value used as a default for state if no value is 
 * found in local storage.
 * 
 * @returns {Array} The first element of the array is the value stored in local storage and in state.
 * the second element is the function with which to change the value of the first element.
 * 
 * If state is set to null, useEffect runs and local storage for the key is cleared.
 * 
 * If state is set to a value, useEffect runs and local storage is updated to that value.
 */

function useLocalStorage(key, initialValue = null) {
    const val = localStorage.getItem(key) || initialValue;
  
    const [item, setItem] = useState(val);
  
    useEffect(function setKeyInLocalStorage() {  
      if (item === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, item);
      }
    }, [key, item]);
  
    return [item, setItem];
  }
  
  export default useLocalStorage;