import { useState, useCallback, useRef, useEffect } from "react";
import { saveAs } from "file-saver";

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    //variable is never reset whenever the code is re-run/re-rendered
    const activeHttpRequests = useRef([]);

    //abstracting out the request sending part
    //wrapped in useCallback to prevent re-renders
    const sendRequest = useCallback(async (
        url,
        method = "GET",
        body = null,
        headers = {}
    ) => {
        setIsLoading(true);

        //helps us manage the case when the person change page halfway thru running code
        const httpAbortCtrll = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrll);

        try {
            const response = await fetch(url, {
                method,
                headers,
                body,
                signal: httpAbortCtrll.signal
            });

            //is a file
            if (response.headers.get("content-disposition")) {
                const fileName = response.headers
                    .get("content-disposition")
                    .split(";")
                    .find((n) => n.includes("filename="))
                    .replace("filename=", "")
                    .trim();
                const blob = await response.blob();
                saveAs(blob, fileName);
                setIsLoading(false);
                return;
            }

            const responseData = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrll //clear the old abort controllers
            );

            if (response.ok) {
                //rejects 400s and 500s code;
                setIsLoading(false);
                return responseData;
            } else {
                throw new Error(responseData.message);
            }
        } catch (err) {
            //console.log(err);
            setIsLoading(false);
            setError(err.message || "Something went Wrong");
            throw err;
        }
    }, []); //never gets recreated

    const errorHandler = () => {
        setError(null);
    };

    //useEffect runs when the component mounts
    useEffect(() => { //behaviour changes when the function returns another function instead of void
        // inner function becomes clean up function
        // before the useEffect runs again OR
        // when the component using the hook unmounts
        return () => {
            //abort all active requests
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []);

    return {isLoading, error, sendRequest, errorHandler};
};