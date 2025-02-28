import { useState } from "react";
import { Switch, Slider, Card, Button } from "@nextui-org/react";

const SoundSettingPage = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState<any>(true);
  const [volume, setVolume] = useState(50);
  const [notificationSound, setNotificationSound] = useState<any>("Beep");

  const handleToggleSound = () => setIsSoundEnabled(!isSoundEnabled);
  const handleVolumeChange = (newValue: number) => setVolume(newValue);
  const handleSoundChange = (sound: any) => setNotificationSound(sound);

  const soundOptions = ["Beep", "Chime", "Ding", "Alert"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sound Settings</h1>

      <Card className="p-6 bg-white shadow-md rounded-lg">
        {/* Enable/Disable Sound */}
        <div className="mb-4 flex justify-between items-center">
          <p className="font-medium">Enable Sound</p>
          <Switch
            checked={isSoundEnabled}
            onChange={handleToggleSound}
            color="success"
          />
        </div>

        {/* Volume Control */}
        {isSoundEnabled && (
          <>
            <div className="mb-4">
              <p className="font-medium mb-2">Volume</p>
              <Slider
                value={volume}
                onValueChange={handleVolumeChange}
                step={5}
                max={100}
                showValue
              />
            </div>

            {/* Select Notification Sound */}
            <div className="mb-4">
              <p className="font-medium mb-2">Notification Sound</p>
              <div className="grid grid-cols-2 gap-2">
                {soundOptions.map((sound) => (
                  <Button
                    key={sound}
                    onClick={() => handleSoundChange(sound)}
                    color={notificationSound === sound ? "success" : "default"}
                    size="sm"
                  >
                    {sound}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default SoundSettingPage;
