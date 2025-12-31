#include <WiFi.h>
#include <esp_now.h>

typedef struct {
  int zoneA;
  int zoneB;
  char bleA[6];
  char bleB[6];
  bool wearable;
} RoomData;

RoomData data;

void onReceive(const uint8_t *mac, const uint8_t *incoming, int len) {
  memcpy(&data, incoming, sizeof(data));
}

String fuse(float &c) {
  int n=0,m=0,f=0;
  auto apply=[&](int z,const char*b){
    if(z==1)n+=45;
    if(z==2)m+=45;
    if(z==3)f+=45;
    if(!strcmp(b,"NEAR"))n+=10;
    if(!strcmp(b,"MID"))m+=10;
    if(!strcmp(b,"FAR"))f+=10;
  };
  apply(data.zoneA,data.bleA);
  apply(data.zoneB,data.bleB);
  int t=n+m+f;
  if(n>=m&&n>=f){c=float(n)/t;return"NEAR";}
  if(m>=n&&m>=f){c=float(m)/t;return"MID";}
  c=float(f)/t;return"FAR";
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  esp_now_init();
  esp_now_register_recv_cb(onReceive);
}

void loop() {
  float conf;
  String zone=fuse(conf);
  Serial.println("{");
  Serial.println("\"room\":\"Bedroom\",");
  Serial.print("\"zone\":\"");Serial.print(zone);Serial.println("\",");
  Serial.print("\"confidence\":");Serial.println(conf,2);
  Serial.println("}");
  delay(500);
}
