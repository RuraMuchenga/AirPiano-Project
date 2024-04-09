// AirPiano Project 
// By: Ruramai Muchenga 
// MISIS: M00912425

// defining the notes
#define NOTE_C6 1046.50   // Do 
#define NOTE_B5 987.77    // Ti
#define NOTE_A5 880.00    // La
#define NOTE_G5 783.99    // So
#define NOTE_E5 659.26    // Mi
#define NOTE_D5 587.33    // Re
#define NOTE_C5 523.25    // Do

const int trigPin = 13;
const int echoPin = 12;

const int buzzer = 11;
const int led1 = 10;
const int led2 = 9;
const int led3 = 8;

long duration;
double distance;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzer, OUTPUT);
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(led3, OUTPUT);
  digitalWrite(buzzer, LOW);
  digitalWrite(led1, LOW);
  digitalWrite(led2, LOW);
  digitalWrite(led3, LOW);
  Serial.begin(9600);
}


void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;

 
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  if (distance <= 30 && distance > 25) {
    playMelody(led1, NOTE_C5); // Slightly higher frequency
  } else if (distance <= 25 && distance > 20) {
    playMelody(led2, NOTE_D5); // Slightly higher frequency
  } else if (distance <= 20 && distance > 15) {
    playMelody(led3, NOTE_E5); // Slightly higher frequency
  } else if (distance <= 15 && distance > 10) {
    playMelody(led1, NOTE_G5); // Slightly higher frequency
  } else if (distance <= 10 && distance > 5) {
    playMelody(led2, NOTE_A5); // Slightly higher frequency
  } else if (distance <= 5 && distance > 0) {
    playMelody(led3, NOTE_B5); // Slightly higher frequency
  } else {
    
    digitalWrite(led1, LOW);
    digitalWrite(led2, LOW);
    digitalWrite(led3, LOW);
    noTone(buzzer);
  }
  delay(500);
}

void playMelody(int activeLed, int note) {
  // Turn off all LEDs
  digitalWrite(led1, LOW);
  digitalWrite(led2, LOW);
  digitalWrite(led3, LOW);

  // Turn on the active LED
  digitalWrite(activeLed, HIGH);

  // Play the melody based on the active LED
  tone(buzzer, note, 200);
  delay(200); // delay for note duration
  noTone(buzzer);

  digitalWrite(activeLed, LOW);
}
