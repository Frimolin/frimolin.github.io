//Motor 1
const int motorPin1 = 6;
const int motorPin2 = 5;
//Motor 2
const int motorPin3 = 10;
const int motorPin4 = 9;

void setup(){
  //Set pins as outputs
  Serial.begin(9600);
  pinMode(motorPin1, OUTPUT);
  pinMode(motorPin2, OUTPUT);
  pinMode(motorPin3, OUTPUT);
  pinMode(motorPin4, OUTPUT);
  
}
void loop() {
  // put your main code here, to run repeatedly:
  int message=0;

  if (Serial.available() > 0) {
    message = Serial.readString().toInt();
    
    if (message > 0 ) {
      analogWrite(motorPin3, 0);
      analogWrite(motorPin4, message);
    }
    if (message < 0 ) {
      analogWrite(motorPin3, -message);
      analogWrite(motorPin4, 0);
    }
    if (message == 0 ) {
      analogWrite(motorPin3, 0);
      analogWrite(motorPin4, 0);
    }
  }
}
