#include <WiFi.h>
#include <esp_now.h>

typedef struct {
  char id;
  int zone;
  char ble[6];
} Packet;

typedef struct {
  int zoneA;
  int zoneB;
  char bleA[6];
  char bleB[6];
  bool wearable;
} RoomData;

RoomData room;

void onReceive(const uint8_t *mac, const uint8_t *data, int len) {
  Packet *p = (Packet*)data;
  if (p->id == 'A') {
    room.zoneA = p->zone;
    strcpy(room.bleA, p->ble);
  }
}

void setup() {
  WiFi.mode(WIFI_STA);
  esp_now_init();
  esp_now_register_recv_cb(onReceive);
  room.zoneB = 2;
  strcpy(room.bleB, "MID");
  room.wearable = true;
}

void loop() {
  esp_now_send(NULL, (uint8_t*)&room, sizeof(room));
  delay(500);
}
