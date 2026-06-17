#include <WiFi.h>
#include <ArduinoJson.h>
#include <qrcode.h>
//#include <HttpClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

#define OLED_RESET -1

#define debug 0

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

const int qrSquareSize = 2;

const int numPixels = 10;

#include <Adafruit_NeoPixel.h>
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(numPixels, 16, NEO_GRB + NEO_KHZ800);

char ssid[] = "ArduinoPi";
char password[] = "WCSSroom228";

String piServer = "10.191.28.131";

int red = 0;
int green = 0;
int blue = 0;
int drone = 0;
String code = "test1";
JsonDocument doc;

WiFiClient myClient;

unsigned long long lastCheck = 0;
#define checkPeriod 200

unsigned long long lastCodeCheck = 0;
#define codeCheckPeriod 20000



int prevRed = red;
int prevGreen = green;
int prevBlue = blue;

const int dronePin = 17;

boolean makeRequest(String info, bool usePassword, JsonDocument& docOut) {
  docOut.clear();
  myClient.setTimeout(50);
  if (debug >= 2) {
    Serial.println("connecting to Pi: " + String(piServer));
  }
  if (myClient.connect(piServer, 80)) {
    if (debug >= 2) {
      Serial.println("connected to Pi");
    }
    myClient.println("GET " + info + " HTTP/1.1");
    myClient.println("Host: " + piServer);
    if (usePassword == true) {
      if (debug >= 2) {
        Serial.println("using password");
      }
      myClient.println("piname: razPi");
      myClient.println("pikey: 43%");
    }
    myClient.println("Connection: close");
    myClient.println();
    if (debug >= 2) {
      Serial.println("getting request");
    }
    while (myClient.available() == 0) {
      if (debug == 2) {
        Serial.println("getting data");
      }
      delay(100);
    }
    //    Serial.println("dataGot");
    while (myClient.available()) {
      String tempLine = myClient.readStringUntil('\n');
      if (tempLine == "\r" || tempLine == "") {
        break;
      }
    }
    //    Serial.println("SEPERATED");
    String temp = myClient.readString();
    //      Serial.println(temp);
    DeserializationError error = deserializeJson(docOut, temp);
    if (debug >= 3 ) {
      Serial.println("deserialized now!");
    }
    if (error == DeserializationError::Ok) {
      myClient.stop();
      Serial.println("finnished request");
      return true;
    } else {
      if (debug >= 1) {
        Serial.println("connection error! with json");
      }
    }
    myClient.stop();

  }
  if (debug >= 1) {
    Serial.println("Request Failed");
  }
  return false;
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  if (debug >= 0) {
    Serial.println("started Serial");
  }
  WiFi.begin(ssid, password);
  if (debug >= 0) {
    Serial.println("im starting");
  }
  delay(5000);
  bool myConnected = false;
  if (debug >= 0) {
    Serial.println("START");
  }
  while (myConnected == false) {
    WiFi.begin(ssid, password);
    unsigned long long startTimeReconnect = millis();

    while (WiFi.status() != WL_CONNECTED && startTimeReconnect - 5000 >= millis() ) {
      delay(10);
      if (debug >= 0) {
        Serial.println("I am connecting to WiFi");
      }
    }
    if (startTimeReconnect <= millis() - 5000) {
      if (debug >= 0) {
        Serial.println("failed, reconnecting");
      }
      WiFi.disconnect();
    }
  }
  if (debug >= 0) {
    Serial.println("started");
  }
  pixels.begin();
  pinMode(dronePin, OUTPUT);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3c);
}



void loop() {
  while (true) {

    // put your main code here, to run repeatedly:
    if (WiFi.status() == WL_CONNECTED) {
      if (millis() - lastCodeCheck >= codeCheckPeriod) {
        lastCodeCheck = millis();
        makeRequest("/code", true, doc);
        code = String(doc["QR"]);
        if (code != "null") {
          serializeJson(doc, Serial);
          QRCode qrcode;

          uint8_t qrcodeBytes[qrcode_getBufferSize(3)];
          String text = "http://" + piServer + "/c/" + code;
          qrcode_initText(&qrcode, qrcodeBytes, 3, ECC_LOW, text.c_str());

          //print to oled
          display.clearDisplay();
          display.setTextSize(1);
          for (int i = 0; i < qrcode.size; i++) {
            for (int j = 0; j < qrcode.size; j++) {
              Serial.print("i * qrSquareSize");
              Serial.print(i * qrSquareSize);
              Serial.print("j * qrSquareSize");
              Serial.print(j * qrSquareSize);

              display.setCursor(i * qrSquareSize, j * qrSquareSize);
              if (qrcode_getModule(&qrcode, i, j)) {
                if (debug >= 2) {
                  Serial.print("\xE2\x96\x88\xE2\x96\x88"); //white
                }
                display.fillRect(i * qrSquareSize, j * qrSquareSize, qrSquareSize, qrSquareSize, 1);
              } else {
                if (debug >= 2) {
                  Serial.print("\xE2\x96\x91\xE2\x96\x91"); //black
                }
                display.fillRect(i * qrSquareSize, j * qrSquareSize, qrSquareSize, qrSquareSize, 0);
              }
            }
            Serial.println();
          }
          display.display();

        }
      }



      if (millis() - lastCheck >= checkPeriod) {
        lastCheck = millis();
        makeRequest("/info/lights/*", false, doc);
        if (debug >= 3) {
          Serial.println("the light info is");
          serializeJson(doc, Serial);
        }
        red = doc[0]["lightValue"];
        green = doc[1]["lightValue"];
        blue = doc[2]["lightValue"];
        if (prevRed != red || prevBlue != blue || prevGreen != green) {
          prevRed = red;
          prevGreen = green;
          prevBlue = blue;
          for (int i = 0; i < numPixels; i++) {
            pixels.setPixelColor(i, red, green, blue);
          }
        }
        pixels.show();
        if (debug >= 3) {
          Serial.println("The colors are");
          Serial.println(red);
          Serial.println(green);
          Serial.println(blue);
        }
        makeRequest("/info/drone/droneOn/1", false, doc);
        drone = doc[0]["droneOn"];
        if (debug >= 3) {
          Serial.println("drone info");
          serializeJson(doc, Serial);
        }
      }
    } else {
      if (debug >= 0) {
        Serial.println("WiFi connection lost, reconnecting");
      }
      WiFi.disconnect();
      WiFi.begin(ssid, password);
      unsigned long long startTimeReconnect = millis();

      while (WiFi.status() != WL_CONNECTED && startTimeReconnect >= millis() - 5000 && millis() > 1000) {
        delay(100);
        if (debug >= 0) {
          Serial.println("reconnecting...");
        }
      }
    }


    //Turn on Neopixels
    if (prevRed != red || prevBlue != blue || prevGreen != green) {
      prevRed = red;
      prevGreen = green;
      prevBlue = blue;
      for (int i = 0; i < numPixels; i++) {
        pixels.setPixelColor(i, red, green, blue);
      }
    }
    pixels.show();


    //drone
    digitalWrite(dronePin, drone);

















  }
}
