import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

export default function WaterJugGame() {
  const [jug1, setJug1] = useState(0);
  const [jug2, setJug2] = useState(0);
  const [capacity1, setCapacity1] = useState(3);
  const [capacity2, setCapacity2] = useState(5);
  const [goal, setGoal] = useState(4);
  const [log, setLog] = useState([]);
  const [levelProgress, setLevelProgress] = useState(0);
  const [sound] = useState(new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3"));
  const [bgMusic] = useState(new Audio("https://www.bensound.com/bensound-music/bensound-sunny.mp3"));

  useEffect(() => {
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    bgMusic.play();
    return () => bgMusic.pause();
  }, []);

  useEffect(() => {
    if (jug1 === goal || jug2 === goal) {
      alert("🎉 Congratulations! You've reached the goal!");
    }
    const totalProgress = Math.max((jug1 / goal) * 100, (jug2 / goal) * 100);
    setLevelProgress(Math.min(totalProgress, 100));
  }, [jug1, jug2, goal]);

  const playSound = () => {
    sound.currentTime = 0;
    sound.play();
  };

  const addLog = (action) => {
    playSound();
    setLog(prev => [action, ...prev]);
  };

  const fillJug = (jug) => {
    if (jug === 1) {
      setJug1(capacity1);
      addLog(`Filled Jug 1 to ${capacity1}`);
    } else {
      setJug2(capacity2);
      addLog(`Filled Jug 2 to ${capacity2}`);
    }
  };

  const emptyJug = (jug) => {
    if (jug === 1) {
      setJug1(0);
      addLog("Emptied Jug 1");
    } else {
      setJug2(0);
      addLog("Emptied Jug 2");
    }
  };

  const pour = (from) => {
    let transfer;
    if (from === 1) {
      transfer = Math.min(jug1, capacity2 - jug2);
      setJug1(jug1 - transfer);
      setJug2(jug2 + transfer);
      addLog(`Poured ${transfer} from Jug 1 to Jug 2`);
    } else {
      transfer = Math.min(jug2, capacity1 - jug1);
      setJug2(jug2 - transfer);
      setJug1(jug1 + transfer);
      addLog(`Poured ${transfer} from Jug 2 to Jug 1`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-500 to-yellow-300 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/water-bg.gif')] bg-cover bg-no-repeat bg-center opacity-20 z-0" />
      <div className="z-10 w-full max-w-5xl">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-xl mb-8 text-center animate-pulse">💧 Water Jug Puzzle Game</h1>

        {/* Level progress bar */}
        <div className="mb-6">
          <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-white text-sm text-right mt-1">Progress: {Math.floor(levelProgress)}%</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Input
            type="number"
            placeholder="Jug 1 Capacity"
            value={capacity1}
            onChange={(e) => setCapacity1(Number(e.target.value))}
            className="rounded-xl shadow-md border-2 border-blue-300"
          />
          <Input
            type="number"
            placeholder="Jug 2 Capacity"
            value={capacity2}
            onChange={(e) => setCapacity2(Number(e.target.value))}
            className="rounded-xl shadow-md border-2 border-pink-300"
          />
          <Input
            type="number"
            placeholder="Goal"
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
            className="rounded-xl shadow-md border-2 border-yellow-300"
          />
        </div>

        <div className="flex gap-20 items-end justify-center mb-8">
          {[{ id: 1, level: jug1, capacity: capacity1 }, { id: 2, level: jug2, capacity: capacity2 }].map(jug => (
            <div key={jug.id} className="relative w-32 h-72 bg-gradient-to-t from-white to-blue-200 rounded-3xl border-8 border-blue-500 shadow-xl overflow-hidden">
              <motion.div
                className="absolute bottom-0 w-full bg-blue-400"
                initial={{ height: 0 }}
                animate={{ height: `${(jug.level / jug.capacity) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
              <p className="absolute top-2 left-3 font-bold text-blue-800 text-xl">Jug {jug.id}</p>
              <p className="absolute bottom-2 left-3 text-sm text-white bg-black bg-opacity-30 px-2 py-1 rounded">
                {jug.level} / {jug.capacity} L
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <Button onClick={() => fillJug(1)} className="bg-blue-500 hover:bg-blue-600 text-white text-lg">Fill Jug 1</Button>
          <Button onClick={() => fillJug(2)} className="bg-pink-500 hover:bg-pink-600 text-white text-lg">Fill Jug 2</Button>
          <Button onClick={() => pour(1)} className="bg-green-500 hover:bg-green-600 text-white text-lg">Pour Jug 1 → 2</Button>
          <Button onClick={() => pour(2)} className="bg-yellow-500 hover:bg-yellow-600 text-white text-lg">Pour Jug 2 → 1</Button>
          <Button onClick={() => emptyJug(1)} className="bg-red-500 hover:bg-red-600 text-white text-lg">Empty Jug 1</Button>
          <Button onClick={() => emptyJug(2)} className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg">Empty Jug 2</Button>
        </div>

        <Card className="w-full bg-white/70 shadow-lg backdrop-blur-lg">
          <CardContent>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-blue-900">
              <Volume2 className="w-5 h-5 text-blue-600" /> Move History
            </h2>
            <ul className="text-sm max-h-40 overflow-auto space-y-1 text-gray-800">
              {log.map((entry, idx) => (
                <li key={idx}>• {entry}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
