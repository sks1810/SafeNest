#include <WiFi.h>
#include <esp_now.h>
#include <BLEDevice.h>
#include <BLEScan.h>

HardwareSerial mmw(1);

typedef struct {
  char id;
  int zone;
  char ble[6];
} PacketA;

typedef struct {
  int zoneA;
  int zoneB;
  char bleA[6];
  char bleB[6];
  bool wearable;
} RoomData;

RoomData room;
BLEScan *scanner;
bool wearableSeen = false;
String bleBucket = "FAR";

class ScanCB : public BLEAdvertisedDeviceCallbacks {
  void onResult(BLEAdvertisedDevice d) {
    if (d.getName() == "CHILD_WEARABLE") {
      wearableSeen = true;
      int r = d.getRSSI();
      if (r > -55) bleBucket = "NEAR";
      else if (r > -70) bleBucket = "MID";
      else bleBucket = "FAR";
    }
  }
};

int parseZone(String s) {
  if (s.indexOf("Z1") >= 0) return 1;
  if (s.indexOf("Z2") >= 0) return 2;
  if (s.indexOf("Z3") >= 0) return 3;
  return 0;
}

void onReceive(const uint8_t *mac, const uint8_t *data, int len) {
  PacketA *p = (PacketA*)data;
  if (p->id == 'A') {
    room.zoneA = p->zone;
    strcpy(room.bleA, p->ble);
  }
}

void setup() {
  WiFi.mode(WIFI_STA);
  esp_now_init();
  esp_now_register_recv_cb(onReceive);
  mmw.begin(256000, SERIAL_8N1, 25, 26);
  BLEDevice::init("");
  scanner = BLEDevice::getScan();
  scanner->setAdvertisedDeviceCallbacks(new ScanCB());
  scanner->setActiveScan(true);
}

void loop() {
  if (mmw.available()) {
    String line = mmw.readStringUntil('\n');
    room.zoneB = parseZone(line);
  }

  wearableSeen = false;
  scanner->start(1, false);

  strcpy(room.bleB, bleBucket.c_str());
  room.wearable = wearableSeen;

  esp_now_send(NULL, (uint8_t*)&room, sizeof(room));
  delay(500);
}
