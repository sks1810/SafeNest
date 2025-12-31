#include <WiFi.h>
#include <esp_now.h>
#include <BLEDevice.h>
#include <BLEScan.h>

HardwareSerial mmw(1);

typedef struct {
  char id;
  int zone;
  char ble[6];
} Packet;

Packet pkt;
BLEScan *scanner;
String bleBucket = "FAR";

class ScanCB : public BLEAdvertisedDeviceCallbacks {
  void onResult(BLEAdvertisedDevice d) {
    if (d.getName() == "CHILD_WEARABLE") {
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

void setup() {
  WiFi.mode(WIFI_STA);
  esp_now_init();
  mmw.begin(256000, SERIAL_8N1, 16, 17);
  BLEDevice::init("");
  scanner = BLEDevice::getScan();
  scanner->setAdvertisedDeviceCallbacks(new ScanCB());
  scanner->setActiveScan(true);
}

void loop() {
  if (mmw.available()) {
    String line = mmw.readStringUntil('\n');
    pkt.zone = parseZone(line);
  }

  scanner->start(1, false);

  pkt.id = 'A';
  strcpy(pkt.ble, bleBucket.c_str());

  esp_now_send(NULL, (uint8_t*)&pkt, sizeof(pkt));
  delay(500);
}
