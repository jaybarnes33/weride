import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(300); // 300 seconds = 5 minutes

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <View>
      <Text className={clsx(["text-xs", timeLeft < 80 && "text-red-500"])}>
        {formatTime(timeLeft)}
      </Text>
    </View>
  );
};

export default CountdownTimer;
