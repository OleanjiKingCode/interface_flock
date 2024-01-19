import { useState } from "react";

const pad = (n: number) => (n < 10 ? `0${n}` : n);

export const Countdown = ({targetDate}: {targetDate: number}) => {

    // var countDownDate = new Date("Jan 01, 2024 00:00:00").getTime();
    const [days, setDays] = useState<number>(0);
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);
    
    // Update the count down every 1 second
    var x = setInterval(function () {
    
        // Get today's date and time
        let today = new Date().getTime();
    
        // Find the distance between now and the count down date
        let interval = targetDate - today;

        if (interval < 0) {
            clearInterval(x);
            return;
        }
    
        setDays(Math.ceil(interval / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        setMinutes(Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60)));
        setSeconds(Math.floor((interval % (1000 * 60)) / 1000));
    
    }, 1000);

    return (
        <div className="flex flex-row items-center justify-center space-x-1 text-black text-[22px] font-bold">
            <p>{pad(days)}d {pad(hours)}h {pad(minutes)}m {pad(seconds)}s</p>
        </div>
    )
}